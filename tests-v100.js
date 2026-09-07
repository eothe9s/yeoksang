const fs=require('fs'),vm=require('vm'),assert=require('assert');
const store=new Map();
const dummy=()=>({value:'',checked:false,textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){}},style:{},addEventListener(){},closest(){return this}});
const ctx={console,crypto:require('crypto').webcrypto,structuredClone:global.structuredClone,Blob:global.Blob,URL:global.URL,
 localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),key:i=>[...store.keys()][i]??null,get length(){return store.size}},
 document:{querySelector:()=>dummy(),querySelectorAll:()=>[],addEventListener(){},createElement:()=>dummy()},navigator:{},location:{reload(){}},alert(){},confirm(){return true},prompt(){return null},setTimeout,clearTimeout,FileReader:function(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/app-v100-core.js','utf8'),ctx);vm.runInContext(fs.readFileSync(__dirname+'/app-v100-engine.js','utf8'),ctx);
function exec(code){return vm.runInContext('(()=>{'+code+'})()',ctx)}
function val(code){return vm.runInContext(code,ctx)}
function plain(x){return JSON.parse(JSON.stringify(x))}
function reset(){exec(`DB=defaultDB();DB.schema=SCHEMA_VERSION;LAST_SAVED_JSON=JSON.stringify(DB);`);store.clear()}
function test(name,fn){try{reset();fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e);process.exitCode=1}}

test('future date does not execute automation',()=>{
 exec(`const d=addDays(todayDate(),1),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out={tasks:(DB.tasks[d]||[]).length,conf:DB.automationConflicts.length,runs:Object.keys(DB.automationRuns).length}`);
 assert.deepStrictEqual(plain(val('out')),{tasks:0,conf:0,runs:0});
});
test('automation is idempotent',()=>{
 exec(`const d=todayDate(),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);runAutomationForDate(d);globalThis.out=(DB.tasks[d]||[]).filter(t=>t.automationRuleId==='r1').length`);assert.equal(plain(val('out')),1);
});
test('automation run key recorded',()=>{
 exec(`const d=todayDate(),wd=parseDate(d).getDay();DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:d,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out=DB.automationRuns[automationRunKey('r1',d)]?.status`);assert.equal(plain(val('out')),'task');
});
test('waiting lecture avoids duplicate generation',()=>{
 exec(`const d=todayDate();DB.waiting=[normalizeImportedTask({id:'w',subject:'경제',name:'CORE 1강',components:[{id:'c',kind:'lecture',ref:lectureRef('eco-core',1),label:'01강',done:false}]})];const r={id:'r',source:'lecture:eco-core',priority:'must'};globalThis.out=makeAutomationProposal(r,d).components[0].ref`);assert.equal(plain(val('out')),'eco-core::2');
});
test('real-day unfinished creates conflict',()=>{
 exec(`const d=todayDate(),prev=addDays(d,-2),wd=parseDate(d).getDay();DB.tasks[prev]=[normalizeImportedTask({id:'old',subject:'경제',name:'CORE 1강',automationRuleId:'r1',components:[{id:'x',kind:'lecture',ref:'eco-core::1',label:'01강',done:false}]})];DB.automations=[{id:'r1',source:'lecture:eco-core',weekdays:[wd],start:prev,end:d,priority:'must',enabled:true}];runAutomationForDate(d);globalThis.out=DB.automationConflicts.length`);assert.equal(plain(val('out')),1);
});
test('true merge keeps previous and today components',()=>{
 exec(`const a=normalizeImportedTask({subject:'경제',name:'CORE 3강',minutes:30,components:[{id:'a',kind:'lecture',ref:'eco-core::3',label:'03강',done:false}]});const b=normalizeImportedTask({subject:'경제',name:'CORE 4강',minutes:30,automationRuleId:'r',autoKey:'k',components:[{id:'b',kind:'lecture',ref:'eco-core::4',label:'04강',done:false}]});const m=mergedAutomationTask(a,b);globalThis.out={n:m.components.length,name:m.name,min:m.minutes}`);assert.deepStrictEqual(plain(val('out')),{n:2,name:'CORE 3~4강',min:60});
});
test('timetable completion does not complete task',()=>{
 exec(`const d=todayDate();DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];DB.schedules[d]=[{id:'b1',name:'자습',type:'self',selfStudy:true,device:true,start:'18:00',end:'19:00',taskIds:['t1'],done:false}];setBlockDone(d,'b1',true);globalThis.out={b:DB.schedules[d].find(x=>x.id==='b1')?.done,t:DB.tasks[d][0].done}`);assert.deepStrictEqual(plain(val('out')),{b:true,t:false});
});
test('task completion does not complete timetable',()=>{
 exec(`const d=todayDate();DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];DB.schedules[d]=[{id:'b1',name:'자습',type:'self',selfStudy:true,device:true,start:'18:00',end:'19:00',taskIds:['t1'],done:false}];setTaskDoneInternal(d,'t1',true);globalThis.out={b:DB.schedules[d].find(x=>x.id==='b1')?.done,t:DB.tasks[d][0].done}`);assert.deepStrictEqual(plain(val('out')),{b:false,t:true});
});
test('sleep 23:30 to 06:40 = 430 minutes',()=>assert.equal(val(`sleepMinutes('23:30','06:40')`),430));
test('sleep session maps D-1 bed and D wake',()=>{
 exec(`const d='2026-08-11';planMeta('2026-08-10').bed='23:30';planMeta(d).wake='06:40';globalThis.out=sleepSession(d)`);assert.deepStrictEqual(plain(val('out')),{bed:'23:30',wake:'06:40'});
});
test('1~3 lectures count as 3 units',()=>{
 exec(`const t=normalizeImportedTask({subject:'국어',name:'1~3강',components:[1,2,3].map(n=>({id:String(n),kind:'lecture',ref:'kor-origin::'+n,label:n+'강',done:n<3}))});globalThis.out=todayUnitState([t])`);assert.deepStrictEqual(plain(val('out')),{total:3,done:2});
});
test('Friday English mock replaces period 5 only',()=>{
 exec(`DB.settings.periodTimes[4]={start:'11:40',end:'12:30'};DB.settings.periodTimes[5]={start:'13:30',end:'14:20'};const b=baseSchedule('2026-08-14');globalThis.out={mock:b.find(x=>x.id.endsWith('english-mock'))?.end,p4:!!b.find(x=>x.period===4),p5:!!b.find(x=>x.period===5)}`);assert.deepStrictEqual(plain(val('out')),{mock:'14:20',p4:true,p5:false});
});
test('overlap detection',()=>assert.equal(val(`blocksOverlap({start:'18:00',end:'19:00'},{start:'18:30',end:'19:30'})`),true));
test('schema 8 migrates to 11 and infers automation run',()=>{
 exec(`const d=todayDate(),old={...defaultDB(),schema:8};old.tasks[d]=[normalizeImportedTask({id:'a',subject:'경제',name:'CORE',automationRuleId:'r',components:[{id:'c',kind:'manual',label:'x',done:false}]})];const m=migrateDB(old);globalThis.out={schema:m.schema,run:m.automationRuns[automationRunKey('r',d)]?.status}`);assert.deepStrictEqual(plain(val('out')),{schema:13,run:'task'});
});
test('year boundary',()=>assert.equal(val(`addDays('2026-12-31',1)`),'2027-01-01'));
test('midnight duration',()=>assert.equal(val(`durationMin('23:50','00:20')`),30));
test('backup validation',()=>{assert.equal(val(`validateBackupObject(defaultDB())`),true);assert.equal(val(`validateBackupObject({foo:1})`),false)});


