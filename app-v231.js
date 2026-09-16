/* 曆象 2.3.1: shared deadlines, explicit replanning and relapse evidence. */
'use strict';
const Y231_VERSION='2.3.1';
function y231ValidDate(s){return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}

// Reading an overdue course must not silently create today's workload.
const y231CoursePlanBase=coursePlanV10;
coursePlanV10=function(row,date){
 const p=y231CoursePlanBase(row,date);
 if(p.workload.included!==false&&!p.stopped&&p.target<date&&(p.workload.unknown||p.workload.remaining>0))return{...p,overdue:true,needsReplan:true,todayLow:0,todayHigh:0,capacityMinutes:0};
 return p;
};
function y231Plans(date=viewDate){return curriculumRowsV90().map(r=>coursePlanV10(r,date)).filter(p=>p.workload.included!==false&&!p.stopped&&!(p.total!=null&&p.done>=p.total));}
function y231Backlog(plans){const rows=plans.filter(p=>p.needsReplan),known=rows.filter(p=>!p.workload.unknown);return{rows,low:known.reduce((n,p)=>n+p.workload.low/60,0),high:known.reduce((n,p)=>n+p.workload.high/60,0),unknown:rows.length-known.length};}
function y231Hours(low,high){return Math.abs(high-low)<.05?`${low.toFixed(1)}h`:`${low.toFixed(1)}–${high.toFixed(1)}h`;}
periodAverageNeedV11=function(date=viewDate){
 const plans=y231Plans(date);let low=0,high=0,unknown=0;
 for(const p of plans){
  if(p.workload.unknown){unknown++;continue;}if(p.needsReplan)continue;
  const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date;
  if(!y231ValidDate(p.target)||!y231ValidDate(start)||start>p.target){unknown++;continue;}
  const days=Math.max(1,daysBetween(start,p.target)+1);low+=p.workload.low/60/days;high+=p.workload.high/60/days;
 }
 return{low,high,days:Math.max(1,daysBetween(date,deadlineDate())+1),unknown,deadline:deadlineDate(),backlog:y231Backlog(plans)};
};

// This checks shared time totals, not proof of executable block placement.
// Every release/deadline window gets one capacity budget shared by all jobs
// that must fit wholly inside it. Unknown/overdue work is disclosed separately.
function y231DeadlineOutlook(date=viewDate,plans=y231Plans(date)){
 const backlog=y231Backlog(plans),unknown=plans.filter(p=>p.workload.unknown),invalid=[];
 const jobs=[];
 for(const p of plans){
  if(p.needsReplan||p.workload.unknown)continue;
  const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date;
  if(!y231ValidDate(p.target)||!y231ValidDate(start)||daysBetween(date,p.target)>730){invalid.push(p);continue;}
  jobs.push({p,start,end:p.target,low:p.workload.low/60,high:p.workload.high/60});
 }
 const end=jobs.reduce((s,j)=>j.end>s?j.end:s,date),prefix=[0];
 for(let d=date;d<=end;d=addDays(d,1))prefix.push(prefix.at(-1)+Math.max(0,Number(capacityHoursFor(d))||0));
 const capacity=(s,e)=>s>e?0:prefix[daysBetween(date,e)+1]-prefix[daysBetween(date,s)];
 const conflicts=[];
 const add=(s,e,inside)=>{const low=inside.reduce((n,j)=>n+j.low,0),high=inside.reduce((n,j)=>n+j.high,0),cap=capacity(s,e);if(low>cap+.05||high>cap+.05)conflicts.push({start:s,end:e,low,high,cap,hard:low>cap+.05,ids:inside.map(j=>j.p.id),names:inside.map(j=>j.p.name)});};
 for(const j of jobs)if(j.start>j.end)add(j.start,j.end,[j]);
 for(const s of [...new Set(jobs.map(j=>j.start))])for(const e of [...new Set(jobs.map(j=>j.end))]){
  if(s>e)continue;const inside=jobs.filter(j=>j.start>=s&&j.end<=e&&j.start<=j.end);if(inside.length)add(s,e,inside);
 }
 conflicts.sort((a,b)=>Number(b.hard)-Number(a.hard)||(b.hard?b.low-b.cap:b.high-b.cap)-(a.hard?a.low-a.cap:a.high-a.cap)||a.end.localeCompare(b.end));
 return{conflicts,backlog,unknown,invalid,jobs};
}
y230CourseRisk=function(p,date=viewDate,outlook=y231DeadlineOutlook(date)){
 if(p.total!=null&&p.done>=p.total)return{state:'완료',className:'ok',detail:'진도 완료'};
 if(p.needsReplan)return{state:'재마감 필요',className:'warn',detail:p.workload.unknown?'지연 잔량 · 시간 미정':`지연 잔량 ${y231Hours(p.workload.low/60,p.workload.high/60)}`};
 if(p.workload.unknown||outlook.invalid.some(x=>x.id===p.id))return{state:'판단 미정',className:'',detail:'분량·시간·일정 근거 확인'};
 const c=outlook.conflicts.find(x=>x.ids.includes(p.id));
 if(c)return{state:c.hard?'기간 총량 초과':'상한 위험',className:c.hard?'bad':'warn',detail:`${c.start.slice(5)}–${c.end.slice(5)} · ${c.ids.length}개 과정 ${y231Hours(c.low,c.high)} / 가용 ${c.cap.toFixed(1)}h`};
 return{state:'총량 내',className:'',detail:'연속 시간·기기·실제 배치는 별도 확인'};
};

