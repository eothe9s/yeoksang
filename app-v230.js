/* 曆象 2.3 — nine-week control, historical score flow, safe archive deletion */
'use strict';
const Y230_VERSION='2.3';
const Y230_FINAL_START='2026-11-09';

function y230Ensure(){
 y220Ensure();
 DB.meta=DB.meta&&typeof DB.meta==='object'?DB.meta:{};
}
function y230ArchiveSource(t){
 const label=String(t?.examLabel||t?.session||'');
 if(label.includes('수능'))return '수능';
 if(label.includes('평가원')||label.includes('6월')||label.includes('9월'))return '평가원 모의평가';
 return '기타';
}
function y230ArchiveSortKey(t){return String(t?.sortKey||t?.exactDate||t?.examLabel||'')}
function y230TimelineLabel(test){
 if(test?.__historical){
  const label=String(test.historyLabel||test.name||'');
  const year=(label.match(/(\d{4})학년도/)||[])[1];
  if(label.includes('수능'))return year?`${year} 수능`:'수능';
  if(label.includes('6월'))return year?`${year}.06`:'6월';
  if(label.includes('9월'))return year?`${year}.09`:'9월';
  return String(test.sortKey||label||'과거').replace('-', '.');
 }
 return String(test?.date||'').slice(5).replace('-','.');
}
function y230ArchiveAsRow(a){
 const source=y230ArchiveSource(a),test={id:`archive:${a.archiveId}`,date:y230ArchiveSortKey(a),sortKey:y230ArchiveSortKey(a),name:a.examLabel||'과거 시험',historyLabel:a.examLabel||'',source,scope:'full',kind:'single',subject:a.subject,score:Number(a.score)||0,grade:Number(a.grade)||0,minutes:0,__historical:true,archiveId:a.archiveId,packageId:a.packageId};
 return{subject:a.subject,score:Number(a.score)||0,grade:Number(a.grade)||0,wrong:(a.questions||[]).filter(q=>q.status==='wrong').length,minutes:0,questions:[],wrongQuestions:[],uncertainQuestions:[],test};
}
function y230ScoreHistory(subject,{source='all',scope='representative'}={}){
 const active=subjectHistory(subject,{source,scope});
 const activeNames=new Set(active.map(r=>`${r.test.name||''}|${r.score||0}|${r.grade||0}`));
 let archive=(DB.analysisArchive||[]).filter(a=>a.subject===subject).filter(a=>source==='all'||y230ArchiveSource(a)===source).map(y230ArchiveAsRow);
 if(scope==='full'||scope==='representative'||scope==='all'){}
 archive=archive.filter(r=>!activeNames.has(`${r.test.name||''}|${r.score||0}|${r.grade||0}`));
 return [...archive,...active].sort((a,b)=>String(a.test.sortKey||a.test.date||'').localeCompare(String(b.test.sortKey||b.test.date||'')));
}

