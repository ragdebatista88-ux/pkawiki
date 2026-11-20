(()=>{'use strict';
const $=id=>document.getElementById(id);
const balls=[['alliance','Alliance Ball','alliance-icon.png'],['premier','Premier Ball','premier-icon.png'],['ultra','Ultra Ball','ultra-icon.png'],['elemental','Elemental Ball','elemental-animated.gif']];
const t={es:{qty:'Cantidad',price:'Precio unitario',reached:'Media comunitaria alcanzada (no garantiza captura)',left:'Brokes equivalentes aproximados que faltan para la media:'},pt:{qty:'Quantidade',price:'Preço unitário',reached:'Média comunitária atingida (não garante captura)',left:'Brokes equivalentes aproximados restantes até a média:'}};
let lang='es';const n=id=>Math.max(0,Number($(id).value)||0),f=x=>new Intl.NumberFormat(lang==='pt'?'pt-BR':'es-MX',{maximumFractionDigits:2}).format(x),money=x=>'$'+f(x);
const tierRows=window.PKA_HAZARD_TIERS||[];
const tierMap=new Map(tierRows.filter(p=>p['Pokémon']).map(p=>[p['Pokémon'].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),p.Tier]));
const tierValues={'Legendary':'22535','Ultra Rare':'9400','Super Rare':'3500','T1':'1280','T2':'900','T3':'700','T4':'600','T5':'400','T6':'200'};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function labels(){balls.forEach(([id])=>{document.querySelector('#box-'+id+' .qtylabel').textContent=t[lang].qty;document.querySelector('#box-'+id+' .pricelabel').textContent=t[lang].price});calc()}
function calc(){const total=balls.reduce((s,[id])=>s+n('q-'+id),0),valid=n('q-ultra')+n('q-elemental'),target=n('tier'),remaining=Math.max(0,target-valid),pct=target?100*valid/target:0,cost=balls.reduce((s,[id])=>s+n('q-'+id)*n('p-'+id),0),revenue=n('sell'),profit=revenue-cost;$('total').textContent=f(total);$('valid').textContent=f(valid);$('pct').textContent=target?f(pct)+'%':'—';$('remain').textContent=target?f(remaining):'—';$('bar').style.width=Math.min(100,pct)+'%';$('message').textContent=!target?'Sin media comunitaria confirmada para el tier seleccionado.':remaining===0?t[lang].reached:t[lang].left+' '+f(remaining);$('cost').textContent=money(cost);$('revenue').textContent=money(revenue);$('profit').textContent=(profit<0?'-':'')+money(Math.abs(profit));$('roi').textContent=cost?f(profit/cost*100)+'%':'—'}
$('balls').innerHTML=balls.map(([id,name,img])=>'<article class="ball" id="box-'+id+'"><h3><img alt="" src="assets/balls/'+img+'">'+name+'</h3><div class="ballfields"><label><span class="qtylabel">Cantidad</span><input type="number" id="q-'+id+'" min="0" step="1" value="0"></label><label><span class="pricelabel">Precio unitario</span><input type="number" id="p-'+id+'" min="0" step="any" value="'+(id==='ultra'?130:0)+'" '+(id==='ultra'?'readonly':'')+'></label></div></article>').join('');
const names=new Set([...(window.PKA_POKEMON_INDEX||[]),...tierRows.map(p=>p['Pokémon']).filter(Boolean)]);
[...names].sort((a,b)=>a.localeCompare(b)).forEach(name=>{const o=document.createElement('option');o.value=name;$('pklist').appendChild(o)});
function detectTier(){const name=$('poke').value.trim();if(!name){$('tier-status').textContent='Escribe o selecciona un Pokémon para detectar su tier, o elige el tier manualmente.';return}const tier=tierMap.get(norm(name));if(!tier){$('tier-status').textContent='No se encontró un tier confirmado para «'+name+'». Puedes elegirlo manualmente.';return}if(tier==='Mythic'){$('tier').value='';$('tier-status').textContent=name+' · Mythic: no hay media de brokes confirmada. Puedes elegir otra referencia manualmente.';calc();return}const val=tierValues[tier];if(val){$('tier').value=val;$('tier-status').textContent=name+' · Tier detectado: '+tier+' (editable manualmente).';calc()}else $('tier-status').textContent=name+' · Tier registrado: '+tier+'. Selecciona una referencia manualmente.'}
$('poke').addEventListener('input',detectTier);$('poke').addEventListener('change',detectTier);
$('tier').addEventListener('change',()=>{$('tier-status').textContent='Tier seleccionado manualmente; puedes cambiarlo cuando quieras.';calc()});
function readCount(s){const clean=String(s).trim().replace(/[.,\s]/g,'');return /^\d+$/.test(clean)?Number(clean):null}
const types={ultra:/^ultra\s*balls?$/i,premier:/^premier\s*balls?$/i,alliance:/^alliance\s*balls?$/i};
const elemental=/^(?:magu|net|sora|elemental|dusk|dive|nest|repeat|timer|quick|luxury|heal|love|moon|friend|level|lure|heavy|fast|sport|dream|beast|cherish)\s*balls?$/i;
function categorize(name){name=norm(name).replace(/pok[eé]\s*/g,'poke ').trim();for(const [k,re] of Object.entries(types))if(re.test(name))return k;return elemental.test(name)?'elemental':null}
function importText(){const raw=$('brokes-import').value.trim(),status=$('import-status');if(!raw){status.textContent='Pega primero un registro o un mensaje del juego.';return}const quantities={alliance:0,premier:0,ultra:0,elemental:0};let found=0,ignored=0,pokemon='';const lines=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const header=lines.find(x=>/^(?:shiny\s+)?[\p{L}][\p{L}\s.'-]+\s+#\d+$/iu.test(x));if(header)pokemon=header.replace(/\s+#\d+$/,'').trim();
if(/ya has perdido\s*:/i.test(raw)){
 const body=raw.slice(raw.search(/ya has perdido\s*:/i)).replace(/^ya has perdido\s*:/i,'');
 const re=/(\d[\d.,]*)\s+([\p{L}][\p{L}\s-]*?\s+Balls?)\b/giu;
 for(const m of body.matchAll(re)){const key=categorize(m[2]),value=readCount(m[1]);if(value===null)continue;if(key){quantities[key]+=value;found++}else ignored+=value}
}else{
 for(const line of lines){const m=line.match(/^([^:]+):\s*([\d.,]+)\s*$/);if(!m)continue;const key=categorize(m[1]),value=readCount(m[2]);if(value===null)continue;if(key){quantities[key]+=value;found++}else if(norm(m[1])!=='total')ignored+=value}
}
if(!found){status.textContent='No encontré cantidades válidas de Ultra, Elemental, Premier o Alliance. Revisa el formato del texto.';return}
for(const [key,value] of Object.entries(quantities))$('q-'+key).value=value;
if(pokemon){$('poke').value=pokemon;detectTier()}
calc();status.textContent='Importadas '+found+' categorías/registros: '+Object.entries(quantities).map(([k,v])=>k+' '+f(v)).join(' · ')+(ignored?' · Ignoradas '+f(ignored)+' balls de otros tipos.':'')+(pokemon?' · Pokémon: '+pokemon+'.':' · Se conserva el Pokémon seleccionado.');
}
$('import-brokes').addEventListener('click',importText);$('clear-import').addEventListener('click',()=>{$('brokes-import').value='';$('import-status').textContent='Texto limpiado. Las cantidades calculadas se conservan.'});
document.querySelectorAll('input,select').forEach(el=>{if(el.id!=='poke')el.addEventListener('input',calc)});
$('lang').addEventListener('change',e=>{lang=e.target.value;labels()});calc();
})();