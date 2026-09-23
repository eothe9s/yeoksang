/* 曆象 v2.4 — compact views and explicit, preserved daily work records. */
'use strict';
const Y24_VERSION='2.5.2';
const Y24_SOURCES=['평가원 모의평가','교육청 학력평가','수능','사설 모의고사'];
const y24Num=v=>v==null||String(v).trim()===''?null:(Number.isFinite(Number(v))?Number(v):null);
const y24Fmt=n=>n==null?'—':String(Math.round(n*10)/10);
const y24Time=n=>n==null?'미기록':minuteLabel(n);
const y24State={page:1,filter:'',exam:null,workDate:'',editor:null};
function y24Commit(change){return commitChange(change);}

// Removed courses are tombstoned; source progress and historical task references survive.
const y24CurriculumBase=curriculumRowsV90;
curriculumRowsV90=function(){return y24CurriculumBase().filter(r=>!DB.removedCourses?.[r.id]);};
const y24LectureLookup=lectureCourse;
const y24AllLectures=allLectureCourses;
allLectureCourses=function(){return y24AllLectures().filter(c=>!DB.removedCourses?.[c.key]);};
lectureCourse=function(key){return y24AllLectures().find(c=>c.key===key);};
const y24BookCatalog=renderBookCatalog;
renderBookCatalog=function(){y24BookCatalog();$$('#bookCatalog .source-card').forEach(el=>{const id=el.querySelector('.edit-book')?.dataset.id;if(DB.removedCourses?.[id])el.remove();});};
function y24DeleteCourse(id){
 const row=curriculumRowsV90().find(r=>r.id===id);if(!row||!confirm(`${row.name}을 휴지통으로 이동할까요?`))return;
 if(y24Commit(()=>{const token=uid();DB.removedCourses=DB.removedCourses||{};DB.removedCourses[id]={token,kind:row.kind,name:row.name};trashPush('courseV24',{id,name:row.name,kind:row.kind,token});})){hideModal('courseMetaModal');renderProgress();renderVendingIfVisible();}
}
const y24TrashTitle=trashTitle;
trashTitle=function(x){return x.type==='courseV24'?`과정 · ${x.data.name}`:y24TrashTitle(x);};
const y24RestoreBase=restoreTrash;
restoreTrash=function(id){
 const entry=DB.trash.find(x=>x.id===id);if(!entry)return;
 if(entry.type==='courseV24'){
  if(y24Commit(()=>{if(DB.removedCourses?.[entry.data.id]?.token===entry.data.token)delete DB.removedCourses[entry.data.id];DB.trash=DB.trash.filter(x=>x.id!==id);})){renderSettings();}return;
 }
 if(entry.type==='analysisArchiveQuestion'&&!(DB.analysisArchive||[]).some(a=>a.archiveId===entry.data.archiveId)){alert('시험을 먼저 복원한 뒤 문항을 복원하세요.');return;}
 y24RestoreBase(id);
};
function y24PurgeTrash(id=null){
 const selected=id?DB.trash.filter(x=>x.id===id):DB.trash;if(!selected.length)return;
 if(!confirm(id?'이 항목을 영구 삭제할까요? 복원할 수 없습니다.':'휴지통 전체를 비울까요? 복원할 수 없습니다.'))return;
 if(y24Commit(()=>{DB.trash=id?DB.trash.filter(x=>x.id!==id):[];}))renderTrash();
}
renderTrash=function(){
 const box=$('#trashList');if(!box)return;
 box.innerHTML=DB.trash.length?DB.trash.map(x=>`<div class="trash-item"><div class="trash-top"><div><b>${esc(trashTitle(x))}</b><div class="task-meta">${new Date(x.deletedAt).toLocaleDateString('ko-KR')}</div></div><div class="row"><button class="btn ghost small" data-y24-restore="${esc(x.id)}">복원</button><button class="btn danger small" data-y24-purge="${esc(x.id)}">영구 삭제</button></div></div></div>`).join(''):'<div class="empty-state">비어 있음</div>';
 $$('[data-y24-restore]').forEach(b=>b.onclick=()=>restoreTrash(b.dataset.y24Restore));$$('[data-y24-purge]').forEach(b=>b.onclick=()=>y24PurgeTrash(b.dataset.y24Purge));
 if($('#y24EmptyTrash'))$('#y24EmptyTrash').disabled=!DB.trash.length;
};
__impl_renderProgress=function(){
 const plans=curriculumRowsV90().map(r=>coursePlanV10(r,viewDate)),load=curriculumLoadV90(viewDate),riskOutlook=y231DeadlineOutlook(viewDate);
 $('#curriculumPressure').innerHTML=`<div><span>남은 필요량</span><b>${y231Hours(load.low/60,load.high/60)}</b></div><div><span>10.16까지 가용</span><b>${load.capacity.totalHours.toFixed(1)}h</b></div><div><span>마감 경과</span><b>${plans.filter(p=>p.needsReplan).length}개</b></div><div><span>오늘 마감 필요량</span><b>${y231Hours(load.todayLow,load.todayHigh)}</b></div>`;
 $('#progressCatalog').innerHTML=[...new Set(plans.map(p=>p.subject))].map(s=>`<section class="progress-group"><h4>${esc(s)}</h4><div class="progress-grid">${plans.filter(p=>p.subject===s).map(p=>{const risk=y230CourseRisk(p,viewDate,riskOutlook),w=p.workload,percent=p.total?pct(p.done,p.total):0;return`<article class="progress-card"><div class="progress-card-top"><span class="kind-pill">${p.kind==='lecture'?'인강':p.kind==='book'?'문제집':'과정'}</span><div class="row"><button class="text-link" data-y24-edit-course="${esc(p.id)}" data-kind="${esc(p.kind)}">수정</button><button class="text-link y24-danger" data-y24-del-course="${esc(p.id)}">삭제</button></div></div><h5>${esc(p.name)}</h5><div class="progress-line"><i style="width:${clamp(percent,0,100)}%"></i></div><b>${p.total==null?'분량 미정':`${p.done}/${p.total} · ${percent}%`}</b><div class="y24-course-meta"><span>마감 ${esc(p.target.slice(5))}</span><span>남은 시간 ${w.unknown?'미정':y231Hours(w.low/60,w.high/60)}</span><span>오늘 ${p.needsReplan?'재마감 필요':w.unknown?'미정':p.waitingRelease?'공개 전':y231Hours(p.todayLow/60,p.todayHigh/60)}</span>${['bad','warn'].includes(risk.className)?`<span class="course-risk ${risk.className}" title="${esc(risk.detail)}">${esc(risk.state)}</span>`:''}${w.included===false?'<span>계산 제외</span>':''}</div></article>`;}).join('')}</div></section>`).join('')||'<div class="empty-state">등록된 과정 없음</div>';
 $$('[data-y24-edit-course]').forEach(b=>b.onclick=()=>openCourseMeta(b.dataset.y24EditCourse,b.dataset.kind));$$('[data-y24-del-course]').forEach(b=>b.onclick=()=>y24DeleteCourse(b.dataset.y24DelCourse));
};