// Historical tests belong to score history, but never to active retry/priority queues.
const y230RenderScoreAnalysisBase=renderScoreAnalysis;
renderScoreAnalysis=function(){
 const f=analysisFilterState(),empty=$('#scoreAnalysisEmpty'),content=$('#scoreAnalysisContent');if(!empty||!content)return;
 if(f.subject==='all'){
  $('#scoreAnalysisTitle').textContent='전과목 조망';$('#scoreAnalysisCaption').textContent='과거 성적 흐름과 현재 기록을 함께 봅니다.';content.classList.add('hidden');empty.classList.remove('hidden');
  empty.innerHTML=`<div class="analysis-overview-list">${SUBJECTS.map(subject=>{const rows=y230ScoreHistory(subject,{source:f.source,scope:f.scope}),latest=rows.at(-1),prev=rows.at(-2),delta=latest?.score&&prev?.score?latest.score-prev.score:null,pending=reviewEntries({subject}).length;return `<button type="button" class="analysis-overview-row analysis-subject-jump" data-subject="${esc(subject)}"><span class="subject-dot ${subjectClass(subject)}"></span><b>${subject}</b><strong>${latest?(latest.score?`${latest.score}점`:(latest.grade?`${latest.grade}등급`:'기록만 있음')):'기록 없음'}</strong><small>${latest?.grade?`${latest.grade}등급 · `:''}${delta==null?'추이 대기':`최근 ${delta>0?'+':''}${delta}점`} ${pending?`· 현재 재풀이 ${pending}`:''}</small></button>`}).join('')}</div><div class="muted analysis-overview-note">과거 오답 아카이브는 성적 흐름에만 포함되고 현재 미해결·우선순위에는 자동 반영되지 않습니다.</div>`;
  $$('.analysis-subject-jump').forEach(b=>b.onclick=()=>{const selector=$('#analysisSubjectFilter');if(selector){selector.value=b.dataset.subject;renderTests()}});return;
 }
 const rows=y230ScoreHistory(f.subject,{source:f.source,scope:f.scope});$('#scoreAnalysisTitle').textContent=`${f.subject} 성적 흐름`;$('#scoreAnalysisCaption').textContent=`${f.scope==='representative'?'대표 시험 우선':f.scope==='full'?'전범위 시험만':'입력한 전체 범위'} · ${f.source==='all'?'전체 출처':testSourceLabel(f.source)}`;
 if(!rows.length){content.classList.add('hidden');empty.classList.remove('hidden');empty.textContent='선택한 조건의 성적 기록이 없습니다.';return}
 empty.classList.add('hidden');content.classList.remove('hidden');renderRawScoreChart(f.subject,rows);renderGradeTrend(rows);renderScoreInsight(f.subject,rows,f);renderQuestionPattern(f.subject,f);renderReviewQueues(f.subject);
};
renderRawScoreChart=function(subject,rows){
 const svg=$('#rawScoreChart'),range=$('#scoreRangeLabel');if(!svg)return;const scoreRows=rows.filter(r=>r.score>0),limit=subjectScoreLimit(subject);if(range)range.textContent=`${limit}점 만점`;
 if(!scoreRows.length){svg.setAttribute('viewBox','0 0 620 150');svg.innerHTML='<text x="310" y="75" text-anchor="middle" class="chart-empty">원점수를 입력하면 추세선이 표시됩니다.</text>';return}
 const W=620,H=235,L=44,R=18,T=20,B=42,innerW=W-L-R,innerH=H-T-B,y=v=>T+innerH-(v/limit)*innerH,x=i=>scoreRows.length===1?L+innerW/2:L+i*(innerW/(scoreRows.length-1)),points=scoreRows.map((r,i)=>({x:x(i),y:y(clamp(r.score,0,limit)),r,i})),path=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),ticks=[0,Math.round(limit/2),limit],labelEvery=Math.max(1,Math.ceil(scoreRows.length/7));
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML=`${ticks.map(v=>`<g><line class="chart-grid-line" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"></line><text class="chart-axis-label" x="${L-7}" y="${y(v)+3}" text-anchor="end">${v}</text></g>`).join('')}<path class="score-path" d="${path}"></path>${points.map((p,i)=>`<g class="score-point${p.r.test.__historical?' historical':''}"><circle cx="${p.x}" cy="${p.y}" r="5"></circle><text class="chart-point-label" x="${p.x}" y="${p.y-10}" text-anchor="middle">${p.r.score}</text>${(i%labelEvery===0||i===points.length-1)?`<text class="chart-axis-label" x="${p.x}" y="${H-17}" text-anchor="middle">${esc(y230TimelineLabel(p.r.test))}</text>`:''}</g>`).join('')}`;
};
renderGradeTrend=function(rows){
 const box=$('#gradeTrend');if(!box)return;const graded=rows.filter(r=>r.grade);box.innerHTML=graded.length?`<div class="grade-trend-title">등급 추이</div>${graded.map(r=>`<div class="grade-trend-item"><b class="grade-dot grade-${clamp(r.grade,1,9)}">${r.grade}</b><span>${esc(y230TimelineLabel(r.test))}<small>${esc(testSourceLabel(r.test.source))}${r.test.__historical?' · 과거 분석':''}</small></span></div>`).join('')}`:'<div class="muted">등급 기록이 없습니다.</div>';
};
const y230TestRecordShortLabelBase=testRecordShortLabel;
testRecordShortLabel=function(t){return t?.__historical?`${y230TimelineLabel(t)} · ${testSourceLabel(t.source)} · 과거 분석`:y230TestRecordShortLabelBase(t)};