// Use capacity weighting consistently with today's requirement calculation.
// Overdue work stays visible, but gets no invented new deadline or assignment.
y230WeeklyOutlook=function(date=viewDate){
 const end=addDays(date,6),plans=y231Plans(date),backlog=y231Backlog(plans),cap=capacitySummaryV90(date,end).totalHours;
 let low=0,high=0,unknown=0;
 for(const p of plans){
  if(p.workload.unknown){unknown++;continue;}if(p.needsReplan)continue;
  const start=p.releaseStart&&p.releaseStart>date?p.releaseStart:date,target=p.target;
  if(!y231ValidDate(target)||!y231ValidDate(start)||daysBetween(date,target)>730){unknown++;continue;}
  if(start>end)continue;
  const total=capacitySummaryV90(start,target).totalHours,overlapEnd=target<end?target:end;
  const window=capacitySummaryV90(start,overlapEnd).totalHours;
  const fraction=total>0?Math.min(1,window/total):(target<=end?1:0);
  low+=p.workload.low/60*fraction;high+=p.workload.high/60*fraction;
 }
 return{low,high,cap,unknown,end,backlog};
};

// Explicit recurrence on the same question is evidence too. A present
// pending state after a recorded pass counts even without a second exam.
y21Checks=function(subject,date=viewDate){
 const entries=y21Questions(subject,date),pending=entries.filter(x=>x.question.retryState!=='resolved'||y21Evidence(x.question)==='relapse');
 const recurring=pending.filter(x=>{
  const q=x.question;if(y21Evidence(q)==='relapse')return true;
  const logs=(q.evidenceLog||[]).filter(e=>!e.date||e.date<=date);
  if(['pending','retry'].includes(y21Evidence(q))&&logs.some(e=>['transfer','timed'].includes(e.stage)))return true;
  return Boolean(q.type&&q.pattern&&entries.some(y=>y.test.date<x.test.date&&y.question.type===q.type&&y.question.pattern===q.pattern&&y.question.retryState==='resolved'&&y21Evidence(y.question)!=='relapse'));
 });
 return{pending,recurring,unanalysed:pending.filter(x=>!x.question.cause&&!x.question.pattern),legacy:entries.filter(x=>y21Evidence(x.question)==='legacy').length};
};

function y231NextTask(subject,date=viewDate){
 const tasks=(DB.tasks[date]||[]).filter(t=>t.subject===subject&&!t.done);
 return tasks.find(t=>t.priority==='must')||tasks[0]||null;
}
const y231DecisionBase=decisionPlanV10;
decisionPlanV10=function(date=viewDate){
 const p=y231DecisionBase(date),hasPlan=y230HasPlan(date);
 for(const r of p.rows){
  const next=y231NextTask(r.subject,date),done=(DB.tasks[date]||[]).filter(t=>t.subject===r.subject&&t.done).length;
  const backlog=p.load.coursePlans.filter(x=>x.subject===r.subject&&x.needsReplan);
  r.reasons=r.reasons.filter(x=>!x.startsWith('지연 과정 '));
  if(backlog.length)r.reasons.push(`재마감 필요 ${backlog.length}개 · 오늘 필요량에 자동 가산하지 않음`);
  if(r.check.recurring.length)r.action='계획 안에서 재발 오류 확인';
  else if(p.reactivation&&next)r.action=`먼저 끝낼 것 · ${next.name}`;
  else if(p.reactivation&&done)r.action='완료 기록 있음 · 다음 과제 직접 선택';
  else if(backlog.length)r.action='지연 과정 마감 다시 정하기';
  else if(!hasPlan)r.action='오늘 할 분량 정하기';
  else if(r.shortage>.01)r.action=`${minuteLabel(Math.ceil(r.shortage*60))} 추가 검토`;
  r.nextTask=next;r.completedToday=done;r.replan=backlog.length;
 }
 // Keep the user's pin first; recurrence is observed evidence, not a score
 // prediction. Remaining ties retain the previous transparent calculation.
 p.rows.sort((a,b)=>Number(b.manual)-Number(a.manual)||Number(b.check.recurring.length>0)-Number(a.check.recurring.length>0));
 return p;
};