test('fixed block can be hidden on one date only',()=>{
 exec(`const d='2026-08-17',other='2026-08-18',b=ensureSchedule(d).find(x=>x.baseKey==='night2');DB.scheduleHidden[d]=[b.baseKey];DB.schedules[d]=ensureSchedule(d).filter(x=>x.id!==b.id);globalThis.out={d:!!ensureSchedule(d).find(x=>x.baseKey==='night2'),other:!!ensureSchedule(other).find(x=>x.baseKey==='night2')}`);assert.deepStrictEqual(plain(val('out')),{d:false,other:true});
});
test('restoring hidden fixed block restores only structure',()=>{
 exec(`const d='2026-08-17',b=ensureSchedule(d).find(x=>x.baseKey==='night2');DB.scheduleHidden[d]=[b.baseKey];DB.schedules[d]=ensureSchedule(d).filter(x=>x.id!==b.id);restoreDeletedFixedBlocks(d);globalThis.out=!!ensureSchedule(d).find(x=>x.baseKey==='night2')`);assert.equal(plain(val('out')),true);
});
test('Saturday bell mode has six blocks',()=>{
 exec(`const d='2026-08-17';DB.scheduleModes[d]={mode:'saturday',templateId:null};DB.schedules[d]=[];globalThis.out=ensureSchedule(d).map(x=>x.baseKey)`);assert.deepStrictEqual(plain(val('out')),['sat1','sat2','sat3','sat4','sat5','sat6']);
});
test('school off mode has no base blocks',()=>{
 exec(`const d='2026-08-17';DB.scheduleModes[d]={mode:'off',templateId:null};DB.schedules[d]=[];globalThis.out=ensureSchedule(d).length`);assert.equal(plain(val('out')),0);
});
test('saved timetable template applies to one date',()=>{
 exec(`const d='2026-08-17',other='2026-08-18',t=createScheduleTemplate('야자 없음',[{name:'아침 자습',type:'self',selfStudy:true,device:false,start:'07:50',end:'08:30',locked:false}]);DB.scheduleModes[d]={mode:'template',templateId:t.id};DB.schedules[d]=[];globalThis.out={d:ensureSchedule(d).map(x=>x.name),other:ensureSchedule(other).length}`);const o=plain(val('out'));assert.deepStrictEqual(o.d,['아침 자습']);assert.ok(o.other>1);
});
test('changing schedule mode keeps tasks but clears timetable assignment',()=>{
 exec(`const d='2026-08-17';DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'경제',name:'CORE',components:[{id:'c',kind:'manual',label:'x',done:false}]})];let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];DB.schedules[d]=ensureSchedule(d);setDayScheduleMode(d,'off',null,{confirmChange:false});globalThis.out={tasks:DB.tasks[d].length,blocks:ensureSchedule(d).length}`);assert.deepStrictEqual(plain(val('out')),{tasks:1,blocks:0});
});
test('template snapshot strips task state',()=>{
 exec(`const d='2026-08-17';let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];b.done=true;b.actualMin=40;const x=scheduleTemplateBlocksFromDate(d).find(x=>x.name==='야간자율학습 1');globalThis.out={keys:Object.keys(x).sort(),hasTask:'taskIds' in x,hasDone:'done' in x}`);const o=plain(val('out'));assert.equal(o.hasTask,false);assert.equal(o.hasDone,false);
});