// ----- safe deletion / trash for imported analysis -----
function y230QuestionKey(q){return `${q?.sourcePage||''}|${q?.sourceSlot||''}|${q?.number??''}|${q?.status||''}`}
function y230RebuildArchiveDerived(){
 y230Ensure();
 const observations=[],groups=new Map();
 for(const t of DB.analysisArchive||[])for(const q of t.questions||[]){
  if(!y220HasQuestionNumber(q))observations.push({id:`${t.archiveId}:${q.sourcePage||0}:${q.sourceSlot||''}`,packageId:t.packageId,subject:t.subject,examLabel:t.examLabel,sourcePage:q.sourcePage||null,sourceSlot:q.sourceSlot||'',type:q.type||'',pattern:q.pattern||'',directCause:q.directCause||'',note:q.note||''});
  if(q.pattern){const k=`${t.packageId}|${t.subject}|${q.pattern}`,g=groups.get(k)||{subject:t.subject,pattern:q.pattern,count:0,examples:[],packageId:t.packageId,sourceFile:(DB.analysisImports||[]).find(x=>x.packageId===t.packageId)?.sourceFile||'',importedAt:new Date().toISOString()};g.count++;if(g.examples.length<5)g.examples.push({examLabel:t.examLabel,number:q.number??null});groups.set(k,g)}
 }
 DB.analysisObservations=observations;DB.analysisPatterns=[...groups.values()];
}
function y230DeleteArchiveQuestion(archiveId,key){
 const t=(DB.analysisArchive||[]).find(x=>x.archiveId===archiveId);if(!t)return;const i=(t.questions||[]).findIndex(q=>y230QuestionKey(q)===key);if(i<0)return;if(!confirm('이 문항 분석을 휴지통으로 이동할까요?'))return;const ok=commitChange(()=>{const q=t.questions[i],reviews=detachArchiveReviews(archiveId,q.number);trashPush('analysisArchiveQuestion',{archiveId,reviews,question:deep(q),index:i,examLabel:t.examLabel});t.questions.splice(i,1);y230RebuildArchiveDerived();});if(ok){renderTests();renderAnalysis();}
}
function y230DeleteArchiveTest(archiveId){
 const t=(DB.analysisArchive||[]).find(x=>x.archiveId===archiveId);if(!t)return;if(!confirm(`${t.examLabel||'과거 시험'} 기록을 휴지통으로 이동할까요?`))return;const ok=commitChange(()=>{const reviews=detachArchiveReviews(archiveId);trashPush('analysisArchiveTest',{test:deep(t),reviews});DB.analysisArchive=DB.analysisArchive.filter(x=>x.archiveId!==archiveId);y230RebuildArchiveDerived();});if(ok){renderTests();renderAnalysis();}
}
function y230DeletePackage(packageId){
 const imp=(DB.analysisImports||[]).find(x=>x.packageId===packageId);if(!imp)return;if(!confirm(`${imp.sourceFile||'분석 패키지'} 전체를 휴지통으로 이동할까요?`))return;
 const ok=commitChange(()=>{
 const activeFragments=[];for(const t of DB.tests||[]){const removed=(t.questionRecords||[]).filter(q=>q.analysisMeta?.packageId===packageId);const sourceMatch=String(t.analysisSourceKey||'').includes(packageId);if(removed.length||sourceMatch){activeFragments.push({testId:t.id,testSnapshot:deep(t),questions:deep(removed),analysisSourceKey:sourceMatch?t.analysisSourceKey:''});t.questionRecords=(t.questionRecords||[]).filter(q=>q.analysisMeta?.packageId!==packageId);if(sourceMatch)delete t.analysisSourceKey}}
 const reviews=(DB.analysisArchive||[]).filter(x=>x.packageId===packageId).map(x=>detachArchiveReviews(x.archiveId));const bundle={packageId,reviews,importRow:deep(imp),archiveTests:deep((DB.analysisArchive||[]).filter(x=>x.packageId===packageId)),activeFragments};
 trashPush('analysisPackage',bundle);DB.analysisArchive=(DB.analysisArchive||[]).filter(x=>x.packageId!==packageId);DB.analysisImports=(DB.analysisImports||[]).filter(x=>x.packageId!==packageId);y230RebuildArchiveDerived();});if(ok){renderTests();renderAnalysis();}
}
const y230TrashTitleBase=trashTitle;
trashTitle=function(x){if(x.type==='analysisArchiveTest')return`과거 시험 · ${x.data?.test?.examLabel||''}`;if(x.type==='analysisArchiveQuestion')return`과거 문항 · ${x.data?.examLabel||''}`;if(x.type==='analysisPackage')return`분석 패키지 · ${x.data?.importRow?.sourceFile||x.data?.packageId||''}`;return y230TrashTitleBase(x)};
const y230RestoreTrashBase=restoreTrash;
restoreTrash=function(id){
 const i=DB.trash.findIndex(x=>x.id===id);if(i<0)return;const x=DB.trash[i];
 if(x.type==='analysisArchiveTest'){
  const t=deep(x.data.test);if(!(DB.analysisArchive||[]).some(a=>a.archiveId===t.archiveId))DB.analysisArchive.push(t);restoreArchiveReviews(x.data.reviews);DB.trash.splice(i,1);y230RebuildArchiveDerived();saveDB();renderSettings();return;
 }
 if(x.type==='analysisArchiveQuestion'){
  const t=(DB.analysisArchive||[]).find(a=>a.archiveId===x.data.archiveId);if(t){t.questions=t.questions||[];const q=deep(x.data.question);if(!t.questions.some(a=>y230QuestionKey(a)===y230QuestionKey(q)))t.questions.splice(Math.min(Number(x.data.index)||0,t.questions.length),0,q)}restoreArchiveReviews(x.data.reviews);DB.trash.splice(i,1);y230RebuildArchiveDerived();saveDB();renderSettings();return;
 }
 if(x.type==='analysisPackage'){
  const b=deep(x.data);for(const t of b.archiveTests||[])if(!(DB.analysisArchive||[]).some(a=>a.archiveId===t.archiveId))DB.analysisArchive.push(t);for(const f of b.activeFragments||[]){let t=(DB.tests||[]).find(a=>a.id===f.testId);if(!t&&f.testSnapshot){DB.tests.push(deep(f.testSnapshot));continue}if(t){const keys=new Set((t.questionRecords||[]).map(q=>`${q.subject}:${q.number}:${q.id||''}`));for(const q of f.questions||[]){const k=`${q.subject}:${q.number}:${q.id||''}`;if(!keys.has(k)){t.questionRecords.push(deep(q));keys.add(k)}}if(f.analysisSourceKey)t.analysisSourceKey=f.analysisSourceKey}}if(b.importRow&&!(DB.analysisImports||[]).some(a=>a.packageId===b.importRow.packageId))DB.analysisImports.push(b.importRow);for(const reviews of b.reviews||[])restoreArchiveReviews(reviews);DB.trash.splice(i,1);y230RebuildArchiveDerived();saveDB();renderSettings();return;
 }
 return y230RestoreTrashBase(id);
};