// Reports use per-day snapshots, never schedule minutes as task actual minutes.
function y24TaskSnapshot(t){
 return {id:t.id,subject:t.subject,name:t.name,material:t.material||'',minutes:y24Num(t.minutes)>0?Number(t.minutes):null,quantity:y24Num(t.plannedQuantity),unit:t.quantityUnit||'',range:t.plannedRange||'',components:(t.components||[]).map(c=>({label:c.label||c.name||c.ref||'',done:!!c.done})),done:!!t.done,deferred:t.deferred?{kind:t.deferred.kind,targetDate:t.deferred.targetDate||''}:null,note:t.note||''};
}
function y24CaptureChanges(previous){
 const dates=new Set([...Object.keys(previous.tasks||{}),...Object.keys(DB.tasks||{})]);
 for(const date of dates){
  if(date>todayDate())continue;
  const before=previous.tasks?.[date]||[],after=DB.tasks?.[date]||[];
  if(JSON.stringify(before)===JSON.stringify(after))continue;
  DB.dayWork=DB.dayWork||{};const day=DB.dayWork[date]||(DB.dayWork[date]={startedAt:Date.now(),entries:{}});
  const ids=new Set([...before.map(t=>t.id),...after.map(t=>t.id)]);
  for(const id of ids){const a=before.find(t=>t.id===id),b=after.find(t=>t.id===id);if(JSON.stringify(a)===JSON.stringify(b)&&day.entries[id])continue;
   const row=day.entries[id]||(day.entries[id]={original:y24TaskSnapshot(a||b),capturedAt:Date.now(),extra:!a&&!!previous.planLocks?.[date]});
   row.latest=y24TaskSnapshot(b||a);row.removed=!b;if(b)delete row.disposition;
  }
 }
}
const y24SaveBase=__impl_saveDB;
__impl_saveDB=function(...args){if(!globalThis.YEOKSANG_STARTING){let prev={};try{prev=JSON.parse(LAST_SAVED_JSON||'{}')}catch{}y24CaptureChanges(prev);}return y24SaveBase(...args);};
function y24WorkRows(date){
 const map=deep(DB.dayWork?.[date]?.entries||{});
 for(const task of DB.tasks?.[date]||[]){const snap=y24TaskSnapshot(task);if(!map[task.id])map[task.id]={original:snap,latest:snap,capturedAt:null};else map[task.id].latest=snap;}
 return Object.entries(map).map(([id,r])=>({id,...r}));
}
function y24WorkStatus(r){if(r.actual?.status)return r.actual.status;if(r.latest?.done)return 'complete';if(r.latest?.components?.some(c=>c.done))return 'partial';return 'unrecorded';}
function y24SyncActualStatus(date,id){const a=DB.dayWork?.[date]?.entries?.[id]?.actual,t=taskById(date,id);if(!a||!t)return;a.status=t.done?'complete':((t.components||[]).some(c=>c.done)||a.minutes>0||a.quantity>0||a.range?'partial':'unstarted');}
const y24SetDone=setTaskDoneInternal;
setTaskDoneInternal=function(date,id,done){const a=DB.dayWork?.[date]?.entries?.[id]?.actual;if(a)a.status=done?'complete':(a.minutes>0||a.quantity>0||a.range?'partial':'unstarted');return y24SetDone(date,id,done);};
const y24SetComponent=setTaskComponentDone;
setTaskComponentDone=function(date,id,cid,done){return commitChange(()=>{y24SetComponent(date,id,cid,done);y24SyncActualStatus(date,id);});};
function y24WorkLabel(r){return (r.extra?'추가 · ':'')+({complete:'완료',partial:'일부 완료',unstarted:'미시작',unrecorded:'실적 미입력'}[y24WorkStatus(r)])+(r.removed?' · 삭제':r.latest?.deferred?' · '+({waiting:'대기',carry:'이월',skip:'보류'}[r.latest.deferred.kind]||'보류'):'');}
function y24PlannedRange(p){return p.range||p.components?.map(c=>c.label).filter(Boolean).join(', ')||p.name;}
function y24Comparison(r){
 const p=r.original,a=r.actual||{},pq=y24Num(p.quantity),aq=y24Num(a.quantity),pm=y24Num(p.minutes),am=y24Num(a.minutes),parts=[];
 if(pq!=null&&aq!=null&&p.unit===a.unit){const delta=aq-pq;parts.push(`분량 ${delta===0?'계획대로':`${delta>0?'+':''}${y24Fmt(delta)}${p.unit}`}${pq>0?` (${Math.round(aq/pq*100)}%)`:''}`);
  if(pq>0&&pm>0&&am>0)parts.push(`시간당 분량 ${Math.round((aq/am)/(pq/pm)*100)}%`);
 }
 if(pm!=null&&am!=null)parts.push(`시간 ${am===pm?'계획대로':`${am>pm?'+':''}${y24Fmt(am-pm)}분`}`);
 return parts.join(' · ');
}
const y24TaskOpen=openTaskModal;
openTaskModal=function(t=null){y24TaskOpen(t);$('#y24PlanQty').value=t?.plannedQuantity??'';$('#y24PlanUnit').value=t?.quantityUnit||'';$('#y24PlanRange').value=t?.plannedRange||'';};
const y24TaskSave=saveTaskModal;
saveTaskModal=function(){
 const id=$('#taskId').value,name=$('#taskName').value.trim(),qty=y24Num($('#y24PlanQty').value),minutes=Number($('#taskMinutes').value||0);
 if(!name){alert('할 일을 입력하세요.');return;}
 if((qty!=null&&qty<0)||!Number.isFinite(minutes)||minutes<0||minutes>1440){alert('분량과 시간을 확인하세요.');return;}
 if(y24Commit(()=>{
  const patch={subject:$('#taskSubject').value,priority:$('#taskPriority').value,minutes,splitMode:$('#taskSplitMode')?.value==='contiguous'?'contiguous':'flex',name,material:$('#taskMaterial').value.trim(),note:$('#taskNote').value.trim(),plannedQuantity:qty,quantityUnit:$('#y24PlanUnit').value.trim(),plannedRange:$('#y24PlanRange').value.trim()};
  if(id){const t=taskById(viewDate,id);if(!t)throw Error('수정할 할 일이 없습니다.');Object.assign(t,patch);if(t.components?.length===1&&t.components[0].kind==='manual')t.components[0].label=name;}
  else tasksFor(viewDate).push(normalizeImportedTask({...patch,id:uid(),done:false,components:[{id:uid(),kind:'manual',label:name,done:false}]}));
 })){hideModal('taskModal');renderDashboard();}
};
function y24OpenActual(id,date=viewDate){
 const r=y24WorkRows(date).find(r=>r.id===id);if(!r)return;y24State.workDate=date;$('#y24WorkId').value=id;
 const p=r.original,a=r.actual||{};$('#y24WorkPlan').textContent=`${p.subject} · ${p.name}\n계획 ${y24PlannedRange(p)}${p.quantity!=null?` · ${p.quantity}${p.unit}`:''} · ${p.minutes==null?'시간 미정':minuteLabel(p.minutes)}`;
 $('#y24WorkStatus').value=a.status||(r.latest?.done?'complete':'partial');$('#y24ActualMinutes').value=a.minutes??'';$('#y24ActualQty').value=a.quantity??'';$('#y24ActualUnit').value=a.unit??p.unit;$('#y24ActualRange').value=a.range||'';$('#y24ActualNote').value=a.note||'';showModal('y24ActualModal');
}
function y24AsPlanned(){const r=y24WorkRows(y24State.workDate).find(r=>r.id===$('#y24WorkId').value);if(!r)return;$('#y24WorkStatus').value='complete';$('#y24ActualQty').value=r.original.quantity??'';$('#y24ActualUnit').value=r.original.unit;$('#y24ActualRange').value=y24PlannedRange(r.original);}
function y24SaveActual(){
 const date=y24State.workDate,id=$('#y24WorkId').value,r=y24WorkRows(date).find(x=>x.id===id);if(!r)return;
 const minutes=y24Num($('#y24ActualMinutes').value),quantity=y24Num($('#y24ActualQty').value);if((minutes!=null&&minutes<0)||(quantity!=null&&quantity<0)){alert('시간·수량은 0 이상이어야 합니다.');return;}
 if(y24Commit(()=>{DB.dayWork=DB.dayWork||{};const d=DB.dayWork[date]||(DB.dayWork[date]={startedAt:Date.now(),entries:{}});d.entries[id]={...r,actual:{status:$('#y24WorkStatus').value,minutes,quantity,unit:$('#y24ActualUnit').value.trim(),range:$('#y24ActualRange').value.trim(),note:$('#y24ActualNote').value.trim(),at:Date.now()}};
  const t=(DB.tasks[date]||[]).find(t=>t.id===id);if(t){retainDailyBasis(date);const status=$('#y24WorkStatus').value;t.actualStatus=status;t.done=status==='complete';if(status==='complete'){delete t.deferred;DB.waiting=DB.waiting.filter(w=>w.origin?.date!==date||w.origin?.id!==id);(t.components||[]).forEach(c=>syncComponentSource(c,true));}else if(status==='unstarted')(t.components||[]).forEach(c=>syncComponentSource(c,false));}
 })){hideModal('y24ActualModal');y24RenderDayWork();renderDashboard();}
}
function y24RenderDayWork(){const el=$('#y24DayWork');if(!el)return;el.innerHTML=y24WorkRows(viewDate).map(r=>`<div class="y24-work-row"><div><b>${esc(r.original.subject)} · ${esc(r.original.name)}</b><span>${esc(y24WorkLabel(r))}${y24Comparison(r)?' · '+esc(y24Comparison(r)):''}</span></div><button class="btn ghost small" data-y24-work="${esc(r.id)}">실적</button></div>`).join('')||'<div class="empty-state">기록 없음</div>';$$('[data-y24-work]').forEach(b=>b.onclick=()=>y24OpenActual(b.dataset.y24Work));}
const y24CloseOpen=__impl_openCloseDay;
__impl_openCloseDay=function(){y24CloseOpen();if(viewDate>todayDate())return;$('#closeStudyOverride').value=Object.hasOwn(DB.studyOverrides||{},viewDate)?(DB.studyOverrides[viewDate]/60).toFixed(1):'';$('#closeStudySummary').innerHTML=$('#closeStudySummary').innerHTML.replace('자동 실제','시간표 추정').replace('현재 최종','현재 집계');y24RenderDayWork();};
function y24AddExtra(){const name=prompt('추가로 공부한 내용');if(!name?.trim())return;const id=uid(),subject=prompt('과목','국어');if(subject===null)return;const p={id,subject:subject.trim()||'기타',name:name.trim(),material:'',quantity:null,unit:'',range:'',minutes:null,done:false,components:[]};if(y24Commit(()=>{DB.dayWork=DB.dayWork||{};const d=DB.dayWork[viewDate]||(DB.dayWork[viewDate]={startedAt:Date.now(),entries:{}});d.entries[id]={original:p,latest:p,extra:true,capturedAt:Date.now()};})){y24RenderDayWork();y24OpenActual(id);}}
todayRecordText=function(date=viewDate){
 const rows=y24WorkRows(date),comp=dailyCompletion(date),cond=DB.condition[date]||{},session=sleepSession(date),knownActual=rows.filter(r=>r.actual?.minutes!=null),mins=knownActual.reduce((s,r)=>s+r.actual.minutes,0),planned=rows.filter(r=>!r.extra&&r.original.minutes!=null).reduce((s,r)=>s+r.original.minutes,0);
 const lines=[`[曆象 일일 기록]`,`날짜: ${date}`,`목표: 수능 만점`,`원래 할 일 예상: ${minuteLabel(planned)}${rows.some(r=>!r.extra&&r.original.minutes==null)?' + 시간 미정':''}`,`직접 기록한 실제: ${minuteLabel(mins)} (${knownActual.length}/${rows.length}개 시간 입력)`,`하루 순공 기록: ${minuteLabel(finalStudy(date))+' · '+studyTotal(date).source}`,`완주: ${comp.total?`${comp.done}/${comp.total} (${comp.rate}%)`:'미기록'}`,''];
 for(const r of rows){const p=r.original,a=r.actual||{},latest=r.latest||p;
  lines.push(`[${y24WorkLabel(r)}] ${p.subject} · ${p.name}${p.material?' / '+p.material:''}`);
  lines.push(`계획: ${y24PlannedRange(p)}${p.quantity!=null?` · ${p.quantity}${p.unit}`:''} / ${p.minutes==null?'시간 미정':minuteLabel(p.minutes)}`);
  const actualRange=a.range||(a.status==='unstarted'?'미시작':latest.components?.filter(c=>c.done).map(c=>c.label).filter(Boolean).join(', ')||'수행 범위 미입력');
  lines.push(`실제: ${actualRange}${a.quantity!=null?` · ${a.quantity}${a.unit}`:''} / ${y24Time(a.minutes)}`);
  const cmp=y24Comparison(r);if(cmp)lines.push(`비교: ${cmp}`);
  if(JSON.stringify(p)!==JSON.stringify(latest)&&(p.name!==latest.name||p.range!==latest.range||p.quantity!==latest.quantity||p.minutes!==latest.minutes))lines.push(`변경 후 계획: ${y24PlannedRange(latest)} / ${latest.minutes==null?'시간 미정':minuteLabel(latest.minutes)}`);
  if(a.note)lines.push(`메모: ${a.note}`);lines.push('');
 }
 lines.push(`수면: ${calcSleep(session.bed,session.wake)||'미입력'}`,`컨디션: ${cond.overall||'미입력'}`);
 return lines.join('\n');
};
const y24DashboardBase=__impl_renderDashboard;
__impl_renderDashboard=function(){y24DashboardBase();if($('#todayNeedCaption'))$('#todayNeedCaption').hidden=true;$('#periodAverageHours')?.parentElement?.setAttribute('hidden','');$$('.task-actions').forEach(el=>{const id=el.querySelector('.task-edit')?.dataset.id;if(id&&!el.querySelector('[data-y24-actual]')){const b=document.createElement('button');b.type='button';b.className='btn ghost small';b.dataset.y24Actual=id;b.textContent='실적';b.onclick=()=>y24OpenActual(id);el.prepend(b);}});};

