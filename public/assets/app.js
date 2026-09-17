
const D=window.PKA_DATA||{};
const INTERNAL_LINKS={"https://wiki.pokealliance.com/sistemas/star-machine":"sistema-star.html","https://wiki.pokealliance.com/guias/boost_stone":"boost.html","https://wiki.pokealliance.com/quests/quests-principais":"quest-principales.html","https://wiki.pokealliance.com/sistemas/prey":"prey.html","https://wiki.pokealliance.com/sistemas/arcane-shards-dungeons":"dungeons.html","https://wiki.pokealliance.com/sistemas/treinamento":"sistema-entrenamiento.html","https://wiki.pokealliance.com/sistemas/medal-system":"medallas.html","https://wiki.pokealliance.com/sistemas/linked-tasks":"linked-tasks.html","https://wiki.pokealliance.com/sistemas/hazard-mega-dens":"hazard.html","https://wiki.pokealliance.com/sistemas/talentos":"talentos.html","https://wiki.pokealliance.com/pokemon":"pokedex.html","https://wiki.pokealliance.com/sistemas/helds":"sistema-helds.html","https://wiki.pokealliance.com/sistemas/rockets-semanais":"rocket.html","https://wiki.pokealliance.com/sistemas/gyms-kanto-hoenn":"gyms.html","https://wiki.pokealliance.com/quests/porygon-dr-vektor":"quest-porygon-vektor.html","https://wiki.pokealliance.com/sistemas/twitch-shop":"online-shop.html","https://wiki.pokealliance.com/quests/lucky_amulet":"quest-lucky-amulet.html","https://wiki.pokealliance.com/sistemas/global-buff":"global-buff.html","https://wiki.pokealliance.com/sistemas/clones":"quest-mewtwo-clones.html","https://wiki.pokealliance.com/sistemas/polices-semanais":"police.html","https://wiki.pokealliance.com/sistemas/tasks-do-mundo":"tasks.html","https://wiki.pokealliance.com/guias/comandos-disponiveis":"comandos.html"};
function internalHref(raw){
  const u=String(raw||'');
  const base=u.split('#')[0].replace(/\/$/,'');
  return INTERNAL_LINKS[base]||INTERNAL_LINKS[u]||null;
}

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const clean=s=>String(s??'').trim();
const urlify=s=>{let x=esc(s);return x.replace(/(https?:\/\/[^\s<]+)/g,u=>{const local=internalHref(u);if(local)return `<a href="${local}">Ver en nuestra wiki →</a>`;return `<a href="${u}" target="_blank" rel="noopener">${u.length>42?u.slice(0,39)+'…':u}</a>`})};
const slug=s=>clean(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function nav(){
 const p=location.pathname.split('/').pop()||'index.html',nav=document.querySelector('.navlinks');
 if(!nav)return;
 const groups=[
  ['Pokédex','pokedex.html',[['Pokédex','pokedex.html'],['Megastones','megastones.html'],['Addons / Outfits','addons.html'],['PokéLog','pokelog.html'],['Tier List','tier-list.html'],['Drops','drops.html'],['Brokes y captura','brokes.html'],['Premier vs Alliance','premier-vs-alliance.html']]],
  ['Mundo','localizaciones.html',[['Localizaciones','localizaciones.html'],['Instancias','instancias.html'],['NPCs','npcs.html'],['GYMs','gyms.html'],['Dungeons','dungeons.html'],['Rotaciones','rotaciones.html']]],
  ['Progresión','primeros-pasos.html',[['Primeros pasos','primeros-pasos.html'],['Tasks','tasks.html'],['Linked Tasks','linked-tasks.html'],['Experiencia','sistema-experiencia.html'],['Training Camp','sistema-entrenamiento.html'],['Boost','boost.html'],['Star Ascension','sistema-star.html'],['Talentos','talentos.html'],['Helds','sistema-helds.html']]],
  ['Guías','guias.html',[['Guías','guias.html'],['Guild Bosses','guild-bosses.html'],['Quests','quests.html'],['Moomoo Milk','quest-moomoo-milk.html'],['Lucky Amulet','quest-lucky-amulet.html'],['Mewtwo Clones','quest-mewtwo-clones.html'],['Acceso a Hoenn','quest-hoenn.html'],['Comandos','comandos.html']]],
  ['Herramientas','calculadoras.html',[['Calculadoras','calculadoras.html'],['Calculadora de Stars','calculadora-stars.html'],['Calculadora de daño','calculadora-dano.html'],['Hunt Analyzer','hunt-analyzer.html'],['Mapa desbloqueado','mapa-desbloqueado.html'],['Calendario','calendario.html']]],
  ['Comunidad','changelogs.html',[['Changelogs','changelogs.html'],['Sistemas','sistemas.html'],['Estadísticas','estadisticas-comunidad.html'],['Sugerencias','sugerencias.html'],['FAQ','faq.html'],['Rocket','rocket.html'],['Policía','police.html']]]
 ];
 const belongs=(href,items)=>href===p||items.some(x=>x[1]===p)||((p==='pokemon.html')&&href==='pokedex.html');
 nav.innerHTML=`<a class="navHome ${p==='index.html'?'active':''}" href="index.html">Inicio</a>`+groups.map(([title,href,items],i)=>`<div class="navGroup ${belongs(href,items)?'active':''}"><div class="navGroupTop"><a class="navGroupLink" href="${href}">${title}</a><button class="navDropBtn" type="button" aria-label="Abrir ${title}" aria-expanded="false">▾</button></div><div class="navDropdown">${items.map(([t,h])=>`<a href="${h}" class="${h===p?'active':''}">${t}</a>`).join('')}</div></div>`).join('');
 const closeAll=except=>nav.querySelectorAll('.navGroup.open').forEach(g=>{if(g!==except){g.classList.remove('open');g.querySelector('.navDropBtn')?.setAttribute('aria-expanded','false')}});
 nav.querySelectorAll('.navDropBtn').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const g=btn.closest('.navGroup'),open=!g.classList.contains('open');closeAll(g);g.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))});
 document.addEventListener('click',e=>{if(!nav.contains(e.target))closeAll()});
 const b=document.querySelector('.menuBtn');if(b)b.onclick=()=>nav.classList.toggle('open');
}
function allPokemon(){if(Array.isArray(window.PKA_POKEMON_INDEX)&&window.PKA_POKEMON_INDEX.length)return window.PKA_POKEMON_INDEX;let s=new Set();(D.drops||[]).forEach(x=>s.add(x.Pokémon));(D.localizaciones||[]).forEach(x=>s.add(x.Pokémon));(D.tasks||[]).forEach(x=>s.add(x.Pokémon));(D.tierList||[]).forEach(x=>{let n=x['Pokémon'];if(n)s.add(n)});return [...s].filter(Boolean).sort((a,b)=>a.localeCompare(b))}
function globalSearch(){const input=document.querySelector('#globalSearch');const box=document.querySelector('#searchResults');if(!input||!box)return;const pokes=allPokemon();const cats=[['Addons','addons.html'],['Megastones','megastones.html'],['PokéLog','pokelog.html'],['Drops','drops.html'],['Localizaciones','localizaciones.html'],['Tasks','tasks.html'],['NPCs','npcs.html'],['Dungeons','dungeons.html'],['Gyms','gyms.html'],['Tier List','tier-list.html'],['PokeTalents','talentos.html'],['Sistemas','sistemas.html'],['Calculadoras','calculadoras.html'],['Calculadora de Stars','calculadora-stars.html'],['Estimador de daño','calculadora-dano.html'],['Rocket','rocket.html'],['Policía','police.html'],['FAQ','faq.html'],['Guías','guias.html'],['Guild Bosses','guild-bosses.html'],['Quests','quests.html'],['Lucky Amulet','quest-lucky-amulet.html'],['Dr. Vektor / Porygon','quest-porygon-vektor.html'],['Moomoo Milk','quest-moomoo-milk.html'],['Vernaccio','quest-vernaccio.html'],['Mewtwo Clones','quest-mewtwo-clones.html'],['Acceso a Hoenn','quest-hoenn.html'],['Rotaciones por elemento','rotaciones.html'],['Guild','sistema-guild.html'],['VIP / Premium','sistema-vip.html'],['PokéExpedition','sistema-pokeexpedition.html'],['Entrenamiento','sistema-entrenamiento.html'],['Helds','sistema-helds.html'],['Experiencia y Level','sistema-experiencia.html'],['Star Ascension','sistema-star.html'],['Comandos disponibles','comandos.html'],['Ultra Rare Legendary Mythic','tiers-especiales.html'],['Prey','prey.html'],['Calendario','calendario.html'],['GamePass Battle Pass','gamepass.html'],['Hunt Analyzer','hunt-analyzer.html'],['Mapa desbloqueado','mapa-desbloqueado.html'],['PokéLog','pokelog.html'],['Premier Ball vs Alliance Ball','premier-vs-alliance.html'],['Hunt Stash','hunt-stash.html'],['Achievements','achievements.html'],['Global Buff','global-buff.html'],['NPC Jully TV Cam','npc-jully.html'],['Online Shop','online-shop.html'],['Hazard Mega Dens','hazard.html'],['Rockets Semanales','rocket.html'],['Policías Semanales','police.html'],['GYMs Kanto CDR','gyms.html']];const render=()=>{let q=input.value.trim().toLowerCase();if(!q){box.classList.remove('show');return}let r=pokes.filter(x=>x.toLowerCase().includes(q)).slice(0,8).map(x=>`<a class="searchItem" href="pokemon.html?name=${encodeURIComponent(x)}"><span>${esc(x)}</span><small>Pokémon</small></a>`);r.push(...cats.filter(x=>x[0].toLowerCase().includes(q)).slice(0,4).map(x=>`<a class="searchItem" href="${x[1]}"><span>${x[0]}</span><small>Sección</small></a>`));box.innerHTML=r.length?r.join(''):'<div class="empty">Sin resultados</div>';box.classList.add('show')};input.addEventListener('input',render);input.addEventListener('keydown',e=>{if(e.key==='Enter'){let q=input.value.trim();let hit=pokes.find(x=>x.toLowerCase()===q.toLowerCase())||pokes.find(x=>x.toLowerCase().includes(q.toLowerCase()));if(hit)location.href='pokemon.html?name='+encodeURIComponent(hit)}});document.addEventListener('click',e=>{if(!box.contains(e.target)&&e.target!==input)box.classList.remove('show')})}
function fmt(v){v=clean(v);if(!v)return '—';if(/^https?:\/\//.test(v)){const local=internalHref(v);if(local)return `<a class="linkBtn" href="${esc(local)}">Abrir en nuestra wiki →</a>`;return `<a class="linkBtn" href="${esc(v)}" target="_blank" rel="noopener">Abrir enlace ↗</a>`}if(v.includes('http'))return urlify(v);return esc(v).replace(/\n/g,'<br>')}
function table(container,rows,cols,opt={}){const el=document.querySelector(container);if(!el)return;let page=1,per=opt.per||50,query='';const filtered=()=>rows.filter(r=>!query||cols.some(c=>clean(r[c]).toLowerCase().includes(query)));function draw(keepFocus=false){let data=filtered(),pages=Math.max(1,Math.ceil(data.length/per));if(page>pages)page=pages;let start=(page-1)*per;let view=data.slice(start,start+per);let h=`<div class="toolbar"><input class="tableSearch" placeholder="Buscar en esta sección…"><span class="badge">${data.length.toLocaleString('es-MX')} registros</span></div><div class="tableWrap"><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>`;h+=view.map(r=>'<tr>'+cols.map(c=>`<td>${fmt(r[c])}</td>`).join('')+'</tr>').join('');h+=`</tbody></table><div class="pagination"><button data-prev ${page<=1?'disabled':''}>← Anterior</button><span>${page} / ${pages}</span><button data-next ${page>=pages?'disabled':''}>Siguiente →</button></div></div>`;el.innerHTML=h;const search=el.querySelector('.tableSearch');search.value=query;search.oninput=e=>{query=e.target.value.toLowerCase();page=1;draw(true)};el.querySelector('[data-prev]').onclick=()=>{page--;draw();scrollTo({top:190,behavior:'smooth'})};el.querySelector('[data-next]').onclick=()=>{page++;draw();scrollTo({top:190,behavior:'smooth'})};if(keepFocus){search.focus();const pos=search.value.length;try{search.setSelectionRange(pos,pos)}catch(e){}}}draw()}
function arrayTable(container,rows){if(!rows||!rows.length)return;let max=Math.max(...rows.map(r=>r.length));let heads=rows[0].map((x,i)=>clean(x)||`Col. ${i+1}`);while(heads.length<max)heads.push(`Col. ${heads.length+1}`);let objects=rows.slice(1).map(r=>Object.fromEntries(heads.map((h,i)=>[h,r[i]??''])));table(container,objects,heads,{per:100})}
function home(){const s=window.PKA_STATS||{};document.querySelector('#pokeCount').textContent=(s.pokemon??allPokemon().length).toLocaleString('es-MX');document.querySelector('#dropCount').textContent=(s.drops??(D.drops||[]).length).toLocaleString('es-MX');document.querySelector('#taskCount').textContent=(s.tasks??(D.tasks||[]).length).toLocaleString('es-MX');document.querySelector('#dungeonCount').textContent=(s.dungeons??(D.dungeons||[]).length).toLocaleString('es-MX')}
function pokemonPage(){let name=new URLSearchParams(location.search).get('name')||'Bulbasaur';let d=(D.drops||[]).find(x=>x.Pokémon.toLowerCase()===name.toLowerCase());let loc=(D.localizaciones||[]).find(x=>x.Pokémon.toLowerCase()===name.toLowerCase());let task=(D.tasks||[]).find(x=>x.Pokémon.toLowerCase()===name.toLowerCase());let tier=(D.tierList||[]).find(x=>clean(x['Pokémon']).toLowerCase()===name.toLowerCase());let linked=(D.linkedTasks||[]).filter(x=>clean(x['Pokémon']).toLowerCase()===name.toLowerCase());let medals=(D.medallas||[]).filter(x=>clean(x['Pokémon']).toLowerCase()===name.toLowerCase());let dg=(D.dungeonMobs||[]).filter(x=>[x['Pokémon'],x['Mob 1'],x['Mob 2'],x['Mob 3'],x['Mob 4'],x['Mob 5']].some(v=>clean(v).toLowerCase()===name.toLowerCase()));document.title=`${name} | PKA No Oficial Wiki`;document.querySelector('#pokemonName').textContent=name;document.querySelector('#pokeInitial').textContent=name.replace(/^Shiny /i,'').slice(0,2).toUpperCase();let chunks=[];if(tier)chunks.push(`<div class="kv"><div class="k">Tier</div><div>${fmt(tier['Tier'])}</div></div>`,`<div class="kv"><div class="k">Moveset</div><div>${fmt(tier['Moveset'])}</div></div>`);const brokeByTier={'Mythic':'?','Legendary':'22.535','Ultra Rare':'9.400','Super Rare':'3.500','T1':'1.280','T2':'~900','T3':'~700','T4':'~600','T5':'~400','T6':'~200'};if(/^Shiny /i.test(name)){let bt=tier?clean(tier['Tier']):'';let bv=brokeByTier[bt];chunks.push(`<div class="kv"><div class="k">Media de brokes</div><div>${bv?`${bv} balls <small>(Ultra Ball o Elemental Ball)</small>`:'Sin media comunitaria registrada para este tier.'}</div></div>`);if(['Ultra Rare','Legendary','Mythic'].includes(bt))chunks.push(`<div class="kv"><div class="k">Aparición natural</div><div>Solo en <strong>Áreas Primales compatibles</strong>; no aparece naturalmente en respawn común ni Wildscape. <a href="tiers-especiales.html">Ver regla de tiers especiales</a>.</div></div>`)}else chunks.push(`<div class="kv"><div class="k">Media de brokes</div><div>No aplica: los Pokémon normales no tienen media de brokes.</div></div>`);if(d)chunks.push(`<div class="kv"><div class="k">Drops</div><div class="chiprow">${d.Drops.map(x=>`<span class="pill">${esc(x)}</span>`).join('')||'—'}</div></div>`);document.querySelector('#basicInfo').innerHTML=chunks.join('')||'<div class="empty">No se encontraron datos básicos.</div>';let l=[];if(loc)for(let k of ['Wildscape (Lvl 150+)','Normal','Hoenn (Lvl 250+)'])l.push(`<div class="kv"><div class="k">${k}</div><div>${fmt(loc[k])}</div></div>`);document.querySelector('#locationsInfo').innerHTML=l.join('')||'<div class="empty">Sin localizaciones registradas.</div>';let t=[];if(task)for(let k of ['NPC','Localización','NPC 2','Localización 2','NPC 3','Localización 3'])if(clean(task[k]))t.push(`<div class="kv"><div class="k">${k}</div><div>${fmt(task[k])}</div></div>`);document.querySelector('#tasksInfo').innerHTML=t.join('')||'<div class="empty">Sin task registrada.</div>';if(linked.length)table('#linkedInfo',linked,['Cantidad','Tipo de hunt','Hunt','Kills/h'],{per:20});else document.querySelector('#linkedInfo').innerHTML='<div class="empty">No aparece en Linked Tasks.</div>';if(dg.length)table('#dungeonInfo',dg,['Pokémon','Jugadores','Mobs','XP','Tiempo','Mob 1','Mob 2','Mob 3','XP/h'],{per:20});else document.querySelector('#dungeonInfo').innerHTML='<div class="empty">No aparece en la tabla de dungeons.</div>';if(medals.length)table('#medalInfo',medals,Object.keys(medals[0]).slice(0,5),{per:20});else document.querySelector('#medalInfo').innerHTML='<div class="empty">Sin datos de medallas asociados.</div>'}
function faq(){let rows=D.faq||[],q='';const el=document.querySelector('#faqList');function draw(){let r=rows.filter(x=>!q||(x.Tema+' '+x.Respuesta).toLowerCase().includes(q));el.innerHTML=r.map((x,i)=>`<div class="faqItem"><div class="faqQ"><span>${esc(x.Tema)}</span><span>＋</span></div><div class="faqA">${urlify(x.Respuesta).replace(/\n/g,'<br>')}${x.Tema.toLowerCase()==='cupones'?'<div style="margin-top:12px"><a class="linkBtn" href="cupones.html">Ver página de cupones →</a></div>':''}${x.Tema.toLowerCase()==='pesca'?'<div class="faqSpotVisual"><img src="assets/fishing-spot.png" alt="Ejemplo de un fishing spot"><small>Así se ve un fishing spot en el agua.</small></div>':''}</div></div>`).join('')||'<div class="empty">Sin resultados</div>';el.querySelectorAll('.faqQ').forEach(x=>x.onclick=()=>x.parentElement.classList.toggle('open'))}document.querySelector('#faqSearch').oninput=e=>{q=e.target.value.toLowerCase();draw()};draw()}
function simpleMatrix(){let key=document.body.dataset.matrix;if(key)arrayTable('#matrix',D[key])}

function itemGlyph(item){const x=clean(item).toLowerCase();let g='◆';if(/stone|rock|boulder|earth|fossil/.test(x))g='🪨';else if(/gem|crystal|diamond|pearl|ruby/.test(x))g='💎';else if(/wing|feather|straw/.test(x))g='🪶';else if(/seed|leaf|petal|flower|grass|vine|mushroom/.test(x))g='🌿';else if(/fire|magma|blaze|volcano|flame/.test(x))g='🔥';else if(/water|aqua|fin|shell/.test(x))g='💧';else if(/ice|snow/.test(x))g='❄️';else if(/electric|thunder|screw|magnet|plug/.test(x))g='⚡';else if(/ghost|ectoplasm|dark/.test(x))g='👻';else if(/poison|venom|toxic|bottle/.test(x))g='🧪';else if(/tail|fur|hair|ear|paw|claw|horn|bone|tooth|beak/.test(x))g='🦴';else if(/orb|essence|fragment/.test(x))g='🔮';else if(/badge/.test(x))g='🏅';else if(/ball/.test(x))g='●';return `<span class="itemGlyph" aria-hidden="true">${g}</span>`}
function sourceVisual(source){const s=clean(source);if(!s)return '<span class="sourceGeneric">—</span>';const hit=allPokemon().find(n=>n.toLowerCase()===s.toLowerCase());if(hit)return `<span class="sourcePokemon sourcePokemonTextOnly"><span>${esc(s)}</span></span>`;const icon=/gym/i.test(s)?'🏛️':/drop/i.test(s)?'📦':'✦';return `<span class="sourceGeneric"><span aria-hidden="true">${icon}</span>${esc(s)}</span>`}
function visualPager(el,rows,renderRow,heads,searchFields,per=40){let page=1,q='';const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();function draw(){const filtered=rows.filter(r=>!q||searchFields.some(f=>norm(typeof f==='function'?f(r):r[f]).includes(q)));const pages=Math.max(1,Math.ceil(filtered.length/per));if(page>pages)page=pages;const view=filtered.slice((page-1)*per,page*per);el.innerHTML=`<div class="visualToolbar"><input type="search" placeholder="Buscar en esta sección…" aria-label="Buscar"><span class="visualCount">${filtered.length.toLocaleString('es-MX')} registros</span></div><div class="visualTableWrap"><table class="visualTable"><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${view.map(renderRow).join('')}</tbody></table><div class="visualPager"><button type="button" data-prev ${page<=1?'disabled':''}>← Anterior</button><span>${page} / ${pages}</span><button type="button" data-next ${page>=pages?'disabled':''}>Siguiente →</button></div></div>`;const input=el.querySelector('input');input.value=q;input.oninput=e=>{q=norm(e.target.value);page=1;draw()};el.querySelector('[data-prev]').onclick=()=>{page--;draw()};el.querySelector('[data-next]').onclick=()=>{page++;draw()}}draw()}
function renderDropsVisual(){const el=document.querySelector('#content');if(!el)return;visualPager(el,D.drops||[],r=>`<tr><td><div class="visualPokemon"><img loading="lazy" src="${pokemonSprite(r.Pokémon)}" alt="${esc(r.Pokémon)}" onerror="this.style.visibility='hidden'"><span>${esc(r.Pokémon)}</span></div></td><td><div class="dropChips">${(r.Drops||[]).map(i=>`<span class="dropChip">${itemGlyph(i)}<span>${esc(i)}</span></span>`).join('')||'—'}</div></td></tr>`,['Pokémon','Drops'],['Pokémon',r=>(r.Drops||[]).join(' ')],35)}
function renderTalentsVisual(){
 const el=document.querySelector('#content');if(!el)return;
 const rows=D.talentos||[];let active='all',query='';
 const icons={Character:'👤','Pokémon':'◉',Bug:'🐛',Dark:'🌑',Dragon:'🐉',Electric:'⚡',Fairy:'✨',Fighting:'🥊',Fire:'🔥',Flying:'🪽',Ghost:'👻',Grass:'🌿',Ground:'⛰️',Ice:'❄️',Normal:'⭐',Poison:'🧪',Psychic:'🔮',Rock:'🪨',Steel:'⚙️',Water:'💧'};
 const order=['Character','Pokémon','Bug','Dark','Dragon','Electric','Fairy','Fighting','Fire','Flying','Ghost','Grass','Ground','Ice','Normal','Poison','Psychic','Rock','Steel','Water'];
 const namesES={Character:'Personaje','Pokémon':'Pokémon',Bug:'Bicho',Dark:'Siniestro',Dragon:'Dragón',Electric:'Eléctrico',Fairy:'Hada',Fighting:'Lucha',Fire:'Fuego',Flying:'Volador',Ghost:'Fantasma',Grass:'Planta',Ground:'Tierra',Ice:'Hielo',Normal:'Normal',Poison:'Veneno',Psychic:'Psíquico',Rock:'Roca',Steel:'Acero',Water:'Agua'};
 const namesPT={Character:'Personagem','Pokémon':'Pokémon',Bug:'Inseto',Dark:'Sombrio',Dragon:'Dragão',Electric:'Elétrico',Fairy:'Fada',Fighting:'Lutador',Fire:'Fogo',Flying:'Voador',Ghost:'Fantasma',Grass:'Planta',Ground:'Terrestre',Ice:'Gelo',Normal:'Normal',Poison:'Venenoso',Psychic:'Psíquico',Rock:'Pedra',Steel:'Aço',Water:'Água'};
 const lang=()=>document.documentElement.lang==='pt-BR'?'pt-BR':'es';
 const typeName=t=>(lang()==='pt-BR'?namesPT:namesES)[t]||t;
 function effect(buff){let b=clean(buff);const pt=lang()==='pt-BR';let m;
  if((m=b.match(/Increas(?:e)? all (.+?) Type spells (damage|defense) by (\d+)%\.?/i)))return pt?`Aumenta em ${m[3]}% ${m[2].toLowerCase()==='damage'?'o dano':'a defesa'} dos golpes do tipo ${typeName(m[1])}.`:`Aumenta un ${m[3]}% ${m[2].toLowerCase()==='damage'?'el daño':'la defensa'} de los ataques de tipo ${typeName(m[1])}.`;
  if((m=b.match(/Gives all your Pokémon (\d+)% critical chance/i)))return pt?`Concede ${m[1]}% de chance de crítico a todos os seus Pokémon.`:`Otorga un ${m[1]}% de probabilidad de crítico a todos tus Pokémon.`;
  if(/Accelerates the regeneration of 1 second cooldown/i.test(b))return pt?'Acelera em 1 segundo a recuperação do cooldown dos golpes dos Pokémon guardados na mochila (dentro das Poké Balls).':'Acelera en 1 segundo la recuperación del cooldown de los ataques de los Pokémon guardados en la mochila (dentro de sus Poké Balls).';
  if((m=b.match(/increase of (\d+) hitpoints/i)))return pt?`Aumenta em ${m[1]} pontos a vida máxima do personagem.`:`Aumenta en ${m[1]} puntos la vida máxima del personaje.`;
  if((m=b.match(/more (\d+) speed/i)))return pt?`Concede +${m[1]} de velocidade ao personagem.`:`Otorga +${m[1]} de velocidad al personaje.`;
  if((m=b.match(/underwater by (\d+)%/i)))return pt?`Reduz em ${m[1]}% a penalidade de velocidade ao se mover debaixo d'água.`:`Reduce un ${m[1]}% la penalización de velocidad al moverse bajo el agua.`;
  if((m=b.match(/caused by sand by (\d+)%/i)))return pt?`Reduz em ${m[1]}% a penalidade de velocidade causada pela areia.`:`Reduce un ${m[1]}% la penalización de velocidad causada por la arena.`;
  if((m=b.match(/caused by snow by (\d+)%/i)))return pt?`Reduz em ${m[1]}% a penalidade de velocidade causada pela neve.`:`Reduce un ${m[1]}% la penalización de velocidad causada por la nieve.`;
  if(b==='fsmf')return pt?'Aumenta em 5% a defesa dos golpes do tipo Água.':'Aumenta un 5% la defensa de los ataques de tipo Agua.';
  return b;
 }
 const norm=x=>clean(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function kind(buff){const e=effect(buff).toLowerCase();if(/defensa|defesa/.test(e))return lang()==='pt-BR'?'Defensivo':'Defensivo';if(/daño|dano|crítico|critico/.test(e))return lang()==='pt-BR'?'Ofensivo':'Ofensivo';return lang()==='pt-BR'?'Utilidade':'Utilidad'}
 function levelNum(level){let m=clean(level).match(/#(\d+)/);return m?+m[1]:999}
 function draw(){const pt=lang()==='pt-BR';const types=order.filter(t=>rows.some(r=>r.Tipo===t));let filtered=rows.filter(r=>(active==='all'||r.Tipo===active)&&(!query||norm([r.Objeto,r['Pokémon/Fuente'],r.Tipo,r.Nivel,effect(r.Buff)].join(' ')).includes(query)));
  let html=`<div class="talentControls"><input class="talentSearch" type="search" value="${esc(query)}" placeholder="${pt?'Buscar talento, item, Pokémon ou efeito…':'Buscar talento, objeto, Pokémon o efecto…'}"><div class="talentTabs"><button class="talentTab ${active==='all'?'active':''}" data-type="all">${pt?'Todos':'Todos'}</button>${types.map(t=>`<button class="talentTab ${active===t?'active':''}" data-type="${esc(t)}">${icons[t]||'◆'} ${esc(typeName(t))}</button>`).join('')}</div></div>`;
  if(!filtered.length){el.innerHTML=html+`<div class="talentEmpty">${pt?'Nenhum talento encontrado com esses filtros.':'No se encontraron talentos con esos filtros.'}</div>`;bind();return}
  const visibleTypes=(active==='all'?types:[active]).filter(t=>filtered.some(r=>r.Tipo===t));
  for(const t of visibleTypes){const tr=filtered.filter(r=>r.Tipo===t);const groups={};tr.forEach(r=>(groups[r.Nivel]||(groups[r.Nivel]=[])).push(r));const levels=Object.keys(groups).sort((a,b)=>levelNum(a)-levelNum(b));
   html+=`<section class="talentSection"><div class="talentTypeHead"><span class="talentTypeIcon">${icons[t]||'◆'}</span><div><h2>${esc(typeName(t))}</h2><small>${levels.length} ${pt?'talentos':'talentos'} · ${tr.length} ${pt?'requisitos':'requisitos'}</small></div></div><div class="talentLevelGrid">`;
   for(const lv of levels){const rr=groups[lv],ef=effect(rr[0].Buff),k=kind(rr[0].Buff),def=k==='Defensivo';html+=`<article class="talentLevelCard"><div class="talentLevelTop"><h3>${esc((pt?'Talento ':'Talento ')+lv.replace(/^.*?#/, '#'))}</h3><span class="talentKind">${def?'🛡️':k==='Ofensivo'?'⚔️':'✦'} ${k}</span></div><div class="talentEffect">${esc(ef)}${def&&t!=='Character'&&t!=='Pokémon'?`<span class="talentDefensiveNote">⚠ ${pt?'Em Pokémon de dois elementos: 50% de efetividade.':'En Pokémon de doble elemento: 50 % de efectividad.'}</span>`:''}</div><div class="talentRequirements">${rr.map(r=>`<div class="talentReq"><div class="talentItem">${itemGlyph(r.Objeto)}<strong>${esc(r.Objeto)}</strong></div><div class="talentSource">${sourceVisual(r['Pokémon/Fuente'])}</div><span class="talentQty">×${esc(r.Cantidad||'—')}</span></div>`).join('')}</div></article>`}
   html+='</div></section>';
  }el.innerHTML=html;bind();
 }
 function bind(){const inp=el.querySelector('.talentSearch');if(inp)inp.oninput=e=>{query=norm(e.target.value);draw()};el.querySelectorAll('.talentTab').forEach(b=>b.onclick=()=>{active=b.dataset.type;draw()})}
 draw();
 if(!el.dataset.langListener){el.dataset.langListener='1';document.addEventListener('pka:languagechange',()=>draw())}
}

function pageInit(){nav();globalSearch();let p=document.body.dataset.page;if(p==='home')home();if(p==='pokemon')pokemonPage();if(p==='faq')faq();if(p==='drops')renderDropsVisual();if(p==='locations')table('#content',D.localizaciones,['Pokémon','Wildscape (Lvl 150+)','Normal','Hoenn (Lvl 250+)']);if(p==='tasks')table('#content',D.tasks,['Pokémon','NPC','Localización','NPC 2','Localización 2','NPC 3','Localización 3']);if(p==='linked')table('#content',D.linkedTasks,['Cantidad','Pokémon','Tipo de hunt','Hunt','Kills/h']);if(p==='tier')table('#content',D.tierList,Object.keys(D.tierList[0]||{}).slice(0,6));if(p==='talents')renderTalentsVisual();if(p==='dungeons'){table('#dungeonMain',D.dungeons,['Dungeon','Localización','Hunt 1','Hunt 2','Hunt 3'],{per:100});table('#dungeonMobs',D.dungeonMobs,['Pokémon','Jugadores','Mobs','XP','Tiempo','Mob 1','Mob 2','Mob 3','XP/h']);table('#dungeonItems',D.dungeonItems.map(x=>({'Pokémon':x.Pokémon,'Jugadores':x.Jugadores,'Drops':x.Drops.join(', ')})),['Pokémon','Jugadores','Drops'])}if(p==='gyms')table('#content',(D.gyms||[]).slice(0,8),['Ciudad','Task 1','Task 2','Dungeon'],{per:20});if(p==='hazard')table('#content',D.hazardTasks,['NPC','Localización','Task']);if(p==='rocket')arrayTable('#content',D.rocket);if(p==='police')arrayTable('#content',D.police);if(p==='medals')table('#content',D.medallas,Object.keys(D.medallas[0]||{}).slice(0,9));if(p==='boost')table('#content',D.boost.map(x=>({'Tipo':x.Tipo,'Objetos':x.Objetos.join(', ')})),['Tipo','Objetos'],{per:100});if(p==='porygon'){document.querySelector('#content').innerHTML=D.porygon.map(x=>`<div class="infoPanel"><h3>${esc(x.Sección)}</h3><div class="prose">${urlify(x.Contenido)}</div></div>`).join('')}simpleMatrix()}
document.addEventListener('DOMContentLoaded',pageInit);

/* === Sistema visual dinámico de Pokémon === */
const PKA_TYPES=['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'];
const TYPE_ES={normal:'Normal',fire:'Fuego',water:'Agua',electric:'Eléctrico',grass:'Planta',ice:'Hielo',fighting:'Lucha',poison:'Veneno',ground:'Tierra',flying:'Volador',psychic:'Psíquico',bug:'Bicho',rock:'Roca',ghost:'Fantasma',dragon:'Dragón',dark:'Siniestro',steel:'Acero',fairy:'Hada'};
const MOVESET_TO_TYPE={normal:'normal',fire:'fire',water:'water',electric:'electric',grass:'grass',ice:'ice',fighting:'fighting',poison:'poison',ground:'ground',flying:'flying',psychic:'psychic',bug:'bug',rock:'rock',ghost:'ghost',dragon:'dragon',dark:'dark',steel:'steel',fairy:'fairy'};
function basePokemonName(name){return clean(name).replace(/^Shiny\s+/i,'').replace(/^Mega\s+/i,'').trim()}
function spriteSlug(name){return basePokemonName(name).toLowerCase().replace(/[.’']/g,'').replace(/♀/g,'f').replace(/♂/g,'m').replace(/[^a-z0-9-]+/g,'').replace(/--+/g,'-')}
const PKA_ICON_ALIASES={
  'charmelion':'charmeleon',
  'shiny charmelion':'shiny charmeleon',
  'infarnape':'infernape',
  'shiny infarnape':'shiny infernape',
  'lopuny':'lopunny',
  'shiny lopuny':'shiny lopunny'
};
let _pkaLocalIconIndex=null;
function normalizePokemonIconKey(name){return clean(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.’']/g,'').replace(/♀/g,' f').replace(/♂/g,' m').replace(/[^a-z0-9]+/g,' ').trim()}
function localPokemonSprite(name){
  const icons=window.PKA_POKELOG_ICONS||{};
  const exact=icons[clean(name)];if(exact)return exact;
  if(!_pkaLocalIconIndex){_pkaLocalIconIndex=new Map(Object.entries(icons).map(([k,v])=>[normalizePokemonIconKey(k),v]));}
  let key=normalizePokemonIconKey(name);
  key=PKA_ICON_ALIASES[key]||key;
  return _pkaLocalIconIndex.get(key)||'';
}
function pokemonSprite(name){const local=localPokemonSprite(name);if(local)return local;const shiny=/^Shiny\s+/i.test(clean(name));return `https://play.pokemonshowdown.com/sprites/gen5${shiny?'-shiny':''}/${spriteSlug(name)}.png`}
function imageFallback(img,name){img.onerror=null;img.style.display='none';const p=img.parentElement;if(p){p.classList.add('spriteFallback');p.setAttribute('data-fallback',basePokemonName(name).slice(0,2).toUpperCase())}}
function normalizeType(v){let x=clean(v).toLowerCase().split(/[\s,/+-]+/)[0];return MOVESET_TO_TYPE[x]||'normal'}
function pokemonType(name){let row=(D.tierList||[]).find(x=>clean(x['Pokémon']).toLowerCase()===clean(name).toLowerCase());return normalizeType(row&&row['Moveset'])}
function typeBadge(type,label){type=PKA_TYPES.includes(type)?type:'normal';return `<span class="typeBadge type-${type}">${esc(label||TYPE_ES[type]||type)}</span>`}
function enhanceSearchSprites(){const input=document.querySelector('#globalSearch'),box=document.querySelector('#searchResults');if(!input||!box)return;const obs=new MutationObserver(()=>{box.querySelectorAll('.searchItem').forEach(a=>{if(a.dataset.spriteReady||!a.href.includes('pokemon.html?name='))return;a.dataset.spriteReady='1';let n='';try{n=new URL(a.href,location.href).searchParams.get('name')||''}catch(e){};const span=a.querySelector('span');if(span&&n){const lead=document.createElement('span');lead.className='searchPokeLead';lead.innerHTML=`<img class="searchSprite" loading="lazy" src="${pokemonSprite(n)}" alt="" onerror="this.style.visibility='hidden'">`;lead.append(span.cloneNode(true));span.replaceWith(lead)}})});obs.observe(box,{childList:true,subtree:true})}
function renderDex(){
  const grid=document.querySelector('#pokedexGrid');if(!grid)return;
  const count=document.querySelector('#dexVisualCount'),filter=document.querySelector('#dexFilter');
  const tierFilter=document.querySelector('#dexTierFilter'),typeFilter=document.querySelector('#dexTypeFilter'),shinyFilter=document.querySelector('#dexShinyFilter'),clearBtn=document.querySelector('#dexClearFilters');
  const PER_PAGE=60;
  let page=1,searchTimer=null;
  const tierOrder=['T1','T2','T3','T4','T5','T6','T7','Super Rare','Ultra Rare','Legendary','Mythic'];
  const tierRows=new Map((D.tierList||[]).map(x=>[clean(x['Pokémon']).toLowerCase(),x]));
  // Precalcular metadatos una sola vez evita búsquedas repetidas por cada tarjeta/filtro.
  const pokes=allPokemon().map(name=>{
    const row=tierRows.get(name.toLowerCase());
    return {name,tier:clean(row&&row['Tier']),type:normalizeType(row&&row['Moveset']),shiny:/^Shiny\s+/i.test(name)};
  });
  const knownTiers=[...new Set(pokes.map(x=>x.tier).filter(x=>x&&x!=='?'))];
  knownTiers.sort((a,b)=>{let ai=tierOrder.indexOf(a),bi=tierOrder.indexOf(b);ai=ai<0?999:ai;bi=bi<0?999:bi;return ai-bi||a.localeCompare(b)});
  if(tierFilter&&tierFilter.options.length===1)knownTiers.forEach(v=>tierFilter.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));
  if(typeFilter&&typeFilter.options.length===1)PKA_TYPES.forEach(v=>typeFilter.insertAdjacentHTML('beforeend',`<option value="${v}">${esc(TYPE_ES[v]||v)}</option>`));
  let pager=document.querySelector('#dexPager');
  if(!pager){pager=document.createElement('div');pager.id='dexPager';pager.className='pagination dexPagination';grid.after(pager)}
  const filtered=()=>{
    const q=clean(filter?.value).toLowerCase(),wantedTier=tierFilter?.value||'all',wantedType=typeFilter?.value||'all',wantedShiny=shinyFilter?.value||'all';
    return pokes.filter(x=>(!q||x.name.toLowerCase().includes(q))&&(wantedTier==='all'||x.tier===wantedTier)&&(wantedType==='all'||x.type===wantedType)&&(wantedShiny==='all'||(wantedShiny==='shiny'?x.shiny:!x.shiny)));
  };
  const draw=(resetPage=false)=>{
    if(resetPage)page=1;
    const list=filtered(),pages=Math.max(1,Math.ceil(list.length/PER_PAGE));if(page>pages)page=pages;
    const view=list.slice((page-1)*PER_PAGE,page*PER_PAGE);
    if(count)count.textContent=`${list.length.toLocaleString('es-MX')} Pokémon`;
    grid.innerHTML=view.length?view.map(x=>`<a class="dexCard type-${x.type}" href="pokemon.html?name=${encodeURIComponent(x.name)}"><span class="dexSpriteWrap"><img class="dexSprite" loading="lazy" decoding="async" src="${pokemonSprite(x.name)}" alt="${esc(x.name)}" onerror="imageFallback(this,'${esc(x.name).replace(/'/g,"\\'")}')"></span><span class="dexInfo"><span class="dexName">${esc(x.name)}</span><span class="dexMeta">${typeBadge(x.type)}${x.tier&&x.tier!=='?'?`<span class="dexTier">${esc(x.tier)}</span>`:''}</span></span></a>`).join(''):'<div class="dexEmpty">No hay Pokémon que coincidan con los filtros seleccionados.</div>';
    pager.innerHTML=list.length>PER_PAGE?`<button type="button" data-dex-prev ${page<=1?'disabled':''}>← Anterior</button><span>${page} / ${pages}</span><button type="button" data-dex-next ${page>=pages?'disabled':''}>Siguiente →</button>`:'';
    pager.querySelector('[data-dex-prev]')?.addEventListener('click',()=>{page--;draw();grid.scrollIntoView({behavior:'smooth',block:'start'})});
    pager.querySelector('[data-dex-next]')?.addEventListener('click',()=>{page++;draw();grid.scrollIntoView({behavior:'smooth',block:'start'})});
  };
  window.PKARenderDex=(reset=true)=>draw(reset);
  filter?.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>draw(true),120)});
  [tierFilter,typeFilter,shinyFilter].forEach(el=>el?.addEventListener('change',()=>draw(true)));
  clearBtn?.addEventListener('click',()=>{if(filter)filter.value='';if(tierFilter)tierFilter.value='all';if(typeFilter)typeFilter.value='all';if(shinyFilter)shinyFilter.value='all';draw(true)});
  draw();
}
function enhancePokemonHeader(){if(document.body.dataset.page!=='pokemon')return;const name=new URLSearchParams(location.search).get('name')||'Bulbasaur',avatar=document.querySelector('#pokeInitial'),title=document.querySelector('#pokemonName');const type=pokemonType(name);document.documentElement.style.setProperty('--type-color',`var(--type-${type})`);if(avatar)avatar.innerHTML=`<img src="${pokemonSprite(name)}" alt="${esc(name)}" onerror="this.style.display='none';this.parentElement.textContent='${esc(basePokemonName(name).slice(0,2).toUpperCase())}'">`;if(title&&!title.parentElement.querySelector('.pokemonHeadingMeta')){const meta=document.createElement('div');meta.className='pokemonHeadingMeta';const tier=(D.tierList||[]).find(x=>clean(x['Pokémon']).toLowerCase()===name.toLowerCase());meta.innerHTML=typeBadge(type)+(clean(tier&&tier['Tier'])?`<span class="dexTier">${esc(tier['Tier'])}</span>`:'');title.after(meta)}}
function parseRotationText(text){let t=clean(text),role=(t.match(/\(([^)]+)\)/)||[])[1]||'',stars=(t.match(/(★+)/)||[])[1]||'',tier=(t.match(/—\s*([^—]+)$/)||[])[1]||'';let name=t.replace(/\s*—\s*[^—]+$/,'').replace(/\s*\([^)]+\)/g,'').replace(/\s*★+/g,'').trim();return{name,role,stars,tier}}
function rotationCardHTML(info,upgrade=false){return `<img class="rotationSprite" loading="lazy" src="${pokemonSprite(info.name)}" alt="${esc(info.name)}" onerror="this.style.visibility='hidden'"><span>${upgrade?'<small class="upgradeLabel">Mejora</small>':''}<strong class="rotationPokeName">${esc(info.name)}</strong><span class="rotationMeta">${info.role?`<span class="rotationRole">${esc(info.role)}</span>`:''}${info.stars?`<span class="rotationStars">${esc(info.stars)}</span>`:''}${info.tier?`<span class="rotationTier">${esc(info.tier)}</span>`:''}</span></span>`}
function enhanceRotations(){document.querySelectorAll('.rotSection').forEach(section=>{const id=section.id||'normal';section.dataset.type=id;const label=id==='dark-ghost'?'Dark / Ghost':TYPE_ES[id]||id;const h2=section.querySelector(':scope > h2');if(h2&&!h2.querySelector('.rotTypePill'))h2.insertAdjacentHTML('beforeend',`<span class="rotTypePill">${typeBadge(id==='dark-ghost'?'ghost':id,label)}</span>`);section.querySelectorAll('.roster > div').forEach(card=>{if(card.dataset.visualReady)return;card.dataset.visualReady='1';const info=parseRotationText(card.textContent);card.innerHTML=rotationCardHTML(info)});section.querySelectorAll('.tierTag').forEach(card=>{if(card.dataset.visualReady)return;card.dataset.visualReady='1';const info=parseRotationText(card.textContent);card.innerHTML=rotationCardHTML(info,true)})})}

function enhancePokemonMentions(root=document.querySelector('main')){
  if(!root)return;
  const names=allPokemon().filter(n=>n&&n.length>2).sort((a,b)=>b.length-a.length);
  if(!names.length)return;
  const escaped=names.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const rx=new RegExp('(^|[^A-Za-zÀ-ÿ0-9])('+escaped.join('|')+')(?=$|[^A-Za-zÀ-ÿ0-9])','gi');
  const skip='SCRIPT,STYLE,NOSCRIPT,TEXTAREA,INPUT,SELECT,OPTION,CODE,PRE,.pokeMention,.pokeCell,.visualPokemon,.sourcePokemon,.dexCard,.rotationPokeName,.pokemonHeadingMeta,.tierPokeCell,.taskPokemonChip,.weeklyPoke,.pokemonTitle,.pokeAvatar,.pokelogPokemon,.miniPokeList,.communityRank,.movePokes,.searchPokeLead,.dropQuickHead';
  const canonical=new Map(names.map(n=>[n.toLowerCase(),n]));
  function processNode(node){
    if(node.nodeType===3){
      const parent=node.parentElement;
      if(!parent||parent.closest(skip)||!node.nodeValue||node.nodeValue.trim().length<3)return;
      // Si un enlace a una ficha Pokémon ya contiene su propio sprite, no volvemos a
      // convertir el nombre en una mención con otro icono. Esto protege rankings,
      // favoritos, vistos recientemente y cualquier tarjeta futura con sprite manual.
      const pokemonLink=parent.closest('a[href*=\"pokemon.html?name=\"]');
      if(pokemonLink&&pokemonLink.querySelector('img'))return;
      rx.lastIndex=0;
      if(!rx.test(node.nodeValue))return;
      rx.lastIndex=0;
      const frag=document.createDocumentFragment();
      let last=0,m;
      while((m=rx.exec(node.nodeValue))){
        const prefix=m[1]||'', raw=m[2], start=m.index;
        if(start>last)frag.append(document.createTextNode(node.nodeValue.slice(last,start)));
        if(prefix)frag.append(document.createTextNode(prefix));
        const name=canonical.get(raw.toLowerCase())||raw;
        const span=document.createElement('span');
        span.className='pokeMention';
        span.title=name;
        const img=document.createElement('img');
        img.className='pokeMentionSprite';
        img.loading='lazy';
        img.alt='';
        img.src=pokemonSprite(name);
        img.addEventListener('error',()=>img.remove(),{once:true});
        const label=document.createElement('span');
        label.textContent=raw;
        span.append(img,label);
        frag.append(span);
        last=rx.lastIndex;
      }
      if(last<node.nodeValue.length)frag.append(document.createTextNode(node.nodeValue.slice(last)));
      node.replaceWith(frag);
      return;
    }
    if(node.nodeType!==1||node.matches(skip))return;
    [...node.childNodes].forEach(processNode);
  }
  processNode(root);
}
function watchPokemonMentions(){
  if(document.querySelector('#pokedexGrid')||document.body.dataset.page==='items'||document.body.dataset.page==='moves')return;
  const root=document.querySelector('main');
  if(!root||root.dataset.pokeMentionWatch)return;
  root.dataset.pokeMentionWatch='1';
  enhancePokemonMentions(root);
  const obs=new MutationObserver(muts=>{
    muts.forEach(m=>m.addedNodes.forEach(n=>{
      if(n.nodeType===1)enhancePokemonMentions(n);
      else if(n.nodeType===3&&n.parentElement)enhancePokemonMentions(n.parentElement);
    }));
  });
  obs.observe(root,{childList:true,subtree:true});
}

window.addEventListener('DOMContentLoaded',()=>{enhanceSearchSprites();renderDex();setTimeout(enhancePokemonHeader,0);enhanceRotations();setTimeout(watchPokemonMentions,0)});

/* === UX conectada: navegación, contexto y páginas relacionadas === */
const UX_GROUPS=[
 ['Pokédex',['Pokédex|pokedex.html','Megastones|megastones.html','Addons|addons.html','Tier List|tier-list.html','Drops|drops.html','Brokes y captura|brokes.html']],
 ['Progresión',['Primeros pasos|primeros-pasos.html','Experiencia|sistema-experiencia.html','Entrenamiento|sistema-entrenamiento.html','Boost|boost.html','Star Ascension|sistema-star.html','Talentos|talentos.html','Helds|sistema-helds.html']],
 ['Mundo y actividades',['Localizaciones|localizaciones.html','Instancias|instancias.html','GYMs|gyms.html','Dungeons|dungeons.html','Tasks|tasks.html','Linked Tasks|linked-tasks.html','Rocket|rocket.html','Policía|police.html']],
 ['Herramientas e info',['Calculadoras|calculadoras.html','Rotaciones|rotaciones.html','Hunt Analyzer|hunt-analyzer.html','Guías|guias.html','NPCs|npcs.html','Changelogs|changelogs.html','FAQ|faq.html']]
];
const RELATED={
 'sistema-star.html':['Calculadora de Stars|calculadora-stars.html','Entrenamiento|sistema-entrenamiento.html','Boost|boost.html','Estimador de daño|calculadora-dano.html'],
 'calculadora-stars.html':['Star Ascension|sistema-star.html','Entrenamiento|sistema-entrenamiento.html','Boost|boost.html','Estimador de daño|calculadora-dano.html'],
 'calculadora-dano.html':['Damage de referencia|damage.html','Entrenamiento|sistema-entrenamiento.html','Star Ascension|sistema-star.html','Rotaciones|rotaciones.html'],
 'sistema-entrenamiento.html':['Estimador de daño|calculadora-dano.html','Boost|boost.html','Star Ascension|sistema-star.html','Talentos|talentos.html'],
 'boost.html':['Entrenamiento|sistema-entrenamiento.html','Star Ascension|sistema-star.html','Calculadoras|calculadoras.html','Damage|damage.html'],
 'pokedex.html':['Megastones|megastones.html','Addons|addons.html','Tier List|tier-list.html','Localizaciones|localizaciones.html','Drops|drops.html','Brokes y captura|brokes.html'],
 'localizaciones.html':['Instancias|instancias.html','Pokédex|pokedex.html','Rotaciones|rotaciones.html','Tasks|tasks.html'],
 'tasks.html':['Linked Tasks|linked-tasks.html','NPCs|npcs.html','Localizaciones|localizaciones.html','Pokédex|pokedex.html'],
 'instancias.html':['Localizaciones|localizaciones.html','Rotaciones|rotaciones.html','Pokédex|pokedex.html','Guías|guias.html'],
 'quest-moomoo-milk.html':['Quests|quests.html','Localizaciones|localizaciones.html','Pokédex|pokedex.html','Guías|guias.html'],
 'changelogs.html':['Inicio|index.html','Pokédex|pokedex.html','Sistemas|sistemas.html','Guías|guias.html']
};
function injectExplore(){const header=document.querySelector('.topbar'),nav=document.querySelector('.nav');if(!header||!nav||document.querySelector('.wikiExploreBtn'))return;const btn=document.createElement('button');btn.className='wikiExploreBtn';btn.type='button';btn.textContent='Explorar ▾';const menu=document.createElement('div');menu.className='wikiExplore';menu.hidden=true;menu.innerHTML=`<div class="shell wikiExploreGrid">${UX_GROUPS.map(g=>`<div class="wikiExploreGroup"><h3>${g[0]}</h3>${g[1].map(v=>{let [t,h]=v.split('|');return `<a href="${h}">${t}</a>`}).join('')}</div>`).join('')}</div>`;nav.insertBefore(btn,nav.querySelector('.menuBtn'));header.after(menu);btn.onclick=()=>{menu.hidden=!menu.hidden;btn.classList.toggle('active',!menu.hidden)};document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&e.target!==btn){menu.hidden=true;btn.classList.remove('active')}})}
function injectContext(){const page=location.pathname.split('/').pop()||'index.html';const head=document.querySelector('.pageHead .shell');if(!head)return;let badges=[];if(page==='calculadora-dano.html'||page==='calculadora-stars.html')badges=[['🧮','Estimación','estimate'],['📘','Referencias documentadas','game']];else if(page==='pokemon.html')badges=[['📘','Datos de juego/wiki','game'],['📊','Datos comunitarios separados','community']];else if(['changelogs.html','sistema-star.html','sistema-entrenamiento.html','boost.html','sistema-experiencia.html'].includes(page))badges=[['📘','Información documentada','game']];if(badges.length){const d=document.createElement('div');d.className='contextStrip';d.innerHTML=badges.map(b=>`<span class="contextBadge ${b[2]}">${b[0]} ${b[1]}</span>`).join('');head.appendChild(d)}}
function injectRelated(){const page=location.pathname.split('/').pop()||'index.html';let links=RELATED[page];if(!links||document.querySelector('.relatedBox'))return;const main=document.querySelector('main'),last=[...main.querySelectorAll('.section')].pop();if(!last)return;const box=document.createElement('section');box.className='section';box.innerHTML=`<div class="shell"><div class="relatedBox"><h2>También te puede interesar</h2><p>Continúa con información relacionada sin salir de la wiki.</p><div class="relatedLinks">${links.map(v=>{let[t,h]=v.split('|');return `<a href="${h}">${t} →</a>`}).join('')}</div></div></div>`;last.after(box)}
function enhancePokemonConnections(){if(document.body.dataset.page!=='pokemon')return;const name=new URLSearchParams(location.search).get('name')||'Bulbasaur';const head=document.querySelector('.pageHead .shell');if(head&&!head.querySelector('.pokemonJumpLinks')){const d=document.createElement('div');d.className='pokemonJumpLinks';d.innerHTML=`<a href="localizaciones.html">⌖ Localizaciones</a><span class="dropPreviewWrap"><a class="dropPreviewLink" href="drops.html">◇ Drops</a></span><a href="tier-list.html">▲ Tier List</a><a href="tasks.html">✓ Tasks</a><a href="rotaciones.html">⚔ Rotaciones</a>`;head.appendChild(d);setupPokemonDropPreview(d.querySelector('.dropPreviewWrap'),name)}const main=document.querySelector('main');if(main&&!main.querySelector('.freshness')){const first=main.querySelector('.communitySection .sectionTitle p');if(first)first.insertAdjacentHTML('afterend','<div class="freshness">📊 Los registros comunitarios se muestran separados de las referencias generales para evitar confundir observaciones con valores oficiales.</div>')}}
function setupPokemonDropPreview(wrap,name){if(!wrap)return;const row=(D.drops||[]).find(x=>clean(x.Pokémon).toLowerCase()===clean(name).toLowerCase());const drops=row&&Array.isArray(row.Drops)?row.Drops:[];const MAX=8;const shown=drops.slice(0,MAX);const pop=document.createElement('div');pop.className='dropQuickPreview';pop.setAttribute('role','dialog');pop.setAttribute('aria-label',`Drops de ${name}`);pop.innerHTML=`<div class="dropQuickHead"><img src="${pokemonSprite(name)}" alt="" loading="lazy" decoding="async"><div><small>Vista rápida</small><strong>${esc(name)}</strong></div></div><div class="dropQuickItems">${shown.length?shown.map(i=>`<div class="dropQuickItem">${itemGlyph(i)}<span>${esc(i)}</span></div>`).join(''):'<div class="dropQuickEmpty">No hay drops registrados para este Pokémon.</div>'}</div>${drops.length>MAX?`<div class="dropQuickMore">+${drops.length-MAX} drops más</div>`:''}<a class="dropQuickAll" href="drops.html">Ver todos los drops →</a>`;wrap.appendChild(pop);const link=wrap.querySelector('.dropPreviewLink');let touchOpen=false;link.addEventListener('click',e=>{if(matchMedia('(hover: none)').matches&&!touchOpen){e.preventDefault();touchOpen=true;wrap.classList.add('previewOpen')}});document.addEventListener('click',e=>{if(touchOpen&&!wrap.contains(e.target)){touchOpen=false;wrap.classList.remove('previewOpen')}})}
function uxInit(){injectContext();injectRelated();enhancePokemonConnections()}
window.addEventListener('DOMContentLoaded',()=>setTimeout(uxInit,20));


/* === Centro de búsqueda global (todas las páginas) === */
const SEARCH_TEXT={
 es:{open:'Buscar',placeholder:'Busca Pokémon, NPCs, quests, sistemas…',hint:'Busca en toda la wiki',empty:'No encontramos resultados para',recent:'Accesos rápidos',pokemon:'Pokémon',pages:'Secciones y guías',npcs:'NPCs',close:'Cerrar búsqueda',shortcut:'Ctrl K'},
 'pt-BR':{open:'Buscar',placeholder:'Busque Pokémon, NPCs, quests, sistemas…',hint:'Pesquise em toda a wiki',empty:'Nenhum resultado para',recent:'Acessos rápidos',pokemon:'Pokémon',pages:'Seções e guias',npcs:'NPCs',close:'Fechar busca',shortcut:'Ctrl K'}
};
const normSearch=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const searchLang=()=>document.documentElement.lang==='pt-BR'?'pt-BR':'es';
let globalPageCatalog=null,globalNpcCatalog=null,globalPokemonRelations=null;
function scoreSearch(value,q){
 const v=normSearch(value),n=normSearch(q);if(!n)return 0;if(v===n)return 120;if(v.startsWith(n))return 90;if(v.includes(n))return 60;
 const words=n.split(/\s+/).filter(Boolean);return words.every(w=>v.includes(w))?35:0;
}
function pokemonRelations(name){
 const found=globalPokemonRelations&&globalPokemonRelations[name];
 if(found&&found.length)return found.slice(0,5).map(([label,url])=>[label,url+'?q='+encodeURIComponent(name)]);
 const n=normSearch(name),links=[];
 const has=(rows,key='Pokémon')=>(rows||[]).some(r=>normSearch(r&&r[key])===n);
 if(has(D.localizaciones))links.push(['Localizaciones','localizaciones.html?q='+encodeURIComponent(name)]);
 if(has(D.drops))links.push(['Drops','drops.html?q='+encodeURIComponent(name)]);
 if(has(D.tasks))links.push(['Tasks','tasks.html?q='+encodeURIComponent(name)]);
 if(has(D.tierList))links.push(['Tier','tier-list.html?q='+encodeURIComponent(name)]);
 return links.slice(0,5);
}
async function loadGlobalSearchData(){
 if(!globalPageCatalog){try{globalPageCatalog=await fetch('data/search-pages.json',{cache:'force-cache'}).then(r=>r.ok?r.json():[])}catch(e){globalPageCatalog=[]}}
 if(!globalNpcCatalog){try{globalNpcCatalog=await fetch('data/npcs.json',{cache:'force-cache'}).then(r=>r.ok?r.json():[])}catch(e){globalNpcCatalog=[]}}
 if(!globalPokemonRelations){try{globalPokemonRelations=await fetch('data/search-pokemon-relations.json',{cache:'force-cache'}).then(r=>r.ok?r.json():{})}catch(e){globalPokemonRelations={}}}
}
function injectGlobalSearch(){
 const bar=document.querySelector('.topbar .nav');if(!bar||document.querySelector('.globalSearchTrigger'))return;
 const t=SEARCH_TEXT[searchLang()];
 const trigger=document.createElement('button');trigger.type='button';trigger.className='globalSearchTrigger';trigger.setAttribute('aria-label',t.open);trigger.innerHTML=`<span class="globalSearchTriggerIcon">⌕</span><span class="globalSearchTriggerLabel">${t.open}</span><kbd>${navigator.platform&&/Mac/.test(navigator.platform)?'⌘':'Ctrl'} K</kbd>`;
 const menu=bar.querySelector('.menuBtn');bar.insertBefore(trigger,menu||null);
 const modal=document.createElement('div');modal.className='globalSearchModal';modal.hidden=true;modal.innerHTML=`<div class="globalSearchBackdrop" data-search-close></div><section class="globalSearchPanel" role="dialog" aria-modal="true" aria-label="${t.hint}"><div class="globalSearchInputRow"><span>⌕</span><input id="wikiGlobalSearch" type="search" autocomplete="off" spellcheck="false" placeholder="${t.placeholder}"><button type="button" class="globalSearchClose" data-search-close aria-label="${t.close}">Esc</button></div><div class="globalSearchBody"><div class="globalSearchIntro"><strong>${t.hint}</strong><span>${t.placeholder}</span></div><div id="wikiGlobalResults"></div></div></section>`;
 document.body.appendChild(modal);
 const input=modal.querySelector('#wikiGlobalSearch'),results=modal.querySelector('#wikiGlobalResults');let active=-1;
 const close=()=>{modal.hidden=true;document.body.classList.remove('searchOpen');trigger.focus();active=-1};
 const open=async()=>{modal.hidden=false;document.body.classList.add('searchOpen');input.value='';results.innerHTML='';modal.querySelector('.globalSearchIntro').hidden=false;await loadGlobalSearchData();setTimeout(()=>input.focus(),0)};
 trigger.addEventListener('click',open);modal.querySelectorAll('[data-search-close]').forEach(x=>x.addEventListener('click',close));
 function group(title,items){if(!items.length)return'';return `<section class="globalResultGroup"><h3>${title}<span>${items.length}</span></h3><div class="globalResultList">${items.join('')}</div></section>`}
 function pageItem(r){return `<a class="globalResultItem" href="${esc(r.url)}"><span class="globalResultIcon">${r.category==='Herramientas'?'🧮':r.category==='Guías'?'📖':r.category==='Mundo'?'🗺️':r.category==='Progresión'?'📈':r.category==='Comunidad'?'💬':'📚'}</span><span class="globalResultText"><strong>${esc(r.title)}</strong><small>${esc(r.category||'Wiki')}</small></span><span class="globalResultArrow">→</span></a>`}
 function pokeItem(name){const rel=pokemonRelations(name);return `<div class="globalPokemonResult"><a class="globalResultItem" href="pokemon.html?name=${encodeURIComponent(name)}"><span class="globalResultIcon poke"><img loading="lazy" decoding="async" src="${pokemonSprite(name)}" alt=""></span><span class="globalResultText"><strong>${esc(name)}</strong><small>Ficha Pokémon</small></span><span class="globalResultArrow">→</span></a>${rel.length?`<div class="globalRelatedChips">${rel.map(([label,url])=>`<a href="${url}">${label}</a>`).join('')}</div>`:''}</div>`}
 function npcItem(n){return `<a class="globalResultItem" href="${esc(n.pagina||'npcs.html')}?q=${encodeURIComponent(n.nombre||'')}"><span class="globalResultIcon">👤</span><span class="globalResultText"><strong>${esc(n.nombre||'NPC')}</strong><small>${esc(n.categoria||'NPC')} · ${esc((n.ubicacion||'').slice(0,72))}</small></span><span class="globalResultArrow">→</span></a>`}
 function draw(){
  const q=input.value.trim(),tt=SEARCH_TEXT[searchLang()];modal.querySelector('.globalSearchIntro').hidden=!!q;if(!q){results.innerHTML=group(tt.recent,[pageItem({title:'Pokédex',url:'pokedex.html',category:'Pokédex'}),pageItem({title:'Instancias',url:'instancias.html',category:'Mundo'}),pageItem({title:'Quests',url:'quests.html',category:'Guías'}),pageItem({title:'Calculadoras',url:'calculadoras.html',category:'Herramientas'})]);return}
  const pokes=allPokemon().map(name=>({name,score:Math.max(scoreSearch(name,q),scoreSearch(name.replace(/^Shiny /i,''),q)-4)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).slice(0,7);
  const pages=(globalPageCatalog||[]).map(r=>({...r,score:Math.max(scoreSearch(r.title,q),scoreSearch(r.keywords,q)*.7)})).filter(r=>r.score>0&&r.url!=='pokemon.html').sort((a,b)=>b.score-a.score).slice(0,7);
  const npcs=(globalNpcCatalog||[]).map(r=>({...r,score:Math.max(scoreSearch(r.nombre,q),scoreSearch(`${r.queHace||''} ${r.ubicacion||''} ${r.categoria||''}`,q)*.65)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,5);
  results.innerHTML=group(tt.pokemon,pokes.map(x=>pokeItem(x.name)))+group(tt.pages,pages.map(pageItem))+group(tt.npcs,npcs.map(npcItem));
  if(!results.innerHTML)results.innerHTML=`<div class="globalSearchEmpty">⌕<strong>${tt.empty} “${esc(q)}”</strong><span>${tt.placeholder}</span></div>`;
  active=-1;
 }
 input.addEventListener('input',draw);
 input.addEventListener('keydown',e=>{const links=[...results.querySelectorAll('a.globalResultItem')];if(e.key==='ArrowDown'&&links.length){e.preventDefault();active=(active+1)%links.length;links[active].focus()}else if(e.key==='Escape')close()});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();modal.hidden?open():close()}else if(e.key==='Escape'&&!modal.hidden)close()});
 draw();
}
function applySearchQueryToPage(){
 const q=new URLSearchParams(location.search).get('q');if(!q)return;
 const selectors=['#instanceSearch','#npcSearch','#tierSearch','#addonSearch','#outfitSearch','.tableSearch','.visualToolbar input[type="search"]','input[type="search"]'];
 let tries=0;const apply=()=>{for(const sel of selectors){const input=document.querySelector(sel);if(input&&input.id!=='wikiGlobalSearch'&&input.id!=='globalSearch'){input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));input.scrollIntoView({block:'center'});return}}if(++tries<8)setTimeout(apply,120)};setTimeout(apply,80);
}
window.addEventListener('DOMContentLoaded',()=>{injectGlobalSearch();applySearchQueryToPage()});

