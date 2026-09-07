/* 曆象 v11 · 수능 만점 운영체제 */
'use strict';

const APP_VERSION='11.0';
const SCHEMA_VERSION=14;
const BUILD='2026-09-07-v11';
const EXAM9='2026-09-02';
const CSAT='2026-11-19';
const SUBJECTS=['국어','수학','영어','사회문화','경제'];
const GOAL9={'국어':1,'수학':1,'영어':1,'사회문화':2,'경제':2};
const GOAL_CSAT={'국어':1,'수학':1,'영어':1,'사회문화':1,'경제':1};
const DB_KEY='p11122_v60_db';

/* v11 single public dispatch surface: compatibility layers have unique internal names. */
let __impl_activeStage=activeStage__impl1;
function activeStage(...args){return __impl_activeStage.apply(this,args)}
let __impl_addTask=addTask__impl1;
function addTask(...args){return __impl_addTask.apply(this,args)}
let __impl_autoPlaceTasks=autoPlaceTasks__impl1;
function autoPlaceTasks(...args){return __impl_autoPlaceTasks.apply(this,args)}
let __impl_baseSchedule=baseSchedule__impl1;
function baseSchedule(...args){return __impl_baseSchedule.apply(this,args)}
let __impl_bindEvents=bindEvents__impl1;
function bindEvents(...args){return __impl_bindEvents.apply(this,args)}
let __impl_capacityHoursFor=capacityHoursFor__impl1;
function capacityHoursFor(...args){return __impl_capacityHoursFor.apply(this,args)}
let __impl_capacitySummaryV90=capacitySummaryV90__impl1;
function capacitySummaryV90(...args){return __impl_capacitySummaryV90.apply(this,args)}
let __impl_confirmCloseDay=confirmCloseDay__impl1;
function confirmCloseDay(...args){return __impl_confirmCloseDay.apply(this,args)}
let __impl_curriculumLoadV90=curriculumLoadV90__impl1;
function curriculumLoadV90(...args){return __impl_curriculumLoadV90.apply(this,args)}
let __impl_errorPatternStats=errorPatternStats__impl1;
function errorPatternStats(...args){return __impl_errorPatternStats.apply(this,args)}
let __impl_importData=importData__impl1;
function importData(...args){return __impl_importData.apply(this,args)}
let __impl_initPwaUpdate=initPwaUpdate__impl1;
function initPwaUpdate(...args){return __impl_initPwaUpdate.apply(this,args)}
let __impl_masteryChips=masteryChips__impl1;
function masteryChips(...args){return __impl_masteryChips.apply(this,args)}
let __impl_navigate=navigate__impl1;
function navigate(...args){return __impl_navigate.apply(this,args)}
let __impl_normalizeQuestionRecord=normalizeQuestionRecord__impl1;
function normalizeQuestionRecord(...args){return __impl_normalizeQuestionRecord.apply(this,args)}
let __impl_normalizeTestRecord=normalizeTestRecord__impl1;
function normalizeTestRecord(...args){return __impl_normalizeTestRecord.apply(this,args)}
let __impl_openCloseDay=openCloseDay__impl1;
function openCloseDay(...args){return __impl_openCloseDay.apply(this,args)}
let __impl_openCourseMeta=openCourseMeta__impl1;
function openCourseMeta(...args){return __impl_openCourseMeta.apply(this,args)}
let __impl_openLectureModal=openLectureModal__impl1;
function openLectureModal(...args){return __impl_openLectureModal.apply(this,args)}
let __impl_openSleepModal=openSleepModal__impl1;
function openSleepModal(...args){return __impl_openSleepModal.apply(this,args)}
let __impl_openTestModal=openTestModal__impl1;
function openTestModal(...args){return __impl_openTestModal.apply(this,args)}
let __impl_openTestReviewModal=openTestReviewModal__impl1;
function openTestReviewModal(...args){return __impl_openTestReviewModal.apply(this,args)}
let __impl_renderAnalysis=renderAnalysis__impl1;
function renderAnalysis(...args){return __impl_renderAnalysis.apply(this,args)}
let __impl_renderCondition=renderCondition__impl1;
function renderCondition(...args){return __impl_renderCondition.apply(this,args)}
let __impl_renderConditionAnalysis=renderConditionAnalysis__impl1;
function renderConditionAnalysis(...args){return __impl_renderConditionAnalysis.apply(this,args)}
let __impl_renderDashboard=renderDashboard__impl1;
function renderDashboard(...args){return __impl_renderDashboard.apply(this,args)}
let __impl_renderErrorPatterns=renderErrorPatterns__impl1;
function renderErrorPatterns(...args){return __impl_renderErrorPatterns.apply(this,args)}
let __impl_renderGoals=renderGoals__impl1;
function renderGoals(...args){return __impl_renderGoals.apply(this,args)}
let __impl_renderProgress=renderProgress__impl1;
function renderProgress(...args){return __impl_renderProgress.apply(this,args)}
let __impl_renderProtocolBoard=renderProtocolBoard__impl1;
function renderProtocolBoard(...args){return __impl_renderProtocolBoard.apply(this,args)}
let __impl_renderSettings=renderSettings__impl1;
function renderSettings(...args){return __impl_renderSettings.apply(this,args)}
let __impl_renderStabilityBoard=renderStabilityBoard__impl1;
function renderStabilityBoard(...args){return __impl_renderStabilityBoard.apply(this,args)}
let __impl_renderTests=renderTests__impl1;
function renderTests(...args){return __impl_renderTests.apply(this,args)}
let __impl_renderVersionStatus=renderVersionStatus__impl1;
function renderVersionStatus(...args){return __impl_renderVersionStatus.apply(this,args)}
let __impl_renderWeeklyCommand=renderWeeklyCommand__impl1;
function renderWeeklyCommand(...args){return __impl_renderWeeklyCommand.apply(this,args)}
let __impl_rowWorkloadV90=rowWorkloadV90__impl1;
function rowWorkloadV90(...args){return __impl_rowWorkloadV90.apply(this,args)}
let __impl_runDiagnostics=runDiagnostics__impl1;
function runDiagnostics(...args){return __impl_runDiagnostics.apply(this,args)}
let __impl_saveBlockModal=saveBlockModal__impl1;
function saveBlockModal(...args){return __impl_saveBlockModal.apply(this,args)}
let __impl_saveCondition=saveCondition__impl1;
function saveCondition(...args){return __impl_saveCondition.apply(this,args)}
let __impl_saveCourseMeta=saveCourseMeta__impl1;
function saveCourseMeta(...args){return __impl_saveCourseMeta.apply(this,args)}
let __impl_saveDB=saveDB__impl1;
function saveDB(...args){return __impl_saveDB.apply(this,args)}
let __impl_saveLectureModal=saveLectureModal__impl1;
function saveLectureModal(...args){return __impl_saveLectureModal.apply(this,args)}
let __impl_saveSleepModal=saveSleepModal__impl1;
function saveSleepModal(...args){return __impl_saveSleepModal.apply(this,args)}
let __impl_saveTestModal=saveTestModal__impl1;
function saveTestModal(...args){return __impl_saveTestModal.apply(this,args)}
let __impl_saveTestReviewModal=saveTestReviewModal__impl1;
function saveTestReviewModal(...args){return __impl_saveTestReviewModal.apply(this,args)}
let __impl_saveWeeklyCommand=saveWeeklyCommand__impl1;
function saveWeeklyCommand(...args){return __impl_saveWeeklyCommand.apply(this,args)}
let __impl_subjectStability=subjectStability__impl1;
function subjectStability(...args){return __impl_subjectStability.apply(this,args)}
let __impl_validateBackupObject=validateBackupObject__impl1;
function validateBackupObject(...args){return __impl_validateBackupObject.apply(this,args)}


