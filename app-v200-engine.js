/* 曆象 v2 · closed-loop perfect-score decision engine */
'use strict';

const V10_OCT_EXAM='2026-10-20';
const V10_CURRICULUM_CLOSE='2026-10-16';
const V10_CSAT='2026-11-19';
const V10_ENGINE_VERSION='2.0';
const V10_MAX_SCORE={국어:100,수학:100,영어:100,사회문화:50,경제:50};
const V10_FIXED_CONSTRAINTS=[
 {id:'pe-mon',label:'체대입시학원',startDate:'2026-09-07',weekdays:[1],start:'19:00',end:'21:30',type:'class'},
 {id:'pe-wed',label:'체대입시학원',startDate:'2026-09-07',weekdays:[3],start:'19:00',end:'21:30',type:'class'},
 {id:'pe-sat',label:'체대입시학원',startDate:'2026-09-07',weekdays:[6],start:'19:00',end:'21:00',type:'class'},
 {id:'sat-mock',label:'학교 실모',startDate:'2026-09-07',weekdays:[6],start:'10:00',end:'12:00',type:'class'}
];
const V10_SPECIAL_BLOCKS=[
 {id:'afa-1007',date:'2026-10-07',label:'공군사관학교 면접',start:'05:00',end:'23:00',type:'class'},
 {id:'afa-1008',date:'2026-10-08',label:'공군사관학교 면접',start:'05:00',end:'23:00',type:'class'}
];

function ensureV100DB(){
 DB.settings=DB.settings||{};
 if(!DB.courseMeta||typeof DB.courseMeta!=='object'||Array.isArray(DB.courseMeta))DB.courseMeta={};
 if(!DB.weeklyNotes||typeof DB.weeklyNotes!=='object'||Array.isArray(DB.weeklyNotes))DB.weeklyNotes={};
 if(!DB.subjectProtocols||typeof DB.subjectProtocols!=='object'||Array.isArray(DB.subjectProtocols))DB.subjectProtocols={};
 if(!Array.isArray(DB.curriculumExtra))DB.curriculumExtra=[];
 if(!Array.isArray(DB.constraints))DB.constraints=[];
 if(!Array.isArray(DB.tests))DB.tests=[];
 if(!Array.isArray(DB.waiting))DB.waiting=[];
 DB.tasks=DB.tasks&&typeof DB.tasks==='object'&&!Array.isArray(DB.tasks)?DB.tasks:{};
 DB.schedules=DB.schedules&&typeof DB.schedules==='object'&&!Array.isArray(DB.schedules)?DB.schedules:{};
 if(!DB.settings.curriculumDeadline)DB.settings.curriculumDeadline=V10_CURRICULUM_CLOSE;
 if(!DB.settings.capacityMode)DB.settings.capacityMode='schedule';
 if(DB.settings.weekdayCapacityHours==null)DB.settings.weekdayCapacityHours=10;
 if(DB.settings.weekendCapacityHours==null)DB.settings.weekendCapacityHours=14;
 if(!DB.settings.studyCutoff)DB.settings.studyCutoff='';
 if(!Array.isArray(DB.decisionLog))DB.decisionLog=[];
 if(!DB.planOverrides||typeof DB.planOverrides!=='object'||Array.isArray(DB.planOverrides))DB.planOverrides={};
 if(!DB.protocolEffects||typeof DB.protocolEffects!=='object'||Array.isArray(DB.protocolEffects))DB.protocolEffects={};
 if(!DB.masteryEvidence||typeof DB.masteryEvidence!=='object'||Array.isArray(DB.masteryEvidence))DB.masteryEvidence={};
 if(!Array.isArray(DB.diagnosticSignals))DB.diagnosticSignals=[];
 if(!DB.meta||typeof DB.meta!=='object')DB.meta={};
 DB.meta.v10Engine={version:V10_ENGINE_VERSION,lastReadyAt:Date.now()};
 DB.schema=SCHEMA_VERSION;
 saveDB({undo:false});
}
function applyPersonalBaselineV101(){
 const b=globalThis.P11122_V101_BASELINE;if(!b||DB.meta?.personalBaselineV101Applied)return;
 try{safeSetItem('p11122_pre_personal_baseline_v101',JSON.stringify(DB),{silent:true})}catch{}
 DB.courseMeta=DB.courseMeta||{};for(const [id,base] of Object.entries(b.courseMeta||{})){const cur=DB.courseMeta[id]||{};DB.courseMeta[id]={...deep(base),...cur,mastery:{...(base.mastery||{}),...(cur.mastery||{})}}}
 DB.curriculumExtra=Array.isArray(DB.curriculumExtra)?DB.curriculumExtra:[];for(const x of b.curriculumExtra||[]){if(!DB.curriculumExtra.some(y=>y.id===x.id))DB.curriculumExtra.push(deep(x))}
 DB.subjectProtocols=DB.subjectProtocols||{};for(const [sub,rules] of Object.entries(b.subjectProtocols||{})){if(!Array.isArray(DB.subjectProtocols[sub])||DB.subjectProtocols[sub].length===0)DB.subjectProtocols[sub]=deep(rules)}
 DB.diagnosticSignals=Array.isArray(DB.diagnosticSignals)?DB.diagnosticSignals:[];for(const x of b.diagnosticSignals||[]){if(!DB.diagnosticSignals.some(y=>y.date===x.date&&y.subject===x.subject&&y.kind===x.kind))DB.diagnosticSignals.push(deep(x))}
 if(b.test&&!DB.tests.some(t=>t.id===b.test.id))DB.tests.push(normalizeTestRecord(deep(b.test)));
 for(const [key,minDone] of Object.entries(b.lectureMinimums||{})){for(let i=1;i<=Number(minDone||0);i++){const ref=`${key}::${i}`;if(!DB.lectureState[ref]?.completed)DB.lectureState[ref]={...(DB.lectureState[ref]||{}),completed:true,plannedDate:DB.lectureState[ref]?.plannedDate||''}}}
 for(const [bookId,minDone] of Object.entries(b.bookMinimums||{})){const book=DB.books.find(x=>x.id===bookId);if(!book)continue;for(const sub of (book.subunits||[]).slice(0,Number(minDone||0))){const k=bookSubKey(bookId,sub);if(!DB.bookState[k]?.completed)DB.bookState[k]={...(DB.bookState[k]||{}),completed:true}}}
 for(const [key,total] of Object.entries(b.customTotals||{})){const c=DB.customLectures.find(x=>x.key===key);if(c&&Number(total)>0)c.total=Number(total)}
 for(const [key,exact] of Object.entries(b.exactIfNoNewActivity||{})){const hasNew=Object.entries(DB.tasks||{}).some(([date,list])=>date>b.asOf&&(list||[]).some(t=>(t.components||[]).some(c=>c.kind==='lecture'&&String(c.ref||'').startsWith(key+'::'))));if(!hasNew&&Number(exact)===0){for(const ref of Object.keys(DB.lectureState||{}))if(ref.startsWith(key+'::'))delete DB.lectureState[ref]}}
 DB.meta=DB.meta||{};DB.meta.personalBaselineV101Applied={at:Date.now(),asOf:b.asOf||''};saveDB({undo:false});
}
ensureV100DB();
// Personal recovery is explicit; never reset progress automatically at startup.

/* ---------- goal stages ---------- */
__impl_activeStage=activeStage__impl2;
function activeStage__impl2(date=todayDate()){
 if(date<=EXAM9)return{key:'nine',title:'9월 모의평가 분석',target:EXAM9,goals:GOAL9,label:'완료된 기준점'};
 if(date<=V10_OCT_EXAM)return{key:'oct',title:'10월 학력평가 만점 대비',target:V10_OCT_EXAM,goals:{국어:1,수학:1,영어:1,사회문화:1,경제:1},perfect:true,label:'중간 검증'};
 return{key:'csat',title:'수능 만점 대비',target:V10_CSAT,goals:GOAL_CSAT,perfect:true,label:'최종 목표'};
};

/* ---------- real timetable constraints ---------- */
function fixedConstraintsForDateV10(date){
 const wd=parseDate(date).getDay(),rows=[];
 V10_FIXED_CONSTRAINTS.filter(x=>x.weekdays.includes(wd)&&(!x.startDate||date>=x.startDate)&&(!x.endDate||date<=x.endDate)).forEach(x=>rows.push({...x,date}));
 V10_SPECIAL_BLOCKS.filter(x=>x.date===date).forEach(x=>rows.push({...x}));
 return rows;
}
function intervalFromTimesV10(start,end){const a=plannerMinute(start),dur=durationMin(start,end);return a==null||!dur?null:{start:a,end:a+dur}}
function splitStudyBlockByConstraintV10(block,constraint,date){
 if(!block.start||!block.end)return[block];
 const bi=intervalFromTimesV10(block.start,block.end),ci=intervalFromTimesV10(constraint.start,constraint.end);if(!bi||!ci||bi.end<=ci.start||ci.end<=bi.start)return[block];
 const pieces=[];
 if(bi.start<ci.start)pieces.push({start:bi.start,end:Math.min(bi.end,ci.start)});
 if(ci.end<bi.end)pieces.push({start:Math.max(bi.start,ci.end),end:bi.end});
 const toTime=m=>plannerIndexToTime(Math.round((m-300)/10));
 return pieces.filter(p=>p.end-p.start>=10).map((p,i)=>({...block,baseKey:i===0?block.baseKey:`${block.baseKey||'block'}-split-${constraint.id}-${i}`,id:i===0?block.id:`${block.id||uid()}-split-${i}`,name:i===0?block.name:`${block.name} · 이어서`,start:toTime(p.start),end:toTime(p.end)}));
}
const baseScheduleV10Core=baseSchedule__impl1;
__impl_baseSchedule=baseSchedule__impl2;
function baseSchedule__impl2(date){
 let blocks=baseScheduleV10Core(date).map(x=>deep(x));
 for(const c of fixedConstraintsForDateV10(date)){
  blocks=blocks.flatMap(b=>splitStudyBlockByConstraintV10(b,c,date));
  blocks.push(fixedBlock(date,`constraint-${c.id}`,{name:c.label,type:c.type||'class',selfStudy:false,device:false,start:c.start,end:c.end,locked:true}));
 }
 return sortBlocks(blocks);
};

