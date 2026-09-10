/* 曆象 2.1 — local records, explicit decisions, no inferred mastery. */
'use strict';
const Y21_FINAL_START='2026-11-09';
const y21Number=x=>Number.isFinite(Number(x))?Math.max(0,Number(x)):0;
const y21Object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const y21BadKey=k=>['__proto__','constructor','prototype'].includes(k);
let y21PendingMerge=null;

// A zero-capacity day is zero. Overlapping intervals are counted only once.
function y21Union(intervals){const a=intervals.filter(x=>x.end>x.start).sort((a,b)=>a.start-b.start),out=[];for(const x of a){const p=out.at(-1);if(p&&x.start<=p.end)p.end=Math.max(p.end,x.end);else out.push({...x})}return out}
function y21StudyIntervals(date){
 const cutoff=Math.min(22*60+50,plannerMinute(hardStudyCutoff())??1370),blocks=capacityScheduleSnapshotV10(date);
 const blocked=blocks.filter(b=>!b.selfStudy).map(b=>intervalFromTimesV10(b.start,b.end)).filter(Boolean);
 const bed=plannerNightBed(date),wake=plannerMorningWake(date),bedMin=plannerMinute(bed),wakeMin=plannerMinute(wake);
 const end=bedMin!=null&&bedMin>=720?Math.min(cutoff,bedMin):cutoff;
 let spans=blocks.filter(b=>b.selfStudy).map(b=>intervalFromTimesV10(b.start,b.end)).filter(Boolean).map(x=>({start:Math.max(x.start,wakeMin??300),end:Math.min(x.end,end)}));
 for(const c of blocked)spans=spans.flatMap(x=>x.end<=c.start||x.start>=c.end?[x]:[{start:x.start,end:Math.min(x.end,c.start)},{start:Math.max(x.start,c.end),end:x.end}]);
 return y21Union(spans);
}
capacityMinutesFromScheduleV10=date=>y21StudyIntervals(date).reduce((s,x)=>s+x.end-x.start,0);
__impl_capacityHoursFor=function(date){
 if((DB.settings.zeroCapacityDates||[]).includes(date)||['2026-10-07','2026-10-08'].includes(date))return 0;
 const actual=capacityMinutesFromScheduleV10(date)/60,override=DB.settings.capacityOverrides?.[date];
 if(override!=null)return Math.min(actual,y21Number(override));
 if(DB.settings.capacityMode==='manual')return Math.min(actual,y21Number(isWeekend(date)?DB.settings.weekendCapacityHours:DB.settings.weekdayCapacityHours));
 return actual;
};
const y21Fixed=fixedConstraintsForDateV10;
fixedConstraintsForDateV10=function(date){const out=y21Fixed(date).filter(x=>!x.id.startsWith('pe-')||date<=(DB.settings.peEndDate||'2026-09-30'));const wd=parseDate(date).getDay();if(wd>=1&&wd<=5&&date>='2026-09-07'&&date<=(DB.settings.exerciseEndDate||'2026-09-30'))out.push({id:'weekday-exercise',date,label:'야자 운동',start:'21:00',end:'22:00',type:'class'});return out};
const y21Weekday=weekdayBaseSchedule;
weekdayBaseSchedule=function(date){const rows=y21Weekday(date);if(date>='2026-09-07'&&date<='2026-09-11')for(const b of rows)if(b.baseKey==='after')Object.assign(b,{name:'원서접수기간 자습',type:'self',selfStudy:true,device:true,locked:false});return rows};

// Only completed, explicitly timed, single-task blocks are observations.
observedCourseMinutesV10=function(courseId){
 const samples=[];
 for(const [date,list] of Object.entries(DB.tasks||{})){if(date>todayDate())continue;for(const t of list||[]){if(!t.done)continue;const comps=t.components||[];if(!comps.length||!comps.every(c=>c.kind==='lecture'&&String(c.ref).startsWith(courseId+'::')))continue;
 const blocks=(DB.schedules[date]||[]).filter(b=>(b.taskIds||[]).includes(t.id));
 if(!blocks.length||blocks.some(b=>!b.done||!(Number(b.actualMin)>0)||b.taskIds.length!==1))continue;
 samples.push(blocks.reduce((s,b)=>s+Number(b.actualMin),0)/comps.length);
 }}
 if(samples.length<2)return null;samples.sort((a,b)=>a-b);return{low:Math.round(samples[Math.floor((samples.length-1)*.25)]),high:Math.round(samples[Math.ceil((samples.length-1)*.75)]),n:samples.length,source:'완료·실측 단독 블록'};
};
const y21Estimate=estimateTaskMinutesV10;
const y21UnitEstimate=courseUnitEstimateV10;
courseUnitEstimateV10=function(id,meta={}){if(meta.timeMode!=='parts')return y21UnitEstimate(id,meta);const c=meta.timeParts||{};if(['watch','speed','practice','review'].some(k=>c[k]==null||c[k]===''||!Number.isFinite(Number(c[k])))||Number(c.speed)<=0)return null;const n=Number(c.watch)/Number(c.speed)+Number(c.practice)+Number(c.review);return{low:n,high:n,n:null,source:'시청÷배속 + 풀이 + 과제·복습 (직접 입력)'}};
const y21Workload=__impl_rowWorkloadV90;
__impl_rowWorkloadV90=function(row){if(row.total!=null&&Number(row.done)>=Number(row.total))return{unknown:false,low:0,high:0,remaining:0,remainingLow:0,remainingHigh:0,included:row.meta?.included!==false};return y21Workload(row)};
estimateTaskMinutesV10=function(t,date=null){
 if(y21Number(t?.minutes)>0)return{minutes:y21Number(t.minutes),known:true,source:'할 일 예상'};
 if((t?.components||[]).some(c=>c.kind==='lecture'))return y21Estimate(t,null);
 if(date){let minutes=0;for(const b of DB.schedules?.[date]||[]){if(!(b.taskIds||[]).includes(t.id))continue;const alloc=b.taskAllocations?.[t.id];if(alloc!=null)minutes+=y21Number(alloc);else if(b.taskIds.length===1)minutes+=blockDuration(b);else return{minutes:0,known:false,source:'공유 블록 분량 미정'}}if(minutes>0)return{minutes,known:true,source:'배정 시간'}}
 return{minutes:0,known:false,source:'시간 미정'};
};