function y230ArchiveFiltered(){
 y230Ensure();const source=$('#testSourceFilter')?.value||'all',subject=$('#testSubjectFilter')?.value||'all',scope=$('#testScopeFilter')?.value||'all';
 return (DB.analysisArchive||[]).filter(t=>{if(subject!=='all'&&t.subject!==subject)return false;if(source!=='all'&&y230ArchiveSource(t)!==source)return false;if(scope!=='all'&&scope!=='full')return false;return true}).sort((a,b)=>y230ArchiveSortKey(b).localeCompare(y230ArchiveSortKey(a)));
}
function y230ArchiveQuestionRow(t,q){const no=y220HasQuestionNumber(q)?`${Number(q.number)}번`:'번호 미확인',state=q.status==='uncertain'?'맞았지만 흔들림':q.status==='wrong'?'오답':'기록',reason=q.directCause||q.note||'',tag=[q.type,q.pattern].filter(Boolean).join(' · '),key=y230QuestionKey(q);return `<div class="archive-q-row"><div class="archive-q-main"><div><b>${y220Esc(no)} · ${y220Esc(state)}</b>${tag?`<span>${y220Esc(tag)}</span>`:''}</div><button class="text-link y230-q-del" data-archive-id="${y220Esc(t.archiveId)}" data-qkey="${y220Esc(key)}">삭제</button></div>${reason?`<p>${y220Esc(reason)}</p>`:''}${q.controlRule?`<small>다음 규칙 · ${y220Esc(q.controlRule)}</small>`:''}</div>`}
function y230RenderHistoricalTests(){
 const box=$('#testList');if(!box)return;const rows=y230ArchiveFiltered();box.querySelectorAll('.y221-history-section,.y230-history-section').forEach(x=>x.remove());if(!rows.length)return;
 const wrap=document.createElement('section');wrap.className='y230-history-section';wrap.innerHTML=`<div class="y221-history-head"><div><b>가져온 과거 시험</b><span>성적 흐름에는 포함 · 현재 미해결과 오늘 판단에는 자동 반영하지 않음</span></div><span class="badge">${rows.length}회</span></div>${rows.map(t=>{const qs=t.questions||[];return `<article class="test-card y221-history-card"><div class="test-top"><div><div><span class="kind-pill">${y220Esc(y230ArchiveSource(t))}</span><span class="scope-pill">오답파일 분석</span></div><b>${y220Esc(t.examLabel||'과거 시험')}</b><div class="task-meta">${t.score?`${t.score}점`:''}${t.grade?` · ${t.grade}등급`:''}${qs.length?` · 분석 ${qs.length}개`:''}</div></div><div class="row"><button class="btn danger small y230-archive-del" data-archive-id="${y220Esc(t.archiveId)}">삭제</button></div></div>${qs.length?`<details class="y221-history-details"><summary>문항 분석 보기</summary><div class="archive-q-list">${qs.map(q=>y230ArchiveQuestionRow(t,q)).join('')}</div></details>`:''}</article>`}).join('')}`;box.appendChild(wrap);
 $$('.y230-archive-del').forEach(b=>b.onclick=()=>y230DeleteArchiveTest(b.dataset.archiveId));$$('.y230-q-del').forEach(b=>b.onclick=()=>y230DeleteArchiveQuestion(b.dataset.archiveId,b.dataset.qkey));
}
const y230RenderTestsBase=__impl_renderTests;
__impl_renderTests=function(){y230RenderTestsBase();y230RenderHistoricalTests()};

