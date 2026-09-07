const STATUSES = new Set(['pendiente','revision','aceptada','implementada','descartada']);
const json = (body, status=200) => new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});

function authorized(request, env) {
  const expected = String(env.ADMIN_KEY || '');
  if (!expected) return false;
  const auth=request.headers.get('authorization')||'';
  if (!auth.startsWith('Bearer ')) return false;
  const supplied=auth.slice(7);
  if (supplied.length !== expected.length) return false;
  let diff=0;
  for (let i=0;i<expected.length;i++) diff |= expected.charCodeAt(i)^supplied.charCodeAt(i);
  return diff===0;
}

export async function onRequestGet({request,env}) {
  if (!env.ADMIN_KEY) return json({error:'Falta configurar ADMIN_KEY en Cloudflare.'},503);
  if (!authorized(request,env)) return json({error:'No autorizado.'},401);
  if (!env.DB) return json({error:'La base de datos no está vinculada.'},500);
  try {
    const url=new URL(request.url);
    const limit=Math.min(Math.max(Number(url.searchParams.get('limit'))||100,1),500);
    const {results}=await env.DB.prepare('SELECT id, nombre, tipo, pagina, sugerencia, estado, fecha_creacion FROM sugerencias ORDER BY id DESC LIMIT ?').bind(limit).all();
    return json({sugerencias:results||[]});
  } catch(error) {
    console.error('GET /api/admin/sugerencias',error);
    return json({error:'No fue posible consultar las sugerencias.'},500);
  }
}

export async function onRequestPatch({request,env}) {
  if (!env.ADMIN_KEY) return json({error:'Falta configurar ADMIN_KEY en Cloudflare.'},503);
  if (!authorized(request,env)) return json({error:'No autorizado.'},401);
  if (!env.DB) return json({error:'La base de datos no está vinculada.'},500);
  try {
    const body=await request.json();
    const id=Number(body.id), estado=String(body.estado||'');
    if (!Number.isInteger(id)||id<1) return json({error:'ID no válido.'},400);
    if (!STATUSES.has(estado)) return json({error:'Estado no válido.'},400);
    const result=await env.DB.prepare('UPDATE sugerencias SET estado = ? WHERE id = ?').bind(estado,id).run();
    if (!result.meta?.changes) return json({error:'La sugerencia no existe.'},404);
    return json({ok:true});
  } catch(error) {
    console.error('PATCH /api/admin/sugerencias',error);
    return json({error:'No fue posible actualizar la sugerencia.'},500);
  }
}