// Planned workload = max(task estimate, assigned minutes), not their sum.
function y21Plan(date){
 const bySubject=Object.fromEntries(SUBJECTS.map(s=>[s,{subject:s,planned:0,assigned:0,unplaced:0,unknown:0}])),assigned=new Map();let ambiguous=0,blockExcess=0;
 const row=s=>bySubject[s]||(bySubject[s]={subject:s,planned:0,assigned:0,unplaced:0,unknown:0});
 for(const b of capacityScheduleSnapshotV10(date)){if(!b.selfStudy)continue;let used=0;const ids=[...new Set(b.taskIds||[])];for(const id of ids){const t=(DB.tasks[date]||[]).find(x=>x.id===id);if(!t)continue;let n=b.taskAllocations?.[id];if(n==null){if(ids.length===1)n=blockDuration(b);else{ambiguous++;continue}}n=y21Number(n);used+=n;assigned.set(id,(assigned.get(id)||0)+n);row(t.subject).assigned+=n;}blockExcess+=Math.max(0,used-blockDuration(b));}
 for(const t of DB.tasks[date]||[]){const r=row(t.subject),a=assigned.get(t.id)||0,e=estimateTaskMinutesV10(t,date);if(!e.known&&a===0)r.unknown++;const p=Math.max(e.known?e.minutes:0,a);r.planned+=p;r.unplaced+=Math.max(0,p-a)}
 const rows=Object.values(bySubject);return{rows,total:rows.reduce((s,r)=>s+r.planned,0),assigned:rows.reduce((s,r)=>s+r.assigned,0),unknown:rows.reduce((s,r)=>s+r.unknown,0),ambiguous,blockExcess};
}
todayPlanGapV11=function(date=viewDate){const load=curriculumLoadV90(date),plan=y21Plan(date);return{...load,plan,gapLow:plan.total/60-load.todayLow,gapHigh:plan.total/60-load.todayHigh}};
periodAverageNeedV11=function(date=viewDate){const load=curriculumLoadV90(date);let low=0,high=0;for(const p of load.coursePlans){if(p.stopped||p.workload.included===false||p.workload.unknown)continue;const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date,days=Math.max(1,daysBetween(start,p.target)+1);low+=p.workload.low/60/days;high+=p.workload.high/60/days}return{low,high,days:Math.max(1,daysBetween(date,deadlineDate())+1),unknown:load.unknown.length,deadline:deadlineDate()}};

// Largest available blocks first minimizes splits; contiguous work never uses gaps.
__impl_autoPlaceTasks=function(date,newTasks){
 const blocks=ensureSchedule(date),allowed=y21StudyIntervals(date),free=blocks.filter(b=>b.selfStudy&&!b.locked&&!studyBlockViolatesSleep(b)&&allowed.some(x=>plannerMinute(b.start)>=x.start&&plannerMinute(b.end)<=x.end));let placed=0;
 for(const t of newTasks){if(date>=Y21_FINAL_START&&date<V10_CSAT&&!t.reviewRef&&!t.allowFinalWindow)continue;const courseIds=taskLectureCourseKeysV10(t);if(courseIds.some(id=>DB.courseMeta[id]?.releaseStart>date))continue;const e=estimateTaskMinutesV10(t,date);if(!e.known||e.minutes<=0)continue;const legacyAssigned=blocks.some(b=>(b.taskIds||[]).includes(t.id)&&b.taskAllocations?.[t.id]==null);if(legacyAssigned)continue;const already=blocks.reduce((s,b)=>s+y21Number(b.taskAllocations?.[t.id]),0),need=Math.max(0,e.minutes-already);if(!need)continue;
 const lecture=t.taskKind==='lecture'||(t.components||[]).some(c=>c.kind==='lecture'),eligible=free.filter(b=>!lecture||b.device);let chosen=[];
 if(t.splitMode==='contiguous'){
  if(already)continue;
  for(let i=0;i<eligible.length;i++){let sum=0,seq=[];for(let j=i;j<eligible.length;j++){const b=eligible[j];if((b.taskIds||[]).length)break;if(seq.length&&seq.at(-1).end!==b.start)break;seq.push(b);sum+=blockDuration(b);if(sum>=need){if(!chosen.length||seq.length<chosen.length)chosen=seq;break}}}
 }else chosen=eligible.slice().sort((a,b)=>blockAvailableMinutesV10(date,b)-blockAvailableMinutesV10(date,a)||String(a.start).localeCompare(b.start));
 if(chosen.reduce((s,b)=>s+blockAvailableMinutesV10(date,b),0)<need)continue;
 let left=need;for(const b of chosen){const n=Math.min(left,blockAvailableMinutesV10(date,b));if(n<=0)continue;b.taskIds=b.taskIds||[];b.taskAllocations=b.taskAllocations||{};if(!b.taskIds.includes(t.id))b.taskIds.push(t.id);b.taskAllocations[t.id]=y21Number(b.taskAllocations[t.id])+n;left-=n;if(!left)break}placed++;
 }saveSchedule(date,blocks);return placed;
};