function y230EnhanceArchiveBoard(){
 const box=$('#analysisArchiveBoard');if(!box)return;y230Ensure();const imports=DB.analysisImports||[];box.querySelector('.y230-package-list')?.remove();if(!imports.length)return;const sec=document.createElement('div');sec.className='y230-package-list';sec.innerHTML=`<h4>가져온 분석 파일</h4>${imports.map(x=>`<div class="y230-package-row"><div><b>${y220Esc(x.sourceFile||x.packageId)}</b><span>${y220Esc(x.subject||'')} · ${new Date(x.importedAt).toLocaleDateString('ko-KR')}</span></div><button class="btn danger small y230-package-del" data-package-id="${y220Esc(x.packageId)}">전체 삭제</button></div>`).join('')}`;box.appendChild(sec);$$('.y230-package-del').forEach(b=>b.onclick=()=>y230DeletePackage(b.dataset.packageId));
}
const y230RenderAnalysisBase=__impl_renderAnalysis;
__impl_renderAnalysis=function(){y230RenderAnalysisBase();y230EnhanceArchiveBoard()};

// ----- final package only -----
function y230PackageUnresolved(pkg){
 const qs=(pkg?.tests||[]).flatMap(t=>t.questions||[]),unresolved=[];if(pkg?.reviewStatus!=='final')unresolved.push('reviewStatus');if(Array.isArray(pkg?.unresolved)&&pkg.unresolved.length)unresolved.push(...pkg.unresolved.map(x=>x?.message||x?.code||String(x)));qs.forEach(q=>{if(q?.analysisStatus==='unresolved'||q?.analysisStatus==='draft'||q?.numberConfidence==='unresolved')unresolved.push(`${q?.sourcePage||'?'}p 미확정`);const prov=q?.provenance||{};if(Object.values(prov).some(v=>v==='model-inferred-unreviewed'))unresolved.push(`${q?.sourcePage||'?'}p 미검토 추론`)});return [...new Set(unresolved)]
}
y220ValidatePackage=function(pkg){return !!(pkg&&pkg.kind===Y220_PACKAGE_KIND&&[1,2].includes(Number(pkg.schemaVersion))&&pkg.packageId&&Array.isArray(pkg.tests))};
const y230PreviewBase=y220PreviewPackage;
y220PreviewPackage=function(pkg){y230PreviewBase(pkg);const box=$('#analysisPackagePreview'),btn=$('#applyAnalysisPackage');if(!box)return;const unresolved=y230PackageUnresolved(pkg),final=pkg.reviewStatus==='final'&&!unresolved.length,note=document.createElement('div');note.className=final?'banner':'banner warn';note.textContent=final?'대화 검토가 끝난 완성 분석본입니다.':'초안 또는 미확정 항목이 남아 있습니다. 최종 파일만 가져올 수 있습니다.';box.prepend(note);if(btn)btn.disabled=btn.disabled||!final};
const y230ApplyBase=y220ApplyPackage;
y220ApplyPackage=function(){const pkg=Y220_PENDING_PACKAGE;if(!pkg)return;const unresolved=y230PackageUnresolved(pkg);if(pkg.reviewStatus!=='final'||unresolved.length){alert('완성 분석본만 가져올 수 있습니다.');return}return y230ApplyBase()};