const BUILTIN_LECTURES=[
 {key:'kor-origin',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Origin',display:'All Of KICE Origin',total:14},
 {key:'kor-pred-read',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서',display:'All Of KICE Predator 독서',total:32},
 {key:'kor-pred-lit',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 문학',display:'All Of KICE Predator 문학',total:38},
 {key:'kor-wow',subject:'국어',provider:'김승리',series:'All Of KICE',name:'Predator 독서 W.O.W',display:'All Of KICE Predator 독서 W.O.W',total:56},
 {key:'eco-leadin',subject:'경제',provider:'우영호',series:'경제',name:'LEAD IN',display:'LEAD IN',total:29},
 {key:'eco-core',subject:'경제',provider:'우영호',series:'경제',name:'CORE',display:'CORE',total:7},
 {key:'soc-limit',subject:'사회문화',provider:'임정환',series:'사회문화',name:'LIM IT',display:'LIM IT',total:30}
];

const SCHOOL={
 1:[['물리학Ⅱ',0,0],['인공지능수학',0,0],['지구과학Ⅱ',1,0],['진로',1,1],['언어와매체',0,0],['미적분',0,0],['공강',1,1]],
 2:[['지구과학Ⅱ',1,0],['과학과제연구',1,0],['화학Ⅱ',0,0],['사회문제탐구',1,1],['정보과제연구',1,1],['물리학Ⅱ',0,0],['생명과학Ⅱ',1,0]],
 3:[['미적분',0,0],['정보과제연구',1,1],['스포츠생활',0,0],['화학Ⅱ',0,0],['과학융합',1,1],['공강',1,1],['공강',1,1]],
 4:[['지구과학Ⅱ',1,0],['사회문제탐구',1,1],['미적분',0,0],['생명과학Ⅱ',1,0],['과학융합',1,1],['물리학Ⅱ',0,0],['언어와매체',0,0]],
 5:[['환경',1,1],['과학과제연구',1,0],['인공지능수학',0,0],['화학Ⅱ',0,0],['공강',1,1],['공강',1,1],['생명과학Ⅱ',1,0]]
};
const DAYNAME=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
const SATURDAY=[
 ['08:40','09:50','1교시'],['10:00','11:10','2교시'],['11:20','12:30','3교시'],
 ['13:30','14:40','4교시'],['14:50','15:50','5교시'],['16:00','17:00','6교시']
];
const PRIORITY_LABEL={must:'필수',should:'권장',extra:'여유'};
const ERROR_CAUSES=['시간 부족','개념 부족','계산 실수','문제 해석','부주의','찍음'];
const TEST_SOURCES=['평가원 모의평가','교육청 학력평가','수능','사설 모의고사','학교 모의고사','단원·과목 실모','기타'];
const TEST_SOURCE_LABELS={'평가원 모의평가':'평가원 모의평가 (모평)','교육청 학력평가':'교육청 학력평가 (학평)'};
const TEST_SCOPES=['full','partial','unit'];
const TEST_SCOPE_LABELS={full:'전범위',partial:'부분 범위',unit:'단원·유형'};
const QUESTION_LIMITS={국어:45,수학:30,영어:45,사회문화:20,경제:20};
const QUESTION_STATUS_LABELS={wrong:'틀림',uncertain:'애매하지만 맞음'};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const uid=()=>crypto.randomUUID?.()||('id-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const deep=x=>JSON.parse(JSON.stringify(x));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function ymd(d=new Date()){const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`}
function todayDate(){return ymd()}
function mondayOf(date){const d=parseDate(date),day=d.getDay(),shift=day===0?-6:1-day;d.setDate(d.getDate()+shift);return ymd(d)}
function dateCompare(a,b){return String(a||'').localeCompare(String(b||''))}
function addDays(date,n){const d=parseDate(date);d.setDate(d.getDate()+n);return ymd(d)}
function parseDate(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d,12,0,0,0)}
function fmtDate(s){const d=parseDate(s);return `${d.getMonth()+1}월 ${d.getDate()}일 ${DAYNAME[d.getDay()]}`}
function daysBetween(a,b){return Math.ceil((parseDate(b)-parseDate(a))/86400000)}
function minuteLabel(n){n=Math.max(0,Math.round(n));return n>=60?`${Math.floor(n/60)}시간${n%60?` ${n%60}분`:''}`:`${n}분`}
function hoursLabel(n){return (n/60).toFixed(1)+'h'}
function timeToMin(t){if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m}
function durationMin(start,end){if(!start||!end)return 0;let a=timeToMin(start),b=timeToMin(end);if(b<=a)b+=1440;return Math.max(0,b-a)}
function plannerMinute(t){let m=timeToMin(t);if(m==null)return null;if(m<300)m+=1440;return m}
function plannerIndexToTime(i){let m=300+i*10;m%=1440;return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
function plannerIndexForTime(t){const m=plannerMinute(t);return m==null?null:Math.round((m-300)/10)}
function dateInRange(date,start,end){return (!start||date>=start)&&(!end||date<=end)}
function subjectClass(s){return s==='국어'?'sub-kor':s==='수학'?'sub-math':s==='영어'?'sub-eng':s==='사회문화'?'sub-soc':s==='경제'?'sub-eco':'sub-other'}
function activeStage__impl1(date=todayDate()){return date<=EXAM9?{key:'nine',title:'9월 모의평가 대비',target:EXAM9,goals:GOAL9,label:'중간 체크포인트'}:{key:'csat',title:'수능 최종 대비',target:CSAT,goals:GOAL_CSAT,label:'최종 목표'}}
function dday(target,date=todayDate()){return Math.max(0,daysBetween(date,target))}
function parseMinutesLike(v){if(v==null||v==='')return 0;if(typeof v==='number')return v;const s=String(v);let n=0;const h=s.match(/(\d+(?:\.\d+)?)\s*시간/);const m=s.match(/(\d+)\s*분/);if(h)n+=Number(h[1])*60;if(m)n+=Number(m[1]);if(!h&&!m&&/^\d+(?:\.\d+)?$/.test(s.trim()))n=Number(s);return Math.round(n)}

function defaultDB(){
 const periodTimes={};for(let i=1;i<=7;i++)periodTimes[i]={start:'',end:''};
 return {
  schema:SCHEMA_VERSION,createdAt:Date.now(),
  settings:{lectureDailyCap:5,periodTimes,taskSortMode:'timeline'},
  tasks:{},schedules:{},scheduleModes:{},scheduleHidden:{},scheduleTemplates:[],customLectures:[],lectureState:{},books:[],bookState:{},
  automations:[],automationSkips:{},automationConflicts:[],automationRuns:{},waiting:[],tests:[],condition:{},plannerMeta:{},
  studyOverrides:{},planLocks:{},recentLearning:[],trash:[],closeHistory:[],dailyRecords:{},meta:{}
 }
}
function legacy(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function migrateLegacy(){
 const d=defaultDB();
 const oldTasks=legacy('p11122_v2_tasks',{});
 Object.entries(oldTasks).forEach(([date,list])=>{
  d.tasks[date]=(Array.isArray(list)?list:[]).filter(t=>!(t.name==='직접 계획 입력'&&!t.material&&!t.note)).map(normalizeImportedTask)
 });
 d.schedules=legacy('p11122_v2_schedules',{});
 d.customLectures=legacy('p11122_v30_custom_lectures',[]);
 d.lectureState=legacy('p11122_v30_lecture_state',{});
 d.books=legacy('p11122_v40_problem_books',[]);
 d.bookState={...legacy('p11122_v40_book_state',{}),...legacy('p11122_v50_book_part_state',{})};
 d.automations=legacy('p11122_v50_automations',[]).map(r=>({...r,minutes:parseMinutesLike(r.duration)}));
 d.automationSkips=legacy('p11122_v50_automation_skips',{});
 d.automationConflicts=legacy('p11122_v50_automation_conflicts',[]);
 d.waiting=legacy('p11122_v50_waiting',[]).map(normalizeImportedTask);
 d.tests=legacy('p11122_v2_tests',[]).map(t=>normalizeTestRecord({...t,causes:Array.isArray(t.causes)?t.causes:(t.reason?[t.reason]:[]),wrongQuestions:t.wrongQuestions||''}));
 d.condition=legacy('p11122_v23_condition',{});
 const oldHours=legacy('p11122_v2_hours',{});
 Object.entries(oldHours).forEach(([date,h])=>{if(Number(h)>0)d.studyOverrides[date]=Math.round(Number(h)*60)});
 d.planLocks=legacy('p11122_v50_plan_locks',{});
 d.recentLearning=legacy('p11122_v50_recent_learning',[]);
 const oldSettings=legacy('p11122_v2_settings',{});
 if(oldSettings.lectureDailyCap)d.settings.lectureDailyCap=Number(oldSettings.lectureDailyCap)||5;
 return d
}
function normalizeImportedTask(t){
 const x={...deep(t),id:t.id||uid(),priority:t.priority||'should',subject:t.subject||'기타',name:t.name||'할 일',material:t.material||'',note:t.note||'',minutes:parseMinutesLike(t.minutes||t.duration),splitMode:t.splitMode==='contiguous'?'contiguous':'flex',done:Boolean(t.done)};
 if(Array.isArray(t.components)&&t.components.length){
  x.components=t.components.map(c=>({...deep(c),id:c.id||uid(),done:Boolean(c.done),label:c.label||'세부 항목'}))
 }else if(Array.isArray(t.lectureIds)&&t.lectureIds.length){
  x.components=t.lectureIds.map(ref=>({id:'cmp-'+ref,kind:'lecture',ref,label:String(ref).split('::').at(-1)+'강',done:Boolean(t.done)}))
 }else if(t.bookItem){
  x.components=[{id:uid(),kind:'book',bookItem:deep(t.bookItem),label:t.bookItem.subunit||t.bookItem.label||t.name,done:Boolean(t.done)}]
 }else{
  x.components=[{id:uid(),kind:'manual',label:x.name,done:Boolean(t.done)}]
 }
 x.done=x.components.length?x.components.every(c=>c.done):Boolean(t.done);
 return x
}
function parseQuestionNumbers(value){
 const values=Array.isArray(value)?value:String(value??'').match(/\d+/g)||[];
 return [...new Set(values.map(Number).filter(n=>Number.isInteger(n)&&n>0&&n<=99))].sort((a,b)=>a-b)
}
function questionKey(subject,number){return `${subject}:${number}`}
function normalizeQuestionRecord__impl1(q,fallback={}){
 const subject=SUBJECTS.includes(q?.subject)?q.subject:(SUBJECTS.includes(fallback.subject)?fallback.subject:'국어');
 const number=Number(q?.number);
 if(!Number.isInteger(number)||number<1||number>99)return null;
 const status=q?.status==='uncertain'?'uncertain':'wrong';
 const retryState=q?.retryState==='resolved'?'resolved':'pending';
 return {id:q?.id||`q-${subject}-${number}-${status}`,subject,number,status,type:String(q?.type||''),cause:ERROR_CAUSES.includes(q?.cause)?q.cause:'',note:String(q?.note||''),retryDue:String(q?.retryDue||fallback.retryDue||''),retryState,retryHistory:Array.isArray(q?.retryHistory)?q.retryHistory.map(x=>({date:String(x?.date||''),result:String(x?.result||'')})):[],pattern:String(q?.pattern||''),trigger:String(q?.trigger||''),behavior:String(q?.behavior||''),missedCheck:String(q?.missedCheck||''),rootCause:String(q?.rootCause||''),controlRule:String(q?.controlRule||''),answerOutcome:String(q?.answerOutcome||''),answerChanged:Boolean(q?.answerChanged)}
}
function questionRecordsFromTexts(subject,wrongText,uncertainText,date,existing=[]){
 const byKey=new Map();
 (existing||[]).map(x=>normalizeQuestionRecord(x,{subject,retryDue:addDays(date,1)})).filter(Boolean).forEach(x=>byKey.set(questionKey(x.subject,x.number),x));
 parseQuestionNumbers(uncertainText).forEach(number=>{const key=questionKey(subject,number);if(!byKey.has(key))byKey.set(key,normalizeQuestionRecord({subject,number,status:'uncertain',retryDue:addDays(date,1)},{subject}))});
 parseQuestionNumbers(wrongText).forEach(number=>{const key=questionKey(subject,number),old=byKey.get(key);byKey.set(key,{...(old||normalizeQuestionRecord({subject,number,retryDue:addDays(date,1)},{subject})),status:'wrong'})});
 return [...byKey.values()].sort((a,b)=>a.number-b.number)
}
function normalizeTestRecord__impl1(t){
 const x={...deep(t||{}),id:t?.id||uid(),kind:t?.kind==='full'?'full':'single',source:TEST_SOURCES.includes(t?.source)?t.source:'기타',round:String(t?.round||''),name:t?.name||'',date:t?.date||todayDate(),causes:Array.isArray(t?.causes)?t.causes.filter(c=>ERROR_CAUSES.includes(c)):[],memo:t?.memo||''};
 x.scope=x.kind==='full'?'full':(TEST_SCOPES.includes(t?.scope)?t.scope:(x.source==='단원·과목 실모'?'unit':'full'));
 if(x.kind==='full'){
  x.scores=x.scores&&typeof x.scores==='object'?x.scores:{};x.grades=x.grades&&typeof x.grades==='object'?x.grades:{};x.wrongs=x.wrongs&&typeof x.wrongs==='object'?x.wrongs:{};x.minutes=x.minutes&&typeof x.minutes==='object'?x.minutes:{};x.wrongQuestionMap=x.wrongQuestionMap&&typeof x.wrongQuestionMap==='object'?x.wrongQuestionMap:{};x.uncertainQuestionMap=x.uncertainQuestionMap&&typeof x.uncertainQuestionMap==='object'?x.uncertainQuestionMap:{};
 }else{
  x.subject=SUBJECTS.includes(x.subject)?x.subject:'국어';x.score=Number(x.score)||0;x.grade=Number(x.grade)||0;x.minutes=Number(x.minutes)||0;x.wrongCount=Number(x.wrongCount)||0;x.wrongQuestions=String(t?.wrongQuestions||'');x.uncertainQuestions=String(t?.uncertainQuestions||'')
 }
 const supplied=Array.isArray(t?.questionRecords)?t.questionRecords.map(q=>normalizeQuestionRecord(q,{retryDue:addDays(x.date,1)})).filter(Boolean):[];
 if(supplied.length){x.questionRecords=supplied}
 else if(x.kind==='full'){
  x.questionRecords=SUBJECTS.flatMap(subject=>questionRecordsFromTexts(subject,x.wrongQuestionMap[subject],x.uncertainQuestionMap[subject],x.date))
 }else x.questionRecords=questionRecordsFromTexts(x.subject,x.wrongQuestions,x.uncertainQuestions,x.date);
 return x
}
function safeSetItem(key,value,{silent=false}={}){
 try{localStorage.setItem(key,value);return true}catch(e){if(!silent&&!safeSetItem.warned){safeSetItem.warned=true;setTimeout(()=>alert('저장 공간이 부족하거나 브라우저 저장이 차단되어 기록을 저장하지 못했습니다. 백업을 내보낸 뒤 저장 공간을 확인하세요.'),0)}return false}
}
function approximateStorageBytes(){let n=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'',v=localStorage.getItem(k)||'';n+=(k.length+v.length)*2}}catch{}return n}
function automationRunKey(ruleId,date){return `${ruleId}:${date}`}
function inferAutomationRuns(d){d.automationRuns=d.automationRuns||{};Object.entries(d.tasks||{}).forEach(([date,arr])=>(arr||[]).forEach(t=>{if(t.automationRuleId)d.automationRuns[automationRunKey(t.automationRuleId,date)]={status:'task',taskId:t.id,at:d.automationRuns[automationRunKey(t.automationRuleId,date)]?.at||Date.now()}}));(d.automationConflicts||[]).forEach(c=>{if(c.ruleId&&c.date)d.automationRuns[automationRunKey(c.ruleId,c.date)]={status:'conflict',conflictId:c.id,at:Date.now()}});return d}
function normalizeDBShape(d){
 const base=defaultDB();d={...base,...(d||{}),settings:{...base.settings,...((d||{}).settings||{})}};
 d.settings.periodTimes={...base.settings.periodTimes,...(d.settings.periodTimes||{})};
 if(!['subject','timeline'].includes(d.settings.taskSortMode))d.settings.taskSortMode='timeline';
 ['customLectures','books','automations','automationConflicts','waiting','tests','recentLearning','trash','closeHistory','scheduleTemplates'].forEach(k=>{if(!Array.isArray(d[k]))d[k]=[]});
 ['tasks','schedules','scheduleModes','scheduleHidden','lectureState','bookState','automationSkips','automationRuns','condition','plannerMeta','studyOverrides','planLocks','dailyRecords','meta','planOverrides','protocolEffects','masteryEvidence'].forEach(k=>{if(!d[k]||typeof d[k]!=='object'||Array.isArray(d[k]))d[k]={}});if(!Array.isArray(d.decisionLog))d.decisionLog=[];if(!Array.isArray(d.diagnosticSignals))d.diagnosticSignals=[];
 d.tests=d.tests.map(normalizeTestRecord);d.schema=SCHEMA_VERSION;cleanupTrash(d);return d
}
function migrateDB(raw){
 let d=raw&&typeof raw==='object'?deep(raw):defaultDB(),from=Number(d.schema)||0;
 if(from<7){d.settings=d.settings||{};d.settings.taskSortMode=d.settings.taskSortMode||'timeline'}
 if(from<8){d.automationRuns=d.automationRuns||{};inferAutomationRuns(d)}
 if(from<9){d.scheduleModes=d.scheduleModes||{};d.scheduleHidden=d.scheduleHidden||{};d.scheduleTemplates=Array.isArray(d.scheduleTemplates)?d.scheduleTemplates:[]}
 if(from<10){d.dailyRecords=d.dailyRecords||{};d.tests=(d.tests||[]).map(normalizeTestRecord)}
 if(from<11){d.tests=(d.tests||[]).map(normalizeTestRecord)}
 if(from<13){d.decisionLog=d.decisionLog||[];d.planOverrides=d.planOverrides||{};d.protocolEffects=d.protocolEffects||{};d.masteryEvidence=d.masteryEvidence||{};d.diagnosticSignals=d.diagnosticSignals||[]}
 d=normalizeDBShape(d);
 // v6.7에서 미래 날짜를 열어 생긴 충돌은 실제로 도래한 충돌이 아니므로 제거한다.
 const today=todayDate();d.automationConflicts=(d.automationConflicts||[]).filter(c=>!c.date||c.date<=today);
 Object.entries(d.automationRuns||{}).forEach(([k,v])=>{const date=k.slice(k.lastIndexOf(':')+1);if(date>today&&v?.status==='conflict')delete d.automationRuns[k]});
 inferAutomationRuns(d);d.schema=SCHEMA_VERSION;return d
}
function loadDB(){
 let raw=null;try{raw=JSON.parse(localStorage.getItem(DB_KEY)||'null')}catch{}
 if(!raw){
  const legacyKeys=['p11122_v2_tasks','p11122_v2_schedules','p11122_v30_custom_lectures','p11122_v40_problem_books','p11122_v2_tests'];
  const hasLegacy=legacyKeys.some(k=>localStorage.getItem(k)!=null);
  if(!hasLegacy&&typeof globalThis.P11122_PERSONAL_SEED==='object'&&globalThis.P11122_PERSONAL_SEED)raw=deep(globalThis.P11122_PERSONAL_SEED);
  else raw=migrateLegacy();
 }
 const from=Number(raw.schema)||0;
 if(from&&from<SCHEMA_VERSION){try{safeSetItem(`p11122_pre_migration_v${from}`,JSON.stringify(raw),{silent:true})}catch{}}
 const d=migrateDB(raw);safeSetItem(DB_KEY,JSON.stringify(d),{silent:true});return d
}
let DB=loadDB();
let LAST_SAVED_JSON=JSON.stringify(DB);
function undoHistory(){try{return JSON.parse(localStorage.getItem('p11122_v60_undo')||'[]')}catch{return[]}}
function saveDB__impl1(options={}){
 const next=JSON.stringify(DB);if(next===LAST_SAVED_JSON)return true;
 if(!safeSetItem(DB_KEY,next))return false;
 if(options.undo!==false&&LAST_SAVED_JSON){const size=approximateStorageBytes();if(size<3.8*1024*1024){const h=undoHistory();h.unshift({id:uid(),at:Date.now(),data:LAST_SAVED_JSON});safeSetItem('p11122_v60_undo',JSON.stringify(h.slice(0,5)),{silent:true})}}
 LAST_SAVED_JSON=next;return true
}
function restoreUndo(id){
 const h=undoHistory(),i=h.findIndex(x=>x.id===id);if(i<0)return;
 try{const restored=migrateDB(JSON.parse(h[i].data));const next=JSON.stringify(restored);if(!safeSetItem(DB_KEY,next))throw new Error();DB=restored;LAST_SAVED_JSON=next;safeSetItem('p11122_v60_undo',JSON.stringify(h.filter((_,j)=>j!==i)),{silent:true});viewDate=todayDate();displayMonth=viewDate.slice(0,7);alert('이전 상태로 되돌렸습니다.');renderSettings();navigate('dashboard')}catch{alert('되돌리기에 실패했습니다.')}
}
function cleanupTrash(d=DB){const cutoff=Date.now()-7*86400000;d.trash=(d.trash||[]).filter(x=>(x.deletedAt||0)>=cutoff)}

function allLectureCourses(){return [...BUILTIN_LECTURES,...(DB.customLectures||[])]}
function lectureCourse(key){return allLectureCourses().find(c=>c.key===key)}
function lectureRef(key,n){return `${key}::${n}`}
function lectureInfo(ref){const [key,n]=String(ref).split('::'),c=lectureCourse(key);return c?{...c,n:Number(n),ref}:null}
function lectureDone(ref){return Boolean(DB.lectureState?.[ref]?.completed)}
function setLectureDone(ref,done){DB.lectureState[ref]={...(DB.lectureState[ref]||{}),completed:Boolean(done)}}
function lectureCourseDone(c){let n=0;for(let i=1;i<=c.total;i++)if(lectureDone(lectureRef(c.key,i)))n++;return n}
function bookSubKey(bookId,subunit){return `${bookId}::${subunit}`}
function bookSubDone(bookId,subunit){return Boolean(DB.bookState?.[bookSubKey(bookId,subunit)]?.completed)}
function setBookSubDone(bookId,subunit,done){DB.bookState[bookSubKey(bookId,subunit)]={completed:Boolean(done)}}

function tasksFor(date){return DB.tasks[date]||(DB.tasks[date]=[])}
function taskById(date,id){return tasksFor(date).find(t=>t.id===id)}
function taskState(t){const c=Array.isArray(t.components)?t.components:[];return{done:c.filter(x=>x.done).length,total:c.length}}
function syncComponentSource(c,done){
 c.done=Boolean(done);
 if(c.kind==='lecture'&&c.ref)setLectureDone(c.ref,done);
 if(c.kind==='book'&&c.bookItem?.mode==='subunit'&&c.bookItem.subunit)setBookSubDone(c.bookItem.bookId,c.bookItem.subunit,done)
}
function setTaskDoneInternal(date,id,done){
 const t=taskById(date,id);if(!t)return;
 (t.components||[]).forEach(c=>syncComponentSource(c,done));t.done=Boolean(done);
 saveDB()
}
function setTaskComponentDone(date,id,cid,done){
 const t=taskById(date,id);if(!t)return;const c=(t.components||[]).find(x=>x.id===cid);if(!c)return;
 syncComponentSource(c,done);t.done=(t.components||[]).length?(t.components||[]).every(x=>x.done):Boolean(done);
 saveDB()
}
function taskLinkedBlocks(date,taskId){return ensureSchedule(date).filter(b=>(b.taskIds||[]).includes(taskId))}
function setBlockDone(date,blockId,done){
 const blocks=ensureSchedule(date),b=blocks.find(x=>x.id===blockId);if(!b)return;
 // 시간표 완료는 '그 시간 블록을 실제로 사용했는지'만 기록한다.
 // 연결된 할 일의 완료 상태와는 의도적으로 독립이다.
 b.done=Boolean(done);DB.schedules[date]=blocks;saveDB()
}
function addTask__impl1(date,t){const x=normalizeImportedTask({...t,id:t.id||uid(),done:false});tasksFor(date).push(x);saveDB();return x}
function removeTask(date,id,toTrash=true){
 const list=tasksFor(date),t=list.find(x=>x.id===id);if(!t)return;
 ensureSchedule(date).forEach(b=>{b.taskIds=(b.taskIds||[]).filter(x=>x!==id);if(b.taskAllocations)delete b.taskAllocations[id]});
 DB.tasks[date]=list.filter(x=>x.id!==id);
 if(toTrash)trashPush('task',t,{date});saveDB()
}
function moveTaskToWaiting(date,id,{recordMove=true}={}){
 const t=taskById(date,id);if(!t)return;if(recordMove)recordTransferredTask(date,t,'waiting');removeTask(date,id,false);const x=deep(t);x.waitingSince=date;x.done=(x.components||[]).every(c=>c.done);DB.waiting.push(x);saveDB()
}
function taskUnitSnapshot(t){
 const lectures=(t.components||[]).filter(c=>c.kind==='lecture');
 if(lectures.length)return{total:lectures.length,done:lectures.filter(c=>c.done).length};
 return{total:1,done:t.done?1:0}
}
function snapshotTaskUnits(list){
 return (list||[]).reduce((out,t)=>{const u=taskUnitSnapshot(t);out.total+=u.total;out.done+=u.done;out.tasks++;if(u.done===u.total)out.doneTasks++;return out},{total:0,done:0,tasks:0,doneTasks:0})
}
function dailyRecord(date){return DB.dailyRecords?.[date]||null}
function recordTransferredTask(date,t,kind){
 if(date>todayDate())return;const old=dailyRecord(date);if(old?.closedAt||old?.state==='closed')return;
 const u=taskUnitSnapshot(t),left=Math.max(0,u.total-u.done),r={date,state:'open',movedTotal:0,movedDone:0,movedTasks:0,movedDoneTasks:0,carried:0,waiting:0,skipped:0,...(old||{})};
 r.movedTotal=(Number(r.movedTotal)||0)+u.total;r.movedDone=(Number(r.movedDone)||0)+u.done;r.movedTasks=(Number(r.movedTasks)||0)+1;r.movedDoneTasks=(Number(r.movedDoneTasks)||0)+(u.done===u.total?1:0);
 if(kind==='waiting')r.waiting=(Number(r.waiting)||0)+left;else r.carried=(Number(r.carried)||0)+left;
 DB.dailyRecords[date]=r
}
function dailyCompletion(date){
 const record=dailyRecord(date),today=todayDate();
 if(record?.closedAt||record?.state==='closed')return{state:'closed',total:record.total||0,done:record.done||0,rate:record.total?Math.round(record.done/record.total*100):0,carried:record.carried||0,waiting:record.waiting||0,skipped:record.skipped||0};
 const live=snapshotTaskUnits(DB.tasks[date]||[]),movedTotal=Number(record?.movedTotal)||0,movedDone=Number(record?.movedDone)||0,total=live.total+movedTotal,done=live.done+movedDone,carry=Number(record?.carried)||0,waiting=Number(record?.waiting)||0;
 if(date===today)return{state:'live',total,done,rate:total?Math.round(done/total*100):0,carried:carry,waiting,skipped:0};
 if(date>today)return{state:'future',total:snapshotTaskUnits(DB.tasks[date]||[]).total,done:0,rate:null,carried:0,waiting:0,skipped:0};
 return{state:'unclosed',total,done,rate:total?Math.round(done/total*100):null,carried:carry,waiting,skipped:0}
}
function carryTaskToDate(t,date){
 const x=deep(t);x.id=uid();x.waitingSince='';x.done=(x.components||[]).length?(x.components||[]).every(c=>c.done):Boolean(x.done);tasksFor(date).push(x);return x
}

function scheduleModeFor(date){
 const raw=DB.scheduleModes?.[date];
 if(!raw)return{mode:'default',templateId:null};
 if(typeof raw==='string')return{mode:raw,templateId:null};
 return{mode:raw.mode||'default',templateId:raw.templateId||null}
}
function scheduleTemplateById(id){return (DB.scheduleTemplates||[]).find(t=>t.id===id)||null}
function scheduleModeValue(date){const x=scheduleModeFor(date);return x.mode==='template'&&x.templateId?`template:${x.templateId}`:x.mode}
function scheduleModeLabel(date){const x=scheduleModeFor(date);if(x.mode==='saturday')return'토요일 시종';if(x.mode==='off')return'학교 없음';if(x.mode==='template'){const t=scheduleTemplateById(x.templateId);return t?`저장 · ${t.name}`:'저장 시간표 없음'}return'평일 기본'}
function baseKeyFromBlock(b,date=''){
 if(b?.baseKey)return b.baseKey;const id=String(b?.id||'');const prefix=date?`${date}-`:'';const tail=prefix&&id.startsWith(prefix)?id.slice(prefix.length):id;
 if(tail==='morning')return'morning';if(/^p[1-7]$/.test(tail))return tail;if(['lunch','lunch-program','english-mock','after','dinner','night1','break','night2'].includes(tail))return tail;if(/^sat[1-6]$/.test(tail))return tail;if(tail.startsWith('tpl-'))return tail;return null
}
function fixedBlock(date,key,props){return{id:`${date}-${key}`,baseKey:key,schema:SCHEMA_VERSION,fixed:true,regular:false,period:null,taskIds:[],locked:false,done:false,actualMin:null,...props}}
function weekdayBaseSchedule(date){
 const day=parseDate(date).getDay(),a=[];if(day<1||day>5)return a;
 a.push(fixedBlock(date,'morning',{name:'아침 자습',type:'self',selfStudy:true,device:false,start:'07:50',end:'08:30'}));
 (SCHOOL[day]||[]).forEach((r,i)=>{
  if(day===5&&i+1===5)return;const p=i+1,pt=DB.settings.periodTimes?.[p]||{};
  a.push(fixedBlock(date,`p${p}`,{regular:true,period:p,name:r[0],type:r[1]?'self':'class',selfStudy:Boolean(r[1]),device:Boolean(r[2]),start:pt.start||'',end:pt.end||''}))
 });
 a.push(fixedBlock(date,'lunch',{name:'점심시간',type:'meal',selfStudy:false,device:false,start:'12:30',end:'13:00',locked:true}));
 if(day===1||day===3)a.push(fixedBlock(date,'lunch-program',{name:'영단어 프로그램',type:'class',selfStudy:false,device:false,start:'13:00',end:'13:30',locked:true}));
 if(day===2||day===4)a.push(fixedBlock(date,'lunch-program',{name:'국어 프로그램',type:'class',selfStudy:false,device:false,start:'13:00',end:'13:30',locked:true}));
 if(day===5){const p5end=DB.settings.periodTimes?.[5]?.end||'';a.push(fixedBlock(date,'english-mock',{name:'영어 모의고사',type:'class',selfStudy:false,device:false,start:'13:00',end:p5end,locked:true}))}
 const after=day<=3?['방과후 자습','self',true,true]:day===4?['나혜주 선생님 영어 독해','class',false,false]:['문두열 선생님 수학Ⅰ·수학Ⅱ·미적분(상)','class',false,false];
 a.push(fixedBlock(date,'after',{name:after[0],type:after[1],selfStudy:after[2],device:after[3],start:'16:45',end:'17:45',locked:!after[2]}));
 a.push(fixedBlock(date,'dinner',{name:'석식',type:'meal',selfStudy:false,device:false,start:'17:45',end:'18:40',locked:true}));
 a.push(fixedBlock(date,'night1',{name:'야간자율학습 1',type:'self',selfStudy:true,device:true,start:'18:40',end:'20:20'}));
 a.push(fixedBlock(date,'break',{name:'쉬는 시간',type:'break',selfStudy:false,device:false,start:'20:20',end:'20:30',locked:true}));
 a.push(fixedBlock(date,'night2',{name:'야간자율학습 2',type:'self',selfStudy:true,device:true,start:'20:30',end:'22:00'}));
 return a
}
function saturdayBaseSchedule(date){return SATURDAY.map((r,i)=>fixedBlock(date,`sat${i+1}`,{name:r[2],type:'self',selfStudy:true,device:true,start:r[0],end:r[1]}))}
function templateBaseSchedule(date,template){
 return (template?.blocks||[]).map((b,i)=>fixedBlock(date,`tpl-${template.id}-${i+1}`,{name:b.name||`블록 ${i+1}`,type:b.type||'custom',selfStudy:Boolean(b.selfStudy),device:Boolean(b.selfStudy&&b.device),start:b.start||'',end:b.end||'',locked:Boolean(b.locked),templateId:template.id,templateIndex:i}))
}
function baseSchedule__impl1(date){
 const pref=scheduleModeFor(date);
 if(pref.mode==='off')return[];
 if(pref.mode==='saturday')return saturdayBaseSchedule(date);
 if(pref.mode==='template'){const t=scheduleTemplateById(pref.templateId);if(t)return templateBaseSchedule(date,t)}
 const day=parseDate(date).getDay();if(day>=1&&day<=5)return weekdayBaseSchedule(date);if(day===6)return saturdayBaseSchedule(date);return[]
}
function normalizeBlock(b,date){
 const x={...deep(b),id:b.id||uid(),baseKey:b.baseKey||baseKeyFromBlock(b,date),schema:SCHEMA_VERSION,fixed:Boolean(b.fixed),regular:Boolean(b.regular),period:b.period||null,name:b.name||b.school||'시간 블록',type:b.type||(b.selfStudy?'self':'custom'),selfStudy:Boolean(b.selfStudy),device:Boolean(b.device),start:b.start||'',end:b.end||'',taskIds:Array.isArray(b.taskIds)?b.taskIds:[],taskAllocations:(b.taskAllocations&&typeof b.taskAllocations==='object'&&!Array.isArray(b.taskAllocations))?deep(b.taskAllocations):{},locked:Boolean(b.locked),done:Boolean(b.done),actualMin:b.actualMin==null?null:Number(b.actualMin),userOverrides:b.userOverrides?deep(b.userOverrides):null};
 if(!x.start&&b.time&&/^\d{2}:\d{2}~\d{2}:\d{2}$/.test(b.time)){[x.start,x.end]=b.time.split('~')}
 return x
}
function hiddenFixedKeys(date){return Array.isArray(DB.scheduleHidden?.[date])?DB.scheduleHidden[date]:[]}
function mergeSchedule(date,old){
 const hidden=new Set(hiddenFixedKeys(date)),base=baseSchedule(date).filter(n=>!hidden.has(n.baseKey||baseKeyFromBlock(n,date))),used=new Set();
 base.forEach(n=>{
  const key=n.baseKey||baseKeyFromBlock(n,date);const o=(old||[]).find(x=>(x.baseKey||baseKeyFromBlock(x,date))===key)||(old||[]).find(x=>x.id===n.id)||(old||[]).find(x=>n.regular&&Number(x.period)===n.period)||(old||[]).find(x=>!n.regular&&((x.name||x.school)===n.name||(`${x.start||''}~${x.end||''}`===`${n.start}~${n.end}`)));
  if(o){used.add(o.id);const q=normalizeBlock(o,date);n.taskIds=q.taskIds;n.taskAllocations=q.taskAllocations||{};n.done=q.done;n.actualMin=q.actualMin;n.locked=n.selfStudy?q.locked:n.locked;if(q.userOverrides){const u=q.userOverrides;n.name=u.name??n.name;n.type=u.type??n.type;n.selfStudy=u.selfStudy??n.selfStudy;n.device=u.device??n.device;n.start=u.start??n.start;n.end=u.end??n.end;n.userOverrides=deep(u)}}
 });
 (old||[]).filter(x=>!used.has(x.id)&&!x.regular&&!x.fixed).forEach(x=>base.push(normalizeBlock(x,date)));
 return sortBlocks(base)
}
function sortBlocks(blocks){
 return [...blocks].sort((a,b)=>{const am=plannerMinute(a.start),bm=plannerMinute(b.start);if(am!=null&&bm!=null)return am-bm||(a.fixed===b.fixed?0:a.fixed?-1:1);if(am==null&&bm==null)return(a.period||99)-(b.period||99);return am==null?-1:1})
}
function ensureSchedule(date){const old=Array.isArray(DB.schedules[date])?DB.schedules[date]:[];const merged=mergeSchedule(date,old);DB.schedules[date]=merged;return merged}
function saveSchedule(date,blocks){DB.schedules[date]=sortBlocks(blocks.map(x=>normalizeBlock(x,date)));saveDB()}
function scheduleTemplateBlocksFromDate(date){return ensureSchedule(date).map(b=>({name:b.name,type:b.type,selfStudy:Boolean(b.selfStudy),device:Boolean(b.selfStudy&&b.device),start:b.start||'',end:b.end||'',locked:Boolean(b.locked)}))}
function setDayScheduleMode(date,mode,templateId=null,{confirmChange=true}={}){
 const current=scheduleModeFor(date);if(current.mode===mode&&(current.templateId||null)===(templateId||null))return true;
 if(confirmChange&&!confirm('이 날짜의 시간표 구조를 바꿀까요? 기존 시간 블록의 할 일 배정은 해제되지만, 오늘 할 일 자체는 삭제되지 않습니다.'))return false;
 DB.scheduleModes[date]={mode,templateId:mode==='template'?templateId:null};delete DB.scheduleHidden[date];DB.schedules[date]=[];saveDB();return true
}
function restoreDeletedFixedBlocks(date){if(!hiddenFixedKeys(date).length)return false;delete DB.scheduleHidden[date];saveDB();ensureSchedule(date);saveDB({undo:false});return true}
function createScheduleTemplate(name,blocks){const t={id:uid(),name:name.trim()||'저장 시간표',blocks:deep(blocks||[]),createdAt:Date.now(),updatedAt:Date.now()};DB.scheduleTemplates.push(t);saveDB();return t}
function updateScheduleTemplate(id,patch){const t=scheduleTemplateById(id);if(!t)return null;Object.assign(t,deep(patch||{}),{updatedAt:Date.now()});saveDB();return t}
function deleteScheduleTemplate(id){
 const usedDates=Object.entries(DB.scheduleModes||{}).filter(([,m])=>m&&typeof m==='object'&&m.mode==='template'&&m.templateId===id).map(([d])=>d);
 if(usedDates.length&&!confirm(`이 저장 시간표가 ${usedDates.length}개 날짜에 적용되어 있습니다. 삭제하면 해당 날짜는 평일 기본으로 돌아갑니다. 계속할까요?`))return false;
 DB.scheduleTemplates=DB.scheduleTemplates.filter(t=>t.id!==id);usedDates.forEach(d=>{DB.scheduleModes[d]={mode:'default',templateId:null};delete DB.scheduleHidden[d];DB.schedules[d]=[]});saveDB();return true
}
function blockDuration(b){return durationMin(b.start,b.end)}
function blockInterval(b){if(!b?.start||!b?.end)return null;const start=plannerMinute(b.start),dur=durationMin(b.start,b.end);return start==null||!dur?null:{start,end:start+dur}}
function blocksOverlap(a,b){const x=blockInterval(a),y=blockInterval(b);return Boolean(x&&y&&x.start<y.end&&y.start<x.end)}
function invalidBlockTime(b){if(!b.start||!b.end)return false;const d=durationMin(b.start,b.end);return d<=0||d>720}
function plannedStudy(date){
 const blocks=ensureSchedule(date);let minutes=0,unknown=0;
 blocks.filter(b=>b.selfStudy).forEach(b=>{if(b.start&&b.end)minutes+=blockDuration(b);else unknown++});
 return{minutes,unknown}
}
function autoActualStudy(date){
 let minutes=0;
 ensureSchedule(date).filter(b=>b.selfStudy).forEach(b=>{
  if(b.actualMin!=null&&b.actualMin!=='')minutes+=Math.max(0,Number(b.actualMin)||0);
  else if(b.done)minutes+=blockDuration(b)
 });
 return Math.round(minutes)
}
function finalStudy(date){return DB.studyOverrides[date]!=null?Number(DB.studyOverrides[date]):autoActualStudy(date)}
function readPlanMeta(date){return DB.plannerMeta?.[date]||{bed:'',wake:''}}
function planMeta(date){if(!DB.plannerMeta)DB.plannerMeta={};return DB.plannerMeta[date]||(DB.plannerMeta[date]={bed:'',wake:''})}
function sleepSession(date){
 const c=DB.condition?.[date]||{},prev=addDays(date,-1);
 return{bed:c.bed||readPlanMeta(prev).bed||'',wake:c.wake||readPlanMeta(date).wake||''}
}
function plannerNightBed(date){
 const next=addDays(date,1),c=DB.condition?.[next]||{};
 return c.bed||readPlanMeta(date).bed||''
}
function plannerMorningWake(date){const c=DB.condition?.[date]||{};return c.wake||readPlanMeta(date).wake||''}
function sleepSpanLabel(bed,wake){if(!bed||!wake)return '미설정';return calcSleep(bed,wake)||'미설정'}
function deviceMark(b){return b&&b.selfStudy&&b.device?'⌨︎ ':''}
function nextSelfStudyBlock(date){return ensureSchedule(date).find(b=>b.selfStudy&&!b.done)||null}
function plannerLegendHTML(){return ['<span class="legend-chip sub-kor">국어</span>','<span class="legend-chip sub-math">수학</span>','<span class="legend-chip sub-eng">영어</span>','<span class="legend-chip sub-soc">사회문화</span>','<span class="legend-chip sub-eco">경제</span>','<span class="legend-chip block-meal">식사</span>','<span class="legend-chip block-break">휴식</span>','<span class="legend-chip block-class">수업</span>','<span class="legend-chip sleep">☽ 취침 · ☼︎ 기상</span>'].join('')}
function regularTimeLabel(b){
 if(b.regular&&b.period&&b.start&&b.end)return `<span class="period-label">${b.period}교시</span><span class="clock-label">${b.start}~${b.end}</span>`;
 if(b.regular&&b.period)return `<span class="period-label">${b.period}교시</span>`;
 return `<span class="clock-label">${b.start&&b.end?`${b.start}~${b.end}`:'시간 미설정'}</span>`
}
function remainingStudyToday(date){
 const now=new Date(),isToday=date===todayDate();let m=0;
 ensureSchedule(date).filter(b=>b.selfStudy&&b.start&&b.end&&!b.done).forEach(b=>{
  if(!isToday){m+=blockDuration(b);return}
  const end=plannerMinute(b.end),cur=(now.getHours()<5?now.getHours()+24:now.getHours())*60+now.getMinutes();
  const start=plannerMinute(b.start);
  if(end<=cur)return;
  if(cur<=start)m+=blockDuration(b);else m+=Math.max(0,end-cur)
 });return Math.round(m)
}
function currentBlock(date=todayDate()){
 if(date!==todayDate())return null;const n=new Date(),cur=(n.getHours()<5?n.getHours()+24:n.getHours())*60+n.getMinutes();
 return ensureSchedule(date).find(b=>b.start&&b.end&&plannerMinute(b.start)<=cur&&cur<plannerMinute(b.end))||null
}
function nextBlock(date=todayDate()){
 const blocks=ensureSchedule(date).filter(b=>b.start&&b.end);if(date!==todayDate())return blocks.find(b=>!b.done)||null;
 const n=new Date(),cur=(n.getHours()<5?n.getHours()+24:n.getHours())*60+n.getMinutes();
 return blocks.find(b=>plannerMinute(b.start)>cur)||null
}
function blockSubjects(date,b){
 const ss=(b.taskIds||[]).map(id=>taskById(date,id)?.subject).filter(Boolean);return [...new Set(ss)]
}
function blockColorClass(date,b){
 const subs=blockSubjects(date,b);if(subs.length)return subjectClass(subs[0]);
 if(b.type==='meal')return'block-meal';if(b.type==='break'||b.type==='travel')return'block-break';if(b.type==='class')return'block-class';return'sub-other'
}

function trashPush(type,data,context={}){
 DB.trash.unshift({id:uid(),type,data:deep(data),context:deep(context),deletedAt:Date.now()});cleanupTrash()
}
function deleteLearningCourse(key){
 const c=DB.customLectures.find(x=>x.key===key);if(!c)return;trashPush('lectureCourse',c);DB.customLectures=DB.customLectures.filter(x=>x.key!==key);saveDB()
}
function deleteBook(id){
 const b=DB.books.find(x=>x.id===id);if(!b)return;trashPush('book',b);DB.books=DB.books.filter(x=>x.id!==id);saveDB()
}
function latestCompletedDate(subject,through=todayDate()){
 let latest='';
 Object.keys(DB.tasks).filter(d=>d<=through).sort().forEach(d=>{
  if((DB.tasks[d]||[]).some(t=>t.subject===subject&&t.done))latest=d
 });
 return latest
}
function studyGaps(date=todayDate()){
 return SUBJECTS.map(subject=>{
  const last=latestCompletedDate(subject,date);const gap=last?Math.max(0,daysBetween(last,date)):999;
  return{subject,last,gap}
 })
}
function testQuestionRecords(t,subject='all'){
 const x=normalizeTestRecord(t);return (x.questionRecords||[]).filter(q=>subject==='all'||q.subject===subject)
}
function testSubjectRows(t){
 const x=normalizeTestRecord(t);
 const makeRow=(subject,score,grade,wrong,minutes)=>{
  const questions=testQuestionRecords(x,subject),wrongRecords=questions.filter(q=>q.status==='wrong'),uncertainRecords=questions.filter(q=>q.status==='uncertain');
  return {subject,score:Number(score)||0,grade:Number(grade)||0,wrong:Math.max(Number(wrong)||0,wrongRecords.length),minutes:Number(minutes)||0,questions,wrongQuestions:wrongRecords.map(q=>q.number),uncertainQuestions:uncertainRecords.map(q=>q.number),test:x}
 };
 if(x.kind==='full')return SUBJECTS.map(subject=>makeRow(subject,x.scores?.[subject],x.grades?.[subject],x.wrongs?.[subject],x.minutes?.[subject])).filter(r=>r.score||r.grade||r.wrong||r.minutes||r.questions.length);
 return[makeRow(x.subject,x.score,x.grade,x.wrongCount,x.minutes)]
}
function testSourceLabel(source){return TEST_SOURCE_LABELS[source]||source||'기타'}
function testScopeLabel(scope){return TEST_SCOPE_LABELS[scope]||'기타'}
function subjectScoreLimit(subject){return ['사회문화','경제'].includes(subject)?50:100}
function subjectHistory(subject,{source='all',scope='all'}={}){
 let rows=DB.tests.map(normalizeTestRecord).filter(t=>source==='all'||t.source===source).flatMap(testSubjectRows).filter(r=>r.subject===subject&&(r.score||r.grade||r.wrong||r.minutes||r.questions.length));
 if(scope==='full')rows=rows.filter(r=>r.test.scope==='full');
 if(scope==='representative'){
  const full=rows.filter(r=>r.test.scope==='full');
  if(full.length)rows=full;else{const nonUnit=rows.filter(r=>r.test.scope!=='unit');if(nonUnit.length)rows=nonUnit}
 }
 return rows.sort((a,b)=>a.test.date.localeCompare(b.test.date))
}
function latestRepresentative(subject){return subjectHistory(subject,{scope:'representative'}).at(-1)||null}
function latestGrades(){
 const out={};SUBJECTS.forEach(subject=>{const row=latestRepresentative(subject);if(row?.grade)out[subject]={...row,date:row.test.date,name:row.test.name||'',source:row.test.source||'기타',round:row.test.round||''}});return out
}
function allQuestionEntries({subject='all',source='all',scope='all'}={}){
 const tests=DB.tests.map(normalizeTestRecord).filter(t=>source==='all'||t.source===source).filter(t=>scope==='all'||t.scope===scope);
 return tests.flatMap(test=>testQuestionRecords(test,subject).map(question=>({test,question})))
}
function reviewEntries({subject='all',dueOnly=false,limit=999}={}){
 const today=todayDate();return allQuestionEntries({subject}).filter(x=>x.question.retryState!=='resolved').filter(x=>!dueOnly||!x.question.retryDue||x.question.retryDue<=today).sort((a,b)=>String(a.question.retryDue||'9999-12-31').localeCompare(String(b.question.retryDue||'9999-12-31'))).slice(0,limit)
}
function mutableTest(testId){
 const i=DB.tests.findIndex(t=>t.id===testId);if(i<0)return null;DB.tests[i]=normalizeTestRecord(DB.tests[i]);return DB.tests[i]
}
function mutableQuestion(testId,questionId){return mutableTest(testId)?.questionRecords?.find(q=>q.id===questionId)||null}
function reviewStatusLabel(q){return q.retryState==='resolved'?'해결':'재풀이 대기'}
function touchRecent(kind,id,label){
 DB.recentLearning=DB.recentLearning.filter(x=>!(x.kind===kind&&x.id===id));
 DB.recentLearning.unshift({kind,id,label,at:Date.now()});DB.recentLearning=DB.recentLearning.slice(0,8);saveDB()
}

let viewDate=todayDate();
let weekViewStart=mondayOf(viewDate);
let displayMonth=viewDate.slice(0,7);
let vendingTab='all';
let cart=[];
let plannerEdit=false;
let plannerSelectStart=null;
let plannerDragStart=null;
let plannerDragEnd=null;
let plannerDragging=false;
let pendingAssignBlock=null;
let plannerSleepMode=false;
const taskDetailOpen=new Set();
const selectedQuestionBySubject={};

function showModal(id){$('#'+id)?.classList.add('show')}
function hideModal(id){$('#'+id)?.classList.remove('show')}
function navigate__impl1(page){
 if(page==='week')weekViewStart=mondayOf(viewDate);
 $$('.page').forEach(p=>p.classList.toggle('active',p.id===page));
 $$('#mainNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const btn=$(`#mainNav button[data-page="${page}"]`);
 $('#pageTitle').textContent=btn?btn.textContent:(page==='settings'?'설정·백업':'曆象');
 renderPage(page)
}
function renderPage(page){
 if(page==='dashboard')renderDashboard();
 if(page==='month')renderMonth();
 if(page==='planner')renderPlanner();
 if(page==='week')renderWeek();
 if(page==='vending')renderVending();
 if(page==='automation')renderAutomation();
 if(page==='progress')renderProgress();
 if(page==='tests')renderTests();
 if(page==='goals')renderGoals();
 if(page==='condition')renderCondition();
 if(page==='analysis')renderAnalysis();
 if(page==='settings')renderSettings()
}
function renderAllVisible(){const p=$('.page.active')?.id||'dashboard';renderPage(p);$('#topDate').textContent=fmtDate(viewDate)}

function renderDashboard__impl1(){
 if(viewDate===todayDate())runAutomationForDate(todayDate());
 const tasks=tasksFor(viewDate),units=todayUnitState(tasks),stage=activeStage(viewDate),pb=plannedStudy(viewDate),auto=autoActualStudy(viewDate),final=finalStudy(viewDate);
 $('#topDate').textContent=fmtDate(viewDate);
 $('#stageLabel').textContent=stage.label;
 $('#stageTitle').textContent=stage.title;
 $('#stageDesc').textContent=stage.key==='nine'?'기준점 분석':'전과목 만점';
 $('#dday9').textContent=viewDate>EXAM9?'완료':'D-'+dday(EXAM9,viewDate);
 $('#ddayCsat').textContent=viewDate>CSAT?'완료':'D-'+dday(CSAT,viewDate);
 $('#planLockBadge').textContent=DB.planLocks[viewDate]?'계획 확정':'계획 열림';
 $('#togglePlanLock').textContent=DB.planLocks[viewDate]?'계획 잠금 해제':'오늘 계획 확정';
 $('#focusTaskCount').textContent=`${units.done}/${units.total}`;
 const cb=currentBlock(viewDate),nb=nextBlock(viewDate);
 const nowTask=cb?(cb.taskIds||[]).map(id=>taskById(viewDate,id)).find(t=>t&&!t.done):null;
 const nextTask=nowTask||((nb?.taskIds||[]).map(id=>taskById(viewDate,id)).find(t=>t&&!t.done))||tasks.find(t=>!t.done);
 $('#focusNowTask').textContent=nextTask?.name||'아직 없음';
 $('#focusCurrentBlock').textContent=cb?.name||(viewDate===todayDate()?'현재 블록 없음':'선택 날짜');
 $('#focusRemainStudy').textContent=minuteLabel(remainingStudyToday(viewDate));
 $('#plannedStudyTime').textContent=minuteLabel(pb.minutes);
 $('#autoStudyTime').textContent=minuteLabel(auto);
 $('#finalStudyTime').textContent=minuteLabel(final);
 $('#studyOverrideHours').value=DB.studyOverrides[viewDate]!=null?(DB.studyOverrides[viewDate]/60).toFixed(1):'';
 $('#unknownPeriodHint').textContent=pb.unknown?`정규 자습 ${pb.unknown}개는 교시 시각이 없어 자동 시간 합계에서 제외됩니다. 톱니바퀴에서 평일 교시 시각을 한 번 입력하면 포함됩니다.`:'';
 renderTaskList();
 renderCompactSchedule();
 renderCompletionQuick();
 renderGapList('#gapQuick',studyGaps(viewDate),true);
 renderTestQuick();
 renderOverload();
 renderAutomationBanner();
}
function renderCompletionQuick(){
 const box=$('#completionQuick');if(!box)return;const dates=[];for(let i=6;i>=0;i--)dates.push(addDays(viewDate,-i));
 box.innerHTML=dates.map(d=>{const x=dailyCompletion(d),label=x.state==='closed'?`${x.done}/${x.total} · ${x.rate}%`:x.state==='live'?`${x.done}/${x.total} · 진행 ${x.rate}%`:x.state==='future'?(x.total?`계획 ${x.total}`:'계획 없음'):x.total?`${x.done}/${x.total} · ${x.rate}%`:'기록 없음';const note=x.state==='closed'&&(x.carried||x.waiting)?`이월 ${x.carried+x.waiting}`:x.state==='closed'?'마감 완료':x.state==='live'?'오늘 진행':x.state==='unclosed'&&x.total?`미마감 · 이월 ${x.carried+x.waiting}`:'숫자 미집계';return `<div class="completion-row ${x.state}"><b>${d.slice(5).replace('-','.')}</b><span>${label}</span><small>${note}</small></div>`}).join('')
}
function renderOverload(){
 const tasks=tasksFor(viewDate).filter(t=>!t.done),known=tasks.reduce((s,t)=>s+(Number(t.minutes)||0),0),unknown=tasks.filter(t=>!Number(t.minutes)).length,p=plannedStudy(viewDate).minutes;
 const el=$('#overloadBanner');
 if(known>p&&p>0){el.classList.remove('hidden');el.innerHTML=`오늘 할 일 예상 ${minuteLabel(known)} / 시간표상 자습 ${minuteLabel(p)}. <b>${minuteLabel(known-p)} 초과</b>${unknown?` · 시간 미입력 ${unknown}개 별도`:''}`}
 else el.classList.add('hidden')
}
function renderAutomationBanner(){
 const el=$('#automationConflictBanner');
 if(viewDate>todayDate()){const n=automationPreviewForDate(viewDate).length;if(n){el.classList.remove('hidden');el.textContent=`이 날짜에는 반복 자동화 ${n}건이 예정되어 있습니다. 미래 날짜를 보는 것만으로 할 일이나 충돌은 생성되지 않습니다.`}else el.classList.add('hidden');return}
 const c=DB.automationConflicts.filter(x=>x.date===viewDate&&x.date<=todayDate());if(c.length){el.classList.remove('hidden');el.textContent=`반복 자동화 미완료 충돌 ${c.length}건이 있습니다. 자동화 화면에서 처리하세요.`}else el.classList.add('hidden')
}
function todayUnitState(list){
 let total=0,done=0;
 (list||[]).forEach(t=>{
  const lectures=(t.components||[]).filter(c=>c.kind==='lecture');
  if(lectures.length){total+=lectures.length;done+=lectures.filter(c=>c.done).length}
  else{total+=1;if(t.done)done+=1}
 });
 return{total,done}
}
function taskTimelineMinute(date,t){
 const mins=taskLinkedBlocks(date,t.id).map(b=>plannerMinute(b.start)).filter(x=>x!=null);
 return mins.length?Math.min(...mins):Number.POSITIVE_INFINITY
}
function sortedTodayTasks(date){
 const mode=DB.settings.taskSortMode||'timeline',order=new Map(SUBJECTS.map((s,i)=>[s,i]));
 return tasksFor(date).map((t,i)=>({t,i})).sort((a,b)=>{
  if(mode==='subject'){
   const sa=order.has(a.t.subject)?order.get(a.t.subject):99,sb=order.has(b.t.subject)?order.get(b.t.subject):99;
   return sa-sb||a.i-b.i
  }
  const ta=taskTimelineMinute(date,a.t),tb=taskTimelineMinute(date,b.t);
  return ta-tb||a.i-b.i
 }).map(x=>x.t)
}
function renderTaskList(){
 const box=$('#todayTasks'),list=sortedTodayTasks(viewDate);
 const sort=$('#taskSortMode');if(sort)sort.value=DB.settings.taskSortMode||'timeline';
 if(!list.length){box.innerHTML='<div class="muted">아직 할 일이 없습니다. 학습 자판기나 자동화에서 추가하거나 직접 추가하세요.</div>';return}
 box.innerHTML=list.map(t=>{
  const st=taskState(t),linked=taskLinkedBlocks(viewDate,t.id),partial=st.total>1?`${st.done}/${st.total} 완료`:linked.length>1?`시간표 ${linked.filter(b=>b.done).length}/${linked.length} 사용`:'';
  return `<div class="task ${t.done?'done':''}" data-task="${t.id}">
   <div class="task-row">
    <input class="task-check" data-id="${t.id}" type="checkbox" ${t.done?'checked':''}>
    <div>
      <div><span class="priority-pill ${t.priority}">${PRIORITY_LABEL[t.priority]||'권장'}</span><span class="subject-pill ${subjectClass(t.subject)}">${esc(t.subject)}</span><span class="task-title">${esc(t.name)}</span></div>
      <div class="task-meta">${esc(t.material||'')}${t.minutes?` · ${t.minutes}분`:''}${linked.length?` · 시간표 ${linked.length}곳`:''}${t.splitMode==='contiguous'?' · 연속 필요':''}</div>
      ${partial?`<div class="task-meta"><b>${partial}</b></div>`:''}
      ${st.total>1?`<details class="component-toggle" data-tid="${t.id}" ${taskDetailOpen.has(t.id)?'open':''}><summary>세부 완료</summary><div class="component-list">${t.components.map(c=>`<label class="component-item"><input class="component-check" data-tid="${t.id}" data-cid="${c.id}" type="checkbox" ${c.done?'checked':''}>${esc(c.label)}</label>`).join('')}</div></details>`:''}
    </div>
    <div class="task-actions"><button class="btn ghost small task-edit" data-id="${t.id}">수정</button><button class="btn ghost small task-wait" data-id="${t.id}">대기</button><button class="btn danger small task-del" data-id="${t.id}">삭제</button></div>
   </div>
  </div>`
 }).join('');
 $$('.component-toggle').forEach(d=>d.ontoggle=()=>{if(d.open)taskDetailOpen.add(d.dataset.tid);else taskDetailOpen.delete(d.dataset.tid)});
 $$('.task-check').forEach(x=>x.onchange=()=>{setTaskDoneInternal(viewDate,x.dataset.id,x.checked);renderDashboard();renderProgress();renderVendingIfVisible()});
 $$('.component-check').forEach(x=>x.onchange=()=>{taskDetailOpen.add(x.dataset.tid);setTaskComponentDone(viewDate,x.dataset.tid,x.dataset.cid,x.checked);renderDashboard();renderProgress();renderVendingIfVisible()});
 $$('.task-edit').forEach(b=>b.onclick=()=>openTaskModal(taskById(viewDate,b.dataset.id)));
 $$('.task-wait').forEach(b=>b.onclick=()=>{moveTaskToWaiting(viewDate,b.dataset.id);renderDashboard()});
 $$('.task-del').forEach(b=>b.onclick=()=>{if(confirm('이 할 일을 휴지통으로 이동할까요?')){removeTask(viewDate,b.dataset.id,true);renderDashboard()}})
}
function renderCompactSchedule(){
 const box=$('#todayScheduleList'),blocks=ensureSchedule(viewDate);
 if(!blocks.length){box.innerHTML='<div class="muted">시간 블록이 없습니다. 시간표에서 10분 격자로 빠르게 추가할 수 있습니다.</div>';return}
 box.innerHTML=blocks.map(b=>{
  const names=(b.taskIds||[]).map(id=>taskById(viewDate,id)?.name).filter(Boolean);
  return `<div class="schedule-row ${b.done?'done':''} ${b.selfStudy&&!names.length?'empty-self':''}">
   <div class="time">${regularTimeLabel(b)}</div>
   <div><div class="name">${b.locked?'잠금 · ':''}${deviceMark(b)}${esc(b.name)}</div><div class="assigned">${names.length?names.map(esc).join(' + '):(b.selfStudy?'할 일 미배정':b.type==='meal'?'식사·휴식':'')}</div></div>
   <div class="row">${b.selfStudy?`<button class="btn ghost small quick-assign" data-id="${b.id}">할 일 선택</button>`:''}<label class="inline"><input class="block-done" data-id="${b.id}" type="checkbox" ${b.done?'checked':''}>완료</label></div>
  </div>`
 }).join('');
 $$('.quick-assign').forEach(b=>b.onclick=()=>openAssignModal(viewDate,b.dataset.id));
 $$('.block-done').forEach(x=>x.onchange=()=>{setBlockDone(viewDate,x.dataset.id,x.checked);renderDashboard()})
}

function openTaskModal(t=null){
 $('#taskModalTitle').textContent=t?'할 일 수정':'할 일 추가';$('#taskId').value=t?.id||'';$('#taskSubject').value=t?.subject||'국어';$('#taskPriority').value=t?.priority||'must';$('#taskMinutes').value=t?.minutes||'';if($('#taskSplitMode'))$('#taskSplitMode').value=t?.splitMode==='contiguous'?'contiguous':'flex';$('#taskName').value=t?.name||'';$('#taskMaterial').value=t?.material||'';$('#taskNote').value=t?.note||'';showModal('taskModal')
}
function saveTaskModal(){
 const id=$('#taskId').value,name=$('#taskName').value.trim();if(!name){alert('할 일을 입력하세요.');return}
 if(id){const t=taskById(viewDate,id);if(t){t.subject=$('#taskSubject').value;t.priority=$('#taskPriority').value;t.minutes=Number($('#taskMinutes').value||0);t.splitMode=$('#taskSplitMode')?.value==='contiguous'?'contiguous':'flex';t.name=name;t.material=$('#taskMaterial').value.trim();t.note=$('#taskNote').value.trim();if(t.components?.length===1&&t.components[0].kind==='manual')t.components[0].label=name}}
 else addTask(viewDate,{subject:$('#taskSubject').value,priority:$('#taskPriority').value,minutes:Number($('#taskMinutes').value||0),splitMode:$('#taskSplitMode')?.value==='contiguous'?'contiguous':'flex',name,material:$('#taskMaterial').value.trim(),note:$('#taskNote').value.trim(),components:[{id:uid(),kind:'manual',label:name,done:false}]});
 saveDB();hideModal('taskModal');renderDashboard()
}
function renderTestQuick(){
 const a=[...DB.tests].map(normalizeTestRecord).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,3),box=$('#testQuick');
 if(!a.length){box.innerHTML='<div class="muted">시험 기록이 없습니다.</div>';return}
 box.innerHTML=a.map(t=>{const rows=testSubjectRows(t);return `<div class="test-quick-row"><b>${esc(testSourceLabel(t.source))} · ${esc(t.name||'시험')}</b><br>${t.date} · ${rows.map(r=>`${r.subject} ${r.score?`${r.score}점 `:''}${r.grade?`${r.grade}등급`:''}`).join(' · ')||'성적 미입력'}</div>`}).join('')
}
function renderGapList(selector,gaps,compact=false){
 const el=$(selector);if(!el)return;el.innerHTML=gaps.map(g=>`<div class="gap-row ${g.gap>=3?'warn':''}"><b>${g.subject}</b><span>${g.last?`마지막 완료 ${g.last}`:'완료 기록 없음'}</span><b>${g.gap===999?'미기록':g.gap===0?'오늘':`${g.gap}일`}</b></div>`).join('')
}

function renderMonth(){
 $('#monthPicker').value=displayMonth;
 const [y,m]=displayMonth.split('-').map(Number),first=new Date(y,m-1,1,12),last=new Date(y,m,0,12),days=last.getDate();
 let cells='';for(let i=0;i<first.getDay();i++)cells+='<button class="month-day blank"></button>';
 let totalMin=0,totalTasks=0,doneTasks=0,testCount=0,closedDays=0,carryUnits=0;
 for(let n=1;n<=days;n++){
  const date=`${displayMonth}-${String(n).padStart(2,'0')}`,status=dailyCompletion(date),mins=date<=todayDate()?finalStudy(date):0,hasTest=DB.tests.some(t=>t.date===date);
  if(date<=todayDate()){totalMin+=mins;if(status.state!=='unclosed'||status.total){totalTasks+=status.total;doneTasks+=status.done;carryUnits+=status.carried+status.waiting;closedDays+=status.state==='closed'?1:0}}
  if(hasTest)testCount++;
  const label=status.state==='future'?(status.total?`계획 ${status.total}`:'-'):status.state==='unclosed'?(status.total?`${status.rate}%`:'기록 없음'):(status.total?`${status.rate}%`:'-');
  const sub=(status.state==='closed'||status.state==='unclosed')&&(status.carried||status.waiting)?`이월 ${status.carried+status.waiting}`:status.state==='unclosed'&&status.total?'미마감':mins?minuteLabel(mins):status.state==='future'?'예정':'0분';
  cells+=`<button class="month-day ${date===todayDate()?'today':''} ${date===viewDate?'selected':''} ${status.state==='future'?'future':''}" data-date="${date}"><div class="n">${n}${hasTest?'<span class="test-dot"></span>':''}</div><div class="month-mini">${label}<br>${sub}</div></button>`
 }
 $('#monthCalendar').innerHTML=cells;
 $$('#monthCalendar .month-day[data-date]').forEach(b=>b.onclick=()=>{viewDate=b.dataset.date;$('#plannerDate').value=viewDate;renderMonth();navigate('dashboard')});
 $('#monthStats').innerHTML=`<div><span>오늘까지 순공</span><b>${hoursLabel(totalMin)}</b></div><div><span>마감 기준 완주율</span><b>${totalTasks?Math.round(doneTasks/totalTasks*100):'-'}%</b></div><div><span>마감일 · 이월</span><b>${closedDays}일 · ${carryUnits}</b></div><div><span>시험</span><b>${testCount}회</b></div>`
}

function weekSlotKey(b){
 if(b.id?.includes('-morning'))return'morning';if(b.regular&&b.period)return`p${b.period}`;if(b.id?.includes('-lunch-program')||b.id?.includes('-english-mock'))return'program';if(b.id?.includes('-lunch'))return'lunch';if(b.id?.includes('-after'))return'after';if(b.id?.includes('-dinner'))return'dinner';if(b.id?.includes('-night1'))return'night1';if(b.id?.includes('-break'))return'break';if(b.id?.includes('-night2'))return'night2';return`custom:${b.start||''}:${b.name||''}`
}
function weekSlotFallback(k){const map={morning:'아침 자습',p1:'1교시',p2:'2교시',p3:'3교시',p4:'4교시',p5:'5교시',p6:'6교시',p7:'7교시',lunch:'점심시간',program:'점심 프로그램',after:'방과후',dinner:'석식',night1:'야간자율학습 1',break:'쉬는 시간',night2:'야간자율학습 2'};return map[k]||k.replace(/^custom:/,'')}
function weekSlotRank(k){const order=['morning','p1','p2','p3','p4','lunch','program','p5','p6','p7','after','dinner','night1','break','night2'];const i=order.indexOf(k);if(i>=0)return i;const t=k.split(':')[1]||'99:99';return 100+(plannerMinute(t)||9999)/10000}
function weekBlockClass(date,b){return blockColorClass(date,b)}
function renderWeek(){
 const dates=Array.from({length:5},(_,i)=>addDays(weekViewStart,i)),dayData=dates.map(d=>({date:d,blocks:ensureSchedule(d)})),keys=new Set();dayData.forEach(x=>x.blocks.forEach(b=>keys.add(weekSlotKey(b))));const rows=[...keys].sort((a,b)=>weekSlotRank(a)-weekSlotRank(b));
 $('#weekRange').textContent=`${dates[0].slice(5).replace('-','.')} ~ ${dates[4].slice(5).replace('-','.')}`;
 let html='<table class="week-table"><thead><tr><th>구간</th>'+dates.map((d,i)=>`<th>${['월','화','수','목','금'][i]}<small>${Number(d.slice(-2))}일 · ${esc(scheduleModeLabel(d))}</small></th>`).join('')+'</tr></thead><tbody>';
 rows.forEach(k=>{html+=`<tr><th>${esc(weekSlotFallback(k))}</th>`;dayData.forEach(({date,blocks})=>{const b=blocks.find(x=>weekSlotKey(x)===k);if(!b){html+='<td class="week-empty"></td>';return}const time=b.start&&b.end?`${b.start}~${b.end}`:(b.regular&&b.period?'시간 미설정':'');html+=`<td><button class="week-cell ${weekBlockClass(date,b)}" data-date="${date}"><b>${deviceMark(b)}${esc(b.name)}</b>${time?`<span>${time}</span>`:''}</button></td>`});html+='</tr>'});html+='</tbody></table>';$('#weekSchedule').innerHTML=html;
 $$('.week-cell').forEach(b=>b.onclick=()=>{viewDate=b.dataset.date;$('#plannerDate').value=viewDate;navigate('planner')})
}

function renderScheduleModeControls(){
 const sel=$('#scheduleModeSelect');if(!sel)return;const templates=DB.scheduleTemplates||[];
 sel.innerHTML='<option value="default">평일 기본</option><option value="saturday">토요일 시종</option><option value="off">학교 없음</option>'+ (templates.length?`<optgroup label="저장 시간표">${templates.map(t=>`<option value="template:${t.id}">${esc(t.name)}</option>`).join('')}</optgroup>`:'');
 const val=scheduleModeValue(viewDate);sel.value=[...sel.options].some(o=>o.value===val)?val:'default';$('#scheduleModeBadge').textContent=scheduleModeLabel(viewDate);const hidden=hiddenFixedKeys(viewDate).length;$('#restoreScheduleBlocks').disabled=!hidden;$('#restoreScheduleBlocks').textContent=hidden?`삭제 블록 복원 ${hidden}`:'삭제 블록 복원'
}
function applyScheduleModeFromControls(){const raw=$('#scheduleModeSelect').value||'default',mode=raw.startsWith('template:')?'template':raw,templateId=mode==='template'?raw.slice(9):null;if(setDayScheduleMode(viewDate,mode,templateId)){renderPlanner();renderDashboard();if($('#week')?.classList.contains('active'))renderWeek()}}
function openScheduleTemplates(){renderScheduleTemplates();showModal('scheduleTemplateModal')}
function renderScheduleTemplates(){
 const box=$('#scheduleTemplateList'),list=DB.scheduleTemplates||[];$('#templateTargetDate').textContent=fmtDate(viewDate);
 box.innerHTML=list.length?list.map(t=>{const timed=(t.blocks||[]).filter(b=>b.start&&b.end),range=timed.length?`${timed[0].start}~${timed[timed.length-1].end}`:'시간 없음';return`<div class="schedule-template-item" data-id="${t.id}"><div><b>${esc(t.name)}</b><span>${(t.blocks||[]).length}블록 · ${range}</span></div><div class="row wrap"><button class="btn primary small tpl-apply" data-id="${t.id}">적용</button><button class="btn ghost small tpl-rename" data-id="${t.id}">이름 변경</button><button class="btn ghost small tpl-update" data-id="${t.id}">현재로 덮어쓰기</button><button class="btn ghost small tpl-copy" data-id="${t.id}">복제</button><button class="btn danger small tpl-delete" data-id="${t.id}">삭제</button></div></div>`}).join(''):'<div class="muted">아직 저장한 시간표가 없습니다. 현재 날짜의 시간표를 먼저 저장해 보세요.</div>';
 $$('.tpl-apply').forEach(b=>b.onclick=()=>{if(setDayScheduleMode(viewDate,'template',b.dataset.id)){hideModal('scheduleTemplateModal');renderPlanner();renderDashboard();if($('#week')?.classList.contains('active'))renderWeek()}});
 $$('.tpl-rename').forEach(b=>b.onclick=()=>{const t=scheduleTemplateById(b.dataset.id),name=prompt('새 이름',t?.name||'');if(!name?.trim())return;updateScheduleTemplate(b.dataset.id,{name:name.trim()});renderScheduleTemplates();renderScheduleModeControls()});
 $$('.tpl-update').forEach(b=>b.onclick=()=>{const t=scheduleTemplateById(b.dataset.id);if(!t||!confirm(`현재 ${fmtDate(viewDate)} 시간표로 “${t.name}”을 덮어쓸까요?`))return;updateScheduleTemplate(b.dataset.id,{blocks:scheduleTemplateBlocksFromDate(viewDate)});renderScheduleTemplates();renderScheduleModeControls()});
 $$('.tpl-copy').forEach(b=>b.onclick=()=>{const t=scheduleTemplateById(b.dataset.id);if(!t)return;createScheduleTemplate(`${t.name} 복사`,t.blocks);renderScheduleTemplates();renderScheduleModeControls()});
 $$('.tpl-delete').forEach(b=>b.onclick=()=>{const t=scheduleTemplateById(b.dataset.id);if(!t||!confirm(`“${t.name}” 저장 시간표를 삭제할까요?`))return;if(deleteScheduleTemplate(t.id)){renderScheduleTemplates();renderScheduleModeControls();renderPlanner();if($('#week')?.classList.contains('active'))renderWeek()}})
}
function saveCurrentScheduleAsTemplate(){const name=prompt('저장 시간표 이름을 입력하세요.','');if(!name?.trim())return;createScheduleTemplate(name.trim(),scheduleTemplateBlocksFromDate(viewDate));renderScheduleTemplates();renderScheduleModeControls()}
function renderPlanner(){
 $('#plannerDate').value=viewDate;renderScheduleModeControls();
 const blocks=ensureSchedule(viewDate),pb=plannedStudy(viewDate),auto=autoActualStudy(viewDate);
 $('#plannerStats').innerHTML=`<div><span>계획 자습</span><b>${minuteLabel(pb.minutes)}</b></div><div><span>자동 실제</span><b>${minuteLabel(auto)}</b></div><div><span>최종 기록</span><b>${minuteLabel(finalStudy(viewDate))}</b></div><div><span>미배정 자습</span><b>${blocks.filter(b=>b.selfStudy&&!(b.taskIds||[]).length).length}개</b></div>`;
 $('#plannerModeBtn').textContent=plannerEdit?'보기 모드로':'편집 모드';
 $('#plannerModeHint').textContent=plannerSleepMode?'☽ 선택':(plannerEdit?'편집':'보기');
 $('#addGridBlockBtn').disabled=!plannerEdit;
 $('#sleepModeBtn').classList.toggle('primary',plannerSleepMode);
 const unknown=blocks.filter(b=>b.regular&&!(b.start&&b.end));
 $('#unknownRegularStrip').innerHTML=unknown.length?`<div class="muted" style="width:100%">교시 시각 미설정 · ⚙에서 입력</div>`+unknown.map(b=>`<span class="regular-chip ${b.selfStudy?'self':''}">${b.period}교시 ${b.device?'⌨︎ ':''}${esc(b.name)}${b.selfStudy?' · 자습':''}</span>`).join(''):'';
 $('#plannerLegend').innerHTML=plannerLegendHTML();
 renderPlannerQuickPanel();
 renderTenGrid()
}
function renderPlannerQuickPanel(){
 const session=sleepSession(viewDate),next=nextSelfStudyBlock(viewDate),current=currentBlock(viewDate),u=todayUnitState(tasksFor(viewDate)),unfinished=Math.max(0,u.total-u.done);
 $('#plannerQuickPanel').innerHTML=`<div class="planner-quick-grid">
   <div class="planner-quick-item"><span>현재</span><b>${current?`${deviceMark(current)}${esc(current.name)}`:'없음'}</b></div>
   <div class="planner-quick-item"><span>다음 자습</span><b>${next?`${deviceMark(next)}${esc(next.name)}${next.start&&next.end?` · ${next.start}`:''}`:'없음'}</b></div>
   <div class="planner-quick-item"><span>미완료</span><b>${unfinished}개</b></div>
 </div>
 <div class="planner-sleep-box">
   <div class="planner-sleep-row"><div class="planner-sleep-icon">☽</div><div class="planner-sleep-value">${session.bed||'–'}</div></div>
   <div class="planner-sleep-row"><div class="planner-sleep-icon">☼︎</div><div class="planner-sleep-value">${session.wake||'–'}</div></div>
   <div class="planner-sleep-row"><div class="planner-sleep-icon">◔</div><div class="planner-sleep-value">${sleepSpanLabel(session.bed,session.wake)}</div></div>
 </div>`
}
function renderTenGrid(){
 const box=$('#tenMinutePlanner'),blocks=ensureSchedule(viewDate),mapped=new Map(),bedVal=plannerNightBed(viewDate),wakeVal=plannerMorningWake(viewDate),sleepIdx=bedVal?plannerIndexForTime(bedVal):null,wakeIdx=wakeVal?plannerIndexForTime(wakeVal):null;
 blocks.filter(b=>b.start&&b.end).forEach(b=>{
  let s=plannerIndexForTime(b.start),e=plannerIndexForTime(b.end);if(s==null||e==null)return;if(e<=s)e+=144;
  for(let i=Math.max(0,s);i<Math.min(120,e);i++){if(!mapped.has(i))mapped.set(i,b)}
 });
 let html='';
 for(let h=5;h<25;h++){
  const hour=h%24;html+=`<div class="ten-hour"><div class="hour-label">${String(hour).padStart(2,'0')}:00</div>`;
  for(let k=0;k<6;k++){
   const idx=(h-5)*6+k,b=mapped.get(idx),prev=mapped.get(idx-1),first=b&&(!prev||prev.id!==b.id),isSleep=sleepIdx===idx,isWake=wakeIdx===idx;
   const cls=[plannerEdit&&!b?'editable':'',b?`${blockColorClass(viewDate,b)} block-cell`:'',isSleep?'sleep-marker':'',isWake?'wake-marker':''].filter(Boolean).join(' ');
   let label='';
   if(first)label=`<span class="cell-label">${deviceMark(b)}${esc(b.name)}</span>`;
   if(isSleep&&isWake)label=`<span class="cell-label">☽☼︎</span>`;
   else if(isSleep)label=`<span class="cell-label">☽</span>`;
   else if(isWake)label=`<span class="cell-label">☼︎</span>`;
   html+=`<div class="ten-cell ${cls}" data-index="${idx}" ${b?`data-block="${b.id}"`:''}>${label}</div>`
  }html+='</div>'
 }
 box.innerHTML=html;box.classList.toggle('planner-mode-edit',plannerEdit);
 $$('.ten-cell[data-block]').forEach(c=>c.onclick=e=>{if(plannerSleepMode)return;e.stopPropagation();openBlockModal(viewDate,c.dataset.block)});
 $$('.ten-cell').forEach(c=>c.addEventListener('click',()=>{if(!plannerSleepMode)return;const idx=Number(c.dataset.index);plannerSleepMode=false;openSleepModal(viewDate,plannerIndexToTime(idx))}));
 if(plannerEdit&&!plannerSleepMode)bindPlannerSelection()
}
function openSleepModal__impl1(date,time=''){
 const sessionDate=addDays(date,1),session=sleepSession(sessionDate);$('#sleepDate').value=date;$('#sleepBed').value=time||session.bed||'23:30';$('#sleepWake').value=session.wake||'06:30';$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;showModal('sleepModal')
}
function saveSleepModal__impl1(){
 const date=$('#sleepDate').value||viewDate,sessionDate=addDays(date,1),bed=$('#sleepBed').value,wake=$('#sleepWake').value;
 DB.condition[sessionDate]={...(DB.condition[sessionDate]||{}),bed,wake};planMeta(date).bed=bed;planMeta(sessionDate).wake=wake;
 saveDB();hideModal('sleepModal');viewDate=date;renderPlanner();
}
function clearSleepModal(){
 const date=$('#sleepDate').value||viewDate,sessionDate=addDays(date,1);if(DB.condition[sessionDate]){DB.condition[sessionDate].bed='';DB.condition[sessionDate].wake=''};planMeta(date).bed='';planMeta(sessionDate).wake='';saveDB();hideModal('sleepModal');viewDate=date;renderPlanner();
}
function clearPlannerSelection(){plannerSelectStart=null;plannerDragStart=null;plannerDragEnd=null;plannerDragging=false;$$('.ten-cell').forEach(c=>c.classList.remove('selected-cell'))}
function highlightRange(a,b){const lo=Math.min(a,b),hi=Math.max(a,b);$$('.ten-cell').forEach(c=>{const i=Number(c.dataset.index);c.classList.toggle('selected-cell',i>=lo&&i<=hi&&!c.dataset.block)})}
function openRangeBlock(a,b){
 const lo=Math.min(a,b),hi=Math.max(a,b);const occupied=$$('.ten-cell').some(c=>{const i=Number(c.dataset.index);return i>=lo&&i<=hi&&c.dataset.block});if(occupied){alert('이미 일정이 있는 칸이 포함되어 있습니다. 빈 칸만 선택해 주세요.');clearPlannerSelection();return}
 openBlockModal(viewDate,null,{start:plannerIndexToTime(lo),end:plannerIndexToTime(hi+1),name:'자습',type:'self',selfStudy:true,device:true});clearPlannerSelection()
}
function bindPlannerSelection(){
 const box=$('#tenMinutePlanner');let moved=false;
 $$('.ten-cell.editable').forEach(c=>{
  c.onpointerdown=e=>{e.preventDefault();plannerDragging=true;moved=false;plannerDragStart=plannerDragEnd=Number(c.dataset.index);highlightRange(plannerDragStart,plannerDragEnd)}
 });
 box.onpointermove=e=>{if(!plannerDragging)return;const target=document.elementFromPoint?.(e.clientX,e.clientY)?.closest?.('.ten-cell.editable');if(!target)return;const idx=Number(target.dataset.index);if(idx!==plannerDragEnd){moved=true;plannerDragEnd=idx;highlightRange(plannerDragStart,plannerDragEnd)}};
 box.onpointerup=()=>{if(!plannerDragging)return;const a=plannerDragStart,b=plannerDragEnd;plannerDragging=false;if(moved&&a!==b){openRangeBlock(a,b);return}if(plannerSelectStart==null){plannerSelectStart=a;highlightRange(a,a);$('#plannerModeHint').textContent=`${plannerIndexToTime(a)} 시작 선택 · 마지막 칸을 한 번 더 누르세요.`}else{const first=plannerSelectStart;plannerSelectStart=null;openRangeBlock(first,a)}};
 box.onpointercancel=()=>{plannerDragging=false;clearPlannerSelection()}
}
function openBlockModal(date,id=null,prefill=null){
 const b=id?ensureSchedule(date).find(x=>x.id===id):null;
 $('#blockModalTitle').textContent=b?'시간 블록 수정':'시간 블록 추가';$('#blockId').value=b?.id||'';$('#blockDate').value=date;$('#blockName').value=b?.name||prefill?.name||'자습';$('#blockType').value=b?.type||prefill?.type||'self';$('#blockStart').value=b?.start||prefill?.start||'';$('#blockEnd').value=b?.end||prefill?.end||'';$('#blockActual').value=b?.actualMin??'';$('#blockSelfStudy').checked=b?b.selfStudy:(prefill?.selfStudy??true);$('#blockDevice').checked=b?b.device:(prefill?.device??true);$('#blockLocked').checked=b?b.locked:false;$('#deleteBlock').style.display=b?'inline-flex':'none';$('#deleteBlock').textContent=b?.fixed?'이 날짜에서 삭제':'삭제';pendingAssignBlock=b?.id||null;renderBlockLinked(date,b);showModal('blockModal')
}
function renderBlockLinked(date,b){
 const box=$('#blockLinkedTasks');if(!b){box.innerHTML='<div class="muted">저장 후 할 일을 선택할 수 있습니다.</div>';return}
 const arr=(b.taskIds||[]).map(id=>taskById(date,id)).filter(Boolean);box.innerHTML=arr.length?arr.map(t=>`<div class="linked-task-chip">${esc(t.subject)} · ${esc(t.name)}</div>`).join(''):'<div class="muted">연결된 할 일이 없습니다.</div>'
}
function saveBlockModal__impl1(){
 const date=$('#blockDate').value||viewDate,id=$('#blockId').value,blocks=ensureSchedule(date),old=id?blocks.find(x=>x.id===id):null;
 const proposed=normalizeBlock(old?deep(old):{id:uid(),fixed:false},date);proposed.name=$('#blockName').value.trim()||'시간 블록';proposed.type=$('#blockType').value;proposed.start=$('#blockStart').value;proposed.end=$('#blockEnd').value;proposed.selfStudy=$('#blockSelfStudy').checked;proposed.device=proposed.selfStudy&&$('#blockDevice').checked;proposed.locked=$('#blockLocked').checked;proposed.actualMin=$('#blockActual').value===''?null:Number($('#blockActual').value);
 if(proposed.start&&proposed.end&&invalidBlockTime(proposed)){alert('시작·종료 시각을 확인하세요. 같은 시각이거나 12시간을 넘는 블록은 저장할 수 없습니다.');return}
 const overlaps=blocks.filter(x=>x.id!==proposed.id&&blocksOverlap(proposed,x));if(overlaps.length&&!confirm(`기존 블록 ${overlaps.map(x=>x.name).join(', ')}과 시간이 겹칩니다. 그래도 저장할까요?`))return;
 if(old){Object.assign(old,proposed);if(old.fixed)old.userOverrides={name:old.name,type:old.type,selfStudy:old.selfStudy,device:old.device,start:old.start,end:old.end}}else blocks.push(proposed);
 saveSchedule(date,blocks);hideModal('blockModal');renderPlanner();if(date===viewDate)renderDashboard()
}
function deleteBlockModal(){
 const date=$('#blockDate').value,id=$('#blockId').value,blocks=ensureSchedule(date),b=blocks.find(x=>x.id===id);if(!b)return;
 if(b.fixed){if(!confirm('이 고정 블록을 이 날짜에서만 삭제할까요? 다른 날짜와 기본 시간표에는 영향을 주지 않습니다.'))return;const key=b.baseKey||baseKeyFromBlock(b,date);if(!key){alert('이 블록의 기준 키를 확인할 수 없어 삭제하지 못했습니다.');return}DB.scheduleHidden[date]=[...new Set([...(DB.scheduleHidden[date]||[]),key])];DB.schedules[date]=blocks.filter(x=>x.id!==id);saveDB()}else{if(!confirm('이 시간 블록을 휴지통으로 이동할까요?'))return;trashPush('block',b,{date});DB.schedules[date]=blocks.filter(x=>x.id!==id);saveDB()}
 hideModal('blockModal');renderPlanner();renderDashboard();if($('#week')?.classList.contains('active'))renderWeek()
}
function openAssignModal(date,blockId){
 const b=ensureSchedule(date).find(x=>x.id===blockId);if(!b)return;
 $('#assignDate').value=date;$('#assignBlockId').value=blockId;$('#assignBlockLabel').textContent=`${b.start&&b.end?`${b.start}~${b.end} · `:''}${b.name}`;$('#assignSearch').value='';renderAssignList();showModal('assignModal')
}
function renderAssignList(){
 const date=$('#assignDate').value,id=$('#assignBlockId').value,b=ensureSchedule(date).find(x=>x.id===id),q=$('#assignSearch').value.trim().toLowerCase(),list=tasksFor(date).filter(t=>!q||`${t.subject} ${t.name} ${t.material}`.toLowerCase().includes(q));
 $('#assignTaskList').innerHTML=list.length?list.map(t=>{const links=taskLinkedBlocks(date,t.id).filter(x=>x.id!==id).length;return `<label class="assign-option"><input class="assign-check" type="checkbox" value="${t.id}" ${(b.taskIds||[]).includes(t.id)?'checked':''}><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}${links?` · 다른 블록 ${links}곳에도 배정`:''}</div></div></label>`}).join(''):'<div class="muted">이 날짜의 할 일이 없습니다.</div>';updateAssignCount();$$('.assign-check').forEach(x=>x.onchange=updateAssignCount)
}
function updateAssignCount(){$('#assignCount').textContent=`${$$('.assign-check:checked').length}개 선택`}
function saveAssignments(){
 const date=$('#assignDate').value,id=$('#assignBlockId').value,blocks=ensureSchedule(date),b=blocks.find(x=>x.id===id);if(!b)return;b.taskIds=$$('.assign-check:checked').map(x=>x.value);saveSchedule(date,blocks);hideModal('assignModal');renderPlanner();renderDashboard()
}

function renderVendingIfVisible(){if($('#vending')?.classList.contains('active'))renderVending()}
function renderVending(){
 $$('.learning-tab').forEach(b=>b.classList.toggle('active',b.dataset.vtab===vendingTab));
 $('#lecturePanel').classList.toggle('hidden',vendingTab==='book');$('#bookPanel').classList.toggle('hidden',vendingTab==='lecture');
 renderRecentLearning();renderLectureCatalog();renderBookCatalog();renderCart()
}
function renderRecentLearning(){
 const box=$('#recentLearning'),a=DB.recentLearning||[];box.innerHTML=a.length?'<span class="muted">최근 사용</span>'+a.map(x=>`<button class="recent-chip" data-kind="${x.kind}" data-id="${x.id}">${esc(x.label)}</button>`).join(''):'';
 $$('#recentLearning .recent-chip').forEach(b=>b.onclick=()=>{const q=b.textContent;$('#learningSearch').value=q;applyVendingSearch()})
}
function renderLectureCatalog(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'',inc=$('#incompleteOnly')?.checked;
 $('#lectureCatalog').innerHTML=allLectureCourses().map(c=>{
  const done=lectureCourseDone(c),buttons=[];
  for(let n=1;n<=c.total;n++){
   const ref=lectureRef(c.key,n),isDone=lectureDone(ref),inCart=cart.some(x=>x.kind==='lecture'&&x.ref===ref);
   if(inc&&isDone)continue;
   buttons.push(`<button class="lecture-btn ${isDone?'done':''} ${inCart?'cart':''}" data-ref="${ref}"><b>${String(n).padStart(2,'0')}강</b><small>${isDone?'완료':inCart?'장바구니':'미수강'}</small></button>`)
  }
  return `<section class="source-card vending-source" data-search="${esc(`${c.subject} ${c.provider} ${c.display}`.toLowerCase())}">
    <div class="source-head"><div><h4>${esc(c.subject)} · ${esc(c.provider)} ${esc(c.display)}</h4><span>${done}/${c.total}강 완료</span></div><div class="row"><button class="btn ghost small add-next" data-key="${c.key}" data-count="2">다음 2강</button>${c.custom?`<button class="btn danger small del-course" data-key="${c.key}">삭제</button>`:''}</div></div>
    <div class="lecture-grid">${buttons.join('')||'<div class="muted">표시할 강의가 없습니다.</div>'}</div>
  </section>`
 }).join('');
 $$('.lecture-btn').forEach(b=>b.onclick=()=>toggleLectureCart(b.dataset.ref));
 $$('.add-next').forEach(b=>b.onclick=()=>addNextLectures(b.dataset.key,Number(b.dataset.count)));
 $$('.del-course').forEach(b=>b.onclick=()=>{if(confirm('이 사용자 강좌를 휴지통으로 이동할까요?')){deleteLearningCourse(b.dataset.key);renderVending();renderProgress()}});
 applyVendingSearch()
}
function toggleLectureCart(ref){
 const i=cart.findIndex(x=>x.kind==='lecture'&&x.ref===ref);
 if(i>=0)cart.splice(i,1);else{const x=lectureInfo(ref);cart.push({id:uid(),kind:'lecture',ref});if(x)touchRecent('lecture',x.key,x.display)}
 renderVending()
}
function addNextLectures(key,count){
 const c=lectureCourse(key);if(!c)return;let n=0;
 for(let i=1;i<=c.total&&n<count;i++){const ref=lectureRef(key,i);if(!lectureDone(ref)&&!cart.some(x=>x.kind==='lecture'&&x.ref===ref)){cart.push({id:uid(),kind:'lecture',ref});n++}}
 touchRecent('lecture',c.key,c.display);renderVending()
}
function renderBookCatalog(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'';
 $('#bookCatalog').innerHTML=DB.books.length?DB.books.map(b=>{
  const done=(b.subunits||[]).filter(s=>bookSubDone(b.id,s)).length;
  return `<section class="source-card vending-source" data-search="${esc(`${b.subject} ${b.name} ${(b.subunits||[]).join(' ')}`.toLowerCase())}">
   <div class="source-head"><div><h4>${esc(b.subject)} · ${esc(b.name)}</h4><span>소단원 ${done}/${(b.subunits||[]).length}</span></div><div class="row"><button class="btn ghost small problems-add" data-id="${b.id}">문제 수로 담기</button><button class="btn ghost small edit-book" data-id="${b.id}">편집</button><button class="btn danger small del-book" data-id="${b.id}">삭제</button></div></div>
   <div class="subunit-grid">${(b.subunits||[]).map((s,i)=>{const inCart=cart.some(x=>x.kind==='book-subunit'&&x.bookId===b.id&&x.subunit===s);return `<button class="subunit-btn ${bookSubDone(b.id,s)?'done':''} ${inCart?'cart':''}" data-book="${b.id}" data-sub="${esc(s)}" data-index="${i}"><b>${esc(s)}</b><small>${bookSubDone(b.id,s)?'완료':inCart?'장바구니':'소단원으로 담기'}</small></button>`}).join('')||'<div class="muted">소단원이 없습니다. 편집에서 추가하세요.</div>'}</div>
  </section>`
 }).join(''):'<div class="muted">등록된 문제집이 없습니다.</div>';
 $$('.subunit-btn').forEach(b=>b.onclick=()=>toggleBookSubunit(b.dataset.book,b.dataset.sub,Number(b.dataset.index)));
 $$('.problems-add').forEach(b=>b.onclick=()=>openProblemsModal(b.dataset.id));
 $$('.edit-book').forEach(b=>b.onclick=()=>openBookModal(DB.books.find(x=>x.id===b.dataset.id)));
 $$('.del-book').forEach(b=>b.onclick=()=>{if(confirm('이 문제집을 휴지통으로 이동할까요?')){deleteBook(b.dataset.id);renderVending();renderProgress()}});
 applyVendingSearch()
}
function toggleBookSubunit(bookId,subunit,index){
 const i=cart.findIndex(x=>x.kind==='book-subunit'&&x.bookId===bookId&&x.subunit===subunit);
 if(i>=0)cart.splice(i,1);else{const b=DB.books.find(x=>x.id===bookId);cart.push({id:uid(),kind:'book-subunit',bookId,subunit,index,minutes:30});if(b)touchRecent('book',b.id,b.name)}
 renderVending()
}
function openLectureModal__impl1(){['#lectureProvider','#lectureName','#lectureTotal'].forEach(s=>$(s).value='');$('#lectureSubject').value='수학';showModal('lectureModal')}
function saveLectureModal__impl1(){
 const name=$('#lectureName').value.trim(),provider=$('#lectureProvider').value.trim(),total=Number($('#lectureTotal').value);
 if(!name||!provider||!Number.isInteger(total)||total<1){alert('강사·강좌명·전체 강의 수를 확인하세요.');return}
 DB.customLectures.push({key:'custom-'+uid(),subject:$('#lectureSubject').value,provider,series:$('#lectureSubject').value,name,display:name,total,custom:true});saveDB();hideModal('lectureModal');renderVending();renderProgress()
}
function openBookModal(b=null){
 $('#bookModalTitle').textContent=b?'문제집 편집':'문제집 등록';$('#bookId').value=b?.id||'';$('#bookSubject').value=b?.subject||'수학';$('#bookName').value=b?.name||'';$('#bookSubunits').value=(b?.subunits||[]).join('\n');showModal('bookModal')
}
function saveBookModal(){
 const name=$('#bookName').value.trim();if(!name){alert('교재명을 입력하세요.');return}
 const subs=$('#bookSubunits').value.split(/\n|,/).map(x=>x.trim()).filter(Boolean),id=$('#bookId').value||uid(),obj={id,subject:$('#bookSubject').value,name,subunits:subs};
 const i=DB.books.findIndex(x=>x.id===id);if(i>=0)DB.books[i]=obj;else DB.books.push(obj);saveDB();hideModal('bookModal');renderVending();renderProgress()
}
function openProblemsModal(bookId){
 const b=DB.books.find(x=>x.id===bookId);if(!b)return;$('#problemBookId').value=bookId;$('#problemSubunit').innerHTML='<option value="">전체/미지정</option>'+(b.subunits||[]).map(s=>`<option>${esc(s)}</option>`).join('');$('#problemStart').value=1;$('#problemCount').value=10;$('#problemMinutes').value=30;showModal('bookProblemsModal')
}
function addProblemsCart(){
 const bookId=$('#problemBookId').value,b=DB.books.find(x=>x.id===bookId);if(!b)return;const start=Math.max(1,Number($('#problemStart').value)||1),count=Math.max(1,Number($('#problemCount').value)||1),end=start+count-1,subunit=$('#problemSubunit').value,minutes=Math.max(5,Number($('#problemMinutes').value)||30);
 cart.push({id:uid(),kind:'book-problems',bookId,subunit,start,end,count,minutes});touchRecent('book',b.id,b.name);hideModal('bookProblemsModal');renderVending()
}
function applyVendingSearch(){
 const q=$('#learningSearch')?.value.trim().toLowerCase()||'';$$('.vending-source').forEach(el=>el.classList.toggle('hidden',q&&!el.dataset.search.includes(q)))
}
function renderCart(){
 const box=$('#cartList');$('#cartCount').textContent=`${cart.length}개`;$('#cartDate').value=$('#cartDate').value||viewDate;
 box.innerHTML=cart.length?cart.map(x=>{
  if(x.kind==='lecture'){const i=lectureInfo(x.ref);return `<div class="cart-item"><div><b>인강 · ${esc(i?.display)} ${i?.n}강</b><span>${esc(i?.subject)} · ${esc(i?.provider)}</span></div><button class="btn danger small cart-del" data-id="${x.id}">×</button></div>`}
  const b=DB.books.find(y=>y.id===x.bookId);const label=x.kind==='book-subunit'?`${b?.name} · ${x.subunit}`:`${b?.name}${x.subunit?' · '+x.subunit:''} ${x.start}~${x.end}번`;
  return `<div class="cart-item"><div><b>문제집 · ${esc(label)}</b><span>${esc(b?.subject)} · ${x.minutes}분</span></div><button class="btn danger small cart-del" data-id="${x.id}">×</button></div>`
 }).join(''):'<div class="muted">강의나 문제집 항목을 클릭해서 담으세요.</div>';
 $$('.cart-del').forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==b.dataset.id);renderVending()});
 const date=$('#cartDate').value||viewDate,blocks=ensureSchedule(date),open=blocks.filter(b=>b.selfStudy&&!b.locked&&!(b.taskIds||[]).length);
 $('#cartHint').textContent=`${fmtDate(date)} · 빈 자습 블록 ${open.length}개 · 장바구니 ${cart.length}개`
}
function groupConsecutiveNumbers(rows,getN,getKey){
 const out=[];[...rows].sort((a,b)=>getKey(a).localeCompare(getKey(b))||getN(a)-getN(b)).forEach(x=>{
  const key=getKey(x),n=getN(x),g=out.at(-1);if(g&&g.key===key&&g.last+1===n){g.items.push(x);g.last=n}else out.push({key,first:n,last:n,items:[x]})
 });return out
}
function compactSubunits(items,b){
 const sorted=[...items].sort((a,c)=>a.index-c.index);if(!sorted.length)return'';
 if(sorted.length===1)return sorted[0].subunit;return `${sorted[0].subunit}~${sorted.at(-1).subunit}`
}
function buildCartTasks(date){
 const newTasks=[],lect=cart.filter(x=>x.kind==='lecture'),subs=cart.filter(x=>x.kind==='book-subunit'),probs=cart.filter(x=>x.kind==='book-problems');
 groupConsecutiveNumbers(lect,x=>lectureInfo(x.ref)?.n||0,x=>lectureInfo(x.ref)?.key||'').forEach(g=>{
  const info=lectureInfo(g.items[0].ref),components=g.items.map(x=>{const i=lectureInfo(x.ref);return{id:uid(),kind:'lecture',ref:x.ref,label:`${String(i.n).padStart(2,'0')}강`,done:lectureDone(x.ref)}});
  newTasks.push(addTask(date,{subject:info.subject,priority:'must',name:`${info.display} ${g.first===g.last?`${g.first}강`:`${g.first}~${g.last}강`}`,material:`${info.provider} · ${info.series}`,minutes:0,note:'학습 자판기 · 인강',components,taskKind:'lecture'}))
 });
 const byBook={};subs.forEach(x=>(byBook[x.bookId]||(byBook[x.bookId]=[])).push(x));
 Object.entries(byBook).forEach(([bookId,items])=>{
  const b=DB.books.find(x=>x.id===bookId);if(!b)return;
  groupConsecutiveNumbers(items,x=>x.index,()=>bookId).forEach(g=>{
   const components=g.items.map(x=>({id:uid(),kind:'book',bookItem:{mode:'subunit',bookId,subunit:x.subunit,index:x.index},label:x.subunit,done:bookSubDone(bookId,x.subunit)})),mins=g.items.reduce((s,x)=>s+(x.minutes||30),0);
   newTasks.push(addTask(date,{subject:b.subject,priority:'must',name:`${b.name} · ${compactSubunits(g.items,b)}`,material:b.name,minutes:mins,note:'학습 자판기 · 소단원',components,taskKind:'book'}))
  })
 });
 const probGroups=[];[...probs].sort((a,b)=>`${a.bookId}|${a.subunit}`.localeCompare(`${b.bookId}|${b.subunit}`)||a.start-b.start).forEach(x=>{
  const key=`${x.bookId}|${x.subunit}`,g=probGroups.at(-1);if(g&&g.key===key&&g.end+1===x.start){g.items.push(x);g.end=x.end;g.minutes+=x.minutes}else probGroups.push({key,bookId:x.bookId,subunit:x.subunit,start:x.start,end:x.end,minutes:x.minutes,items:[x]})
 });
 probGroups.forEach(g=>{const b=DB.books.find(x=>x.id===g.bookId);if(!b)return;const components=g.items.map(x=>({id:uid(),kind:'book',bookItem:{mode:'problems',bookId:x.bookId,subunit:x.subunit,start:x.start,end:x.end},label:`${x.start}~${x.end}번`,done:false}));newTasks.push(addTask(date,{subject:b.subject,priority:'must',name:`${b.name}${g.subunit?' · '+g.subunit:''} ${g.start}~${g.end}번`,material:b.name,minutes:g.minutes,note:'학습 자판기 · 문제 수',components,taskKind:'book'}))});
 return newTasks
}
function autoPlaceTasks__impl1(date,newTasks){
 const blocks=ensureSchedule(date),free=blocks.filter(b=>b.selfStudy&&!b.locked&&!(b.taskIds||[]).length);let placed=0;
 newTasks.filter(t=>t.taskKind==='lecture').forEach(t=>{const b=free.find(x=>x.device&&!(x.taskIds||[]).length);if(b){b.taskIds=[t.id];placed++}});
 newTasks.filter(t=>t.taskKind!=='lecture').forEach(t=>{const b=free.find(x=>!x.device&&!(x.taskIds||[]).length)||free.find(x=>x.device&&!(x.taskIds||[]).length);if(b){b.taskIds=[t.id];placed++}});
 saveSchedule(date,blocks);return placed
}
function buildCartPlan(){
 const date=$('#cartDate').value||viewDate;if(!cart.length){alert('장바구니가 비어 있습니다.');return}
 if(DB.planLocks[date]&&!confirm('이 날짜 계획이 잠겨 있습니다. 할 일만 추가하고 자동배치는 하지 않을까요?'))return;
 const n=buildCartTasks(date),placed=DB.planLocks[date]?0:autoPlaceTasks(date,n);cart=[];viewDate=date;saveDB();renderVending();navigate('dashboard');alert(`${n.length}개 묶음 할 일을 만들었습니다.${placed?` 시간표 ${placed}개 자동배치.`:''}`)
}
function learningProgressItems(){
 const rows=allLectureCourses().map(c=>({kind:'인강',sourceKind:'lecture',id:c.key,subject:c.subject,name:c.display,done:lectureCourseDone(c),total:c.total,note:`${c.provider} · ${c.series}`}));
 DB.books.forEach(b=>{const total=(b.subunits||[]).length,done=(b.subunits||[]).filter(s=>bookSubDone(b.id,s)).length;rows.push({kind:'문제집',sourceKind:'book',id:b.id,subject:b.subject,name:b.name,done,total,note:total?`소단원 ${done}/${total}`:'소단원 미등록'})});return rows
}
function renderProgress__impl1(){
 const rows=learningProgressItems(),subs=[...new Set(rows.map(x=>x.subject))],box=$('#progressCatalog');
 box.innerHTML=rows.length?subs.map(s=>`<section class="progress-group"><h4>${esc(s)}</h4><div class="progress-grid">${rows.filter(x=>x.subject===s).map(x=>{const pct=x.total?Math.round(x.done/x.total*100):0;return `<button class="progress-card" data-kind="${x.sourceKind}" data-id="${x.id}"><span class="kind-pill">${x.kind}</span><h5>${esc(x.name)}</h5><div class="task-meta">${esc(x.note)}</div><div class="progress-line"><i style="width:${pct}%"></i></div><b>${x.total?`${x.done}/${x.total} · ${pct}%`:'소단원 미등록'}</b></button>`}).join('')}</div></section>`).join(''):'<div class="muted">학습 자판기에 등록된 항목이 없습니다.</div>';
 $$('.progress-card').forEach(b=>b.onclick=()=>{navigate('vending');vendingTab=b.dataset.kind==='lecture'?'lecture':'book';$('#learningSearch').value=b.dataset.kind==='lecture'?(lectureCourse(b.dataset.id)?.display||''):(DB.books.find(x=>x.id===b.dataset.id)?.name||'');renderVending()})
}

