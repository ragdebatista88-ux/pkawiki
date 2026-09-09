/* PKA Wiki i18n — catálogo JSON ES / PT-BR, sin recargar página. */
(() => {
  'use strict';
  const STORAGE_KEY='pka-wiki-language';
  const SUPPORTED=new Set(['es','pt-BR']);
  let lang=SUPPORTED.has(localStorage.getItem(STORAGE_KEY))?localStorage.getItem(STORAGE_KEY):'es';
  let catalogs={es:{},'pt-BR':{}};
  let reverse={};
  let applying=false;
  const page=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'') || 'index';

  async function getJSON(url){ try{const r=await fetch(url,{cache:'no-cache'}); return r.ok?await r.json():{};}catch(e){return {};} }
  async function loadCatalogs(){
    const targetPaths=[`lang/${lang}/common.json`,`lang/${lang}/dynamic.json`,`lang/${lang}/pages/${page}.json`];
    const sourcePaths=['lang/es/common.json','lang/es/dynamic.json',`lang/es/pages/${page}.json`];
    const [target,source]=await Promise.all([Promise.all(targetPaths.map(getJSON)),Promise.all(sourcePaths.map(getJSON))]);
    catalogs[lang]=Object.assign({},...target); catalogs.es=Object.assign({},...source);
    reverse={}; Object.entries(catalogs.es).forEach(([k,v])=>{ if(typeof v==='string') reverse[v.trim()]=k; });
  }
  function tKey(key){ return catalogs[lang]?.[key] ?? catalogs.es?.[key] ?? key; }
  function tText(text){ if(!text) return text; const s=text.trim(); const k=reverse[s]; if(!k) return text; return text.replace(s,tKey(k)); }
  function applyKeyed(root=document){
    if(root.nodeType===1 && root.matches?.('[data-i18n]')) root.textContent=tKey(root.dataset.i18n);
    root.querySelectorAll?.('[data-i18n]').forEach(el=>el.textContent=tKey(el.dataset.i18n));
    root.querySelectorAll?.('[data-i18n-placeholder]').forEach(el=>el.setAttribute('placeholder',tKey(el.dataset.i18nPlaceholder)));
    root.querySelectorAll?.('[data-i18n-title]').forEach(el=>el.setAttribute('title',tKey(el.dataset.i18nTitle)));
    root.querySelectorAll?.('[data-i18n-aria-label]').forEach(el=>el.setAttribute('aria-label',tKey(el.dataset.i18nAriaLabel)));
  }
  function translateDynamic(root=document.body){
    if(!root) return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{ const p=n.parentElement; if(!p||p.closest('[data-no-i18n],script,style,pre,code,textarea,.languageSwitcher,[data-i18n]')) return; const out=tText(n.nodeValue); if(out!==n.nodeValue)n.nodeValue=out; });
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el=>{
      if(el.closest('[data-no-i18n],.languageSwitcher')) return;
      ['placeholder','title','aria-label'].forEach(a=>{ if(el.hasAttribute(a)) el.setAttribute(a,tText(el.getAttribute(a))); });
    });
  }
  function injectSwitcher(){
    if(document.querySelector('.languageSwitcher')) return;
    const shell=document.querySelector('.topbar'); if(!shell)return;
    const wrap=document.createElement('label'); wrap.className='languageSwitcher'; wrap.setAttribute('data-no-i18n','');
    wrap.innerHTML='<span class="languageIcon" aria-hidden="true">🌐</span><select id="wikiLanguageSelect" aria-label="Idioma"><option value="es">ES · Español</option><option value="pt-BR">BR · Português</option></select>';
    shell.appendChild(wrap);
    wrap.querySelector('select').value=lang; wrap.querySelector('select').addEventListener('change',e=>setLanguage(e.target.value));
  }
  async function render(){ applying=true; document.documentElement.lang=lang; await loadCatalogs(); applyKeyed(); translateDynamic(); const s=document.querySelector('#wikiLanguageSelect'); if(s)s.value=lang; applying=false; document.dispatchEvent(new CustomEvent('pka:languagechange',{detail:{language:lang}})); }
  async function setLanguage(next){ lang=SUPPORTED.has(next)?next:'es'; localStorage.setItem(STORAGE_KEY,lang); await render(); }
  const obs=new MutationObserver(ms=>{ if(applying)return; applying=true; ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1){applyKeyed(n);translateDynamic(n);} else if(n.nodeType===3&&n.parentElement){const o=tText(n.nodeValue);if(o!==n.nodeValue)n.nodeValue=o;} })); applying=false; });
  async function init(){ injectSwitcher(); await render(); obs.observe(document.body,{childList:true,subtree:true}); setTimeout(()=>{applyKeyed();translateDynamic();},150); setTimeout(()=>{applyKeyed();translateDynamic();},600); }
  window.PKAI18N={setLanguage,getLanguage:()=>lang,t:tText,tKey,refresh:render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init); else init();
})();
