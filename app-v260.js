/* 曆象 2.6 — durable records and editable daily schedules. */
'use strict';
const Y260_BUILD='20261012-records-schedule-1';
const y260Filters={lecture:'progress',book:'progress'};
const y260Store=globalThis.YEOKSANG_RECORD_STORE;
const y260Exact=m=>{const x=((Math.round(m)%1440)+1440)%1440;return `${String(Math.floor(x/60)).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`;};

// User selection supersedes recurring and one-off events, not sleep boundaries.
const y260Constraints=fixedConstraintsForDateV10;
fixedConstraintsForDateV10=date=>DB.scheduleModes?.[date]?.userSelected?[]:y260Constraints(date);
function y260MockSchedule(date){
 const specs=[['morning','아침 자습','07:50','08:30','self'],['mock1','1교시 자습','08:40','10:00','self'],['mock-break1','휴식','10:00','10:30','break'],['mock2','2교시 자습','10:30','12:10','self'],['lunch','점심','12:10','13:10','meal'],['mock3','3교시 자습','13:10','14:20','self'],['mock-break3','휴식','14:20','14:50','break'],['mock4','4교시 자습','14:50','16:37','self'],['mock-break4','휴식','16:37','16:50','break'],['after','오후 자습','16:50','17:45','self'],['dinner','석식','17:45','18:40','meal'],['night1','야간자율학습 1','18:40','20:20','self'],['break','휴식','20:20','20:30','break'],['night2','야간자율학습 2','20:30','22:00','self']];
 return specs.map(([key,name,start,end,type])=>fixedBlock(date,key,{name,start,end,type,selfStudy:type==='self',device:type==='self'&&key!=='morning',locked:false}));
}
splitStudyBlockByConstraintV10=function(block,c,date){
 const bi=intervalFromTimesV10(block.start,block.end),ci=intervalFromTimesV10(c.start,c.end);if(!bi||!ci||bi.end<=ci.start||ci.end<=bi.start)return[block];
 return [{start:bi.start,end:Math.min(bi.end,ci.start)},{start:Math.max(bi.start,ci.end),end:bi.end}].filter(x=>x.end>x.start).map((p,i)=>({...block,id:i?block.id+'-split-'+c.id:block.id,baseKey:i?(block.baseKey||'block')+'-split-'+c.id:block.baseKey,start:y260Exact(p.start),end:y260Exact(p.end)}));
};
__impl_baseSchedule=function(date){
 const pref=scheduleModeFor(date),wd=parseDate(date).getDay(),useMock=pref.mode==='mock'||(!DB.scheduleModes?.[date]&&date>='2026-10-26'&&date<='2026-11-18'&&wd>=1&&wd<=5);
 let blocks=useMock?y260MockSchedule(date):baseScheduleV10Core(date).map(deep);
 for(const c of fixedConstraintsForDateV10(date)){blocks=blocks.flatMap(b=>splitStudyBlockByConstraintV10(b,c,date));blocks.push(fixedBlock(date,'constraint-'+c.id,{name:c.label,start:c.start,end:c.end,type:c.type||'class',selfStudy:false,device:false,locked:true}));}return sortBlocks(blocks);
};
const y260MergeSchedule=mergeSchedule;
mergeSchedule=function(date,old){const rows=y260MergeSchedule(date,old);for(const b of rows){const o=(old||[]).find(x=>x.id===b.id||x.baseKey&&x.baseKey===b.baseKey);if(o?.userOverrides?.locked!=null)b.locked=o.userOverrides.locked;}return rows;};
setDayScheduleMode=function(date,mode,templateId=null){
 if(!['default','mock','saturday','off','template'].includes(mode)||mode==='template'&&!scheduleTemplateById(templateId))return false;
 return commitChange(()=>{
  const old=deep(DB.schedules[date]||[]);DB.scheduleHistory=DB.scheduleHistory||{};const retained=new Map((DB.scheduleHistory[date]||[]).map(b=>[b.id,b]));
  for(const b of old)if(b.actualMin!=null||b.done||(b.taskIds||[]).length)retained.set(b.id,b);if(retained.size)DB.scheduleHistory[date]=[...retained.values()];
  DB.scheduleModes[date]={mode,templateId:mode==='template'?templateId:null,userSelected:true};delete DB.scheduleHidden[date];DB.schedules[date]=[];
  const keys=new Set(baseSchedule(date).map(b=>b.baseKey));DB.schedules[date]=old.filter(b=>keys.has(b.baseKey));
 });
};
__impl_capacityHoursFor=function(date){
 const explicit=DB.scheduleModes?.[date]?.userSelected;
 if(!explicit&&(DB.settings.zeroCapacityDates||[]).includes(date))return 0;
 const actual=capacityMinutesFromScheduleV10(date)/60,override=DB.settings.capacityOverrides?.[date];
 if(override!=null)return Math.min(actual,y21Number(override));
 if(DB.settings.capacityMode==='manual')return Math.min(actual,y21Number(isWeekend(date)?DB.settings.weekendCapacityHours:DB.settings.weekdayCapacityHours));return actual;
};
const y260ModeControls=renderScheduleModeControls;
const y260ModeLabel=scheduleModeLabel;
scheduleModeLabel=date=>scheduleModeFor(date).mode==='mock'||(!DB.scheduleModes?.[date]&&date>='2026-10-26'&&date<='2026-11-18'&&parseDate(date).getDay()>=1&&parseDate(date).getDay()<=5)?'모의고사 시종 · 자습':y260ModeLabel(date);
renderScheduleModeControls=function(){y260ModeControls();const sel=$('#scheduleModeSelect');if(!sel)return;if(!sel.querySelector('option[value="mock"]')){const o=document.createElement('option');o.value='mock';o.textContent='모의고사 시종 · 자습';sel.appendChild(o);}const wd=parseDate(viewDate).getDay(),auto=!DB.scheduleModes?.[viewDate]&&viewDate>='2026-10-26'&&viewDate<='2026-11-18'&&wd>=1&&wd<=5;if(auto||scheduleModeFor(viewDate).mode==='mock'){sel.value='mock';$('#scheduleModeBadge').textContent='모의고사 시종 · 자습';}};
const y260BlockOpen=openBlockModal;
openBlockModal=function(...args){y260BlockOpen(...args);$('#blockSelfStudy').checked=$('#blockType').value==='self';$('#blockName').disabled=false;};
const y260BlockSave=__impl_saveBlockModal;
__impl_saveBlockModal=function(){
 $('#blockSelfStudy').checked=$('#blockType').value==='self';const date=$('#blockDate').value||viewDate,id=$('#blockId').value;
 const actual=$('#blockActual').value,span=durationMin($('#blockStart').value,$('#blockEnd').value);if(actual!==''&&(!Number.isFinite(Number(actual))||Number(actual)<0||Number(actual)>span)){alert('실제 시간은 블록 길이 이내의 분으로 입력하세요.');return;}
 const before=deep(DB);try{y260BlockSave();const b=DB.schedules[date]?.find(b=>b.id===id);if(b?.fixed){b.userOverrides={...(b.userOverrides||{}),locked:b.locked};saveDB();}renderWeekIfVisible();}catch(e){DB=before;throw e;}
};
function renderWeekIfVisible(){if($('#week')?.classList.contains('active'))renderWeek();}

