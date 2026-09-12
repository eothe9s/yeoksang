const VERSION='2.2';
const CACHE='yeoksang-v2-2-20260912';
const ASSETS=['./','./index.html?v=2200','./boot-v220.js?v=2200','./recovery.html?v=2200','./styles-v200.css?v=2200','./styles-v210.css?v=2200','./app-v200-core.js?v=2200','./app-v200-engine.js?v=2200','./app-v200-recovery.js?v=2200','./app-v210.js?v=2200','./app-v220-analysis.js?v=2200','./manifest-v200.webmanifest?v=2200','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('project-11122-')||k.startsWith('yeoksang-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION})});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{})}return response}).catch(async()=>{const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate')return (await caches.match('./index.html?v=2200'))||(await caches.match('./'));return Response.error()}))
});