function capacityScheduleSnapshotV10(date){return mergeSchedule(date,Array.isArray(DB.schedules?.[date])?DB.schedules[date]:[])}
function capacityMinutesFromScheduleV10(date){
 const cutoff=plannerMinute(hardStudyCutoff()),blocks=capacityScheduleSnapshotV10(date);let total=0;
 for(const b of blocks){if(!b.selfStudy||!b.start||!b.end)continue;let i=intervalFromTimesV10(b.start,b.end);if(!i)continue;if(cutoff!=null)i.end=Math.min(i.end,cutoff);if(i.end>i.start)total+=i.end-i.start}
 return Math.max(0,total);
}
__impl_capacityHoursFor=capacityHoursFor__impl2;
function capacityHoursFor__impl2(date){
 if(DB.settings.capacityOverrides?.[date]!=null)return Math.max(0,Number(DB.settings.capacityOverrides[date])||0);
 if((DB.settings.zeroCapacityDates||[]).includes(date)||['2026-10-07','2026-10-08'].includes(date))return 0;
 if(DB.settings.capacityMode!=='manual'){
  const m=capacityMinutesFromScheduleV10(date);if(m>0)return m/60;
 }
 if((DB.settings.holidayStudyDates||[]).includes(date))return Number(DB.settings.weekendCapacityHours)||14;
 return isWeekend(date)?Number(DB.settings.weekendCapacityHours)||14:Number(DB.settings.weekdayCapacityHours)||10;
};
__impl_capacitySummaryV90=capacitySummaryV90__impl2;
function capacitySummaryV90__impl2(from=viewDate,to=deadlineDate()){
 if(dateCompare(from,to)>0)return{activeDays:0,totalHours:0,zeroDays:0,calendarDays:0};let activeDays=0,totalHours=0,zeroDays=0,calendarDays=0;
 for(let d=from;dateCompare(d,to)<=0;d=addDays(d,1)){calendarDays++;const h=capacityHoursFor(d);if(h>0){activeDays++;totalHours+=h}else zeroDays++}
 return{activeDays,totalHours,zeroDays,calendarDays};
};

/* ---------- observed work-time estimates ---------- */
function taskLectureCourseKeysV10(t){return[...new Set((t.components||[]).filter(c=>c.kind==='lecture'&&c.ref).map(c=>String(c.ref).split('::')[0]))]}
function observedCourseMinutesV10(courseId){
 const values=[];
 for(const [date,list] of Object.entries(DB.tasks||{}))for(const t of list||[]){
  const comps=(t.components||[]).filter(c=>c.kind==='lecture'&&String(c.ref||'').startsWith(courseId+'::'));if(!comps.length)continue;
  const blocks=(DB.schedules?.[date]||[]).filter(b=>(b.taskIds||[]).includes(t.id));const mins=blocks.reduce((s,b)=>s+(Number(b.actualMin)>0?Number(b.actualMin):blockDuration(b)),0);
  if(mins>0)values.push(mins/comps.length);
 }
 if(values.length<2)return null;values.sort((a,b)=>a-b);const mid=values.length%2?values[(values.length-1)/2]:(values[values.length/2-1]+values[values.length/2])/2;
 const q1=values[Math.floor((values.length-1)*.25)],q3=values[Math.floor((values.length-1)*.75)];return{low:Math.max(10,Math.round(q1/5)*5),high:Math.max(10,Math.round(q3/5)*5),median:Math.max(10,Math.round(mid/5)*5),n:values.length,source:'시간표 관측'};
}
function courseUnitEstimateV10(id,meta={}){
 let low=meta.minutesPerUnitLow??meta.minutesLow,high=meta.minutesPerUnitHigh??meta.minutesHigh??low;if(low!=null||high!=null){low=Math.max(0,Number(low??high)||0);high=Math.max(low,Number(high??low)||low);return{low,high,n:null,source:'직접 입력'}}
 return observedCourseMinutesV10(id);
}
__impl_rowWorkloadV90=rowWorkloadV90__impl2;
function rowWorkloadV90__impl2(row){
 const m=row.meta||{};if(m.included===false)return{unknown:false,low:0,high:0,remaining:0,remainingLow:0,remainingHigh:0,included:false,source:'제외'};
 let remainingLow=null,remainingHigh=null,range=false;
 if(row.total!=null){remainingLow=remainingHigh=Math.max(0,Number(row.total)-Number(row.done||0));}
 else if(m.totalUnitsLow!=null||m.totalUnitsHigh!=null){const tl=Math.max(0,Number(m.totalUnitsLow??m.totalUnitsHigh)||0),th=Math.max(tl,Number(m.totalUnitsHigh??m.totalUnitsLow)||tl);remainingLow=Math.max(0,tl-Number(row.done||0));remainingHigh=Math.max(remainingLow,th-Number(row.done||0));range=true;}
 if(remainingLow==null||remainingHigh==null)return{unknown:true,low:0,high:0,remaining:null,remainingLow:null,remainingHigh:null,included:true};
 const e=courseUnitEstimateV10(row.id,m);if(!e)return{unknown:true,low:0,high:0,remaining:remainingHigh,remainingLow,remainingHigh,included:true,range};
 return{unknown:false,low:remainingLow*e.low,high:remainingHigh*e.high,remaining:remainingHigh,remainingLow,remainingHigh,included:true,range,unitLow:e.low,unitHigh:e.high,source:e.source,n:e.n};
};
function effectiveWeeklyDirectiveV10(date){const start=mondayOf(date),previous=addDays(start,-7),n=DB.weeklyNotes?.[previous]||{};return{sourceWeek:previous,appliesWeek:start,...n}}
function rowStoppedThisWeekV10(row,date){const d=effectiveWeeklyDirectiveV10(date),text=String(d.stop||'').trim().toLowerCase();if(!text)return false;return[row.name,row.id].filter(Boolean).some(x=>text.includes(String(x).toLowerCase()))}
function courseTargetV10(row){return row.meta?.targetDate||deadlineDate()}
function coursePlanV10(row,date){
 const workload=rowWorkloadV90(row),target=courseTargetV10(row),stopped=rowStoppedThisWeekV10(row,date),releaseStart=row.meta?.releaseStart||'';if(stopped)return{...row,workload:{...workload,included:false},target,releaseStart,stopped:true,todayLow:0,todayHigh:0,capacityMinutes:0,overdue:false,waitingRelease:false};
 if(workload.included===false||workload.unknown)return{...row,workload,target,releaseStart,stopped:false,todayLow:0,todayHigh:0,capacityMinutes:0,overdue:false,waitingRelease:Boolean(releaseStart&&dateCompare(date,releaseStart)<0)};
 const waitingRelease=Boolean(releaseStart&&dateCompare(date,releaseStart)<0),planStart=waitingRelease?releaseStart:date,overdue=dateCompare(date,target)>0&&workload.remaining>0,cap=overdue?Math.round(capacityHoursFor(date)*60):Math.round(capacitySummaryV90(planStart,target).totalHours*60),todayCap=waitingRelease?0:Math.round(capacityHoursFor(date)*60);
 const todayLow=waitingRelease?0:(overdue?workload.low:(cap?workload.low/cap*todayCap:workload.low)),todayHigh=waitingRelease?0:(overdue?workload.high:(cap?workload.high/cap*todayCap:workload.high));
 return{...row,workload,target,releaseStart,stopped:false,todayLow,todayHigh,capacityMinutes:cap,overdue,waitingRelease};
}
__impl_curriculumLoadV90=curriculumLoadV90__impl2;
function curriculumLoadV90__impl2(date=viewDate){
 const plans=curriculumRowsV90().map(r=>coursePlanV10(r,date)),included=plans.filter(r=>r.workload.included!==false&&!r.stopped),known=included.filter(r=>!r.workload.unknown),unknown=included.filter(r=>r.workload.unknown),low=known.reduce((s,r)=>s+r.workload.low,0),high=known.reduce((s,r)=>s+r.workload.high,0),todayLow=known.reduce((s,r)=>s+r.todayLow,0)/60,todayHigh=known.reduce((s,r)=>s+r.todayHigh,0)/60,todayCap=capacityHoursFor(date),cap=capacitySummaryV90(date,deadlineDate()),bySubject={};
 SUBJECTS.forEach(s=>bySubject[s]={subject:s,low:0,high:0,todayLow:0,todayHigh:0});for(const r of known){if(!bySubject[r.subject])bySubject[r.subject]={subject:r.subject,low:0,high:0,todayLow:0,todayHigh:0};bySubject[r.subject].low+=r.workload.low;bySubject[r.subject].high+=r.workload.high;bySubject[r.subject].todayLow+=r.todayLow/60;bySubject[r.subject].todayHigh+=r.todayHigh/60}
 const totalCap=cap.totalHours*60;return{date,capacity:cap,rows:plans,coursePlans:plans,unknown,low,high,todayCap,todayLow,todayHigh,bySubject:Object.values(bySubject),utilizationLow:totalCap?low/totalCap:0,utilizationHigh:totalCap?high/totalCap:0};
};