// One exam list. Solve dates and publication sessions are distinct, never fabricated.
function y24Source(t){
 if(Y24_SOURCES.includes(t.source))return t.source;
 const name=String(t.name||t.examLabel||'');
 if(/전국연합|교육청/.test(name))return '교육청 학력평가';
 if(/평가원|모의평가/.test(name))return '평가원 모의평가';
 if(/^(\d{4}(학년도|년)?\s*)?(대학수학능력시험|수능)$/.test(name.trim()))return '수능';
 return '';
}
testSourceLabel=s=>Y24_SOURCES.includes(s)?s:(s||'');
y230ArchiveSource=y24Source;
function y24ExamTitle(t){return String(t.name||t.examLabel||'시험').replace(/^\d{4}[-.]\d{2}[-.]\d{2}\s*[·:—-]?\s*/,'')||'시험';}
function y24SessionKey(t){
 if(t.sortKey)return String(t.sortKey);
 const name=t.examLabel||t.name||'',year=Number(t.academicYear||(name.match(/(\d{4})(?:학년도|년)/)||[])[1]);
 if(!year)return name;const m=Number((name.match(/(\d{1,2})월/)||[])[1]||0);return `${year}-${/수능/.test(name)?'11':String(m).padStart(2,'0')}`;
}
function y24DateInfo(t,archive=false){const date=archive?(t.solvedDate||''):(t.date||'');return y231ValidDate(date)?{known:true,key:date,label:date.replaceAll('-','.')}: {known:false,key:y24SessionKey(t),label:'응시일 미입력'};}
function y24ArchiveMatches(t,a){return t.archiveRef===a.archiveId||Boolean(t.analysisSourceKey&&a.packageId&&(t.questionRecords||[]).some(q=>q.analysisMeta?.packageId===a.packageId)&&t.subject===a.subject&&y24ExamTitle(t)===y24ExamTitle(a));}
function y24Exams(){
 const active=(DB.tests||[]).filter(t=>!t.archiveReviewOnly).map(t=>({key:'test:'+t.id,archive:false,record:t,date:y24DateInfo(t)}));
 const archives=(DB.analysisArchive||[]).filter(a=>!active.some(e=>y24ArchiveMatches(e.record,a))).map(t=>({key:'archive:'+t.archiveId,archive:true,record:t,date:y24DateInfo(t,true)}));
 return [...active,...archives].sort((a,b)=>Number(b.date.known)-Number(a.date.known)||b.date.key.localeCompare(a.date.key)||a.key.localeCompare(b.key));
}
function y24Rows(e){
 const t=e.record;
 if(e.archive)return[{subject:t.subject,score:y24Num(t.score),grade:y24Num(t.grade)||null,minutes:y24Num(t.minutes),questions:t.questions||[],test:t,archive:true,date:e.date,examKey:e.key}];
 const sourceRows=testSubjectRows(t);if(t.kind==='full')for(const s of SUBJECTS)if(t.scoreMissingMap?.[s]===false&&!sourceRows.some(r=>r.subject===s))sourceRows.push({subject:s,score:Number(t.scores?.[s])||0,grade:Number(t.grades?.[s])||0,minutes:Number(t.minutes?.[s])||0,questions:testQuestionRecords(t,s),test:t});
 return sourceRows.map(r=>({...r,score:(t.kind==='full'?t.scoreMissingMap?.[r.subject]:t.scoreMissing)===true?null:((t.kind==='full'?t.scoreMissingMap?.[r.subject]:t.scoreMissing)===false?r.score:r.score>0?r.score:null),grade:r.grade||null,minutes:r.minutes||null,date:e.date,examKey:e.key}));
}
function y24ExamPending(e){const qs=e.archive?(DB.tests||[]).filter(t=>t.archiveReviewOnly&&t.archiveRef===e.record.archiveId).flatMap(t=>t.questionRecords||[]):e.record.questionRecords||[];return qs.filter(q=>q.retryState!=='resolved').length;}
function y24ExamStatus(e){const n=y24ExamPending(e);if(e.archive)return n?`미해결 ${n}`:'해결 완료';if(n)return `미해결 ${n}`;return (e.record.questionRecords||[]).length||e.record.analysisComplete?'해결 완료':'분석 미입력';}
function y24FilteredExams(){const f=testListFilters(),q=($('#y24TestSearch')?.value||'').trim().toLowerCase();return y24Exams().filter(e=>{const t=e.record;return (f.source==='all'||y24Source(t)===f.source)&&(f.scope==='all'||(e.archive?(t.scope||'full'):t.scope)===f.scope)&&(f.subject==='all'||y24Rows(e).some(r=>r.subject===f.subject))&&(!q||`${y24ExamTitle(t)} ${t.round||''} ${y24Rows(e).map(r=>r.subject).join(' ')}`.toLowerCase().includes(q));});}
function y24RenderExamList(){
 const filter=JSON.stringify([testListFilters(),$('#y24TestSearch')?.value||'']);if(filter!==y24State.filter){y24State.page=1;y24State.filter=filter;}
 const rows=y24FilteredExams(),pages=Math.max(1,Math.ceil(rows.length/10));y24State.page=clamp(y24State.page,1,pages);
 $('#testList').innerHTML=rows.length?`<div class="y24-exam-list">${rows.slice((y24State.page-1)*10,y24State.page*10).map(e=>{const t=e.record,ss=y24Rows(e),filterSubject=$('#testSubjectFilter').value,shown=filterSubject==='all'?ss:ss.filter(r=>r.subject===filterSubject);return`<button class="y24-exam-row" data-y24-exam="${esc(e.key)}"><span class="y24-exam-name"><strong>${esc(y24ExamTitle(t))}</strong><span class="y24-exam-meta">${esc(e.date.label)}${y24Source(t)?' · '+esc(y24Source(t)):''}${t.round?' · '+esc(t.round):''}${e.archive?' · <span class="y24-import-tag">오답파일 분석</span>':''}</span></span><span class="y24-exam-scores">${shown.map(r=>`<span>${esc(r.subject)} <b>${r.score==null?'—':r.score+'점'}</b>${r.grade?` <em class="grade-${r.grade}">${r.grade}등급</em>`:''}</span>`).join('')}</span><span class="y24-exam-status">${y24ExamStatus(e)}</span><span aria-hidden="true">›</span></button>`;}).join('')}</div>`:'<div class="empty-state">시험 기록 없음</div>';
 $('#y24TestPages').innerHTML=`<span>${rows.length}회</span><button class="btn ghost small" id="y24PrevPage" ${y24State.page<=1?'disabled':''}>이전</button><b>${y24State.page} / ${pages}</b><button class="btn ghost small" id="y24NextPage" ${y24State.page>=pages?'disabled':''}>다음</button>`;
 $('#y24PrevPage').onclick=()=>{y24State.page--;y24RenderExamList();};$('#y24NextPage').onclick=()=>{y24State.page++;y24RenderExamList();};$$('[data-y24-exam]').forEach(b=>b.onclick=()=>y24OpenExam(b.dataset.y24Exam));
}
function y24OpenExam(key){
 const e=y24Exams().find(e=>e.key===key);if(!e)return;y24State.exam=key;const t=e.record;$('#y24ExamTitle').textContent=y24ExamTitle(t);
 $('#y24ExamDetail').innerHTML=`<div class="y24-detail-meta">${esc(e.date.label)}${y24Source(t)?' · '+esc(y24Source(t)):''} · ${y24ExamStatus(e)}${e.archive?' · 오답파일 분석':''}</div><div class="y24-detail-scores">${y24Rows(e).map(r=>`<div><b>${esc(r.subject)}</b><strong>${r.score==null?'—':r.score+'점'}</strong><span>${r.grade?r.grade+'등급':'등급 미입력'}${r.minutes!=null?' · '+r.minutes+'분':''}</span></div>`).join('')}</div>${t.memo?`<p class="y24-note">${esc(t.memo)}</p>`:''}${e.archive?`<div class="archive-q-list">${(t.questions||[]).map((q,i)=>`${y230ArchiveQuestionRow(t,q)}${y220HasQuestionNumber(q)?`<button class="btn ghost small" data-y24-reactivate="${esc(i)}">이 문항 다시 점검</button>`:''}`).join('')}</div>`:''}`;
 $('#y24ExamActions').innerHTML=`<button id="y24DeleteExam" class="btn danger">삭제</button>${e.archive?'<button id="y24ArchiveEdit" class="btn ghost">성적 수정</button>':'<button id="y24EditExam" class="btn ghost">수정</button><button id="y24ReviewExam" class="btn primary">문항 분석</button>'}`;
 $('#y24DeleteExam').onclick=()=>{if(!confirm('이 시험을 휴지통으로 이동할까요?'))return;if(y24Commit(()=>{if(e.archive){const reviews=detachArchiveReviews(t.archiveId);trashPush('analysisArchiveTest',{test:deep(t),reviews});DB.analysisArchive=DB.analysisArchive.filter(a=>a.archiveId!==t.archiveId);y230RebuildArchiveDerived();}else{trashPush('test',t);DB.tests=DB.tests.filter(a=>a.id!==t.id);}})){hideModal('y24ExamDetailModal');renderTests();}};
 if(!e.archive){$('#y24EditExam').onclick=()=>{hideModal('y24ExamDetailModal');y24OpenTestEditor(t);};$('#y24ReviewExam').onclick=()=>{hideModal('y24ExamDetailModal');openTestReviewModal(t.id);};}
 else {$('#y24ArchiveEdit').onclick=()=>{hideModal('y24ExamDetailModal');y24OpenTestEditor(t,true);};$$('.y230-q-del').forEach(b=>b.onclick=()=>{y230DeleteArchiveQuestion(b.dataset.archiveId,b.dataset.qkey);y24OpenExam(key);});$$('[data-y24-reactivate]').forEach(b=>b.onclick=()=>y24Reactivate(t,Number(b.dataset.y24Reactivate)));}
 showModal('y24ExamDetailModal');
}
function y24Reactivate(a,index){
 const q=a.questions?.[index];if(!q||!y220HasQuestionNumber(q))return;const existing=DB.tests.find(t=>t.archiveReviewOnly&&t.archiveRef===a.archiveId);if(existing?.questionRecords?.some(x=>x.number===Number(q.number)&&x.retryState!=='resolved')){hideModal('y24ExamDetailModal');openTestReviewModal(existing.id);return;}
 if(!confirm(`${a.subject} ${q.number}번을 현재 재풀이 대기에 넣을까요?`))return;
 let id;if(y24Commit(()=>{let t=existing;if(!t){id=uid();t={id,name:y24ExamTitle(a),date:viewDate,kind:'single',subject:a.subject,source:y24Source(a)||'기타',scope:'unknown',score:0,scoreMissing:true,archiveReviewOnly:true,archiveRef:a.archiveId,questionRecords:[]};DB.tests.push(t);}id=t.id;const nq=normalizeQuestionRecord({...deep(q),id:uid(),subject:a.subject,number:Number(q.number),note:q.directCause||q.note||'',retryState:'pending',evidenceStage:'pending',retryDue:viewDate,reactivatedFrom:a.archiveId},{subject:a.subject});const old=t.questionRecords.findIndex(x=>x.number===nq.number);if(old>=0)t.questionRecords[old]={...t.questionRecords[old],retryState:'pending',evidenceStage:'relapse',retryDue:viewDate};else t.questionRecords.push(nq);})){hideModal('y24ExamDetailModal');renderTests();openTestReviewModal(id);}
}
// Separate chart segments for known solve dates vs publication order, and for scopes.
function y24ChartRows(subject,f){
 let rows=y24Exams().filter(e=>f.source==='all'||y24Source(e.record)===f.source).flatMap(y24Rows).filter(r=>r.subject===subject);
 rows=rows.filter(r=>{const scope=r.archive?(r.test.scope||'full'):r.test.scope;return f.scope==='all'||scope==='full'||(f.scope==='representative'&&scope==='unknown');});
 return rows.sort((a,b)=>Number(a.date.known)-Number(b.date.known)||a.date.key.localeCompare(b.date.key)||a.examKey.localeCompare(b.examKey));
}
function y24Segment(r){const scope=r.archive?(r.test.scope||'full'):(r.test.scope||'unknown');return `${r.date.known?'dated':'session'}:${scope}${scope==='unknown'?':'+r.examKey:''}`;}
function y24LinePath(rows,value,x,y){let path='',last=null;rows.forEach((r,i)=>{const v=value(r),seg=y24Segment(r);if(v==null){last=null;return;}path+=`${last===seg?'L':'M'}${x(i).toFixed(2)},${y(v).toFixed(2)} `;last=seg;});return path.trim();}
function y24Timeline(r){return r.date.known?r.date.label.slice(5):y230TimelineLabel({__historical:true,historyLabel:r.test.examLabel||r.test.name,sortKey:r.date.key});}
renderRawScoreChart=function(subject,rows){
 const svg=$('#rawScoreChart'),max=subjectScoreLimit(subject);$('#scoreRangeLabel').textContent=`${max}점 / 1–9등급`;
 const W=760,H=300,L=48,R=48,T=30,B=65,iw=W-L-R,ih=H-T-B,x=i=>rows.length===1?L+iw/2:L+iw*i/Math.max(1,rows.length-1),ys=v=>T+ih*(1-v/max),yg=v=>T+ih*(v-1)/8;
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);const every=Math.max(1,Math.ceil(rows.length/6));
 const scorePath=y24LinePath(rows,r=>r.score,x,ys),gradePath=y24LinePath(rows,r=>r.grade>=1&&r.grade<=9?r.grade:null,x,yg);
 svg.innerHTML=`<text class="chart-axis-label" x="${L}" y="14">점수</text><text class="chart-axis-label" x="${W-R}" y="14" text-anchor="end">등급</text>${[0,max/2,max].map(v=>`<line class="chart-grid-line" x1="${L}" x2="${W-R}" y1="${ys(v)}" y2="${ys(v)}"/><text class="chart-axis-label" x="${L-10}" y="${ys(v)+4}" text-anchor="end">${v}</text>`).join('')}${[1,3,5,7,9].map(v=>`<text class="chart-axis-label" x="${W-R+12}" y="${yg(v)+4}">${v}</text>`).join('')}<path class="score-path" d="${scorePath}"/><path class="y24-grade-path" d="${gradePath}"/>${rows.map((r,i)=>{const text=`${y24ExamTitle(r.test)} · ${r.score==null?'점수 미입력':r.score+'점'} · ${r.grade?r.grade+'등급':'등급 미입력'}`;return`<g class="y24-chart-point" data-chart-i="${esc(i)}" role="button" tabindex="0" aria-label="${esc(text)}"><title>${esc(text)}</title><rect class="y24-chart-hit" x="${x(i)-16}" y="${T-5}" width="32" height="${ih+10}"/>${r.score==null?'':`<circle class="y24-score-dot" cx="${x(i)}" cy="${ys(r.score)}" r="5"/>`}${!r.grade?'':`<rect class="y24-grade-dot grade-${r.grade}" x="${x(i)-4}" y="${yg(r.grade)-4}" width="8" height="8" rx="2"/>`}${i%every===0||i===rows.length-1?`<text class="chart-axis-label" x="${x(i)}" y="${H-16}" text-anchor="middle">${esc(y24Timeline(r))}</text>`:''}</g>`;}).join('')}`;
 const select=i=>{const r=rows[i];if(!r)return;$('#y24ChartSelection').textContent=`${y24ExamTitle(r.test)} · ${r.date.known?r.date.label:y24Timeline(r)+' · 응시일 미입력'} · ${r.score==null?'점수 미입력':r.score+'점'} · ${r.grade?r.grade+'등급':'등급 미입력'}`;};
 $$('.y24-chart-point').forEach(g=>{g.onclick=()=>select(Number(g.dataset.chartI));g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(Number(g.dataset.chartI));}};});select(rows.length-1);if(typeof renderScoreSegmentLabels==='function')renderScoreSegmentLabels(rows);
};
renderGradeTrend=function(){$('#gradeTrend').innerHTML='';};
renderScoreAnalysis=function(){
 const f=analysisFilterState(),empty=$('#scoreAnalysisEmpty'),content=$('#scoreAnalysisContent');$('#scoreAnalysisCaption').hidden=true;
 if(f.subject==='all'){content.classList.add('hidden');empty.classList.remove('hidden');$('#scoreAnalysisTitle').textContent='전과목 성적';empty.innerHTML=`<div class="analysis-overview-list">${SUBJECTS.map(s=>{const r=y24ChartRows(s,f).at(-1);return`<button class="analysis-overview-row" data-y24-sub="${esc(s)}"><b>${s}</b><strong>${r?.score==null?'—':r.score+'점'}</strong><span>${r?.grade?r.grade+'등급':''}</span></button>`;}).join('')}</div>`;$$('[data-y24-sub]').forEach(b=>b.onclick=()=>{$('#analysisSubjectFilter').value=b.dataset.y24Sub;renderTests();});return;}
 const rows=y24ChartRows(f.subject,f);$('#scoreAnalysisTitle').textContent=`${f.subject} 성적 흐름`;
 content.classList.toggle('hidden',!rows.length);empty.classList.toggle('hidden',!!rows.length);if(!rows.length){empty.textContent='기록 없음';return;}
 renderRawScoreChart(f.subject,rows);renderGradeTrend(rows);y24RenderScoreInsight(f.subject,rows,f);renderQuestionPattern(f.subject,f);renderReviewQueues(f.subject);
};
function y24RenderScoreInsight(subject,rows,f){
 const dated=rows.filter(r=>r.date.known&&r.score!=null),latest=dated.at(-1)||rows.filter(r=>r.score!=null).at(-1),previous=latest?rows.filter(r=>r.score!=null&&y24Segment(r)===y24Segment(latest)).at(-2):null;
 const times=rows.filter(r=>r.date.known&&r.minutes>0),time=times.at(-1),checks=y21Checks(subject);
 $('#scoreInsight').innerHTML=`<div class="analysis-insight"><span>${latest?.date.known?'최근 원점수':'회차별 마지막 원점수'}</span><b>${latest?latest.score+'점':'—'}${latest&&previous?` · ${latest.score-previous.score>0?'+':''}${latest.score-previous.score}점`:''}</b></div><div class="analysis-insight"><span>최근 소요시간</span><b>${time?time.minutes+'분':'—'}</b></div><div class="analysis-insight"><span>현재 미해결</span><b>${checks.pending.length}문항${checks.recurring.length?' · 재발 '+checks.recurring.length:''}</b></div>`;
}
// Historical frequency is independent of the current review queue. Read-only projection.
questionPattern=function(subject,filters={}){
 const source=filters.source||'all',scope=filters.scope||'representative';
 let rows=y24Exams().filter(e=>source==='all'||y24Source(e.record)===source).flatMap(y24Rows).filter(r=>r.subject===subject);
 const scopeOf=r=>r.test.scope||(r.archive?'full':'unknown');
 if(scope==='representative'){
  const full=rows.filter(r=>scopeOf(r)==='full');
  if(full.length)rows=full;else{const nonUnit=rows.filter(r=>scopeOf(r)!=='unit');if(nonUnit.length)rows=nonUnit;}
 }else if(scope!=='all')rows=rows.filter(r=>scopeOf(r)===scope);
 rows.sort((a,b)=>Number(a.date.known)-Number(b.date.known)||a.date.key.localeCompare(b.date.key)||a.examKey.localeCompare(b.examKey));
 const tests=new Map(),stats=new Map();
 rows.forEach(r=>{
  const t=r.test,test={...t,id:r.archive?r.examKey:t.id,date:r.date.known?r.date.key:'',
   _patternExamKey:r.examKey,_patternOrder:`${r.date.known?'1':'0'}:${r.date.key}:${r.examKey}`,
   _patternLabel:`${r.date.known?r.date.label:(t.attemptPeriod?.label||t.round||'응시일 미입력')} · ${y24ExamTitle(t)}`};
  tests.set(test.id,test);
  const seen=new Set();
  (r.questions||[]).forEach(raw=>{
   const number=Number(raw.number);
   if(!Number.isInteger(number)||number<1||number>QUESTION_LIMITS[subject]||!['wrong','uncertain'].includes(raw.status))return;
   const key=number+':'+raw.status;if(seen.has(key))return;seen.add(key);
   const question={...raw,number,subject};
   // An archive is historical evidence, never a new pending review task.
   if(r.archive){
    const review=(DB.tests||[]).filter(t=>t.archiveReviewOnly&&t.archiveRef===r.test.archiveId).flatMap(t=>t.questionRecords||[]).find(q=>Number(q.number)===number&&(!q.subject||q.subject===subject));
    question.retryState=review?.retryState||'resolved';
   }
   const stat=stats.get(number)||{number,wrongTestIds:new Set(),uncertainTestIds:new Set(),entries:[]};
   (question.status==='wrong'?stat.wrongTestIds:stat.uncertainTestIds).add(test.id);
   stat.entries.push({test,question});stats.set(number,stat);
  });
 });
 return{rows,tests:[...tests.values()],attempts:tests.size,stats};
};
const y24PatternBase=renderQuestionPattern;
renderQuestionPattern=function(subject,f){y24PatternBase(subject,f);const p=questionPattern(subject,f);$('#questionHeatLegend').textContent='';if(p.attempts<3){$('#questionNumberGrid').innerHTML='<span class="y24-empty-inline">기록 부족</span>';$('#questionInsight').innerHTML='';}else{$$('#questionInsight .question-focus>span').forEach(el=>el.remove());}};
__impl_renderProtocolBoard=function(){const rows=SUBJECTS.map(s=>({s,rules:DB.subjectProtocols?.[s]||[]})).filter(x=>x.rules.length);$('#protocolBoard').innerHTML=rows.map(({s,rules})=>`<div class="protocol-row"><b>${s}</b><ol>${rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ol></div>`).join('')||'<span class="y24-empty-inline">—</span>';};
// Replace the old list renderer rather than rendering and then removing a duplicate archive.
y230RenderHistoricalTests=function(){};
__impl_renderTests=function(){renderTestSubjectBoard();renderTestAllSubjectSummary();renderStabilityBoard();renderProtocolBoard();renderScoreAnalysis();y24RenderExamList();renderErrorCauseSummary();renderReviewQueues(analysisFilterState().subject);renderLatestGrades();bindReviewActionButtons();};

