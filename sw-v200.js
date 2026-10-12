const VERSION='2.6.0';
const BUILD='20261012-records-schedule-1';
const CACHE='yeoksang-v2-6-0-'+BUILD;
const ASSETS=['./index.html?v=260', './bootstrap-v260.js?v=260', './record-store-v260.js?v=260', './recovery.html?v=260', './styles-v200.css?v=260', './styles-v210.css?v=260', './styles-v240.css?v=260', './styles-v252.css?v=260', './styles-v260.css?v=260', './baseline-v200.js?v=260', './boot-v220.js?v=260', './app-v200-core.js?v=260', './app-v200-engine.js?v=260', './app-v200-recovery.js?v=260', './app-v210.js?v=260', './app-v220-analysis.js?v=260', './app-v230.js?v=260', './app-v231.js?v=260', './app-v240.js?v=260', './app-widget-live.js?v=260', './app-v252.js?v=260', './app-v260.js?v=260', './record-safety.js?v=260', './view-tools.js?v=260', './manifest-v200.webmanifest?v=260', './icon-192.png', './icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(async error=>{await caches.delete(CACHE);throw error;}));
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys(),previous=keys.filter(k=>k.startsWith('yeoksang-')&&k!==CACHE);
  // Keep the immediately preceding cache for tabs still on the previous build.
  await Promise.all(previous.slice(0,-1).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION,build:BUILD});
 if(event.data?.type==='APPLY_UPDATE')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(event.request.mode==='navigate'){
   const page=await cache.match(url.pathname.endsWith('recovery.html')?'./recovery.html?v=260':'./index.html?v=260');if(page)return page;
  }
  const cached=await cache.match(event.request);if(cached)return cached;
  try{return await fetch(event.request)}catch{return Response.error()}
 })());
});