function estimateTaskMinutesV10(t,date=null){
 const raw=Number(t?.minutes)||0;if(raw>0)return{minutes:raw,known:true,source:'할 일'};const comps=(t?.components||[]).filter(c=>!c.done);if(!comps.length)return{minutes:0,known:true,source:'완료'};
 const lecture=comps.filter(c=>c.kind==='lecture'&&c.ref);if(lecture.length===comps.length){let total=0;for(const c of lecture){const id=String(c.ref).split('::')[0],e=courseUnitEstimateV10(id,DB.courseMeta?.[id]||{});if(!e)return{minutes:0,known:false,source:'강의 시간 미정'};total+=(e.low+e.high)/2}return{minutes:Math.round(total),known:true,source:'강의 추정'}}
 if(date){const blocks=(DB.schedules?.[date]||[]).filter(b=>(b.taskIds||[]).includes(t.id));if(blocks.length)return{minutes:blocks.reduce((s,b)=>s+blockDuration(b),0),known:true,source:'시간표'}}
 return{minutes:0,known:false,source:'시간 미정'};
}
const addTaskV10Core=addTask__impl1;
__impl_addTask=addTask__impl2;
function addTask__impl2(date,t){if((Number(t?.minutes)||0)<=0&&(t?.taskKind==='lecture'||(t?.components||[]).some(c=>c.kind==='lecture'))){const e=estimateTaskMinutesV10(normalizeImportedTask({...t,id:t.id||uid()}),date);if(e.known)t={...t,minutes:e.minutes}}return addTaskV10Core(date,t)};

/* ---------- time-aware placement ---------- */
function blockAvailableMinutesV10(date,b){const cap=blockDuration(b),alloc=b.taskAllocations&&typeof b.taskAllocations==='object'?b.taskAllocations:{};let used=Object.values(alloc).reduce((s,n)=>s+Math.max(0,Number(n)||0),0);for(const id of (b.taskIds||[])){if(Object.prototype.hasOwnProperty.call(alloc,id))continue;const t=taskById(date,id);if(!t)continue;const e=estimateTaskMinutesV10(t,date);used+=e.known?Math.min(cap,e.minutes):cap}return Math.max(0,cap-used)}
__impl_autoPlaceTasks=autoPlaceTasks__impl2;
function autoPlaceTasks__impl2(date,newTasks){
 const blocks=ensureSchedule(date),free=blocks.filter(b=>b.selfStudy&&!b.locked&&!studyBlockViolatesSleep(b)&&b.start&&b.end);let placed=0;
 const room=b=>blockAvailableMinutesV10(date,b);
 const assign=(b,t,min)=>{if(min<=0)return;b.taskIds=b.taskIds||[];b.taskAllocations=(b.taskAllocations&&typeof b.taskAllocations==='object')?b.taskAllocations:{};if(!b.taskIds.includes(t.id))b.taskIds.push(t.id);b.taskAllocations[t.id]=(Number(b.taskAllocations[t.id])||0)+min};
 for(const t of newTasks){if(free.some(b=>(b.taskIds||[]).includes(t.id)))continue;const need=estimateTaskMinutesV10(t,date);if(!need.known||need.minutes<=0)continue;const lecture=t.taskKind==='lecture'||(t.components||[]).some(c=>c.kind==='lecture'),eligible=free.filter(b=>!lecture||b.device);
  if(t.splitMode==='contiguous'){
   let chosen=null;
   for(let i=0;i<eligible.length;i++){
    let total=0,seq=[];
    for(let j=i;j<eligible.length;j++){
     const b=eligible[j],r=room(b);if(r<=0)break;
     if(seq.length){const prev=seq.at(-1),gap=plannerMinute(b.start)-plannerMinute(prev.end);if(gap>0)break}
     seq.push(b);total+=r;if(total>=need.minutes){chosen=seq;break}
    }
    if(chosen)break;
   }
   if(!chosen)continue;let left=need.minutes;for(const b of chosen){const take=Math.min(left,room(b));assign(b,t,take);left-=take;if(left<=0)break}placed++;continue;
  }
  let left=need.minutes,usedAny=false;for(const b of eligible){if(left<=0)break;const r=room(b);if(r<=0)continue;const take=Math.min(left,r);assign(b,t,take);left-=take;usedAny=true}if(usedAny&&left<=0)placed++;
 }
 saveSchedule(date,blocks);return placed;
};

function periodAverageNeedV11(date=viewDate){
 const load=curriculumLoadV90(date),deadline=deadlineDate(),days=Math.max(1,daysBetween(date,deadline)+1),low=load.low/60/days,high=load.high/60/days;return{days,low,high,unknown:load.unknown.length,deadline};
}
function todayPlanGapV11(date=viewDate){const load=curriculumLoadV90(date),gapLow=load.todayCap-load.todayLow,gapHigh=load.todayCap-load.todayHigh;return{...load,gapLow,gapHigh};}

/* ---------- decision engine ---------- */
function latestSignalForSubjectV10(subject,date){return(DB.diagnosticSignals||[]).filter(x=>x.subject===subject&&(!x.date||x.date<=date)).sort((a,b)=>String(a.date).localeCompare(String(b.date))).at(-1)||null}
function unresolvedQuestionRiskV10(subject,date){let score=0,count=0,recent=0;for(const t of DB.tests||[]){if(t.date>date)continue;const age=Math.max(0,daysBetween(t.date,date)),decay=Math.max(.2,1-age/45);for(const q of t.questionRecords||[]){if(q.subject!==subject||q.retryState==='resolved')continue;count++;score+=decay*(q.status==='wrong'?1.2:.7);if(age<=14)recent++}}return{score,count,recent}}
function stageGapV10(subject,date){const stage=activeStage(date),x=latestRepresentative(subject);if(!x)return{score:.8,text:'대표 시험 근거 부족'};const row=testSubjectRows(x.test).find(r=>r.subject===subject),grade=Number(row?.grade||0),goal=stage.goals[subject];if(!grade)return{score:.5,text:'등급 미입력'};const gap=Math.max(0,grade-goal);return{score:gap*2,text:`최근 ${grade}등급 · 목표 ${goal}`}}
function weeklySubjectBoostV10(subject,date){const d=effectiveWeeklyDirectiveV10(date),fields=[d.p1,d.p2,d.p3].map(x=>String(x||''));let score=0,label='';fields.forEach((x,i)=>{if(x.includes(subject)){score+=3-i;label=label||`주간 핵심 ${i+1}`}});return{score,label}}
function subjectDecisionV10(subject,date=viewDate){
 const load=curriculumLoadV90(date),sload=load.bySubject.find(x=>x.subject===subject)||{todayLow:0,todayHigh:0},signal=latestSignalForSubjectV10(subject,date),signalAge=signal?.date?Math.max(0,daysBetween(signal.date,date)):999,signalScore=signal?Number(signal.severity||1)*Math.max(.25,1-signalAge/60):0,err=unresolvedQuestionRiskV10(subject,date),gap=stageGapV10(subject,date),week=weeklySubjectBoostV10(subject,date),manual=DB.planOverrides?.[date]?.subject===subject?10:0,urgency=Math.min(4,(sload.todayHigh||0)/(Math.max(.25,load.todayCap||1))*4),score=1+signalScore+err.score+gap.score+week.score+manual+urgency;
 const reasons=[];if(manual)reasons.push('사용자 우선 지정');if(sload.todayHigh>0)reasons.push(`마감 필요 ${sload.todayLow.toFixed(1)}–${sload.todayHigh.toFixed(1)}h`);if(signal)reasons.push(signal.summary);if(err.recent)reasons.push(`최근 14일 미해결 문항 ${err.recent}`);if(gap.text)reasons.push(gap.text);if(week.label)reasons.push(week.label);
 return{subject,score,todayLow:sload.todayLow||0,todayHigh:sload.todayHigh||0,reasons,signal,err,gap,week,manual};
}
function decisionPlanV10(date=viewDate){const rows=SUBJECTS.map(s=>subjectDecisionV10(s,date)).sort((a,b)=>b.score-a.score),load=curriculumLoadV90(date),unknown=load.unknown.length,cap=load.todayCap,required=load.todayHigh,confidence=unknown===0?'높음':unknown<=2?'중간':'낮음';return{date,rows,load,cap,required,confidence,overload:required>cap+.05,override:DB.planOverrides?.[date]||null}}
function renderDecisionBoardV10(){
 const box=$('#decisionBoard');if(!box)return;const p=decisionPlanV10(viewDate),badge=$('#decisionConfidence'),partial=p.load.unknown.length>0;if(badge)badge.textContent=`근거 ${p.confidence} · 가용 ${p.cap.toFixed(1)}h`;
 const headline=partial?'시간 미정 과정이 있어 확정분만 계산했습니다.':p.overload?'오늘 요구량이 실제 시간표를 넘습니다.':'오늘은 이 순서로 지키는 편이 안전합니다.';
 const detail=partial?`확정 상한 ${p.required.toFixed(1)}h + 미정 ${p.load.unknown.length}개 / 가용 ${p.cap.toFixed(1)}h`:p.overload?`상한 ${p.required.toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h · 자료 축소 또는 재배치 필요`:`상한 ${p.required.toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h`;
 box.innerHTML=`<div class="decision-summary ${p.overload||partial?'risk':''}"><b>${headline}</b><span>${detail}</span></div><div class="decision-list">${p.rows.map((x,i)=>`<article class="decision-row ${x.manual?'manual':''}"><span class="rank">${i+1}</span><div><b>${x.subject}</b><small>${x.reasons.slice(0,3).map(esc).join(' · ')||'최근 근거 부족'}</small></div><strong>${x.todayHigh?`${x.todayLow.toFixed(1)}–${x.todayHigh.toFixed(1)}h`:'유지·보완'}</strong><button class="text-link decision-pin" data-sub="${x.subject}">${x.manual?'우선 해제':'오늘 우선'}</button></article>`).join('')}</div>`;
 $$('.decision-pin').forEach(b=>b.onclick=()=>{const s=b.dataset.sub;if(DB.planOverrides?.[viewDate]?.subject===s){delete DB.planOverrides[viewDate]}else{const reason=prompt(`${s}를 오늘 우선으로 둘 이유를 짧게 적어주세요.`, '내 판단')||'내 판단';DB.planOverrides[viewDate]={subject:s,reason,at:Date.now()};DB.decisionLog.unshift({date:viewDate,kind:'manual-priority',subject:s,reason,at:Date.now()});DB.decisionLog=DB.decisionLog.slice(0,200)}saveDB();renderDashboard()});
 const state=$('#decisionOverrideState');if(state)state.textContent=p.override?`자동 판단 위에 사용자 판단 적용: ${p.override.subject} · ${p.override.reason||''}`:'자동 판단은 제안입니다. 직접 우선순위를 바꾸면 다음 계산에서 그 선택을 존중합니다.';
}

