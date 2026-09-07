const ALLOWED_TYPES = new Set(['correccion','nueva_guia','informacion_faltante','mejora_wiki','otro']);
const json = (body, status=200) => new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean = (value, max) => String(value ?? '').trim().slice(0,max);

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return json({error:'La base de datos no está vinculada.'},500);
    const contentType=request.headers.get('content-type')||'';
    if (!contentType.includes('application/json')) return json({error:'Formato de solicitud no válido.'},415);
    const body=await request.json();
    if (clean(body.website,200)) return json({ok:true}); // honeypot silencioso
    const nombre=clean(body.nombre,60);
    const tipo=clean(body.tipo,40);
    const pagina=clean(body.pagina,100);
    const sugerencia=clean(body.sugerencia,3000);
    if (!ALLOWED_TYPES.has(tipo)) return json({error:'Selecciona un tipo de sugerencia válido.'},400);
    if (sugerencia.length < 10) return json({error:'La sugerencia debe tener al menos 10 caracteres.'},400);
    const result=await env.DB.prepare('INSERT INTO sugerencias (nombre, tipo, pagina, sugerencia) VALUES (?, ?, ?, ?)').bind(nombre||null,tipo,pagina||null,sugerencia).run();
    return json({ok:true,id:result.meta?.last_row_id},201);
  } catch (error) {
    console.error('POST /api/sugerencias',error);
    return json({error:'No fue posible guardar la sugerencia.'},500);
  }
}

export async function onRequestGet({ request, env }) {
  try {
    if (!env.DB) return json({error:'La base de datos no está vinculada.'},500);
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 200, 1), 500);
    // La vista pública no expone el nombre/apodo enviado en el formulario.
    const { results } = await env.DB.prepare(
      'SELECT id, tipo, pagina, sugerencia, estado, fecha_creacion FROM sugerencias ORDER BY id DESC LIMIT ?'
    ).bind(limit).all();
    return json({sugerencias: results || []});
  } catch (error) {
    console.error('GET /api/sugerencias', error);
    return json({error:'No fue posible consultar las sugerencias.'},500);
  }
}