test('moving unfinished work to waiting preserves that day completion',()=>{
 exec(`const d=todayDate();DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'기출',components:[{id:'c1',kind:'manual',label:'기출',done:false}]})];moveTaskToWaiting(d,'t1');globalThis.out={waiting:DB.waiting.length,left:(DB.tasks[d]||[]).length,status:dailyCompletion(d)}`);
 const o=plain(val('out'));assert.equal(o.waiting,1);assert.equal(o.left,0);assert.deepStrictEqual(o.status,{state:'live',total:1,done:0,rate:0,carried:0,waiting:1,skipped:0});
});
test('carry preserves partial lecture completion',()=>{
 exec(`const d=todayDate(),t=normalizeImportedTask({id:'old',subject:'국어',name:'강의',components:[{id:'a',kind:'lecture',ref:'kor-origin::1',label:'1강',done:true},{id:'b',kind:'lecture',ref:'kor-origin::2',label:'2강',done:false}]});const x=carryTaskToDate(t,addDays(d,1));globalThis.out={newId:x.id!==t.id,done:x.done,parts:x.components.map(c=>c.done)}`);
 assert.deepStrictEqual(plain(val('out')),{newId:true,done:false,parts:[true,false]});
});
test('future plans are excluded from completion statistics',()=>{
 exec(`const d=todayDate(),f=addDays(d,1);DB.tasks[d]=[normalizeImportedTask({id:'now',subject:'국어',name:'오늘',done:true})];DB.tasks[f]=[normalizeImportedTask({id:'later',subject:'국어',name:'내일',done:false})];globalThis.out=statsForDates([d,f])`);
 const o=plain(val('out'));assert.equal(o.total,1);assert.equal(o.done,1);
});
test('full mock exam keeps type and all subject results',()=>{
 exec(`const t=normalizeTestRecord({id:'m1',kind:'full',source:'평가원 모의평가',round:'9월',date:'2026-09-02',name:'9월 모의평가',scores:{국어:96,수학:92,영어:90,사회문화:44,경제:43},grades:{국어:1,수학:1,영어:1,사회문화:2,경제:2},wrongs:{국어:1,수학:2,영어:0,사회문화:3,경제:4}});DB.tests=[t];globalThis.out={rows:testSubjectRows(t).map(x=>[x.subject,x.grade,x.wrong]),latest:latestGrades()}`);
 const o=plain(val('out'));assert.deepStrictEqual(o.rows,[['국어',1,1],['수학',1,2],['영어',1,0],['사회문화',2,3],['경제',2,4]]);assert.equal(o.latest.경제.source,'평가원 모의평가');
});
test('schema 9 test records migrate without losing grades',()=>{
 exec(`const old={...defaultDB(),schema:9,tests:[{id:'old-test',kind:'full',date:'2026-06-04',name:'6월 모의평가',grades:{국어:1,수학:2,영어:1,사회문화:2,경제:2},scores:{국어:95}}]};const m=migrateDB(old);globalThis.out={schema:m.schema,source:m.tests[0].source,grade:m.tests[0].grades.경제,wrongType:typeof m.tests[0].wrongs}`);
 assert.deepStrictEqual(plain(val('out')),{schema:13,source:'기타',grade:2,wrongType:'object'});
});


