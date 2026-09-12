/* Independent of application DB initialization. Never writes browser storage. */
globalThis.y211ShowRecovery=function(message){
 if(document.getElementById('y211-recovery'))return;
 const panel=document.createElement('div');panel.id='y211-recovery';
 panel.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#f4f6fa;color:#26374a;padding:8vh 8vw;font:17px system-ui;overflow:auto';
 const title=document.createElement('h2');title.textContent='기록 보호 · 曆象 2.2';
 const p=document.createElement('p');p.textContent=message+' Safari 웹사이트 데이터를 지우지 마세요.';
 const a=document.createElement('a');a.href='./recovery.html?v=2200';a.textContent='기존 저장값 원본 내보내기';a.style.cssText='display:block;padding:20px 0';
 const b=document.createElement('button');b.textContent='현재 화면의 미저장 기록 내보내기';b.onclick=()=>{try{const url=URL.createObjectURL(new Blob([JSON.stringify(DB)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='YEOKSANG_UNSAVED_SESSION.json';panel.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}catch{b.textContent='앱 기록을 읽을 수 없습니다. 위의 원본 내보내기를 사용하세요.'}};
 panel.append(title,p,a,b);document.body.appendChild(panel);
};
window.addEventListener('error',e=>{if(e.filename&&/app-v/.test(e.filename))globalThis.y211ShowRecovery('앱 실행 오류로 편집을 중단했습니다.');});
window.addEventListener('unhandledrejection',()=>globalThis.y211ShowRecovery('앱 처리 오류로 편집을 중단했습니다.'));
window.addEventListener('load',()=>{if(globalThis.YEOKSANG_STARTING!==false)globalThis.y211ShowRecovery('앱 초기화가 완료되지 않았습니다.');});
