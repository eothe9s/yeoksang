const VERSION='2.5.1';
const CACHE='yeoksang-v2-5-1-widget-live-20260921';
const ASSETS=['./index.html?v=251-live-1','./boot-v220.js?v=2501','./recovery.html?v=2501','./styles-v200.css?v=2501','./styles-v210.css?v=2501','./styles-v240.css?v=2501','./app-v200-core.js?v=2501','./app-v200-engine.js?v=2501','./app-v200-recovery.js?v=2501','./app-v210.js?v=2501','./app-v220-analysis.js?v=2501','./app-v230.js?v=2501','./app-v231.js?v=2501','./app-v240.js?v=2501','./app-widget-live.js?v=251-live-1','./record-safety.js?v=2501','./view-tools.js?v=2501','./manifest-v200.webmanifest?v=2501','./icon-192.png','./icon-512.png'];
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
 if(event.data?.type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION});
 if(event.data?.type==='APPLY_UPDATE')self.skipWaiting();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(event.request.mode==='navigate'&&!url.pathname.endsWith('recovery.html')){
   const page=await cache.match('./index.html?v=251-live-1');if(page)return page;
  }
  const cached=await cache.match(event.request);if(cached)return cached;
  try{return await fetch(event.request)}catch{return Response.error()}
 })());
});
