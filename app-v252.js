/* 曆象 2.5.2 — read-only evidence views and atomic exam lifecycle. */
'use strict';
const Y252_BUILD='20260923-evidence-1';
let y252PatternWindow='all';

function y252AnalysisRows(subject,f={}){
 const source=f.source||'all',scope=f.scope||'representative';
 let rows=y24Exams().filter(e=>source==='all'||y24Source(e.record)===source).flatMap(y24Rows).filter(r=>r.subject===subject);
 const scopeOf=r=>r.test.scope||(r.archive?'full':'unknown');
 if(scope==='representative'){
  const full=rows.filter(r=>scopeOf(r)==='full');
  rows=full.length?full:rows.filter(r=>scopeOf(r)==='unknown');
 }else if(scope!=='all')rows=rows.filter(r=>scopeOf(r)===scope);
 return rows.sort((a,b)=>Number(a.date.known)-Number(b.date.known)||a.date.key.localeCompare(b.date.key)||a.examKey.localeCompare(b.examKey));
}
y24ChartRows=y252AnalysisRows;

// A missing number list is not a correct answer. Never infer zero from normalized defaults.
function y252Coverage(r){
 const qs=(r.questions||[]).filter(q=>Number.isInteger(Number(q.number))&&Number(q.number)>0&&Number(q.number)<=QUESTION_LIMITS[r.subject]&&['wrong','uncertain'].includes(q.status));
 const wrong=new Set(qs.filter(q=>q.status==='wrong').map(q=>Number(q.number))).size;
 const t=r.test,declared=y24Num(t.kind==='full'?t.wrongs?.[r.subject]:t.wrongCount);
 const recorded=t.questionCoverage?.[r.subject];
 if(declared>wrong)return {known:false,reason:'번호 일부 미입력'};
 if(recorded==='missing')return {known:false,reason:'번호 미입력'};
 if(qs.length||recorded==='complete'||r.score===subjectScoreLimit(r.subject))return {known:true,qs};
 return {known:false,reason:'번호 미입력'};
}
questionPattern=function(subject,filters={}){
 let rows=y252AnalysisRows(subject,filters);
 if(filters.window==='recent')rows=rows.filter(r=>r.date.known&&r.date.key<=todayDate()).slice(-5);
 const total=rows.length,skipped=rows.filter(r=>!y252Coverage(r).known).length;
 rows=rows.filter(r=>y252Coverage(r).known);
 const tests=new Map(),stats=new Map();
 for(const r of rows){
  const t=r.test,test={...t,id:r.archive?r.examKey:t.id,date:r.date.known?r.date.key:'',
   _patternExamKey:r.examKey,_patternOrder:`${r.date.known?'1':'0'}:${r.date.key}:${r.examKey}`,
   _patternLabel:`${r.date.known?r.date.label:(t.attemptPeriod?.label||t.round||'응시일 미입력')} · ${y24ExamTitle(t)}`};
  tests.set(test.id,test);
  const byNumber=new Map();
  for(const q of y252Coverage(r).qs||[]){const n=Number(q.number);if(!byNumber.has(n)||q.status==='wrong')byNumber.set(n,q);}
  for(const [number,q] of byNumber){
   const question={...q,number,subject};
   if(r.archive){const review=(DB.tests||[]).filter(x=>x.archiveReviewOnly&&x.archiveRef===t.archiveId).flatMap(x=>x.questionRecords||[]).find(x=>Number(x.number)===number&&(!x.subject||x.subject===subject));question.retryState=review?.retryState||'resolved';}
   const s=stats.get(number)||{number,wrongTestIds:new Set(),uncertainTestIds:new Set(),entries:[]};
   (question.status==='wrong'?s.wrongTestIds:s.uncertainTestIds).add(test.id);s.entries.push({test,question});stats.set(number,s);
  }
 }
 return {rows,tests:[...tests.values()],attempts:tests.size,stats,total,skipped};
};
function y252Heat(wrong,total){
 if(!wrong||!total)return '';
 const ratio=Math.min(1,Math.max(0,wrong/total));
 const mix=(a,b)=>Math.round(a+(b-a)*ratio);
 const rgb=[mix(255,172),mix(247,49),mix(249,82)],linear=v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;};
 const luminance=rgb.reduce((sum,v,i)=>sum+linear(v)*[0.2126,0.7152,0.0722][i],0);
 return `background:rgb(${rgb.join(',')});border-color:rgb(${mix(240,147)},${mix(219,40)},${mix(225,69)});color:${luminance<0.179?'#fff':'#171717'}`;
}
renderQuestionPattern=function(subject,f={}){
 const grid=$('#questionNumberGrid'),legend=$('#questionHeatLegend'),insight=$('#questionInsight');if(!grid||!legend||!insight)return;
 legend.hidden=false;
 const p=questionPattern(subject,{...f,window:y252PatternWindow});
 legend.innerHTML=`<div class="y252-pattern-tools"><span>집계 ${p.attempts}회${p.skipped?` · 번호 미입력 ${p.skipped}회 제외`:''}</span><span class="y252-toggle"><button type="button" data-pattern-window="all" aria-pressed="${y252PatternWindow==='all'}">전체</button><button type="button" data-pattern-window="recent" aria-pressed="${y252PatternWindow==='recent'}">최근 5회</button></span></div>`;
 $$('[data-pattern-window]').forEach(b=>b.onclick=()=>{y252PatternWindow=b.dataset.patternWindow;renderQuestionPattern(subject,f);});
 if(!p.attempts){grid.innerHTML='<span class="y24-empty-inline">문항 기록 없음</span>';insight.innerHTML='';return;}
 const top=[...p.stats.values()].sort((a,b)=>b.wrongTestIds.size-a.wrongTestIds.size||a.number-b.number)[0];
 const active=selectedQuestionBySubject[subject]||top?.number||1;selectedQuestionBySubject[subject]=active;
 grid.innerHTML=Array.from({length:QUESTION_LIMITS[subject]},(_,i)=>{
  const n=i+1,s=p.stats.get(n),wrong=s?.wrongTestIds.size||0,uncertain=s?.uncertainTestIds.size||0;
  return `<button type="button" class="question-cell${uncertain?' has-uncertain':''}${n===active?' selected':''}" style="${y252Heat(wrong,p.attempts)}" data-pattern-number="${n}" aria-label="${n}번, ${p.attempts}회 중 ${wrong}회 오답${uncertain?`, 애매 정답 ${uncertain}회`:''}">${n}<small>${wrong}/${p.attempts}</small></button>`;
 }).join('');
 $$('[data-pattern-number]').forEach(b=>b.onclick=()=>{selectedQuestionBySubject[subject]=Number(b.dataset.patternNumber);renderQuestionPattern(subject,f);});
 const s=p.stats.get(active);
 if(!s){insight.innerHTML=`<div class="question-focus"><b>${active}번 · 0/${p.attempts}회 오답</b></div>`;return;}
 const entries=[...s.entries].sort((a,b)=>b.test._patternOrder.localeCompare(a.test._patternOrder));
 insight.innerHTML=`<div class="question-focus"><b>${active}번 · ${s.wrongTestIds.size}/${p.attempts}회 오답${s.uncertainTestIds.size?` · 애매 정답 ${s.uncertainTestIds.size}회`:''}</b></div><div class="question-history">${entries.map(({test,question})=>`<div><b>${esc(test._patternLabel)}</b><span>${esc(QUESTION_STATUS_LABELS[question.status])}${question.type?' · '+esc(question.type):''}${question.cause?' · '+esc(question.cause):''} · ${esc(reviewStatusLabel(question))}</span><button type="button" class="btn ghost small" data-pattern-exam="${esc(test._patternExamKey)}">분석</button></div>`).join('')}</div>`;
 $$('[data-pattern-exam]').forEach(b=>b.onclick=()=>y24OpenExam(b.dataset.patternExam));
};