// Actual time is explicit. Recorded blocks cover their linked task minutes once.
studyTotal=function(date){
 if(DB.studyOverrides?.[date]!=null)return{minutes:Math.max(0,Number(DB.studyOverrides[date])||0),source:'직접 확정',recorded:true};
 const all=new Map((DB.scheduleHistory?.[date]||[]).map(b=>[b.id,b]));for(const b of DB.schedules?.[date]||[])all.set(b.id,b);
 const explicit=[...all.values()].filter(b=>b.selfStudy&&b.actualMin!=null),covered=new Set(explicit.flatMap(b=>b.taskIds||[]));
 const spans=[],add=(start,minutes)=>{if(minutes<=0)return;const a=plannerMinute(start);if(a==null)return false;spans.push({start:a,end:a+minutes});return true;};let unplaced=0;
 for(const b of explicit){const mins=Math.max(0,Number(b.actualMin)||0);if(!add(b.start,mins))unplaced+=mins;}
 const entries=Object.values(DB.dayWork?.[date]?.entries||{}).filter(r=>r.actual?.minutes!=null);
 for(const r of entries){if(covered.has(r.original?.id))continue;const mins=Math.max(0,Number(r.actual.minutes)||0);unplaced+=mins;}
 return{minutes:Math.round(unplaced+y21Union(spans).reduce((s,x)=>s+x.end-x.start,0)),source:explicit.length?'시간표 실적 · 연결 할 일 중복 제외':entries.length?'할 일 실적':'시간 미기록',recorded:!!(explicit.length||entries.length)};
};
autoActualStudy=date=>studyTotal(date).minutes;
const y260Report=todayRecordText;
todayRecordText=function(date=viewDate){const x=studyTotal(date);return y260Report(date).replace('직접 기록한 실제:','할 일에 기록한 실제:').replace(/^하루 순공 기록:.*$/m,`하루 전체 실제: ${x.recorded?minuteLabel(x.minutes):'시간 미기록'} · ${x.source}`);};
const y260Month=renderMonth;
renderMonth=function(){y260Month();for(const el of $$('#monthCalendar [data-date]')){const date=el.dataset.date,x=studyTotal(date),status=dailyCompletion(date),label=date>todayDate()?(status.total?'계획 '+status.total:'—'):status.total?status.rate+'%':'—';el.querySelector('.month-mini').innerHTML=`${label}<br><strong class="y260-hours">${date>todayDate()||!x.recorded?'—':minuteLabel(x.minutes)}</strong>`;el.title=x.source;el.onclick=()=>{viewDate=date;$('#plannerDate').value=date;weekViewStart=mondayOf(date);navigate('planner');};}};
const y260Navigate=__impl_navigate;
__impl_navigate=function(page){if(page==='month')displayMonth=viewDate.slice(0,7);y260Navigate(page);renderVersionStatus();$('#topDate').textContent=fmtDate(viewDate);$$('#mainNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const labels={planner:'하루 시간표',week:'주간 시간표',month:'월간 시간표'};if(labels[page])$('#pageTitle').textContent=labels[page];};
const y260Week=renderWeek;
renderWeek=function(){y260Week();const dates=Array.from({length:5},(_,i)=>addDays(weekViewStart,i));$$('#weekSchedule thead th').slice(1).forEach((el,i)=>{const x=studyTotal(dates[i]),s=document.createElement('small');s.className='y260-week-time';s.textContent=x.recorded?minuteLabel(x.minutes):'—';el.appendChild(s);});$$('#weekSchedule .week-cell').forEach(b=>{b.title=b.textContent;});};
const y260WeekRank=weekSlotRank;
weekSlotRank=k=>{const map={mock1:1,'custom:08:40':1,'custom:10:00':2,'custom:10:30':3,'custom:13:10':8,'custom:14:20':9,'custom:14:50':10,'custom:16:37':11};return map[k]??y260WeekRank(k);};

// Progress filters apply to courses, not individual completed lessons.
const y260Lectures=renderLectureCatalog,y260Books=renderBookCatalog;
renderLectureCatalog=function(){y260Lectures();for(const [i,c] of allLectureCourses().entries()){const card=$$('#lectureCatalog .source-card')[i];if(!card)continue;const complete=c.total>0&&lectureCourseDone(c)>=c.total;card.classList.toggle('y260-filtered',y260Filters.lecture==='complete'?!complete:complete);}y260FilterState();};
renderBookCatalog=function(){y260Books();for(const [i,b] of DB.books.entries()){const card=$$('#bookCatalog .source-card')[i];if(!card)continue;const total=(b.subunits||[]).length,complete=total>0&&b.subunits.every(s=>bookSubDone(b.id,s));card.classList.toggle('y260-filtered',y260Filters.book==='complete'?!complete:complete);}y260FilterState();};
function y260FilterState(){$$('[data-y260-filter]').forEach(b=>b.classList.toggle('active',y260Filters[b.dataset.kind]===b.dataset.y260Filter));}
const y260Cart=buildCartTasks;
buildCartTasks=function(date){let tasks;commitChange(()=>{tasks=y260Cart(date);for(const t of tasks){t.done=false;for(const c of t.components||[]){c.review=!!c.done;c.done=false;}}});return tasks||[];};
const y260Sync=syncComponentSource;
syncComponentSource=function(c,done){
 if(c.review){c.done=!!done;return;}
 if(!done){const same=x=>x!==c&&x.done&&(c.kind==='lecture'?x.kind==='lecture'&&x.ref===c.ref:c.kind==='book'&&x.kind==='book'&&JSON.stringify(x.bookItem)===JSON.stringify(c.bookItem));if(Object.values(DB.tasks||{}).flat().some(t=>(t.components||[]).some(same))){c.done=false;return;}}
 y260Sync(c,done);
};
const y260SaveActual=y24SaveActual;
y24SaveActual=function(){y260SaveActual();renderProgress();renderVendingIfVisible();renderWeekIfVisible();};

// Storage observers only report committed data as saved or synchronize widgets.
if(y260Store){
 y260Store.onCommitted=raw=>{if(globalThis.YEOKSANG_FAILED_RAW===raw)globalThis.YEOKSANG_FAILED_RAW=null;const widget=globalThis.YEOKSANG_WIDGET_SYNC;if(widget?.queue())widget.schedule(180);};
 y260Store.onFailure=(error,failed,durable)=>{globalThis.YEOKSANG_FAILED_RAW=failed;DB=migrateDB(JSON.parse(durable||'{}'));LAST_SAVED_JSON=durable||'{}';LAST_PERSISTED_RAW=y260Store.read();globalThis.y211ShowRecovery?.('저장 실패 ('+error.name+'). 기존 기록과 미저장 변경을 내보내 주세요.');};
 undoHistory=()=>y260Store.history();
 restoreUndo=id=>{const raw=y260Store.restore(id);if(raw)y21OpenMerge(raw);};
 retryFailedSave=async()=>{const raw=globalThis.YEOKSANG_FAILED_RAW;if(!raw)return false;const ok=await y260Store.retry(raw);if(ok){DB=migrateDB(JSON.parse(raw));LAST_SAVED_JSON=raw;LAST_PERSISTED_RAW=raw;globalThis.YEOKSANG_FAILED_RAW=null;$('#y211-recovery')?.remove();navigate('dashboard');}return ok;};
 const y260Copies=exportSafetyCopies;exportSafetyCopies=function(){const values={};for(const key of safetyCopyKeys())values[key]=localStorage.getItem(key);values[DB_KEY]=y260Store.durable();if(globalThis.YEOKSANG_FAILED_RAW)values.YEOKSANG_UNSAVED=globalThis.YEOKSANG_FAILED_RAW;downloadRawRecord('YEOKSANG_STORAGE_ARCHIVE_'+todayDate()+'.json',JSON.stringify({format:'YEOKSANG_STORAGE_ARCHIVE',version:1,values}));};
 const y260StorageUI=renderStorageManagement;renderStorageManagement=function(target){y260StorageUI(target);for(const box of target?[target]:[$('#storageManager'),$('#recoveryStorageManager')].filter(Boolean)){const p=box.querySelector('p');if(p)p.textContent='주기록 IndexedDB · 최근 변경 최대 20개 / 512KB';}};
 const y260Recovery=globalThis.y211ShowRecovery;globalThis.y211ShowRecovery=function(message){y260Recovery(message);const p=$('#y211-recovery');p.querySelector('h2').textContent='기록 보호 · 曆象 2.6';const buttons=p.querySelectorAll(':scope > button');if(buttons[0])buttons[0].onclick=()=>downloadRawRecord('YEOKSANG_EXISTING_RAW.json',y260Store.durable()||'{}');};
}
document.addEventListener('DOMContentLoaded',()=>{
 const badge=document.createElement('span');badge.id='y260SaveState';badge.className='y260-save-state';badge.setAttribute('role','status');$('.top-actions')?.prepend(badge);
 y260Store?.subscribe(x=>{badge.textContent=x.blocked?'저장 실패':x.pending?'저장 중':'저장 완료';badge.dataset.state=x.blocked?'failed':x.pending?'pending':'saved';});
 $('#blockType').onchange=()=>{$('#blockSelfStudy').checked=$('#blockType').value==='self';};
 $$('[data-y260-filter]').forEach(b=>b.onclick=()=>{y260Filters[b.dataset.kind]=b.dataset.y260Filter;renderVending();});
 $('#y260PlannerReport').onclick=()=>{$('#y24ReportText').value=todayRecordText(viewDate);showModal('y24ReportModal');};
 $('#y260Today')?.addEventListener('click',()=>{viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);$('#plannerDate').value=viewDate;navigate($('.page.active')?.id||'planner');});
 const update=$('#reloadUpdate'),apply=update?.onclick;if(apply)update.onclick=async()=>{await y260Store?.flush();if(!y260Store?.blocked)apply();};
 renderVersionStatus();
});
window.addEventListener('beforeunload',e=>{if(y260Store?.pending){e.preventDefault();e.returnValue='';}});