// Reduced editor. Hidden legacy fields are never read or reset on save.
const y24NormalizeBase=__impl_normalizeTestRecord;
__impl_normalizeTestRecord=function(t){const out=y24NormalizeBase(t);if(t?.scope==='unknown')out.scope='unknown';return out;};
function y24FieldRow(subject,row={}){
 const fields=[['score','원점수',row.score],['grade','등급',row.grade],['wrong','오답 수',row.wrong],['minutes','소요시간(분)',row.minutes],['wrongQuestions','틀린 문항 번호',row.wrongQuestions],['uncertainQuestions','애매하지만 맞은 번호',row.uncertainQuestions],['abandoned','시간 없어 못 푼 번호',row.abandoned]];
 return `<section class="y24-subject-fields" data-subject="${esc(subject)}"><h4>${esc(subject)}</h4><div class="grid g3">${fields.map(([k,label,v])=>`<label>${label}<input class="input" data-exam-field="${esc(k)}" ${['score','grade','wrong','minutes'].includes(k)?`type="number" min="${k==='grade'?1:0}" ${k==='grade'?'max="9"':''}`:'type="text"'} value="${esc(v??'')}"></label>`).join('')}</div></section>`;
}
function y24EditorRows(t,archive=false){
 if(!t)return {};
 const entries=archive?[{subject:t.subject,score:t.score,grade:t.grade,wrong:(t.questions||[]).filter(q=>q.status==='wrong').length,minutes:t.minutes}]:y24Rows({record:t,archive:false,date:y24DateInfo(t),key:'test:'+t.id});
 return Object.fromEntries(entries.map(r=>[r.subject,{...r,wrongQuestions:archive?'':t.kind==='full'?t.wrongQuestionMap?.[r.subject]:t.wrongQuestions,uncertainQuestions:archive?'':t.kind==='full'?t.uncertainQuestionMap?.[r.subject]:t.uncertainQuestions,abandoned:archive?'':t.kind==='full'?t.abandonedQuestionMap?.[r.subject]:t.abandonedQuestions}]));
}
function y24ReadEditorRows(){const out={};$$('.y24-subject-fields').forEach(el=>{out[el.dataset.subject]=Object.fromEntries([...el.querySelectorAll('[data-exam-field]')].map(x=>[x.dataset.examField,x.value]));});return out;}
function y24RenderEditorFields(){
 const current=y24ReadEditorRows();Object.assign(y24State.editor.rows,current);const subject=$('#testSubject').value;
 $('#y24TestFields').innerHTML=(subject==='all'?SUBJECTS:[subject]).map(s=>y24FieldRow(s,y24State.editor.rows[s])).join('');
 if(y24State.editor.archive)$$('[data-exam-field="wrong"],[data-exam-field="wrongQuestions"],[data-exam-field="uncertainQuestions"],[data-exam-field="abandoned"]').forEach(x=>x.closest('label').remove());
}
function y24OpenTestEditor(t=null,archive=false){
 y24State.editor={original:t?deep(t):null,archive,rows:y24EditorRows(t,archive)};
 $('#y24TestId').value=t?(archive?t.archiveId:t.id):'';$('#y24TestEditorTitle').textContent=t?'시험 수정':'시험 기록';$('#testName').value=t?y24ExamTitle(t):'';$('#testDate').value=t?(archive?t.solvedDate||'':t.date):viewDate;$('#testSource').value=t?y24Source(t):'';$('#testRound').value=t?.round||'';$('#testSubject').value=t?.kind==='full'?'all':t?.subject||'국어';$('#testSubject').disabled=!!t;$('#testMemo').value=t?.memo||'';
 $('#y24TestFields').innerHTML='';y24RenderEditorFields();showModal('testModal');
}
__impl_openTestModal=function(){y24OpenTestEditor();};
function y24ValidateExamRows(rows){
 for(const [subject,r] of Object.entries(rows)){
  for(const key of ['score','grade','wrong','minutes']){const n=y24Num(r[key]);if(n!=null&&(n<0||(key==='score'&&n>subjectScoreLimit(subject))||(key==='grade'&&(!Number.isInteger(n)||n<1||n>9))||(key==='wrong'&&(!Number.isInteger(n)||n>QUESTION_LIMITS[subject]))))return `${subject} ${key==='score'?'원점수':key==='grade'?'등급':key==='wrong'?'오답 수':'시간'}를 확인하세요.`;}
  for(const key of ['wrongQuestions','uncertainQuestions','abandoned'])if(!validQuestionInput(r[key],QUESTION_LIMITS[subject]))return subject+' 문항 번호를 확인하세요. 1~'+QUESTION_LIMITS[subject]+'의 정수를 쉼표나 공백으로 구분하세요.';
 }
 return '';
}
function validQuestionInput(value,limit){
 if(value==null||String(value).trim()==='')return true;
 const tokens=Array.isArray(value)?value:String(value).trim().split(/[\s,\/、]+/);
 return tokens.every(v=>/^\d+$/.test(String(v))&&Number(v)>=1&&Number(v)<=limit);
}
__impl_saveTestModal=function(){
 const state=y24State.editor;if(!state)return;const old=state.original,name=$('#testName').value.trim(),date=$('#testDate').value,source=$('#testSource').value,rows=y24ReadEditorRows(),error=y24ValidateExamRows(rows);
 if(!name){alert('시험명을 입력하세요.');return;}if(error){alert(error);return;}if(date&&!y231ValidDate(date)){alert('날짜를 확인하세요.');return;}if(!date&&!state.archive){alert('응시 날짜를 입력하세요.');return;}if(!source&&!old){alert('시험 구분을 선택하세요.');return;}
 if(state.archive){const a=DB.analysisArchive.find(t=>t.archiveId===old.archiveId);if(!a)return;const r=rows[a.subject];if(y24Commit(()=>Object.assign(a,{examLabel:name,solvedDate:date,source:source||a.source,score:y24Num(r.score),grade:y24Num(r.grade),minutes:y24Num(r.minutes),round:$('#testRound').value.trim(),memo:$('#testMemo').value.trim()}))){hideModal('testModal');renderTests();}return;}
 const selected=$('#testSubject').value,full=selected==='all',kind=full?'full':'single',common={...(old||{}),id:old?.id||uid(),kind,date,name,source:source||old?.source||'기타',round:$('#testRound').value.trim(),memo:$('#testMemo').value.trim()};
 common.scope=old?.scope||((source==='사설 모의고사'||/단원|부분/.test(name))?'unknown':'full');
 const existing=old?.questionRecords||[],removed=[];const nextQuestions=[];
 for(const [subject,r] of Object.entries(rows)){
  const numbers=new Set([...parseQuestionNumbers(r.wrongQuestions),...parseQuestionNumbers(r.uncertainQuestions),...parseQuestionNumbers(r.abandoned)]);
  const keep=existing.filter(q=>q.subject===subject&&numbers.has(q.number));removed.push(...existing.filter(q=>q.subject===subject&&!numbers.has(q.number)));
  const wrong=[...new Set([...parseQuestionNumbers(r.wrongQuestions),...parseQuestionNumbers(r.abandoned)])].join(', ');
  nextQuestions.push(...questionRecordsFromTexts(subject,wrong,r.uncertainQuestions,date,keep));
 }
 common.questionRecords=nextQuestions;
 common.questionCoverage={...(old?.questionCoverage||{}),...Object.fromEntries(Object.entries(rows).map(([s,r])=>[s,y252CoverageInput(r)]))};
 if(full){for(const [key,field] of Object.entries({scores:'score',grades:'grade',wrongs:'wrong',minutes:'minutes',wrongQuestionMap:'wrongQuestions',uncertainQuestionMap:'uncertainQuestions',abandonedQuestionMap:'abandoned'}))common[key]=Object.fromEntries(Object.entries(rows).map(([s,r])=>[s,['score','grade','wrong','minutes'].includes(field)?y24Num(r[field]):r[field]||'']));common.scoreMissingMap=Object.fromEntries(Object.entries(rows).map(([s,r])=>[s,y24Num(r.score)==null]));}
 else{const r=rows[selected];Object.assign(common,{subject:selected,score:y24Num(r.score),scoreMissing:y24Num(r.score)==null,grade:y24Num(r.grade),wrongCount:y24Num(r.wrong),minutes:y24Num(r.minutes),wrongQuestions:r.wrongQuestions||'',uncertainQuestions:r.uncertainQuestions||'',abandonedQuestions:r.abandoned||''});}
 const record=normalizeTestRecord(common);
 if(y24Commit(()=>{for(const q of removed)trashPush('questionV24',{testId:record.id,question:q,testName:name});const i=DB.tests.findIndex(t=>t.id===record.id);if(i<0)DB.tests.push(record);else DB.tests[i]=record;})){hideModal('testModal');renderTests();renderDashboard();}
};
const y24Restore2=restoreTrash;
restoreTrash=function(id){const e=DB.trash.find(x=>x.id===id);if(e?.type==='questionV24'){const t=DB.tests.find(t=>t.id===e.data.testId);if(!t){alert('시험을 먼저 복원하세요.');return;}if(y24Commit(()=>{if(!(t.questionRecords||[]).some(q=>q.subject===e.data.question.subject&&q.number===e.data.question.number))t.questionRecords.push(deep(e.data.question));DB.trash=DB.trash.filter(x=>x.id!==id);})){renderSettings();}return;}return y24Restore2(id);};
const y24TrashTitle2=trashTitle;
trashTitle=function(x){return x.type==='questionV24'?`${x.data.testName} · ${x.data.question.number}번`:y24TrashTitle2(x);};
// Reopened archived questions are current reviews, not extra score observations.
const y24SubjectHistory=subjectHistory;
subjectHistory=function(subject,f={}){return y24SubjectHistory(subject,f).filter(r=>!r.test.archiveReviewOnly);};
const y24SettingsBase=__impl_renderSettings;
__impl_renderSettings=function(){y24SettingsBase();if(typeof renderStorageManagement==='function')renderStorageManagement();$('#versionInfo').innerHTML=`<code>曆象 ${Y24_VERSION}<br>Data schema ${SCHEMA_VERSION}</code>`;};
__impl_renderVersionStatus=function(){const el=$('#runtimeStatus');if(el)el.textContent=APP_VERSION+(globalThis.YEOKSANG_WRITER===false?' · 읽기 전용':globalThis.YEOKSANG_SW_VERSION?' · 오프라인 '+globalThis.YEOKSANG_SW_VERSION:' · 온라인');};
document.addEventListener('DOMContentLoaded',()=>{
 $('#y24EmptyTrash').onclick=()=>y24PurgeTrash();$('#y24TestSearch').oninput=y24RenderExamList;$('#testSubject').onchange=y24RenderEditorFields;
 $('#y24SaveActual').onclick=y24SaveActual;$('#y24AsPlanned').onclick=y24AsPlanned;$('#y24AddExtra').onclick=y24AddExtra;
 $('#y24PreviewReport').onclick=()=>{$('#y24ReportText').value=todayRecordText();showModal('y24ReportModal');};$('#y24CopyReport').onclick=()=>copyText($('#y24ReportText').value);
 // Previous handlers were installed after all script definitions, so they see these overrides.
 $('#saveTask').onclick=saveTaskModal;$('#saveTest').onclick=saveTestModal;$('#addTestBtn').onclick=()=>y24OpenTestEditor();
});