// ----- nine-week planning controls -----
function y230HasPlan(date){const tasks=(DB.tasks?.[date]||[]),assigned=(DB.schedules?.[date]||[]).some(b=>(b.taskIds||[]).length);return tasks.length>0||assigned||Boolean(DB.planLocks?.[date])}
function y230WeeklyOutlook(date=viewDate){
 const end=addDays(date,6),plans=curriculumRowsV90().map(r=>coursePlanV10(r,date)).filter(p=>!p.stopped&&p.workload.included!==false),cap=Array.from({length:7},(_,i)=>capacityHoursFor(addDays(date,i))).reduce((s,n)=>s+n,0);let low=0,high=0,unknown=0;
 for(const p of plans){if(p.workload.unknown){unknown++;continue}const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date,target=p.target||deadlineDate();if(target<date||start>end)continue;const totalDays=Math.max(1,daysBetween(start,target)+1),overlapStart=start>date?start:date,overlapEnd=target<end?target:end,overlap=Math.max(0,daysBetween(overlapStart,overlapEnd)+1);low+=p.workload.low/60*(overlap/totalDays);high+=p.workload.high/60*(overlap/totalDays)}return{low,high,cap,unknown,end};
}
function y230CourseRisk(p,date=viewDate){
 if(p.workload.unknown)return{state:'미정',className:'',detail:'시간 근거 미정'};if(p.total!=null&&p.done>=p.total)return{state:'완료',className:'ok',detail:'진도 완료'};if(p.target<date)return{state:'지연',className:'bad',detail:'목표일 경과'};const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date,days=Math.max(1,daysBetween(start,p.target)+1),cap=Array.from({length:days},(_,i)=>capacityHoursFor(addDays(start,i))).reduce((s,n)=>s+n,0),low=p.workload.low/60,high=p.workload.high/60;if(low>cap+.05)return{state:'마감 불가',className:'bad',detail:`최소 ${low.toFixed(1)}h > 남은 가용 ${cap.toFixed(1)}h`};if(high>cap+.05)return{state:'상한 위험',className:'warn',detail:`상한 ${high.toFixed(1)}h > 남은 가용 ${cap.toFixed(1)}h`};return{state:'가능',className:'ok',detail:`남은 ${low.toFixed(1)}–${high.toFixed(1)}h / 가용 ${cap.toFixed(1)}h`};
}
function y230ReactivationActive(date=viewDate){return Boolean(DB.meta?.reactivationUntil&&DB.meta.reactivationUntil>=date)}
function y230ToggleReactivation(){y230Ensure();if(y230ReactivationActive()){delete DB.meta.reactivationUntil}else DB.meta.reactivationUntil=addDays(todayDate(),2);saveDB();renderDashboard()}

