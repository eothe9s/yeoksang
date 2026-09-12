'use strict';
const Y220_PACKAGE_KIND='yeoksang-analysis-package';
const Y220_CONTEXT_KIND='yeoksang-analysis-context';
let Y220_PENDING_PACKAGE=null;
function y220Ensure(){
 DB.analysisArchive=Array.isArray(DB.analysisArchive)?DB.analysisArchive:[];
 DB.analysisPatterns=Array.isArray(DB.analysisPatterns)?DB.analysisPatterns:[];
 DB.analysisObservations=Array.isArray(DB.analysisObservations)?DB.analysisObservations:[];
 DB.analysisImports=Array.isArray(DB.analysisImports)?DB.analysisImports:[];
 DB.meta=DB.meta&&typeof DB.meta==='object'?DB.meta:{};
}
function y220Esc(v){return esc(String(v??''))}
function y220HasQuestionNumber(q){const raw=q?.number;if(raw===null||raw===undefined||raw==='')return false;const n=Number(raw);return Number.isInteger(n)&&n>0}
function y220Download(name,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function y220PackageStats(pkg){const tests=Array.isArray(pkg.tests)?pkg.tests:[],questions=tests.flatMap(t=>Array.isArray(t.questions)?t.questions:[]),unknown=questions.filter(q=>!y220HasQuestionNumber(q)).length;return{tests:tests.length,questions:questions.length,unknown,patterns:Array.isArray(pkg.patternSummary)?pkg.patternSummary.length:0,warnings:Array.isArray(pkg.warnings)?pkg.warnings.length:0}}
function y220ValidatePackage(pkg){return !!(pkg&&pkg.kind===Y220_PACKAGE_KIND&&Number(pkg.schemaVersion)===1&&pkg.packageId&&Array.isArray(pkg.tests))}
function y220PreviewPackage(pkg){
 y220Ensure();const st=y220PackageStats(pkg),already=DB.analysisImports.some(x=>x.packageId===pkg.packageId),warnings=pkg.warnings||[];
 const box=$('#analysisPackagePreview');if(!box)return;
 box.innerHTML=`<div class="analysis-package-summary"><div><span>과목</span><b>${y220Esc(pkg.subject||'여러 과목')}</b></div><div><span>시험 묶음</span><b>${st.tests}</b></div><div><span>문항 기록</span><b>${st.questions}</b></div><div><span>번호 미확인</span><b>${st.unknown}</b></div></div><p class="muted">${y220Esc(pkg.source?.fileName||'분석 패키지')} · ${pkg.mode==='historical-archive'?'과거 오답 아카이브':'현재 시험 분석'}</p>${already?'<div class="banner warn">이미 가져온 패키지입니다. 중복 가져오기는 차단됩니다.</div>':''}${warnings.length?`<div class="analysis-package-warnings">${warnings.map(w=>`<p><b>확인</b> ${y220Esc(w.message||w.code)}</p>`).join('')}</div>`:''}<div class="analysis-package-policy"><b>가져오기 원칙</b><p>${pkg.mode==='historical-archive'?'과거 기록은 반복 패턴의 증거로만 보관하며 오늘의 미해결 문항·우선순위에는 자동으로 넣지 않습니다.':'정확한 시험일이 있는 현재 기록은 시험·문항 기록에 병합합니다.'}</p><p>사용자 작성 원인과 모델 추론 필드를 구분해 저장합니다. 원본 PDF 자체는 브라우저에 저장하지 않습니다.</p></div>`;
 const btn=$('#applyAnalysisPackage');if(btn)btn.disabled=already;
}
function y220MergePatternSummary(pkg){
 const byKey=new Map((DB.analysisPatterns||[]).map(x=>[`${x.subject||''}|${x.pattern||''}|${x.packageId||''}`,x]));
 for(const p of pkg.patternSummary||[]){const row={subject:pkg.subject||'',pattern:p.pattern||'기타',count:Number(p.count)||0,examples:deep(p.examples||[]),packageId:pkg.packageId,sourceFile:pkg.source?.fileName||'',importedAt:new Date().toISOString()};byKey.set(`${row.subject}|${row.pattern}|${row.packageId}`,row)}
 DB.analysisPatterns=[...byKey.values()];
}
function y220HistoricalImport(pkg){
 const oldIds=new Set((DB.analysisArchive||[]).map(x=>x.archiveId));
 for(const t of pkg.tests||[]){const archiveId=`${pkg.packageId}:${t.id||t.examLabel}`;if(oldIds.has(archiveId))continue;const qs=(t.questions||[]).map(q=>({...deep(q),analysisMeta:{packageId:pkg.packageId,sourceFile:pkg.source?.fileName||'',sourcePage:q.sourcePage||null,provenance:deep(q.provenance||{}),importedAt:new Date().toISOString(),trackingState:'historical'}}));DB.analysisArchive.push({archiveId,packageId:pkg.packageId,subject:t.subject||pkg.subject||'',examLabel:t.examLabel||'',academicYear:t.academicYear||'',session:t.session||'',score:Number(t.score)||0,grade:Number(t.grade)||0,sortKey:t.sortKey||'',sourcePages:deep(t.sourcePages||[]),questions:qs});for(const q of qs)if(!y220HasQuestionNumber(q))DB.analysisObservations.push({id:`${archiveId}:${q.sourcePage||0}:${q.sourceSlot||''}`,packageId:pkg.packageId,subject:t.subject||pkg.subject||'',examLabel:t.examLabel||'',sourcePage:q.sourcePage||null,sourceSlot:q.sourceSlot||'',type:q.type||'',pattern:q.pattern||'',directCause:q.directCause||'',note:q.note||''})}
 y220MergePatternSummary(pkg);
}
function y220ActiveImport(pkg){
 for(const t of pkg.tests||[]){if(!t.exactDate)continue;const id=t.id||`analysis-${pkg.packageId}-${t.subject||pkg.subject}-${t.exactDate}`;let target=DB.tests.find(x=>x.analysisSourceKey===id||x.id===id);const qRecords=(t.questions||[]).filter(q=>y220HasQuestionNumber(q)).map(q=>normalizeQuestionRecord({id:`ap-${pkg.packageId}-${t.subject||pkg.subject}-${q.number}`,subject:t.subject||pkg.subject,number:Number(q.number),status:q.status==='uncertain'?'uncertain':'wrong',type:q.type||'',cause:ERROR_CAUSES.includes(q.cause)?q.cause:'',pattern:ERROR_PATTERNS.includes(q.pattern)?q.pattern:'',note:q.directCause||q.note||'',rootCause:q.rootCause||'',controlRule:q.controlRule||'',answerOutcome:q.answerOutcome||'',retryDue:q.retryDue||'',retryState:'pending',analysisMeta:{packageId:pkg.packageId,sourceFile:pkg.source?.fileName||'',sourcePage:q.sourcePage||null,provenance:deep(q.provenance||{}),importedAt:new Date().toISOString(),trackingState:'active'}},{subject:t.subject||pkg.subject})).filter(Boolean);
 const next=normalizeTestRecord({id,analysisSourceKey:id,kind:'single',source:t.source||'기타',scope:t.scope||'full',date:t.exactDate,name:t.examLabel||t.name||'시험',subject:t.subject||pkg.subject,score:Number(t.score)||0,grade:Number(t.grade)||0,minutes:Number(t.minutes)||0,wrongCount:qRecords.filter(q=>q.status==='wrong').length,questionRecords:qRecords,memo:t.memo||''});
 if(!target)DB.tests.push(next);else{const currentQ=new Map((target.questionRecords||[]).map(q=>[`${q.subject}:${q.number}`,q]));for(const q of next.questionRecords||[]){const key=`${q.subject}:${q.number}`;if(!currentQ.has(key))currentQ.set(key,q);else{const old=currentQ.get(key);currentQ.set(key,{...q,...old,analysisMeta:{...(q.analysisMeta||{}),...(old.analysisMeta||{})}})}}Object.assign(target,{...next,...target,questionRecords:[...currentQ.values()]})}
 }
 y220MergePatternSummary(pkg);
}
function y220ApplyPackage(){
 const pkg=Y220_PENDING_PACKAGE;if(!pkg)return;y220Ensure();if(DB.analysisImports.some(x=>x.packageId===pkg.packageId)){alert('이미 가져온 분석 패키지입니다.');return}
 const before=JSON.stringify(DB);
 // Import is a user-triggered operation. Download a restorable copy first; localStorage may already be near quota.
 y220Download(`YEOKSANG_PRE_ANALYSIS_${todayDate()}_${pkg.packageId}.json`,DB);
 if(approximateStorageBytes()<3.4*1024*1024)safeSetItem('p11122_pre_analysis_import',before,{silent:true});
 try{if(pkg.mode==='historical-archive')y220HistoricalImport(pkg);else y220ActiveImport(pkg);DB.analysisImports.push({packageId:pkg.packageId,subject:pkg.subject||'',sourceFile:pkg.source?.fileName||'',mode:pkg.mode||'',importedAt:new Date().toISOString()});DB.meta.lastAnalysisImport={packageId:pkg.packageId,sourceFile:pkg.source?.fileName||'',at:Date.now()};if(!saveDB())throw new Error('save');hideModal('analysisPackageModal');Y220_PENDING_PACKAGE=null;renderAnalysis();renderTests();alert('오답 분석 패키지를 병합했습니다. 기존 기록은 덮어쓰지 않았습니다.')}catch(e){console.error(e);DB=migrateDB(JSON.parse(before));LAST_SAVED_JSON=JSON.stringify(DB);alert('분석 패키지 저장에 실패했습니다. 브라우저의 기존 기록은 변경되지 않았습니다. 방금 내려받은 가져오기 전 백업을 보관하세요.')}
}
function y220ReadPackage(file){const r=new FileReader();r.onload=()=>{try{const pkg=JSON.parse(r.result);if(!y220ValidatePackage(pkg))throw new Error('invalid');Y220_PENDING_PACKAGE=pkg;y220PreviewPackage(pkg);showModal('analysisPackageModal')}catch(e){console.error(e);alert('曆象 오답 분석 패키지 JSON인지 확인하세요.')}};r.onerror=()=>alert('파일을 읽지 못했습니다.');r.readAsText(file)}
function y220ExportContext(){
 y220Ensure();
 const tests=(DB.tests||[]).map(t=>({
  id:t.id,date:t.date,name:t.name,source:t.source,scope:t.scope,subject:t.subject,score:t.score,grade:t.grade,scores:t.scores,grades:t.grades,minutes:t.minutes,
  questionRecords:deep((t.questionRecords||[]).map(q=>({
   id:q.id,subject:q.subject,number:q.number,status:q.status,type:q.type,cause:q.cause,pattern:q.pattern,note:q.note,trigger:q.trigger,behavior:q.behavior,missedCheck:q.missedCheck,rootCause:q.rootCause,controlRule:q.controlRule,answerOutcome:q.answerOutcome,evidenceStage:q.evidenceStage,evidenceLog:q.evidenceLog,nonAttemptReason:q.nonAttemptReason,blockingQuestion:q.blockingQuestion,linkedCourse:q.linkedCourse
  })))
 }));
 const archive=(DB.analysisArchive||[]).map(t=>({archiveId:t.archiveId,subject:t.subject,examLabel:t.examLabel,academicYear:t.academicYear,session:t.session,score:t.score,grade:t.grade,questions:deep((t.questions||[]).map(q=>({number:q.number??null,status:q.status||'',type:q.type||'',cause:q.cause||'',pattern:q.pattern||'',directCause:q.directCause||'',controlRule:q.controlRule||'',sourcePage:q.sourcePage||null,provenance:q.provenance||q.analysisMeta?.provenance||{}})))}));
 const context={kind:Y220_CONTEXT_KIND,schemaVersion:1,createdAt:new Date().toISOString(),appVersion:'2.2',viewDate,subjects:deep(SUBJECTS),tests,analysisArchive:archive,analysisObservations:deep(DB.analysisObservations||[]),analysisPatterns:deep(DB.analysisPatterns||[]),analysisImports:deep(DB.analysisImports||[]),subjectProtocols:deep(DB.subjectProtocols||{}),coverageTopics:deep(DB.coverageTopics||{}),coverageChecks:deep(DB.coverageChecks||{}),courseMeta:deep(DB.courseMeta||{}),weeklyNotes:deep(DB.weeklyNotes||{})};
 y220Download(`YEOKSANG_ANALYSIS_CONTEXT_${todayDate()}.json`,context)
}
function y220Rollback(){const raw=localStorage.getItem('p11122_pre_analysis_import');if(!raw){alert('되돌릴 분석 가져오기 안전본이 없습니다.');return}if(!confirm('마지막 오답 분석 패키지 가져오기 직전 상태로 되돌릴까요? 현재 상태도 별도 백업으로 먼저 받는 것을 권장합니다.'))return;try{const next=migrateDB(JSON.parse(raw));const json=JSON.stringify(next);if(!safeSetItem(DB_KEY,json))throw new Error('save');DB=next;LAST_SAVED_JSON=json;alert('마지막 분석 가져오기 전 상태로 되돌렸습니다.');navigate('analysis')}catch(e){alert('안전본 복원에 실패했습니다. 현재 기록은 유지됩니다.')}}
function y220RenderArchive(){y220Ensure();const box=$('#analysisArchiveBoard'),badge=$('#analysisArchiveBadge');if(!box)return;const tests=DB.analysisArchive||[],questions=tests.flatMap(t=>t.questions||[]),unknown=(DB.analysisObservations||[]).length,patterns=(DB.analysisPatterns||[]).slice().sort((a,b)=>b.count-a.count);if(badge)badge.textContent=`${tests.length}회 · ${questions.length}문항`;if(!tests.length){box.innerHTML='<p class="muted">아직 가져온 오답 분석 패키지가 없습니다.</p>';return}box.innerHTML=`<div class="archive-summary"><div><span>과거 시험</span><b>${tests.length}</b></div><div><span>문항 기록</span><b>${questions.length}</b></div><div><span>번호 미확인</span><b>${unknown}</b></div><div><span>가져온 패키지</span><b>${DB.analysisImports.length}</b></div></div><div class="archive-patterns">${patterns.slice(0,6).map(p=>`<div><b>${y220Esc(p.subject)} · ${y220Esc(p.pattern)}</b><span>${p.count}건 · 과거 증거</span></div>`).join('')}</div><details><summary>아카이브 원칙</summary><p>과거 오답은 현재 미해결 문항 수나 오늘 우선순위를 자동으로 올리지 않습니다. 새 문제에서 재발하거나 사용자가 활성 점검으로 올린 경우에만 현재 판단에 반영하는 것이 안전합니다.</p></details>`}
// Keep historical archive separate from today's pending count.
const y220RenderAnalysisBase=__impl_renderAnalysis;
__impl_renderAnalysis=function(){y220RenderAnalysisBase();y220RenderArchive()};
// Imported analysis should be reviewed, not retyped. Make the existing detailed editor optional.
const y220OpenReview=__impl_openTestReviewModal;
__impl_openTestReviewModal=function(id){y220OpenReview(id);$$('#testReviewQuestions .review-question-card').forEach(card=>{const head=card.querySelector('.review-question-head');if(!head||card.querySelector('.y220-summary'))return;const details=[card.querySelector('.review-question-grid'),card.querySelector('.pattern-chain'),...[...card.querySelectorAll('label')].filter(x=>!x.closest('.review-question-grid')&&!x.closest('.pattern-chain'))].filter(Boolean);const q=mutableQuestion(id,card.dataset.questionId);const summary=document.createElement('div');summary.className='y220-summary';summary.innerHTML=`<span>${y220Esc(q?.type||'유형 미정')}</span><b>${y220Esc(q?.pattern||q?.cause||'분석 확인 필요')}</b>${q?.controlRule?`<small>${y220Esc(q.controlRule)}</small>`:''}`;head.insertAdjacentElement('afterend',summary);const wrap=document.createElement('details');wrap.className='y220-edit-details';wrap.innerHTML='<summary>세부 분석 직접 수정</summary>';details.forEach(el=>wrap.appendChild(el));card.appendChild(wrap)})};
__impl_renderVersionStatus=()=>{$('#runtimeStatus').textContent='2.2 · SW 2.2'};
const y220SettingsBase=__impl_renderSettings;__impl_renderSettings=function(){y220SettingsBase();$('#versionInfo').innerHTML=`<code>曆象 2.2<br>Data schema ${SCHEMA_VERSION}<br>오답 분석 패키지 · 증분 병합</code>`};
document.addEventListener('DOMContentLoaded',()=>{y220Ensure();const input=$('#analysisPackageInput');if(input)input.onchange=e=>{const f=e.target.files?.[0];if(f)y220ReadPackage(f);e.target.value=''};if($('#applyAnalysisPackage'))$('#applyAnalysisPackage').onclick=y220ApplyPackage;if($('#exportAnalysisContext'))$('#exportAnalysisContext').onclick=y220ExportContext;if($('#rollbackAnalysisImport'))$('#rollbackAnalysisImport').onclick=y220Rollback;setTimeout(y220RenderArchive,30)});
