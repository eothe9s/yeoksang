/* Recovery remains available independently of DB initialization. */
globalThis.YEOKSANG_WRITER=false;
let releaseWriter;
function acquireWriter(){
 if(!navigator.locks){globalThis.YEOKSANG_WRITER=undefined;return;}
 navigator.locks.request('yeoksang-record-writer',{ifAvailable:true},lock=>{
  globalThis.YEOKSANG_WRITER=!!lock;
  if(!lock){const el=document.getElementById('runtimeStatus');if(el)el.textContent='읽기 전용 · 다른 曆象 탭을 닫아 주세요';return;}
  if(typeof renderVersionStatus==='function')renderVersionStatus();
  return new Promise(resolve=>{releaseWriter=resolve;});
 }).catch(()=>{globalThis.YEOKSANG_WRITER=false;});
}
acquireWriter();
window.addEventListener('pagehide',()=>{globalThis.YEOKSANG_WRITER=false;releaseWriter?.();});
window.addEventListener('pageshow',e=>{if(e.persisted)acquireWriter();});
globalThis.y211ShowRecovery=function(message){
 let panel=document.getElementById('y211-recovery');
 if(panel){panel.querySelector('[data-recovery-message]').textContent=message;return;}
 panel=document.createElement('div');panel.id='y211-recovery';panel.setAttribute('role','alertdialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','recoveryHeading');
 panel.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#f4f6fa;color:#26374a;padding:5vh 6vw;font:16px system-ui;overflow:auto';
 const title=document.createElement('h2');title.id='recoveryHeading';title.textContent='기록 보호 · 曆象 2.5.1';
 const p=document.createElement('p');p.dataset.recoveryMessage='';p.textContent=message;
 const note=document.createElement('p');note.textContent='Safari 웹사이트 데이터를 지우지 마세요.';
 const original=document.createElement('button');original.textContent='기존 저장값 원본 내보내기';
 const download=(name,raw)=>{const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;panel.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);};
 original.onclick=()=>{const raw=localStorage.getItem('p11122_v60_db');if(raw!==null)download('YEOKSANG_EXISTING_RAW.json',raw);else alert('현재 저장된 원본이 없습니다. 미저장 기록을 내보내 주세요.');};
 const unsaved=document.createElement('button');unsaved.textContent='미저장 변경 내보내기';unsaved.onclick=()=>{try{download('YEOKSANG_UNSAVED_SESSION.json',globalThis.YEOKSANG_FAILED_RAW||JSON.stringify(DB));}catch{alert('미저장 기록을 읽지 못했습니다. 원본은 보존되어 있습니다.');}};
 const manage=document.createElement('div');manage.id='recoveryStorageManager';
 const retry=document.createElement('button');retry.textContent='공간 정리 후 저장 재시도';retry.onclick=()=>{if(typeof retryFailedSave==='function')retryFailedSave();};
 const link=document.createElement('a');link.href='./recovery.html?v=2501';link.textContent='별도 원본 복구 화면';
 panel.append(title,p,note,original,unsaved,manage,retry,link);document.body.appendChild(panel);
 for(const b of panel.querySelectorAll('button'))b.style.cssText='margin:8px 12px 8px 0;padding:12px;border:1px solid #a6b3c8;border-radius:10px;background:white;color:#26374a';
 if(typeof renderStorageManagement==='function')renderStorageManagement(manage);
 original.focus();
};
window.addEventListener('error',e=>{if(e.error?.name==='YeoksangSaveError'){e.preventDefault();return;}if(e.filename&&/(app-|record-safety)/.test(e.filename))globalThis.y211ShowRecovery('앱 실행 오류로 편집을 중단했습니다.');});
window.addEventListener('unhandledrejection',e=>{if(e.reason?.name==='YeoksangSaveError'){e.preventDefault();return;}globalThis.y211ShowRecovery('앱 처리 오류로 편집을 중단했습니다.');});
window.addEventListener('load',()=>{if(globalThis.YEOKSANG_STARTING!==false)globalThis.y211ShowRecovery('앱 초기화가 완료되지 않았습니다.');});
