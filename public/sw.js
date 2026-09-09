// performance-v3: lightweight data bundles + inline base i18n
const CACHE='pka-wiki-v13-performance-max';
const CORE=['./','index.html','assets/styles.css','assets/app.js','assets/i18n.js','assets/enhancements.js','data/pokemon-index.js','data/home-stats.js','assets/pka-wiki-logo.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
function staticAsset(r){const u=new URL(r.url);return u.origin===self.location.origin&&/\.(?:css|js|json|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(u.pathname)}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 if(staticAsset(event.request)){
  event.respondWith(caches.open(CACHE).then(async c=>{
   const hit=await c.match(event.request);
   const net=fetch(event.request).then(r=>{if(r&&r.ok)c.put(event.request,r.clone());return r}).catch(()=>null);
   return hit||net||Response.error();
  }));return;
 }
 // HTML stays network-first so deployments never feel stale; cached page is offline fallback.
 if(event.request.mode==='navigate')event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return r}).catch(()=>caches.match(event.request).then(r=>r||caches.match('index.html'))));
});