/* ---------- weekly command actually changes next week ---------- */
const saveWeeklyCommandV10Core=saveWeeklyCommand__impl1;
__impl_saveWeeklyCommand=saveWeeklyCommand__impl2;
function saveWeeklyCommand__impl2(){saveWeeklyCommandV10Core();const start=mondayOf(viewDate),n=DB.weeklyNotes[start]||{};DB.decisionLog.unshift({date:viewDate,kind:'weekly-directive',appliesWeek:addDays(start,7),directive:deep(n),at:Date.now()});DB.decisionLog=DB.decisionLog.slice(0,200);saveDB();renderWeeklyCommand()};
const renderWeeklyCommandV10Core=renderWeeklyCommand__impl1;
__impl_renderWeeklyCommand=renderWeeklyCommand__impl2;
function renderWeeklyCommand__impl2(){renderWeeklyCommandV10Core();const box=$('#weeklyCommand');if(!box)return;const applies=addDays(mondayOf(viewDate),7),n=DB.weeklyNotes[mondayOf(viewDate)]||{};if(n.p1||n.p2||n.p3||n.stop)box.insertAdjacentHTML('beforeend',`<div class="directive-effect"><b>${applies.slice(5).replace('-','.')} 주부터 실제 계산에 반영</b><span>핵심에 적힌 과목은 우선순위가 올라가고, ‘줄이거나 중단’에 정확히 적힌 과정은 그 주 필요량에서 일시 제외됩니다.</span></div>`)};

/* ---------- close-day recovery without tomorrow pile-up ---------- */
function dayTaskLoadV10(date){const arr=tasksFor(date).filter(t=>!t.done),known=arr.reduce((s,t)=>{const e=estimateTaskMinutesV10(t,date);return s+(e.known?e.minutes:0)},0),unknown=arr.filter(t=>!estimateTaskMinutesV10(t,date).known).length,cap=Math.round(capacityHoursFor(date)*60);return{known,unknown,cap,ratio:cap?known/cap:known?99:0}}
function bestCarryDateV10(fromDate,t){let best=null;for(let i=1;i<=7;i++){const d=addDays(fromDate,i),cap=capacityHoursFor(d);if(cap<=0)continue;const l=dayTaskLoadV10(d),score=l.ratio+(i*.025);if(!best||score<best.score)best={date:d,score,load:l}}return best?.date||addDays(fromDate,1)}
function recommendUnfinishedActionV10(t,date){const directive=effectiveWeeklyDirectiveV10(addDays(date,1)),stop=String(directive.stop||'').toLowerCase();if(stop&&[t.name,t.material].filter(Boolean).some(x=>stop.includes(String(x).toLowerCase())))return'waiting';if(t.priority==='extra')return'skip';if(t.priority==='must'&&dayTaskLoadV10(addDays(date,1)).ratio<.85)return'tomorrow';return'spread'}
__impl_openCloseDay=openCloseDay__impl2;
function openCloseDay__impl2(){
 if(viewDate>todayDate()){alert('미래 날짜는 실제로 지난 뒤 마감할 수 있습니다.');return}$('#closeDateBadge').textContent=fmtDate(viewDate);const p=plannedStudy(viewDate).minutes,a=autoActualStudy(viewDate),f=finalStudy(viewDate);$('#closeStudySummary').innerHTML=`<div><span>계획 자습</span><b>${minuteLabel(p)}</b></div><div><span>자동 실제</span><b>${minuteLabel(a)}</b></div><div><span>현재 최종</span><b>${minuteLabel(f)}</b></div>`;$('#closeStudyOverride').value=(f/60).toFixed(1);
 const unfinished=tasksFor(viewDate).filter(t=>!t.done);$('#closeUnfinished').innerHTML=unfinished.length?`<h3 class="subhead">미완료 ${unfinished.length}개</h3><div class="micro-label">내일로 몰아넣지 않고 중요도와 다음 7일 여유를 기준으로 기본값을 추천합니다.</div>`+unfinished.map(t=>{const rec=recommendUnfinishedActionV10(t,viewDate),best=bestCarryDateV10(viewDate,t);return`<div class="close-choice"><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')} · 추천 ${rec==='tomorrow'?'내일':rec==='spread'?`${best.slice(5)} 재배치`:rec==='waiting'?'대기함':'건너뛰기'}</div></div><select class="input close-action" data-id="${t.id}"><option value="tomorrow"${rec==='tomorrow'?' selected':''}>내일</option><option value="spread"${rec==='spread'?' selected':''}>이번 주 여유일로 재배치</option><option value="waiting"${rec==='waiting'?' selected':''}>대기함</option><option value="skip"${rec==='skip'?' selected':''}>건너뛰기</option></select></div>`}).join(''):'<div class="muted">미완료 할 일이 없습니다.</div>';showModal('closeDayModal');
};
__impl_confirmCloseDay=confirmCloseDay__impl2;
function confirmCloseDay__impl2(){
 const previous=dailyRecord(viewDate);if(previous?.closedAt&&!confirm('이미 마감한 날짜입니다. 현재 상태로 마감 기록을 다시 저장할까요?'))return;const v=Number($('#closeStudyOverride').value);if(Number.isFinite(v)&&v>=0)DB.studyOverrides[viewDate]=Math.round(v*60);const before=deep(tasksFor(viewDate)),units=snapshotTaskUnits(before),actions=$$('.close-action').map(x=>({id:x.dataset.id,act:x.value})),tom=nextDate(viewDate);const carriedBefore=previous?.closedAt?0:(Number(previous?.carried)||0),waitingBefore=previous?.closedAt?0:(Number(previous?.waiting)||0),movedTotal=previous?.closedAt?0:(Number(previous?.movedTotal)||0),movedDone=previous?.closedAt?0:(Number(previous?.movedDone)||0),movedTasks=previous?.closedAt?0:(Number(previous?.movedTasks)||0),movedDoneTasks=previous?.closedAt?0:(Number(previous?.movedDoneTasks)||0);let carried=0,waiting=0,skipped=0;
 for(const x of actions){const t=taskById(viewDate,x.id);if(!t)continue;const u=taskUnitSnapshot(t),left=Math.max(0,u.total-u.done);if(x.act==='tomorrow'||x.act==='spread'){const target=x.act==='tomorrow'?tom:bestCarryDateV10(viewDate,t);carried+=left;removeTask(viewDate,t.id,false);const c=carryTaskToDate(t,target);autoPlaceTasks(target,[c]);DB.decisionLog.unshift({date:viewDate,kind:'carry',task:t.name,from:viewDate,to:target,mode:x.act,at:Date.now()})}else if(x.act==='waiting'){waiting+=left;moveTaskToWaiting(viewDate,t.id,{recordMove:false})}else if(x.act==='skip'){skipped+=left;removeTask(viewDate,t.id,true)}}
 DB.dailyRecords[viewDate]={date:viewDate,state:'closed',total:movedTotal+units.total,done:movedDone+units.done,tasks:movedTasks+units.tasks,doneTasks:movedDoneTasks+units.doneTasks,carried:carriedBefore+carried,waiting:waitingBefore+waiting,skipped,study:finalStudy(viewDate),closedAt:Date.now()};DB.closeHistory=DB.closeHistory.filter(x=>x.date!==viewDate);DB.closeHistory.unshift({date:viewDate,at:Date.now(),study:finalStudy(viewDate),completion:DB.dailyRecords[viewDate]});DB.closeHistory=DB.closeHistory.slice(0,50);DB.decisionLog=DB.decisionLog.slice(0,200);saveDB();hideModal('closeDayModal');renderDashboard();const saved=DB.dailyRecords[viewDate];alert(`오늘 마감을 저장했습니다. 완주 ${saved.done}/${saved.total}${saved.carried||saved.waiting?` · 재배치/대기 ${saved.carried+saved.waiting}`:''}`);
};

