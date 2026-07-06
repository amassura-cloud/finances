const CACHE="painel-v48";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  // painel-dados.json: SEMPRE rede, nunca cache (dados frescos a cada carregamento)
  if(url.pathname.endsWith("painel-dados.json")){
    e.respondWith(fetch(new Request(e.request.url,{cache:"no-store"})).catch(()=>caches.match(e.request)));
    return;
  }
  const doc = e.request.mode==="navigate" || e.request.destination==="document";
  const req = doc ? new Request(e.request.url,{cache:"no-store"}) : e.request;
  e.respondWith(
    fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));return r;})
    .catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html")))
  );
});
