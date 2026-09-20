/* Shared UI behavior, not another engine replacement layer. */
'use strict';
const viewDisclosure=new Map();
const pagePositions=new Map();
function polishView(){
 if(!document.documentElement)return;
 for(const el of document.querySelectorAll('.task-check'))el.setAttribute('aria-label',(el.closest('.task')?.querySelector('.task-title')?.textContent||'할 일')+' 완료');
 const labels={learningSearch:'학습 자료 검색',analysisSubjectFilter:'성적 그래프 과목',analysisSourceFilter:'성적 그래프 출처',analysisScopeFilter:'성적 그래프 범위',testSourceFilter:'시험 구분',testSubjectFilter:'시험 과목',testScopeFilter:'시험 범위',y24ReportText:'오늘 기록 복사할 내용',y24TestSearch:'시험 검색',taskSortMode:'할 일 정렬'};
 Object.assign(labels,{plannerDate:'시간표 날짜',scheduleModeSelect:'시간표 종류',analysisMonth:'분석 월'});
 for(const [id,label] of Object.entries(labels))document.getElementById(id)?.setAttribute('aria-label',label);
 for(const el of document.querySelectorAll('.text-link')){if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',(el.closest('article')?.querySelector('h5')?.textContent||'')+' '+el.textContent);}
 for(const selector of ['#trashList','#recoveryCandidates','#undoList','#periodTimeSettings','#safetySnapshotList']){
  const body=document.querySelector(selector),card=body?.closest('article.card');if(!card||card.parentElement?.classList.contains('compact-disclosure'))continue;
  const title=card.querySelector('h3'),details=document.createElement('details'),summary=document.createElement('summary');
  details.className='compact-disclosure';summary.textContent=title?.textContent||'세부 보기';details.open=viewDisclosure.get(selector)||false;
  if(title)title.hidden=true;details.ontoggle=()=>viewDisclosure.set(selector,details.open);card.replaceWith(details);details.append(summary,card);
 }
 for(const card of document.querySelectorAll('#lectureCatalog .source-card,#bookCatalog .source-card')){
  const body=card.querySelector('.lecture-grid,.subunit-grid');if(!body||body.parentElement?.tagName==='DETAILS')continue;
  const key=card.querySelector('h4')?.textContent||card.dataset.search,details=document.createElement('details'),summary=document.createElement('summary');
  summary.textContent=body.classList.contains('lecture-grid')?'강의 선택':'소단원 선택';details.className='source-disclosure';details.open=viewDisclosure.get(key)||false;
  details.ontoggle=()=>viewDisclosure.set(key,details.open);body.replaceWith(details);details.append(summary,body);
 }
}
function renderScoreSegmentLabels(rows){
 if(!document.createElementNS)return;
 const svg=document.getElementById('rawScoreChart');if(!svg||!rows.length)return;
 const kinds=new Set(rows.map(r=>r.date.known?'응시일':'출제 회차'));
 svg.setAttribute('aria-label','원점수와 등급 추이. 왼쪽 원점수, 오른쪽 등급. 1등급이 위. 기록 순서대로 동일 간격. '+[...kinds].join(' / '));
 const groups=[];rows.forEach((r,i)=>{const kind=r.date.known?'응시일':'출제 회차',last=groups.at(-1);if(last?.kind===kind)last.end=i;else groups.push({kind,start:i,end:i});});
 const x=i=>rows.length===1?380:48+664*i/(rows.length-1);
 for(const [i,g] of groups.entries()){
  const text=document.createElementNS('http://www.w3.org/2000/svg','text');text.setAttribute('x',(x(g.start)+x(g.end))/2);text.setAttribute('y','294');text.setAttribute('text-anchor','middle');text.setAttribute('class','chart-segment-label');text.textContent=g.kind+(groups.length===1?' · 기록순':'');svg.appendChild(text);
  if(i){const line=document.createElementNS('http://www.w3.org/2000/svg','line'),xx=(x(g.start-1)+x(g.start))/2;line.setAttribute('x1',xx);line.setAttribute('x2',xx);line.setAttribute('y1','30');line.setAttribute('y2','236');line.setAttribute('class','chart-segment-divider');svg.appendChild(line);}
 }
}
document.addEventListener('DOMContentLoaded',()=>{polishView();});