// Save the explicit zero/missing distinction in the existing editor, no extra mandatory inputs.
function y252CoverageInput(r){
 const wrong=new Set([...parseQuestionNumbers(r.wrongQuestions),...parseQuestionNumbers(r.abandoned)]).size;
 const declared=y24Num(r.wrong),hasNumbers=wrong+parseQuestionNumbers(r.uncertainQuestions).length>0;
 return declared!=null&&declared>wrong?'missing':hasNumbers||declared===0?'complete':'missing';
}
const y252EditorRows=y24EditorRows;
y24EditorRows=function(t,archive=false){
 const rows=y252EditorRows(t,archive);if(!t||archive)return rows;
 for(const [subject,r] of Object.entries(rows)){
  const declared=y24Num(t.kind==='full'?t.wrongs?.[subject]:t.wrongCount);
  if(!declared&&t.questionCoverage?.[subject]!=='complete'&&r.score!==subjectScoreLimit(subject))r.wrong='';
 }
 return rows;
};

// Deletion is one transaction for the visible attempt, source archive, and reactivated reviews.
function y252ExamBundle(key){
 const e=y24Exams().find(x=>x.key===key);if(!e)return null;
 const archives=e.archive?[e.record]:(DB.analysisArchive||[]).filter(a=>y24ArchiveMatches(e.record,a)&&!(DB.tests||[]).some(t=>!t.archiveReviewOnly&&t.id!==e.record.id&&y24ArchiveMatches(t,a)));
 const ids=new Set(archives.map(a=>a.archiveId));
 const tests=(DB.tests||[]).filter(t=>(!e.archive&&t.id===e.record.id)||(t.archiveReviewOnly&&ids.has(t.archiveRef)));
 return {name:y24ExamTitle(e.record),tests:deep(tests),archives:deep(archives)};
}
function y252DeleteExam(key){
 const bundle=y252ExamBundle(key);if(!bundle||!confirm('이 시험과 연결된 원본 분석을 함께 휴지통으로 이동할까요?'))return false;
 const ok=commitChange(()=>{
  const token=uid();DB.deletedExams=DB.deletedExams||{};
  for(const t of bundle.tests)DB.deletedExams['test:'+t.id]=token;
  for(const a of bundle.archives)DB.deletedExams['archive:'+a.archiveId]=token;
  trashPush('examBundleV252',{...bundle,token});
  const tids=new Set(bundle.tests.map(t=>t.id)),aids=new Set(bundle.archives.map(a=>a.archiveId));
  DB.tests=DB.tests.filter(t=>!tids.has(t.id));DB.analysisArchive=(DB.analysisArchive||[]).filter(a=>!aids.has(a.archiveId));
  y230RebuildArchiveDerived();
 });
 if(ok){hideModal('y24ExamDetailModal');renderTests();}return ok;
}
const y252OpenExam=y24OpenExam;
y24OpenExam=function(key){y252OpenExam(key);const button=$('#y24DeleteExam');if(button)button.onclick=()=>y252DeleteExam(key);};
const y252DeleteArchive=y230DeleteArchiveTest;
y230DeleteArchiveTest=function(id){const test=(DB.tests||[]).find(t=>!t.archiveReviewOnly&&t.archiveRef===id);return y252DeleteExam(test?'test:'+test.id:'archive:'+id);};
const y252TrashTitle=trashTitle;
trashTitle=function(x){return x.type==='examBundleV252'?`시험 · ${x.data.name}`:y252TrashTitle(x);};
const y252Restore=restoreTrash;
restoreTrash=function(id){
 const entry=DB.trash.find(x=>x.id===id);if(entry?.type!=='examBundleV252')return y252Restore(id);
 const b=entry.data;
 // Do not overwrite a newer record restored/imported separately.
 const collision=b.tests.some(t=>DB.tests.some(x=>x.id===t.id&&JSON.stringify(x)!==JSON.stringify(t)))||b.archives.some(a=>(DB.analysisArchive||[]).some(x=>x.archiveId===a.archiveId&&JSON.stringify(x)!==JSON.stringify(a)));
 if(collision){alert('같은 시험의 다른 기록이 있습니다. 현재 기록을 보존했으며, 휴지통 기록도 남겨 두었습니다.');return false;}
 const ok=commitChange(()=>{
  for(const t of b.tests)if(!DB.tests.some(x=>x.id===t.id))DB.tests.push(deep(t));
  DB.analysisArchive=DB.analysisArchive||[];for(const a of b.archives)if(!DB.analysisArchive.some(x=>x.archiveId===a.archiveId))DB.analysisArchive.push(deep(a));
  for(const key of [...b.tests.map(t=>'test:'+t.id),...b.archives.map(a=>'archive:'+a.archiveId)])if(DB.deletedExams?.[key]===b.token)delete DB.deletedExams[key];
  DB.trash=DB.trash.filter(x=>x.id!==id);y230RebuildArchiveDerived();
 });
 if(ok){renderSettings();renderTests();}return ok;
};
const y252Merge=y21Merge;
y21Merge=function(incoming,current,choices={}){
 const filtered=deep(incoming),deleted=current.deletedExams||{};
 if(Array.isArray(filtered.tests))filtered.tests=filtered.tests.filter(t=>!deleted['test:'+t.id]&&!deleted['archive:'+t.archiveRef]);
 if(Array.isArray(filtered.analysisArchive))filtered.analysisArchive=filtered.analysisArchive.filter(a=>!deleted['archive:'+a.archiveId]);
 const result=y252Merge(filtered,current,choices);
 // Remote tombstones alone must never hide current records. Restore through the trash UI.
 result.data.deletedExams={...(incoming.deletedExams||{}),...deep(deleted)};
 for(const t of current.tests||[])if(!deleted['test:'+t.id])delete result.data.deletedExams['test:'+t.id];
 for(const a of current.analysisArchive||[])if(!deleted['archive:'+a.archiveId])delete result.data.deletedExams['archive:'+a.archiveId];
 return result;
};