const y231DashboardBase=__impl_renderDashboard;
__impl_renderDashboard=function(){
 y231DashboardBase();const plans=y231Plans(viewDate),w=y230WeeklyOutlook(viewDate),b=w.backlog;
 const weekly=$('#weeklyOutlook');if(weekly)weekly.innerHTML=`이번 7일 <b>${y231Hours(w.low,w.high)} / 가용 ${w.cap.toFixed(1)}h</b>${w.high>w.cap+.05?`<small class="risk-text">상한 ${(w.high-w.cap).toFixed(1)}h 초과</small>`:''}${w.unknown?`<small>시간·일정 미정 ${w.unknown}개</small>`:''}${b.rows.length?`<small class="risk-text">별도 지연 ${y231Hours(b.low,b.high)}${b.unknown?' + 미정':''} · 재배정 전</small>`:''}`;
 const load=curriculumLoadV90(viewDate),p=y21Plan(viewDate),gap=$('#todayPlanGap');
 if(gap&&y230HasPlan(viewDate)&&p.total/60>=load.todayLow-.01&&p.total/60<=load.todayCap+.05&&b.rows.length){gap.textContent='재마감 필요';gap.classList.add('metric-risk');}
 const caption=$('#todayNeedCaption');if(caption&&b.rows.length)caption.textContent=`지연 ${b.rows.length}개는 재마감 후 반영`;
 const old=document.getElementById('y231Replan');if(old)old.remove();
 if(b.rows.length){
  const box=document.createElement('details');box.id='y231Replan';box.className='y231-replan';
  box.innerHTML=`<summary>재마감할 과정 ${b.rows.length}개 · ${y231Hours(b.low,b.high)}${b.unknown?' + 미정':''}</summary>${b.rows.map(x=>`<div class="y231-replan-row"><span>${esc(x.name)}<small>기존 마감 ${esc(x.target)}</small></span><button class="btn ghost small" data-y231-course="${esc(x.id)}" data-kind="${esc(x.kind||'other')}">마감 조정</button></div>`).join('')}`;
  const anchor=$('#decisionBoard');if(anchor){anchor.appendChild(box);box.querySelectorAll('[data-y231-course]').forEach(btn=>btn.onclick=()=>openCourseMeta(btn.dataset.y231Course,btn.dataset.kind));}
 }
 if(y230ReactivationActive(viewDate)){
  const summary=$('#decisionBoard .decision-summary span');const tasks=DB.tasks[viewDate]||[],done=tasks.filter(t=>t.done).length;
  if(summary)summary.textContent=`오늘 완료 ${done}/${tasks.length}개 · 분량은 직접 조정`;
 }
};
const y231ProgressBase=y230ProgressBase;
__impl_renderProgress=function(){
 y231ProgressBase();const box=$('#deadlineRiskBoard');if(!box)return;
 const plans=y231Plans(viewDate),out=y231DeadlineOutlook(viewDate,plans),rows=plans.map(p=>({p,r:y230CourseRisk(p,viewDate,out)}));
 const shown=rows.filter(x=>x.r.state!=='총량 내'&&x.r.state!=='완료');
 box.innerHTML=(shown.length?`<div class="deadline-risk-list">${shown.map(({p,r})=>`<div class="deadline-risk-row ${r.className}"><b>${esc(p.name)}</b><span>${r.state}</span><small>${esc(r.detail)}</small><button class="btn ghost small" data-y231-course="${esc(p.id)}" data-kind="${esc(p.kind||'other')}">분량·마감 조정</button></div>`).join('')}</div>`:'<div class="muted">입력된 과정의 기간별 총량 초과 없음 · 실제 배치는 별도 확인</div>')+'<details><summary>판정 범위</summary><p>같은 기간에 끝내야 하는 과정들은 하나의 가용시간을 공유합니다. 시간 미정과 재마감 전 잔량은 별도로 표시합니다. 연속 블록·기기 사용·과정 밖 과제의 시간까지 배치 가능하다는 보장은 아닙니다.</p></details>';
 box.querySelectorAll('[data-y231-course]').forEach(btn=>btn.onclick=()=>openCourseMeta(btn.dataset.y231Course,btn.dataset.kind));
};
const y231SettingsBase=__impl_renderSettings;
__impl_renderSettings=function(){y231SettingsBase();if($('#versionInfo'))$('#versionInfo').innerHTML=`<code>曆象 ${Y231_VERSION}<br>Data schema ${SCHEMA_VERSION}<br>지연 재계획 · 기간별 총량 · 재발 점검</code>`;};
__impl_renderVersionStatus=()=>{$('#runtimeStatus').textContent='2.3.1 · SW 2.3.1';};
