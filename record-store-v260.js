/* One durable database; bounded change history; no localStorage shadow writes. */
'use strict';
(function(){
 const KEY='p11122_v60_db',NAME='yeoksang-records-v1';let db,raw=null,durable=null,revision=0,queue=Promise.resolve(),pending=0,blocked=false,history=[];
 const listeners=new Set(),emit=()=>listeners.forEach(f=>{try{f({pending,blocked,revision});}catch(e){console.error(e);}});
 const request=r=>new Promise((yes,no)=>{r.onsuccess=()=>yes(r.result);r.onerror=()=>no(r.error);});
 const complete=t=>new Promise((yes,no)=>{t.oncomplete=yes;t.onabort=t.onerror=()=>no(t.error||Error('저장 중단'));});
 function diff(a,b,path=[],out=[]){
  if(JSON.stringify(a)===JSON.stringify(b))return out;
  if(a&&b&&!Array.isArray(a)&&!Array.isArray(b)&&typeof a==='object'&&typeof b==='object'){
   for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],[...path,k],out);
  }else out.push({path,exists:a!==undefined,value:a});return out;
 }
 function reverse(value,changes){const result=structuredClone(value);for(const x of changes){let p=result;for(const k of x.path.slice(0,-1)){if(!p[k]||typeof p[k]!=='object')p[k]={};p=p[k];}const k=x.path.at(-1);if(x.exists)p[k]=structuredClone(x.value);else delete p[k];}return result;}
 async function open(){
  const opening=indexedDB.open(NAME,1);opening.onupgradeneeded=()=>{for(const n of ['records','history','legacy'])if(!opening.result.objectStoreNames.contains(n))opening.result.createObjectStore(n);};db=await request(opening);
  const read=db.transaction(['records','history'],'readonly'),saved=await request(read.objectStore('records').get('current'));history=(await request(read.objectStore('history').get('recent')))||[];
  if(saved){raw=durable=saved.raw;revision=saved.revision||0;JSON.parse(raw);}
  else{
   const legacy=localStorage.getItem(KEY);if(legacy!==null){const v=JSON.parse(legacy);if(!v||typeof v!=='object'||Array.isArray(v))throw Error('기존 기록 형식 오류');
    const t=db.transaction('records','readwrite');t.objectStore('records').put({raw:legacy,revision:1},'current');await complete(t);
    const verify=db.transaction('records','readonly');const v2=await request(verify.objectStore('records').get('current'));if(v2?.raw!==legacy)throw Error('기록 이전 확인 실패');raw=durable=legacy;revision=1;
   }
  }
  // Archive old browser copies without deleting their originals.
  const copies={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==='p11122_v60_undo'||k==='p11122_v100_daily_safety'||/^p11122_pre_/.test(k))copies[k]=localStorage.getItem(k);}
  if(Object.keys(copies).length){const t=db.transaction('legacy','readwrite');t.objectStore('legacy').put(copies,'browser-copies');await complete(t);}
  return true;
 }
 function save(next){
  if(blocked)throw Error('미저장 변경을 먼저 복구하세요.');JSON.parse(next);if(next===raw)return true;raw=next;pending++;emit();
  queue=queue.then(async()=>{
   if(blocked)return;const previous=durable,oldRev=revision;
   const changes=previous?diff(JSON.parse(previous),JSON.parse(next)):[];
   let nextHistory=(previous?[...history,{id:'change-'+(oldRev+1),at:Date.now(),changes}]:history).slice(-20);
   while(nextHistory.length&&new Blob([JSON.stringify(nextHistory)]).size>512*1024)nextHistory.shift();
   const t=db.transaction(['records','history'],'readwrite');const done=complete(t),s=t.objectStore('records');
   const current=await request(s.get('current'));if((current?.revision||0)!==oldRev){t.abort();await done.catch(()=>{});const e=Error('다른 탭의 새 기록을 덮어쓰지 않습니다.');e.name='StorageConflictError';throw e;}
   s.put({raw:next,revision:oldRev+1},'current');t.objectStore('history').put(nextHistory,'recent');await done;
   durable=next;revision=oldRev+1;history=nextHistory;try{api.onCommitted?.(next);}catch(e){console.error(e);}
  }).catch(error=>{blocked=true;globalThis.YEOKSANG_FAILED_RAW=raw;globalThis.YEOKSANG_SAVE_ERROR=error.name;api.onFailure?.(error,raw,durable);}).finally(()=>{pending--;emit();});return true;
 }
 async function retry(next){await queue;blocked=false;raw=durable;save(next);await queue;return !blocked;}
 const api=globalThis.YEOKSANG_RECORD_STORE={open,read:()=>raw,durable:()=>durable,save,retry,flush:()=>queue,subscribe:f=>{listeners.add(f);f({pending,blocked,revision});},get pending(){return pending>0;},get blocked(){return blocked;},get revision(){return revision;},history:()=>history.slice().reverse(),restore:id=>{let value=JSON.parse(durable||'{}');for(const row of history.slice().reverse()){value=reverse(value,row.changes);if(row.id===id)return value;}return null;}};
})();
