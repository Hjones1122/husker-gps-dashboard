// Nebraska Soccer GPS Dashboard — Service Worker
// husker-gps-1776557645181
// Network-first: always fetch fresh, fall back to cache if offline
const CACHE='husker-gps-1776557645181';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request)
      .then(resp=>{
        const clone=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
        return resp;
      })
      .catch(()=>caches.match(e.request))
  );
});