function y21Questions(subject,date=viewDate){return(DB.tests||[]).filter(t=>t.date<=date).flatMap(t=>(t.questionRecords||[]).filter(q=>q.subject===subject).map(q=>({test:t,question:q})))}
function y21Evidence(q){return q.evidenceStage|| (q.retryState==='resolved'?'legacy':'pending')}
function y21Checks(subject,date=viewDate){const entries=y21Questions(subject,date),pending=entries.filter(x=>x.question.retryState!=='resolved'),recurring=pending.filter(x=>x.question.type&&entries.some(y=>y.test.date<x.test.date&&y.question.type===x.question.type&&y.question.pattern===x.question.pattern&&y.question.retryState==='resolved'));return{pending,recurring,unanalysed:pending.filter(x=>!x.question.cause&&!x.question.pattern),legacy:entries.filter(x=>y21Evidence(x.question)==='legacy').length}}
decisionPlanV10=function(date=viewDate){
 const load=curriculumLoadV90(date),plan=y21Plan(date),override=DB.planOverrides?.[date]||null;
 const rows=SUBJECTS.map(subject=>{const need=load.bySubject.find(x=>x.subject===subject)||{},p=plan.rows.find(x=>x.subject===subject),check=y21Checks(subject,date),unknown=load.unknown.filter(x=>x.subject===subject).length+p.unknown,shortage=Math.max(0,(need.todayLow||0)-p.planned/60),overdue=load.coursePlans.filter(x=>x.subject===subject&&x.overdue).length,manual=override?.subject===subject;
 const reasons=[`필요 ${(need.todayLow||0).toFixed(1)}–${(need.todayHigh||0).toFixed(1)}h · 계획 ${(p.planned/60).toFixed(1)}h`,...(overdue?[`지연 과정 ${overdue}개`]:[]),...(unknown?[`분량·시간 미정 ${unknown}개`]:[]),...(check.recurring.length?[`보완 뒤 같은 유형·패턴 재발 ${check.recurring.length}건`]:[]),`미해결 ${check.pending.length}건 · 원인 미확인 ${check.unanalysed.length}건`];
 return{subject,todayLow:need.todayLow||0,todayHigh:need.todayHigh||0,planned:p.planned/60,shortage,unknown,overdue,manual,check,reasons,action:shortage>.01?`${minuteLabel(Math.ceil(shortage*60))} 추가 검토`:unknown?'시간 근거 확인':p.planned/60>(need.todayHigh||0)+.05?'추가 배정분 검토':'현재 계획 유지',score:(manual?1e9:0)+overdue*1000+shortage*100+check.recurring.length};
 }).sort((a,b)=>Number(b.manual)-Number(a.manual)||b.overdue-a.overdue||b.shortage-a.shortage||b.check.recurring.length-a.check.recurring.length||SUBJECTS.indexOf(a.subject)-SUBJECTS.indexOf(b.subject));
 return{date,rows,load,plan,override,cap:load.todayCap,required:load.todayHigh,overload:plan.total/60>load.todayCap,confidence:load.unknown.length?'일부 미정':'시간 입력됨'};
};
renderDecisionBoardV10=function(){
 const box=$('#decisionBoard');if(!box)return;const p=decisionPlanV10(viewDate);$('#decisionConfidence').textContent=`미정 ${p.load.unknown.length+p.plan.unknown}개 · 가용 ${p.cap.toFixed(1)}h`;
 const summary=p.overload?`계획 ${(p.plan.total/60).toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h · 초과분 조정 필요`:`계획 ${(p.plan.total/60).toFixed(1)}h / 가용 ${p.cap.toFixed(1)}h`;
 box.innerHTML=`<div class="decision-summary ${p.overload?'risk':''}"><b>계획 조정</b><span>${summary}</span></div><div class="decision-list">${p.rows.map(x=>`<article class="decision-row ${x.manual?'manual':''}"><div><b>${esc(x.subject)}</b><small>${esc(x.action)}</small><details><summary>근거</summary>${x.reasons.map(r=>`<p>${esc(r)}</p>`).join('')}</details></div><strong>${x.planned.toFixed(1)}h 계획</strong><button class="text-link decision-pin" data-sub="${x.subject}">${x.manual?'우선 해제':'오늘 우선'}</button></article>`).join('')}</div><details class="y21-checks"><summary>학습 점검 · 미해결 ${p.rows.reduce((s,x)=>s+x.check.pending.length,0)}건</summary>${p.rows.map(x=>`<div class="y21-check-row"><b>${x.subject}</b><span>미해결 ${x.check.pending.length} · 원인 미확인 ${x.check.unanalysed.length}${x.check.recurring.length?` · 재발 ${x.check.recurring.length}`:''}</span><button class="btn ghost small" data-y21-review="${x.subject}">점검</button></div>`).join('')}</details>`;
 $$('.decision-pin').forEach(b=>b.onclick=()=>{DB.planOverrides=DB.planOverrides||{};if(DB.planOverrides[viewDate]?.subject===b.dataset.sub)delete DB.planOverrides[viewDate];else DB.planOverrides[viewDate]={subject:b.dataset.sub,reason:'직접 지정',at:Date.now()};saveDB();renderDashboard()});
 $$('[data-y21-review]').forEach(b=>b.onclick=()=>{const q=y21Checks(b.dataset.y21Review).pending[0];if(q)openTestReviewModal(q.test.id);else navigate('tests')});
 $('#decisionOverrideState').textContent=p.override?`직접 지정: ${p.override.subject}`:'';
};
const y21Dashboard=__impl_renderDashboard;
__impl_renderDashboard=function(){
 y21Dashboard();const load=curriculumLoadV90(viewDate),plan=y21Plan(viewDate),all=SUBJECTS.map(s=>({subject:s,...load.bySubject.find(x=>x.subject===s),...plan.rows.find(x=>x.subject===s)})),max=Math.max(1,...all.map(x=>Math.max(x.todayHigh||0,x.planned/60)));
 $('#dailyQuotaBySubject').innerHTML=`<div class="y21-legend"><span><i class="y21-blue"></i>마감 기준 필요</span><span><i class="y21-pink"></i>내 계획</span><small>공통 눈금 0–${max.toFixed(1)}h</small></div>${all.map(x=>`<div class="y21-quota"><b>${x.subject}</b><div class="y21-tracks" role="img" aria-label="${x.subject} 필요 ${(x.todayLow||0).toFixed(1)}에서 ${(x.todayHigh||0).toFixed(1)}시간, 계획 ${(x.planned/60).toFixed(1)}시간"><div><i class="y21-blue range" style="width:${(x.todayHigh||0)/max*100}%"></i><i class="y21-blue" style="width:${(x.todayLow||0)/max*100}%"></i></div><div><i class="y21-pink" style="width:${x.planned/60/max*100}%"></i></div></div><div class="y21-time"><span>${(x.todayLow||0).toFixed(1)}–${(x.todayHigh||0).toFixed(1)}h</span><b>${(x.planned/60).toFixed(1)}h 계획</b></div></div>`).join('')}<details><summary>배정·계산 근거</summary><p>필요시간은 마감까지 남은 분량의 추정치입니다. 만점에 필요한 시간이나 실력 판정이 아닙니다.</p><p>시간표 배정 ${(plan.assigned/60).toFixed(1)}h · 미배치 ${(plan.rows.reduce((s,r)=>s+r.unplaced,0)/60).toFixed(1)}h · 할 일 시간 미정 ${plan.unknown}개 · 공유 블록 분량 미정 ${plan.ambiguous}건${plan.blockExcess?` · 블록 초과 ${minuteLabel(plan.blockExcess)}`:''}</p></details>`;
 $$('#dailyQuotaBySubject .y21-quota').forEach((el,i)=>{const x=all[i],unknown=load.unknown.some(r=>r.subject===x.subject);if(unknown){const label=el.querySelector('.y21-time span');if(label)label.textContent=x.todayHigh?`${x.todayLow.toFixed(1)}–${x.todayHigh.toFixed(1)}h + 미정`:'필요시간 미정';el.querySelector('.y21-tracks')?.setAttribute('aria-label',`${x.subject} 필요시간 일부 미정, 계획 ${(x.planned/60).toFixed(1)}시간`)}});
 const gap=plan.total/60-load.todayLow,over=plan.total/60-load.todayHigh;$('#todayPlanGap').textContent=gap<-.01?`${(-gap).toFixed(1)}h 부족`:load.unknown.length?'일부 미정':over>.01?`${over.toFixed(1)}h 추가`:'필요 범위';$('#todayPlanGap').classList.toggle('metric-risk',gap<-.01||plan.total/60>load.todayCap);$('#todayPlanGapCaption').textContent=`계획 ${(plan.total/60).toFixed(1)}h${load.unknown.length||plan.unknown?' · 일부 미정':''}`;
 const banner=$('#overloadBanner');if(plan.total/60>load.todayCap){banner.classList.remove('hidden');banner.textContent=`계획 ${(plan.total/60).toFixed(1)}h / 가용 ${load.todayCap.toFixed(1)}h · 분량 조정 필요`}
};