function automationOptions(){
 return [...allLectureCourses().map(c=>({value:`lecture:${c.key}`,kind:'lecture',id:c.key,label:`인강 · ${c.provider} ${c.display}`,subject:c.subject})),...DB.books.map(b=>({value:`book:${b.id}`,kind:'book',id:b.id,label:`문제집 · ${b.subject} ${b.name}`,subject:b.subject}))]
}
function automationRuleApplies(r,date){
 if(r.enabled===false||!dateInRange(date,r.start,r.end)||date>CSAT)return false;
 if(!(r.weekdays||[]).includes(parseDate(date).getDay()))return false;
 if(DB.automationSkips[`${r.id}:${date}`])return false;return true
}
function pendingSourcePool(){
 const arr=[];Object.values(DB.tasks||{}).flat().filter(t=>!t.done).forEach(t=>arr.push(t));(DB.waiting||[]).filter(t=>!t.done).forEach(t=>arr.push(t));(DB.automationConflicts||[]).forEach(c=>{if(c.proposal&&!c.proposal.done)arr.push(c.proposal)});return arr
}
function taskUsesLecture(ref){return pendingSourcePool().some(t=>(t.components||[]).some(c=>c.kind==='lecture'&&c.ref===ref&&!c.done))}
function taskUsesSubunit(bookId,sub){return pendingSourcePool().some(t=>(t.components||[]).some(c=>c.kind==='book'&&c.bookItem?.mode==='subunit'&&c.bookItem.bookId===bookId&&c.bookItem.subunit===sub&&!c.done))}
function makeAutomationProposal(rule,date){
 const [kind,id]=String(rule.source).split(':');
 if(kind==='lecture'){const c=lectureCourse(id);if(!c)return null;let ref=null;for(let n=1;n<=c.total;n++){const x=lectureRef(c.key,n);if(!lectureDone(x)&&!taskUsesLecture(x)){ref=x;break}}if(!ref)return null;const i=lectureInfo(ref);return normalizeImportedTask({id:uid(),subject:c.subject,priority:rule.priority||'must',name:`${c.display} ${i.n}강`,material:`${c.provider} · ${c.series}`,minutes:Number(rule.minutes)||0,note:'반복 자동화 · 다음 미수강 강의',components:[{id:uid(),kind:'lecture',ref,label:`${String(i.n).padStart(2,'0')}강`,done:false}],taskKind:'lecture',automationRuleId:rule.id,autoKey:`auto68-${rule.id}-${date}`})}
 const b=DB.books.find(x=>x.id===id);if(!b)return null;const sub=(b.subunits||[]).find(s=>!bookSubDone(b.id,s)&&!taskUsesSubunit(b.id,s));
 if(sub)return normalizeImportedTask({id:uid(),subject:b.subject,priority:rule.priority||'must',name:`${b.name} · ${sub}`,material:b.name,minutes:Number(rule.minutes)||30,note:'반복 자동화 · 다음 미완료 소단원',components:[{id:uid(),kind:'book',bookItem:{mode:'subunit',bookId:b.id,subunit:sub,index:(b.subunits||[]).indexOf(sub)},label:sub,done:false}],taskKind:'book',automationRuleId:rule.id,autoKey:`auto68-${rule.id}-${date}`});
 return normalizeImportedTask({id:uid(),subject:b.subject,priority:rule.priority||'must',name:b.name,material:b.name,minutes:Number(rule.minutes)||30,note:'반복 자동화 · 문제집',components:[{id:uid(),kind:'manual',label:b.name,done:false}],taskKind:'book',automationRuleId:rule.id,autoKey:`auto68-${rule.id}-${date}`})
}
function setAutomationRun(ruleId,date,status,extra={}){DB.automationRuns=DB.automationRuns||{};DB.automationRuns[automationRunKey(ruleId,date)]={status,at:Date.now(),...extra}}
function clearAutomationRuns(ruleId,from='0000-00-00'){Object.keys(DB.automationRuns||{}).forEach(k=>{if(k.startsWith(ruleId+':')){const date=k.slice(k.lastIndexOf(':')+1);if(date>=from)delete DB.automationRuns[k]}})}
function automationPreviewForDate(date){return DB.automations.filter(r=>automationRuleApplies(r,date)).map(r=>({rule:r,source:automationOptions().find(o=>o.value===r.source)}))}
function runAutomationForDate(date){
 if(date>todayDate()||DB.planLocks[date]||date>CSAT)return false;let changed=false;
 DB.automations.forEach(rule=>{
  if(!automationRuleApplies(rule,date))return;const key=automationRunKey(rule.id,date),run=DB.automationRuns?.[key];
  if(run)return;
  const existing=tasksFor(date).find(t=>t.automationRuleId===rule.id);if(existing){setAutomationRun(rule.id,date,'task',{taskId:existing.id});changed=true;return}
  const existingConflict=DB.automationConflicts.find(c=>c.ruleId===rule.id&&c.date===date);if(existingConflict){setAutomationRun(rule.id,date,'conflict',{conflictId:existingConflict.id});changed=true;return}
  const prev=[];Object.keys(DB.tasks).filter(d=>d<date).sort().forEach(d=>(DB.tasks[d]||[]).filter(t=>t.automationRuleId===rule.id&&!t.done).forEach(t=>prev.push({date:d,task:t})));
  const proposal=makeAutomationProposal(rule,date);if(!proposal){setAutomationRun(rule.id,date,'nothing');changed=true;return}
  if(prev.length){const q=prev.at(-1),c={id:uid(),ruleId:rule.id,date,previousDate:q.date,previousTaskId:q.task.id,proposal,sourceSnapshot:rule.source};DB.automationConflicts.push(c);setAutomationRun(rule.id,date,'conflict',{conflictId:c.id});changed=true;return}
  tasksFor(date).push(proposal);setAutomationRun(rule.id,date,'task',{taskId:proposal.id});changed=true
 });if(changed)saveDB();return changed
}
function renderAutomation(){
 const opts=automationOptions(),today=todayDate();
 $('#automationList').innerHTML=DB.automations.length?DB.automations.map(r=>{const s=opts.find(x=>x.value===r.source),due=automationRuleApplies(r,today);return `<div class="automation-rule ${r.enabled===false?'paused':''}"><div class="rule-top"><div><b>${esc(s?.label||'삭제된 항목')}</b><div class="task-meta">${(r.weekdays||[]).map(x=>DAYNAME[x][0]).join('·')} · ${r.start||''}~${r.end||'계속'} · ${r.minutes?`${r.minutes}분`:'시간 미입력'}</div></div><div class="row"><button class="btn ghost small auto-edit" data-id="${r.id}">수정</button><button class="btn ghost small auto-skip" data-id="${r.id}" ${due?'':'disabled'}>오늘만 건너뛰기</button><button class="btn warn small auto-toggle" data-id="${r.id}">${r.enabled===false?'재개':'일시정지'}</button><button class="btn danger small auto-del" data-id="${r.id}">삭제</button></div></div></div>`}).join(''):'<div class="muted">반복 규칙이 없습니다.</div>';
 $$('.auto-edit').forEach(b=>b.onclick=()=>openAutomationModal(DB.automations.find(x=>x.id===b.dataset.id)));
 $$('.auto-skip').forEach(b=>b.onclick=()=>skipAutomationToday(b.dataset.id));
 $$('.auto-toggle').forEach(b=>b.onclick=()=>{const r=DB.automations.find(x=>x.id===b.dataset.id);if(r)r.enabled=r.enabled===false;clearAutomationRuns(r.id,todayDate());saveDB();runAutomationForDate(todayDate());renderAutomation();if(viewDate===todayDate())renderDashboard()});
 $$('.auto-del').forEach(b=>b.onclick=()=>{const r=DB.automations.find(x=>x.id===b.dataset.id);if(!r)return;if(confirm('이 반복 규칙을 휴지통으로 이동할까요?')){trashPush('automation',r);DB.automations=DB.automations.filter(x=>x.id!==r.id);DB.automationConflicts=DB.automationConflicts.filter(x=>x.ruleId!==r.id);clearAutomationRuns(r.id);saveDB();renderAutomation()}});renderConflicts()
}
function openAutomationModal(r=null){
 const opts=automationOptions();if(!opts.length){alert('학습 자판기에 강좌나 문제집을 먼저 등록하세요.');return}
 $('#automationSource').innerHTML=opts.map(x=>`<option value="${x.value}">${esc(x.label)}</option>`).join('');$('#automationId').value=r?.id||'';$('#automationSource').value=r?.source||opts[0].value;$$('#weekdayPicker input').forEach(x=>x.checked=(r?.weekdays||[1,2,3,4,5,6]).includes(Number(x.value)));$('#automationStart').value=r?.start||todayDate();$('#automationEnd').value=r?.end||CSAT;$('#automationPriority').value=r?.priority||'must';$('#automationMinutes').value=r?.minutes||'';$('#automationEnabled').checked=r?.enabled!==false;showModal('automationModal')
}
function ruleMeaningChanged(a,b){return !a||a.source!==b.source||JSON.stringify(a.weekdays||[])!==JSON.stringify(b.weekdays||[])||a.start!==b.start||a.end!==b.end}
function generatedTasksForRule(ruleId,from=todayDate()){const out=[];Object.entries(DB.tasks).forEach(([date,arr])=>{if(date>=from)(arr||[]).filter(t=>t.automationRuleId===ruleId&&!t.done).forEach(t=>out.push({date,task:t}))});return out}
function saveAutomationModal(){
 const weekdays=$$('#weekdayPicker input:checked').map(x=>Number(x.value));if(!weekdays.length){alert('반복 요일을 하나 이상 선택하세요.');return}
 const id=$('#automationId').value||uid(),obj={id,source:$('#automationSource').value,weekdays,start:$('#automationStart').value,end:$('#automationEnd').value||CSAT,priority:$('#automationPriority').value,minutes:Number($('#automationMinutes').value)||0,enabled:$('#automationEnabled').checked},i=DB.automations.findIndex(x=>x.id===id),old=i>=0?deep(DB.automations[i]):null;
 if(old&&ruleMeaningChanged(old,obj)){const pending=generatedTasksForRule(id,todayDate());DB.automationConflicts=DB.automationConflicts.filter(c=>c.ruleId!==id);clearAutomationRuns(id,todayDate());if(pending.length){const replace=confirm(`이 규칙으로 이미 생성된 미완료 할 일 ${pending.length}개가 있습니다.\n확인: 기존 생성분을 지우고 새 규칙을 적용\n취소: 기존 생성분은 유지하고 이후부터 새 규칙 적용`);if(replace)pending.forEach(x=>removeTask(x.date,x.task.id,false))}}
 if(i>=0)DB.automations[i]=obj;else DB.automations.push(obj);inferAutomationRuns(DB);saveDB();hideModal('automationModal');runAutomationForDate(todayDate());renderAutomation();renderDashboard()
}
function skipAutomationToday(id){
 const today=todayDate(),r=DB.automations.find(x=>x.id===id);if(!r||!automationRuleApplies(r,today)){alert('이 규칙은 오늘 실행 예정이 아닙니다.');return}
 DB.automationSkips[`${id}:${today}`]=true;(DB.tasks[today]||[]).filter(x=>x.automationRuleId===id&&!x.done).forEach(x=>removeTask(today,x.id,false));DB.automationConflicts=DB.automationConflicts.filter(x=>!(x.ruleId===id&&x.date===today));setAutomationRun(id,today,'skipped');saveDB();renderAutomation();if(viewDate===today)renderDashboard()
}
function renderConflicts(){
 const today=todayDate(),list=DB.automationConflicts.filter(c=>!c.date||c.date<=today);$('#conflictCount').textContent=`${list.length}건`;$('#conflictList').innerHTML=list.length?list.map(c=>{const r=DB.automations.find(x=>x.id===c.ruleId),o=automationOptions().find(x=>x.value===(r?.source||c.sourceSnapshot));return `<div class="conflict-card"><b>${esc(o?.label||'반복 할 일')}</b><div class="task-meta">${c.previousDate} 미완료 → ${c.date} 반복일</div><div class="row"><button class="btn primary small conflict-act" data-id="${c.id}" data-act="merge">오늘 것과 합치기</button><button class="btn ghost small conflict-act" data-id="${c.id}" data-act="separate">별도 유지</button><button class="btn warn small conflict-act" data-id="${c.id}" data-act="skip">이전 것은 건너뛰기</button></div></div>`}).join(''):'<div class="muted">미완료 충돌이 없습니다.</div>';$$('.conflict-act').forEach(b=>b.onclick=()=>resolveConflict(b.dataset.id,b.dataset.act))
}
function componentIdentity(c){if(c.kind==='lecture')return `lecture:${c.ref}`;if(c.kind==='book'&&c.bookItem)return `book:${c.bookItem.mode}:${c.bookItem.bookId}:${c.bookItem.subunit||''}:${c.bookItem.start||''}:${c.bookItem.end||''}`;return `${c.kind||'manual'}:${c.label||''}`}
function mergedAutomationTask(prev,proposal){
 const out=normalizeImportedTask({...deep(prev),id:uid(),done:false,automationRuleId:proposal.automationRuleId,autoKey:proposal.autoKey,minutes:(Number(prev.minutes)||0)+(Number(proposal.minutes)||0),note:'반복 자동화 · 이전 미완료 + 오늘 예정분'}),seen=new Set(),components=[];
 [...(prev.components||[]),...(proposal.components||[])].forEach(c=>{const k=componentIdentity(c);if(seen.has(k))return;seen.add(k);components.push({...deep(c),id:uid(),done:Boolean(c.done)})});out.components=components;out.done=components.length?components.every(c=>c.done):false;
 const lectures=components.filter(c=>c.kind==='lecture').map(c=>lectureInfo(c.ref)).filter(Boolean);if(lectures.length&&new Set(lectures.map(x=>x.key)).size===1){const nums=lectures.map(x=>x.n).sort((a,b)=>a-b),c=lectures[0];out.subject=c.subject;out.material=`${c.provider} · ${c.series}`;out.name=`${c.display} ${nums.length===1?nums[0]+'강':nums[0]+'~'+nums.at(-1)+'강'}`}
 return out
}
function resolveConflict(id,act){
 const c=DB.automationConflicts.find(x=>x.id===id);if(!c)return;const prev=taskById(c.previousDate,c.previousTaskId);let created=null;
 if(act==='merge'){created=prev?mergedAutomationTask(prev,c.proposal):c.proposal;if(prev)removeTask(c.previousDate,prev.id,false);tasksFor(c.date).push(created)}
 if(act==='separate'){created=c.proposal;tasksFor(c.date).push(created)}
 if(act==='skip'){if(prev)removeTask(c.previousDate,prev.id,true);created=c.proposal;tasksFor(c.date).push(created)}
 DB.automationConflicts=DB.automationConflicts.filter(x=>x.id!==id);setAutomationRun(c.ruleId,c.date,'task',{taskId:created?.id});saveDB();renderAutomation();if(c.date===viewDate)renderDashboard()
}