let y24ExamTab='records';
function y24SetExamTab(tab){y24ExamTab=tab;for(const [name,id] of [['records','y24RecordsSection'],['charts','y24ChartsSection'],['rules','y24RulesSection']]){const el=document.getElementById(id);if(el)el.hidden=name!==tab;}$$('[data-y24-tab]').forEach(b=>b.classList.toggle('active',b.dataset.y24Tab===tab));}
const y24TestsFinal=__impl_renderTests;
__impl_renderTests=function(){y24TestsFinal();y24SetExamTab(y24ExamTab);$$('[data-y24-tab]').forEach(b=>b.onclick=()=>y24SetExamTab(b.dataset.y24Tab));if($('#y24RetryCount'))$('#y24RetryCount').textContent=`재풀이 대기 ${reviewEntries({subject:analysisFilterState().subject}).length}문항`;$$('.analysis-subject-jump').forEach(b=>b.onclick=()=>{$('#analysisSubjectFilter').value=b.dataset.subject;y24ExamTab='charts';renderTests();});};
renderTestSubjectBoard=function(){
 $('#testSubjectBoard').innerHTML=SUBJECTS.map(s=>{const rows=y24ChartRows(s,{source:'all',scope:'representative'}),r=rows.at(-1),pending=reviewEntries({subject:s}).length;return `<button type="button" class="test-subject-card ${subjectClass(s)} analysis-subject-jump" data-subject="${esc(s)}"><b>${s}</b><strong>${r?.score!=null?r.score+'점':r?.grade?r.grade+'등급':'—'}</strong><span>${r?esc(r.date.known?r.date.label:y24Timeline(r)):''}</span><small>${[r?.grade?r.grade+'등급':'',pending?'재풀이 '+pending:''].filter(Boolean).join(' · ')}</small></button>`;}).join('');
};
subjectHistory=function(subject,f={}){return y24SubjectHistory(subject,{...f,source:'all'}).filter(r=>!r.test.archiveReviewOnly&&(!f.source||f.source==='all'||y24Source(r.test)===f.source));};
// Preserve missing scores when importing final historical packages, including a real zero.
const y24HistoricalImport=y220HistoricalImport;
y220HistoricalImport=function(pkg){const ids=new Set((DB.analysisArchive||[]).map(a=>a.archiveId));y24HistoricalImport(pkg);for(const t of pkg.tests||[]){const a=(DB.analysisArchive||[]).find(a=>a.archiveId===`${pkg.packageId}:${t.id||t.examLabel}`);if(a&&!ids.has(a.archiveId))Object.assign(a,{score:y24Num(t.score),grade:y24Num(t.grade),source:t.source||'',scope:t.scope||'full',solvedDate:t.solvedDate||'',minutes:y24Num(t.minutes)});}};
const y24NavigateBase=__impl_navigate;
__impl_navigate=function(page){const old=document.querySelector('.page.active')?.id;if(old)pagePositions.set(old,globalThis.scrollY||0);y24NavigateBase(page);if(typeof globalThis.scrollTo==='function')globalThis.scrollTo(0,pagePositions.get(page)||0);};