test('hiding fixed block keeps task and removes assignment with block',()=>{
 exec(`const d='2026-08-17';DB.tasks[d]=[normalizeImportedTask({id:'t1',subject:'수학',name:'문제',components:[{id:'c',kind:'manual',label:'문제',done:false}]})];let b=ensureSchedule(d).find(x=>x.baseKey==='night1');b.taskIds=['t1'];DB.scheduleHidden[d]=['night1'];DB.schedules[d]=ensureSchedule(d).filter(x=>x.baseKey!=='night1');globalThis.out={task:DB.tasks[d].length,links:ensureSchedule(d).flatMap(x=>x.taskIds||[]).filter(x=>x==='t1').length}`);assert.deepStrictEqual(plain(val('out')),{task:1,links:0});
});
test('deleting used template returns its dates to default',()=>{
 exec(`const d='2026-08-17',t=createScheduleTemplate('T',[{name:'X',type:'self',selfStudy:true,device:false,start:'08:00',end:'09:00'}]);DB.scheduleModes[d]={mode:'template',templateId:t.id};DB.schedules[d]=[];deleteScheduleTemplate(t.id);globalThis.out={mode:scheduleModeFor(d).mode,hasX:ensureSchedule(d).some(x=>x.name==='X'),count:ensureSchedule(d).length}`);const o=plain(val('out'));assert.equal(o.mode,'default');assert.equal(o.hasX,false);assert.ok(o.count>1);
});

test('question numbers become D+1 reattempt records',()=>{
 exec(`const t=normalizeTestRecord({id:'q1',kind:'single',source:'단원·과목 실모',scope:'unit',date:'2026-08-20',subject:'경제',wrongQuestions:'3, 7, 14',uncertainQuestions:'5, 7'});globalThis.out=t.questionRecords.map(q=>[q.number,q.status,q.retryDue,q.retryState])`);
 assert.deepStrictEqual(plain(val('out')),[[3,'wrong','2026-08-21','pending'],[5,'uncertain','2026-08-21','pending'],[7,'wrong','2026-08-21','pending'],[14,'wrong','2026-08-21','pending']]);
});
test('full mock keeps time and question maps by subject',()=>{
 exec(`const t=normalizeTestRecord({id:'q2',kind:'full',date:'2026-08-20',scores:{경제:44},grades:{경제:2},wrongs:{경제:2},minutes:{경제:29},wrongQuestionMap:{경제:'4, 18'},uncertainQuestionMap:{경제:'6'}});const r=testSubjectRows(t).find(x=>x.subject==='경제');globalThis.out={minutes:r.minutes,wrong:r.wrong,wrongQuestions:r.wrongQuestions,uncertain:r.uncertainQuestions}`);
 assert.deepStrictEqual(plain(val('out')),{minutes:29,wrong:2,wrongQuestions:[4,18],uncertain:[6]});
});
test('unit test does not replace representative full-test grade',()=>{
 exec(`DB.tests=[normalizeTestRecord({id:'full',kind:'single',scope:'full',source:'평가원 모의평가',date:'2026-08-01',subject:'수학',score:92,grade:1}),normalizeTestRecord({id:'unit',kind:'single',scope:'unit',source:'단원·과목 실모',date:'2026-08-20',subject:'수학',score:61,grade:4})];globalThis.out={latest:latestGrades().수학.grade,rep:latestRepresentative('수학').test.id,all:subjectHistory('수학',{scope:'all'}).map(x=>x.test.id)}`);
 assert.deepStrictEqual(plain(val('out')),{latest:1,rep:'full',all:['full','unit']});
});
test('question pattern uses comparable test rate',()=>{
 exec(`DB.tests=[normalizeTestRecord({id:'a',kind:'single',scope:'full',date:'2026-08-01',subject:'경제',score:45,wrongQuestions:'20'}),normalizeTestRecord({id:'b',kind:'single',scope:'full',date:'2026-08-08',subject:'경제',score:44,wrongQuestions:'20'}),normalizeTestRecord({id:'c',kind:'single',scope:'full',date:'2026-08-15',subject:'경제',score:46,wrongQuestions:'5'})];const p=questionPattern('경제',{scope:'representative'}),q=p.stats.get(20);globalThis.out={attempts:p.attempts,wrong:q.wrongTestIds.size,uncertain:q.uncertainTestIds.size}`);
 assert.deepStrictEqual(plain(val('out')),{attempts:3,wrong:2,uncertain:0});
});
test('resolved review leaves the pending queue',()=>{
 exec(`const t=normalizeTestRecord({id:'r1',kind:'single',scope:'full',date:'2026-08-20',subject:'국어',wrongQuestions:'12'});DB.tests=[t];const q=t.questionRecords[0];q.retryState='resolved';globalThis.out=reviewEntries({subject:'국어'}).length`);
 assert.equal(plain(val('out')),0);
});
test('schema 10 migrates question strings to records',()=>{
 exec(`const old={...defaultDB(),schema:10,tests:[{id:'old-question',kind:'single',date:'2026-08-20',subject:'경제',wrongQuestions:'2, 9',uncertainQuestions:'4'}]};const m=migrateDB(old);globalThis.out={schema:m.schema,questions:m.tests[0].questionRecords.map(q=>[q.number,q.status])}`);
 assert.deepStrictEqual(plain(val('out')),{schema:13,questions:[[2,'wrong'],[4,'uncertain'],[9,'wrong']]});
});
test('score analysis renderer builds chart and question grid',()=>{
 exec(`const els={};function el(value=''){return{value,checked:false,textContent:'',innerHTML:'',style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){},closest(){return this}}}document.querySelector=s=>{if(!els[s])els[s]=el(s==='#analysisSubjectFilter'?'경제':s==='#analysisScopeFilter'?'representative':'all');return els[s]};document.querySelectorAll=()=>[];DB.tests=[normalizeTestRecord({id:'a',kind:'single',scope:'full',date:'2026-08-01',subject:'경제',score:42,grade:2,wrongQuestions:'20'}),normalizeTestRecord({id:'b',kind:'single',scope:'full',date:'2026-08-08',subject:'경제',score:45,grade:2,wrongQuestions:'20'}),normalizeTestRecord({id:'c',kind:'single',scope:'full',date:'2026-08-15',subject:'경제',score:47,grade:1,wrongQuestions:'5, 20'})];renderTests();globalThis.out={chart:els['#rawScoreChart'].innerHTML.includes('score-path'),grid:els['#questionNumberGrid'].innerHTML.includes('question-cell'),title:els['#scoreAnalysisTitle'].textContent}`);
 assert.deepStrictEqual(plain(val('out')),{chart:true,grid:true,title:'경제 성적 흐름'});
});

