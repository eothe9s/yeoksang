'use strict';
// 曆象 2.2.1: historical test visibility + final analysis package gate
function y221ArchiveSource(t){
 const label=String(t?.examLabel||t?.session||'');
 if(label.includes('수능'))return '수능';
 if(label.includes('평가원')||label.includes('6월')||label.includes('9월'))return '평가원 모의평가';
 return '기타';
}
function y221ArchiveFiltered(){
 y220Ensure();
 const source=$('#testSourceFilter')?.value||'all',subject=$('#testSubjectFilter')?.value||'all',scope=$('#testScopeFilter')?.value||'all';
 return (DB.analysisArchive||[]).filter(t=>{
  if(subject!=='all'&&t.subject!==subject)return false;
  if(source!=='all'&&y221ArchiveSource(t)!==source)return false;
  if(scope!=='all'&&scope!=='full')return false;
  return true;
 }).sort((a,b)=>String(b.sortKey||b.examLabel||'').localeCompare(String(a.sortKey||a.examLabel||'')));
}
function y221ArchiveQuestionRow(q){
 const no=y220HasQuestionNumber(q)?`${Number(q.number)}번`:'번호 미확인';
 const state=q.status==='uncertain'?'맞았지만 흔들림':q.status==='wrong'?'오답':'기록';
 const reason=q.directCause||q.note||'';
 const tag=[q.type,q.pattern].filter(Boolean).join(' · ');
 return `<div class="archive-q-row"><div><b>${y220Esc(no)} · ${y220Esc(state)}</b>${tag?`<span>${y220Esc(tag)}</span>`:''}</div>${reason?`<p>${y220Esc(reason)}</p>`:''}${q.controlRule?`<small>다음 규칙 · ${y220Esc(q.controlRule)}</small>`:''}</div>`;
}
function y221RenderHistoricalTests(){
 const box=$('#testList');if(!box)return;
 const rows=y221ArchiveFiltered();
 box.querySelectorAll('.y221-history-section').forEach(x=>x.remove());
 if(!rows.length)return;
 const wrap=document.createElement('section');wrap.className='y221-history-section';
 wrap.innerHTML=`<div class="y221-history-head"><div><b>가져온 과거 시험</b><span>시험 기록으로 보이되 오늘 우선순위·미해결 개수에는 자동 반영하지 않음</span></div><span class="badge">${rows.length}회</span></div>${rows.map(t=>{const qs=t.questions||[],known=qs.filter(y220HasQuestionNumber).length,unknown=qs.length-known;return `<article class="test-card y221-history-card"><div class="test-top"><div><div><span class="kind-pill">${y220Esc(y221ArchiveSource(t))}</span><span class="scope-pill">과거 분석</span></div><b>${y220Esc(t.examLabel||'과거 시험')}</b><div class="task-meta">${t.score?`${t.score}점`:''}${t.grade?` · ${t.grade}등급`:''}${qs.length?` · 분석 ${qs.length}개`:''}${unknown?` · 번호 미확인 ${unknown}개`:''}</div></div></div>${qs.length?`<details class="y221-history-details"><summary>문항 분석 보기</summary><div class="archive-q-list">${qs.map(y221ArchiveQuestionRow).join('')}</div></details>`:''}</article>`}).join('')}`;
 box.appendChild(wrap);
}
const y221RenderTestsBase=__impl_renderTests;
__impl_renderTests=function(){y221RenderTestsBase();y221RenderHistoricalTests()};

function y221PackageUnresolved(pkg){
 const qs=(pkg?.tests||[]).flatMap(t=>t.questions||[]);
 const unresolved=[];
 if(pkg?.reviewStatus!=='final')unresolved.push('reviewStatus');
 if(Array.isArray(pkg?.unresolved)&&pkg.unresolved.length)unresolved.push(...pkg.unresolved.map(x=>x?.message||x?.code||String(x)));
 qs.forEach(q=>{
  if(q?.analysisStatus==='unresolved'||q?.analysisStatus==='draft'||q?.numberConfidence==='unresolved')unresolved.push(`${q?.sourcePage||'?'}p ${q?.sourceSlot||''} 미확정`);
  const prov=q?.provenance||{};
  if(Object.values(prov).some(v=>v==='model-inferred-unreviewed'))unresolved.push(`${q?.sourcePage||'?'}p 미검토 추론`);
 });
 return [...new Set(unresolved)];
}
y220ValidatePackage=function(pkg){return !!(pkg&&pkg.kind===Y220_PACKAGE_KIND&&[1,2].includes(Number(pkg.schemaVersion))&&pkg.packageId&&Array.isArray(pkg.tests))};
const y221PreviewBase=y220PreviewPackage;
y220PreviewPackage=function(pkg){
 y221PreviewBase(pkg);
 const box=$('#analysisPackagePreview'),btn=$('#applyAnalysisPackage');if(!box)return;
 const unresolved=y221PackageUnresolved(pkg),final=pkg.reviewStatus==='final'&&!unresolved.length;
 const note=document.createElement('div');note.className=final?'banner':'banner warn';
 note.textContent=final?'대화 검토가 끝난 완성 분석본입니다.':'초안 또는 미확정 항목이 남아 있습니다. 최종 파일만 가져올 수 있습니다.';
 box.prepend(note);
 if(unresolved.length){const p=document.createElement('div');p.className='analysis-package-warnings';p.innerHTML=unresolved.slice(0,8).map(x=>`<p><b>확인 필요</b> ${y220Esc(x)}</p>`).join('');box.appendChild(p)}
 if(btn)btn.disabled=btn.disabled||!final;
};
const y221ApplyBase=y220ApplyPackage;
y220ApplyPackage=function(){const pkg=Y220_PENDING_PACKAGE;if(!pkg)return;const unresolved=y221PackageUnresolved(pkg);if(pkg.reviewStatus!=='final'||unresolved.length){alert('이 파일은 아직 완성 분석본이 아닙니다. 확인이 필요한 항목을 먼저 대화에서 정리한 뒤 최종 파일을 사용하세요.');return}return y221ApplyBase()};

const y221SettingsBase=__impl_renderSettings;
__impl_renderSettings=function(){y221SettingsBase();if($('#versionInfo'))$('#versionInfo').innerHTML=`<code>曆象 2.2.1<br>Data schema ${SCHEMA_VERSION}<br>과거 시험 표시 · 완성 분석본만 가져오기</code>`};
__impl_renderVersionStatus=()=>{$('#runtimeStatus').textContent='2.2.1 · SW 2.2'};
document.addEventListener('DOMContentLoaded',()=>setTimeout(y221RenderHistoricalTests,60));