const y230DecisionPlanBase=decisionPlanV10;
decisionPlanV10=function(date=viewDate){const p=y230DecisionPlanBase(date),react=y230ReactivationActive(date);for(const x of p.rows){const pending=x.check?.pending||[];const rule=pending.find(e=>e.question?.controlRule)?.question?.controlRule;if(rule&&!x.reasons.some(r=>r.includes(rule)))x.reasons.push(`다음 확인: ${rule}`);if(x.shortage>.01)x.action=`${minuteLabel(Math.ceil(x.shortage*60))} 추가 검토`;else if(x.check?.recurring?.length)x.action='계획 안에서 재발 오류 확인';else if(x.check?.pending?.length)x.action='계획 안에서 해결 확인';else if(x.unknown)x.action='시간 근거 확인';else if(react&&x.planned<=.01)x.action='오늘 계획에 다시 넣기';else x.action='현재 계획 유지'}if(react)p.rows.sort((a,b)=>Number(b.manual)-Number(a.manual)||Number(a.planned>0)-Number(b.planned>0)||b.overdue-a.overdue||b.shortage-a.shortage||b.check.recurring.length-a.check.recurring.length||SUBJECTS.indexOf(a.subject)-SUBJECTS.indexOf(b.subject));p.reactivation=react;return p};
renderDecisionBoardV10=function(){
 const box=$('#decisionBoard');if(!box)return;const p=decisionPlanV10(viewDate),badge=$('#decisionConfidence');if(badge)badge.textContent=p.reactivation?`재가동 · 미정 ${p.load.unknown.length+p.plan.unknown}개`:`미정 ${p.load.unknown.length+p.plan.unknown}개 · 가용 ${p.cap.toFixed(1)}h`;
 const empty=p.rows.filter(x=>x.planned<=.01).length,summary=p.reactivation?`재가동 중 · 비어 있는 과목 ${empty}개부터 계획에 다시 올립니다.`:p.overload?`계획 ${(p.plan.total/60).toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h · 초과분 조정 필요`:`계획 ${(p.plan.total/60).toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h`;
 box.innerHTML=`<div class="decision-summary ${p.overload?'risk':''}"><b>${p.reactivation?'재가동':'계획 조정'}</b><span>${summary}</span></div><div class="decision-list">${p.rows.map(x=>`<article class="decision-row ${x.manual?'manual':''}"><div><b>${esc(x.subject)}</b><small>${esc(x.action)}</small><details><summary>근거</summary>${x.reasons.map(r=>`<p>${esc(r)}</p>`).join('')}</details></div><strong>${x.planned.toFixed(1)}h 계획</strong><button class="text-link decision-pin" data-sub="${esc(x.subject)}">${x.manual?'우선 해제':'오늘 우선'}</button></article>`).join('')}</div><details class="y21-checks"><summary>학습 점검 · 현재 미해결 ${p.rows.reduce((s,x)=>s+x.check.pending.length,0)}건</summary>${p.rows.map(x=>`<div class="y21-check-row"><b>${x.subject}</b><span>미해결 ${x.check.pending.length}${x.check.recurring.length?` · 재발 ${x.check.recurring.length}`:''}</span><button class="btn ghost small" data-y21-review="${esc(x.subject)}">점검</button></div>`).join('')}</details>`;
 $$('.decision-pin').forEach(b=>b.onclick=()=>{DB.planOverrides=DB.planOverrides||{};if(DB.planOverrides[viewDate]?.subject===b.dataset.sub)delete DB.planOverrides[viewDate];else DB.planOverrides[viewDate]={subject:b.dataset.sub,reason:'직접 지정',at:Date.now()};saveDB();renderDashboard()});$$('[data-y21-review]').forEach(b=>b.onclick=()=>{const q=y21Checks(b.dataset.y21Review).pending[0];if(q)openTestReviewModal(q.test.id);else navigate('tests')});$('#decisionOverrideState').textContent=p.override?`직접 지정: ${p.override.subject}`:'';
};