if(!process.exitCode)console.log('ALL CORE TESTS PASSED');


// v9 pure guards
try{
 test('v9 sleep boundary keeps weekend wake target open',()=>{exec(`ensureV90DB();DB.condition['2026-09-12']={bed:'22:40',wake:''};globalThis.out=sleepBoundary('2026-09-12')`);const o=plain(val('out'));assert.equal(o.weekend,true);assert.equal(o.wakeOk,null);assert.equal(o.status,'ok')});
 test('v9 weekday sleep requires wake before 06:30',()=>{exec(`ensureV90DB();DB.condition['2026-09-14']={bed:'22:50',wake:'06:35'};globalThis.out=sleepBoundary('2026-09-14').status`);assert.equal(plain(val('out')),'violation')});
 test('v9 curriculum load does not invent minutes for unknown courses',()=>{exec(`ensureV90DB();DB.customLectures=[{key:'u1',subject:'수학',provider:'X',series:'X',name:'X',display:'X',total:10,custom:true}];DB.lectureState={};DB.courseMeta={};globalThis.out=curriculumLoadV90('2026-09-07').unknown.some(x=>x.id==='u1')`);assert.equal(plain(val('out')),true)});
 test('v9 self study cannot extend beyond sleep cutoff',()=>{exec(`ensureV90DB();DB.settings.studyCutoff='22:40';globalThis.out=studyBlockViolatesSleep({selfStudy:true,start:'22:00',end:'22:50'})`);assert.equal(plain(val('out')),true)});
}catch(e){console.error(e);process.exitCode=1}

