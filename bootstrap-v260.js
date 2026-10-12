'use strict';
(async function(){
 const script=src=>new Promise((yes,no)=>{const e=document.createElement('script');e.src=src;e.onload=yes;e.onerror=()=>no(Error('파일을 읽지 못했습니다: '+src));document.head.appendChild(e);});
 const sources=['baseline-v200.js','boot-v220.js','app-v200-core.js','app-v200-engine.js','app-v200-recovery.js','app-v210.js','app-v220-analysis.js','app-v230.js','app-v231.js','app-v240.js','app-widget-live.js','record-safety.js','view-tools.js','app-v252.js','app-v260.js'];
 const notice=document.createElement('div');notice.id='y260Boot';notice.textContent='기록 읽는 중';notice.style.cssText='position:fixed;inset:0;background:#f4f6fa;z-index:2147483646;display:grid;place-items:center;font:16px system-ui;color:#26374a';document.body.appendChild(notice);
 try{
  await script('./record-store-v260.js?v=260');await YEOKSANG_RECORD_STORE.open();
  for(const file of sources)await script('./'+file+'?v=260');
  document.dispatchEvent(new Event('DOMContentLoaded'));notice.remove();
 }catch(e){
  notice.textContent='기록을 열지 못했습니다. 기존 기록은 보존됩니다. '+e.message;
  const button=document.createElement('button');button.textContent='기존 기록 내보내기';button.onclick=()=>{const raw=globalThis.YEOKSANG_RECORD_STORE?.durable()||localStorage.getItem('p11122_v60_db');if(!raw)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.download='YEOKSANG_EXISTING_RAW.json';a.click();};notice.append(button);
 }
})();
