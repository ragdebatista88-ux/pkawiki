(()=>{
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function nfmt(n,d=0){return Number(n||0).toLocaleString('es-MX',{maximumFractionDigits:d});}
function baseName(n){return String(n||'').replace(/^Shiny\s+/i,'').trim().toLowerCase();}
function prettyBall(n){return String(n||'').replace(/\b\w/g,c=>c.toUpperCase());}
function serverName(v){return ({m:'Moon',s:'Sun',t1:'Titan 1',t2:'Titan 2'})[String(v||'').toLowerCase()]||String(v||'Servidor no registrado');}
function catchBall(v){return ({ab:'AB',eb:'EB',pb:'PB'})[String(v||'').toLowerCase()]||String(v||'').toUpperCase();}
function dateLabel(v){if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return '';return d.toLocaleString('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}
function captureRows(rows,pageName){
 if(!rows?.length)return '<div class="empty">Todavía no hay capturas recientes registradas para esta variante.</div>';
 const sprite=typeof pokemonSprite==='function'?pokemonSprite(pageName):'';
 return `<div class="captureList">${rows.map(r=>{
   const breakdown=Object.entries(r.b||{}).sort((a,b)=>Number(b[1])-Number(a[1]));
   return `<article class="captureRow">
     <div class="captureMon"><span class="captureSprite">${sprite?`<img src="${esc(sprite)}" alt="${esc(pageName)}">`:esc(pageName.slice(0,2).toUpperCase())}</span><div><b>${esc(pageName)}</b><small>${esc(r.p||'Jugador no registrado')}</small></div></div>
     <div class="captureTotal"><small>Total</small><strong>${nfmt(r.t)} Balls</strong>${r.c?`<span class="captureCatch">${esc(catchBall(r.c))}</span>`:''}</div>
     <div class="captureBreakdown"><small>Desglose de Balls</small><div>${breakdown.length?breakdown.map(([name,count])=>`<span class="ballChip"><b>${nfmt(count)}</b> ${esc(prettyBall(name))}</span>`).join(''):'<span class="muted">Sin desglose</span>'}</div></div>
     <div class="captureServer"><span class="serverBadge server-${esc(String(r.w||'unknown').toLowerCase())}">${esc(serverName(r.w))}</span><small>${esc(dateLabel(r.d))}</small></div>
   </article>`;
 }).join('')}</div>`;
}
async function run(){
 const el=document.querySelector('#communityStats');if(!el)return;
 try{
   const [data,recent]=await Promise.all([
     fetch('data/community-stats.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}),
     fetch('data/recent-captures.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()})
   ]);
   const page=document.querySelector('#pokemonName')?.textContent||'';
   const shiny=/^Shiny\s+/i.test(page),mode=shiny?'shiny':'normal',key=baseName(page);
   const e=data.pokemon[key]?.[mode],latest=recent.pokemon[key]?.[mode]||[];
   const s=e?.stats||{},balls=e?.topBalls||[],drops=e?.recentDrops||[];
   const summary=e?`<div class="communityGrid">
     <article class="communityCard"><span class="eyebrow">Captura · ${shiny?'Shiny':'Normal'}</span><h3>Estadísticas registradas</h3>${s.captures!=null?`<div class="communityStatsGrid"><div><small>Capturas</small><b>${nfmt(s.captures)}</b></div><div><small>Media registrada</small><b>${nfmt(s.avgBalls,1)} Balls</b></div><div><small>Mediana</small><b>${nfmt(s.medianBalls,1)}</b></div><div><small>P80</small><b>${nfmt(s.p80Balls)}</b></div><div><small>P95</small><b>${nfmt(s.p95Balls)}</b></div><div><small>Mín. / Máx.</small><b>${nfmt(s.minBalls)} / ${nfmt(s.maxBalls)}</b></div></div>`:'<p>Sin resumen estadístico disponible.</p>'}<p class="calcNote">La <b>media registrada</b> se calcula con capturas de la comunidad. Es distinta de la <b>media de brokes</b> del tier que aparece en los datos principales de la Pokédex.</p></article>
     <article class="communityCard"><span class="eyebrow">Histórico</span><h3>Balls más utilizadas</h3>${balls.length?`<div class="ballBars">${balls.map(b=>`<div><span>${esc(prettyBall(b.name))}</span><b>${nfmt(b.count)}</b></div>`).join('')}</div><small>${nfmt(e.captureRecordsRaw)} capturas históricas procesadas para esta variante.</small>`:'<div class="empty">Sin desglose de Balls.</div>'}</article>
     <article class="communityCard communityDrops"><span class="eyebrow">Drops observados</span><h3>Registros recientes</h3>${drops.length?`<div class="recentDrops">${drops.map(d=>`<div><span>${esc(d.items||'Sin detalle')}</span><small>${d.date?new Date(d.date).toLocaleDateString('es-MX'):''}</small></div>`).join('')}</div>`:'<div class="empty">Sin drops recientes registrados.</div>'}</article>
   </div>`:'<div class="empty">Todavía no hay suficientes registros comunitarios para esta variante.</div>';
   el.innerHTML=`${summary}<section class="latestCaptures"><div class="latestCaptureHead"><div><span class="eyebrow">Actividad reciente</span><h3>Últimas capturas de ${esc(page)}</h3><p>Registros más recientes con total, desglose de Balls y servidor.</p></div><span class="captureCount">${latest.length} recientes</span></div>${captureRows(latest,page)}</section><div class="communityMeta">Última actualización: ${recent.updatedAt?new Date(recent.updatedAt).toLocaleString('es-MX'):(data.updatedAt?new Date(data.updatedAt).toLocaleString('es-MX'):'sin fecha disponible')}. Datos comunitarios; pueden contener registros atípicos.</div>`;
 }catch(err){el.innerHTML='<div class="empty">No fue posible cargar los datos comunitarios en este momento.</div>';}
}
document.addEventListener('DOMContentLoaded',run);
})();