function renderWaiting(){
 const box=$('#waitingList');box.innerHTML=DB.waiting.length?DB.waiting.map(t=>`<div class="waiting-item"><div class="waiting-top"><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')} · 대기 ${t.waitingSince||''}</div></div><div class="row"><button class="btn primary small wait-today" data-id="${t.id}">오늘로</button><button class="btn danger small wait-del" data-id="${t.id}">삭제</button></div></div></div>`).join(''):'<div class="muted">대기 중인 할 일이 없습니다.</div>';
 $$('.wait-today').forEach(b=>b.onclick=()=>{const i=DB.waiting.findIndex(x=>x.id===b.dataset.id);if(i<0)return;const t=DB.waiting.splice(i,1)[0];carryTaskToDate(t,viewDate);saveDB();renderWaiting();renderDashboard()});
 $$('.wait-del').forEach(b=>b.onclick=()=>{const t=DB.waiting.find(x=>x.id===b.dataset.id);if(!t)return;trashPush('waiting',t);DB.waiting=DB.waiting.filter(x=>x.id!==t.id);saveDB();renderWaiting()})
}

function testListFilters(){return{source:$('#testSourceFilter')?.value||'all',scope:$('#testScopeFilter')?.value||'all',subject:$('#testSubjectFilter')?.value||'all'}}
function filteredTestRecords({source='all',scope='all',subject='all'}={}){
 return [...DB.tests].map(normalizeTestRecord).filter(t=>{
  if(source!=='all'&&t.source!==source)return false;
  if(scope!=='all'&&t.scope!==scope)return false;
  return subject==='all'||testSubjectRows(t).some(r=>r.subject===subject)
 }).sort((a,b)=>b.date.localeCompare(a.date))
}
function testRecordShortLabel(t){return `${t.date.slice(5).replace('-','.')} · ${testSourceLabel(t.source)}${t.round?` ${t.round}`:''}`}
function renderTests__impl1(){
 const list=filteredTestRecords(testListFilters());
 renderTestSubjectBoard();renderTestAllSubjectSummary();renderScoreAnalysis();
 $('#testList').innerHTML=list.length?list.map(t=>{
  const rows=testSubjectRows(t),meta=rows.map(r=>`${r.subject} ${r.score?`${r.score}점 `:''}${r.grade?`${r.grade}등급`:''}${r.wrong?` · 오답 ${r.wrong}`:''}${r.minutes?` · ${r.minutes}분`:''}`).join(' · '),questions=(t.questionRecords||[]).length,pending=(t.questionRecords||[]).filter(q=>q.retryState!=='resolved').length;
  return `<div class="test-card"><div class="test-top"><div><div><span class="kind-pill">${esc(testSourceLabel(t.source))}</span><span class="scope-pill">${esc(testScopeLabel(t.scope))}</span></div><b>${t.date} · ${esc(t.name||'시험')}${t.round?` · ${esc(t.round)}`:''}</b><div class="task-meta">${meta||'성적 미입력'}${(t.causes||[]).length?` · ${(t.causes||[]).map(esc).join(' / ')}`:''}</div>${questions?`<div class="task-meta">문항 기록 ${questions}개 · 재풀이 ${pending}개</div>`:''}</div><div class="row"><button class="btn ghost small test-review" data-id="${t.id}">문항 분석</button><button class="btn danger small test-del" data-id="${t.id}">삭제</button></div></div></div>`
 }).join(''):'<div class="muted">선택한 조건의 시험 기록이 없습니다.</div>';
 $$('.test-del').forEach(b=>b.onclick=()=>{const t=DB.tests.find(x=>x.id===b.dataset.id);if(!t)return;if(confirm('시험 기록을 휴지통으로 이동할까요?')){trashPush('test',t);DB.tests=DB.tests.filter(x=>x.id!==t.id);saveDB();renderTests()}});
 $$('.test-review').forEach(b=>b.onclick=()=>openTestReviewModal(b.dataset.id));
 renderErrorCauseSummary();renderReviewQueues();renderLatestGrades();bindReviewActionButtons()
}
function renderTestSubjectBoard(){
 const box=$('#testSubjectBoard');if(!box)return;
 box.innerHTML=SUBJECTS.map(subject=>{
  const rows=subjectHistory(subject,{scope:'representative'}),latest=rows.at(-1),previous=rows.at(-2),pending=reviewEntries({subject}).length;
  if(!latest)return `<button type="button" class="test-subject-card ${subjectClass(subject)} analysis-subject-jump" data-subject="${subject}"><b>${subject}</b><strong>기록 없음</strong><span>대표 시험을 입력하세요.</span><small>원점수 · 등급 · 재풀이</small></button>`;
  const scoreDelta=latest.score&&previous?.score?latest.score-previous.score:null,scoreText=latest.score?`${latest.score}점`:latest.grade?`${latest.grade}등급`:'기록 없음',trend=scoreDelta==null?'비교 기록 부족':`${scoreDelta>0?'+':''}${scoreDelta}점`;
  return `<button type="button" class="test-subject-card ${subjectClass(subject)} analysis-subject-jump" data-subject="${subject}"><b>${subject}</b><strong>${scoreText}</strong><span>${esc(testRecordShortLabel(latest.test))}</span><small>${latest.grade?`${latest.grade}등급 · `:''}${latest.minutes?`${latest.minutes}분 · `:''}최근 변화 ${trend}${pending?` · 재풀이 ${pending}`:''}</small></button>`
 }).join('');
 $$('.analysis-subject-jump').forEach(b=>b.onclick=()=>{const selector=$('#analysisSubjectFilter');if(selector){selector.value=b.dataset.subject;renderTests();$('#scoreAnalysisTitle')?.scrollIntoView({behavior:'smooth',block:'start'})}})
}
function renderTestAllSubjectSummary(){
 const box=$('#testAllSubjectSummary');if(!box)return;const represented=SUBJECTS.filter(s=>latestRepresentative(s)).length,pending=reviewEntries({}).length,comparable=SUBJECTS.filter(s=>subjectHistory(s,{scope:'representative'}).length>=3).length;
 box.innerHTML=`<div><span>대표 성적</span><b>${represented}/${SUBJECTS.length}과목</b></div><div><span>재풀이 대기</span><b>${pending}문항</b></div><div><span>문항 패턴 판정 가능</span><b>${comparable}과목</b></div>`
}
function analysisFilterState(){return{subject:$('#analysisSubjectFilter')?.value||'all',source:$('#analysisSourceFilter')?.value||'all',scope:$('#analysisScopeFilter')?.value||'representative'}}
function questionPattern(subject,filters={}){
 const rows=subjectHistory(subject,{source:filters.source||'all',scope:filters.scope||'representative'}),tests=new Map(rows.map(r=>[r.test.id,r.test])),stats=new Map();
 [...tests.values()].forEach(test=>testQuestionRecords(test,subject).forEach(question=>{
  if(question.number>QUESTION_LIMITS[subject])return;
  const s=stats.get(question.number)||{number:question.number,wrongTestIds:new Set(),uncertainTestIds:new Set(),entries:[]};
  if(question.status==='wrong')s.wrongTestIds.add(test.id);else s.uncertainTestIds.add(test.id);
  s.entries.push({test,question});stats.set(question.number,s)
 }));
 return{rows,tests:[...tests.values()],attempts:tests.size,stats}
}
function renderScoreAnalysis(){
 const f=analysisFilterState(),empty=$('#scoreAnalysisEmpty'),content=$('#scoreAnalysisContent');if(!empty||!content)return;
 if(f.subject==='all'){
  $('#scoreAnalysisTitle').textContent='전과목 조망';$('#scoreAnalysisCaption').textContent='대표 시험 기준으로 현재 위치와 다음에 볼 과목을 고릅니다.';content.classList.add('hidden');empty.classList.remove('hidden');
  empty.innerHTML=`<div class="analysis-overview-list">${SUBJECTS.map(subject=>{const rows=subjectHistory(subject,{source:f.source,scope:f.scope}),latest=rows.at(-1),prev=rows.at(-2),delta=latest?.score&&prev?.score?latest.score-prev.score:null,pending=reviewEntries({subject}).length;return `<button type="button" class="analysis-overview-row analysis-subject-jump" data-subject="${subject}"><span class="subject-dot ${subjectClass(subject)}"></span><b>${subject}</b><strong>${latest?(latest.score?`${latest.score}점`:(latest.grade?`${latest.grade}등급`:'기록만 있음')):'기록 없음'}</strong><small>${latest?.grade?`${latest.grade}등급 · `:''}${delta==null?'추이 대기':`최근 ${delta>0?'+':''}${delta}점`} ${pending?`· 재풀이 ${pending}`:''}</small></button>`}).join('')}</div><div class="muted analysis-overview-note">과목을 누르면 원점수·등급 흐름과 반복 오답 문항을 같은 조건으로 봅니다.</div>`;
  $$('.analysis-subject-jump').forEach(b=>b.onclick=()=>{const selector=$('#analysisSubjectFilter');if(selector){selector.value=b.dataset.subject;renderTests()}});return
 }
 const rows=subjectHistory(f.subject,{source:f.source,scope:f.scope});$('#scoreAnalysisTitle').textContent=`${f.subject} 성적 흐름`;$('#scoreAnalysisCaption').textContent=`${f.scope==='representative'?'대표 시험 우선':f.scope==='full'?'전범위 시험만':'입력한 전체 범위'} · ${f.source==='all'?'전체 출처':testSourceLabel(f.source)}`;
 if(!rows.length){content.classList.add('hidden');empty.classList.remove('hidden');empty.textContent='선택한 조건의 성적 기록이 없습니다. 시험을 입력하면 이곳에 추세와 재풀이가 이어집니다.';return}
 empty.classList.add('hidden');content.classList.remove('hidden');renderRawScoreChart(f.subject,rows);renderGradeTrend(rows);renderScoreInsight(f.subject,rows,f);renderQuestionPattern(f.subject,f);renderReviewQueues(f.subject)
}
function renderRawScoreChart(subject,rows){
 const svg=$('#rawScoreChart'),range=$('#scoreRangeLabel');if(!svg)return;const scoreRows=rows.filter(r=>r.score>0),limit=subjectScoreLimit(subject);if(range)range.textContent=`${limit}점 만점`;
 if(!scoreRows.length){svg.setAttribute('viewBox','0 0 620 150');svg.innerHTML='<text x="310" y="75" text-anchor="middle" class="chart-empty">원점수를 입력하면 추세선이 표시됩니다.</text>';return}
 const W=620,H=235,L=44,R=18,T=20,B=42,innerW=W-L-R,innerH=H-T-B,y=v=>T+innerH-(v/limit)*innerH,x=i=>scoreRows.length===1?L+innerW/2:L+i*(innerW/(scoreRows.length-1)),points=scoreRows.map((r,i)=>({x:x(i),y:y(clamp(r.score,0,limit)),r})),path=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),ticks=[0,Math.round(limit/2),limit];
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=`${ticks.map(v=>`<g><line class="chart-grid-line" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"></line><text class="chart-axis-label" x="${L-7}" y="${y(v)+3}" text-anchor="end">${v}</text></g>`).join('')}<path class="score-path" d="${path}"></path>${points.map(p=>`<g class="score-point"><circle cx="${p.x}" cy="${p.y}" r="5"></circle><text class="chart-point-label" x="${p.x}" y="${p.y-10}" text-anchor="middle">${p.r.score}</text><text class="chart-axis-label" x="${p.x}" y="${H-17}" text-anchor="middle">${p.r.test.date.slice(5).replace('-','.')}</text></g>`).join('')}`
}
function renderGradeTrend(rows){
 const box=$('#gradeTrend');if(!box)return;const graded=rows.filter(r=>r.grade);box.innerHTML=graded.length?`<div class="grade-trend-title">등급 추이</div>${graded.map(r=>`<div class="grade-trend-item"><b class="grade-dot grade-${clamp(r.grade,1,9)}">${r.grade}</b><span>${r.test.date.slice(5).replace('-','.')}<small>${esc(testSourceLabel(r.test.source))}</small></span></div>`).join('')}`:'<div class="muted">등급을 입력하면 원점수 아래에 등급 흐름이 이어집니다.</div>'
}
function renderScoreInsight(subject,rows,filters){
 const box=$('#scoreInsight');if(!box)return;const latest=rows.at(-1),scoreRows=rows.filter(r=>r.score>0),lastScore=scoreRows.at(-1),prevScore=scoreRows.at(-2),timeRows=rows.filter(r=>r.minutes>0),lastTime=timeRows.at(-1),prevTime=timeRows.at(-2),pattern=questionPattern(subject,filters),top=[...pattern.stats.values()].sort((a,b)=>b.wrongTestIds.size-a.wrongTestIds.size||a.number-b.number)[0],scoreSentence=lastScore?(prevScore?`최근 원점수 ${lastScore.score}점 · 직전 대비 ${lastScore.score-prevScore.score>0?'+':''}${lastScore.score-prevScore.score}점`:`최근 원점수 ${lastScore.score}점`):'최근 기록에 원점수가 없습니다.',timeSentence=lastTime?(prevTime?`최근 ${lastTime.minutes}분 · 직전 대비 ${lastTime.minutes-prevTime.minutes>0?'+':''}${lastTime.minutes-prevTime.minutes}분`:`최근 소요시간 ${lastTime.minutes}분`):'시간 기록을 쌓으면 시간 안정성도 함께 봅니다.',patternSentence=pattern.attempts>=3&&top?.wrongTestIds.size?`반복 확인: ${top.number}번 ${top.wrongTestIds.size}/${pattern.attempts}회 오답${top.uncertainTestIds.size?` · 애매 정답 ${top.uncertainTestIds.size}회`:''}`:pattern.attempts?`문항 반복 판정까지 ${Math.max(0,3-pattern.attempts)}회 더 필요합니다.`:'문항 번호 기록을 쌓으면 반복 오답을 판정합니다.';
 box.innerHTML=`<div class="analysis-insight"><span>현재</span><b>${esc(scoreSentence)}</b><small>${latest.grade?`최근 ${latest.grade}등급 · `:''}${esc(testRecordShortLabel(latest.test))}</small></div><div class="analysis-insight"><span>시간</span><b>${esc(timeSentence)}</b><small>같은 과목의 기록만 비교합니다.</small></div><div class="analysis-insight"><span>문항</span><b>${esc(patternSentence)}</b><small>${pattern.attempts}회 비교 기준</small></div>`
}
function renderQuestionPattern(subject,filters){
 const grid=$('#questionNumberGrid'),legend=$('#questionHeatLegend'),insight=$('#questionInsight');if(!grid||!legend||!insight)return;const pattern=questionPattern(subject,filters),selected=selectedQuestionBySubject[subject];
 if(pattern.attempts<3){grid.innerHTML=`<div class="question-pattern-wait">${pattern.attempts}회 기록됨 · 같은 조건의 시험이 3회 이상 쌓이면 문항별 반복률을 표시합니다.</div>`;legend.textContent='단원 시험과 전범위 시험을 섞어 오해하지 않도록 현재 필터의 기록만 셉니다.';insight.innerHTML='<div class="muted">문항 번호를 입력한 시험부터 D+1 재풀이 대기열에 들어갑니다.</div>';return}
 const top=[...pattern.stats.values()].filter(s=>s.wrongTestIds.size).sort((a,b)=>b.wrongTestIds.size-a.wrongTestIds.size||a.number-b.number)[0],active=selected&&pattern.stats.has(selected)?selected:top?.number||null;if(active)selectedQuestionBySubject[subject]=active;
 grid.innerHTML=Array.from({length:QUESTION_LIMITS[subject]},(_,i)=>{const number=i+1,s=pattern.stats.get(number),wrong=s?.wrongTestIds.size||0,uncertain=s?.uncertainTestIds.size||0,heat=Math.min(3,wrong),isActive=number===active;return `<button type="button" class="question-cell heat-${heat}${uncertain?' has-uncertain':''}${isActive?' selected':''}" data-subject="${subject}" data-number="${number}" aria-label="${number}번, ${wrong}/${pattern.attempts}회 오답">${number}${wrong?`<small>${wrong}/${pattern.attempts}</small>`:''}</button>`}).join('');
 legend.textContent=`${subject} ${pattern.attempts}회 기준 · 숫자는 오답 시험 수/비교 시험 수 · 점선은 애매하지만 맞은 문항 기록`;
 $$('.question-cell').forEach(b=>b.onclick=()=>{selectedQuestionBySubject[b.dataset.subject]=Number(b.dataset.number);renderScoreAnalysis()});
 const stat=active?pattern.stats.get(active):null;if(!stat||!stat.wrongTestIds.size){insight.innerHTML=`<div class="muted">${active?`${active}번은 현재 비교 기록에서 반복 오답이 아닙니다.`:'문항 번호를 누르면 시험별 기록을 봅니다.'}</div>`;return}
 const history=[...stat.entries].sort((a,b)=>b.test.date.localeCompare(a.test.date));insight.innerHTML=`<div class="question-focus"><b>${active}번 · ${stat.wrongTestIds.size}/${pattern.attempts}회 오답${stat.uncertainTestIds.size?` · 애매 정답 ${stat.uncertainTestIds.size}회`:''}</b><span>${stat.wrongTestIds.size>=2?'반복 확인 문항입니다. 원인과 재풀이 결과를 남겨야 해결로 바뀝니다.':'다음 기록에서 반복 여부를 다시 확인합니다.'}</span></div><div class="question-history">${history.map(({test,question})=>`<div><b>${test.date.slice(5).replace('-','.')} · ${esc(testSourceLabel(test.source))}</b><span>${QUESTION_STATUS_LABELS[question.status]}${question.type?` · ${esc(question.type)}`:''}${question.cause?` · ${esc(question.cause)}`:''} · ${reviewStatusLabel(question)}</span>${question.retryState!=='resolved'?`<button class="btn ghost small review-open" data-test-id="${test.id}">분석</button>`:''}</div>`).join('')}</div>`
}
function reviewQueueRow({test,question},{compact=false}={}){
 const due=question.retryDue||addDays(test.date,1),label=`${question.subject} ${question.number}번`,dueText=due<=todayDate()?`재풀이일 ${due.slice(5).replace('-','.')} · 지금 확인`:`재풀이일 ${due.slice(5).replace('-','.')}`;
 return `<div class="review-row${compact?' compact':''}"><div><b>${label}</b><span>${esc(testRecordShortLabel(test))}${question.cause?` · ${esc(question.cause)}`:''}</span><small>${dueText}</small></div><div class="row"><button class="btn ghost small review-open" data-test-id="${test.id}">분석</button>${compact?'':`<button class="btn ghost small review-task" data-test-id="${test.id}" data-question-id="${question.id}">오늘 할 일</button><button class="btn good small review-resolve" data-test-id="${test.id}" data-question-id="${question.id}">해결</button><button class="btn ghost small review-reschedule" data-test-id="${test.id}" data-question-id="${question.id}">D+3</button>`}</div></div>`
}
function renderReviewQueues(subject='all'){
 const pending=reviewEntries({subject}),allPending=reviewEntries({});const main=$('#reviewQueue'),compact=$('#reviewQueueCompact');if(main)main.innerHTML=pending.length?`<h4 class="queue-title">재풀이 대기 ${pending.length}문항</h4>${pending.slice(0,8).map(x=>reviewQueueRow(x)).join('')}${pending.length>8?`<div class="muted">나머지 ${pending.length-8}문항은 시험 기록에서 분석할 수 있습니다.</div>`:''}`:'<div class="muted">현재 재풀이 대기 문항이 없습니다.</div>';if(compact)compact.innerHTML=allPending.length?allPending.slice(0,5).map(x=>reviewQueueRow(x,{compact:true})).join(''):`<div class="muted">대기 문항이 없습니다.</div>`
}
function bindReviewActionButtons(){
 $$('.review-open').forEach(b=>b.onclick=()=>openTestReviewModal(b.dataset.testId));
 $$('.review-resolve').forEach(b=>b.onclick=()=>resolveQuestionReview(b.dataset.testId,b.dataset.questionId));
 $$('.review-reschedule').forEach(b=>b.onclick=()=>rescheduleQuestionReview(b.dataset.testId,b.dataset.questionId));
 $$('.review-task').forEach(b=>b.onclick=()=>addQuestionReviewTask(b.dataset.testId,b.dataset.questionId))
}
function resolveQuestionReview(testId,questionId){
 const q=mutableQuestion(testId,questionId);if(!q)return;q.retryState='resolved';q.retryHistory=[...(q.retryHistory||[]),{date:todayDate(),result:'해결'}];saveDB();renderTests()
}
function rescheduleQuestionReview(testId,questionId){
 const q=mutableQuestion(testId,questionId);if(!q)return;q.retryState='pending';q.retryDue=addDays(todayDate(),3);q.retryHistory=[...(q.retryHistory||[]),{date:todayDate(),result:`재예약 ${q.retryDue}`}];saveDB();renderTests()
}
function addQuestionReviewTask(testId,questionId){
 const test=mutableTest(testId),question=mutableQuestion(testId,questionId);if(!test||!question)return;const reviewRef=`${testId}:${questionId}`,already=Object.values(DB.tasks).some(list=>(list||[]).some(t=>t.reviewRef===reviewRef&&!t.done));if(already){alert('이미 미완료 할 일로 연결되어 있습니다.');return}
 const target=todayDate();addTask(target,{subject:question.subject,priority:'must',name:`${question.number}번 재풀이`,material:`${test.name||'시험'} · ${test.date}`,note:`오답 재풀이 · ${question.cause||'원인 미입력'}${question.type?` · ${question.type}`:''}`,minutes:15,reviewRef,components:[{id:uid(),kind:'manual',label:`${question.number}번 재풀이`,done:false}]});alert('오늘 할 일에 추가했습니다. 재풀이 뒤에는 이 문항을 해결 또는 재예약으로 바꾸세요.');renderTests();if(viewDate===target)renderDashboard()
}
function renderErrorCauseSummary(){
 const counts={};ERROR_CAUSES.forEach(c=>counts[c]={question:0,common:0});DB.tests.map(normalizeTestRecord).forEach(t=>{(t.causes||[]).forEach(c=>{if(counts[c])counts[c].common++});(t.questionRecords||[]).forEach(q=>{if(q.cause&&counts[q.cause])counts[q.cause].question++})});const max=Math.max(1,...Object.values(counts).map(x=>x.question+x.common));
 $('#errorCauseSummary').innerHTML=`<div class="cause-summary">${ERROR_CAUSES.map(c=>{const x=counts[c],total=x.question+x.common;return `<div class="cause-row"><b>${c}</b><div class="cause-bar"><i style="width:${total/max*100}%"></i></div><span>${x.question?`문항 ${x.question}`:x.common?`공통 ${x.common}`:'0'}</span></div>`}).join('')}</div>`
}
function renderLatestGrades(){
 const latest=latestGrades(),goals=activeStage(viewDate).goals;$('#latestGradeSummary').innerHTML=SUBJECTS.map(s=>{const x=latest[s],ok=x&&x.grade<=goals[s];return `<div class="test-quick-row"><b>${s}</b> · ${x?`${x.score?`${x.score}점 · `:''}${x.grade?`${x.grade}등급`:'등급 미입력'} (${x.date})`:'미입력'} · 목표 ${goals[s]}등급 ${x?.grade?`· ${ok?'도달권':'보완 필요'}`:''}</div>`}).join('')
}
function reviewCauseOptions(value=''){return `<option value="">원인 선택</option>${ERROR_CAUSES.map(c=>`<option${c===value?' selected':''}>${c}</option>`).join('')}`}
function openTestReviewModal__impl1(testId){
 const test=mutableTest(testId);if(!test)return;$('#testReviewId').value=test.id;$('#testReviewMeta').textContent=`${test.date} · ${testSourceLabel(test.source)} · ${test.name||'시험'} · 문항별 원인과 재풀이 결과`;
 const questions=[...(test.questionRecords||[])].sort((a,b)=>a.subject.localeCompare(b.subject)||a.number-b.number),box=$('#testReviewQuestions');if(!questions.length){box.innerHTML='<div class="muted">이 시험에는 문항 번호 기록이 없습니다. 시험 기록에서 틀린 번호 또는 애매하지만 맞은 번호를 먼저 입력하세요.</div>';showModal('testReviewModal');return}
 box.innerHTML=SUBJECTS.map(subject=>{const list=questions.filter(q=>q.subject===subject);if(!list.length)return'';return `<section class="review-subject-group"><h4>${subject}</h4>${list.map(q=>`<article class="review-question-card" data-question-id="${esc(q.id)}"><div class="review-question-head"><b>${q.number}번</b><span class="kind-pill">${QUESTION_STATUS_LABELS[q.status]}</span><span>${reviewStatusLabel(q)}</span></div><div class="review-question-grid"><label>문항 상태<select class="input review-q-status"><option value="wrong"${q.status==='wrong'?' selected':''}>틀림</option><option value="uncertain"${q.status==='uncertain'?' selected':''}>애매하지만 맞음</option></select></label><label>유형·단원<input class="input review-q-type" value="${esc(q.type)}" placeholder="예: 자료 해석 / 총수요"></label><label>틀린 이유<select class="input review-q-cause">${reviewCauseOptions(q.cause)}</select></label><label>재풀이일<input class="input review-q-due" type="date" value="${esc(q.retryDue)}"></label><label>결과<select class="input review-q-state"><option value="pending"${q.retryState!=='resolved'?' selected':''}>재풀이 대기</option><option value="resolved"${q.retryState==='resolved'?' selected':''}>해결</option></select></label></div><label>풀이·실수 메모<textarea class="input review-q-note" rows="2" placeholder="왜 틀렸고, 다음에는 무엇을 확인할지">${esc(q.note)}</textarea></label>${q.retryHistory?.length?`<div class="micro-label">이력: ${q.retryHistory.map(x=>`${x.date} ${x.result}`).join(' · ')}</div>`:''}</article>`).join('')}</section>`}).join('');showModal('testReviewModal')
}
function saveTestReviewModal__impl1(){
 const test=mutableTest($('#testReviewId').value);if(!test)return;$$('#testReviewQuestions .review-question-card').forEach(card=>{const q=test.questionRecords.find(x=>x.id===card.dataset.questionId);if(!q)return;const before=q.retryState,status=card.querySelector('.review-q-status'),type=card.querySelector('.review-q-type'),cause=card.querySelector('.review-q-cause'),due=card.querySelector('.review-q-due'),note=card.querySelector('.review-q-note'),state=card.querySelector('.review-q-state');q.status=status?.value||q.status;q.type=type?.value.trim()||'';q.cause=cause?.value||'';q.retryDue=due?.value||q.retryDue;q.note=note?.value.trim()||'';q.retryState=state?.value==='resolved'?'resolved':'pending';if(before!=='resolved'&&q.retryState==='resolved')q.retryHistory=[...(q.retryHistory||[]),{date:todayDate(),result:'해결'}]});
 DB.tests[DB.tests.findIndex(t=>t.id===test.id)]=normalizeTestRecord(test);saveDB();hideModal('testReviewModal');renderTests()
}
function toggleTestKind(){
 const full=$('#testKind').value==='full',scope=$('#testScope');$('#singleTestFields').classList.toggle('hidden',full);$('#fullTestFields').classList.toggle('hidden',!full);scope.disabled=full;if(full)scope.value='full'
}
function openTestModal__impl1(){
 $('#testKind').value='single';$('#testScope').disabled=false;$('#testScope').value='unit';toggleTestKind();$('#testSource').value='단원·과목 실모';$('#testRound').value='';$('#testDate').value=viewDate;$('#testSubject').value='국어';$('#testName').value='';$('#testScore').value='';$('#testGrade').value='';$('#testMinutes').value='';$('#testWrongCount').value='';$('#testWrongQuestions').value='';$('#testUncertainQuestions').value='';$('#testMemo').value='';$$('.full-score,.full-grade,.full-wrong,.full-minutes,.full-wrong-questions,.full-uncertain-questions').forEach(x=>x.value='');$$('.cause-picker input').forEach(x=>x.checked=false);showModal('testModal')
}
function saveTestModal__impl1(){
 const kind=$('#testKind').value,name=$('#testName').value.trim()||(kind==='full'?'전과목 모의고사':'시험'),date=$('#testDate').value||viewDate,base={id:uid(),kind,source:$('#testSource').value,round:$('#testRound').value.trim(),date,name,causes:$$('.cause-picker input:checked').map(x=>x.value),memo:$('#testMemo').value.trim()};let record;
 if(kind==='full'){
  const scores={},grades={},wrongs={},minutes={},wrongQuestionMap={},uncertainQuestionMap={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value)||0);$$('.full-grade').forEach(x=>grades[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong').forEach(x=>wrongs[x.dataset.sub]=Number(x.value)||0);$$('.full-minutes').forEach(x=>minutes[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong-questions').forEach(x=>wrongQuestionMap[x.dataset.sub]=x.value.trim());$$('.full-uncertain-questions').forEach(x=>uncertainQuestionMap[x.dataset.sub]=x.value.trim());
  record=normalizeTestRecord({...base,scope:'full',scores,grades,wrongs,minutes,wrongQuestionMap,uncertainQuestionMap,questionRecords:SUBJECTS.flatMap(subject=>questionRecordsFromTexts(subject,wrongQuestionMap[subject],uncertainQuestionMap[subject],date))})
 }else{
  const subject=$('#testSubject').value,wrongQuestions=$('#testWrongQuestions').value.trim(),uncertainQuestions=$('#testUncertainQuestions').value.trim();record=normalizeTestRecord({...base,scope:$('#testScope').value,subject,score:Number($('#testScore').value)||0,grade:Number($('#testGrade').value)||0,minutes:Number($('#testMinutes').value)||0,wrongCount:Number($('#testWrongCount').value)||0,wrongQuestions,uncertainQuestions,questionRecords:questionRecordsFromTexts(subject,wrongQuestions,uncertainQuestions,date)})
 }
 DB.tests.push(record);saveDB();hideModal('testModal');renderTests();renderDashboard()
}

