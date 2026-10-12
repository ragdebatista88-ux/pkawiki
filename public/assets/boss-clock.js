(function(){
 const slots=[60,300,540,780,1110,1290]; // GMT-3 minutes after midnight
 const els=[...document.querySelectorAll('[data-boss-clock]')];if(!els.length)return;
 const fmt=new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Hora local';
 const pad=n=>String(n).padStart(2,'0');
 function render(){
  const now=Date.now(),d=new Date(now),utcMid=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());
  // At GMT-3 midnight UTC is 03:00; check previous/current/next day.
  const candidates=[];
  for(let day=-2;day<=2;day++)for(const min of slots)candidates.push(utcMid+day*86400000+10800000+min*60000);
  candidates.sort((a,b)=>a-b);
  const next=candidates.find(t=>t>now)||candidates[candidates.length-1];
  const diff=Math.max(0,Math.ceil((next-now)/1000));
  const language=document.documentElement.lang.toLowerCase().startsWith('pt')?'pt':'es';
  const pt=language==='pt';
  for(const el of els){
   el.querySelector('[data-boss-zone]').textContent=(pt?'Seu horário local: ':'Tu horario local: ')+zone;
   el.querySelector('[data-boss-next-label]').textContent=pt?'Próxima aparição':'Próxima aparición';
   el.querySelector('[data-boss-left-label]').textContent=pt?'Tempo restante':'Tiempo restante';
   el.querySelector('[data-boss-next]').textContent=fmt.format(new Date(next));
   el.querySelector('[data-boss-countdown]').textContent=pad(Math.floor(diff/3600))+':'+pad(Math.floor(diff%3600/60))+':'+pad(diff%60);
   el.querySelector('[data-boss-disclaimer]').textContent=pt?'Horários programados · referência GMT−3; não confirma o aparecimento no jogo.':'Horarios programados · referencia GMT−3; no confirma la aparición dentro del juego.';
   el.querySelector('[data-boss-link]').textContent=pt?'Ver evento Halloween →':'Ver evento Halloween →';
   const timeline=el.querySelector('[data-boss-timeline]');
   // Show the next six events in chronological order; some can be next day locally.
   const upcoming=candidates.filter(t=>t>now).slice(0,6);
   const signature=upcoming.join(',')+'|'+language;
   if(timeline.dataset.signature!==signature){
    timeline.dataset.signature=signature;timeline.replaceChildren();
    for(let i=0;i<upcoming.length;i++){
      const item=document.createElement('div');item.className='bossClockTick'+(i===0?' is-next':'');
      const t=document.createElement('span');t.textContent=fmt.format(new Date(upcoming[i]));
      const label=document.createElement('small');label.textContent=i===0?(pt?'Próximo':'Próximo'):(pt?'Depois':'Después');
      item.append(t,label);timeline.append(item);
    }
   }
  }
 }
 render();setInterval(render,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
})();