/* === UX 2026-09: auditoría de tablas y vistas visuales === */
const FORCE_CARD_TABLES={
 'npc-jully.html':'all','achievements.html':'all','comandos.html':'all','boost.html':'all',
 'brokes.html':[0],'sistema-entrenamiento.html':[0,1],'sistema-experiencia.html':'all',
 'gamepass.html':'all','sistema-vip.html':'all','prey.html':'all','sistema-helds.html':'all',
 'cupones.html':'all'
};
const FORCE_CLASSIC_TABLES={
 'sistema-star.html':'all','star-level.html':'all','premier-vs-alliance.html':'all',
 'gyms.html':'all','quest-principales.html':'all','quest-mewtwo-clones.html':'all',
 'tiers-especiales.html':[1],'hazard.html':[1]
};
function visualTableLang(){return document.documentElement.lang==='pt-BR'?'pt-BR':'es'}
function tableChoice(rule,index){return rule==='all'||(Array.isArray(rule)&&rule.includes(index))}
function tableColumnCount(table){const h=table.querySelectorAll('thead th').length,b=[...table.querySelectorAll('tbody tr')].map(r=>r.children.length);return Math.max(h,...b,0)}
function tableHeaders(table,cols){const raw=[...table.querySelectorAll('thead th')].map(x=>clean(x.textContent)),fb=['Nombre','Detalle','Información','Valor','Dato'];return Array.from({length:cols},(_,i)=>raw[i]||fb[i]||`Dato ${i+1}`)}
function addCardSearch(table,rows,lang){
 if(rows.length<10||table.previousElementSibling?.classList?.contains('cardTableSearch'))return;
 const box=document.createElement('div');box.className='cardTableSearch';
 box.innerHTML=`<span>⌕</span><input type="search" placeholder="${lang==='pt-BR'?'Buscar nesta seção…':'Buscar en esta sección…'}"><small>${rows.length}</small>`;
 const input=box.querySelector('input'),count=box.querySelector('small');
 input.oninput=()=>{const q=clean(input.value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let n=0;rows.forEach(r=>{const s=clean(r.textContent).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),show=!q||s.includes(q);r.hidden=!show;if(show)n++});count.textContent=n};
 table.parentNode.insertBefore(box,table);
}
function enhanceVisualTables(){
 const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const tables=[...document.querySelectorAll('main table,.container table,article table')].filter(t=>!t.closest('.globalSearchModal')&&!t.classList.contains('noVisualCards')&&!t.dataset.visualAudited);
 if(!tables.length)return;
 const lang=visualTableLang(),tx=lang==='pt-BR'?{title:'Visualização do conteúdo',desc:'Cartões para catálogos; tabelas quando comparar colunas é mais útil.',cards:'Cartões',table:'Tabela'}:{title:'Vista del contenido',desc:'Tarjetas para catálogos; tablas cuando comparar columnas es más útil.',cards:'Tarjetas',table:'Tabla'};
 let visual=0,classic=0;
 tables.forEach((table,index)=>{
   table.dataset.visualAudited='1';const rows=[...table.querySelectorAll('tbody tr')];if(!rows.length)return;
   const cols=tableColumnCount(table),headers=tableHeaders(table,cols);
   const useCards=tableChoice(FORCE_CARD_TABLES[page],index)||(!tableChoice(FORCE_CLASSIC_TABLES[page],index)&&cols<=2);
   if(!useCards){table.classList.add('wikiKeepTable');classic++;return}
   visual++;table.classList.add('wikiCardTable');if(cols===2&&rows.length<=8)table.classList.add('wikiStatTable');if(page==='npc-jully.html')table.classList.add('jullyCatalogTable');
   rows.forEach(r=>[...r.children].forEach((c,i)=>{if(c.tagName==='TD')c.dataset.label=headers[i]||`Dato ${i+1}`}));
   addCardSearch(table,rows,lang);
 });
 // Jully y catálogos puros no vuelven accidentalmente a vista Excel.
 if(visual&&classic&&page!=='npc-jully.html'&&!document.querySelector('.visualTableTools')){
   const first=document.querySelector('table.wikiCardTable');if(!first)return;
   if(localStorage.getItem(`pka-table-view:${page}`)==='classic')document.body.classList.add('tableClassic');
   const tools=document.createElement('div');tools.className='visualTableTools';tools.innerHTML=`<div class="visualTableToolsText"><strong>${tx.title}</strong><span>${tx.desc}</span></div><button class="visualTableToggle" type="button"><span class="toggleIcon">▦</span><span class="toggleLabel"></span></button>`;
   const b=tools.querySelector('button'),l=tools.querySelector('.toggleLabel'),i=tools.querySelector('.toggleIcon');
   const sync=()=>{const c=document.body.classList.contains('tableClassic');l.textContent=c?tx.cards:tx.table;i.textContent=c?'▦':'☷'};
   b.onclick=()=>{document.body.classList.toggle('tableClassic');localStorage.setItem(`pka-table-view:${page}`,document.body.classList.contains('tableClassic')?'classic':'cards');sync()};sync();first.parentNode.insertBefore(tools,first);
 }
}
window.addEventListener('DOMContentLoaded',()=>{setTimeout(enhanceVisualTables,120);setTimeout(enhanceVisualTables,500)});