function studyDaysUntil(target,from=viewDate){let n=0;for(let d=parseDate(from);d<=parseDate(target);d.setDate(d.getDate()+1))if(d.getDay()!==0)n++;return Math.max(0,n)}
function renderGoals__impl1(){
 const st=activeStage(viewDate),latest=latestGrades();$('#goalStageBadge').textContent=`${st.title} · D-${dday(st.target,viewDate)}`;
 $('#gradeForecast').innerHTML=SUBJECTS.map(s=>{const x=latest[s],goal=st.goals[s],state=!x?'판정 불가':x.grade<=goal?'도달권':x.grade===goal+1?'경계':'보완 필요';return `<div class="gap-row"><b>${s}</b><span>${x?`최근 ${x.grade}등급 · ${x.date}`:'최근 등급 없음'} · 목표 ${goal}</span><b>${state}</b></div>`}).join('');
 const rows=allLectureCourses().map(c=>{const remain=c.total-lectureCourseDone(c),days=studyDaysUntil(st.target),per=days?remain/days:remain;return{c,remain,per}});
 const cap=Number(DB.settings.lectureDailyCap)||5,totalRemain=rows.reduce((s,x)=>s+x.remain,0),days=studyDaysUntil(st.target),daily=days?totalRemain/days:totalRemain,state=daily<=cap*.85?'가능':daily<=cap?'빡빡':'위험';
 $('#finishPressureBadge').textContent=`${state} · 하루 ${daily.toFixed(1)}강`;
 $('#finishForecast').innerHTML=rows.map(x=>`<div class="gap-row"><b>${esc(x.c.display)}</b><span>${lectureCourseDone(x.c)}/${x.c.total} · ${x.remain}강 남음</span><b>${x.per.toFixed(1)}/일</b></div>`).join('')+`<div class="muted">문제풀이·수학·영어 시간은 별도입니다. 이 수치는 인강 총량만 계산합니다.</div>`;
 renderRoadmap();renderGapList('#gapDetail',studyGaps(viewDate))
}
function renderRoadmap(){
 const steps=[
  {start:'2026-08-10',end:'2026-09-01',title:'9모 전 완주·실전 점검',desc:'개념·강좌를 정리하면서 실모와 기출 적용을 늘립니다.'},
  {start:'2026-09-02',end:'2026-09-13',title:'9모 분석·회복',desc:'9모 결과에서 틀린 이유와 학습 공백을 정리합니다.'},
  {start:'2026-09-14',end:'2026-10-11',title:'약점 재구축',desc:'등급을 막는 과목·유형을 우선 보완합니다.'},
  {start:'2026-10-12',end:'2026-11-01',title:'수능형 실전 확대',desc:'시간 배분과 전과목 실전 루틴을 안정화합니다.'},
  {start:'2026-11-02',end:'2026-11-18',title:'최종 안정화',desc:'새 자료보다 오답·기출·실전 감각을 유지합니다.'},
  {start:'2026-11-19',end:'2026-11-19',title:'수능',desc:'최종 목표 · 전과목 만점'}
 ];
 $('#longRoadmap').innerHTML=steps.map(s=>`<div class="roadmap-step ${viewDate>=s.start&&viewDate<=s.end?'active':''}"><b>${s.start.slice(5)}${s.end!==s.start?`~${s.end.slice(5)}`:''}</b><span><strong>${s.title}</strong><br>${s.desc}</span></div>`).join('')
}

