// performance-i18n-v2
const CACHE='pka-wiki-v12-performance-i18n';
const CORE=['./','index.html','assets/styles.css','assets/app.js','assets/i18n.js','assets/enhancements.js','assets/pokelog-icons.js','data/wiki-data.js','lang/es/common.json','lang/pt-BR/common.json'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

function isStatic(request){
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return false;
  return /\.(?:css|js|json|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname);
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(isStatic(event.request)){
    // Stale-while-revalidate: respuesta inmediata desde caché y actualización en segundo plano.
    event.respondWith(caches.open(CACHE).then(async cache=>{
      const cached=await cache.match(event.request);
      const network=fetch(event.request).then(response=>{
        if(response&&response.ok)cache.put(event.request,response.clone());
        return response;
      }).catch(()=>null);
      return cached || network || Response.error();
    }));
    return;
  }
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(r=>r||caches.match('index.html'))));
});
