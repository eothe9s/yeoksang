// 曆象 v2.5.1 companion patch · Widget LIVE Sync 1.0
// 핵심 DB 저장 성공 후 snapshot을 즉시 큐에 넣고 약 180ms 뒤 업로드합니다.
// 네트워크 실패 시 작은 pending snapshot만 보존하고 online/pagehide/visibilitychange 때 재시도합니다.
// 핵심 DB / LAST_SAVED_JSON / 기존 저장 절차는 변경하지 않습니다.
(() => {
'use strict';

const YW_URL_KEY='yeoksang_widget_sync_url';
const YW_TOKEN_KEY='yeoksang_widget_sync_token';
const YW_LAST_KEY='yeoksang_widget_sync_last';
const YW_PENDING_KEY='yeoksang_widget_sync_pending_v2';
const YW_SCHEMA='yeoksang-widget-snapshot-v1';

let ywTimer=null;
let ywBusy=false;
let ywRunAgain=false;
let ywPendingMemory=null;
let ywSeq=0;

function ywGet(key){try{return localStorage.getItem(key)||''}catch{return''}}
function ywSet(key,value){try{localStorage.setItem(key,value);return true}catch{return false}}
function ywDel(key){try{localStorage.removeItem(key)}catch{}}
function ywConfig(){return{url:ywGet(YW_URL_KEY).trim().replace(/\/+$/,''),token:ywGet(YW_TOKEN_KEY).trim()}}
function ywNum(v){const n=Number(v);return Number.isFinite(n)?n:0}
function ywTaskDone(t){return !!(t?.done||((t?.components||[]).length&&(t.components||[]).every(c=>c?.done)))}
function ywClock(v){
  if(typeof plannerMinute==='function'){try{return plannerMinute(v)}catch{}}
  const m=String(v||'').match(/^(\d{1,2}):(\d{2})$/);if(!m)return null;
  let h=Number(m[1]),n=Number(m[2]);if(h<5)h+=24;return h*60+n;
}
function ywDate(){return typeof todayDate==='function'?todayDate():new Date().toISOString().slice(0,10)}

function ywMinimalTask(t){
  return{
    id:t.id,
    subject:t.subject||'',
    name:t.name||'',
    material:t.material||'',
    minutes:ywNum(t.minutes)||0,
    done:ywTaskDone(t),
    components:(t.components||[]).map(c=>({id:c.id||'',label:c.label||c.name||'',done:!!c.done}))
  };
}

function ywTimeline(date,tasks){
  const taskIds=new Set(tasks.map(t=>t.id));
  const raw=typeof capacityScheduleSnapshotV10==='function'
    ? capacityScheduleSnapshotV10(date)
    : (Array.isArray(DB?.schedules?.[date])?DB.schedules[date]:[]);
  return raw
    .filter(b=>b&&typeof b==='object')
    .map(b=>{
      const sourceIds=[
        ...(Array.isArray(b.taskIds)?b.taskIds:[]),
        ...Object.keys(b.taskAllocations||{})
      ];
      const ids=[...new Set(sourceIds.filter(id=>taskIds.has(id)))];
      const allocations={};
      for(const id of ids){
        const n=ywNum(b.taskAllocations?.[id]);
        if(n>0)allocations[id]=n;
      }
      return{
        id:b.id||'', start:b.start||'', end:b.end||'',
        name:b.name||'', type:b.type||'', selfStudy:!!b.selfStudy,
        study:b.study||'', school:b.school||'', period:b.period||null,
        done:!!b.done, taskIds:ids, taskAllocations:allocations
      };
    })
    .filter(b=>b.start||b.end||b.name||b.study||b.school||b.taskIds.length)
    .sort((a,b)=>(ywClock(a.start)??99999)-(ywClock(b.start)??99999));
}

function ywFallbackPlan(tasks,timeline){
  const assigned=new Map();
  for(const b of timeline){
    for(const [id,n] of Object.entries(b.taskAllocations||{})){
      assigned.set(id,(assigned.get(id)||0)+ywNum(n));
    }
  }
  let total=0,unknown=0;
  for(const t of tasks){
    const a=assigned.get(t.id)||0,m=ywNum(t.minutes);
    if(!a&&!m)unknown++;
    total+=Math.max(a,m);
  }
  return{total,unknown};
}

function ywWorkload(date){
  let low=0,high=0,unknown=0;
  try{
    if(typeof curriculumLoadV90==='function'){
      const x=curriculumLoadV90(date);
      low=Math.max(0,Math.round(ywNum(x?.todayLow)*60));
      high=Math.max(low,Math.round(ywNum(x?.todayHigh)*60));
      unknown=Array.isArray(x?.unknown)?x.unknown.length:0;
    }
  }catch{}
  return{low,high,unknown};
}

function ywPlan(date,tasks,timeline){
  try{
    if(typeof y21Plan==='function'){
      const p=y21Plan(date);
      return{minutes:Math.max(0,Math.round(ywNum(p?.total))),unknown:ywNum(p?.unknown)};
    }
  }catch{}
  const p=ywFallbackPlan(tasks,timeline);
  return{minutes:Math.round(p.total),unknown:p.unknown};
}

function ywBuildSnapshot(date=ywDate(),reason='save'){
  const sourceTasks=Array.isArray(DB?.tasks?.[date])?DB.tasks[date]:[];
  const tasks=sourceTasks.map(ywMinimalTask);
  const timeline=ywTimeline(date,tasks);
  const completed=tasks.filter(ywTaskDone).length;
  const need=ywWorkload(date);
  const plan=ywPlan(date,tasks,timeline);
  const csat=DB?.personalBaseline?.csat||DB?.settings?.csat||'2026-11-19';
  const now=Date.now();

  return{
    schema:YW_SCHEMA,
    source:'YEOKSANG-v2.5.1-widget-live-1.0',
    date,
    csat,
    updatedAt:now,
    revision:`${now}-${++ywSeq}`,
    reason,
    tasks,
    timeline,
    today:{
      completed,
      total:tasks.length,
      needLow:need.low,
      needHigh:need.high,
      needUnknown:need.unknown,
      planned:plan.minutes,
      planUnknown:plan.unknown
    }
  };
}

function ywStatus(text,state=''){
  const el=document.getElementById('widgetSyncStatus');
  if(el){el.textContent=text;el.dataset.state=state}
}
function ywLastText(){
  const n=Number(ywGet(YW_LAST_KEY));
  if(!n)return'업로드 기록 없음';
  try{
    return new Date(n).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }catch{return'업로드됨'}
}

function ywReadPending(){
  if(ywPendingMemory)return ywPendingMemory;
  try{
    const raw=ywGet(YW_PENDING_KEY);
    if(!raw)return null;
    const p=JSON.parse(raw);
    if(p&&p.schema===YW_SCHEMA){ywPendingMemory=p;return p}
  }catch{}
  return null;
}
function ywStorePending(payload){
  ywPendingMemory=payload;
  // 저장소가 꽉 찬 경우에도 메모리 큐는 유지한다.
  ywSet(YW_PENDING_KEY,JSON.stringify(payload));
}
function ywClearPending(revision){
  const cur=ywReadPending();
  if(cur&&cur.revision&&revision&&cur.revision!==revision)return;
  ywPendingMemory=null;
  ywDel(YW_PENDING_KEY);
}
function ywQueue(reason='save'){
  const c=ywConfig();
  if(!c.url||!c.token)return null;
  const payload=ywBuildSnapshot(ywDate(),reason);
  ywStorePending(payload);
  ywStatus(`업로드 대기 · ${new Date(payload.updatedAt).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`,'busy');
  return payload;
}

async function ywFlush({show=false,reason='flush'}={}){
  const c=ywConfig();
  if(!c.url||!c.token){
    if(show)ywStatus('Worker 주소와 동기화 키를 먼저 저장해','warn');
    return false;
  }

  if(ywBusy){
    ywRunAgain=true;
    return false;
  }

  let payload=ywReadPending();
  if(!payload){
    payload=ywQueue(reason);
    if(!payload)return false;
  }

  ywBusy=true;
  ywStatus('LIVE 업로드 중…','busy');

  const sentRevision=payload.revision||String(payload.updatedAt||'');
  const controller=typeof AbortController!=='undefined'?new AbortController():null;
  const timeout=controller?setTimeout(()=>controller.abort(),8000):null;

  try{
    const res=await fetch(`${c.url}/snapshot`,{
      method:'POST',
      headers:{
        'content-type':'application/json',
        'authorization':`Bearer ${c.token}`,
        'cache-control':'no-store'
      },
      body:JSON.stringify(payload),
      cache:'no-store',
      keepalive:true,
      signal:controller?.signal
    });
    if(!res.ok)throw new Error(`HTTP ${res.status}`);

    ywSet(YW_LAST_KEY,String(Date.now()));
    ywClearPending(sentRevision);

    const newer=ywReadPending();
    ywStatus(
      newer
        ? `새 변경 대기 · 마지막 업로드 ${ywLastText()}`
        : `LIVE · 마지막 업로드 ${ywLastText()}`,
      newer?'busy':'ok'
    );
    return true;
  }catch(err){
    // pending은 지우지 않는다. 온라인 복귀나 다음 저장에서 다시 보낸다.
    ywStatus(`재전송 대기 · ${err?.name==='AbortError'?'시간 초과':(err?.message||'network')}`,'bad');
    return false;
  }finally{
    if(timeout)clearTimeout(timeout);
    ywBusy=false;
    if(ywRunAgain||ywReadPending()){
      ywRunAgain=false;
      ywScheduleFlush(260);
    }
  }
}

function ywScheduleFlush(delay=180){
  const c=ywConfig();
  if(!c.url||!c.token)return;
  clearTimeout(ywTimer);
  ywTimer=setTimeout(()=>{ywFlush()},delay);
}

function ywQueueAndSchedule(reason='save',delay=180){
  if(!ywQueue(reason))return;
  ywScheduleFlush(delay);
}

function ywSaveConfig(){
  const url=document.getElementById('widgetSyncUrl')?.value.trim().replace(/\/+$/,'')||'';
  const token=document.getElementById('widgetSyncToken')?.value.trim()||'';

  if(!/^https:\/\//i.test(url)){
    ywStatus('https:// 로 시작하는 Worker 주소가 필요해','bad');
    return false;
  }
  if(token.length<16){
    ywStatus('동기화 키가 너무 짧아','bad');
    return false;
  }
  if(!ywSet(YW_URL_KEY,url)||!ywSet(YW_TOKEN_KEY,token)){
    ywStatus('연결 정보를 브라우저에 저장하지 못했어','bad');
    return false;
  }
  ywStatus(`연결 저장됨 · 마지막 업로드 ${ywLastText()}`,'ok');
  return true;
}

function ywInitUI(){
  const u=document.getElementById('widgetSyncUrl');
  const t=document.getElementById('widgetSyncToken');
  if(!u||!t)return;

  const c=ywConfig();
  u.value=c.url;
  t.value=c.token;

  const pending=!!ywReadPending();
  ywStatus(
    c.url&&c.token
      ? (pending?`재전송 대기 · 마지막 업로드 ${ywLastText()}`:`LIVE 준비 · 마지막 업로드 ${ywLastText()}`)
      : '연결 전',
    pending?'busy':''
  );

  document.getElementById('widgetSyncSave')?.addEventListener('click',()=>{
    if(ywSaveConfig())ywQueueAndSchedule('connect',0);
  });

  document.getElementById('widgetSyncTest')?.addEventListener('click',async()=>{
    if(!ywSaveConfig())return;
    ywQueue('manual');
    const ok=await ywFlush({show:true,reason:'manual'});
    if(ok)ywStatus(`LIVE · 즉시 업로드 ${ywLastText()}`,'ok');
  });

  document.getElementById('widgetSyncDisconnect')?.addEventListener('click',()=>{
    ywDel(YW_URL_KEY);
    ywDel(YW_TOKEN_KEY);
    ywDel(YW_LAST_KEY);
    ywDel(YW_PENDING_KEY);
    ywPendingMemory=null;
    u.value='';
    t.value='';
    ywStatus('연결 해제됨','');
  });

  if(c.url&&c.token){
    // 앱을 열 때 현재 상태를 한 번 밀어 넣어 서버가 오늘 snapshot을 갖게 한다.
    if(!ywReadPending())ywQueue('app-open');
    ywScheduleFlush(350);
  }
}

// 기존 저장 래퍼 체인을 보존하고, saveDB가 true일 때만 snapshot을 큐에 넣는다.
if(typeof __impl_saveDB==='function'){
  const ywSaveBase=__impl_saveDB;
  __impl_saveDB=function(...args){
    const ok=ywSaveBase.apply(this,args);
    if(ok&&!globalThis.YEOKSANG_STARTING)ywQueueAndSchedule('save',180);
    return ok;
  };
}

// 페이지를 닫거나 백그라운드로 보내기 직전 최신 pending을 keepalive fetch로 밀어본다.
window.addEventListener('online',()=>ywScheduleFlush(0));
window.addEventListener('focus',()=>{if(ywReadPending())ywScheduleFlush(0)});
window.addEventListener('pageshow',()=>{if(ywReadPending())ywScheduleFlush(0)});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'){
    if(ywReadPending())ywFlush({reason:'hidden'});
  }else if(ywReadPending()){
    ywScheduleFlush(0);
  }
});
window.addEventListener('pagehide',()=>{
  if(ywReadPending())ywFlush({reason:'pagehide'});
});

// 앱이 열린 채 네트워크가 잠깐 끊겼다가 살아나는 상황을 위한 가벼운 재시도.
setInterval(()=>{
  if(ywReadPending()&&navigator.onLine!==false)ywScheduleFlush(0);
},15000);

globalThis.YEOKSANG_WIDGET_SYNC={
  buildSnapshot:ywBuildSnapshot,
  queue:()=>ywQueue('manual-api'),
  syncNow:async()=>{ywQueue('manual-api');return ywFlush({show:true,reason:'manual-api'})},
  pending:()=>ywReadPending(),
  schedule:ywScheduleFlush
};


// Service worker lifecycle is owned by the app. Widget sync never re-registers it.
document.addEventListener('DOMContentLoaded',()=>{ywInitUI();},{once:true});
})();
