(()=>{
  const wrap=document.querySelector('#siteAnnouncement');
  const track=document.querySelector('#announcementTrack');
  const dots=document.querySelector('#announcementDots');
  const carousel=document.querySelector('#announcementCarousel');
  if(!wrap||!track||!dots||!carousel)return;
  const lang=()=>localStorage.getItem('pka-wiki-language')==='pt-BR'?'pt':'es';
  const val=(o,k)=>lang()==='pt'&&(o[k+'Pt']??'')!==''?(o[k+'Pt']??o[k]):o[k];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let slides=[],index=0,timer=null,touchX=0;
  const renderSlide=(a,i)=>{
    const head=`<div class="announcementTop"><span class="announcementLabel">${esc(val(a,'etiqueta')||(lang()==='pt'?'Informação':'Información'))}</span><span class="announcementUntil">${esc(val(a,'fecha')||'')}</span></div><h2>${esc(val(a,'titulo'))}</h2><p class="announcementLead">${esc(val(a,'texto')||'')}</p>`;
    let body='';
    if(a.tipo==='evento'&&Array.isArray(a.beneficios)){
      body=`<div class="announcementBuffs">${a.beneficios.map(b=>`<div class="announcementBuff"><span>${esc(b.icono)}</span><b>${esc(val(b,'titulo'))}</b><small>${esc(b.detalle)}</small></div>`).join('')}</div>`;
      if(a.nota)body+=`<div class="announcementNote"><b>${esc(a.notaTitulo||'Nota')}</b><br>${esc(a.nota)}</div>`;
    }
    if(a.tipo==='recompensa'&&Array.isArray(a.beneficios)){
      body=`<div class="announcementRewardRow">${a.beneficios.map(b=>`<div class="announcementReward"><span>${esc(b.icono)}</span><div><b>${esc(val(b,'titulo'))}</b><small>${esc(val(b,'detalle')||'')}</small></div></div>`).join('')}</div>`;
      if(Array.isArray(a.requisitos)&&a.requisitos.length)body+=`<div class="announcementReqs">${a.requisitos.map(x=>`<span>✓ ${esc(x)}</span>`).join('')}</div>`;
    }
    if(a.tipo==='informativo'&&Array.isArray(a.bloques)){
      body=`<div class="announcementInfoGrid">${a.bloques.map(b=>`<article class="announcementInfoCard"><div class="announcementInfoHead"><span class="announcementInfoIcon">${esc(b.icono||'•')}</span><div><h3>${esc(val(b,'titulo'))}</h3><span class="announcementStatus">${esc(val(b,'estado')||'')}</span></div></div><p>${esc(val(b,'texto')||'')}</p><strong class="announcementDate">${esc(val(b,'fecha')||'')}</strong></article>`).join('')}</div>`;
    }
    const close=a.cierre?`<p class="announcementClose">${esc(val(a,'cierre'))}</p>`:'';
    const cta=a.link?`<a class="announcementCta" href="${esc(a.link)}">${esc(val(a,'linkTexto')||(lang()==='pt'?'Ver detalhes →':'Ver detalles →'))}</a>`:'';
    return `<article class="homeAnnouncement announcementSlide" data-slide="${i}" aria-hidden="${i?'true':'false'}">${head}${body}${close}${cta}</article>`;
  };
  const go=n=>{
    if(!slides.length)return;
    index=(n+slides.length)%slides.length;
    track.style.transform=`translateX(-${index*100}%)`;
    [...track.children].forEach((el,i)=>el.setAttribute('aria-hidden',i===index?'false':'true'));
    [...dots.children].forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'true':'false')});
  };
  const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const start=()=>{stop();if(slides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>go(index+1),8000)};
  fetch('data/anuncios.json',{cache:'force-cache'}).then(r=>r.json()).then(data=>{
    slides=(Array.isArray(data)?data:[]).filter(x=>x&&x.activo!==false);
    if(!slides.length)return;
    track.innerHTML=slides.map(renderSlide).join('');
    dots.innerHTML=slides.map((_,i)=>`<button type="button" aria-label="Ver información ${i+1}" ${i===0?'class="active" aria-current="true"':''}></button>`).join('');
    dots.querySelectorAll('button').forEach((b,i)=>b.addEventListener('click',()=>{go(i);start()}));
    carousel.querySelector('.announcementPrev').addEventListener('click',()=>{go(index-1);start()});
    carousel.querySelector('.announcementNext').addEventListener('click',()=>{go(index+1);start()});
    if(slides.length<2){carousel.classList.add('singleSlide')}
    carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',start);
    carousel.addEventListener('focusin',stop);carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget))start()});
    carousel.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;stop()},{passive:true});
    carousel.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>45)go(index+(dx<0?1:-1));start()},{passive:true});
    wrap.hidden=false;go(0);start();
  }).catch(()=>{});
})();