// v10 closed-loop engine tests
try{
 test('v10 stage after 9mo is October mock, then CSAT',()=>{exec(`globalThis.out={a:activeStage('2026-09-07'),b:activeStage('2026-10-20'),c:activeStage('2026-10-21')}`);const o=plain(val('out'));assert.equal(o.a.key,'oct');assert.equal(o.a.target,'2026-10-20');assert.equal(o.b.key,'oct');assert.equal(o.c.key,'csat');assert.equal(o.c.target,'2026-11-19')});
 test('v10 Saturday capacity subtracts school mock from actual timetable',()=>{exec(`ensureV100DB();DB.settings.capacityMode='schedule';DB.scheduleModes['2026-09-12']={mode:'saturday',templateId:null};DB.schedules['2026-09-12']=[];globalThis.out={h:capacityHoursFor('2026-09-12'),names:capacityScheduleSnapshotV10('2026-09-12').map(x=>x.name)}`);const o=plain(val('out'));assert.ok(Math.abs(o.h-290/60)<1e-9);assert.ok(o.names.includes('학교 실모'));});
 test('v10 Monday gym removes overlapping evening study capacity',()=>{exec(`ensureV100DB();for(let p=1;p<=7;p++)DB.settings.periodTimes[p]={start:String(8+Math.floor((p-1)*50/60)).padStart(2,'0')+':'+String(((p-1)*50)%60).padStart(2,'0'),end:''};DB.settings.periodTimes={1:{start:'08:40',end:'09:30'},2:{start:'09:40',end:'10:30'},3:{start:'10:40',end:'11:30'},4:{start:'11:40',end:'12:30'},5:{start:'13:30',end:'14:20'},6:{start:'14:30',end:'15:20'},7:{start:'15:30',end:'16:20'}};DB.schedules['2026-09-07']=[];globalThis.out=capacityScheduleSnapshotV10('2026-09-07')`);const rows=plain(val('out'));assert.ok(rows.some(x=>x.name==='체대입시학원'));assert.equal(rows.filter(x=>x.selfStudy).some(x=>x.start<'21:30'&&x.end>'19:00'),false)});
 test('v10 course target date is used independently',()=>{exec(`ensureV100DB();DB.settings.capacityMode='manual';DB.settings.weekdayCapacityHours=10;DB.settings.weekendCapacityHours=10;DB.customLectures=[{key:'deadline-course',subject:'수학',provider:'X',series:'X',name:'D',display:'D',total:10,custom:true}];DB.lectureState={};DB.courseMeta={'deadline-course':{minutesPerUnitLow:10,minutesPerUnitHigh:10,targetDate:'2026-09-07',included:true,mastery:{}}};globalThis.out=coursePlanV10(curriculumRowsV90().find(x=>x.id==='deadline-course'),'2026-09-07')`);const o=plain(val('out'));assert.equal(o.target,'2026-09-07');assert.equal(Math.round(o.todayLow),100)});
 test('v10 auto placement spans enough blocks for a long task',()=>{exec(`ensureV100DB();const d='2026-09-15',tpl=createScheduleTemplate('two',[{name:'A',type:'self',selfStudy:true,device:true,start:'18:00',end:'18:30'},{name:'B',type:'self',selfStudy:true,device:true,start:'18:30',end:'19:00'}]);DB.scheduleModes[d]={mode:'template',templateId:tpl.id};DB.schedules[d]=[];DB.tasks[d]=[];const t=addTask(d,{subject:'수학',priority:'must',name:'50분',minutes:50,components:[{id:'m',kind:'manual',label:'50분',done:false}]});autoPlaceTasks(d,[t]);globalThis.out=ensureSchedule(d).filter(b=>(b.taskIds||[]).includes(t.id)).length`);assert.equal(plain(val('out')),2)});
 test('v10 weekly priority affects the next week only',()=>{exec(`ensureV100DB();DB.weeklyNotes['2026-09-07']={p1:'경제 집중',p2:'',p3:'',stop:''};globalThis.out={same:weeklySubjectBoostV10('경제','2026-09-10').score,next:weeklySubjectBoostV10('경제','2026-09-14').score}`);assert.deepStrictEqual(plain(val('out')),{same:0,next:3})});
 test('v10 unfinished should-task defaults to spread instead of tomorrow pile-up',()=>{exec(`ensureV100DB();const t=normalizeImportedTask({subject:'국어',priority:'should',name:'복습',minutes:60,components:[{id:'a',kind:'manual',label:'x',done:false}]});globalThis.out=recommendUnfinishedActionV10(t,'2026-09-07')`);assert.equal(plain(val('out')),'spread')});
 test('v10 full mock preserves per-subject abandoned and choke maps',()=>{exec(`const t=normalizeTestRecord({kind:'full',date:'2026-09-02',scores:{수학:80},grades:{수학:2},wrongs:{수학:6},minutes:{수학:100},wrongQuestionMap:{수학:'15,21'},uncertainQuestionMap:{수학:''},abandonedQuestionMap:{수학:'27,28,29,30'},firstChokeMap:{수학:21},lastNormalMap:{수학:26},timeLeftMap:{수학:0}});globalThis.out={ab:t.abandonedQuestionMap.수학,choke:t.firstChokeMap.수학,last:t.lastNormalMap.수학}`);assert.deepStrictEqual(plain(val('out')),{ab:'27,28,29,30',choke:21,last:26})});
 test('v10 recent unresolved error pattern outweighs old one',()=>{exec(`DB.tests=[normalizeTestRecord({id:'old',kind:'single',scope:'full',date:'2026-07-01',subject:'경제',score:45,wrongQuestions:'1',questionRecords:[{subject:'경제',number:1,status:'wrong',pattern:'개념 부재',retryState:'pending'}]}),normalizeTestRecord({id:'new',kind:'single',scope:'full',date:'2026-09-05',subject:'경제',score:45,wrongQuestions:'2',questionRecords:[{subject:'경제',number:2,status:'wrong',pattern:'조건 오독',retryState:'pending'}]})];viewDate='2026-09-07';globalThis.out=errorPatternStats().map(x=>[x.pattern,x.weighted])`);const o=plain(val('out'));assert.equal(o[0][0],'조건 오독');assert.ok(o[0][1]>o[1][1])});
 test('v10 manual priority overrides automatic subject ordering',()=>{exec(`ensureV100DB();DB.planOverrides['2026-09-07']={subject:'영어',reason:'내 판단'};globalThis.out=decisionPlanV10('2026-09-07').rows[0].subject`);assert.equal(plain(val('out')),'영어')});
 test('v10 complete course can become auto close eligible with clean evidence',()=>{exec(`ensureV100DB();const d='2026-09-01';DB.customLectures=[{key:'done-course',subject:'경제',provider:'X',series:'X',name:'Done',display:'Done',total:2,custom:true}];DB.lectureState={'done-course::1':{completed:true},'done-course::2':{completed:true}};DB.tasks[d]=[normalizeImportedTask({id:'td',subject:'경제',name:'Done 1~2',done:true,components:[{id:'1',kind:'lecture',ref:'done-course::1',label:'1',done:true},{id:'2',kind:'lecture',ref:'done-course::2',label:'2',done:true}]})];DB.courseMeta={'done-course':{minutesPerUnitLow:20,minutesPerUnitHigh:20,targetDate:'2026-09-10',included:true,mastery:{}}};DB.tests=[normalizeTestRecord({id:'t1',kind:'single',scope:'full',source:'평가원 모의평가',date:'2026-09-02',subject:'경제',score:48,grade:1,wrongQuestions:''}),normalizeTestRecord({id:'t2',kind:'single',scope:'full',source:'교육청 학력평가',date:'2026-09-05',subject:'경제',score:50,grade:1,wrongQuestions:''})];globalThis.out=courseMasteryEvidenceV10(curriculumRowsV90().find(x=>x.id==='done-course'))`);const o=plain(val('out'));assert.equal(o.autoEligible,true);assert.equal(o.status,'종료 가능')});
 test('v10 fresh seed is privacy-minimized but current-plan aware',()=>{vm.runInContext(fs.readFileSync(__dirname+'/personal-seed-v100.js','utf8'),ctx);store.clear();exec(`globalThis.seeded=loadDB()`);const o=plain(val('seeded'));assert.equal(Object.keys(o.tasks).length,0);assert.equal((o.tests||[]).length,1);assert.ok((o.customLectures||[]).length>=4);assert.ok((o.curriculumExtra||[]).length>=10);assert.ok((o.diagnosticSignals||[]).some(x=>x.date==='2026-09-02'&&x.subject==='경제'))});
}catch(e){console.error(e);process.exitCode=1}