/* ---------- full mock timing-collapse maps ---------- */
const normalizeTestRecordV10Core=normalizeTestRecord__impl1;
__impl_normalizeTestRecord=normalizeTestRecord__impl2;
function normalizeTestRecord__impl2(t){const x=normalizeTestRecordV10Core(t);if(x.kind==='full'){x.abandonedQuestionMap=t?.abandonedQuestionMap&&typeof t.abandonedQuestionMap==='object'?deep(t.abandonedQuestionMap):(x.abandonedQuestionMap||{});x.firstChokeMap=t?.firstChokeMap&&typeof t.firstChokeMap==='object'?deep(t.firstChokeMap):(x.firstChokeMap||{});x.lastNormalMap=t?.lastNormalMap&&typeof t.lastNormalMap==='object'?deep(t.lastNormalMap):(x.lastNormalMap||{});x.timeLeftMap=t?.timeLeftMap&&typeof t.timeLeftMap==='object'?deep(t.timeLeftMap):(x.timeLeftMap||{})}return x};
const openTestModalV10Core=openTestModal__impl2;
__impl_openTestModal=openTestModal__impl3;
function openTestModal__impl3(){openTestModalV10Core();$$('.full-abandoned-questions,.full-first-choke,.full-last-normal,.full-time-left').forEach(x=>x.value='')};
__impl_saveTestModal=saveTestModal__impl3;
function saveTestModal__impl3(){
 const kind=$('#testKind').value,name=$('#testName').value.trim()||(kind==='full'?'전과목 모의고사':'시험'),date=$('#testDate').value||viewDate,base={id:uid(),kind,source:$('#testSource').value,round:$('#testRound').value.trim(),date,name,causes:$$('.cause-picker input:checked').map(x=>x.value),memo:$('#testMemo').value.trim(),timingMemo:$('#testTimingMemo')?.value.trim()||''};let record;
 if(kind==='full'){const scores={},grades={},wrongs={},minutes={},wrongQuestionMap={},uncertainQuestionMap={},abandonedQuestionMap={},firstChokeMap={},lastNormalMap={},timeLeftMap={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value)||0);$$('.full-grade').forEach(x=>grades[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong').forEach(x=>wrongs[x.dataset.sub]=Number(x.value)||0);$$('.full-minutes').forEach(x=>minutes[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong-questions').forEach(x=>wrongQuestionMap[x.dataset.sub]=x.value.trim());$$('.full-uncertain-questions').forEach(x=>uncertainQuestionMap[x.dataset.sub]=x.value.trim());$$('.full-abandoned-questions').forEach(x=>abandonedQuestionMap[x.dataset.sub]=x.value.trim());$$('.full-first-choke').forEach(x=>firstChokeMap[x.dataset.sub]=Number(x.value)||0);$$('.full-last-normal').forEach(x=>lastNormalMap[x.dataset.sub]=Number(x.value)||0);$$('.full-time-left').forEach(x=>timeLeftMap[x.dataset.sub]=Number(x.value)||0);record=normalizeTestRecord({...base,scope:'full',scores,grades,wrongs,minutes,wrongQuestionMap,uncertainQuestionMap,abandonedQuestionMap,firstChokeMap,lastNormalMap,timeLeftMap,questionRecords:SUBJECTS.flatMap(subject=>questionRecordsFromTexts(subject,wrongQuestionMap[subject],uncertainQuestionMap[subject],date))})}
 else{const subject=$('#testSubject').value,wrongQuestions=$('#testWrongQuestions').value.trim(),uncertainQuestions=$('#testUncertainQuestions').value.trim(),abandonedQuestions=$('#testAbandonedQuestions')?.value.trim()||'';record=normalizeTestRecord({...base,scope:$('#testScope').value,subject,score:Number($('#testScore').value)||0,grade:Number($('#testGrade').value)||0,minutes:Number($('#testMinutes').value)||0,wrongCount:Number($('#testWrongCount').value)||0,wrongQuestions,uncertainQuestions,abandonedQuestions,timeLeft:Number($('#testTimeLeft')?.value)||0,firstChoke:Number($('#testFirstChoke')?.value)||0,lastNormal:Number($('#testLastNormal')?.value)||0,questionRecords:questionRecordsFromTexts(subject,wrongQuestions,uncertainQuestions,date)})}
 DB.tests.push(record);saveDB();hideModal('testModal');renderTests();renderDashboard();
};