// Dates indicate position; completion is calculated from actual records.
renderRoadmap=function(){
 const plans=curriculumRowsV90().map(r=>coursePlanV10(r,viewDate)).filter(r=>r.workload.included!==false),first=plans.filter(r=>r.target<=V10_CURRICULUM_CLOSE),done=first.filter(r=>r.total!=null&&r.done>=r.total).length,late=first.filter(r=>r.target<viewDate&&(r.total==null||r.done<r.total)).length,pending=SUBJECTS.reduce((s,x)=>s+y21Checks(x).pending.length,0),releasedLate=plans.filter(r=>(r.meta.releaseEnd||r.meta.targetDate||'')>=Y21_FINAL_START&&(r.total==null||r.done<r.total)).length;
 const oct=(DB.tests||[]).filter(t=>t.date===V10_OCT_EXAM),grades=SUBJECTS.map(s=>oct.flatMap(testSubjectRows).find(r=>r.subject===s)?.grade),octState=grades.every(g=>Number(g)===1)?'전과목 1등급 기록':grades.some(g=>Number(g)>0)?'일부 결과 입력 · 과목별 확인':'결과 미입력';
 const steps=[['2026-09-10','2026-10-16','과정별 1차 마감',`진도 완료 ${done}/${first.length} · 지연 ${late} · 시간 미정 ${first.filter(r=>r.workload.unknown).length}`],['2026-10-17','2026-10-19','학평 전 정리',`현재 미해결 ${pending}건 · 진도 완료와 별도 확인`],['2026-10-20','2026-10-20','10월 학평 · 전과목 1등급',octState],['2026-10-21','2026-11-08','실전 결과 기반 보완',`남은 과정 ${plans.filter(r=>r.total==null||r.done<r.total).length}개`],['2026-11-09','2026-11-18','마지막 10일 정리',`후반 마감·공개 확인 ${releasedLate}개 · 새 분량은 직접 판단`],['2026-11-19','2026-11-19','수능 만점','최종 목표']];
 $('#longRoadmap').innerHTML=steps.map(([start,end,title,desc])=>`<div class="roadmap-step ${viewDate>=start&&viewDate<=end?'active':''}"><b>${start.slice(5)}${start!==end?'–'+end.slice(5):''}</b><span><strong>${title}</strong><br>${esc(desc)}</span></div>`).join('')+'<details><summary>고정 제약</summary><p>10.07–08 면접 보호 · 체대입시 종료 '+esc(DB.settings.peEndDate||'2026-09-30')+' 예정 · 수면 이후 배정 금지</p></details>';
};