if(!process.exitCode)test('v10 hard fixed constraint replaces break blocks too',()=>{
 exec(`resetDBForTest=()=>{DB=defaultDB();ensureV100DB()};resetDBForTest();DB.schedules['2026-09-07']=baseScheduleV10Core('2026-09-07');const rows=ensureSchedule('2026-09-07'),gym=rows.find(b=>b.baseKey==='constraint-pe-mon');globalThis.out={has:!!gym,overlap:gym?rows.some(b=>b.id!==gym.id&&blocksOverlap(b,gym)):true}`);const o=plain(val('out'));assert.equal(o.has,true);assert.equal(o.overlap,false);
});
if(!process.exitCode)console.log('ALL V10 TESTS PASSED');

// v10.1 reference integration and safety tests
try{
 test('v10.1 ranged curriculum is calculated instead of hidden as unknown',()=>{exec(`ensureV100DB();DB.curriculumExtra=[{id:'ranged',subject:'사회문화',name:'남은 세트',kind:'exam-set',totalUnitsLow:4,totalUnitsHigh:10,completedUnits:0,minutesPerUnitLow:45,minutesPerUnitHigh:75,included:true,targetDate:'2026-10-16'}];DB.courseMeta={};const r=curriculumRowsV90().find(x=>x.id==='ranged');globalThis.out=rowWorkloadV90(r)`);const o=plain(val('out'));assert.equal(o.unknown,false);assert.equal(o.range,true);assert.equal(o.remainingLow,4);assert.equal(o.remainingHigh,10);assert.equal(o.low,180);assert.equal(o.high,750)});
 test('v10.1 unreleased course does not create today quota before release',()=>{exec(`ensureV100DB();DB.curriculumExtra=[{id:'release',subject:'국어',name:'공개 강좌',kind:'release',totalUnits:5,completedUnits:0,minutesPerUnitLow:60,minutesPerUnitHigh:60,included:true,targetDate:'2026-10-16',releaseStart:'2026-09-15'}];DB.courseMeta={};globalThis.out=coursePlanV10(curriculumRowsV90().find(x=>x.id==='release'),'2026-09-07')`);const o=plain(val('out'));assert.equal(o.waitingRelease,true);assert.equal(o.todayLow,0);assert.equal(o.todayHigh,0)});
 test('v10.1 fresh seed carries current curriculum evidence and September mock',()=>{vm.runInContext(fs.readFileSync(__dirname+'/personal-seed-v100.js','utf8'),ctx);store.clear();exec(`globalThis.seeded=loadDB();DB=seeded;ensureV100DB();viewDate='2026-09-07';const l=curriculumLoadV90(viewDate),t=DB.tests.find(x=>x.id==='exam-2026-09-kice-full');globalThis.out={today:l.todayHigh,unknown:l.unknown.map(x=>x.name),wow:lectureCourseDone(lectureCourse('kor-wow')),contact:Object.entries(DB.courseMeta).find(([k,v])=>v.minutesPerUnitLow===44)?.[1]?.minutesPerUnitHigh,scores:t?.scores,econAb:t?.abandonedQuestionMap?.경제,econ19:t?.questionRecords?.find(q=>q.subject==='경제'&&q.number===19)?.pattern}`);const o=plain(val('out'));assert.ok(o.today>4);assert.ok(o.unknown.includes('수Ⅰ·수Ⅱ 4점 문제 모음'));assert.equal(o.wow,0);assert.equal(o.contact,44);assert.deepStrictEqual(o.scores,{국어:80,수학:77,영어:89,경제:32,사회문화:37});assert.equal(o.econAb,'19, 20');assert.equal(o.econ19,'시간 손실의 연쇄')});
 test('v10.1 safety list includes daily and pre-import snapshots',()=>{exec(`localStorage.setItem('p11122_v100_daily_safety',JSON.stringify([{date:'2026-09-07',at:1,data:JSON.stringify(defaultDB())}]));localStorage.setItem('p11122_pre_import_backup',JSON.stringify(defaultDB()));globalThis.out=safetySnapshotRowsV10().map(x=>x.kind)`);assert.deepStrictEqual(plain(val('out')),['preimport','daily'])});
 test('v10.1 baseline merge upgrades existing DB without replacing history',()=>{vm.runInContext(fs.readFileSync(__dirname+'/personal-seed-v100.js','utf8'),ctx);exec(`DB=defaultDB();DB.tasks['2026-09-06']=[normalizeImportedTask({id:'keep',subject:'수학',name:'기존 기록',minutes:30,done:true})];DB.tests=[];DB.meta={};LAST_SAVED_JSON=JSON.stringify(DB);applyPersonalBaselineV101();globalThis.out={kept:DB.tasks['2026-09-06'][0].name,test:DB.tests.some(t=>t.id==='exam-2026-09-kice-full'),meta:!!DB.meta.personalBaselineV101Applied,core:DB.courseMeta['eco-core']?.minutesPerUnitLow}`);assert.deepStrictEqual(plain(val('out')),{kept:'기존 기록',test:true,meta:true,core:45})});
 test('v10.1 personal baseline migration is idempotent',()=>{vm.runInContext(fs.readFileSync(__dirname+'/personal-seed-v100.js','utf8'),ctx);exec(`DB=defaultDB();DB.tests=[];DB.meta={};LAST_SAVED_JSON=JSON.stringify(DB);applyPersonalBaselineV101();const first={tests:DB.tests.length,extra:DB.curriculumExtra.length,signals:DB.diagnosticSignals.length};applyPersonalBaselineV101();globalThis.out={first,second:{tests:DB.tests.length,extra:DB.curriculumExtra.length,signals:DB.diagnosticSignals.length}}`);const o=plain(val('out'));assert.deepStrictEqual(o.first,o.second)});
 test('v10.1 W.O.W reset never erases post-baseline activity',()=>{vm.runInContext(fs.readFileSync(__dirname+'/personal-seed-v100.js','utf8'),ctx);exec(`DB=defaultDB();DB.meta={};DB.lectureState['kor-wow::1']={completed:true};DB.tasks['2026-09-05']=[normalizeImportedTask({id:'wow-new',subject:'국어',name:'W.O.W 1강',components:[{id:'w',kind:'lecture',ref:'kor-wow::1',label:'01강',done:true}]})];LAST_SAVED_JSON=JSON.stringify(DB);applyPersonalBaselineV101();globalThis.out=!!DB.lectureState['kor-wow::1']?.completed`);assert.equal(plain(val('out')),true)});
}catch(e){console.error(e);process.exitCode=1}
if(!process.exitCode)console.log('ALL V10.1 TESTS PASSED');