/* ---------- recency-weighted error patterns and protocol effect ---------- */
__impl_errorPatternStats=errorPatternStats__impl2;
function errorPatternStats__impl2(){const map=new Map(),now=viewDate||todayDate();for(const t of DB.tests||[])for(const q of t.questionRecords||[]){if(!q.pattern)continue;const age=Math.max(0,daysBetween(t.date,now)),weight=Math.max(.2,1-age/60)*(q.retryState==='resolved'?.45:1),x=map.get(q.pattern)||{pattern:q.pattern,count:0,pending:0,weighted:0,recent:0,subjects:new Set(),rules:new Set(),latest:''};x.count++;x.weighted+=weight;if(age<=21)x.recent++;if(q.retryState!=='resolved')x.pending++;x.subjects.add(q.subject);if(q.controlRule)x.rules.add(q.controlRule);if(!x.latest||t.date>x.latest)x.latest=t.date;map.set(q.pattern,x)}return[...map.values()].sort((a,b)=>b.weighted-a.weighted||b.pending-a.pending)};
function subjectFailureUnitsV10(test,subject){const row=testSubjectRows(test).find(r=>r.subject===subject);if(!row)return null;const wrong=Number(row.wrong||0),uncertain=(test.questionRecords||[]).filter(q=>q.subject===subject&&q.status==='uncertain').length,abandoned=parseQuestionNumbers(test.kind==='full'?test.abandonedQuestionMap?.[subject]:test.subject===subject?test.abandonedQuestions:'').length;return wrong+uncertain*.5+abandoned*1.25}
function protocolEffectV10(subject,index){const points=[];for(const t of DB.tests||[]){const check=t.protocolChecks?.[subject]?.[index];if(check!==true&&check!==false)continue;const fail=subjectFailureUnitsV10(t,subject);if(fail==null)continue;points.push({date:t.date,check,fail})}const yes=points.filter(x=>x.check),no=points.filter(x=>!x.check),avg=a=>a.length?a.reduce((s,x)=>s+x.fail,0)/a.length:null,ya=avg(yes),na=avg(no);return{n:points.length,yes:yes.length,no:no.length,yesAvg:ya,noAvg:na,state:ya!=null&&na!=null?(ya<na?'도움 신호':ya>na?'재검토 신호':'차이 없음'):'근거 부족'}}
__impl_renderProtocolBoard=renderProtocolBoard__impl2;
function renderProtocolBoard__impl2(){const box=$('#protocolBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const rules=DB.subjectProtocols?.[s]||[];return`<div class="protocol-row"><b>${s}</b><ol>${rules.length?rules.map((r,i)=>{const e=protocolEffectV10(s,i);return`<li>${esc(r)} <small>${e.state}${e.n?` · 기록 ${e.n}회`:''}</small></li>`}).join(''):'<li class="muted">아직 확정된 규칙 없음</li>'}</ol></div>`}).join('')};
const saveTestReviewModalV10Core=saveTestReviewModal__impl2;
__impl_saveTestReviewModal=saveTestReviewModal__impl3;
function saveTestReviewModal__impl3(){const id=$('#testReviewId').value;saveTestReviewModalV10Core();const test=DB.tests.find(t=>t.id===id);if(test){for(const s of SUBJECTS){const rules=DB.subjectProtocols?.[s]||[];if(!rules.length)continue;DB.protocolEffects[s]=rules.map((_,i)=>protocolEffectV10(s,i))}saveDB()}};

/* ---------- stronger stability ---------- */
__impl_subjectStability=subjectStability__impl2;
function subjectStability__impl2(subject){const rows=representativeRowsForSubject(subject).slice(-5);if(rows.length<3)return{n:rows.length,insufficient:true};const normalized=rows.map(x=>clamp(Number(x.row.score||0)/(V10_MAX_SCORE[subject]||100)*100,0,100)),avg=normalized.reduce((s,x)=>s+x,0)/normalized.length,floor=Math.min(...normalized),range=Math.max(...normalized)-floor,tests=rows.map(x=>x.test),abandoned=tests.reduce((s,t)=>s+parseQuestionNumbers(t.kind==='full'?t.abandonedQuestionMap?.[subject]:t.subject===subject?t.abandonedQuestions:'').length,0),uncertain=tests.reduce((s,t)=>s+(t.questionRecords||[]).filter(q=>q.subject===subject&&q.status==='uncertain').length,0),pending=unresolvedQuestionRiskV10(subject,viewDate).count,protocolFails=tests.reduce((s,t)=>s+(t.protocolChecks?.[subject]||[]).filter(x=>x===false).length,0),index=clamp(Math.round(avg-(range*.45)-(abandoned*3)-(uncertain*.8)-(Math.min(8,pending)*1.2)-(protocolFails*1.2)),0,100);let state=index>=88&&abandoned===0?'안정':index>=74?'경계':'위험';return{n:rows.length,latest:Number(rows.at(-1).row.score||0),min:Math.min(...rows.map(x=>Number(x.row.score||0))),max:Math.max(...rows.map(x=>Number(x.row.score||0))),range,index,state,uncertain,abandoned,pending,protocolFails,insufficient:false}}
__impl_renderStabilityBoard=renderStabilityBoard__impl2;
function renderStabilityBoard__impl2(){const box=$('#stabilityBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const x=subjectStability(s);return`<div class="stability-row"><b>${s}</b>${x.insufficient?`<span>판정 근거 부족</span><small>대표 시험 ${x.n}/3회</small>`:`<span>${x.state} · 안정성 ${x.index}/100 · 최근 ${x.latest}</span><small>변동 ${x.range}점 · 미풀이 ${x.abandoned} · 애매 ${x.uncertain} · 미해결 ${x.pending}</small>`}</div>`}).join('')};

/* ---------- automatic course completion evidence ---------- */
function courseLastCompletionDateV10(row){let dates=[];for(const [date,list] of Object.entries(DB.tasks||{}))for(const t of list||[]){if(!t.done)continue;if(row.kind==='lecture'&&(t.components||[]).some(c=>c.kind==='lecture'&&String(c.ref||'').startsWith(row.id+'::')))dates.push(date);if(row.kind==='book'&&(t.components||[]).some(c=>c.kind==='book'&&c.bookItem?.bookId===row.id))dates.push(date)}return dates.sort().at(-1)||''}
function courseMasteryEvidenceV10(row){const complete=row.total!=null&&Number(row.done)>=Number(row.total),manual=row.meta?.mastery||{},manualAll=Boolean(manual.review&&manual.apply&&manual.timed),last=courseLastCompletionDateV10(row),tests=last?representativeRowsForSubject(row.subject).filter(x=>x.test.date>=last).slice(-3):[],pendingRecent=(DB.tests||[]).filter(t=>!last||t.date>=last).flatMap(t=>(t.questionRecords||[]).filter(q=>q.subject===row.subject&&q.retryState!=='resolved')),abandoned=tests.reduce((s,x)=>s+parseQuestionNumbers(x.test.kind==='full'?x.test.abandonedQuestionMap?.[row.subject]:x.test.subject===row.subject?x.test.abandonedQuestions:'').length,0),samePatterns=new Map();for(const x of tests)for(const q of x.test.questionRecords||[]){if(q.subject!==row.subject||!q.pattern)continue;samePatterns.set(q.pattern,(samePatterns.get(q.pattern)||0)+1)}const repeat=[...samePatterns.values()].some(n=>n>=2),autoEligible=complete&&tests.length>=2&&pendingRecent.length===0&&abandoned===0&&!repeat;let status=!complete?'진행 중':row.meta?.closed?'종료':autoEligible||manualAll?'종료 가능':'완강 · 검증 대기';return{complete,last,tests:tests.length,pending:pendingRecent.length,abandoned,repeat,autoEligible,manualAll,status}}
__impl_masteryChips=masteryChips__impl2;
function masteryChips__impl2(row){const m=row.meta?.mastery||{},e=courseMasteryEvidenceV10(row);return`<div class="mastery-chips"><span class="${e.complete?'on':''}">수강</span><span class="${m.review?'on':''}">복습</span><span class="${m.apply?'on':''}">적용</span><span class="${m.timed?'on':''}">시간 내 재현</span><span class="${e.autoEligible?'on':''}">${e.status}</span></div>`};
const openCourseMetaV10Core=openCourseMeta__impl1;
__impl_openCourseMeta=openCourseMeta__impl2;
function openCourseMeta__impl2(id,kind){openCourseMetaV10Core(id,kind);const row=courseRowInfo(id,kind),e=row?courseMasteryEvidenceV10(row):null,box=$('#courseMasteryEvidence');if(box&&e)box.innerHTML=`<b>자동 근거: ${e.status}</b><span>완료 ${e.complete?'예':'아니오'} · 완료 뒤 대표시험 ${e.tests}회 · 미해결 ${e.pending} · 미풀이 ${e.abandoned}${e.repeat?' · 같은 패턴 재발':''}</span>`;if($('#courseMetaClosed'))$('#courseMetaClosed').checked=Boolean(DB.courseMeta?.[id]?.closed)};
const saveCourseMetaV10Core=saveCourseMeta__impl1;
__impl_saveCourseMeta=saveCourseMeta__impl2;
function saveCourseMeta__impl2(){const id=$('#courseMetaId').value,closed=$('#courseMetaClosed')?.checked;saveCourseMetaV10Core();if(id&&closed!=null){DB.courseMeta[id]=DB.courseMeta[id]||{};DB.courseMeta[id].closed=Boolean(closed);saveDB();renderProgress()}};

/* ---------- condition: sleep/condition guard ---------- */
__impl_renderConditionAnalysis=renderConditionAnalysis__impl2;
function renderConditionAnalysis__impl2(){const box=$('#conditionAnalysis');if(!box)return;const month=$('#analysisMonth')?.value||viewDate.slice(0,7),rows=Object.entries(DB.condition||{}).filter(([d])=>d.startsWith(month)).map(([date,c])=>({date,c,sleep:sleepMinutes(c.bed,c.wake),focus:Number(c.dailyFocus||c.focus),fatigue:Number(c.fatigue)}));const validSleep=rows.filter(r=>Number.isFinite(r.sleep)),avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null,sl=avg(validSleep.map(x=>x.sleep)),focusRows=rows.filter(r=>Number.isFinite(r.focus)&&r.focus>0),fa=avg(focusRows.map(x=>x.focus));box.innerHTML=`<div class="condition-insight-grid"><div class="condition-insight"><span>평균 수면</span><b>${sl!=null?minuteLabel(sl):'기록 부족'}</b><small>${validSleep.length}일</small></div><div class="condition-insight"><span>평균 집중</span><b>${fa!=null?fa.toFixed(1):'기록 부족'}</b><small>${focusRows.length}일</small></div><div class="condition-insight"><span>목적</span><b>수면을 깎지 않고 성과를 유지</b><small>컨디션은 계획 상한을 조정하는 근거로만 사용</small></div></div>`};

/* ---------- safety snapshots and import preview ---------- */
function dailySafetySnapshotsV10(){try{return JSON.parse(localStorage.getItem('p11122_v100_daily_safety')||'[]')}catch{return[]}}
function ensureDailySafetySnapshotV10(){const key=todayDate(),arr=dailySafetySnapshotsV10();if(arr.some(x=>x.date===key)||approximateStorageBytes()>2.7*1024*1024)return;arr.unshift({date:key,at:Date.now(),data:LAST_SAVED_JSON});try{localStorage.setItem('p11122_v100_daily_safety',JSON.stringify(arr.slice(0,3)))}catch{}}
function safetySnapshotRowsV10(){const rows=dailySafetySnapshotsV10().map(x=>({...x,kind:'daily',label:`${x.date} 일일 안전본`}));try{const pre=localStorage.getItem('p11122_pre_import_backup');if(pre)rows.unshift({kind:'preimport',date:'',at:0,data:pre,label:'가장 최근 가져오기 직전'})}catch{}return rows}
function restoreSafetySnapshotV10(kind,index){const rows=safetySnapshotRowsV10(),row=kind==='preimport'?rows.find(x=>x.kind==='preimport'):dailySafetySnapshotsV10()[Number(index)];if(!row?.data)return false;if(!confirm(`${row.label||row.date} 상태로 복원할까요? 현재 상태도 별도 안전본으로 남깁니다.`))return false;try{safeSetItem('p11122_pre_restore_backup',JSON.stringify(DB),{silent:true});const next=migrateDB(JSON.parse(row.data)),json=JSON.stringify(next);if(!safeSetItem(DB_KEY,json))throw new Error('save');DB=next;ensureV100DB();LAST_SAVED_JSON=JSON.stringify(DB);viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);alert('안전본을 복원했습니다.');navigate('dashboard');return true}catch(e){console.error(e);alert('안전본 복원에 실패했습니다.');return false}}
function renderSafetySnapshotsV10(){const box=$('#safetySnapshotList');if(!box)return;const daily=dailySafetySnapshotsV10(),pre=(()=>{try{return Boolean(localStorage.getItem('p11122_pre_import_backup'))}catch{return false}})();const rows=[];if(pre)rows.push(`<div class="undo-item"><span>가장 최근 가져오기 직전 상태</span><button class="btn ghost small safety-restore" data-kind="preimport">복원</button></div>`);daily.forEach((x,i)=>rows.push(`<div class="undo-item"><span>${esc(x.date)} · ${new Date(x.at).toLocaleString('ko-KR')}</span><button class="btn ghost small safety-restore" data-kind="daily" data-index="${i}">복원</button></div>`));box.innerHTML=rows.length?rows.join(''):'<div class="muted">아직 안전본이 없습니다. 첫 변경 전에 하루 1회 자동 생성됩니다.</div>';$$('.safety-restore').forEach(b=>b.onclick=()=>restoreSafetySnapshotV10(b.dataset.kind,b.dataset.index))}
const saveDBV10Core=saveDB__impl1;
__impl_saveDB=saveDB__impl2;
function saveDB__impl2(options={}){if(options.undo!==false)ensureDailySafetySnapshotV10();return saveDBV10Core(options)};
__impl_importData=importData__impl3;
function importData__impl3(file){const r=new FileReader();r.onload=()=>{try{const raw=JSON.parse(r.result);if(!validateBackupObject(raw))throw new Error('invalid');const counts={tasks:Object.values(raw.tasks||{}).reduce((s,a)=>s+(a?.length||0),0),schedules:Object.keys(raw.schedules||{}).length,tests:(raw.tests||[]).length,books:(raw.books||[]).length,courses:(raw.customLectures||[]).length};if(!confirm(`복원 미리보기\n할 일 ${counts.tasks}개 · 시간표 날짜 ${counts.schedules}일 · 시험 ${counts.tests}개 · 문제집 ${counts.books}개 · 사용자 강좌 ${counts.courses}개\n\n현재 기록을 이 백업으로 교체할까요? 복원 직전 상태는 안전 스냅샷으로 남깁니다.`))return;safeSetItem('p11122_pre_import_backup',JSON.stringify(DB),{silent:true});const next=raw.app?.name==='曆象'?convertYeoksangBackup(raw):migrateDB(raw),json=JSON.stringify(next);if(!safeSetItem(DB_KEY,json))throw new Error('save');DB=next;ensureV100DB();LAST_SAVED_JSON=JSON.stringify(DB);viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);alert('백업을 검증하고 복원했습니다.');navigate('dashboard')}catch(e){console.error(e);alert('지원하는 曆象 또는 이전 11122 호환 JSON 백업인지 확인하세요.')}};r.readAsText(file)};

/* ---------- render integration ---------- */
const renderDashboardV10Core=renderDashboard__impl2;
__impl_renderDashboard=renderDashboard__impl3;
function renderDashboard__impl3(){renderDashboardV10Core();const stage=activeStage(viewDate);$('#stageTitle').textContent=stage.title;$('#stageDesc').textContent=stage.key==='nine'?'기준점 분석':'전과목 만점';renderDecisionBoardV10();const pending=tasksFor(viewDate).filter(t=>!t.done),known=pending.reduce((s,t)=>{const e=estimateTaskMinutesV10(t,viewDate);return s+(e.known?e.minutes:0)},0),unknown=pending.filter(t=>!estimateTaskMinutesV10(t,viewDate).known).length,cap=Math.round(capacityHoursFor(viewDate)*60),el=$('#overloadBanner');if(known>cap&&cap>0){el.classList.remove('hidden');el.textContent=`오늘 할 일 예상 ${minuteLabel(known)} / 실제 시간표 가용 ${minuteLabel(cap)} · ${minuteLabel(known-cap)} 초과${unknown?` · 시간 미정 ${unknown}개 별도`:''}`}else if(unknown){el.classList.remove('hidden');el.textContent=`오늘 시간표 가용 ${minuteLabel(cap)} · 시간 미정 할 일 ${unknown}개는 과부하 판정에서 제외되어 있습니다.`}else el.classList.add('hidden')};

const renderProgressV10Core=renderProgress__impl2;
__impl_renderProgress=renderProgress__impl3;
function renderProgress__impl3(){renderProgressV10Core();const pressure=$('#curriculumPressure'),load=curriculumLoadV90(viewDate);if(pressure){const overdue=load.coursePlans.filter(x=>x.overdue).length,stopped=load.coursePlans.filter(x=>x.stopped).length;pressure.querySelectorAll('small').forEach(()=>{});pressure.insertAdjacentHTML('beforeend',`<div><span>과정별 마감</span><b>${overdue?`지연 ${overdue}`:'정상'}</b><small>이번 주 일시중단 ${stopped}개</small></div>`)};$$('.course-meta-btn').forEach(b=>b.onclick=e=>{e.stopPropagation();openCourseMeta(b.dataset.id,b.dataset.kind)})};

const renderErrorPatternsV10Core=renderErrorPatterns__impl1;
__impl_renderErrorPatterns=renderErrorPatterns__impl2;
function renderErrorPatterns__impl2(){const box=$('#errorPatternBoard');if(!box)return;const rows=errorPatternStats();box.innerHTML=rows.length?rows.map(x=>`<div class="pattern-stat"><b>${esc(x.pattern)}</b><span>가중 ${x.weighted.toFixed(1)} · 최근 21일 ${x.recent} · 미해결 ${x.pending}</span><small>${[...x.rules].slice(0,2).map(esc).join(' · ')||'통제 규칙 미입력'}</small></div>`).join(''):'<div class="empty-state">시험 문항 분석에서 오류 패턴을 기록하면 최근 재발을 더 무겁게 계산합니다.</div>'};

const renderTestsV10Core=renderTests__impl2;
__impl_renderTests=renderTests__impl3;
function renderTests__impl3(){renderTestsV10Core();renderStabilityBoard();renderProtocolBoard()};

const renderSettingsV10Core=renderSettings__impl2;
__impl_renderSettings=renderSettings__impl3;
function renderSettings__impl3(){renderSettingsV10Core();if($('#capacityModeSetting'))$('#capacityModeSetting').value=DB.settings.capacityMode||'schedule';const info=$('#versionInfo');if(info)info.innerHTML=`<code>App 2.0<br>Data schema ${SCHEMA_VERSION}<br>Build ${BUILD}<br>저장소 약 ${Math.round(approximateStorageBytes()/1024).toLocaleString()} KB<br>10월 학평 ${V10_OCT_EXAM}<br>수능 ${V10_CSAT}<br>가용시간 ${DB.settings.capacityMode==='manual'?'fallback 고정':'실제 시간표 우선'}</code>`};

const runDiagnosticsV10Core=runDiagnostics__impl2;
__impl_runDiagnostics=runDiagnostics__impl3;
function runDiagnostics__impl3(){runDiagnosticsV10Core();const box=$('#diagnosticResult'),extra=[];const stage=activeStage(todayDate());if(todayDate()<=V10_OCT_EXAM&&stage.key!=='oct'&&todayDate()>EXAM9)extra.push('10월 학평 단계 판정 불일치');for(const row of curriculumRowsV90()){const m=row.meta||{};if(m.targetDate&&dateCompare(m.targetDate,todayDate())<0&&row.total!=null&&row.done<row.total)extra.push(`목표일 경과 과정: ${row.name}`)}for(const d of Object.keys(DB.schedules||{})){const constraints=fixedConstraintsForDateV10(d);for(const c of constraints)for(const b of ensureSchedule(d).filter(x=>x.selfStudy)){if(blocksOverlap(b,{start:c.start,end:c.end}))extra.push(`고정 일정과 자습 겹침: ${d} ${b.name} / ${c.label}`)}}if(extra.length)box.insertAdjacentHTML('beforeend',`<hr><b>v2 판단 엔진 점검 ${extra.length}개</b><ul class="diagnostic-list">${extra.slice(0,60).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`);else box.insertAdjacentHTML('beforeend','<hr><b>v2 판단 엔진 연결 정상</b>')};

const renderGoalsV10Core=renderGoals__impl1;
__impl_renderGoals=renderGoals__impl2;
function renderGoals__impl2(){renderGoalsV10Core();const st=activeStage(viewDate);$('#goalStageBadge').textContent=`${st.title} · D-${dday(st.target,viewDate)}`};

const renderSettingsSaveHookV10=bindEvents__impl2;
__impl_bindEvents=bindEvents__impl3;
function bindEvents__impl3(){renderSettingsSaveHookV10();if($('#capacityModeSetting'))$('#capacityModeSetting').onchange=()=>{};const oldSave=$('#saveSettings').onclick;$('#saveSettings').onclick=()=>{DB.settings.lectureDailyCap=Number($('#lectureDailyCap').value)||5;DB.settings.curriculumDeadline=$('#curriculumDeadlineSetting').value||V10_CURRICULUM_CLOSE;DB.settings.weekdayCapacityHours=Math.max(0,Number($('#weekdayCapacitySetting').value)||10);DB.settings.weekendCapacityHours=Math.max(0,Number($('#weekendCapacitySetting').value)||14);DB.settings.studyCutoff=$('#studyCutoffSetting').value||'';DB.settings.capacityMode=$('#capacityModeSetting')?.value||'schedule';DB.settings.automationEnabled=$('#automationEnabledSetting').checked;saveDB();alert('설정을 저장했습니다. 실제 시간표와 수면 경계를 우선해 다시 계산합니다.');renderSettings()}};

__impl_renderVersionStatus=renderVersionStatus__impl3;
function renderVersionStatus__impl3(){$('#runtimeStatus').textContent='2.0 · SW 2.0'};
__impl_initPwaUpdate=initPwaUpdate__impl3;
function initPwaUpdate__impl3(){if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw-v200.js?v=2000').then(reg=>{reg.update().catch(()=>{});reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)$('#updateBanner')?.classList.remove('hidden')})})}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>$('#updateBanner')?.classList.remove('hidden'));const btn=$('#reloadUpdate');if(btn)btn.onclick=()=>location.reload()};

/* ---------- final v10 view overrides ---------- */
__impl_renderProgress=renderProgress__impl4;
function renderProgress__impl4(){
 const rows=curriculumRowsV90(),plans=rows.map(r=>coursePlanV10(r,viewDate)),load=curriculumLoadV90(viewDate),pressure=$('#curriculumPressure');
 if(pressure){const cap=load.capacity.totalHours,overdue=plans.filter(x=>x.overdue).length,stopped=plans.filter(x=>x.stopped).length;pressure.innerHTML=`<div><span>남은 필요량</span><b>${(load.low/60).toFixed(1)}–${(load.high/60).toFixed(1)}h</b><small>시간 미정 ${load.unknown.length}개</small></div><div><span>10.16까지 실제 가용</span><b>${cap.toFixed(1)}h</b><small>시간표 기준 · 보호일 ${load.capacity.zeroDays}일</small></div><div><span>과정별 마감</span><b>${overdue?`지연 ${overdue}`:'정상'}</b><small>이번 주 일시중단 ${stopped}개</small></div><div><span>오늘 최소</span><b>${load.low||load.high?`${load.todayLow.toFixed(1)}–${load.todayHigh.toFixed(1)}h`:'미정'}</b><small>과정별 목표일을 따로 역산</small></div>`}
 const box=$('#progressCatalog'),subs=[...new Set(plans.map(x=>x.subject))];box.innerHTML=plans.length?subs.map(s=>`<section class="progress-group"><h4>${esc(s)}</h4><div class="progress-grid">${plans.filter(x=>x.subject===s).map(r=>{const w=r.workload,p=r.total?pct(r.done,r.total):0,e=courseMasteryEvidenceV10(r),target=r.target||deadlineDate();return`<article class="progress-card intelligence ${r.overdue?'overdue':''}"><div class="progress-card-top"><span class="kind-pill">${r.kind==='lecture'?'인강':r.kind==='book'?'문제집':'과정'}</span><button class="text-link course-meta-btn" data-id="${esc(r.id)}" data-kind="${esc(r.kind)}">분량·종료기준</button></div><h5>${esc(r.name)}</h5><div class="progress-line"><i style="width:${p}%"></i></div><b>${r.total==null?(w.range?`${w.remainingLow}–${w.remainingHigh}단위 남음`:'분량 미정'):`${r.done}/${r.total} · ${p}%`}</b><div class="task-meta">목표 ${target.slice(5)} · ${r.waitingRelease?`${r.releaseStart.slice(5)} 공개 시작 · `:''}${r.overdue?'목표일 경과 · ':''}${r.stopped?'이번 주 일시중단 · ':''}남은 시간 ${w.unknown?'미정':`${(w.low/60).toFixed(1)}–${(w.high/60).toFixed(1)}h`}${w.source?` · ${w.source}`:''}</div><div class="task-meta">오늘 필요 ${r.waitingRelease?'공개 전':r.todayLow?`${(r.todayLow/60).toFixed(1)}–${(r.todayHigh/60).toFixed(1)}h`:'0h'} · ${e.status}</div>${masteryChips(r)}</article>`}).join('')}</div></section>`).join(''):'<div class="empty-state">학습 자판기에 과정이나 문제집을 등록하세요.</div>';$$('.course-meta-btn').forEach(b=>b.onclick=e=>{e.stopPropagation();openCourseMeta(b.dataset.id,b.dataset.kind)})
};

__impl_renderGoals=renderGoals__impl3;
function renderGoals__impl3(){
 const st=activeStage(viewDate);$('#goalStageBadge').textContent=`${st.title} · D-${dday(st.target,viewDate)}`;$('#gradeForecast').innerHTML=SUBJECTS.map(s=>{const rep=latestRepresentative(s),row=rep?testSubjectRows(rep.test).find(r=>r.subject===s):null,max=V10_MAX_SCORE[s],score=Number(row?.score);const state=Number.isFinite(score)&&score>0?(score===max?'만점 기록':`만점까지 ${max-score}점`):'점수 근거 없음';return`<div class="gap-row"><b>${s}</b><span>${Number.isFinite(score)&&score>0?`최근 ${score}/${max} · ${rep.test.date}`:'최근 원점수 없음'} · 목표 만점</span><b>${state}</b></div>`}).join('');
 const plans=curriculumRowsV90().map(r=>coursePlanV10(r,viewDate)).filter(r=>r.workload.included!==false&&!r.stopped),known=plans.filter(r=>!r.workload.unknown),unknown=plans.filter(r=>r.workload.unknown),today=known.reduce((s,r)=>s+r.todayHigh,0)/60,cap=capacityHoursFor(viewDate),risk=unknown.length?'부분계산':today>cap?'위험':today>cap*.85?'빡빡':'가능';$('#finishPressureBadge').textContent=unknown.length?`${risk} · 확정 상한 ${today.toFixed(1)}h + 미정 ${unknown.length}개 / 가용 ${cap.toFixed(1)}h`:`${risk} · 오늘 상한 ${today.toFixed(1)}h / 가용 ${cap.toFixed(1)}h`;$('#finishForecast').innerHTML=plans.map(r=>`<div class="gap-row"><b>${esc(r.name)}</b><span>${r.total==null?(r.workload.range?`${r.workload.remainingLow}–${r.workload.remainingHigh}단위 남음`:'분량 미정'):`${r.done}/${r.total}`} · 목표 ${r.target.slice(5)}${r.waitingRelease?` · ${r.releaseStart.slice(5)} 공개`:''}${r.overdue?' · 지연':''}</span><b>${r.workload.unknown?'시간 미정':r.waitingRelease?'공개 전':`${(r.todayHigh/60).toFixed(1)}h/오늘`}</b></div>`).join('')||'<div class="muted">과정 정보가 없습니다.</div>';renderRoadmap();renderGapList('#gapDetail',studyGaps(viewDate));
};

const renderDashboardV10FinalCore=renderDashboard__impl3;
__impl_renderDashboard=renderDashboard__impl4;
function renderDashboard__impl4(){renderDashboardV10FinalCore();if($('#stageLabel'))$('#stageLabel').textContent='최종 목표';if($('#stageTitle'))$('#stageTitle').textContent='수능 만점';if($('#stageDesc'))$('#stageDesc').textContent='11.19';const load=curriculumLoadV90(viewDate),avg=periodAverageNeedV11(viewDate),gap=todayPlanGapV11(viewDate),q=$('#dailyQuotaBySubject'),need=$('#todayNeedHours');if($('#todayAvailableHours'))$('#todayAvailableHours').textContent=`${load.todayCap.toFixed(1)}h`;if($('#periodAverageHours'))$('#periodAverageHours').textContent=`${avg.low.toFixed(1)}–${avg.high.toFixed(1)}h`;if($('#periodAverageCaption'))$('#periodAverageCaption').textContent=avg.unknown?`미정 ${avg.unknown}개 별도`:'';if($('#todayPlanGap')){const shortage=Math.max(0,-gap.gapHigh),surplus=Math.max(0,gap.gapLow);$('#todayPlanGap').textContent=shortage>0?`-${shortage.toFixed(1)}h 부족`:surplus>0?`+${surplus.toFixed(1)}h 여유`:'경계';$('#todayPlanGap').classList.toggle('metric-risk',shortage>0)}if($('#todayPlanGapCaption'))$('#todayPlanGapCaption').textContent=load.unknown.length?`미정 ${load.unknown.length}개 별도`:'';if(need){if(load.unknown.length&&!(load.low||load.high))need.textContent='계산 불가';else if(load.unknown.length)need.textContent=`확정 ${load.todayLow.toFixed(1)}–${load.todayHigh.toFixed(1)}h +`;else need.textContent=`${load.todayLow.toFixed(1)}–${load.todayHigh.toFixed(1)}h`;}if(q){const known=load.bySubject.filter(x=>x.todayLow||x.todayHigh);q.innerHTML=known.length?known.sort((a,b)=>b.todayHigh-a.todayHigh).map(x=>`<div class="quota-row"><b>${esc(x.subject)}</b><span><i style="width:${Math.min(100,load.todayHigh?x.todayHigh/load.todayHigh*100:0)}%"></i></span><strong>${x.todayLow.toFixed(1)}–${x.todayHigh.toFixed(1)}h</strong></div>`).join(''):`<div class="empty-state">과정별 시간 근거가 아직 부족합니다. 직접 시간을 입력하거나 시간표 관측이 2회 이상 쌓이면 계산합니다.</div>`}const cap=$('#todayNeedCaption');if(cap)cap.textContent=load.unknown.length?`미정 ${load.unknown.length}개 별도`:''};

const renderSettingsV101Core=renderSettings__impl3;
__impl_renderSettings=renderSettings__impl4;
function renderSettings__impl4(){renderSettingsV101Core();renderSafetySnapshotsV10()};
