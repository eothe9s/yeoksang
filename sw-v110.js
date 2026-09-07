const VERSION='11.1';
const CACHE='yeoksang-v11-1-20260907';
const ASSETS=['./','./index.html?v=1110','./styles-v110.css?v=1110','./baseline-v110.js?v=1110','./app-v110-core.js?v=1110','./app-v110-engine.js?v=1110','./app-v110-recovery.js?v=1110','./manifest-v110.webmanifest?v=1110','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('project-11122-')||k.startsWith('yeoksang-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION})});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{})}return response}).catch(async()=>{const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate')return (await caches.match('./index.html?v=1110'))||(await caches.match('./'));return Response.error()}))
});