function sleepMinutes(bed,wake){if(!bed||!wake)return null;let a=timeToMin(bed),b=timeToMin(wake);if(a==null||b==null)return null;if(b<=a)b+=1440;return b-a}
function calcSleep(bed,wake){const m=sleepMinutes(bed,wake);return m==null?'':`${Math.floor(m/60)}시간 ${m%60}분`}
function conditionRows(through){
 const start=addDays(through,-59);
 return Object.keys(DB.condition||{}).filter(d=>d>=start&&d<=through).sort().map(date=>{
  const c=DB.condition[date]||{},sm=sleepMinutes(c.bed,c.wake),num=v=>(v===''||v==null?NaN:Number(v));let bed=timeToMin(c.bed);if(bed!=null&&bed<720)bed+=1440;
  return{date,c,sleep:sm,bed,fatigue:num(c.fatigue),focus:num(c.dailyFocus!==''&&c.dailyFocus!=null?c.dailyFocus:c.focus),quality:num(c.quality)}
 })
}
function avg(a){const x=a.filter(Number.isFinite);return x.length?x.reduce((s,n)=>s+n,0)/x.length:null}
function pearson(pairs){const p=pairs.filter(([a,b])=>Number.isFinite(a)&&Number.isFinite(b));if(p.length<4)return null;const ax=avg(p.map(x=>x[0])),ay=avg(p.map(x=>x[1]));let num=0,dx=0,dy=0;p.forEach(([x,y])=>{const a=x-ax,b=y-ay;num+=a*b;dx+=a*a;dy+=b*b});return dx&&dy?num/Math.sqrt(dx*dy):0}
function patternLevel(n){return n<7?'기록 부족':n<14?'초기 경향':n<30?'경향 확인':'반복 패턴'}
function assocText(r,positive,negative){if(r==null)return'비교 가능한 기록이 더 필요합니다.';if(r>=.25)return positive;if(r<=-.25)return negative;return'현재 기록에서는 뚜렷한 연관이 보이지 않습니다.'}
function renderConditionAnalysis__impl1(){
 const d=$('#conditionDate')?.value||viewDate,rows=conditionRows(d),box=$('#conditionAnalysis');if(!box)return;
 const valid=rows.filter(r=>Number.isFinite(r.sleep)),mean=valid.length?valid.reduce((a,r)=>a+r.sleep,0)/valid.length:null;
 box.innerHTML=`<div class="condition-insight-grid"><div class="condition-insight"><span>최근 수면 기록</span><b>${mean!=null?minuteLabel(mean):'기록 부족'}</b><small>수면은 학습량보다 우선하는 제약조건입니다.</small></div></div>`
}
function renderCondition__impl1(){
 $('#conditionDate').value=$('#conditionDate').value||viewDate;const d=$('#conditionDate').value,c=DB.condition[d]||{},session=sleepSession(d);
 $('#bedTime').value=c.bed||session.bed||'';$('#wakeTime').value=c.wake||session.wake||'';$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#sleepQuality').value=c.quality||'';$('#fatigue').value=c.fatigue??'';$('#headache').value=c.headache??'';$('#focusScore').value=c.focus??'';$('#expectedCondition').value=c.expected||'';$('#eveningFatigue').value=c.eveningFatigue??'';$('#dailyFocus').value=c.dailyFocus??'';$('#overallCondition').value=c.overall||'';$('#caffeineCups').value=c.caffeine??'';$('#lastCaffeine').value=c.lastCaffeine||'';$('#conditionMemo').value=c.memo||'';$$('.symptomCheck').forEach(x=>x.checked=(c.symptoms||[]).includes(x.value));renderConditionAnalysis()
}
function saveCondition__impl1(){
 const d=$('#conditionDate').value,bed=$('#bedTime').value,wake=$('#wakeTime').value,prev=addDays(d,-1);
 DB.condition[d]={...(DB.condition[d]||{}),bed,wake,quality:$('#sleepQuality').value,fatigue:$('#fatigue').value,headache:$('#headache').value,focus:$('#focusScore').value,expected:$('#expectedCondition').value,eveningFatigue:$('#eveningFatigue').value,dailyFocus:$('#dailyFocus').value,overall:$('#overallCondition').value,caffeine:Number($('#caffeineCups').value)||0,lastCaffeine:$('#lastCaffeine').value,symptoms:$$('.symptomCheck:checked').map(x=>x.value),memo:$('#conditionMemo').value.trim()};
 // D일 수면은 D-1일 밤 취침 + D일 아침 기상. 시간표 마커도 같은 원본을 따른다.
 planMeta(prev).bed=bed;planMeta(d).wake=wake;saveDB();renderCondition();if(d===viewDate){renderDashboard();if($('#planner').classList.contains('active'))renderPlanner()}else if($('#planner').classList.contains('active')&&(viewDate===prev||viewDate===d))renderPlanner()
}

function monthDates(month){
 const[y,m]=month.split('-').map(Number),last=new Date(y,m,0).getDate();return Array.from({length:last},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)
}
function statsForDates(dates){
 let mins=0,total=0,done=0,tests=0;const subjectDone={};SUBJECTS.forEach(s=>subjectDone[s]=0);
 dates.filter(d=>d<=todayDate()).forEach(d=>{mins+=finalStudy(d);const status=dailyCompletion(d);if(status.state!=='unclosed'||status.total){total+=status.total;done+=status.done}const a=DB.tasks[d]||[];a.forEach(t=>{if(subjectDone[t.subject]==null)return;const lectures=(t.components||[]).filter(c=>c.kind==='lecture');subjectDone[t.subject]+=lectures.length?lectures.filter(c=>c.done).length:(t.done?1:0)});tests+=DB.tests.filter(t=>t.date===d).length});
 return{mins,total,done,tests,subjectDone}
}
function renderAnalysis__impl1(){
 $('#analysisMonth').value=$('#analysisMonth').value||displayMonth;const month=$('#analysisMonth').value,st=statsForDates(monthDates(month));
 $('#analysisStats').innerHTML=`<div><span>순공</span><b>${hoursLabel(st.mins)}</b></div><div><span>달성률</span><b>${st.total?Math.round(st.done/st.total*100):0}%</b></div><div><span>완료 할 일</span><b>${st.done}/${st.total}</b></div><div><span>시험</span><b>${st.tests}회</b></div>`;
 const max=Math.max(1,...Object.values(st.subjectDone));$('#subjectBalance').innerHTML='<h3 class="subhead">과목 완료 분포</h3>'+SUBJECTS.map(s=>`<div class="cause-row"><b>${s}</b><div class="cause-bar"><i style="width:${st.subjectDone[s]/max*100}%"></i></div><span>${st.subjectDone[s]}</span></div>`).join('');
 const end=parseDate(viewDate),dates=[];for(let i=6;i>=0;i--){const d=new Date(end);d.setDate(d.getDate()-i);dates.push(ymd(d))}const r=statsForDates(dates);
 $('#recent7Stats').innerHTML=`<div><span>순공</span><b>${hoursLabel(r.mins)}</b></div><div><span>달성률</span><b>${r.total?Math.round(r.done/r.total*100):0}%</b></div><div><span>완료</span><b>${r.done}/${r.total}</b></div><div><span>시험</span><b>${r.tests}회</b></div>`;
 renderGapList('#analysisGap',studyGaps(viewDate))
}

