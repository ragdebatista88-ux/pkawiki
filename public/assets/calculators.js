(()=>{
const D=window.PKA_DATA||{};
const STAR={
 'T3':{base:4,pct:2},'T2':{base:6,pct:4},'T1':{base:12,pct:6},
 'Super Rare':{base:16,pct:8},'Ultra Rare':{base:24,pct:10},'Legendary':{base:48,pct:15}
};
const PAY={money:{name:'Más Gold',dd:.5,kk:.5,icon:'💰'},mixed:{name:'Equilibrada',dd:.75,kk:.375,icon:'⚖️'},diamond:{name:'Más DD',dd:1,kk:.25,icon:'💎'}};
const tierAliases={'SR':'Super Rare','UR':'Ultra Rare'};
const fmt=n=>Number(n).toLocaleString('es-MX',{maximumFractionDigits:2});
const tierRows=()=> (D.tierList||[]).map(x=>({name:String(x['Pokémon']||'').trim(),tier:tierAliases[x.Tier]||x.Tier})).filter(x=>x.name&&STAR[x.tier]);
function starCost(tier,from,to,pay){
 const cfg=STAR[tier],p=PAY[pay];let dd=0,kk=0,steps=[];
 // Para llegar a una Star objetivo hay que construir todo el árbol de material.
 // Ejemplo 0★→5★: 16 fusiones 0→1, 8 de 1→2, 4 de 2→3, 2 de 3→4 y 1 de 4→5.
 // Si ya tienes un Pokémon con Stars, su subárbol ya está pagado y se descuenta del total.
 for(let s=0;s<to;s++){
   const fullTarget=Math.pow(2,to-s-1);
   const alreadyBuilt=s<from?Math.pow(2,from-s-1):0;
   const qty=fullTarget-alreadyBuilt;
   if(qty<=0)continue;
   const stepBase=cfg.base*(s+1);
   const unitDd=Math.round(stepBase*p.dd);
   const unitKk=stepBase*p.kk;
   const subDd=unitDd*qty,subKk=unitKk*qty;
   dd+=subDd;kk+=subKk;
   steps.push({from:s,to:s+1,qty,unitDd,unitKk,dd:subDd,kk:subKk});
 }
 const pokes=Math.pow(2,to)-Math.pow(2,from);
 const fusions=steps.reduce((n,x)=>n+x.qty,0);
 return {dd,kk,steps,pokes,fusions};
}
function initStar(){const el=document.querySelector('#starCalculator');if(!el)return;const pokes=tierRows();el.innerHTML=`<div class="calcLayout"><section class="calcPanel"><div class="calcPanelHead"><span class="calcStep">1</span><div><h2>Configura la ascensión</h2><p>Busca un Pokémon o selecciona el tier directamente.</p></div></div><label class="calcField">Pokémon <input id="scPoke" list="scPokes" placeholder="Ej. Shiny Venusaur"><datalist id="scPokes">${pokes.map(x=>`<option value="${x.name}">${x.tier}</option>`).join('')}</datalist></label><label class="calcField">Tier <select id="scTier">${Object.keys(STAR).map(t=>`<option>${t}</option>`).join('')}</select></label><div class="calcTwo"><label class="calcField">Star actual <select id="scFrom">${[0,1,2,3,4].map(n=>`<option value="${n}">${n}★</option>`).join('')}</select></label><label class="calcField">Star objetivo <select id="scTo">${[1,2,3,4,5].map(n=>`<option value="${n}">${n}★</option>`).join('')}</select></label></div><div class="calcField"><span>Forma de pago</span><div class="payChoices">${Object.entries(PAY).map(([k,v])=>`<button type="button" data-pay="${k}" class="payChoice ${k==='mixed'?'active':''}"><span>${v.icon}</span><b>${v.name}</b><small>${k==='money'?'Menos DD / más Gold':k==='diamond'?'Más DD / menos Gold':'Balance entre ambos'}</small></button>`).join('')}</div></div></section><section class="calcPanel calcResult" id="scResult"></section></div><div class="calcReference"><h2>Referencia base por paso</h2><p>El costo de cada paso aumenta según la Star que vas a obtener. Las modalidades de pago se calculan a partir del DD base del tier.</p><div class="guideTable"><table><thead><tr><th>Tier</th><th>0→1★</th><th>1→2★</th><th>2→3★</th><th>3→4★</th><th>4→5★</th></tr></thead><tbody>${Object.entries(STAR).map(([t,c])=>`<tr><td><b>${t}</b></td>${[1,2,3,4,5].map(s=>`<td>${c.base*s} DD</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
let pay='mixed';const poke=el.querySelector('#scPoke'),tier=el.querySelector('#scTier'),from=el.querySelector('#scFrom'),to=el.querySelector('#scTo');function syncPoke(){const hit=pokes.find(x=>x.name.toLowerCase()===poke.value.trim().toLowerCase());if(hit)tier.value=hit.tier;draw();}function draw(){let a=+from.value,b=+to.value;if(b<=a){b=Math.min(5,a+1);to.value=b;}const r=starCost(tier.value,a,b,pay),pct=STAR[tier.value].pct*(b-a);el.querySelector('#scResult').innerHTML=`<span class="eyebrow">Resumen</span><h2>${a}★ → ${b}★ · ${tier.value}</h2><div class="resultBig"><div><small>DD total</small><strong>💎 ${fmt(r.dd)}</strong></div><div><small>Gold total</small><strong>💰 $${fmt(r.kk)}kk</strong></div><div><small>Pokémon base adicionales</small><strong>◫ ${fmt(r.pokes)}</strong></div></div><div class="starSteps">${r.steps.map(x=>`<div><span>${x.from}★ → ${x.to}★ <small>× ${x.qty} fusión${x.qty===1?'':'es'}</small></span><b>${fmt(x.dd)} DD + $${fmt(x.kk)}kk</b><small>${x.qty} × (${fmt(x.unitDd)} DD + $${fmt(x.unitKk)}kk)</small></div>`).join('')}</div><div class="calcBonus"><span>Bono ganado en este tramo</span><b>+${pct}% de daño</b><small>${STAR[tier.value].pct}% por Star para ${tier.value}.</small></div><p class="calcNote"><b>${fmt(r.fusions)} fusiones en total.</b> Para subir una Star se necesitan 2 Pokémon de la misma Star. Por eso el costo incluye también las fusiones necesarias para preparar los Pokémon que se consumen. Ejemplo: 0★ → 5★ requiere 16, 8, 4, 2 y 1 fusiones por nivel. Esto incluye construir desde cero los Pokémon que se consumen en las Stars superiores.</p>`;}
poke.addEventListener('change',syncPoke);poke.addEventListener('input',()=>{const hit=pokes.find(x=>x.name.toLowerCase()===poke.value.trim().toLowerCase());if(hit)tier.value=hit.tier;draw();});[tier,from,to].forEach(x=>x.addEventListener('change',draw));el.querySelectorAll('[data-pay]').forEach(b=>b.onclick=()=>{pay=b.dataset.pay;el.querySelectorAll('[data-pay]').forEach(x=>x.classList.toggle('active',x===b));draw();});draw();}
const DMG={
 'DPS Finalizador':{'T3':40000,'T2':50000},
 'DPS HardCC':{'T3':35000,'T2':45000,'T1':54000,'Super Rare':60000,'Ultra Rare':70000,'Legendary':80000,'Mythic':90000},
 'Off Tank':{'T3':30000,'T2':40000,'T1':50000,'Super Rare':55000,'Ultra Rare':65000,'Legendary':75000,'Mythic':80000},
 'Tanker':{'T3':30000,'T2':30000,'T1':32000,'Super Rare':32000,'Ultra Rare':34000,'Legendary':35000,'Mythic':35000}
};
const STAR_PCT={'T3':2,'T2':4,'T1':6,'Super Rare':8,'Ultra Rare':10,'Legendary':15,'Mythic':0};
const TRAINING={
 attack:{label:'Attack Training',icon:'⚔️',gain:.1,unit:'% daño'},
 defense:{label:'Defense Training',icon:'🛡️',gain:.05,unit:'% defensa'},
 hp:{label:'HP Training',icon:'❤️',gain:.1,unit:'% vida'},
 critDamage:{label:'Critical Damage',icon:'💥',gain:.1,unit:'% daño crítico'},
 critChance:{label:'Critical Chance',icon:'🎯',gain:.1,unit:'pp crítico'},
 critResist:{label:'Critical Resistance',icon:'🔰',gain:.1,unit:'pp resistencia'},
 precision:{label:'Precision Training',icon:'👁️',gain:.2,unit:'pp precisión'},
 evasion:{label:'Evasion Training',icon:'💨',gain:.2,unit:'pp evasión'}
};
const newDamageSlot=()=>({poke:'',tier:'T1',role:'DPS HardCC',stars:0,boost:0,buff:0,training:{attack:0,defense:0,hp:0,critDamage:0,critChance:0,critResist:0,precision:0,evasion:0}});
function initDamage(){
 const el=document.querySelector('#damageCalculator');if(!el)return;
 const pokes=(D.tierList||[]).map(x=>({name:String(x.Pokémon||'').trim(),tier:tierAliases[x.Tier]||x.Tier})).filter(x=>x.name);
 let slots=[0,1,2].map(()=>newDamageSlot());
 function trainingPanel(s){
  const t=s.training||newDamageSlot().training;
  const active=Object.values(t).filter(Number).length;
  return `<details class="trainingConfig"><summary><span><b>🏋️ Training</b><small>${active?`${active} atributo${active===1?'':'s'} configurado${active===1?'':'s'}`:'Configurar entrenamientos del Pokémon'}</small></span><span class="trainingChevron">⌄</span></summary><div class="trainingIntro"><p>Ingresa el <b>nivel de Training</b> de cada atributo. Los bonos se calculan con los valores documentados en la wiki.</p><button type="button" class="clearTraining">Limpiar Training</button></div><div class="trainingGrid">${Object.entries(TRAINING).map(([k,c])=>`<label class="trainingItem"><span class="trainingIcon">${c.icon}</span><span class="trainingText"><b>${c.label}</b><small>+${c.gain}${c.unit.includes('pp')?'':'%'} por nivel</small></span><input data-training="${k}" type="number" min="0" max="1000" step="1" value="${t[k]||0}" aria-label="Nivel de ${c.label}"></label>`).join('')}</div><div class="trainingLive" data-training-summary></div></details>`;
 }
 function row(s,i){
  return `<div class="rotationRow" data-i="${i}"><div class="rotationPoke"><span class="slotNo">${i+1}</span><label>Pokémon<input data-k="poke" list="dcPokes" placeholder="Buscar Pokémon" value="${s.poke}"></label></div><label>Tier<select data-k="tier">${['T3','T2','T1','Super Rare','Ultra Rare','Legendary','Mythic'].map(t=>`<option ${t===s.tier?'selected':''}>${t}</option>`).join('')}</select></label><label>Rol<select data-k="role">${Object.keys(DMG).map(r=>`<option ${r===s.role?'selected':''}>${r}</option>`).join('')}</select></label><label>Stars<select data-k="stars">${[0,1,2,3,4,5].map(n=>`<option value="${n}" ${n===s.stars?'selected':''}>${n}★</option>`).join('')}</select></label><label>Boost<input data-k="boost" type="number" min="0" max="50" value="${s.boost}"></label><label>Buff %<input data-k="buff" type="number" min="0" max="500" step="1" value="${s.buff}"></label><button class="removeSlot" type="button" title="Quitar">×</button><div class="rowEstimate" data-est></div>${trainingPanel(s)}</div>`;
 }
 function trainingBonuses(s){const t=s.training||{};return {attack:(+t.attack||0)*.1,defense:(+t.defense||0)*.05,hp:(+t.hp||0)*.1,critDamage:(+t.critDamage||0)*.1,critChance:(+t.critChance||0)*.1,critResist:(+t.critResist||0)*.1,precision:(+t.precision||0)*.2,evasion:(+t.evasion||0)*.2};}
 function estimate(s){const base=(DMG[s.role]||{})[s.tier];if(!base)return null;const star=1+((STAR_PCT[s.tier]||0)*s.stars)/100;const boost=(150+3*s.boost)/150;const buff=1+s.buff/100;const tr=trainingBonuses(s);const attack=1+tr.attack/100;return {base,value:base*star*boost*buff*attack,star,boost,buff,training:tr,attack};}
 function render(){
  el.innerHTML=`<datalist id="dcPokes">${pokes.map(x=>`<option value="${x.name}">${x.tier}</option>`).join('')}</datalist><div class="damageTop"><div><span class="eyebrow">Rotación</span><h2>Tu equipo</h2><p>Agrega hasta 6 Pokémon. Configura Stars, Boost, buffs y los ocho atributos de Training sin saturar la vista.</p></div><button class="linkBtn" id="addSlot" ${slots.length>=6?'disabled':''}>+ Agregar Pokémon</button></div><div class="trainingLegend"><div><span>🏋️</span><div><b>Training por Pokémon</b><small>Abre la sección Training dentro de cada Pokémon para poner sus niveles. Attack sí entra directamente en el DPS; el resto se usa o se muestra según exista una fórmula segura.</small></div></div><a href="sistema-entrenamiento.html">Ver sistema de entrenamiento →</a></div><div id="rotationRows">${slots.map(row).join('')}</div><section class="calcPanel damageSummary" id="damageSummary"></section><div class="calcMethod"><h3>Cómo se estima</h3><p><b>DPS base:</b> tabla comunitaria de daño al nivel 150 sin bonus de Attack, según rol y tier.</p><p><b>Stars:</b> se aplica el porcentaje por Star del tier. <b>Boost:</b> como la guía indica que +1 Boost cuenta como 3 niveles para el daño de magias, se aproxima el aumento de nivel de forma lineal contra la referencia de nivel 150. Esta parte no es una fórmula oficial.</p><p><b>Training:</b> Attack suma +0.1% de daño por nivel y sí se incluye en el DPS. Defense (+0.05%/nivel) y HP (+0.1%/nivel) se consideran en la recomendación de aguante. Critical Damage, Critical Chance, Critical Resistance, Precision y Evasion muestran su bono, pero no alteran el DPS/aguante mientras falten valores base y una fórmula confirmada.</p><p><b>Buff %:</b> campo adicional para Global Buff, consumibles u otros bonos porcentuales. El resultado sirve para comparar configuraciones, no como daño exacto dentro del juego.</p></div>`;
  wire();update();
 }
 function wire(){
  el.querySelector('#addSlot').onclick=()=>{if(slots.length<6){slots.push(newDamageSlot());render();}};
  el.querySelectorAll('.rotationRow').forEach(r=>{
   const i=+r.dataset.i;
   r.querySelectorAll('[data-k]').forEach(inp=>{const ev=inp.tagName==='SELECT'?'change':'input';inp.addEventListener(ev,()=>{let k=inp.dataset.k,v=inp.value;if(['stars','boost','buff'].includes(k))v=Math.max(0,+v||0);slots[i][k]=v;if(k==='poke'){const hit=pokes.find(x=>x.name.toLowerCase()===String(v).trim().toLowerCase());if(hit&&['T3','T2','T1','Super Rare','Ultra Rare','Legendary','Mythic'].includes(hit.tier)){slots[i].tier=hit.tier;const ts=r.querySelector('[data-k="tier"]');if(ts)ts.value=hit.tier;}}update();});});
   r.querySelectorAll('[data-training]').forEach(inp=>inp.addEventListener('input',()=>{slots[i].training[inp.dataset.training]=Math.max(0,+inp.value||0);update();}));
   const clear=r.querySelector('.clearTraining');if(clear)clear.onclick=()=>{slots[i].training={...newDamageSlot().training};r.querySelectorAll('[data-training]').forEach(inp=>inp.value=0);update();};
   r.querySelector('.removeSlot').onclick=()=>{slots.splice(i,1);if(!slots.length)slots.push(newDamageSlot());render();};
  });
 }
 function durabilityScore(s){
  const roleBase={'Tanker':1.35,'Off Tank':1.18,'DPS HardCC':1.0,'DPS Finalizador':.92}[s.role]||1;
  const tierBase={'T3':1,'T2':1.03,'T1':1.06,'Super Rare':1.09,'Ultra Rare':1.12,'Legendary':1.16,'Mythic':1.18}[s.tier]||1;
  const reduction=Math.min(.9,((STAR_PCT[s.tier]||0)*s.stars)/100);
  const tr=trainingBonuses(s),hp=1+tr.hp/100,def=1+tr.defense/100;
  return roleBase*tierBase*hp*def/(1-reduction);
 }
 function trainingSummary(s){
  const t=trainingBonuses(s),parts=[];
  if(t.attack)parts.push(`⚔️ +${fmt(t.attack)}% daño`);if(t.defense)parts.push(`🛡️ +${fmt(t.defense)}% defensa`);if(t.hp)parts.push(`❤️ +${fmt(t.hp)}% HP`);if(t.critDamage)parts.push(`💥 +${fmt(t.critDamage)}% daño crítico`);if(t.critChance)parts.push(`🎯 +${fmt(t.critChance)} pp crítico`);if(t.critResist)parts.push(`🔰 +${fmt(t.critResist)} pp res. crítica`);if(t.precision)parts.push(`👁️ +${fmt(t.precision)} pp precisión`);if(t.evasion)parts.push(`💨 +${fmt(t.evasion)} pp evasión`);
  return parts.length?parts.map(x=>`<span>${x}</span>`).join(''):'<small>Sin Training configurado.</small>';
 }
 function update(){
  let total=0,valid=0,candidates=[];
  el.querySelectorAll('.rotationRow').forEach((r,i)=>{const e=estimate(slots[i]),box=r.querySelector('[data-est]');if(e){total+=e.value;valid++;box.innerHTML=`<small>DPS estimado</small><b>${Math.round(e.value).toLocaleString('es-MX')}</b><span>base ${e.base.toLocaleString('es-MX')}</span>${e.training.attack?`<em>Attack Training +${fmt(e.training.attack)}%</em>`:''}`;}else box.innerHTML='<small>Sin referencia</small><b>—</b><span>Ese rol/tier no tiene DPS base registrado.</span>';const ts=r.querySelector('[data-training-summary]');if(ts)ts.innerHTML=trainingSummary(slots[i]);if(slots[i].poke.trim())candidates.push({i,s:slots[i],score:durabilityScore(slots[i]),training:trainingBonuses(slots[i])});});
  candidates.sort((a,b)=>b.score-a.score);const best=candidates[0];
  const lure=best?`<div class="lureRecommendation"><div class="lureIcon">🛡️</div><div><span class="eyebrow">Recomendación para atraer</span><h3>${best.s.poke}</h3><p>De los Pokémon configurados, es el que tiene el <b>mejor índice estimado de aguante</b> con ${best.s.role}, ${best.s.tier}, ${best.s.stars}★${best.training.hp||best.training.defense?` y su Training defensivo (${best.training.hp?`+${fmt(best.training.hp)}% HP`:''}${best.training.hp&&best.training.defense?' · ':''}${best.training.defense?`+${fmt(best.training.defense)}% defensa`:''})`:''}. Puede ser la mejor opción para atraer mientras el resto de la rotación pega.</p><small>Recomendación comparativa, no HP real. Se consideran rol, tier, reducción por Stars, HP Training y Defense Training. Evasion y Critical Resistance se muestran, pero no se usan en el índice porque no tenemos una fórmula defensiva confirmada para convertirlos a daño recibido.</small></div></div>`:'<div class="lureRecommendation empty"><div class="lureIcon">🛡️</div><div><span class="eyebrow">Recomendación para atraer</span><p>Agrega nombres de Pokémon a la rotación y aquí te sugeriremos cuál parece resistir mejor con la configuración elegida.</p></div></div>';
  el.querySelector('#damageSummary').innerHTML=`<span class="eyebrow">Resultado de la rotación</span><div class="damageTotal"><small>DPS combinado estimado</small><strong>${Math.round(total).toLocaleString('es-MX')}</strong><span>${valid} Pokémon con referencia disponible</span></div><div class="damageSeconds"><div><small>Daño aprox. en 10 s</small><b>${Math.round(total*10).toLocaleString('es-MX')}</b></div><div><small>Daño aprox. en 30 s</small><b>${Math.round(total*30).toLocaleString('es-MX')}</b></div><div><small>Daño aprox. en 60 s</small><b>${Math.round(total*60).toLocaleString('es-MX')}</b></div></div>${lure}`;
 }
 render();
}
document.addEventListener('DOMContentLoaded',()=>{initStar();initDamage();});
})();