// One stable service worker registration; only a genuinely waiting build opens the banner.
__impl_initPwaUpdate=function(){
 if(!('serviceWorker' in navigator))return;
 let registration,applying=false,reloaded=false,pendingWorker=null,applyTimer=null;
 const banner=$('#updateBanner'),button=$('#reloadUpdate');
 const hide=()=>{banner?.classList.add('hidden');if(button){button.disabled=false;button.textContent='새로고침';}};
 const askActive=()=>navigator.serviceWorker.controller?.postMessage({type:'GET_VERSION'});
 const checkWaiting=()=>{
  const worker=registration?.waiting;
  if(!worker){pendingWorker=null;if(!applying)hide();return;}
  pendingWorker=worker;worker.postMessage({type:'GET_VERSION'});
 };
 const refresh=()=>{
  if(reloaded)return;
  if(globalThis.YEOKSANG_FAILED_RAW){applying=false;hide();alert('미저장 기록을 먼저 내보내 주세요.');return;}
  reloaded=true;hide();location.reload();
 };
 hide();
 navigator.serviceWorker.addEventListener('message',e=>{
  if(e.data?.type!=='SW_VERSION')return;
  if(e.source===pendingWorker){
   if(e.data.build!==Y252_BUILD)banner?.classList.remove('hidden');else hide();
   return;
  }
  if(e.source===navigator.serviceWorker.controller){globalThis.YEOKSANG_SW_VERSION=e.data.version;globalThis.YEOKSANG_SW_BUILD=e.data.build||'';renderVersionStatus();}
 });
 navigator.serviceWorker.addEventListener('controllerchange',()=>{askActive();if(applyTimer)clearTimeout(applyTimer);if(applying)refresh();else checkWaiting();});
 navigator.serviceWorker.register('./sw-v200.js',{updateViaCache:'none'}).then(reg=>{
  registration=reg;askActive();checkWaiting();
  const watch=worker=>{if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed')checkWaiting();});};
  watch(reg.installing);reg.addEventListener('updatefound',()=>watch(reg.installing));
  reg.update().then(checkWaiting).catch(()=>{});
 }).catch(()=>{hide();});
 if(button)button.onclick=()=>{
  if(globalThis.YEOKSANG_FAILED_RAW){alert('미저장 기록을 먼저 내보내 주세요.');return;}
  const worker=registration?.waiting;
  if(!worker){hide();return;}
  applying=true;button.disabled=true;button.textContent='적용 중';
  // Recover the action button if activation fails, without a reload loop.
  applyTimer=setTimeout(()=>{if(!reloaded){applying=false;button.disabled=false;button.textContent='다시 시도';checkWaiting();}},15000);
  worker.postMessage({type:'APPLY_UPDATE'});
 };
};
const y252Settings=__impl_renderSettings;
__impl_renderSettings=function(){y252Settings();$('#versionInfo').innerHTML=`<code>曆象 ${APP_VERSION}<br>수정본 ${Y252_BUILD}<br>Data schema ${SCHEMA_VERSION}</code>`;};