// Preserve extra analysis fields through all existing normalizers.
const y21Normalize=__impl_normalizeQuestionRecord;
__impl_normalizeQuestionRecord=function(q,fallback){const out=y21Normalize(q,fallback);return out?{...deep(q||{}),...out,evidenceStage:q?.evidenceStage||'',evidenceLog:Array.isArray(q?.evidenceLog)?deep(q.evidenceLog):[],nonAttemptReason:q?.nonAttemptReason||'',blockingQuestion:q?.blockingQuestion||'',linkedCourse:q?.linkedCourse||''}:null};
const Y21_STAGES={pending:'보완 전',retry:'재풀이 통과',transfer:'새 문제 통과',timed:'실전 재현 확인',relapse:'재발 · 재보완',legacy:'기존 해결 · 근거 미확인'};
const Y21_REASONS={'':'해당 없음 / 미확인',blocked:'앞 문항 지연으로 미도달',attempted:'시도했지만 미해결',concept:'풀이·개념 부족',uncertain:'재풀이 가능성만 추정'};
const y21OpenReview=__impl_openTestReviewModal;
__impl_openTestReviewModal=function(id){y21OpenReview(id);const t=mutableTest(id);if(!t)return;$$('#testReviewQuestions .review-question-card').forEach(card=>{const q=t.questionRecords.find(x=>x.id===card.dataset.questionId);if(!q)return;const old=card.querySelector('.review-q-state');if(old)old.closest('label').style.display='none';card.insertAdjacentHTML('beforeend',`<div class="y21-evidence"><label>검증 단계<select class="input y21-stage">${Object.entries(Y21_STAGES).map(([k,v])=>`<option value="${k}" ${y21Evidence(q)===k?'selected':''}>${v}</option>`).join('')}</select></label><label>미풀이 구분<select class="input y21-reason">${Object.entries(Y21_REASONS).map(([k,v])=>`<option value="${k}" ${q.nonAttemptReason===k?'selected':''}>${v}</option>`).join('')}</select></label><label>시간을 쓴 앞 문항<input class="input y21-blocker" value="${esc(q.blockingQuestion)}" placeholder="예: 5, 10"></label><label>보완 과정<select class="input y21-course"><option value="">미연결</option>${curriculumRowsV90().filter(r=>r.subject===q.subject).map(r=>`<option value="${esc(r.id)}" ${q.linkedCourse===r.id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label><label>검증 문제·근거<input class="input y21-proof" placeholder="새 문제 출처·번호, 결과"></label></div>`)});};
const y21SaveReview=__impl_saveTestReviewModal;
__impl_saveTestReviewModal=function(){const t=mutableTest($('#testReviewId').value);if(!t)return;let invalid=false;$$('#testReviewQuestions .review-question-card').forEach(card=>{const q=t.questionRecords.find(x=>x.id===card.dataset.questionId);if(!q)return;const stage=card.querySelector('.y21-stage')?.value||y21Evidence(q),proof=card.querySelector('.y21-proof')?.value.trim()||'';if(['transfer','timed'].includes(stage)&&stage!==y21Evidence(q)&&!proof)invalid=true});if(invalid){alert('새 문제·실전 통과에는 확인한 문제와 결과를 적어주세요.');return}
 $$('#testReviewQuestions .review-question-card').forEach(card=>{const q=t.questionRecords.find(x=>x.id===card.dataset.questionId);if(!q)return;const stage=card.querySelector('.y21-stage')?.value||y21Evidence(q),proof=card.querySelector('.y21-proof')?.value.trim()||'';if(stage!==y21Evidence(q)||proof)q.evidenceLog=[...(q.evidenceLog||[]),{date:todayDate(),stage,proof}];q.evidenceStage=stage;q.nonAttemptReason=card.querySelector('.y21-reason')?.value||'';q.blockingQuestion=card.querySelector('.y21-blocker')?.value||'';q.linkedCourse=card.querySelector('.y21-course')?.value||'';const state=card.querySelector('.review-q-state');if(state)state.value=stage==='timed'||stage==='legacy'?'resolved':'pending';});y21SaveReview();};
resolveQuestionReview=function(testId){openTestReviewModal(testId)};
reviewStatusLabel=q=>Y21_STAGES[y21Evidence(q)]||'재풀이 대기';
courseMasteryEvidenceV10=function(row){const complete=row.total!=null&&row.done>=row.total,entries=y21Questions(row.subject).filter(x=>x.question.linkedCourse===row.id),pending=entries.filter(x=>y21Evidence(x.question)!=='timed').length,m=row.meta?.mastery||{},manualAll=!!(m.review&&m.apply&&m.timed),autoEligible=complete&&entries.length>0&&pending===0;return{complete,last:courseLastCompletionDateV10(row),tests:new Set(entries.map(x=>x.test.id)).size,pending,abandoned:0,repeat:entries.some(x=>y21Evidence(x.question)==='relapse'),autoEligible,manualAll,status:!complete?'진행 중':row.meta?.closed?'사용자 종료':autoEligible?'연결 약점 검증됨':manualAll?'사용자 검증 완료':'진도 완료 · 검증 대기'}};

// Show observed score range, never an arbitrary perfect-score probability/index.
__impl_renderStabilityBoard=function(){const box=$('#stabilityBoard');if(!box)return;box.innerHTML=SUBJECTS.map(s=>{const rows=representativeRowsForSubject(s).filter(x=>x.test.date<=viewDate&&Number(x.row.score)>0).slice(-5),scores=rows.map(x=>Number(x.row.score)),check=y21Checks(s);return`<div class="stability-row"><b>${s}</b><span>${scores.length?`최근 ${scores.at(-1)}점 · 범위 ${Math.min(...scores)}–${Math.max(...scores)}점`:'원점수 기록 부족'}</span><small>대표 시험 ${rows.length}회 · 미해결 ${check.pending.length} · 재발 ${check.recurring.length}</small></div>`}).join('')};

// Generic merge keeps both sides available until explicit conflict selection.
function y21Merge(incoming,current,choices={}){
 incoming=deep(incoming);
 // An item already moved to another day or waiting must not be resurrected.
 const locations=new Map();for(const [date,list] of Object.entries(current.tasks||{}))for(const t of list||[])if(t.id)locations.set(t.id,date);for(const t of current.waiting||[])if(t.id)locations.set(t.id,'waiting');
 for(const [date,list] of Object.entries(incoming.tasks||{}))if(Array.isArray(list))incoming.tasks[date]=list.filter(t=>!locations.has(t.id)||locations.get(t.id)===date);
 if(Array.isArray(incoming.waiting))incoming.waiting=incoming.waiting.filter(t=>!locations.has(t.id)||locations.get(t.id)==='waiting');
 const conflicts=[];let additions=0;
 function merge(a,b,path){if(a===undefined)return deep(b);if(b===undefined){additions++;return deep(a)}if(JSON.stringify(a)===JSON.stringify(b))return deep(b);
  if(y21Object(a)&&y21Object(b)){const out={};for(const k of new Set([...Object.keys(a),...Object.keys(b)])){if(y21BadKey(k))continue;out[k]=merge(a[k],b[k],path.concat(k))}return out}
  if(Array.isArray(a)&&Array.isArray(b)){
   const key=x=>x&&typeof x==='object'?(path.at(-1)==='questionRecords'&&x.subject&&x.number?`${x.subject}:${x.number}`:(x.id??x.key)):typeof x==='string'?x:null;
   if([...a,...b].every(x=>key(x)!=null)){const amap=new Map(a.map(x=>[String(key(x)),x])),bmap=new Map(b.map(x=>[String(key(x)),x]));return [...new Set([...bmap.keys(),...amap.keys()])].map(k=>merge(amap.get(k),bmap.get(k),path.concat('@'+k)))}
  }
  const id=JSON.stringify(path);conflicts.push({id,path:path.join(' / '),incoming:a,current:b});return deep(choices[id]==='incoming'?a:b);
 }
 const data=merge(incoming,current,[]);return{data,conflicts,additions};
}
function y21CommitMerge(incoming,choices={}){
 const result=y21Merge(incoming,DB,choices),next=migrateDB(result.data),before=JSON.stringify(DB),json=JSON.stringify(next);
 if(!safeSetItem('p11122_pre_v21_merge',before))return false;
 if(!safeSetItem(DB_KEY,json))return false;
 DB=next;LAST_SAVED_JSON=json;return true;
}
function y21OpenMerge(raw){
 if(!validateBackupObject(raw))throw new Error('Unsupported backup');
 const incoming=raw.app?.name==='曆象'?convertYeoksangBackup(raw):raw,result=y21Merge(incoming,DB);y21PendingMerge={incoming};
 const box=$('#y21MergeBody');box.innerHTML=`<p>현재: ${esc(v11StatLine(v11DataStats(DB)))}</p><p>추가 항목 ${result.additions} · 충돌 ${result.conflicts.length} · 기본 선택은 현재 기록 유지</p><button class="btn ghost" id="y21DownloadBefore">현재 기록 백업 받기</button><div class="y21-conflicts">${result.conflicts.map((c,i)=>`<label><b>${esc(c.path)}</b><select class="input y21-conflict" data-i="${i}"><option value="current">현재 유지</option><option value="incoming">백업 값 선택</option></select><details><summary>두 값 비교</summary><pre>현재: ${esc(JSON.stringify(c.current,null,2))}\n백업: ${esc(JSON.stringify(c.incoming,null,2))}</pre></details></label>`).join('')}</div>`;y21PendingMerge.conflicts=result.conflicts;$('#y21DownloadBefore').onclick=exportData;showModal('y21MergeModal');
}
v11MergeDB=(old,current)=>migrateDB(y21Merge(old,current).data);
v11MergeState=(old,current)=>y21Merge(old||{},current||{}).data;
v11MergeImportFile=function(file){const reader=new FileReader();reader.onload=()=>{try{y21OpenMerge(JSON.parse(reader.result))}catch(e){alert('지원하는 JSON 백업인지 확인하세요. 현재 기록은 변경하지 않았습니다.')}};reader.onerror=()=>alert('파일을 읽지 못했습니다. 현재 기록은 유지됩니다.');reader.readAsText(file)};
__impl_importData=file=>v11MergeImportFile(file);
v11ApplyCandidate=i=>{const c=V11_RECOVERY_CANDIDATES[i];if(c&&c.source!=='current')y21OpenMerge(c.data)};
restoreSafetySnapshotV10=function(kind,index){const row=kind==='preimport'?safetySnapshotRowsV10().find(x=>x.kind==='preimport'):dailySafetySnapshotsV10()[Number(index)];if(!row?.data)return false;try{y21OpenMerge(JSON.parse(row.data));return true}catch{alert('안전본을 읽지 못했습니다.');return false}};

document.addEventListener('DOMContentLoaded',()=>{
 $('#y21ApplyMerge').onclick=()=>{if(!y21PendingMerge)return;const choices={};$$('.y21-conflict').forEach(x=>choices[y21PendingMerge.conflicts[Number(x.dataset.i)].id]=x.value);if(!y21CommitMerge(y21PendingMerge.incoming,choices)){alert('병합을 저장하지 못했습니다. 현재 기록은 유지됩니다. 먼저 백업을 내려받으세요.');return}y21PendingMerge=null;hideModal('y21MergeModal');navigate('dashboard');alert('선택한 내용으로 병합했습니다.');};
 document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.modal-back.show').forEach(x=>x.classList.remove('show'))});
});
// Assignment editor writes minutes and removes stale allocations on uncheck.
const y21AssignList=renderAssignList;
renderAssignList=function(){y21AssignList();const b=ensureSchedule($('#assignDate').value).find(x=>x.id===$('#assignBlockId').value);if(!b)return;$$('.assign-option').forEach(label=>{const id=label.querySelector('.assign-check').value;label.insertAdjacentHTML('beforeend',`<input class="input y21-alloc" type="number" min="1" max="${blockDuration(b)}" placeholder="분" aria-label="이 블록 배정 분" data-id="${esc(id)}" value="${b.taskAllocations?.[id]??''}" style="width:78px">`)});};
saveAssignments=function(){const date=$('#assignDate').value,blocks=ensureSchedule(date),b=blocks.find(x=>x.id===$('#assignBlockId').value);if(!b)return;const ids=$$('.assign-check:checked').map(x=>x.value),alloc={};for(const id of ids){const input=$$('.y21-alloc').find(x=>x.dataset.id===id),n=y21Number(input?.value);if(!n&&ids.length>1){alert('각 할 일에 배정할 분을 입력하세요.');return}alloc[id]=n||blockDuration(b)}if(Object.values(alloc).reduce((s,n)=>s+n,0)>blockDuration(b)){alert('배정 합계가 블록 시간을 초과합니다.');return}b.taskIds=ids;b.taskAllocations=alloc;saveSchedule(date,blocks);hideModal('assignModal');renderPlanner();renderDashboard();};
addQuestionReviewTask=function(testId,questionId){const test=mutableTest(testId),q=mutableQuestion(testId,questionId);if(!test||!q)return;const ref=`${testId}:${questionId}`;if([...Object.values(DB.tasks).flat(),...DB.waiting].some(t=>t.reviewRef===ref&&!t.done)){alert('이미 미완료 보완 과제가 있습니다.');return}const date=prompt('보완할 날짜',viewDate);if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date))return;const raw=prompt('예상 시간(분). 모르면 빈칸으로 두세요.','');if(raw===null)return;const minutes=y21Number(raw);addTask(date,{subject:q.subject,priority:'must',name:`${q.number}번 · ${q.controlRule||q.type||'재풀이·근거 확인'}`,material:`${test.name||'시험'} · ${test.date}`,minutes,reviewRef:ref,note:q.rootCause||q.note||'',components:[{id:uid(),kind:'manual',label:'보완 후 검증 기록',done:false}]});alert(`${date}에 보완 과제를 추가했습니다.${minutes?'':' 시간 미정으로 남겼습니다.'}`);renderTests();};
const y21MetaOpen=__impl_openCourseMeta;
__impl_openCourseMeta=function(id,kind){y21MetaOpen(id,kind);const row=courseRowInfo(id,kind),m=row?.meta||{};$('#y21ReleaseStart').value=m.releaseStart||'';$('#y21ReleaseEnd').value=m.releaseEnd||'';$('#y21TimeSource').value=m.timeSource||'';$('#y21TimeMode').value=m.timeMode||'total';for(const k of ['Watch','Speed','Practice','Review'])$('#y21'+k).value=m.timeParts?.[k.toLowerCase()]??'';};
const y21MetaSave=__impl_saveCourseMeta;
__impl_saveCourseMeta=function(){const id=$('#courseMetaId').value,low=$('#courseMetaLow').value,high=$('#courseMetaHigh').value;if(low!==''&&high!==''&&Number(high)<Number(low)){alert('최대 시간은 최소 시간 이상이어야 합니다.');return}const fields={releaseStart:$('#y21ReleaseStart').value,releaseEnd:$('#y21ReleaseEnd').value,timeSource:$('#y21TimeSource').value.trim(),timeMode:$('#y21TimeMode').value,timeParts:Object.fromEntries(['Watch','Speed','Practice','Review'].map(k=>[k.toLowerCase(),$('#y21'+k).value]))};DB.courseMeta[id]={...(DB.courseMeta[id]||{}),...fields};const extra=DB.curriculumExtra.find(x=>x.id===id);if(extra)Object.assign(extra,fields,{minutesPerUnitLow:low===''?null:Number(low),minutesPerUnitHigh:high===''?null:Number(high),targetDate:$('#courseMetaTarget').value,included:$('#courseMetaIncluded').checked});y21MetaSave();};

function y21CoverageRows(subject){const entries=y21Questions(subject),manual=DB.coverageTopics?.[subject]||[],observed=[...new Set(entries.map(x=>x.question.type).filter(Boolean))];return [...new Set([...manual,...observed])].map(topic=>{const qs=entries.filter(x=>x.question.type===topic),log=DB.coverageChecks?.[subject]?.[topic]||[],latest=log.filter(x=>x.date<=viewDate).at(-1),pending=qs.filter(x=>x.question.retryState!=='resolved').length;return{topic,pending,last:latest?.date||qs.map(x=>x.test.date).sort().at(-1)||'',state:pending?'보완 필요':latest?.result==='pass'?'직접 점검 통과':latest?.result==='fail'?'보완 필요':qs.length?'검증 근거 확인':'미점검'}})}
function y21RenderCoverage(){const box=$('#y21Coverage');if(!box)return;const subject=$('#y21CoverageSubject').value||'국어',rows=y21CoverageRows(subject);box.innerHTML=rows.length?rows.map((r,i)=>`<div class="y21-check-row"><b>${esc(r.topic)}</b><span>${r.state} · ${r.last||'기록 없음'}${r.pending?` · 미해결 ${r.pending}`:''}</span><button class="btn ghost small y21-check-topic" data-i="${i}">결과 기록</button></div>`).join(''):'<p class="muted">점검할 단원 목록을 직접 입력하세요. 목록 밖의 범위는 점검 여부를 알 수 없습니다.</p>';$$('.y21-check-topic').forEach(b=>b.onclick=()=>{const r=rows[Number(b.dataset.i)],proof=prompt('점검한 문제 출처·번호와 결과를 적어주세요.');if(!proof)return;const pass=confirm('시간 안에 근거 있게 해결했나요? 확인: 통과 / 취소: 보완 필요');DB.coverageChecks=DB.coverageChecks||{};DB.coverageChecks[subject]=DB.coverageChecks[subject]||{};const logs=DB.coverageChecks[subject][r.topic]||[];DB.coverageChecks[subject][r.topic]=[...logs,{date:viewDate,result:pass?'pass':'fail',proof}];saveDB();y21RenderCoverage()});}
const y21Analysis=__impl_renderAnalysis;
__impl_renderAnalysis=function(){y21Analysis();y21RenderCoverage()};
document.addEventListener('DOMContentLoaded',()=>{$('#y21CoverageSubject').onchange=y21RenderCoverage;$('#y21CoverageEdit').onclick=()=>{const s=$('#y21CoverageSubject').value,raw=prompt('단원·유형을 쉼표로 구분해 입력하세요. 기존 시험 기록은 삭제되지 않습니다.',(DB.coverageTopics?.[s]||[]).join(', '));if(raw===null)return;DB.coverageTopics=DB.coverageTopics||{};DB.coverageTopics[s]=[...new Set(raw.split(/[,\n]/).map(x=>x.trim()).filter(Boolean))];saveDB();y21RenderCoverage()};});
__impl_initPwaUpdate=function(){if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw-v200.js?v=2110').then(r=>r.update()).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>$('#updateBanner')?.classList.remove('hidden'));if($('#reloadUpdate'))$('#reloadUpdate').onclick=()=>location.reload()};
__impl_renderVersionStatus=()=>{$('#runtimeStatus').textContent='2.1.1 · SW 2.1.1'};
const y21Settings=__impl_renderSettings;
__impl_renderSettings=function(){y21Settings();$('#versionInfo').innerHTML=`<code>曆象 2.1.1<br>Build ${BUILD}<br>Data schema ${SCHEMA_VERSION}<br>개인 기록은 이 브라우저에 저장</code>`};