const y230DashboardBase=__impl_renderDashboard;
__impl_renderDashboard=function(){
 y230DashboardBase();const load=curriculumLoadV90(viewDate),plan=y21Plan(viewDate),hasPlan=y230HasPlan(viewDate),planH=plan.total/60,weekly=y230WeeklyOutlook(viewDate),need=$('#todayNeedHours');
 if(need)need.textContent=need.textContent.replace(/^확정\s*/, '');
 const gap=$('#todayPlanGap'),caption=$('#todayPlanGapCaption');if(gap){let text='';let risk=false;if(!hasPlan){text='아직 계획 안 됨'}else if(planH>load.todayCap+.05){text=`${(planH-load.todayCap).toFixed(1)}h 가용 초과`;risk=true}else if(planH<load.todayLow-.01){text=`${(load.todayLow-planH).toFixed(1)}h 부족`;risk=true}else if(load.unknown.length||plan.unknown){text='일부 미정'}else if(planH>load.todayHigh+.01){text=`+${(planH-load.todayHigh).toFixed(1)}h 추가`}else{text='필요 범위'}gap.textContent=text;gap.classList.toggle('metric-risk',risk);if(caption)caption.textContent=!hasPlan?`필요 ${load.todayLow.toFixed(1)}–${load.todayHigh.toFixed(1)}h`:`계획 ${planH.toFixed(1)}h${load.unknown.length||plan.unknown?' · 일부 미정':''}`}
 const w=$('#weeklyOutlook');if(w){const diff=weekly.cap-weekly.high;w.innerHTML=`주간 <b>${weekly.low.toFixed(1)}–${weekly.high.toFixed(1)}h / 가용 ${weekly.cap.toFixed(1)}h</b>${weekly.unknown?`<small>미정 ${weekly.unknown}</small>`:diff<-.05?`<small class="risk-text">${(-diff).toFixed(1)}h 부족</small>`:'<small>범위 계산</small>'}`}
 const btn=$('#reactivationBtn');if(btn){btn.textContent=y230ReactivationActive(viewDate)?'재가동 종료':'재가동 3일';btn.classList.toggle('active',y230ReactivationActive(viewDate))}
 if(viewDate>=Y230_FINAL_START&&viewDate<'2026-11-19'){const banner=$('#overloadBanner');if(banner&&!banner.textContent){banner.classList.remove('hidden');banner.textContent='마지막 10일 보호 · 새 진도 자동배치를 멈추고 오답·기출·실전 확인을 우선합니다.'}}
};

const y230ProgressBase=__impl_renderProgress;
__impl_renderProgress=function(){y230ProgressBase();const box=$('#deadlineRiskBoard');if(!box)return;const plans=curriculumRowsV90().map(r=>coursePlanV10(r,viewDate)).filter(p=>p.workload.included!==false&&!(p.total!=null&&p.done>=p.total)),rows=plans.map(p=>({p,r:y230CourseRisk(p,viewDate)})),risky=rows.filter(x=>['지연','마감 불가','상한 위험'].includes(x.r.state));box.innerHTML=risky.length?`<div class="deadline-risk-list">${risky.slice(0,8).map(({p,r})=>`<div class="deadline-risk-row ${r.className}"><b>${esc(p.name)}</b><span>${r.state}</span><small>${esc(r.detail)} · 목표 ${String(p.target||'').slice(5)}</small></div>`).join('')}</div>`:'<div class="muted">현재 확정 시간 기준으로 즉시 마감 불가 판정된 과정은 없습니다.</div>'};

// Do not alter historical score data when calculating active priorities.
// Existing y21Questions/reviewEntries intentionally read DB.tests only.

const y230SettingsBase=__impl_renderSettings;
__impl_renderSettings=function(){y230SettingsBase();if($('#versionInfo'))$('#versionInfo').innerHTML=`<code>曆象 2.3<br>Data schema ${SCHEMA_VERSION}<br>9주 운영 · 과거 성적 흐름 · 안전 삭제</code>`};
__impl_renderVersionStatus=()=>{$('#runtimeStatus').textContent='2.3 · SW 2.3'};

document.addEventListener('DOMContentLoaded',()=>{
 y230Ensure();const btn=$('#reactivationBtn');if(btn)btn.onclick=y230ToggleReactivation;setTimeout(()=>{y230RenderHistoricalTests();y230EnhanceArchiveBoard()},80);
});