function renderUndoList(){
 const h=undoHistory(),box=$('#undoList');if(!box)return;box.innerHTML=h.length?h.map(x=>`<div class="undo-item"><span>${new Date(x.at).toLocaleString('ko-KR')} 이전 상태</span><button class="btn ghost small undo-btn" data-id="${x.id}">되돌리기</button></div>`).join(''):'<div class="muted">되돌릴 변경이 없습니다.</div>';$$('.undo-btn').forEach(b=>b.onclick=()=>restoreUndo(b.dataset.id))
}
function renderSettings__impl1(){
 $('#lectureDailyCap').value=DB.settings.lectureDailyCap||5;
 $('#periodTimeSettings').innerHTML=Array.from({length:7},(_,i)=>{const p=i+1,t=DB.settings.periodTimes[p]||{};return `<div class="period-box"><b>${p}교시</b><input class="input period-start" data-p="${p}" type="time" value="${t.start||''}"><input class="input period-end" data-p="${p}" type="time" value="${t.end||''}"></div>`}).join('');
 const kb=Math.round(approximateStorageBytes()/1024);renderTrash();renderUndoList();$('#versionInfo').innerHTML=`<code>App ${APP_VERSION}<br>Data schema ${SCHEMA_VERSION}<br>Build ${BUILD}<br>저장소 약 ${kb.toLocaleString()} KB<br>9모 ${EXAM9}<br>수능 ${CSAT}</code>`;$('#diagnosticResult').innerHTML='<div class="muted">전체 검사는 연결·중복·시간 겹침·자동화·수면 동기화·저장 용량을 확인합니다.</div>'
}
function savePeriodTimes(){
 for(let p=1;p<=7;p++){DB.settings.periodTimes[p]={start:$(`.period-start[data-p="${p}"]`).value,end:$(`.period-end[data-p="${p}"]`).value}}
 saveDB();Object.keys(DB.schedules).forEach(date=>{if([1,2,3,4,5].includes(parseDate(date).getDay()))DB.schedules[date]=mergeSchedule(date,DB.schedules[date])});saveDB();alert('평일 교시 시각을 저장했습니다.');renderSettings();if($('#planner').classList.contains('active'))renderPlanner();if($('#week').classList.contains('active'))renderWeek()
}
function runDiagnostics__impl1(){
 const problems=[],ids=new Map(),sourceSeen=new Map();function seen(id,label){if(!id)return;if(ids.has(id))problems.push(`중복 ID: ${id} (${ids.get(id)} / ${label})`);else ids.set(id,label)}
 Object.entries(DB.tasks).forEach(([date,arr])=>(arr||[]).forEach(t=>seen(t.id,`할 일 ${date}`)));(DB.waiting||[]).forEach(t=>seen(t.id,'대기함'));
 Object.entries(DB.schedules).forEach(([date,arr])=>{const blocks=arr||[];blocks.forEach(b=>{seen(b.id,`블록 ${date}`);if(invalidBlockTime(b))problems.push(`잘못된 블록 시각: ${date} ${b.name} ${b.start}~${b.end}`);(b.taskIds||[]).forEach(id=>{if(!(DB.tasks[date]||[]).some(t=>t.id===id))problems.push(`끊어진 시간표 연결: ${date} ${b.name} → ${id}`)})});for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){if(blocksOverlap(blocks[i],blocks[j]))problems.push(`시간 겹침: ${date} ${blocks[i].name} / ${blocks[j].name}`)}});
 DB.books.forEach(b=>seen(b.id,'문제집'));DB.customLectures.forEach(c=>seen(c.key,'사용자 인강'));DB.automations.forEach(a=>{seen(a.id,'자동화');if(!automationOptions().some(o=>o.value===a.source))problems.push(`삭제된 학습 항목을 참조하는 자동화: ${a.id}`)});DB.tests.forEach(t=>{seen(t.id,'시험');const x=normalizeTestRecord(t),numbers=new Set();(x.questionRecords||[]).forEach(q=>{const key=questionKey(q.subject,q.number);if(numbers.has(key))problems.push(`시험 문항 중복: ${x.name||x.id} · ${q.subject} ${q.number}번`);numbers.add(key);if(q.number>QUESTION_LIMITS[q.subject])problems.push(`과목 문항 범위 초과: ${x.name||x.id} · ${q.subject} ${q.number}번`);if(q.retryState!=='resolved'&&!q.retryDue)problems.push(`재풀이일 누락: ${x.name||x.id} · ${q.subject} ${q.number}번`)})});
 pendingSourcePool().forEach(t=>(t.components||[]).filter(c=>!c.done).forEach(c=>{const key=componentIdentity(c);if(!key)return;if(sourceSeen.has(key))problems.push(`중복 미완료 학습: ${c.label||key}`);else sourceSeen.set(key,t.id)}));
 (DB.automationConflicts||[]).forEach(c=>{if(!DB.automations.some(r=>r.id===c.ruleId))problems.push(`삭제된 자동화의 충돌 정보: ${c.id}`);if(c.date>todayDate())problems.push(`미래 날짜 자동화 충돌: ${c.date}`);if(c.sourceSnapshot&&DB.automations.find(r=>r.id===c.ruleId)?.source!==c.sourceSnapshot)problems.push(`수정 전 규칙의 충돌 정보: ${c.date}`)});
 Object.entries(DB.condition||{}).forEach(([date,c])=>{const prev=addDays(date,-1),pmPrev=readPlanMeta(prev),pmDay=readPlanMeta(date);if(c.bed&&pmPrev.bed&&c.bed!==pmPrev.bed)problems.push(`취침 동기화 불일치: ${date}`);if(c.wake&&pmDay.wake&&c.wake!==pmDay.wake)problems.push(`기상 동기화 불일치: ${date}`)});
 (DB.scheduleTemplates||[]).forEach(t=>{if(!t.id||!t.name||!Array.isArray(t.blocks))problems.push('저장 시간표 구조 오류');(t.blocks||[]).forEach(b=>{if(b.start&&b.end&&invalidBlockTime(b))problems.push(`저장 시간표 시간 오류: ${t.name} · ${b.name}`)})});Object.entries(DB.scheduleModes||{}).forEach(([d,m])=>{if(m?.mode==='template'&&!scheduleTemplateById(m.templateId))problems.push(`삭제된 저장 시간표 참조: ${d}`)});Object.entries(DB.scheduleHidden||{}).forEach(([d,a])=>{if(!Array.isArray(a))problems.push(`삭제 블록 기록 오류: ${d}`)});
 if(DB.schema!==SCHEMA_VERSION)problems.push(`데이터 스키마 불일치: ${DB.schema}`);const mb=approximateStorageBytes()/1024/1024;if(mb>4)problems.push(`저장 용량 주의: 약 ${mb.toFixed(1)} MB`);
 $('#diagnosticResult').innerHTML=problems.length?`<b>${problems.length}개 확인 필요</b><ul class="diagnostic-list">${problems.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<b>정상</b><br>연결 · 중복 · 시간 · 자동화 · 수면 동기화 · 저장 용량 검사 이상 없음`
}
function renderTrash(){
 cleanupTrash();const box=$('#trashList');box.innerHTML=DB.trash.length?DB.trash.map(x=>`<div class="trash-item"><div class="trash-top"><div><b>${trashTitle(x)}</b><div class="task-meta">${new Date(x.deletedAt).toLocaleString('ko-KR')}</div></div><button class="btn ghost small trash-restore" data-id="${x.id}">복원</button></div></div>`).join(''):'<div class="muted">휴지통이 비어 있습니다.</div>';$$('.trash-restore').forEach(b=>b.onclick=()=>restoreTrash(b.dataset.id))
}
function trashTitle(x){
 if(x.type==='task')return`할 일 · ${x.data.subject} ${x.data.name}`;if(x.type==='block')return`시간 블록 · ${x.data.name}`;if(x.type==='lectureCourse')return`인강 · ${x.data.display}`;if(x.type==='book')return`문제집 · ${x.data.name}`;if(x.type==='automation')return'자동화 규칙';if(x.type==='test')return`시험 · ${x.data.name||''}`;if(x.type==='waiting')return`대기함 · ${x.data.name}`;return x.type
}
function restoreTrash(id){
 const i=DB.trash.findIndex(x=>x.id===id);if(i<0)return;const x=DB.trash[i];
 if(x.type==='task'){const date=x.context.date||viewDate;const t=deep(x.data);if(tasksFor(date).some(a=>a.id===t.id))t.id=uid();tasksFor(date).push(t)}
 if(x.type==='block'){const date=x.context.date||viewDate;const b=deep(x.data);if(ensureSchedule(date).some(a=>a.id===b.id))b.id=uid();DB.schedules[date].push(b);DB.schedules[date]=sortBlocks(DB.schedules[date])}
 if(x.type==='lectureCourse'){const c=deep(x.data);if(DB.customLectures.some(a=>a.key===c.key))c.key='custom-'+uid();DB.customLectures.push(c)}
 if(x.type==='book'){const b=deep(x.data);if(DB.books.some(a=>a.id===b.id))b.id=uid();DB.books.push(b)}
 if(x.type==='automation'){const a=deep(x.data);if(DB.automations.some(q=>q.id===a.id))a.id=uid();DB.automations.push(a)}
 if(x.type==='test'){const t=deep(x.data);if(DB.tests.some(q=>q.id===t.id))t.id=uid();DB.tests.push(t)}
 if(x.type==='waiting'){const t=deep(x.data);if(DB.waiting.some(q=>q.id===t.id))t.id=uid();DB.waiting.push(t)}
 DB.trash.splice(i,1);saveDB();renderSettings()
}
function exportData(){
 const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`YEOKSANG_backup_${todayDate()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function validateBackupObject__impl1(d){return Boolean(d&&typeof d==='object'&&!Array.isArray(d)&&d.tasks&&typeof d.tasks==='object'&&Array.isArray(d.automations||[])&&d.settings&&typeof d.settings==='object')}
function importData__impl1(file){
 const r=new FileReader();r.onload=()=>{try{const raw=JSON.parse(r.result);if(!validateBackupObject(raw))throw new Error('invalid');if(!confirm('현재 기록을 가져온 백업으로 교체할까요? 복원 직전 상태는 안전 스냅샷으로 남깁니다.'))return;safeSetItem('p11122_pre_import_backup',JSON.stringify(DB),{silent:true});const next=migrateDB(raw),json=JSON.stringify(next);if(!safeSetItem(DB_KEY,json))throw new Error('save');DB=next;LAST_SAVED_JSON=json;viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);alert('복원했습니다.');navigate('dashboard')}catch{alert('올바른 曆象 백업 파일이 아니거나 저장할 수 없습니다.')}};r.readAsText(file)
}

function openNowMode(){
 const date=todayDate();viewDate=date;const cb=currentBlock(date),nb=nextBlock(date),b=cb||nb,tasks=b?(b.taskIds||[]).map(id=>taskById(date,id)).filter(Boolean):tasksFor(date).filter(t=>!t.done).slice(0,1);
 const n=new Date();$('#nowClock').textContent=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;$('#nowBlockTitle').textContent=cb?`${cb.name} · 지금`:nb?`${nb.name} · 다음 블록`:'지금 할 것';
 $('#nowTasks').innerHTML=tasks.length?tasks.map(t=>`<div class="task" style="text-align:left"><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}</div><div class="row" style="margin-top:8px"><button class="btn primary small now-complete" data-id="${t.id}">${t.done?'완료 해제':'완료'}</button></div></div>`).join(''):'<div class="muted">현재 연결된 할 일이 없습니다.</div>';$$('.now-complete').forEach(x=>x.onclick=()=>{const t=taskById(date,x.dataset.id);setTaskDoneInternal(date,t.id,!t.done);openNowMode();renderDashboard()});showModal('nowModal')
}
function togglePlanLock(){
 const locking=!DB.planLocks[viewDate];
 if(locking){const known=tasksFor(viewDate).filter(t=>!t.done).reduce((s,t)=>s+(Number(t.minutes)||0),0),p=plannedStudy(viewDate).minutes;if(p&&known>p&&!confirm(`할 일 예상 ${minuteLabel(known)}, 시간표 자습 ${minuteLabel(p)}로 ${minuteLabel(known-p)} 초과입니다. 그래도 오늘 계획을 확정할까요?`))return}
 DB.planLocks[viewDate]=locking;saveDB();renderDashboard()
}

function openCloseDay__impl1(){
 if(viewDate>todayDate()){alert('미래 날짜는 실제로 지난 뒤 마감할 수 있습니다. 계획은 미래 집계에서 제외됩니다.');return}
 $('#closeDateBadge').textContent=fmtDate(viewDate);const p=plannedStudy(viewDate).minutes,a=autoActualStudy(viewDate),f=finalStudy(viewDate);$('#closeStudySummary').innerHTML=`<div><span>계획 자습</span><b>${minuteLabel(p)}</b></div><div><span>자동 실제</span><b>${minuteLabel(a)}</b></div><div><span>현재 최종</span><b>${minuteLabel(f)}</b></div>`;$('#closeStudyOverride').value=(f/60).toFixed(1);
 const unfinished=tasksFor(viewDate).filter(t=>!t.done);$('#closeUnfinished').innerHTML=unfinished.length?`<h3 class="subhead">미완료 ${unfinished.length}개</h3>`+unfinished.map(t=>`<div class="close-choice"><div><b>${esc(t.subject)} · ${esc(t.name)}</b><div class="task-meta">${esc(t.material||'')}</div></div><select class="input close-action" data-id="${t.id}"><option value="tomorrow">내일</option><option value="waiting">대기함</option><option value="skip">건너뛰기</option></select></div>`).join(''):'<div class="muted">미완료 할 일이 없습니다.</div>';showModal('closeDayModal')
}
function nextDate(date){const d=parseDate(date);d.setDate(d.getDate()+1);return ymd(d)}
function confirmCloseDay__impl1(){
 const previous=dailyRecord(viewDate);if(previous?.closedAt&&!confirm('이미 마감한 날짜입니다. 현재 상태로 마감 기록을 다시 저장할까요?'))return;
 const v=Number($('#closeStudyOverride').value);if(Number.isFinite(v)&&v>=0)DB.studyOverrides[viewDate]=Math.round(v*60);
 const before=deep(tasksFor(viewDate)),units=snapshotTaskUnits(before),actions=$$('.close-action').map(x=>({id:x.dataset.id,act:x.value})),tom=nextDate(viewDate);
 const carriedBefore=previous?.closedAt?0:(Number(previous?.carried)||0),waitingBefore=previous?.closedAt?0:(Number(previous?.waiting)||0),movedTotal=previous?.closedAt?0:(Number(previous?.movedTotal)||0),movedDone=previous?.closedAt?0:(Number(previous?.movedDone)||0),movedTasks=previous?.closedAt?0:(Number(previous?.movedTasks)||0),movedDoneTasks=previous?.closedAt?0:(Number(previous?.movedDoneTasks)||0);
 let carried=0,waiting=0,skipped=0;
 actions.forEach(x=>{const t=taskById(viewDate,x.id);if(!t)return;const u=taskUnitSnapshot(t),left=Math.max(0,u.total-u.done);if(x.act==='tomorrow'){carried+=left;removeTask(viewDate,t.id,false);carryTaskToDate(t,tom)}else if(x.act==='waiting'){waiting+=left;moveTaskToWaiting(viewDate,t.id,{recordMove:false})}else if(x.act==='skip'){skipped+=left;removeTask(viewDate,t.id,true)}});
 DB.dailyRecords[viewDate]={date:viewDate,state:'closed',total:movedTotal+units.total,done:movedDone+units.done,tasks:movedTasks+units.tasks,doneTasks:movedDoneTasks+units.doneTasks,carried:carriedBefore+carried,waiting:waitingBefore+waiting,skipped,study:finalStudy(viewDate),closedAt:Date.now()};
 DB.closeHistory=DB.closeHistory.filter(x=>x.date!==viewDate);DB.closeHistory.unshift({date:viewDate,at:Date.now(),study:finalStudy(viewDate),completion:DB.dailyRecords[viewDate]});DB.closeHistory=DB.closeHistory.slice(0,50);saveDB();hideModal('closeDayModal');renderDashboard();const saved=DB.dailyRecords[viewDate];alert(`오늘 마감을 저장했습니다. 완주 ${saved.done}/${saved.total}${saved.carried||saved.waiting?` · 이월 ${saved.carried+saved.waiting}`:''}`)
}
function todayRecordText(date=viewDate){
 const p=plannedStudy(date).minutes,a=autoActualStudy(date),f=finalStudy(date),list=tasksFor(date),u=dailyCompletion(date),c=DB.condition[date]||{},session=sleepSession(date),stage=activeStage(date);
 return `[曆象 일일 기록]\n날짜: ${date}\n단계: ${stage.title}\n목표: 전과목 만점\n순공: 계획 ${minuteLabel(p)} / 자동 ${minuteLabel(a)} / 최종 ${minuteLabel(f)}\n완주: ${u.total?`${u.done}/${u.total} (${u.rate}%)`:'미기록'}${u.carried||u.waiting?` · 이월 ${u.carried+u.waiting}`:''}\n미완료: ${list.filter(t=>!t.done).map(t=>`${t.subject} ${t.name}`).join(' / ')||'없음'}\n수면: ${calcSleep(session.bed,session.wake)||'미입력'}\n컨디션: ${c.overall||'미입력'}`
}
async function copyText(text){try{await navigator.clipboard.writeText(text);alert('복사했습니다.')}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('복사했습니다.')}}
function renderVersionStatus__impl1(){$('#runtimeStatus').textContent=`${APP_VERSION} · SW ${APP_VERSION}`} 

function initPwaUpdate__impl1(){
 if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw-v110.js?v=1100').then(reg=>{reg.update().catch(()=>{});reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)$('#updateBanner')?.classList.remove('hidden')})})}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>$('#updateBanner')?.classList.remove('hidden'));const btn=$('#reloadUpdate');if(btn)btn.onclick=()=>location.reload()
}

function bindEvents__impl1(){
 $$('#mainNav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
 $$('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
 $('#settingsGear').onclick=()=>navigate('settings');$('#nowModeBtn').onclick=openNowMode;$('#closeDayBtn').onclick=openCloseDay;
 $('#addTaskBtn').onclick=()=>openTaskModal();$('#saveTask').onclick=saveTaskModal;
 $('#openWaitingBtn').onclick=()=>{renderWaiting();showModal('waitingModal')};$('#addWaitingManual').onclick=()=>{const name=prompt('대기함에 넣을 할 일을 입력하세요.');if(!name)return;const subject=prompt('과목을 입력하세요. 예: 수학')||'기타';DB.waiting.push(normalizeImportedTask({id:uid(),subject,priority:'should',name,material:'',minutes:0,note:'',done:false,waitingSince:viewDate}));saveDB();renderWaiting()};
 $('#saveStudyOverride').onclick=()=>{const v=Number($('#studyOverrideHours').value);if(!Number.isFinite(v)||v<0){alert('시간을 확인하세요.');return}DB.studyOverrides[viewDate]=Math.round(v*60);saveDB();renderDashboard()};
 $('#resetStudyOverride').onclick=()=>{delete DB.studyOverrides[viewDate];saveDB();renderDashboard()};$('#togglePlanLock').onclick=togglePlanLock;
 $('#prevMonth').onclick=()=>{const [y,m]=displayMonth.split('-').map(Number),d=new Date(y,m-2,1);displayMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;renderMonth()};
 $('#nextMonth').onclick=()=>{const [y,m]=displayMonth.split('-').map(Number),d=new Date(y,m,1);displayMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;renderMonth()};
 $('#monthPicker').onchange=()=>{displayMonth=$('#monthPicker').value;renderMonth()};$('#taskSortMode').onchange=()=>{DB.settings.taskSortMode=$('#taskSortMode').value;saveDB();renderTaskList()};
 $('#prevWeek').onclick=()=>{weekViewStart=addDays(weekViewStart,-7);renderWeek()};$('#nextWeek').onclick=()=>{weekViewStart=addDays(weekViewStart,7);renderWeek()};$('#thisWeek').onclick=()=>{weekViewStart=mondayOf(todayDate());renderWeek()};
 $('#plannerDate').onchange=()=>{viewDate=$('#plannerDate').value;renderPlanner();$('#topDate').textContent=fmtDate(viewDate)};
 $('#applyScheduleMode').onclick=applyScheduleModeFromControls;$('#openScheduleTemplates').onclick=openScheduleTemplates;$('#saveCurrentTemplate').onclick=saveCurrentScheduleAsTemplate;$('#restoreScheduleBlocks').onclick=()=>{if(restoreDeletedFixedBlocks(viewDate)){renderPlanner();renderDashboard();if($('#week')?.classList.contains('active'))renderWeek()}};
 $('#plannerModeBtn').onclick=()=>{plannerSleepMode=false;plannerEdit=!plannerEdit;clearPlannerSelection();renderPlanner()};$('#sleepModeBtn').onclick=()=>{plannerSleepMode=!plannerSleepMode;clearPlannerSelection();renderPlanner()};$('#addGridBlockBtn').onclick=()=>{if(!plannerEdit)return;plannerSleepMode=false;$('#plannerModeHint').textContent='빈 칸에서 시작 칸을 누르고 마지막 칸을 누르거나 드래그하세요.'};$('#addDirectBlockBtn').onclick=()=>openBlockModal(viewDate);
 $('#saveBlock').onclick=saveBlockModal;$('#deleteBlock').onclick=deleteBlockModal;$('#chooseBlockTasks').onclick=()=>{const id=$('#blockId').value;if(!id){alert('블록을 먼저 저장하세요.');return}hideModal('blockModal');openAssignModal($('#blockDate').value,id)};$('#sleepBed').onchange=()=>$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;$('#sleepWake').onchange=()=>$('#sleepSummaryText').textContent=`다음 날 수면 ${sleepSpanLabel($('#sleepBed').value,$('#sleepWake').value)}`;$('#saveSleepPlan').onclick=saveSleepModal;$('#clearSleepPlan').onclick=clearSleepModal;
 $('#assignSearch').oninput=renderAssignList;$('#saveAssignments').onclick=saveAssignments;$('#clearAssignments').onclick=()=>{$$('.assign-check').forEach(x=>x.checked=false);updateAssignCount()};
 $$('.learning-tab').forEach(b=>b.onclick=()=>{vendingTab=b.dataset.vtab;renderVending()});$('#learningSearch').oninput=applyVendingSearch;$('#incompleteOnly').onchange=renderLectureCatalog;$('#addLectureBtn').onclick=openLectureModal;$('#saveLecture').onclick=saveLectureModal;$('#addBookBtn').onclick=()=>openBookModal();$('#saveBook').onclick=saveBookModal;$('#addProblemsToCart').onclick=addProblemsCart;$('#cartDate').onchange=renderCart;$('#buildCartPlan').onclick=buildCartPlan;$('#clearCart').onclick=()=>{cart=[];renderVending()};
 $('#addAutomationBtn').onclick=()=>openAutomationModal();$('#saveAutomation').onclick=saveAutomationModal;
 $('#addTestBtn').onclick=openTestModal;$('#testKind').onchange=toggleTestKind;$('#saveTest').onclick=saveTestModal;$('#saveTestReview').onclick=saveTestReviewModal;$('#testSourceFilter').onchange=renderTests;$('#testScopeFilter').onchange=renderTests;$('#testSubjectFilter').onchange=renderTests;$('#analysisSubjectFilter').onchange=renderTests;$('#analysisSourceFilter').onchange=renderTests;$('#analysisScopeFilter').onchange=renderTests;
 $('#conditionDate').onchange=renderCondition;$('#bedTime').onchange=()=>$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#wakeTime').onchange=()=>$('#sleepTotal').value=calcSleep($('#bedTime').value,$('#wakeTime').value);$('#saveCondition').onclick=saveCondition;$('#analysisMonth').onchange=renderAnalysis;
 $('#saveSettings').onclick=()=>{DB.settings.lectureDailyCap=Number($('#lectureDailyCap').value)||5;saveDB();alert('저장했습니다.')};$('#savePeriodTimes').onclick=savePeriodTimes;$('#clearPeriodTimes').onclick=()=>{$$('.period-start,.period-end').forEach(x=>x.value='')};$('#runDiagnostics').onclick=runDiagnostics;$('#exportData').onclick=exportData;$('#importData').onchange=e=>{if(e.target.files[0])importData(e.target.files[0])};
 $('#confirmCloseDay').onclick=confirmCloseDay;$('#copyTodayRecord').onclick=()=>copyText(todayRecordText());
 $$('.modal-close').forEach(b=>b.onclick=()=>b.closest('.modal-back').classList.remove('show'));$$('.modal-back').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show')}));
}
function init(){
 cleanupTrash();saveDB({undo:false});viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);$('#cartDate').value=viewDate;$('#plannerDate').value=viewDate;$('#conditionDate').value=viewDate;$('#analysisMonth').value=displayMonth;bindEvents();if(DB.settings.automationEnabled===true)runAutomationForDate(todayDate());renderVersionStatus();renderDashboard();initPwaUpdate()
}
document.addEventListener('DOMContentLoaded',init);


/* ============================================================
   v10.1 extension · execution first, intelligence second
   ============================================================ */
const CURRICULUM_CLOSE='2026-10-16';
const OCT_EXAM='2026-10-20';
const ERROR_PATTERNS=['개념 부재','개념 경계 혼동','개념 인출 실패','조건 오독','자료 첫 판독 오류','계산 절차 누락','근거 없이 풀이 중단','정답 변경','시간 손실의 연쇄','압박에 의한 판단 붕괴','기타'];
const ANSWER_OUTCOMES=['','확신하고 맞음','애매했지만 맞음','처음 답은 맞았지만 변경해 틀림','처음 답은 틀렸지만 근거로 변경해 맞음','근거 없이 찍음','풀지 못함'];

function ensureV90DB(){
 DB.settings=DB.settings||{};
 if(DB.settings.curriculumDeadline==null)DB.settings.curriculumDeadline=CURRICULUM_CLOSE;
 if(DB.settings.weekdayCapacityHours==null)DB.settings.weekdayCapacityHours=10;
 if(DB.settings.weekendCapacityHours==null)DB.settings.weekendCapacityHours=14;
 if(DB.settings.studyCutoff==null)DB.settings.studyCutoff='';
 if(DB.settings.automationEnabled==null)DB.settings.automationEnabled=false;
 if(!DB.settings.capacityOverrides||typeof DB.settings.capacityOverrides!=='object')DB.settings.capacityOverrides={};
 if(!Array.isArray(DB.settings.zeroCapacityDates))DB.settings.zeroCapacityDates=['2026-10-07','2026-10-08'];
 if(!Array.isArray(DB.settings.holidayStudyDates))DB.settings.holidayStudyDates=['2026-09-24','2026-09-25','2026-09-26','2026-09-27'];
 if(!DB.courseMeta||typeof DB.courseMeta!=='object'||Array.isArray(DB.courseMeta))DB.courseMeta={};
 if(!Array.isArray(DB.curriculumExtra))DB.curriculumExtra=[];
 if(!DB.subjectProtocols||typeof DB.subjectProtocols!=='object'||Array.isArray(DB.subjectProtocols))DB.subjectProtocols={};
 SUBJECTS.forEach(s=>{if(!Array.isArray(DB.subjectProtocols[s]))DB.subjectProtocols[s]=[];DB.subjectProtocols[s]=DB.subjectProtocols[s].slice(0,3)});
 if(!DB.weeklyNotes||typeof DB.weeklyNotes!=='object'||Array.isArray(DB.weeklyNotes))DB.weeklyNotes={};
 if(!Array.isArray(DB.constraints))DB.constraints=[];
 DB.schema=SCHEMA_VERSION;saveDB({undo:false});
}
ensureV90DB();

const normalizeQuestionRecordV8=normalizeQuestionRecord__impl1;
__impl_normalizeQuestionRecord=normalizeQuestionRecord__impl2;
function normalizeQuestionRecord__impl2(q,fallback={}){
 const x=normalizeQuestionRecordV8(q,fallback);if(!x)return x;
 return {...x,pattern:ERROR_PATTERNS.includes(q?.pattern)?q.pattern:'',trigger:String(q?.trigger||''),behavior:String(q?.behavior||''),missedCheck:String(q?.missedCheck||''),rootCause:String(q?.rootCause||''),controlRule:String(q?.controlRule||''),answerOutcome:ANSWER_OUTCOMES.includes(q?.answerOutcome)?q.answerOutcome:'',firstAnswer:String(q?.firstAnswer||''),finalAnswer:String(q?.finalAnswer||'')}
};

function deadlineDate(){return DB.settings.curriculumDeadline||CURRICULUM_CLOSE}
function isWeekend(date){const d=parseDate(date).getDay();return d===0||d===6}
function capacityHoursFor__impl1(date){
 if(DB.settings.capacityOverrides?.[date]!=null)return Math.max(0,Number(DB.settings.capacityOverrides[date])||0);
 if((DB.settings.zeroCapacityDates||[]).includes(date))return 0;
 if((DB.settings.holidayStudyDates||[]).includes(date))return Number(DB.settings.weekendCapacityHours)||14;
 return isWeekend(date)?Number(DB.settings.weekendCapacityHours)||14:Number(DB.settings.weekdayCapacityHours)||10
}
function capacitySummaryV90__impl1(from=viewDate,to=deadlineDate()){
 if(dateCompare(from,to)>0)return{activeDays:0,totalHours:0,zeroDays:0,calendarDays:0};let activeDays=0,totalHours=0,zeroDays=0,calendarDays=0;
 for(let d=from;dateCompare(d,to)<=0;d=addDays(d,1)){calendarDays++;const h=capacityHoursFor(d);if(h>0){activeDays++;totalHours+=h}else zeroDays++}
 return{activeDays,totalHours,zeroDays,calendarDays}
}
function sourceProgress(kind,id){
 if(kind==='lecture'){const c=lectureCourse(id);return c?{done:lectureCourseDone(c),total:c.total,name:c.display,subject:c.subject,kind:'lecture'}:null}
 if(kind==='book'){const b=DB.books.find(x=>x.id===id);if(!b)return null;const total=(b.subunits||[]).length,done=(b.subunits||[]).filter(s=>bookSubDone(b.id,s)).length;return{done,total,name:b.name,subject:b.subject,kind:'book'}}
 return null
}
function curriculumRowsV90(){
 const rows=learningProgressItems().map(r=>{const m=DB.courseMeta[r.id]||{};return{id:r.id,kind:r.sourceKind,subject:r.subject,name:r.name,done:r.done,total:r.total,meta:m}});
 for(const x of DB.curriculumExtra||[]){if(rows.some(r=>r.id===x.id))continue;rows.push({id:x.id,kind:x.kind||'other',subject:x.subject||'기타',name:x.name||x.id,done:Number(x.completedUnits)||0,total:x.totalUnits==null?null:Number(x.totalUnits),meta:{...(DB.courseMeta[x.id]||{}),...x}})}
 return rows
}
function rowWorkloadV90__impl1(row){
 const m=row.meta||{},remaining=row.total==null?null:Math.max(0,Number(row.total)-Number(row.done||0));
 if(m.included===false)return{unknown:false,low:0,high:0,remaining,included:false};
 if(remaining==null)return{unknown:true,low:0,high:0,remaining:null,included:true};
 let low=m.minutesPerUnitLow??m.minutesLow,high=m.minutesPerUnitHigh??m.minutesHigh??low;
 if(low==null&&high==null)return{unknown:true,low:0,high:0,remaining,included:true};
 low=Math.max(0,Number(low)||0);high=Math.max(low,Number(high)||low);
 return{unknown:false,low:remaining*low,high:remaining*high,remaining,included:true}
}
function curriculumLoadV90__impl1(date=viewDate){
 const cap=capacitySummaryV90(date,deadlineDate()),rows=curriculumRowsV90().map(row=>({...row,workload:rowWorkloadV90(row)}));
 const included=rows.filter(r=>r.workload.included!==false),known=included.filter(r=>!r.workload.unknown),unknown=included.filter(r=>r.workload.unknown);
 const low=known.reduce((s,r)=>s+r.workload.low,0),high=known.reduce((s,r)=>s+r.workload.high,0),todayCap=dateCompare(date,deadlineDate())<=0?capacityHoursFor(date):0,totalCap=cap.totalHours*60;
 const bySubject={};SUBJECTS.forEach(s=>bySubject[s]={subject:s,low:0,high:0});known.forEach(r=>{if(!bySubject[r.subject])bySubject[r.subject]={subject:r.subject,low:0,high:0};bySubject[r.subject].low+=r.workload.low;bySubject[r.subject].high+=r.workload.high});
 return{date,capacity:cap,rows,unknown,low,high,todayCap,todayLow:totalCap?low/totalCap*todayCap:0,todayHigh:totalCap?high/totalCap*todayCap:0,bySubject:Object.values(bySubject),utilizationLow:totalCap?low/totalCap:0,utilizationHigh:totalCap?high/totalCap:0}
}
function sleepBoundary(date){
 const c=DB.condition?.[date]||{},bed=c.bed||'',wake=c.wake||'',weekend=isWeekend(date),bedMin=timeToMin(bed),wakeMin=timeToMin(wake);let bedOk=null,wakeOk=null;
 if(bed)bedOk=bedMin<23*60;if(wake&&!weekend)wakeOk=wakeMin<6*60+30;else if(weekend)wakeOk=null;
 const sleep=sleepMinutes(bed,wake),status=bedOk===false||wakeOk===false?'violation':(bedOk===true&&(weekend||wakeOk===true)?'ok':'missing');
 return{date,weekend,bed,wake,bedOk,wakeOk,sleep,status}
}
function hardStudyCutoff(){return DB.settings.studyCutoff||'23:00'}
function studyBlockViolatesSleep(block){if(!block?.selfStudy||!block.start||!block.end)return false;const end=plannerMinute(block.end),cut=plannerMinute(hardStudyCutoff());if(end==null||cut==null)return false;return DB.settings.studyCutoff?end>cut:end>=cut}
function pct(n,d){return d?Math.round(n/d*100):0}
function taskPriorityCompletion(date){const list=tasksFor(date),must=list.filter(t=>t.priority==='must'),u=todayUnitState(list),m=todayUnitState(must);return{all:u,must:m}}


const navigateV8=navigate__impl1;
__impl_navigate=navigate__impl2;
function navigate__impl2(page){navigateV8(page);const group=page==='month'||page==='week'?'planner':page==='progress'?'vending':page==='condition'||page==='goals'?'analysis':page;$$('#mainNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===group));const labels={dashboard:'오늘',planner:'시간표',month:'월간',week:'주간',vending:'학습',progress:'진도·종료 기준',tests:'시험',analysis:'분석',condition:'수면·컨디션',goals:'목표·진단',settings:'설정·백업'};$('#pageTitle').textContent=labels[page]||'曆象'};

const renderDashboardV8=renderDashboard__impl1;
__impl_renderDashboard=renderDashboard__impl2;
function renderDashboard__impl2(){
 renderDashboardV8();const load=curriculumLoadV90(viewDate),comp=taskPriorityCompletion(viewDate),guard=sleepBoundary(viewDate);
 $('#ddayClose').textContent=dateCompare(viewDate,deadlineDate())>0?'완료':`D-${dday(deadlineDate(),viewDate)}`;$('#ddayOct').textContent=dateCompare(viewDate,OCT_EXAM)>0?'완료':`D-${dday(OCT_EXAM,viewDate)}`;
 const need=$('#todayNeedHours'),cap=$('#todayNeedCaption');if(load.unknown.length&&load.low===0){need.textContent='분량 미정';cap.textContent=`시간 미입력 과정 ${load.unknown.length}개`;}else{need.textContent=`${(load.todayLow).toFixed(1)}–${(load.todayHigh).toFixed(1)}h`;cap.textContent=`오늘 가용 목표 ${load.todayCap.toFixed(1)}h · 미정 ${load.unknown.length}개`;}
 $('#todayCompletionCaption').textContent=`필수 ${comp.must.done}/${comp.must.total||0} · 전체 ${comp.all.done}/${comp.all.total||0}`;
 const title=$('#sleepGuardTitle'),detail=$('#sleepGuardDetail'),state=$('#sleepGuardState'),mini=$('#sleepGuardMini');
 if(guard.status==='ok'){title.textContent='수면 규칙 준수';detail.textContent=`${guard.bed} 취침 · ${guard.weekend?(guard.wake?guard.wake+' 기상':'주말 기상 미고정'):guard.wake+' 기상'}${guard.sleep!=null?` · ${minuteLabel(guard.sleep)}`:''}`;state.textContent='준수';state.className='status-chip ok';mini.textContent='수면 경계 준수'}
 else if(guard.status==='violation'){title.textContent='수면 규칙 위반 기록';detail.textContent=`${guard.bed||'취침 미입력'} · ${guard.wake||'기상 미입력'} · 진도를 위해 수면을 보상하지 않습니다.`;state.textContent='보정 필요';state.className='status-chip bad';mini.textContent='수면 경계 위반'}
 else{title.textContent='23:00 전 취침';detail.textContent=guard.weekend?'주말 기상 목표는 미정 · 취침은 동일하게 23:00 전':'평일 06:30 전 기상 · 수면 기록이 아직 없습니다.';state.textContent='기록 필요';state.className='status-chip';mini.textContent='수면 기록 필요'}
 const q=$('#dailyQuotaBySubject');if(q){const known=load.bySubject.filter(x=>x.low||x.high);q.innerHTML=known.length?known.map(x=>{const low=load.low?x.low/load.low*load.todayLow:0,high=load.high?x.high/load.high*load.todayHigh:0;return `<div class="quota-row"><b>${esc(x.subject)}</b><span><i style="width:${Math.min(100,load.high?x.high/load.high*100:0)}%"></i></span><strong>${low.toFixed(1)}–${high.toFixed(1)}h</strong></div>`}).join(''):`<div class="empty-state">과정별 시간을 입력하면 오늘 필요한 과목별 시간이 여기에 계산됩니다.</div>`}
};

const saveBlockModalV8=saveBlockModal__impl1;
__impl_saveBlockModal=saveBlockModal__impl2;
function saveBlockModal__impl2(){
 const proposed={selfStudy:$('#blockSelfStudy').checked,start:$('#blockStart').value,end:$('#blockEnd').value};if(studyBlockViolatesSleep(proposed)){alert(`자습 블록은 수면 경계보다 늦게 끝낼 수 없습니다. 현재 마지막 자습 종료 기준은 ${hardStudyCutoff()}입니다.`);return}return saveBlockModalV8()
};
const openSleepModalV8=openSleepModal__impl1;
__impl_openSleepModal=openSleepModal__impl2;
function openSleepModal__impl2(date,time=''){openSleepModalV8(date,time);const sessionDate=addDays(date,1);if(!sleepSession(sessionDate).bed)$('#sleepBed').value=time||'';if(!sleepSession(sessionDate).wake)$('#sleepWake').value='';$('#sleepSummaryText').textContent=isWeekend(sessionDate)?'주말 기상 시각은 아직 고정하지 않습니다. 취침은 23:00 전입니다.':'평일 취침 23:00 전 · 기상 06:30 전'};
const saveSleepModalV8=saveSleepModal__impl1;
__impl_saveSleepModal=saveSleepModal__impl2;
function saveSleepModal__impl2(){const date=$('#sleepDate').value||viewDate,sessionDate=addDays(date,1),bed=$('#sleepBed').value,wake=$('#sleepWake').value;if(bed&&timeToMin(bed)>=23*60){alert('계획상 취침은 23:00보다 빨라야 합니다. 실제 위반 기록은 수면·컨디션 화면에서 남겨주세요.');return}if(!isWeekend(sessionDate)&&wake&&timeToMin(wake)>=6*60+30){alert('평일 계획 기상은 06:30보다 빨라야 합니다.');return}return saveSleepModalV8()};

function courseRowInfo(id,kind){const row=curriculumRowsV90().find(x=>x.id===id&&(!kind||x.kind===kind));return row||null}
function masteryChips__impl1(row){const m=row.meta?.mastery||{},learned=row.total!=null&&row.done>=row.total;return `<div class="mastery-chips"><span class="${learned?'on':''}">수강</span><span class="${m.review?'on':''}">복습</span><span class="${m.apply?'on':''}">적용</span><span class="${m.timed?'on':''}">시간 내 재현</span></div>`}
function openCourseMeta__impl1(id,kind){const row=courseRowInfo(id,kind);if(!row)return;const m=DB.courseMeta[id]||{};$('#courseMetaId').value=id;$('#courseMetaKind').value=kind||row.kind;$('#courseMetaTitle').textContent=`${row.subject} · ${row.name}`;$('#courseMetaLow').value=m.minutesPerUnitLow??m.minutesLow??'';$('#courseMetaHigh').value=m.minutesPerUnitHigh??m.minutesHigh??'';$('#courseMetaTarget').value=m.targetDate||deadlineDate();$('#courseMetaIncluded').checked=m.included!==false;$('#masteryReview').checked=Boolean(m.mastery?.review);$('#masteryApply').checked=Boolean(m.mastery?.apply);$('#masteryExplain').checked=Boolean(m.mastery?.explain);$('#masteryTimed').checked=Boolean(m.mastery?.timed);$('#courseMetaNote').value=m.note||'';showModal('courseMetaModal')}
function saveCourseMeta__impl1(){const id=$('#courseMetaId').value;if(!id)return;const low=$('#courseMetaLow').value,high=$('#courseMetaHigh').value;DB.courseMeta[id]={...(DB.courseMeta[id]||{}),minutesPerUnitLow:low===''?null:Number(low),minutesPerUnitHigh:high===''?null:Number(high),targetDate:$('#courseMetaTarget').value||deadlineDate(),included:$('#courseMetaIncluded').checked,mastery:{review:$('#masteryReview').checked,apply:$('#masteryApply').checked,explain:$('#masteryExplain').checked,timed:$('#masteryTimed').checked},note:$('#courseMetaNote').value.trim()};saveDB();hideModal('courseMetaModal');renderProgress();if($('#dashboard').classList.contains('active'))renderDashboard()}

__impl_renderProgress=renderProgress__impl2;
function renderProgress__impl2(){
 const rows=curriculumRowsV90(),load=curriculumLoadV90(viewDate),pressure=$('#curriculumPressure');if(pressure){const known=`${(load.low/60).toFixed(1)}–${(load.high/60).toFixed(1)}h`,cap=`${load.capacity.totalHours.toFixed(1)}h`,risk=load.utilizationHigh>1?'마감 초과':load.utilizationHigh>.85?'완충 적음':'완충 있음';pressure.innerHTML=`<div><span>남은 필요량</span><b>${known}</b><small>시간 미정 ${load.unknown.length}개</small></div><div><span>남은 가용 목표</span><b>${cap}</b><small>${load.capacity.activeDays}일 · 보호일 ${load.capacity.zeroDays}일</small></div><div><span>필요 / 가용</span><b>${Math.round(load.utilizationLow*100)}–${Math.round(load.utilizationHigh*100)}%</b><small>${risk}</small></div><div><span>오늘 최소</span><b>${load.low||load.high?`${load.todayLow.toFixed(1)}–${load.todayHigh.toFixed(1)}h`:'미정'}</b><small>${fmtDate(viewDate)}</small></div>`}
 const box=$('#progressCatalog');const subs=[...new Set(rows.map(x=>x.subject))];box.innerHTML=rows.length?subs.map(s=>`<section class="progress-group"><h4>${esc(s)}</h4><div class="progress-grid">${rows.filter(x=>x.subject===s).map(r=>{const w=rowWorkloadV90(r),p=r.total?pct(r.done,r.total):0,meta=r.meta||{};return `<article class="progress-card intelligence"><div class="progress-card-top"><span class="kind-pill">${r.kind==='lecture'?'인강':r.kind==='book'?'문제집':'과정'}</span><button class="text-link course-meta-btn" data-id="${esc(r.id)}" data-kind="${esc(r.kind)}">분량·종료기준</button></div><h5>${esc(r.name)}</h5><div class="progress-line"><i style="width:${p}%"></i></div><b>${r.total==null?'분량 미정':`${r.done}/${r.total} · ${p}%`}</b><div class="task-meta">남은 시간 ${w.unknown?'미정':`${(w.low/60).toFixed(1)}–${(w.high/60).toFixed(1)}h`}${meta.included===false?' · 필요량 제외':''}</div>${masteryChips(r)}</article>`}).join('')}</div></section>`).join(''):'<div class="empty-state">학습 자판기에 과정이나 문제집을 등록하세요.</div>';$$('.course-meta-btn').forEach(b=>b.onclick=e=>{e.stopPropagation();openCourseMeta(b.dataset.id,b.dataset.kind)})
};

function representativeRowsForSubject(subject){return subjectHistory(subject,{scope:'representative'}).map(x=>{const row=testSubjectRows(x.test).find(r=>r.subject===subject);return{...x,row}}).filter(x=>x.row&&Number.isFinite(Number(x.row.score)))}
function subjectStability__impl1(subject){const rows=representativeRowsForSubject(subject);if(rows.length<3)return{n:rows.length,insufficient:true};const scores=rows.map(x=>Number(x.row.score)),latest=rows.at(-1),range=Math.max(...scores)-Math.min(...scores);let zeroStreak=0;for(let i=rows.length-1;i>=0;i--){if(Number(rows[i].row.wrong||0)===0)zeroStreak++;else break}const uncertain=rows.reduce((s,x)=>s+(x.test.questionRecords||[]).filter(q=>q.subject===subject&&q.status==='uncertain').length,0),abandoned=rows.reduce((s,x)=>s+parseQuestionNumbers(x.test.abandonedQuestionMap?.[subject]??(x.test.subject===subject?x.test.abandonedQuestions:'')).length,0);return{n:rows.length,latest:Number(latest.row.score),min:Math.min(...scores),max:Math.max(...scores),range,zeroStreak,uncertain,abandoned,insufficient:false}}
function renderStabilityBoard__impl1(){const box=$('#stabilityBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const x=subjectStability(s);return `<div class="stability-row"><b>${s}</b>${x.insufficient?`<span>판정 근거 부족</span><small>대표 시험 ${x.n}/3회</small>`:`<span>최근 ${x.latest} · 최저 ${x.min} · 변동 ${x.range}점</span><small>무오답 연속 ${x.zeroStreak}회 · 애매 ${x.uncertain} · 미풀이 ${x.abandoned}</small>`}</div>`}).join('')}
function renderProtocolBoard__impl1(){const box=$('#protocolBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const rules=DB.subjectProtocols?.[s]||[];return `<div class="protocol-row"><b>${s}</b><ol>${rules.length?rules.map(r=>`<li>${esc(r)}</li>`).join(''):'<li class="muted">아직 확정된 규칙 없음</li>'}</ol></div>`}).join('')}
function openProtocolModal(subject=$('#analysisSubjectFilter')?.value||'국어'){if(!SUBJECTS.includes(subject))subject='국어';$('#protocolSubject').value=subject;const r=DB.subjectProtocols?.[subject]||[];['#protocolRule1','#protocolRule2','#protocolRule3'].forEach((sel,i)=>$(sel).value=r[i]||'');showModal('protocolModal')}
function loadProtocolForm(){const s=$('#protocolSubject').value,r=DB.subjectProtocols?.[s]||[];['#protocolRule1','#protocolRule2','#protocolRule3'].forEach((sel,i)=>$(sel).value=r[i]||'')}
function saveProtocol(){const s=$('#protocolSubject').value;DB.subjectProtocols[s]=['#protocolRule1','#protocolRule2','#protocolRule3'].map(x=>$(x).value.trim()).filter(Boolean).slice(0,3);saveDB();hideModal('protocolModal');renderTests()}

const renderTestsV8=renderTests__impl1;
__impl_renderTests=renderTests__impl2;
function renderTests__impl2(){renderTestsV8();renderStabilityBoard();renderProtocolBoard()};

const openTestModalV8=openTestModal__impl1;
__impl_openTestModal=openTestModal__impl2;
function openTestModal__impl2(){openTestModalV8();['#testAbandonedQuestions','#testTimeLeft','#testFirstChoke','#testLastNormal','#testTimingMemo'].forEach(s=>{if($(s))$(s).value=''})};
__impl_saveTestModal=saveTestModal__impl2;
function saveTestModal__impl2(){
 const kind=$('#testKind').value,name=$('#testName').value.trim()||(kind==='full'?'전과목 모의고사':'시험'),date=$('#testDate').value||viewDate,base={id:uid(),kind,source:$('#testSource').value,round:$('#testRound').value.trim(),date,name,causes:$$('.cause-picker input:checked').map(x=>x.value),memo:$('#testMemo').value.trim(),timingMemo:$('#testTimingMemo')?.value.trim()||''};let record;
 if(kind==='full'){
  const scores={},grades={},wrongs={},minutes={},wrongQuestionMap={},uncertainQuestionMap={};$$('.full-score').forEach(x=>scores[x.dataset.sub]=Number(x.value)||0);$$('.full-grade').forEach(x=>grades[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong').forEach(x=>wrongs[x.dataset.sub]=Number(x.value)||0);$$('.full-minutes').forEach(x=>minutes[x.dataset.sub]=Number(x.value)||0);$$('.full-wrong-questions').forEach(x=>wrongQuestionMap[x.dataset.sub]=x.value.trim());$$('.full-uncertain-questions').forEach(x=>uncertainQuestionMap[x.dataset.sub]=x.value.trim());record=normalizeTestRecord({...base,scope:'full',scores,grades,wrongs,minutes,wrongQuestionMap,uncertainQuestionMap,questionRecords:SUBJECTS.flatMap(subject=>questionRecordsFromTexts(subject,wrongQuestionMap[subject],uncertainQuestionMap[subject],date))})
 }else{
  const subject=$('#testSubject').value,wrongQuestions=$('#testWrongQuestions').value.trim(),uncertainQuestions=$('#testUncertainQuestions').value.trim(),abandonedQuestions=$('#testAbandonedQuestions')?.value.trim()||'';record=normalizeTestRecord({...base,scope:$('#testScope').value,subject,score:Number($('#testScore').value)||0,grade:Number($('#testGrade').value)||0,minutes:Number($('#testMinutes').value)||0,wrongCount:Number($('#testWrongCount').value)||0,wrongQuestions,uncertainQuestions,abandonedQuestions,timeLeft:Number($('#testTimeLeft')?.value)||0,firstChoke:Number($('#testFirstChoke')?.value)||0,lastNormal:Number($('#testLastNormal')?.value)||0,questionRecords:questionRecordsFromTexts(subject,wrongQuestions,uncertainQuestions,date)})
 }
 DB.tests.push(record);saveDB();hideModal('testModal');renderTests();renderDashboard()
};

function patternOptions(value=''){return `<option value="">패턴 선택</option>${ERROR_PATTERNS.map(x=>`<option value="${esc(x)}"${x===value?' selected':''}>${esc(x)}</option>`).join('')}`}
function answerOutcomeOptions(value=''){return ANSWER_OUTCOMES.map(x=>`<option value="${esc(x)}"${x===value?' selected':''}>${x||'선택'}</option>`).join('')}
function renderProtocolReview(test){const box=$('#protocolReviewPanel');if(!box)return;const subjects=testSubjectRows(test).map(x=>x.subject);box.innerHTML=subjects.length?`<article class="protocol-review"><div class="card-head"><div><h4>이번 시험 규칙 준수</h4><div class="micro-label">규칙을 지켰는지만 체크합니다.</div></div></div>${subjects.map(s=>{const rules=DB.subjectProtocols?.[s]||[],checks=test.protocolChecks?.[s]||[];return `<div class="protocol-review-row"><b>${s}</b>${rules.length?rules.map((r,i)=>`<label class="inline"><input class="protocol-check" type="checkbox" data-sub="${s}" data-i="${i}" ${checks[i]===true?'checked':''}>${esc(r)}</label>`).join(''):'<span class="muted">등록된 규칙 없음</span>'}</div>`}).join('')}</article>`:''}
__impl_openTestReviewModal=openTestReviewModal__impl2;
function openTestReviewModal__impl2(testId){
 const test=mutableTest(testId);if(!test)return;$('#testReviewId').value=test.id;$('#testReviewMeta').textContent=`${test.date} · ${testSourceLabel(test.source)} · ${test.name||'시험'} · 오류 패턴과 재발 방지`;renderProtocolReview(test);const questions=[...(test.questionRecords||[])].sort((a,b)=>a.subject.localeCompare(b.subject)||a.number-b.number),box=$('#testReviewQuestions');if(!questions.length){box.innerHTML='<div class="muted">문항 번호 기록이 없습니다.</div>';showModal('testReviewModal');return}box.innerHTML=SUBJECTS.map(subject=>{const list=questions.filter(q=>q.subject===subject);if(!list.length)return'';return `<section class="review-subject-group"><h4>${subject}</h4>${list.map(q=>`<article class="review-question-card" data-question-id="${esc(q.id)}"><div class="review-question-head"><b>${q.number}번</b><span class="kind-pill">${QUESTION_STATUS_LABELS[q.status]}</span><span>${reviewStatusLabel(q)}</span></div><div class="review-question-grid v90"><label>상태<select class="input review-q-status"><option value="wrong"${q.status==='wrong'?' selected':''}>틀림</option><option value="uncertain"${q.status==='uncertain'?' selected':''}>애매하지만 맞음</option></select></label><label>유형·단원<input class="input review-q-type" value="${esc(q.type)}"></label><label>직접 원인<select class="input review-q-cause">${reviewCauseOptions(q.cause)}</select></label><label>오류 패턴<select class="input review-q-pattern">${patternOptions(q.pattern)}</select></label><label>답 상태<select class="input review-q-answer">${answerOutcomeOptions(q.answerOutcome)}</select></label><label>재풀이일<input class="input review-q-due" type="date" value="${esc(q.retryDue)}"></label><label>결과<select class="input review-q-state"><option value="pending"${q.retryState!=='resolved'?' selected':''}>재풀이 대기</option><option value="resolved"${q.retryState==='resolved'?' selected':''}>해결</option></select></label></div><div class="pattern-chain"><label>발동 조건<input class="input review-q-trigger" value="${esc(q.trigger)}" placeholder="예: 복합 선지 + 시간 압박"></label><label>시험장에서 한 행동<input class="input review-q-behavior" value="${esc(q.behavior)}"></label><label>놓친 확인<input class="input review-q-missed" value="${esc(q.missedCheck)}"></label><label>근본 원인 가설<input class="input review-q-root" value="${esc(q.rootCause)}"></label><label class="wide">다음 시험 통제 규칙<input class="input review-q-control" value="${esc(q.controlRule)}" placeholder="다음 시험에서 실제로 지킬 한 문장"></label></div><label>메모<textarea class="input review-q-note" rows="2">${esc(q.note)}</textarea></label></article>`).join('')}</section>`}).join('');showModal('testReviewModal')
};
__impl_saveTestReviewModal=saveTestReviewModal__impl2;
function saveTestReviewModal__impl2(){
 const test=mutableTest($('#testReviewId').value);if(!test)return;test.protocolChecks=test.protocolChecks||{};$$('.protocol-check').forEach(x=>{const s=x.dataset.sub,i=Number(x.dataset.i);test.protocolChecks[s]=test.protocolChecks[s]||[];test.protocolChecks[s][i]=x.checked});$$('#testReviewQuestions .review-question-card').forEach(card=>{const q=test.questionRecords.find(x=>x.id===card.dataset.questionId);if(!q)return;const before=q.retryState,gv=s=>card.querySelector(s)?.value?.trim?.()??card.querySelector(s)?.value??'';q.status=gv('.review-q-status')||q.status;q.type=gv('.review-q-type');q.cause=gv('.review-q-cause');q.pattern=gv('.review-q-pattern');q.answerOutcome=gv('.review-q-answer');q.retryDue=gv('.review-q-due')||q.retryDue;q.note=gv('.review-q-note');q.trigger=gv('.review-q-trigger');q.behavior=gv('.review-q-behavior');q.missedCheck=gv('.review-q-missed');q.rootCause=gv('.review-q-root');q.controlRule=gv('.review-q-control');q.retryState=gv('.review-q-state')==='resolved'?'resolved':'pending';if(before!=='resolved'&&q.retryState==='resolved')q.retryHistory=[...(q.retryHistory||[]),{date:todayDate(),result:'해결'}]});DB.tests[DB.tests.findIndex(t=>t.id===test.id)]=normalizeTestRecord(test);saveDB();hideModal('testReviewModal');renderTests()
};

function errorPatternStats__impl1(){const map=new Map();for(const t of DB.tests||[])for(const q of t.questionRecords||[]){if(!q.pattern)continue;const x=map.get(q.pattern)||{pattern:q.pattern,count:0,pending:0,subjects:new Set(),rules:new Set()};x.count++;if(q.retryState!=='resolved')x.pending++;x.subjects.add(q.subject);if(q.controlRule)x.rules.add(q.controlRule);map.set(q.pattern,x)}return [...map.values()].sort((a,b)=>b.count-a.count)}
function weeklySummary(date=viewDate){const start=mondayOf(date),dates=Array.from({length:7},(_,i)=>addDays(start,i)),r=statsForDates(dates),closed=dates.map(d=>dailyCompletion(d)).filter(x=>x.state==='closed'),carry=closed.reduce((s,x)=>s+(x.carried||0)+(x.waiting||0),0),patterns=errorPatternStats().filter(x=>x.pending).slice(0,4),tests=DB.tests.filter(t=>t.date>=start&&t.date<=addDays(start,6));return{start,end:addDays(start,6),r,carry,patterns,tests}}
function readinessEvidence(subject){const pending=(DB.tests||[]).flatMap(t=>(t.questionRecords||[]).filter(q=>q.subject===subject&&q.retryState!=='resolved')),concept=pending.filter(q=>['개념 부재','개념 경계 혼동','개념 인출 실패'].includes(q.pattern)||q.cause==='개념 부족').length,execution=pending.filter(q=>['조건 오독','자료 첫 판독 오류','계산 절차 누락','근거 없이 풀이 중단','정답 변경','시간 손실의 연쇄','압박에 의한 판단 붕괴'].includes(q.pattern)||['계산 실수','문제 해석','부주의','시간 부족'].includes(q.cause)).length,apply=pending.filter(q=>q.type&&q.pattern&&!['개념 부재'].includes(q.pattern)).length,stab=subjectStability(subject);return{concept,apply,execution,stab,pending:pending.length}}
function renderWeeklyCommand__impl1(){const x=weeklySummary(viewDate),box=$('#weeklyCommand');if(!box)return;$('#weekCommandLabel').textContent=`${x.start.slice(5).replace('-','.')}–${x.end.slice(5).replace('-','.')}`;box.innerHTML=`<div class="weekly-facts"><div><span>순공</span><b>${hoursLabel(x.r.mins)}</b></div><div><span>완주</span><b>${x.r.done}/${x.r.total}</b></div><div><span>이월 단위</span><b>${x.carry}</b></div><div><span>시험</span><b>${x.tests.length}회</b></div></div><div class="weekly-bottleneck"><b>남은 병목 근거</b>${x.patterns.length?x.patterns.map(p=>`<span>${esc(p.pattern)} · 미해결 ${p.pending} · ${[...p.subjects].join('/')}</span>`).join(''):'<span class="muted">분석된 오류 패턴이 아직 없습니다.</span>'}</div>`;const n=DB.weeklyNotes[x.start]||{};$('#weeklyPriority1').value=n.p1||'';$('#weeklyPriority2').value=n.p2||'';$('#weeklyPriority3').value=n.p3||'';$('#weeklyStop').value=n.stop||''}
function saveWeeklyCommand__impl1(){const start=mondayOf(viewDate);DB.weeklyNotes[start]={p1:$('#weeklyPriority1').value.trim(),p2:$('#weeklyPriority2').value.trim(),p3:$('#weeklyPriority3').value.trim(),stop:$('#weeklyStop').value.trim(),updatedAt:Date.now()};saveDB();renderWeeklyCommand()}
function renderReadiness(){const box=$('#readinessBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const x=readinessEvidence(s),st=x.stab;return `<div class="readiness-row"><b>${s}</b><div><span>개념</span><strong>${x.concept?`미해결 ${x.concept}`:'기록상 미해결 0'}</strong></div><div><span>적용</span><strong>${x.apply?`검증 필요 ${x.apply}`:'근거 축적 중'}</strong></div><div><span>실행</span><strong>${x.execution?`오류 ${x.execution}`:'기록상 오류 0'}</strong></div><div><span>안정</span><strong>${st.insufficient?`근거 ${st.n}/3회`:`최저 ${st.min} · 변동 ${st.range}`}</strong></div></div>`}).join('')}
function renderErrorPatterns__impl1(){const box=$('#errorPatternBoard');if(!box)return;const rows=errorPatternStats();box.innerHTML=rows.length?rows.map(x=>`<div class="pattern-stat"><b>${esc(x.pattern)}</b><span>${x.count}회 · 미해결 ${x.pending} · ${[...x.subjects].join(' / ')}</span><small>${[...x.rules].slice(0,2).map(esc).join(' · ')||'통제 규칙 미입력'}</small></div>`).join(''):'<div class="empty-state">시험 문항 분석에서 오류 패턴을 기록하면 번호가 달라도 같은 행동을 묶어 보여줍니다.</div>'}
const renderAnalysisV8=renderAnalysis__impl1;
__impl_renderAnalysis=renderAnalysis__impl2;
function renderAnalysis__impl2(){renderAnalysisV8();renderWeeklyCommand();renderReadiness();renderErrorPatterns()};

const renderConditionV8=renderCondition__impl1;
__impl_renderCondition=renderCondition__impl2;
function renderCondition__impl2(){renderConditionV8();const d=$('#conditionDate').value||viewDate,c=DB.condition[d]||{},g=sleepBoundary(d);if($('#exerciseMinutes'))$('#exerciseMinutes').value=c.exerciseMinutes??'';if($('#exerciseIntensity'))$('#exerciseIntensity').value=c.exerciseIntensity||'';if($('#urgencyScore'))$('#urgencyScore').value=c.urgency??'';const box=$('#conditionGuardSummary');if(box)box.innerHTML=`<b>${g.status==='ok'?'수면 경계 준수':g.status==='violation'?'수면 경계 위반 기록':'수면 경계 기록 필요'}</b><span>${g.weekend?'주말 기상 목표 미정 · ':''}${g.sleep!=null?`실제 수면 ${minuteLabel(g.sleep)}`:'실제 수면시간 미계산'}</span>`};
const saveConditionV8=saveCondition__impl1;
__impl_saveCondition=saveCondition__impl2;
function saveCondition__impl2(){const d=$('#conditionDate').value;saveConditionV8();DB.condition[d]={...(DB.condition[d]||{}),exerciseMinutes:Number($('#exerciseMinutes')?.value)||0,exerciseIntensity:$('#exerciseIntensity')?.value||'',urgency:$('#urgencyScore')?.value??''};saveDB();renderCondition();if(d===viewDate)renderDashboard()};

const openLectureModalV8=openLectureModal__impl1;
__impl_openLectureModal=openLectureModal__impl2;
function openLectureModal__impl2(){openLectureModalV8();if($('#lectureMinutesLow'))$('#lectureMinutesLow').value='';if($('#lectureMinutesHigh'))$('#lectureMinutesHigh').value='';if($('#newMaterialGuard'))$('#newMaterialGuard').textContent='시간을 입력하면 10월 16일 계획에 미치는 영향을 계산합니다.'};
function updateNewMaterialGuard(){const total=Number($('#lectureTotal')?.value)||0,low=Number($('#lectureMinutesLow')?.value)||0,high=Number($('#lectureMinutesHigh')?.value)||low,box=$('#newMaterialGuard');if(!box)return;if(!total||!low){box.textContent='전체 강의 수와 1강 최소 시간을 입력하면 마감 영향이 계산됩니다.';return}const load=curriculumLoadV90(viewDate),addLow=total*low/60,addHigh=total*high/60,cap=load.capacity.totalHours,afterHigh=load.high/60+addHigh;box.innerHTML=`추가 필요량 <b>${addLow.toFixed(1)}–${addHigh.toFixed(1)}h</b> · 현재 남은 가용 ${cap.toFixed(1)}h · 추가 후 상한 사용률 <b>${cap?Math.round(afterHigh/cap*100):0}%</b>`}
__impl_saveLectureModal=saveLectureModal__impl2;
function saveLectureModal__impl2(){const name=$('#lectureName').value.trim(),provider=$('#lectureProvider').value.trim(),total=Number($('#lectureTotal').value);if(!name||!provider||!Number.isInteger(total)||total<1){alert('강사·강좌명·전체 강의 수를 확인하세요.');return}const low=$('#lectureMinutesLow')?.value,high=$('#lectureMinutesHigh')?.value,key='custom-'+uid();DB.customLectures.push({key,subject:$('#lectureSubject').value,provider,series:$('#lectureSubject').value,name,display:name,total,custom:true});DB.courseMeta[key]={minutesPerUnitLow:low===''?null:Number(low),minutesPerUnitHigh:high===''?null:Number(high||low),targetDate:deadlineDate(),included:true,mastery:{}};saveDB();hideModal('lectureModal');renderVending();renderProgress()};

function convertYeoksangBackup(raw){
 const d=defaultDB();d.settings={...d.settings,curriculumDeadline:raw.settings?.curriculumDeadline||CURRICULUM_CLOSE,weekdayCapacityHours:Number(raw.settings?.weekdayCapacityHours)||10,weekendCapacityHours:Number(raw.settings?.weekendCapacityHours)||14,capacityOverrides:deep(raw.settings?.capacityOverrides||{}),zeroCapacityDates:deep(raw.settings?.zeroCapacityDates||['2026-10-07','2026-10-08']),holidayStudyDates:deep(raw.settings?.holidayStudyDates||[]),automationEnabled:false,studyCutoff:''};d.courseMeta={};d.curriculumExtra=[];d.constraints=deep(raw.constraints||[]);d.subjectProtocols={};d.weeklyNotes={};
 for(const item of raw.curriculum||[]){d.courseMeta[item.id]={minutesPerUnitLow:item.minutesPerUnitLow??item.minutesLow??null,minutesPerUnitHigh:item.minutesPerUnitHigh??item.minutesHigh??item.minutesPerUnitLow??item.minutesLow??null,targetDate:item.targetDate||d.settings.curriculumDeadline,included:item.included!==false,note:item.completionRule||item.note||'',mastery:{}};const c=BUILTIN_LECTURES.find(x=>x.key===item.id);if(c){for(let n=1;n<=Math.min(c.total,Number(item.completedUnits)||0);n++)d.lectureState[lectureRef(c.key,n)]={completed:true}}else d.curriculumExtra.push(deep(item))}
 for(const t of raw.tasks||[]){const date=t.scheduledDate||t.committedDate;if(!date)continue;const task=normalizeImportedTask({id:t.id||uid(),subject:t.subject||'기타',priority:t.priority||'should',name:t.title||t.name||'할 일',material:t.material||'',note:t.note||'',minutes:Number(t.plannedMinutes)||0,done:t.status==='done',components:[{id:uid(),kind:'manual',label:t.title||t.name||'할 일',done:t.status==='done'}]});(d.tasks[date]||(d.tasks[date]=[])).push(task)}
 for(const c of raw.conditions||[]){d.condition[c.date]={bed:c.bedtime||'',wake:c.wakeTime||'',quality:c.sleepQuality??'',fatigue:c.morningFatigue??'',dailyFocus:c.focus??'',focus:c.focus??'',headache:c.headache??'',caffeine:c.caffeine??0,overall:c.overall==1?'낮음':c.overall==3?'좋음':c.overall?String(c.overall):'',memo:c.memo||''}}
 for(const ex of raw.exams||[]){for(const r of ex.results||[]){const wrong=(r.wrong||[]).join(', '),unc=(r.uncertain||[]).join(', '),ab=(r.abandoned||[]).join(', '),source=String(ex.suggestedSource||ex.source||'기타');const map={'모평':'평가원 모의평가','학평':'교육청 학력평가','수능':'수능','사설':'사설 모의고사','학교':'학교 모의고사','실모':'단원·과목 실모'};d.tests.push(normalizeTestRecord({id:`${ex.id}-${r.subject}`,kind:'single',source:map[source]||TEST_SOURCES.includes(source)&&source||'기타',scope:ex.scope||'full',date:ex.date,name:ex.name,subject:r.subject,score:Number(r.score)||0,grade:Number(r.grade)||0,minutes:Number(r.minutes)||0,wrongCount:(r.wrong||[]).length,wrongQuestions:wrong,uncertainQuestions:unc,abandonedQuestions:ab,memo:ex.memo||''}))}}
 for(const qa of raw.questionAnalyses||[]){const test=d.tests.find(t=>t.date===qa.examDate&&t.subject===qa.subject);if(!test)continue;let q=(test.questionRecords||[]).find(x=>x.number===Number(qa.questionNumber));if(!q){q=normalizeQuestionRecord({subject:qa.subject,number:Number(qa.questionNumber),status:qa.status==='uncertain'?'uncertain':'wrong',retryDue:qa.dueDate||addDays(qa.examDate,1)},{subject:qa.subject});if(q)test.questionRecords.push(q)}if(q){q.rootCause=qa.rootHypothesis||'';q.controlRule=qa.prevention||'';q.note=qa.directCause||q.note;q.pattern=ERROR_PATTERNS.includes(qa.category)?qa.category:'';q.retryState=qa.stage==='stable'?'resolved':'pending'}}
 return migrateDB(d)
}
__impl_validateBackupObject=validateBackupObject__impl2;
function validateBackupObject__impl2(d){return Boolean(d&&typeof d==='object'&&!Array.isArray(d)&&((d.tasks&&typeof d.tasks==='object'&&d.settings)||(d.app?.name==='曆象'&&Array.isArray(d.curriculum))))};
__impl_importData=importData__impl2;
function importData__impl2(file){const r=new FileReader();r.onload=()=>{try{const raw=JSON.parse(r.result);if(!validateBackupObject(raw))throw new Error('invalid');if(!confirm('현재 기록을 가져온 백업으로 교체할까요? 복원 직전 상태는 안전 스냅샷으로 남깁니다.'))return;safeSetItem('p11122_pre_import_backup',JSON.stringify(DB),{silent:true});const next=raw.app?.name==='曆象'?convertYeoksangBackup(raw):migrateDB(raw),json=JSON.stringify(next);if(!safeSetItem(DB_KEY,json))throw new Error('save');DB=next;ensureV90DB();LAST_SAVED_JSON=JSON.stringify(DB);viewDate=todayDate();weekViewStart=mondayOf(viewDate);displayMonth=viewDate.slice(0,7);alert(raw.app?.name==='曆象'?'曆象 백업을 현재 실행 구조로 변환해 복원했습니다.':'曆象 백업을 복원했습니다.');navigate('dashboard')}catch(e){console.error(e);alert('지원하는 曆象 호환 JSON 백업인지 확인하세요.')}};r.readAsText(file)};

const renderSettingsV8=renderSettings__impl1;
__impl_renderSettings=renderSettings__impl2;
function renderSettings__impl2(){renderSettingsV8();$('#curriculumDeadlineSetting').value=deadlineDate();$('#weekdayCapacitySetting').value=DB.settings.weekdayCapacityHours??10;$('#weekendCapacitySetting').value=DB.settings.weekendCapacityHours??14;$('#studyCutoffSetting').value=DB.settings.studyCutoff||'';$('#automationEnabledSetting').checked=DB.settings.automationEnabled===true;$('#diagnosticResult .muted')?.insertAdjacentHTML('beforeend','<br>v9 검사는 수면 경계·과정 필요량·시험 규칙 데이터도 함께 확인합니다.')};

const runDiagnosticsV8=runDiagnostics__impl1;
__impl_runDiagnostics=runDiagnostics__impl2;
function runDiagnostics__impl2(){runDiagnosticsV8();const box=$('#diagnosticResult');const extra=[];Object.entries(DB.courseMeta||{}).forEach(([id,m])=>{if(m.included!==false&&(m.minutesPerUnitLow==null&&m.minutesLow==null))extra.push(`필요량 시간 미입력: ${courseRowInfo(id)?.name||id}`)});for(const d of Object.keys(DB.schedules||{})){for(const b of ensureSchedule(d)){if(studyBlockViolatesSleep(b))extra.push(`수면 경계 뒤 자습 블록: ${d} ${b.name} ${b.end}`)}}if(extra.length)box.insertAdjacentHTML('beforeend',`<hr><b>v9 추가 점검 ${extra.length}개</b><ul class="diagnostic-list">${extra.slice(0,50).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`)};

const bindEventsV8=bindEvents__impl1;
__impl_bindEvents=bindEvents__impl2;
function bindEvents__impl2(){bindEventsV8();$('#saveCourseMeta').onclick=saveCourseMeta;$('#editProtocolBtn').onclick=()=>openProtocolModal();$('#protocolSubject').onchange=loadProtocolForm;$('#saveProtocol').onclick=saveProtocol;$('#saveWeeklyCommand').onclick=saveWeeklyCommand;if($('#openWaitingInline'))$('#openWaitingInline').onclick=()=>{renderWaiting();showModal('waitingModal')};['#lectureTotal','#lectureMinutesLow','#lectureMinutesHigh'].forEach(s=>$(s)?.addEventListener('input',updateNewMaterialGuard));const old=$('#saveSettings').onclick;$('#saveSettings').onclick=()=>{DB.settings.lectureDailyCap=Number($('#lectureDailyCap').value)||5;DB.settings.curriculumDeadline=$('#curriculumDeadlineSetting').value||CURRICULUM_CLOSE;DB.settings.weekdayCapacityHours=Math.max(0,Number($('#weekdayCapacitySetting').value)||10);DB.settings.weekendCapacityHours=Math.max(0,Number($('#weekendCapacitySetting').value)||14);DB.settings.studyCutoff=$('#studyCutoffSetting').value||'';DB.settings.automationEnabled=$('#automationEnabledSetting').checked;saveDB();alert('설정을 저장했습니다. 수면 경계는 계획보다 우선합니다.');renderSettings()}}

__impl_renderVersionStatus=renderVersionStatus__impl2;
function renderVersionStatus__impl2(){$('#runtimeStatus').textContent=`${APP_VERSION} · SW ${APP_VERSION}`};
__impl_initPwaUpdate=initPwaUpdate__impl2;
function initPwaUpdate__impl2(){if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw-v110.js?v=1100').then(reg=>{reg.update().catch(()=>{});reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)$('#updateBanner')?.classList.remove('hidden')})})}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>$('#updateBanner')?.classList.remove('hidden'));const btn=$('#reloadUpdate');if(btn)btn.onclick=()=>location.reload()};
