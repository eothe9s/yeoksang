/* 曆象 v11 · recovery & merge center */
'use strict';

const V11_RECOVERY_KEYS=['p11122_pre_personal_baseline_v101','p11122_pre_import_backup','p11122_pre_restore_backup'];
let V11_RECOVERY_CANDIDATES=[];

function v11DataStats(raw){
 const d=raw&&typeof raw==='object'?raw:{};
 const sumLists=o=>Object.values(o||{}).reduce((s,a)=>s+(Array.isArray(a)?a.length:0),0);
 return {
  taskDays:Object.keys(d.tasks||{}).length,tasks:sumLists(d.tasks),scheduleDays:Object.keys(d.schedules||{}).length,
  tests:(d.tests||[]).length,waiting:(d.waiting||[]).length,conditions:Object.keys(d.condition||{}).length,
  lectures:Object.keys(d.lectureState||{}).length,bookState:Object.keys(d.bookState||{}).length,
  plannerDays:Object.keys(d.plannerMeta||{}).length,closeHistory:(d.closeHistory||[]).length,
  automations:(d.automations||[]).length,recent:(d.recentLearning||[]).length
 };
}
function v11Richness(raw){const s=v11DataStats(raw);return s.taskDays*8+s.tasks*2+s.scheduleDays*5+s.tests*10+s.waiting*3+s.conditions*4+s.lectures+s.bookState+s.plannerDays*3+s.closeHistory*5+s.automations*4+s.recent*2}
function v11StatLine(s){return `할 일 ${s.tasks}개/${s.taskDays}일 · 시간표 ${s.scheduleDays}일 · 시험 ${s.tests} · 대기 ${s.waiting} · 컨디션 ${s.conditions}일 · 강의상태 ${s.lectures} · 문제집상태 ${s.bookState}`}
function v11ParseJSON(v){try{return JSON.parse(v)}catch{return null}}
function v11Candidate(label,raw,source){if(!raw||typeof raw!=='object')return null;let data;try{data=migrateDB(raw)}catch{return null}return{label,source,data,stats:v11DataStats(data),score:v11Richness(data)}}
function v11RecoveryCandidates(){
 const out=[];out.push(v11Candidate('현재 저장 데이터',deep(DB),'current'));
 try{
  for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i)||'';if(k===DB_KEY||(!k.startsWith('p11122_pre_')&&!k.startsWith('p11122_pre_migration_')))continue;
   const raw=v11ParseJSON(localStorage.getItem(k)||'');const c=v11Candidate(k,raw,k);if(c)out.push(c)
  }
  const daily=v11ParseJSON(localStorage.getItem('p11122_v100_daily_safety')||'[]');
  if(Array.isArray(daily))daily.forEach((x,i)=>{const c=v11Candidate(`${x.date||'일일'} 안전본`,v11ParseJSON(x.data||''),`daily:${i}`);if(c)out.push(c)});
  const undo=v11ParseJSON(localStorage.getItem('p11122_v60_undo')||'[]');
  if(Array.isArray(undo))undo.forEach((x,i)=>{const c=v11Candidate(`되돌리기 ${i+1}`,v11ParseJSON(x.data||''),`undo:${i}`);if(c)out.push(c)});
  const legacyKeys=['p11122_v2_tasks','p11122_v2_schedules','p11122_v30_custom_lectures','p11122_v40_problem_books','p11122_v2_tests'];
  if(legacyKeys.some(k=>localStorage.getItem(k)!=null)){const c=v11Candidate('구버전 저장키 복원본',migrateLegacy(),'legacy');if(c)out.push(c)}
 }catch(e){console.warn('recovery scan',e)}
 const dedup=[];const sig=new Set();for(const c of out.filter(Boolean).sort((a,b)=>b.score-a.score)){const s=JSON.stringify(c.stats);if(sig.has(s)&&c.source!=='current')continue;sig.add(s);dedup.push(c)}return dedup
}
function v11MergeList(oldList,currentList,keyFn){const m=new Map();for(const x of oldList||[])m.set(keyFn(x),deep(x));for(const x of currentList||[])m.set(keyFn(x),deep(x));return [...m.values()]}
function v11MergeTaskDays(oldD,curD){const out=deep(oldD||{});for(const [date,list] of Object.entries(curD||{})){const base=Array.isArray(out[date])?out[date]:[];out[date]=v11MergeList(base,list,x=>x.id||`${x.subject}|${x.name}|${x.material||''}`)}return out}
function v11MergeState(oldD,curD){const out=deep(oldD||{});for(const [k,v] of Object.entries(curD||{})){const prev=out[k]||{};out[k]={...prev,...deep(v),completed:Boolean(prev.completed||v?.completed)}}return out}
function v11MergeDB(oldRaw,currentRaw){
 const old=migrateDB(oldRaw),cur=migrateDB(currentRaw),m=deep(old);
 m.settings={...(old.settings||{}),...(cur.settings||{})};
 m.tasks=v11MergeTaskDays(old.tasks,cur.tasks);
 m.schedules={...(old.schedules||{}),...(cur.schedules||{})};
 for(const k of ['scheduleModes','scheduleHidden','automationSkips','automationRuns','condition','plannerMeta','studyOverrides','planLocks','dailyRecords','meta','courseMeta','weeklyNotes','subjectProtocols','planOverrides','protocolEffects','masteryEvidence'])m[k]={...(old[k]||{}),...(cur[k]||{})};
 m.lectureState=v11MergeState(old.lectureState,cur.lectureState);m.bookState=v11MergeState(old.bookState,cur.bookState);
 m.customLectures=v11MergeList(old.customLectures,cur.customLectures,x=>x.key||x.id||`${x.provider}|${x.name}`);
 m.books=v11MergeList(old.books,cur.books,x=>x.id||x.name);
 m.tests=v11MergeList(old.tests,cur.tests,x=>x.id||`${x.date}|${x.source}|${x.name}`);
 m.waiting=v11MergeList(old.waiting,cur.waiting,x=>x.id||`${x.subject}|${x.name}|${x.waitingSince||''}`);
 m.automations=v11MergeList(old.automations,cur.automations,x=>x.id||x.name);
 m.automationConflicts=v11MergeList(old.automationConflicts,cur.automationConflicts,x=>x.id||`${x.date}|${x.ruleId}`);
 m.scheduleTemplates=v11MergeList(old.scheduleTemplates,cur.scheduleTemplates,x=>x.id||x.name);
 m.recentLearning=v11MergeList(old.recentLearning,cur.recentLearning,x=>typeof x==='string'?x:(x.id||JSON.stringify(x)));
 m.closeHistory=v11MergeList(old.closeHistory,cur.closeHistory,x=>x.date||x.id);
 m.trash=v11MergeList(old.trash,cur.trash,x=>x.id);
 m.decisionLog=v11MergeList(old.decisionLog,cur.decisionLog,x=>x.id||`${x.at}|${x.kind}|${x.date||''}`);
 m.diagnosticSignals=v11MergeList(old.diagnosticSignals,cur.diagnosticSignals,x=>x.id||`${x.date}|${x.subject}|${x.kind}`);
 m.curriculumExtra=v11MergeList(old.curriculumExtra,cur.curriculumExtra,x=>x.id||x.name);
 m.createdAt=Math.min(Number(old.createdAt)||Date.now(),Number(cur.createdAt)||Date.now());
 return migrateDB(m)
}
function v11PreviewCandidate(index){const c=V11_RECOVERY_CANDIDATES[index],box=$('#recoveryPreview');if(!c||!box)return;const current=v11DataStats(DB),merged=v11DataStats(v11MergeDB(c.data,DB));box.innerHTML=`<div class="recovery-compare"><div><span>현재</span><b>${esc(v11StatLine(current))}</b></div><div><span>${esc(c.label)}</span><b>${esc(v11StatLine(c.stats))}</b></div><div><span>병합 후</span><b>${esc(v11StatLine(merged))}</b></div></div>`}
function v11ApplyCandidate(index){const c=V11_RECOVERY_CANDIDATES[index];if(!c||c.source==='current')return;const merged=v11MergeDB(c.data,DB),before=v11DataStats(DB),after=v11DataStats(merged);if(!confirm(`기존 기록과 병합할까요?\n\n현재: ${v11StatLine(before)}\n병합 후: ${v11StatLine(after)}\n\n현재 상태는 복구 직전 안전본으로 남깁니다.`))return;safeSetItem('p11122_pre_v11_recovery',JSON.stringify(DB),{silent:true});DB=merged;ensureV100DB();LAST_SAVED_JSON=JSON.stringify(DB);safeSetItem(DB_KEY,LAST_SAVED_JSON,{silent:true});alert('기존 기록을 삭제하지 않고 병합했습니다.');viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);navigate('dashboard')}
function renderRecoveryCenterV11(){
 const box=$('#recoveryCandidates');if(!box)return;
 V11_RECOVERY_CANDIDATES=v11RecoveryCandidates();
 const current=V11_RECOVERY_CANDIDATES.find(x=>x.source==='current'),best=V11_RECOVERY_CANDIDATES[0];
 const rows=V11_RECOVERY_CANDIDATES.map((c,i)=>{
  const action=c.source==='current'?'<span class="badge">사용 중</span>':`<button class="btn primary small recovery-merge-btn" data-i="${i}">현재와 병합</button>`;
  const bestClass=(c===best&&c.source!=='current')?' best':'';
  return `<div class="recovery-row${bestClass}"><div><b>${esc(c.label)}</b><span>${esc(v11StatLine(c.stats))}</span></div><div class="row"><button class="btn ghost small recovery-preview-btn" data-i="${i}">비교</button>${action}</div></div>`;
 });
 box.innerHTML=rows.join('')||'<div class="empty-state">복구 후보가 없습니다.</div>';
 if(best&&current&&best.source!=='current'&&best.score>current.score*1.12)box.insertAdjacentHTML('afterbegin','<div class="banner warn">현재 데이터보다 풍부한 이전 안전본이 발견되었습니다. 먼저 비교한 뒤 병합하세요.</div>');
 $$('.recovery-preview-btn').forEach(b=>b.onclick=()=>v11PreviewCandidate(Number(b.dataset.i)));
 $$('.recovery-merge-btn').forEach(b=>b.onclick=()=>v11ApplyCandidate(Number(b.dataset.i)));
}
function v11MergeImportFile(file){const r=new FileReader();r.onload=()=>{try{const raw=JSON.parse(r.result),candidate=raw.app?.name==='曆象'?convertYeoksangBackup(raw):migrateDB(raw),before=v11DataStats(DB),incoming=v11DataStats(candidate),merged=v11MergeDB(candidate,DB),after=v11DataStats(merged);if(!confirm(`백업 병합 미리보기\n현재: ${v11StatLine(before)}\n파일: ${v11StatLine(incoming)}\n병합 후: ${v11StatLine(after)}\n\n기존 기록을 유지하면서 합칠까요?`))return;safeSetItem('p11122_pre_v11_file_merge',JSON.stringify(DB),{silent:true});DB=merged;ensureV100DB();LAST_SAVED_JSON=JSON.stringify(DB);safeSetItem(DB_KEY,LAST_SAVED_JSON,{silent:true});alert('백업 파일을 현재 기록과 병합했습니다.');navigate('dashboard')}catch(e){console.error(e);alert('지원하는 曆象 또는 이전 11122 호환 JSON인지 확인하세요.')}};r.readAsText(file)}

document.addEventListener('DOMContentLoaded',()=>{const scan=$('#scanRecovery');if(scan)scan.onclick=renderRecoveryCenterV11;const merge=$('#mergeImportData');if(merge)merge.onchange=e=>{if(e.target.files?.[0])v11MergeImportFile(e.target.files[0]);e.target.value=''};$$('#mainNav button[data-page="settings"]').forEach(b=>b.addEventListener('click',()=>setTimeout(renderRecoveryCenterV11,0)));setTimeout(renderRecoveryCenterV11,20)});
