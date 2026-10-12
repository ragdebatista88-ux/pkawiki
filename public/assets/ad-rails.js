/* Activate only after Google has approved the site and real ad-unit IDs are configured. */
(function(){
'use strict';
const CLIENT='ca-pub-9492952989000422';
const SLOTS={left:'',right:''}; // Replace with approved AdSense display unit slot IDs.
if(window.top!==window.self)return;
function mount(){
  if(!document.body)return;
  for(const side of ['left','right']){
    const slot=SLOTS[side];
    if(!/^\d{6,}$/.test(slot))continue;
    const rail=document.createElement('aside');rail.className='pka-ad-rail pka-ad-rail--'+side+' is-active';
    rail.setAttribute('aria-label',document.documentElement.lang.startsWith('pt')?'Publicidade':'Publicidad');
    const label=document.createElement('p');label.className='pka-ad-rail__label';label.textContent=document.documentElement.lang.startsWith('pt')?'Publicidade':'Publicidad';
    const unit=document.createElement('div');unit.className='pka-ad-rail__unit';
    const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';
    ins.dataset.adClient=CLIENT;ins.dataset.adSlot=slot;ins.dataset.adFormat='rectangle';ins.dataset.fullWidthResponsive='false';
    unit.append(ins);rail.append(label,unit);document.body.append(rail);
    try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){console.warn('AdSense unit not loaded',e)}
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
