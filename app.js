(function () {
  'use strict';

  const C = window.YeoksangCore;
  const Charts = window.YeoksangCharts;
  const Storage = window.YeoksangStorage;
  const h = Charts.esc;
  const ROUTES = {
    today: ['今日 · 지금 해야 할 일', '오늘'],
    exams: ['觀測 · 점수와 문항의 증거', '시험'],
    weakness: ['正 · 틀린 이유를 고치는 곳', '약점'],
    curriculum: ['敬授人時 · 남은 일을 시간에 배정', '과정'],
    calendar: ['曆 · 가용 시간과 상태', '시간'],
    year: ['成歲 · 목표까지의 전체 좌표', '종합'],
    data: ['記錄 · 보존과 이관', '데이터']
  };
  const SUBJECTS = ['국어', '수학', '영어', '경제', '사회문화', '한국사'];
  const MAIN_SUBJECTS = ['국어', '수학', '영어', '경제', '사회문화'];
  const STAGES = ['unanalysed', 'analysed', 'untimed', 'timed', 'transfer', 'nextExam', 'stable'];
  const STAGE_LABELS = {
    unanalysed: '미분석', analysed: '원인 분석', untimed: '무제한 해결', timed: '시간 내 해결',
    transfer: '변형 해결', nextExam: '다음 시험 통과', stable: '안정', relapsed: '재발'
  };
  const CONFIDENCE = { verified: '공식 검증', user: '직접 확인', estimated: '범위 추정', unknown: '미정' };

  let state;
  let storageEngine = '확인 중';
  let storageWarning = '';
  let route = routeFromHash();
  let dialogSubmit = null;
  const ui = {
    examSubject: '경제', examMetric: 'score', examSource: '전체',
    weaknessSubject: '전체', weaknessStage: '전체', weaknessFocus: true,
    courseSubject: '전체'
  };

  const shell = document.getElementById('appShell');
  const screen = document.getElementById('screen');
  const boot = document.getElementById('bootScreen');
  const dialog = document.getElementById('appDialog');
  const dialogForm = dialog.querySelector('form');
  const dialogBody = document.getElementById('dialogBody');
  const globalDate = document.getElementById('globalDate');
  const toastNode = document.getElementById('toast');

  function routeFromHash() {
    const candidate = location.hash.replace(/^#\/?/, '').split('/')[0];
    return ROUTES[candidate] ? candidate : 'today';
  }

  function formatDate(date, withYear = false) {
    if (!date) return '—';
    const parsed = C.parseDate(date);
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'UTC',
      year: withYear ? 'numeric' : undefined,
      month: 'short', day: 'numeric', weekday: 'short'
    }).format(parsed);
  }

  function formatHours(minutes, digits = 1) {
    if (!Number.isFinite(Number(minutes))) return '—';
    return `${(Number(minutes) / 60).toFixed(digits)}시간`;
  }

  function formatHourRange(lowMinutes, highMinutes) {
    const low = Number(lowMinutes || 0) / 60;
    const high = Number(highMinutes || 0) / 60;
    return Math.abs(low - high) < .05 ? `${low.toFixed(1)}시간` : `${low.toFixed(1)}–${high.toFixed(1)}시간`;
  }

  function formatPercent(value) {
    return value == null || !Number.isFinite(value) ? '—' : `${Math.round(value * 100)}%`;
  }

  function shortNumber(value, digits = 1) {
    return Number(value || 0).toFixed(digits).replace(/\.0$/, '');
  }

  function safeHref(value) {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '#';
    } catch { return '#'; }
  }

  function timestampForFile() {
    return C.todayInZone(state.app?.timeZone);
  }

  function toast(message, error = false) {
    toastNode.textContent = message;
    toastNode.style.background = error ? 'var(--loss)' : 'var(--navy)';
    toastNode.hidden = false;
    clearTimeout(toastNode._timer);
    toastNode._timer = setTimeout(() => { toastNode.hidden = true; }, 3200);
  }

  async function commit(next, message = '', rerender = true) {
    try {
      const saved = await Storage.save(next);
      state = saved.state;
      storageEngine = saved.engine;
      storageWarning = saved.warning || '';
      updateStorageStatus();
      if (rerender) render();
      if (message) toast(message);
    } catch (error) {
      updateStorageStatus(error.message);
      toast(error.message, true);
    }
  }

  function updateStorageStatus(error = '') {
    const dot = document.getElementById('storageDot');
    const label = document.getElementById('storageLabel');
    dot.className = `status-dot ${error ? 'error' : 'ok'}`;
    label.textContent = error || `${storageEngine} 저장`;
    label.title = storageWarning || '';
  }

  function selectedDate() {
    return state.settings.selectedDate || C.todayInZone(state.app?.timeZone);
  }

  function actualToday() {
    return C.todayInZone(state.app?.timeZone);
  }

  function setRoute(next) {
    if (!ROUTES[next]) return;
    route = next;
    location.hash = next;
    document.getElementById('moreMenu').hidden = true;
    render();
    document.getElementById('mainContent').focus({ preventScroll: true });
  }

  function updateChrome() {
    const [kicker, title] = ROUTES[route];
    document.getElementById('routeKicker').textContent = kicker;
    document.getElementById('routeTitle').textContent = title;
    document.title = `${title} · 曆象`;
    globalDate.value = selectedDate();
    document.querySelectorAll('[data-route]').forEach(button => button.classList.toggle('is-active', button.dataset.route === route));
    renderMissionTrack();
    renderBackupWarning();
  }

  function renderMissionTrack() {
    const holder = document.getElementById('missionTrack');
    const start = state.settings.anchorDate;
    const end = state.goals.find(goal => goal.id === 'goal-csat')?.date || '2026-11-19';
    const today = actualToday();
    const total = Math.max(1, C.daysBetween(start, end));
    const position = date => C.clamp(C.daysBetween(start, date) / total * 100, 0, 100);
    const dday = C.daysBetween(today, end);
    const shownGoals = state.goals.filter(goal => ['goal-close', 'goal-oct', 'goal-csat'].includes(goal.id));
    holder.innerHTML = `
      <div class="track-head">
        <strong>欽若昊天 · 목표는 고정하고 현재 좌표는 매일 다시 잰다</strong>
        <span>${dday > 0 ? `수능 D-${dday}` : dday === 0 ? '수능 D-DAY' : `수능 D+${Math.abs(dday)}`}</span>
      </div>
      <div class="track-line">
        <span class="track-progress" style="width:${position(today)}%"></span>
        <i class="track-now" style="left:${position(today)}%" title="오늘 ${h(today)}"></i>
        ${shownGoals.map(goal => `<span class="track-goal" style="left:${position(goal.date)}%"><i></i><b>${h(goal.label)}</b><span>${h(goal.date.slice(5).replace('-', '.'))}</span></span>`).join('')}
      </div>`;
  }

  function renderBackupWarning() {
    const warning = document.getElementById('backupWarning');
    const last = state.meta?.lastBackupAt;
    const days = last ? Math.floor((Date.now() - new Date(last).getTime()) / C.DAY) : Infinity;
    if (days >= Number(state.settings.backupWarningDays || 7)) {
      warning.hidden = false;
      warning.innerHTML = last
        ? `마지막 내보내기 후 <strong>${days}일</strong>이 지났습니다. GitHub는 앱 코드만 보관하고, 이 기기의 새 기록은 자동 동기화하지 않습니다.`
        : '<strong>첫 데이터 백업이 아직 없습니다.</strong> 선탑재 데이터 이후의 기록은 이 브라우저에 저장되므로 JSON을 내려받아 보관하세요.';
    } else {
      warning.hidden = true;
    }
  }

  function render() {
    updateChrome();
    const renderers = { today: renderToday, exams: renderExams, weakness: renderWeakness, curriculum: renderCurriculum, calendar: renderCalendar, year: renderYear, data: renderData };
    screen.innerHTML = renderers[route]();
  }

  function quotaHero(load, title = '10월 16일까지 오늘의 최소 배정') {
    const unknown = load.unknownItems.length;
    const todayRange = load.todayCapacityHours
      ? `${shortNumber(load.todayLowHours)}–${shortNumber(load.todayHighHours)}시간`
      : '보호일 · 0시간';
    const pressure = load.utilizationHigh > 1 ? '현재 추정 상한이 가용 시간을 넘습니다.' : load.utilizationHigh > .85 ? '상한 기준 여유가 작습니다.' : '현재 입력 범위 안에서는 실행 가능합니다.';
    return `<article class="card card-dark hero-quota">
      <div>
        <p class="eyebrow">敬授人時 · DAILY MINIMUM</p>
        <h2>${h(title)}<br><em>${h(todayRange)}</em></h2>
        <p>선택일 가용 ${shortNumber(load.todayCapacityHours)}시간에 전체 남은 분량의 압력을 비례 배정했습니다. 활동일 단순 평균은 ${shortNumber(load.averageLowHours)}–${shortNumber(load.averageHighHours)}시간입니다. ${h(pressure)}</p>
        <div class="quota-equation">남은 분량 ${shortNumber(load.lowMinutes / 60)}–${shortNumber(load.highMinutes / 60)}h ÷ 남은 가용 ${shortNumber(load.capacity.totalHours)}h × 오늘 ${shortNumber(load.todayCapacityHours)}h</div>
      </div>
      <div class="quota-side">
        <span>남은 가용 시간</span><strong>${shortNumber(load.capacity.totalHours)}h</strong>
        <span>확정·직접 확인분</span><strong>${formatHourRange(load.confirmedLowMinutes, load.confirmedHighMinutes)}</strong>
        <span>미정 항목</span><strong class="${unknown ? 'loss-text' : ''}">${unknown}개</strong>
      </div>
    </article>`;
  }

  function renderCompletion(record) {
    if (record.state === 'future') {
      return `<div class="unavailable"><strong>미래 계획 ${record.plannedTaskCount}개</strong><br>아직 수행 대상이 아니므로 완주율 분모에서 제외됩니다.</div>`;
    }
    if (record.state === 'unavailable') {
      return `<div class="unavailable"><strong>기록 불충분</strong><br>기존 백업에는 이 날짜의 원래 계획 분모가 없어 과거 완주율을 계산하지 않습니다.${record.actualMinutes != null ? ` 순공 ${Math.round(record.actualMinutes)}분 기록만 보존했습니다.` : ''}</div>`;
    }
    return `<div class="completion-grid">
      <div class="completion-item"><b>${formatPercent(record.mustRate)}</b><span>필수 완주 · ${record.mustCompletedUnits}/${record.mustUnits}</span></div>
      <div class="completion-item"><b>${formatPercent(record.rate)}</b><span>전체 완주 · ${record.completedUnits}/${record.committedUnits}</span></div>
      <div class="completion-item"><b>${record.committedUnits ? formatPercent(record.carriedUnits / record.committedUnits) : '—'}</b><span>이월률 · ${record.carriedUnits}/${record.committedUnits}</span></div>
      <div class="completion-item"><b>${formatPercent(record.timeRate)}</b><span>시간 달성 · ${record.actualMinutes}/${record.plannedMinutes}분</span></div>
    </div>`;
  }

  function renderToday() {
    const date = selectedDate();
    const load = C.curriculumLoad(state, date);
    const record = C.deriveDayRecord(state, date, actualToday());
    const tasks = state.tasks.filter(task => (task.scheduledDate === date || (task.status === 'skipped' && C.committedOnDate(task, date))) && task.status !== 'deleted');
    const waiting = state.tasks.filter(task => task.status === 'waiting');
    const blocks = state.scheduleBlocks.filter(block => block.date === date).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    const isClosed = state.dayClosures?.[date]?.reliable;
    const focus = C.focusExamSummary(state);
    return `<div class="section-stack">
      ${quotaHero(load)}
      <div class="grid grid-4">
        <article class="card metric-card"><div class="metric-label"><span>선택일 가용량</span><span class="tag tag-gold">時間</span></div><strong>${shortNumber(load.todayCapacityHours)}h</strong><small>${formatDate(date, true)} 기준</small></article>
        <article class="card metric-card"><div class="metric-label"><span>필수 완주율</span><span class="tag tag-blue">原約</span></div><strong>${formatPercent(record.mustRate)}</strong><small>이월해도 원래 날짜 분모 유지</small></article>
        <article class="card metric-card"><div class="metric-label"><span>9모 미분석</span><span class="tag tag-loss">未正</span></div><strong class="danger">${focus.unanalysed}</strong><small>국어 8 + 영어 4</small></article>
        <article class="card metric-card"><div class="metric-label"><span>안정화 문항</span><span class="tag tag-stable">定</span></div><strong class="good">${focus.stable}</strong><small>다음 시험 통과까지 확인된 문항</small></article>
      </div>

      <div class="grid grid-main">
        <article class="card">
          <header class="card-header">
            <div><h2>${formatDate(date, true)}의 약속</h2><p>${isClosed ? '마감 스냅샷이 고정되었습니다.' : '오늘 끝내지 못해도 원래 약속은 사라지지 않습니다.'}</p></div>
            <div class="toolbar">
              <button class="button button-small" data-action="add-task">+ 할 일</button>
              ${isClosed ? '<button class="button button-small" data-action="reopen-day">마감 다시 열기</button>' : '<button class="button button-dark button-small" data-action="close-day">오늘 마감</button>'}
            </div>
          </header>
          <div class="card-body">
            ${renderCompletion(record)}
            <div style="height:16px"></div>
            <div class="task-list">
              ${tasks.length ? tasks.map(task => renderTaskRow(task, date, isClosed)).join('') : '<div class="task-empty">이 날짜에 배정된 할 일이 없습니다.<br><small>과정 화면의 남은 분량을 보고 오늘 약속을 만드세요.</small></div>'}
            </div>
          </div>
        </article>

        <div class="section-stack">
          <article class="card">
            <header class="card-header"><div><h3>시간표</h3><p>기존 백업 블록까지 날짜별로 보존</p></div><div class="toolbar"><button class="button button-small" data-action="schedule-templates">템플릿</button><button class="button button-small" data-action="add-block">+ 블록</button></div></header>
            <div class="card-body">
              <div class="schedule-list">${blocks.length ? blocks.map(renderScheduleRow).join('') : '<div class="task-empty">등록된 시간표 블록이 없습니다.</div>'}</div>
            </div>
          </article>
          <article class="card">
            <header class="card-header"><div><h3>대기함</h3><p>원래 날짜를 잃은 기존 17건도 보존</p></div><span class="tag">${waiting.length}개</span></header>
            <div class="card-body">
              <ul class="plain-list">${waiting.slice(0, 6).map(task => `<li class="task-row"><div></div><div><div class="task-title">${h(task.title)}</div><div class="task-meta">${h(task.subject)}${task.committedDate ? ` · 원약속 ${h(task.committedDate)}` : ' · 원약속일 복원 불가'}</div></div><button class="button button-small" data-action="schedule-waiting" data-id="${h(task.id)}">이날 배정</button></li>`).join('') || '<li class="muted">대기 작업이 없습니다.</li>'}</ul>
              ${waiting.length > 6 ? `<p class="form-note">외 ${waiting.length - 6}개 · 날짜에 배정하면 목록에서 사라집니다.</p>` : ''}
            </div>
          </article>
        </div>
      </div>

      <article class="card">
        <header class="card-header"><div><h2>최근 7일 완주 기록</h2><p>미래는 제외하고, 이월 전의 원래 약속 분모를 기준으로 고정</p></div><span class="tag">今日以前</span></header>
        <div class="card-body">${renderCompletionHistory(date)}</div>
      </article>

      <article class="card">
        <header class="card-header"><div><h2>오늘의 과목 압력</h2><p>남은 전체 분량을 선택일 가용 시간에 비례 배정한 값</p></div><button class="button button-small" data-route="curriculum">과정 전체 보기</button></header>
        <div class="card-body"><div class="grid grid-3">${load.bySubject.map(row => {
          const shareLow = load.lowMinutes ? row.lowMinutes / load.lowMinutes * load.todayLowHours : 0;
          const shareHigh = load.highMinutes ? row.highMinutes / load.highMinutes * load.todayHighHours : 0;
          return `<div class="metric-card card"><span class="tag">${h(row.subject)}</span><strong>${shortNumber(shareLow)}–${shortNumber(shareHigh)}h</strong><small>남은 ${formatHourRange(row.lowMinutes, row.highMinutes)}</small></div>`;
        }).join('')}</div></div>
      </article>
    </div>`;
  }

  function renderCompletionHistory(date) {
    const end=C.compareDates(date,actualToday())>0?actualToday():date;
    const dates=Array.from({length:7},(_,index)=>C.addDays(end,index-6));
    return `<div class="grid grid-3">${dates.map(day=>{const record=C.deriveDayRecord(state,day,actualToday());if(record.state==='unavailable')return `<div class="metric-card card"><div class="metric-label"><span>${formatDate(day)}</span><span class="tag">근거 없음</span></div><strong>—</strong><small>과거 분모 미복원</small></div>`;const rate=record.rate;return `<div class="metric-card card"><div class="metric-label"><span>${formatDate(day)}</span><span class="tag ${record.state==='closed'?'tag-stable':''}">${record.state==='closed'?'마감':'열림'}</span></div><strong>${formatPercent(rate)}</strong><div class="progress-line ${rate!=null&&rate<.7?'loss':''}" style="margin-top:9px"><span style="width:${rate==null?0:Math.round(rate*100)}%"></span></div><small>${record.completedUnits??0}/${record.committedUnits??0}단위 · 이월 ${record.carriedUnits??0}</small></div>`;}).join('')}</div>`;
  }

  function renderTaskRow(task, date, locked) {
    const done = task.status === 'done';
    const carried = task.committedDate && task.committedDate !== task.scheduledDate;
    return `<div class="task-row ${done ? 'is-done' : ''}">
      <input class="task-check" type="checkbox" data-action="toggle-task" data-id="${h(task.id)}" ${done ? 'checked' : ''} ${locked ? 'disabled' : ''} aria-label="${h(task.title)} 완료">
      <div>
        <div class="task-title">${h(task.title)} ${task.priority === 'must' ? '<span class="tag tag-blue">필수</span>' : '<span class="tag">선택</span>'} ${carried ? `<span class="tag tag-loss">${h(task.committedDate)} 이월</span>` : ''} ${task.status==='skipped'?'<span class="tag tag-loss">건너뜀</span>':''} ${task.status==='partial'?`<span class="tag tag-gold">${h(task.completedUnits)}/${h(task.totalUnits)} 완료</span>`:''}</div>
        <div class="task-meta">${h(task.subject)}${task.material ? ` · ${h(task.material)}` : ''}${task.plannedMinutes ? ` · ${h(task.plannedMinutes)}분` : ' · 시간 미입력'}</div>
      </div>
      <div class="task-actions">
        ${!locked ? `<button class="button button-small" data-action="edit-task" data-id="${h(task.id)}">수정</button>` : ''}${!done && !locked ? `<button class="button button-small" data-action="move-tomorrow" data-id="${h(task.id)}">내일</button><button class="button button-small" data-action="move-waiting" data-id="${h(task.id)}">대기</button><button class="button button-quiet button-small" data-action="skip-task" data-id="${h(task.id)}">건너뜀</button>` : ''}
      </div>
    </div>`;
  }

  function renderScheduleRow(block) {
    return `<div class="schedule-row"><time class="schedule-time">${h(block.start)}–${h(block.end)}</time><div><h4>${h(block.label)}</h4><p>${h(block.plan || (block.selfStudy ? '자습' : ''))}</p></div><div class="toolbar"><span class="tag ${block.done ? 'tag-stable' : ''}">${block.done ? '완료' : h(block.type)}</span><button class="button button-small" data-action="edit-block" data-id="${h(block.id)}">수정</button></div></div>`;
  }

  function latestResult(subject) {
    return C.examResults(state.exams, subject).filter(row => row.score != null).at(-1) || null;
  }

  function renderExams() {
    const focus = C.focusExamSummary(state);
    const rows = C.examResults(state.exams, ui.examSubject, { source: ui.examSource });
    const metricMap = { score: '원점수', grade: '등급', minutes: '소요시간', wrong: '오답 수' };
    const trendRows = rows.map(row => ({
      date: row.date,
      label: `${row.examName} · ${row.source}`,
      value: ui.examMetric === 'wrong' ? (row.wrong || []).length : row[ui.examMetric]
    }));
    const chartOptions = ui.examMetric === 'score'
      ? { min: 0, max: 100, format: value => `${Math.round(value)}점`, color: '#2559b8' }
      : ui.examMetric === 'grade'
        ? { min: 1, max: 9, lowerIsBetter: true, format: value => `${Math.round(value)}등급`, color: '#9a7125' }
        : ui.examMetric === 'minutes'
          ? { min: 0, format: value => `${Math.round(value)}분`, color: '#9a7125' }
          : { min: 0, format: value => `${Math.round(value)}개`, color: '#b84932' };
    const heat = C.repeatedQuestionData(state.exams, ui.examSubject, '평가원 전범위');
    return `<div class="section-stack">
      <div class="grid grid-4">
        <article class="card metric-card card-loss"><div class="metric-label"><span>9모 총 손실</span><span class="tag tag-loss">LOSS</span></div><strong class="danger">−${focus.totalLoss}점</strong><small>한국사 제외 5과목, 만점 대비</small></article>
        <article class="card metric-card"><div class="metric-label"><span>오답 문항</span><span class="tag">9모</span></div><strong>${focus.wrongCount}</strong><small>한국사 번호 미제공</small></article>
        <article class="card metric-card"><div class="metric-label"><span>미분석</span><span class="tag tag-loss">未</span></div><strong class="danger">${focus.unanalysed}</strong><small>국어 8 · 영어 4</small></article>
        <article class="card metric-card"><div class="metric-label"><span>시간 소진 후 포기</span><span class="tag tag-gold">棄</span></div><strong>${focus.abandoned}</strong><small>경제 19·20번</small></article>
      </div>

      <article class="card">
        <header class="card-header">
          <div><h2>최근 과목 좌표</h2><p>등급이 없으면 추정하지 않고 원점수만 표시</p></div>
          <button class="button button-primary" data-action="add-exam">+ 시험 기록</button>
        </header>
        <div class="card-body"><div class="subject-strip">${MAIN_SUBJECTS.map(subject => {
          const latest = latestResult(subject);
          return `<button class="subject-card" data-action="exam-subject" data-subject="${h(subject)}" style="text-align:left;${ui.examSubject === subject ? 'border-color:var(--blue);box-shadow:inset 0 0 0 1px var(--blue)' : ''}"><span class="subject-name">${h(subject)}</span><strong>${latest?.score ?? '—'}<small>${latest?.score != null ? '점' : ''}</small></strong><small>${latest?.grade ? `${latest.grade}등급 · ` : '등급 미입력 · '}${latest?.date || '기록 없음'}</small></button>`;
        }).join('')}</div></div>
      </article>

      <div class="grid grid-main">
        <article class="card">
          <header class="card-header">
            <div><h2>${h(ui.examSubject)} ${h(metricMap[ui.examMetric])} 추이</h2><p>시험 종류를 섞지 않으려면 오른쪽 필터를 고정하세요.</p></div>
            <div class="toolbar"><select id="examSourceFilter" aria-label="시험 종류 필터"><option>전체</option>${['모평','학평','수능','사설','학교','실모','분류 확인'].map(source => `<option ${ui.examSource === source ? 'selected' : ''}>${source}</option>`).join('')}</select></div>
          </header>
          <div class="card-body">
            <div class="segmented">${Object.entries(metricMap).map(([key, label]) => `<button data-action="exam-metric" data-metric="${key}" class="${ui.examMetric === key ? 'is-active' : ''}">${label}</button>`).join('')}</div>
            <div class="chart-scroll" style="margin-top:14px">${Charts.trend(trendRows, { ...chartOptions, ariaLabel: `${ui.examSubject} ${metricMap[ui.examMetric]} 추이`, note: ui.examSource === '전체' ? '종류 혼합' : ui.examSource })}</div>
          </div>
        </article>
        <article class="card">
          <header class="card-header"><div><h2>9모 과목별 손실</h2><p>만점까지 회수해야 하는 점수</p></div></header>
          <div class="card-body">${Charts.lossBars(focus.bySubject.filter(row => MAIN_SUBJECTS.includes(row.subject)))}</div>
        </article>
      </div>

      <article class="card">
        <header class="card-header"><div><h2>항상 틀리는 번호</h2><p>같은 조건의 완전한 문항표 3회 이상에서만 판정</p></div><span class="tag">${h(ui.examSubject)} · 평가원 전범위</span></header>
        <div class="card-body">${Charts.heatmap(heat)}</div>
      </article>

      <article class="card">
        <header class="card-header"><div><h2>시험 원장</h2><p>기존 17건은 유형이 모두 ‘기타’였으므로 분류 확인 상태로 이관</p></div><span class="tag">${state.exams.length}건</span></header>
        <div class="card-body"><div class="exam-list">${[...state.exams].sort((a,b) => b.date.localeCompare(a.date)).map(exam => {
          const resultText = exam.results.map(result => `${result.subject} ${result.score ?? '—'}${result.grade ? `/${result.grade}등급` : ''}`).join(' · ');
          return `<div class="exam-row"><time>${h(exam.date)}</time><div><h4>${h(exam.name)} ${exam.classificationPending ? '<span class="tag tag-gold">분류 확인</span>' : ''}</h4><p>${h(resultText)}</p></div><div class="toolbar"><span class="tag">${h(exam.source)}</span><button class="button button-small" data-action="edit-exam" data-id="${h(exam.id)}">보기·수정</button></div></div>`;
        }).join('')}</div></div>
      </article>
    </div>`;
  }

  function renderWeakness() {
    const focusId = 'exam-2026-09-kice-full';
    const base = state.questionAnalyses.filter(row => !ui.weaknessFocus || row.examId === focusId);
    const filtered = base.filter(row => (ui.weaknessSubject === '전체' || row.subject === ui.weaknessSubject) && (ui.weaknessStage === '전체' || row.stage === ui.weaknessStage));
    const focus = C.focusExamSummary(state);
    const categoryCounts = new Map();
    state.questionAnalyses.filter(row => row.examId === focusId && row.category !== '미분석').forEach(row => categoryCounts.set(row.category, (categoryCounts.get(row.category) || 0) + 1));
    return `<div class="section-stack">
      <div class="grid grid-4">
        <article class="card metric-card"><div class="metric-label"><span>9모 분석 완료</span><span class="tag tag-blue">原因</span></div><strong>${focus.wrongCount - focus.unanalysed}/${focus.wrongCount}</strong><small>설명만 끝내지 않고 증거 단계로 이동</small></article>
        <article class="card metric-card card-loss"><div class="metric-label"><span>미분석</span><span class="tag tag-loss">未</span></div><strong>${focus.unanalysed}</strong><small>국어·영어 분석 대기</small></article>
        <article class="card metric-card card-gold"><div class="metric-label"><span>무제한 해결 이상</span><span class="tag tag-gold">驗</span></div><strong>${state.questionAnalyses.filter(row => row.examId === focusId && ['untimed','timed','transfer','nextExam','stable'].includes(row.stage)).length}</strong><small>말이 아니라 재풀이 증거</small></article>
        <article class="card metric-card card-stable"><div class="metric-label"><span>안정</span><span class="tag tag-stable">定</span></div><strong>${focus.stable}</strong><small>다음 시험에서도 재발하지 않음</small></article>
      </div>

      <article class="card">
        <header class="card-header"><div><h2>근본 원인 지도</h2><p>9모에서 이미 드러난 원인을 문항 수로만 집계합니다.</p></div><button class="button" data-action="copy-advisor">상담용 기록 복사</button></header>
        <div class="card-body"><div class="grid grid-3">${[...categoryCounts.entries()].sort((a,b) => b[1]-a[1]).map(([category,count]) => `<div class="metric-card card"><span class="tag tag-loss">${h(category)}</span><strong>${count}문항</strong><small>${category === '조급함/검증 생략' ? '수학 문항별 원인 분리는 아직 가설' : '직접 진술을 근거로 분류'}</small></div>`).join('')}</div></div>
      </article>

      <article class="card">
        <header class="card-header">
          <div><h2>문항별 증거 사슬</h2><p>미분석 → 원인 → 무제한 → 시간 내 → 변형 → 다음 시험 → 안정</p></div>
          <div class="toolbar">
            <label><span class="muted">과목 </span><select id="weaknessSubjectFilter"><option>전체</option>${MAIN_SUBJECTS.map(subject => `<option ${ui.weaknessSubject===subject?'selected':''}>${subject}</option>`).join('')}</select></label>
            <label><span class="muted">단계 </span><select id="weaknessStageFilter"><option>전체</option>${STAGES.concat('relapsed').map(stage => `<option value="${stage}" ${ui.weaknessStage===stage?'selected':''}>${STAGE_LABELS[stage]}</option>`).join('')}</select></label>
            <label class="checkbox-line"><input id="weaknessFocusFilter" type="checkbox" ${ui.weaknessFocus?'checked':''}> 9모만</label>
          </div>
        </header>
        <div class="card-body"><div class="risk-list">${filtered.length ? filtered.map(renderWeaknessCard).join('') : '<div class="task-empty">이 조건의 문항이 없습니다.</div>'}</div></div>
      </article>
    </div>`;
  }

  function renderWeaknessCard(row) {
    const stageIndex = STAGES.indexOf(row.stage);
    return `<article class="weakness-card">
      <div class="question-badge"><b>${h(row.questionNumber)}번</b><span>${h(row.subject)}</span></div>
      <div>
        <h3>${h(row.category)} ${row.abandoned ? '<span class="tag tag-loss">시간 소진 후 포기</span>' : ''} <span class="tag ${row.stage==='stable'?'tag-stable':row.stage==='unanalysed'?'tag-loss':'tag-blue'}">${h(STAGE_LABELS[row.stage] || row.stage)}</span></h3>
        <p><strong>직접 원인</strong> · ${h(row.directCause || '아직 기록하지 않음')}</p>
        <p><strong>근본 가설</strong> · ${h(row.rootHypothesis || '아직 기록하지 않음')}</p>
        ${row.prevention ? `<p><strong>방지 규칙</strong> · ${h(row.prevention)}</p>` : ''}
        <div class="stage-flow">${STAGES.map((stage,index) => `<span class="stage-chip ${index===stageIndex?'is-current':''}">${h(STAGE_LABELS[stage])}</span>`).join('')}</div>
      </div>
      <div class="weakness-actions">
        <button class="button button-small" data-action="edit-weakness" data-id="${h(row.id)}">분석 수정</button>
        ${row.stage !== 'stable' ? `<button class="button button-primary button-small" data-action="advance-weakness" data-id="${h(row.id)}">다음 증거</button>` : `<button class="button button-small" data-action="relapse-weakness" data-id="${h(row.id)}">재발 기록</button>`}
      </div>
    </article>`;
  }

  function renderCurriculum() {
    const date = selectedDate();
    const load = C.curriculumLoad(state, date);
    const courses = state.curriculum.filter(item => ui.courseSubject === '전체' || item.subject === ui.courseSubject);
    return `<div class="section-stack">
      ${quotaHero(load, '10월 16일까지 필요한 하루 공부량')}
      <div class="grid grid-4">
        <article class="card metric-card"><div class="metric-label"><span>남은 활동일</span><span class="tag">日</span></div><strong>${load.capacity.activeDays}일</strong><small>보호일 ${load.capacity.zeroDays}일 제외</small></article>
        <article class="card metric-card"><div class="metric-label"><span>남은 가용량</span><span class="tag tag-gold">時</span></div><strong>${shortNumber(load.capacity.totalHours)}h</strong><small>평일 10h · 주말/추석 14h</small></article>
        <article class="card metric-card"><div class="metric-label"><span>예상 필요량</span><span class="tag tag-blue">量</span></div><strong>${shortNumber(load.lowMinutes/60)}–${shortNumber(load.highMinutes/60)}h</strong><small>추정 범위를 포함한 합계</small></article>
        <article class="card metric-card ${load.utilizationHigh>.85?'card-loss':'card-stable'}"><div class="metric-label"><span>가용량 점유</span><span class="tag ${load.utilizationHigh>.85?'tag-loss':'tag-stable'}">壓</span></div><strong>${Math.round(load.utilizationLow*100)}–${Math.round(load.utilizationHigh*100)}%</strong><small>미정 ${load.unknownItems.length}개는 아직 별도</small></article>
      </div>

      ${load.unknownItems.length ? `<div class="notice notice-danger"><strong>계획의 구멍 ${load.unknownItems.length}개:</strong> ${load.unknownItems.map(item => h(item.name)).join(' · ')}. 이 분량은 필요량 합계에 0으로 포함된 것이 아니라 아예 분리되어 있습니다.</div>` : ''}

      <article class="card">
        <header class="card-header">
          <div><h2>과목별 일일 최소 배정</h2><p>오늘의 ${shortNumber(load.todayLowHours)}–${shortNumber(load.todayHighHours)}시간을 남은 과목 비중대로 나눈 값</p></div>
          <div class="toolbar"><span class="tag tag-blue">공식</span><span class="tag tag-gold">직접 확인</span><span class="tag">범위 추정</span><span class="tag tag-loss">미정</span></div>
        </header>
        <div class="card-body"><div class="grid grid-3">${load.bySubject.map(row => {
          const low = load.lowMinutes ? row.lowMinutes / load.lowMinutes * load.todayLowHours : 0;
          const high = load.highMinutes ? row.highMinutes / load.highMinutes * load.todayHighHours : 0;
          return `<div class="metric-card card"><div class="metric-label"><span>${h(row.subject)}</span><span>${row.items}개 과정</span></div><strong>${shortNumber(low)}–${shortNumber(high)}h</strong><small>전체 잔량 ${formatHourRange(row.lowMinutes,row.highMinutes)}</small></div>`;
        }).join('')}</div></div>
      </article>

      <article class="card">
        <header class="card-header">
          <div><h2>과정 원장</h2><p>진도를 바꾸면 하루 최소량이 즉시 다시 계산됩니다.</p></div>
          <select id="courseSubjectFilter"><option>전체</option>${SUBJECTS.map(subject => `<option ${ui.courseSubject===subject?'selected':''}>${subject}</option>`).join('')}</select>
        </header>
        <div class="card-body"><div class="course-group">${courses.map((item) => renderCourseCard(item, load)).join('')}</div></div>
      </article>
    </div>`;
  }

  function renderCourseCard(item, load) {
    const row = load.rows.find(candidate => candidate.item.id === item.id);
    const workload = row?.workload || C.itemWorkload(item);
    const remaining = workload.remaining;
    const totalLabel = item.totalUnitsLow != null
      ? `${item.totalUnitsLow}–${item.totalUnitsHigh}${item.unitLabel}`
      : item.totalUnits == null ? '분량 미정' : `${item.completedUnits}/${item.totalUnits}${item.unitLabel}`;
    const ratio = item.totalUnits ? C.clamp(Number(item.completedUnits || 0) / Number(item.totalUnits), 0, 1) : 0;
    const perDayLow = load.capacity.activeDays && !remaining.unknown ? remaining.low / load.capacity.activeDays : null;
    const perDayHigh = load.capacity.activeDays && !remaining.unknown ? remaining.high / load.capacity.activeDays : null;
    return `<article class="course-card confidence-${h(item.confidence)}">
      <div>
        <div class="toolbar"><span class="tag">${h(item.subject)}</span><span class="tag ${item.confidence==='verified'?'tag-blue':item.confidence==='user'?'tag-gold':item.confidence==='unknown'?'tag-loss':''}">${h(CONFIDENCE[item.confidence])}</span>${item.capacityNeutral?'<span class="tag">식사와 병행·시간 중복 제외</span>':''}</div>
        <h3>${h(item.name)}</h3>
        <p>${h(item.completionRule)} · 목표 ${h(item.targetDate)}${item.releaseEnd ? ` · 전체 완강 ${h(item.releaseEnd)}` : ''}</p>
        <p>${h(item.note || '')}</p>
        <div class="course-meta"><span class="tag">잔량 ${workload.unknown ? '미정' : formatHourRange(workload.low, workload.high)}</span>${perDayLow==null?'':`<span class="tag">활동일 평균 ${shortNumber(perDayLow,2)}–${shortNumber(perDayHigh,2)}${h(item.unitLabel)}/일</span>`}${item.sourceUrl?`<a class="tag tag-blue" href="${h(safeHref(item.sourceUrl))}" target="_blank" rel="noopener">근거 열기</a>`:''}</div>
      </div>
      <div class="course-progress">
        <strong>${h(totalLabel)}</strong>
        <div class="progress-line ${item.confidence==='unknown'?'loss':''}"><span style="width:${Math.round(ratio*100)}%"></span></div>
        <small>${item.totalUnits ? `${Math.round(ratio*100)}% 완료` : '입력 전 계산 제외'}</small>
        <div class="toolbar" style="margin-top:8px;justify-content:flex-end"><button class="button button-small" data-action="course-minus" data-id="${h(item.id)}" ${!item.totalUnits?'disabled':''}>−</button><button class="button button-small" data-action="course-plus" data-id="${h(item.id)}" ${!item.totalUnits?'disabled':''}>+</button><button class="button button-small" data-action="edit-course" data-id="${h(item.id)}">수정</button></div>
      </div>
    </article>`;
  }

  function renderCalendar() {
    const date = selectedDate();
    const deadline = state.settings.curriculumDeadline;
    const start = C.compareDates(date, deadline) <= 0 ? date : deadline;
    const capacity = C.capacitySummary(start, deadline, state.settings);
    const baseline = C.capacitySummary(state.settings.anchorDate, deadline, state.settings);
    const condition = state.conditions.find(row => row.date === date);
    const observation = C.conditionObservations(state);
    const rows = capacity.rows.slice(0, 18);
    return `<div class="section-stack">
      <div class="grid grid-4">
        <article class="card metric-card card-gold"><div class="metric-label"><span>9/4→10/16 기준 가용량</span><span class="tag tag-gold">定</span></div><strong>${baseline.totalHours}h</strong><small>회귀 검증 기준값 466시간</small></article>
        <article class="card metric-card"><div class="metric-label"><span>선택일 가용량</span><span class="tag">${h(date)}</span></div><strong>${C.capacityHours(date,state.settings)}h</strong><small>날짜별 덮어쓰기 가능</small></article>
        <article class="card metric-card"><div class="metric-label"><span>남은 활동일</span><span class="tag">日</span></div><strong>${capacity.activeDays}</strong><small>총 ${capacity.calendarDays}일 · 보호 ${capacity.zeroDays}일</small></article>
        <article class="card metric-card"><div class="metric-label"><span>상태 표본</span><span class="tag">身</span></div><strong>${state.conditions.length}일</strong><small>${observation.eligible ? `수면-집중 r=${shortNumber(observation.sleepFocus,2)}` : `유효 짝 ${observation.sampleSize}/5`}</small></article>
      </div>

      <div class="grid grid-main">
        <article class="card">
          <header class="card-header"><div><h2>가용 시간 달력</h2><p>선택일부터 10월 16일까지. 처음 18일을 표시합니다.</p></div><button class="button" data-action="edit-capacity">선택일 시간 수정</button></header>
          <div class="card-body"><div style="overflow:auto"><table class="capacity-table"><thead><tr><th>날짜</th><th>상태</th><th>제약</th><th>가용</th></tr></thead><tbody>${rows.map(row => {
            const constraints = state.constraints.filter(item => item.start <= row.date && item.end >= row.date);
            const holiday = state.settings.holidayStudyDates.includes(row.date);
            return `<tr class="${row.hours===0?'is-zero':holiday?'is-holiday':''}"><td>${formatDate(row.date,true)}</td><td>${row.hours===0?'보호일':holiday?'집중일':C.parseDate(row.date).getUTCDay()%6===0?'주말':'평일'}</td><td>${constraints.map(item=>h(item.title)).join(' · ')||'—'}</td><td><strong>${row.hours}h</strong></td></tr>`;
          }).join('')}</tbody></table></div>${capacity.rows.length>18?`<p class="form-note">외 ${capacity.rows.length-18}일 · 합계에는 모두 포함됩니다.</p>`:''}</div>
        </article>

        <article class="card">
          <header class="card-header"><div><h2>${formatDate(date,true)} 상태</h2><p>상태는 성과의 원인으로 단정하지 않습니다.</p></div><button class="button" data-action="edit-condition">${condition?'수정':'기록'}</button></header>
          <div class="card-body">
            ${condition ? `<div class="grid grid-2"><div class="metric-card card"><span class="muted">수면</span><strong>${condition.sleepMinutes==null?'—':`${Math.floor(condition.sleepMinutes/60)}h ${condition.sleepMinutes%60}m`}</strong></div><div class="metric-card card"><span class="muted">집중도</span><strong>${condition.focus??'—'}/5</strong></div><div class="metric-card card"><span class="muted">피로</span><strong>${condition.morningFatigue??'—'}/5</strong></div><div class="metric-card card"><span class="muted">카페인</span><strong>${condition.caffeine??0}회</strong></div></div>` : '<div class="task-empty">이 날짜의 상태 기록이 없습니다.</div>'}
            <div class="notice notice-info" style="margin:14px 0 0">${h(observation.note)}${observation.eligible ? ` 현재 r=${shortNumber(observation.sleepFocus,2)}.` : ''}</div>
          </div>
        </article>
      </div>

      <article class="card">
        <header class="card-header"><div><h2>고정 제약과 기회</h2><p>공부 목표를 숨기는 일정이 아니라, 배정 전에 보는 현실 조건</p></div></header>
        <div class="card-body"><div class="constraint-list">${state.constraints.map(item => `<div class="constraint-item"><time>${h(item.start)}<br>${item.end!==item.start?`→ ${h(item.end)}`:''}</time><div><strong>${h(item.title)} <span class="tag ${item.type==='blocked'?'tag-loss':item.type==='opportunity'?'tag-gold':''}">${h(item.type)}</span></strong><p>${h(item.impact)}</p></div></div>`).join('')}</div></div>
      </article>
    </div>`;
  }

  function renderOrbit() {
    const start = state.settings.anchorDate;
    const end = state.goals.find(goal => goal.id === 'goal-csat').date;
    const total = Math.max(1, C.daysBetween(start,end));
    const marker = (date,label,now=false) => {
      const ratio = C.clamp(C.daysBetween(start,date)/total,0,1);
      const angle = ratio * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(angle)*43;
      const y = 50 + Math.sin(angle)*43;
      return `<span class="orbit-marker ${now?'is-now':''}" style="left:${x}%;top:${y}%"><i></i><b>${h(label)}</b></span>`;
    };
    const dday = C.daysBetween(actualToday(),end);
    return `<div class="orbit"><span class="season-label season-spring">春</span><span class="season-label season-summer">夏</span><span class="season-label season-autumn">秋</span><span class="season-label season-winter">冬</span><div class="orbit-center"><b>${dday>=0?`D-${dday}`:`D+${Math.abs(dday)}`}</b><span>수능 만점까지</span></div>${marker(actualToday(),'오늘',true)}${marker('2026-10-16','학습 폐쇄')}${marker('2026-10-20','올 1')}${marker(end,'수능')}</div>`;
  }

  function renderYear() {
    const focus = C.focusExamSummary(state);
    const load = C.curriculumLoad(state, selectedDate());
    const currentAnalyses = state.questionAnalyses.filter(row => row.examId === 'exam-2026-09-kice-full');
    const subjectRows = MAIN_SUBJECTS.map(subject => {
      const result = focus.bySubject.find(row => row.subject===subject);
      const q = currentAnalyses.filter(row=>row.subject===subject);
      const burden = load.bySubject.find(row=>row.subject===subject);
      return { subject, score: result?.score, loss: result?.loss, unresolved:q.filter(x=>x.stage!=='stable').length, stable:q.filter(x=>x.stage==='stable').length, low:burden?.lowMinutes||0, high:burden?.highMinutes||0 };
    });
    return `<div class="section-stack">
      <article class="card card-pad">
        <div class="orbit-layout">
          ${renderOrbit()}
          <div>
            <p class="eyebrow">成歲 · A YEAR MADE, NOT SPENT</p>
            <h2 style="font-size:clamp(28px,4vw,48px);line-height:1.12;letter-spacing:-.05em;margin:0 0 14px">한 해가 지나가게 두지 않고<br>수능 만점으로 완성한다.</h2>
            <p class="muted">현재 증거는 9모 5과목에서 만점 대비 85점 손실, 문항 분석 18/30, 안정화 0/30입니다. 지금의 핵심은 강의를 많이 들었다는 표시가 아니라, 남은 분량을 닫고 같은 오류가 다음 시험에서 사라졌다는 증거입니다.</p>
            <div class="toolbar" style="margin-top:16px"><button class="button button-primary" data-route="today">오늘 배정 보기</button><button class="button" data-route="weakness">미해결 약점 보기</button></div>
          </div>
        </div>
      </article>

      <div class="grid grid-main">
        <article class="card"><header class="card-header"><div><h2>만점까지의 현재 손실</h2><p>한국사 제외, 가채점 원점수 기준</p></div><strong class="loss-text">−${focus.totalLoss}점</strong></header><div class="card-body">${Charts.lossBars(subjectRows)}</div></article>
        <article class="card"><header class="card-header"><div><h2>실행 가능성</h2><p>미정량을 제외한 범위</p></div></header><div class="card-body">
          <div class="metric-card card ${load.utilizationHigh>.85?'card-loss':'card-stable'}"><span class="muted">필요 / 가용</span><strong>${Math.round(load.utilizationLow*100)}–${Math.round(load.utilizationHigh*100)}%</strong><small>${shortNumber(load.lowMinutes/60)}–${shortNumber(load.highMinutes/60)}h / ${shortNumber(load.capacity.totalHours)}h</small></div>
          <p class="form-note" style="margin-top:12px">남는 시간은 ${shortNumber(Math.max(0,load.capacity.totalHours-load.highMinutes/60))}–${shortNumber(Math.max(0,load.capacity.totalHours-load.lowMinutes/60))}시간. 수학 4점 교재와 영어 방과후가 확정되면 감소합니다.</p>
        </div></article>
      </div>

      <article class="card"><header class="card-header"><div><h2>과목별 만점 준비도</h2><p>점수·미해결 문항·남은 과정 시간을 한 행에서 함께 봅니다.</p></div></header><div class="card-body" style="overflow:auto"><table class="capacity-table"><thead><tr><th>과목</th><th>9모 원점수</th><th>손실</th><th>미해결</th><th>안정</th><th>과정 잔량</th><th>즉시 통제점</th></tr></thead><tbody>${subjectRows.map(row => `<tr><td><strong>${h(row.subject)}</strong></td><td>${row.score??'—'}</td><td class="loss-text">${row.loss==null?'—':`−${row.loss}`}</td><td>${row.unresolved}</td><td class="stable-text">${row.stable}</td><td>${formatHourRange(row.low,row.high)}</td><td>${h(subjectControl(row.subject))}</td></tr>`).join('')}</tbody></table></div></article>

      <article class="card"><header class="card-header"><div><h2>중간목표는 성과 검증점이다</h2><p>완강 자체가 목표가 되지 않도록 각 날짜의 통과 조건을 적었습니다.</p></div></header><div class="card-body"><div class="constraint-list">${state.goals.map(goal => `<div class="constraint-item"><time>${h(goal.date)}${goal.endDate?`<br>→ ${h(goal.endDate)}`:''}</time><div><strong>${h(goal.label)}</strong><p>${h(goal.description)}</p></div></div>`).join('')}</div></div></article>
    </div>`;
  }

  function subjectControl(subject) {
    return ({
      국어: '김승리 분석 후 12문항 중 8문항 원인 입력',
      수학: '조급함 가설을 제한시간 재풀이와 검산 로그로 분해',
      영어: '4문항 원인 분석 후 유형별 반복 여부 확인',
      경제: '개념 인출·조건 독해·이탈 기준을 각각 시간 내 검증',
      사회문화: '개념 경계와 자료 첫 판독 규칙을 변형 문항으로 검증'
    })[subject] || '오답 근거 입력';
  }

  function renderData() {
    const q = state.dataQuality;
    const lastBackup = state.meta?.lastBackupAt;
    return `<div class="section-stack">
      <div class="notice notice-danger"><strong>개인정보 공개 주의:</strong> 요청대로 이 ZIP에는 현재 진도·성적·오답 원인이 선탑재되어 있습니다. 공개 GitHub 저장소나 공개 Pages에 올리면 누구나 소스에서 읽을 수 있습니다. 공개 전 비공개 저장소/별도 계정 여부를 직접 결정하세요.</div>
      <div class="grid grid-main">
        <article class="card"><header class="card-header"><div><h2>백업과 복원</h2><p>GitHub는 새 기록을 자동 저장하지 않습니다. 현재 브라우저 기록은 JSON으로 내보내세요.</p></div><span class="tag ${lastBackup?'tag-stable':'tag-loss'}">${lastBackup?`마지막 ${h(lastBackup.slice(0,10))}`:'백업 없음'}</span></header><div class="card-body"><div class="data-actions">
          <button class="action-tile" data-action="export-data"><b>현재 JSON 내보내기</b><span>할 일·시험·약점·진도·상태 전체</span></button>
          <button class="action-tile" data-action="import-data"><b>曆象 JSON 복원</b><span>현재 기기 데이터를 파일 내용으로 교체</span></button>
          <button class="action-tile" data-action="download-advisor"><b>상담용 기록 내려받기</b><span>ChatGPT와 이어갈 압축 Markdown</span></button>
          <button class="action-tile" data-action="copy-advisor"><b>상담용 기록 복사</b><span>점수·근본 원인·진도·필요량</span></button>
        </div><input id="importFile" type="file" accept="application/json,.json" hidden></div></article>
        <article class="card"><header class="card-header"><div><h2>저장 상태</h2><p>기기 내부 우선</p></div></header><div class="card-body">
          <div class="metric-card card"><span class="muted">저장 엔진</span><strong style="font-size:23px">${h(storageEngine)}</strong><small>${storageWarning?h(storageWarning):'정상 저장 중'}</small></div>
          <ul class="plain-list" style="margin-top:14px"><li>앱 버전 <strong>${h(state.app.version)}</strong></li><li>schema <strong>${h(state.schema)}</strong></li><li>마지막 저장 <strong>${h(state.meta?.lastSavedAt || '—')}</strong></li></ul>
          <button class="button button-danger" style="margin-top:16px;width:100%" data-action="reset-seed">선탑재 상태로 초기화</button>
        </div></article>
      </div>

      <article class="card"><header class="card-header"><div><h2>이관 감사</h2><p>${h(q.legacyFile)} · 원본 schema ${h(q.legacySchema)}</p></div><a class="button button-small" href="./PROJECT_11122_backup_2026-09-04.json" download>원본 백업 받기</a></header><div class="card-body">
        <div class="grid grid-4"><div class="metric-card card"><span class="muted">과거 할 일</span><strong>${q.counts.tasks}</strong><small>완료 플래그 ${q.counts.doneTasks}</small></div><div class="metric-card card"><span class="muted">대기함</span><strong>${q.counts.waiting}</strong><small>원약속일 복원 불가</small></div><div class="metric-card card"><span class="muted">시간표 블록</span><strong>${q.counts.scheduleBlocks}</strong><small>${q.counts.scheduleDates}개 날짜</small></div><div class="metric-card card"><span class="muted">기존 시험</span><strong>${q.counts.legacyExams}</strong><small>분류 확인 필요</small></div></div>
        <div style="overflow:auto;margin-top:16px"><table class="audit-table"><thead><tr><th>항목</th><th>백업</th><th>적용</th><th>판단 근거</th></tr></thead><tbody>${q.conflicts.map(row => `<tr><td>${h(row.field)}</td><td>${h(row.backup)}</td><td><strong>${h(row.applied)}</strong></td><td>${h(row.reason)}</td></tr>`).join('')}</tbody></table></div>
        <div class="notice notice-warning" style="margin:16px 0 0"><strong>과거 완주율:</strong> dailyRecords가 ${q.counts.dailyRecords}건이어서 원래 분모를 복구할 수 없습니다. 기존 완료 체크는 보존했지만 100% 같은 숫자는 만들지 않았습니다.</div>
      </div></article>

      <article class="card"><header class="card-header"><div><h2>GitHub Pages 올리는 순서</h2><p>빌드 도구 없이 그대로 배포됩니다.</p></div></header><div class="card-body"><ol><li>ZIP을 풀고 파일 전체를 GitHub 저장소 최상단에 올립니다.</li><li>Settings → Pages → Deploy from a branch → <strong>main / root</strong>를 선택합니다.</li><li>첫 접속 뒤 데이터 화면에서 저장 엔진이 IndexedDB인지 확인합니다.</li><li>새 기록은 주기적으로 JSON으로 내려받습니다. 다른 기기에는 그 JSON을 복원합니다.</li></ol></div></article>
    </div>`;
  }

  function showDialog({ kicker = '記錄', title, body, submit }) {
    document.getElementById('dialogKicker').textContent = kicker;
    document.getElementById('dialogTitle').textContent = title;
    dialogBody.innerHTML = body;
    dialogSubmit = submit || null;
    dialog.showModal();
    setTimeout(() => dialogBody.querySelector('input,select,textarea')?.focus(), 10);
  }

  function closeDialog() {
    dialogSubmit = null;
    dialog.close();
  }

  function openTaskDialog(task = null) {
    const editing = Boolean(task);
    showDialog({
      kicker: '今日 · 原約', title: editing ? '할 일 수정' : '할 일 약속 만들기',
      body: `<div class="field-grid">
        <label class="field-full"><span>할 일</span><input name="title" required placeholder="예: CONTACT 공통 1강" value="${h(task?.title||'')}"></label>
        <label class="field"><span>과목</span><select name="subject">${SUBJECTS.map(subject=>`<option ${task?.subject===subject?'selected':''}>${subject}</option>`).join('')}</select></label>
        <label class="field"><span>배정일</span><input name="date" type="date" required value="${h(task?.scheduledDate||selectedDate())}"></label>
        <label class="field"><span>계획 시간(분)</span><input name="minutes" type="number" min="0" step="5" value="${task?.plannedMinutes??60}"></label>
        <label class="field"><span>계획 단위</span><input name="units" type="number" min="1" step="1" value="${task?.totalUnits??1}"></label>
        ${editing?`<label class="field"><span>완료 단위</span><input name="completedUnits" type="number" min="0" step="1" value="${task?.completedUnits??0}"></label>`:''}
        ${editing?`<label class="field"><span>이 배정일 실제 시간(분)</span><input name="actualMinutes" type="number" min="0" step="5" value="${task?.actualMinutesHistory?.[task?.scheduledDate]??task?.actualMinutes??''}"></label>`:''}
        <label class="field"><span>우선순위</span><select name="priority"><option value="must" ${task?.priority!=='should'?'selected':''}>필수</option><option value="should" ${task?.priority==='should'?'selected':''}>선택</option></select></label>
        <label class="field"><span>교재·강좌</span><input name="material" placeholder="선택 입력" value="${h(task?.material||'')}"></label>
        <label class="field-full"><span>메모</span><textarea name="note" placeholder="완료 조건이나 주의점">${h(task?.note||'')}</textarea></label>
      </div><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button><button class="button button-primary" type="submit">${editing?'수정 저장':'약속 추가'}</button></div>`,
      submit: async formData => {
        const date = formData.get('date');
        const next = C.clone(state);
        if (editing) {
          const target = next.tasks.find(row => row.id === task.id);
          Object.assign(target,{subject:formData.get('subject'),title:formData.get('title').trim(),material:formData.get('material').trim(),note:formData.get('note').trim(),priority:formData.get('priority'),plannedMinutes:Number(formData.get('minutes')||0),scheduledDate:date,totalUnits:Number(formData.get('units')||1),updatedAt:new Date().toISOString()});
          target.commitmentDates ||= target.committedDate ? [target.committedDate] : [];
          if (!target.commitmentDates.includes(date)) target.commitmentDates.push(date);
          target.completedUnits = C.clamp(Number(formData.get('completedUnits')||0),0,target.totalUnits);
          target.status = target.completedUnits === target.totalUnits ? 'done' : target.completedUnits > 0 ? 'partial' : 'todo';
          target.completedDate = target.completedUnits > 0 ? date : null;
          target.completionHistory ||= {};
          if(target.completedUnits>0)target.completionHistory[date]=target.completedUnits;else delete target.completionHistory[date];
          target.actualMinutesHistory ||= {};
          const actualRaw=formData.get('actualMinutes');if(actualRaw!==''){target.actualMinutes=Number(actualRaw);target.actualMinutesHistory[date]=Number(actualRaw);}else if(target.completedUnits===0){delete target.actualMinutesHistory[date];target.actualMinutes=null;}
        } else {
          next.tasks.push({ id:C.uid('task'), subject:formData.get('subject'), title:formData.get('title').trim(), material:formData.get('material').trim(), note:formData.get('note').trim(), priority:formData.get('priority'), plannedMinutes:Number(formData.get('minutes')||0), actualMinutes:null, committedDate:date, commitmentDates:[date], scheduledDate:date, completedDate:null, completionHistory:{}, actualMinutesHistory:{}, status:'todo', totalUnits:Number(formData.get('units')||1), completedUnits:0, source:'yeoksang', historicalReliability:true, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
        }
        await commit(next, editing ? '할 일을 수정했습니다. 원래 약속 이력은 유지됩니다.' : '할 일을 원래 날짜와 함께 기록했습니다.');
      }
    });
  }

  function openBlockDialog(block = null) {
    const editing=Boolean(block);
    showDialog({ kicker:'曆 · 時刻', title:editing?'시간표 블록 수정':'시간표 블록 추가', body:`<div class="field-grid"><label class="field"><span>날짜</span><input name="date" type="date" value="${h(block?.date||selectedDate())}" required></label><label class="field"><span>이름</span><input name="label" required placeholder="예: 야간 자습" value="${h(block?.label||'')}"></label><label class="field"><span>시작</span><input name="start" type="time" required value="${h(block?.start||'')}"></label><label class="field"><span>종료</span><input name="end" type="time" required value="${h(block?.end||'')}"></label><label class="field-full"><span>계획</span><input name="plan" placeholder="이 블록에서 할 일" value="${h(block?.plan||'')}"></label></div><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button>${editing?`<button type="button" class="button button-danger" data-action="delete-block" data-id="${h(block.id)}">삭제</button>`:''}<button class="button button-primary" type="submit">${editing?'수정 저장':'추가'}</button></div>`, submit: async formData => {
      const next=C.clone(state); const record={id:block?.id||C.uid('block'),date:formData.get('date'),start:formData.get('start'),end:formData.get('end'),label:formData.get('label').trim(),plan:formData.get('plan').trim(),type:block?.type||'custom',selfStudy:block?.selfStudy??true,done:block?.done??false,actualMinutes:block?.actualMinutes??null,taskIds:block?.taskIds||[],source:block?.source||'yeoksang'}; const index=next.scheduleBlocks.findIndex(row=>row.id===record.id);if(index>=0)next.scheduleBlocks[index]=record;else next.scheduleBlocks.push(record); await commit(next,editing?'시간표 블록을 수정했습니다.':'시간표 블록을 추가했습니다.');
    }});
  }

  function openScheduleTemplatesDialog() {
    const templates=state.scheduleTemplates||[];
    showDialog({kicker:'曆 · 模式',title:'시간표 템플릿',body:`<div class="field-grid"><label class="field-full"><span>현재 ${h(selectedDate())} 시간표를 저장할 이름</span><input name="name" placeholder="예: 면접 준비일"></label></div><div class="form-actions" style="justify-content:flex-start"><button class="button button-primary" type="submit">현재 시간표 저장</button></div><h3 style="margin-top:22px">저장된 템플릿</h3><div class="plain-list">${templates.length?templates.map(template=>`<div class="task-row"><div></div><div><div class="task-title">${h(template.name)}</div><div class="task-meta">${template.blocks?.length||0}개 블록</div></div><div class="task-actions"><button type="button" class="button button-small" data-action="apply-template" data-id="${h(template.id)}">선택일 적용</button><button type="button" class="button button-quiet button-small" data-action="delete-template" data-id="${h(template.id)}">삭제</button></div></div>`).join(''):'<div class="task-empty">저장된 템플릿이 없습니다.</div>'}</div><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">닫기</button></div>`,submit:async formData=>{const name=formData.get('name').trim();if(!name)throw new Error('템플릿 이름을 입력하세요.');const date=selectedDate();const blocks=state.scheduleBlocks.filter(row=>row.date===date).sort((a,b)=>String(a.start).localeCompare(String(b.start))).map(({id:ignored,date:ignoredDate,done:ignoredDone,actualMinutes:ignoredActual,taskIds:ignoredTasks,...block})=>({...block}));if(!blocks.length)throw new Error('현재 날짜에 저장할 블록이 없습니다.');const next=C.clone(state);next.scheduleTemplates||=[];next.scheduleTemplates.push({id:C.uid('template'),name,blocks,createdAt:new Date().toISOString(),source:'yeoksang'});await commit(next,'현재 시간표를 템플릿으로 저장했습니다.');}});
  }

  function examResultFields(exam) {
    const bySubject = new Map((exam?.results || []).map(result => [result.subject,result]));
    return SUBJECTS.map(subject => {
      const row = bySubject.get(subject) || {};
      const split = ['국어','수학'].includes(subject);
      return `<fieldset style="border:1px solid var(--line);border-radius:10px;padding:13px;margin:0 0 10px"><legend><strong>${h(subject)}</strong></legend><div class="field-grid"><label class="field"><span>원점수</span><input name="${h(subject)}_score" type="number" min="0" max="100" value="${row.score??''}"></label><label class="field"><span>등급 (모르면 비움)</span><input name="${h(subject)}_grade" type="number" min="1" max="9" value="${row.grade??''}"></label><label class="field"><span>소요시간(분)</span><input name="${h(subject)}_minutes" type="number" min="0" value="${row.minutes??''}"></label><label class="field"><span>틀린 번호</span><input name="${h(subject)}_wrong" value="${h((row.wrong||[]).join(', '))}" placeholder="예: 5, 8, 13"></label><label class="field"><span>애매했지만 맞은 번호</span><input name="${h(subject)}_uncertain" value="${h((row.uncertain||[]).join(', '))}"></label><label class="field"><span>시간 없어 포기한 번호</span><input name="${h(subject)}_abandoned" value="${h((row.abandoned||[]).join(', '))}"></label>${split?`<label class="field"><span>공통 점수</span><input name="${h(subject)}_common" type="number" value="${row.commonScore??''}"></label><label class="field"><span>선택 점수</span><input name="${h(subject)}_selection" type="number" value="${row.selectionScore??''}"></label>`:''}</div></fieldset>`;
    }).join('');
  }

  function openExamDialog(exam = null) {
    const editing = Boolean(exam);
    showDialog({ kicker:'觀測 · 試驗', title:editing?'시험 기록 수정':'시험 기록 추가', body:`<div class="field-grid">
      <label class="field"><span>날짜</span><input name="date" type="date" required value="${h(exam?.date||selectedDate())}"></label>
      <label class="field"><span>기록 형태</span><select name="kind"><option value="full" ${exam?.kind==='full'?'selected':''}>전과목</option><option value="single" ${exam?.kind==='single'?'selected':''}>한 과목</option></select></label>
      <label class="field-full"><span>시험명</span><input name="name" required value="${h(exam?.name||'')}"></label>
      <label class="field"><span>시험 종류</span><select name="source">${['모평','학평','수능','사설','학교','실모','분류 확인'].map(source=>`<option ${exam?.source===source?'selected':''}>${source}</option>`).join('')}</select></label>
      <label class="field"><span>범위</span><select name="scope"><option value="full" ${exam?.scope==='full'?'selected':''}>전범위</option><option value="partial" ${exam?.scope==='partial'?'selected':''}>부분범위</option><option value="unit" ${exam?.scope==='unit'?'selected':''}>단원</option></select></label>
      <label class="field-full"><span>비교 집단</span><input name="group" value="${h(exam?.comparableGroup||'')}" placeholder="예: 평가원 전범위 (같은 조건만 같은 이름)"></label>
      <label class="field-full checkbox-line"><input name="mapComplete" type="checkbox" ${exam?.mapComplete?'checked':''}> 응시한 모든 오답·포기 번호를 빠짐없이 기록함</label>
      <label class="field-full"><span>메모</span><textarea name="memo">${h(exam?.memo||'')}</textarea></label>
    </div><h3 style="margin-top:22px">과목별 결과</h3><p class="form-note">응시하지 않은 과목은 모두 비워 두세요. 등급을 모르면 추정하지 않습니다.</p>${examResultFields(exam)}<div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button>${editing?'<button type="button" class="button button-danger" data-action="delete-exam" data-id="'+h(exam.id)+'">삭제</button>':''}<button class="button button-primary" type="submit">저장</button></div>`, submit: async formData => {
      const results = SUBJECTS.map(subject => {
        const rawScore=formData.get(`${subject}_score`); const wrong=C.parseQuestionNumbers(formData.get(`${subject}_wrong`), subject==='국어'||subject==='영어'?45:subject==='수학'?30:20); const uncertain=C.parseQuestionNumbers(formData.get(`${subject}_uncertain`),45); const abandoned=C.parseQuestionNumbers(formData.get(`${subject}_abandoned`),45);
        if (rawScore==='' && !wrong.length && !uncertain.length && !abandoned.length) return null;
        const numberOrNull=name=>formData.get(name)===''?null:Number(formData.get(name));
        return {subject,score:numberOrNull(`${subject}_score`),grade:numberOrNull(`${subject}_grade`),minutes:numberOrNull(`${subject}_minutes`),wrong,uncertain,abandoned,commonScore:numberOrNull(`${subject}_common`),selectionScore:numberOrNull(`${subject}_selection`)};
      }).filter(Boolean);
      if (!results.length) throw new Error('과목별 결과를 하나 이상 입력하세요.');
      const chosenSource=formData.get('source');const chosenScope=formData.get('scope');const automaticGroup=['모평','수능'].includes(chosenSource)&&chosenScope==='full'?'평가원 전범위':'';const next=C.clone(state); const id=exam?.id||C.uid('exam'); const record={id,date:formData.get('date'),name:formData.get('name').trim(),kind:formData.get('kind'),source:chosenSource,suggestedSource:chosenSource,classificationPending:chosenSource==='분류 확인',scope:chosenScope,comparableGroup:formData.get('group').trim()||automaticGroup,mapComplete:formData.get('mapComplete')==='on',memo:formData.get('memo').trim(),results,sourceRecord:'yeoksang',createdAt:exam?.createdAt||new Date().toISOString()};
      const oldIndex=next.exams.findIndex(row=>row.id===id); if(oldIndex>=0) next.exams[oldIndex]=record; else next.exams.push(record);
      const oldAnalyses=next.questionAnalyses.filter(row=>row.examId===id); const keep=next.questionAnalyses.filter(row=>row.examId!==id);
      const analyses=[]; for(const result of results){for(const number of result.wrong){const existing=oldAnalyses.find(row=>row.subject===result.subject&&row.questionNumber===number); analyses.push(existing||{id:C.uid('qa'),examId:id,examDate:record.date,subject:result.subject,questionNumber:number,status:'wrong',stage:'unanalysed',directCause:'',rootHypothesis:'',category:'미분석',confidence:'none',prevention:'',nextAction:'원인 분석 대기',dueDate:C.addDays(record.date,1),abandoned:result.abandoned.includes(number),evidenceHistory:[],source:'yeoksang'});}}
      next.questionAnalyses=[...keep,...analyses]; await commit(next,editing?'시험 기록을 수정했습니다.':'시험과 문항 분석 대기열을 만들었습니다.');
    }});
  }

  function openWeaknessDialog(row) {
    showDialog({ kicker:'正 · 原因', title:`${row.subject} ${row.questionNumber}번 분석`, body:`<div class="field-grid"><label class="field"><span>단계</span><select name="stage">${STAGES.concat('relapsed').map(stage=>`<option value="${stage}" ${row.stage===stage?'selected':''}>${STAGE_LABELS[stage]}</option>`).join('')}</select></label><label class="field"><span>원인 분류</span><input name="category" value="${h(row.category)}"></label><label class="field"><span>가설 확신도</span><select name="confidence"><option value="none" ${row.confidence==='none'?'selected':''}>미정</option><option value="low" ${row.confidence==='low'?'selected':''}>낮음</option><option value="medium" ${row.confidence==='medium'?'selected':''}>중간</option><option value="high" ${row.confidence==='high'?'selected':''}>높음</option></select></label><label class="field"><span>다음 확인일</span><input name="dueDate" type="date" value="${h(row.dueDate||'')}"></label><label class="field-full"><span>직접 원인 · 시험장에서 실제로 한 것</span><textarea name="directCause">${h(row.directCause)}</textarea></label><label class="field-full"><span>근본 원인 가설 · 왜 그 행동이 나왔는가</span><textarea name="rootHypothesis">${h(row.rootHypothesis)}</textarea></label><label class="field-full"><span>방지 규칙</span><textarea name="prevention">${h(row.prevention)}</textarea></label><label class="field-full"><span>다음 행동</span><input name="nextAction" value="${h(row.nextAction||'')}"></label></div><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button><button class="button button-primary" type="submit">분석 저장</button></div>`, submit: async formData=>{
      const next=C.clone(state); const target=next.questionAnalyses.find(item=>item.id===row.id); Object.assign(target,{stage:formData.get('stage'),category:formData.get('category').trim()||'미분석',confidence:formData.get('confidence'),dueDate:formData.get('dueDate'),directCause:formData.get('directCause').trim(),rootHypothesis:formData.get('rootHypothesis').trim(),prevention:formData.get('prevention').trim(),nextAction:formData.get('nextAction').trim()}); await commit(next,'문항 분석을 저장했습니다.');
    }});
  }

  function openCourseDialog(item) {
    showDialog({ kicker:'授時 · 課程', title:'과정 기준 수정', body:`<div class="field-grid"><label class="field-full"><span>과정명</span><input name="name" value="${h(item.name)}" required></label><label class="field"><span>총 단위 (미정이면 비움)</span><input name="totalUnits" type="number" min="0" step="1" value="${item.totalUnits??''}"></label><label class="field"><span>완료 단위</span><input name="completedUnits" type="number" min="0" step="1" value="${item.completedUnits||0}"></label><label class="field"><span>단위당 최소 분</span><input name="minutesLow" type="number" min="0" value="${item.minutesPerUnitLow??''}"></label><label class="field"><span>단위당 최대 분</span><input name="minutesHigh" type="number" min="0" value="${item.minutesPerUnitHigh??''}"></label><label class="field"><span>신뢰도</span><select name="confidence">${Object.entries(CONFIDENCE).map(([key,label])=>`<option value="${key}" ${item.confidence===key?'selected':''}>${label}</option>`).join('')}</select></label><label class="field"><span>목표일</span><input name="targetDate" type="date" value="${h(item.targetDate)}"></label><label class="field-full"><span>완료 조건</span><input name="completionRule" value="${h(item.completionRule||'')}"></label><label class="field-full"><span>근거·메모</span><textarea name="note">${h(item.note||'')}</textarea></label><label class="field-full checkbox-line"><input type="checkbox" name="included" ${item.included?'checked':''}> 10월 16일 필요량 계산에 포함</label></div><p class="form-note">공식 총 러닝타임이 입력된 과정은 단위당 분보다 공식 총시간을 우선합니다.</p><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button><button class="button button-primary" type="submit">기준 저장</button></div>`, submit: async formData=>{
      const next=C.clone(state); const target=next.curriculum.find(row=>row.id===item.id); const totalRaw=formData.get('totalUnits'); Object.assign(target,{name:formData.get('name').trim(),totalUnits:totalRaw===''?null:Number(totalRaw),completedUnits:Number(formData.get('completedUnits')||0),minutesPerUnitLow:formData.get('minutesLow')===''?null:Number(formData.get('minutesLow')),minutesPerUnitHigh:formData.get('minutesHigh')===''?null:Number(formData.get('minutesHigh')),confidence:formData.get('confidence'),targetDate:formData.get('targetDate'),completionRule:formData.get('completionRule').trim(),note:formData.get('note').trim(),included:formData.get('included')==='on'}); if(target.totalUnits!=null) target.completedUnits=C.clamp(target.completedUnits,0,target.totalUnits); await commit(next,'과정 기준과 하루 최소량을 다시 계산했습니다.');
    }});
  }

  function openCapacityDialog() {
    const date=selectedDate(); showDialog({kicker:'曆 · 容量',title:`${formatDate(date,true)} 가용시간`,body:`<div class="field-grid"><label class="field"><span>날짜</span><input name="date" type="date" value="${h(date)}" required></label><label class="field"><span>순공 가능 시간</span><input name="hours" type="number" min="0" max="24" step="0.5" value="${C.capacityHours(date,state.settings)}" required></label></div><p class="form-note">기본값을 덮어씁니다. 0시간은 면접·이동 같은 보호일입니다.</p><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button><button type="button" class="button" data-action="clear-capacity" data-date="${h(date)}">기본값 복원</button><button class="button button-primary" type="submit">저장</button></div>`,submit:async formData=>{const next=C.clone(state);next.settings.capacityOverrides[formData.get('date')]=Number(formData.get('hours'));await commit(next,'날짜별 가용시간을 반영했습니다.');}});
  }

  function openConditionDialog() {
    const date=selectedDate(); const row=state.conditions.find(item=>item.date===date)||{}; showDialog({kicker:'曆 · 身',title:`${formatDate(date,true)} 상태 기록`,body:`<div class="field-grid"><label class="field"><span>취침</span><input name="bedtime" type="time" value="${h(row.bedtime||'')}"></label><label class="field"><span>기상</span><input name="wakeTime" type="time" value="${h(row.wakeTime||'')}"></label><label class="field"><span>수면 시간(분)</span><input name="sleepMinutes" type="number" min="0" max="1440" value="${row.sleepMinutes??''}"></label><label class="field"><span>수면 질 1–5</span><input name="sleepQuality" type="number" min="1" max="5" value="${row.sleepQuality??''}"></label><label class="field"><span>아침 피로 1–5</span><input name="fatigue" type="number" min="1" max="5" value="${row.morningFatigue??''}"></label><label class="field"><span>집중도 1–5</span><input name="focus" type="number" min="1" max="5" value="${row.focus??''}"></label><label class="field"><span>두통 0–5</span><input name="headache" type="number" min="0" max="5" value="${row.headache??''}"></label><label class="field"><span>카페인 횟수</span><input name="caffeine" type="number" min="0" value="${row.caffeine??0}"></label><label class="field-full"><span>메모</span><textarea name="memo">${h(row.memo||'')}</textarea></label></div><div class="form-actions"><button type="button" class="button" data-action="dialog-cancel">취소</button><button class="button button-primary" type="submit">상태 저장</button></div>`,submit:async formData=>{const value=name=>formData.get(name)===''?null:Number(formData.get(name));const next=C.clone(state);const record={date,bedtime:formData.get('bedtime'),wakeTime:formData.get('wakeTime'),sleepMinutes:value('sleepMinutes'),sleepQuality:value('sleepQuality'),morningFatigue:value('fatigue'),focus:value('focus'),headache:value('headache'),caffeine:value('caffeine')||0,overall:'',memo:formData.get('memo').trim(),source:'yeoksang'};const index=next.conditions.findIndex(item=>item.date===date);if(index>=0)next.conditions[index]=record;else next.conditions.push(record);await commit(next,'상태를 기록했습니다.');}});
  }

  function advisorMarkdown() {
    const focus=C.focusExamSummary(state); const load=C.curriculumLoad(state,selectedDate()); const qa=state.questionAnalyses.filter(row=>row.examId==='exam-2026-09-kice-full');
    const lines=[`# 曆象 상담용 기록`,``,`생성일: ${new Date().toISOString()}`,`최종 목표: ${state.profile.target}`,`1차 학습 폐쇄: ${state.settings.curriculumDeadline}`,``,`## 현재 계산`,``,`- 남은 가용시간: ${shortNumber(load.capacity.totalHours)}시간 / 활동일 ${load.capacity.activeDays}일` ,`- 예상 필요량: ${shortNumber(load.lowMinutes/60)}–${shortNumber(load.highMinutes/60)}시간`,`- 활동일 평균: ${shortNumber(load.averageLowHours)}–${shortNumber(load.averageHighHours)}시간/일`,`- 선택일 최소 배정: ${shortNumber(load.todayLowHours)}–${shortNumber(load.todayHighHours)}시간`,`- 미정량: ${load.unknownItems.map(item=>item.name).join(', ')||'없음'}`,``,`## 9월 모의평가`,``,`- 점수: ${focus.exam.results.map(row=>`${row.subject} ${row.score}`).join(' / ')}` ,`- 만점 대비 총 손실(한국사 제외): ${focus.totalLoss}점`,`- 오답 번호가 기록된 문항: ${focus.wrongCount}` ,`- 미분석: ${focus.unanalysed} / 안정: ${focus.stable} / 시간 소진 포기: ${focus.abandoned}`,``,`## 문항 원인과 증거 단계`,``,...qa.map(row=>`- ${row.subject} ${row.questionNumber}번 [${STAGE_LABELS[row.stage]}] ${row.category}: ${row.directCause||'미분석'} / 근본 가설: ${row.rootHypothesis||'미입력'} / 방지: ${row.prevention||'미입력'}`),``,`## 과정 진도와 잔량`,``,...state.curriculum.map(item=>{const w=C.itemWorkload(item);const progress=item.totalUnits==null?'분량 미정':`${item.completedUnits}/${item.totalUnits}${item.unitLabel}`;return `- ${item.subject} · ${item.name}: ${progress}; 잔량 ${w.unknown?'미정':formatHourRange(w.low,w.high)}; 신뢰도 ${CONFIDENCE[item.confidence]}; ${item.note||''}`}),``,`## 고정 제약`,``,...state.constraints.map(item=>`- ${item.start}~${item.end} ${item.title}: ${item.impact}`),``,`## 컨설턴트에게 요구할 판단`,``,`- 완강 여부가 아니라 수능 만점과 10월 전 과목 1등급에 대한 병목을 판정할 것.`,`- 사용자는 특별한 경우가 아니면 오답 고치기를 직접 하므로, 원인 분석·재발 패턴·우선순위·분량 검증을 담당할 것.`,`- 불확실한 강좌 분량이나 원인은 사실처럼 단정하지 말고 필요한 증거를 제시할 것.`]; return lines.join('\n');
  }

  async function exportData() {
    const next=C.clone(state); next.meta.lastBackupAt=new Date().toISOString(); const saved=await Storage.save(next); state=saved.state; storageEngine=saved.engine; Storage.download(`YEOKSANG_backup_${timestampForFile()}.json`,JSON.stringify(state,null,2)); render(); toast('현재 전체 기록을 JSON으로 내보냈습니다.');
  }

  async function copyAdvisor() {
    const text=advisorMarkdown(); try{await navigator.clipboard.writeText(text);toast('상담용 기록을 클립보드에 복사했습니다.');}catch{Storage.download(`YEOKSANG_advisor_${timestampForFile()}.md`,text,'text/markdown');toast('클립보드 대신 Markdown 파일로 내려받았습니다.');}
  }

  async function handleAction(button) {
    const action=button.dataset.action; const id=button.dataset.id; const date=selectedDate();
    if(action==='add-task') return openTaskDialog();
    if(action==='edit-task') return openTaskDialog(state.tasks.find(row=>row.id===id));
    if(action==='add-block') return openBlockDialog();
    if(action==='edit-block') return openBlockDialog(state.scheduleBlocks.find(row=>row.id===id));
    if(action==='schedule-templates') return openScheduleTemplatesDialog();
    if(action==='dialog-cancel') return closeDialog();
    if(action==='add-exam') return openExamDialog();
    if(action==='edit-exam') return openExamDialog(state.exams.find(row=>row.id===id));
    if(action==='exam-subject'){ui.examSubject=button.dataset.subject;return render();}
    if(action==='exam-metric'){ui.examMetric=button.dataset.metric;return render();}
    if(action==='edit-weakness')return openWeaknessDialog(state.questionAnalyses.find(row=>row.id===id));
    if(action==='advance-weakness'){
      const next=C.clone(state);const row=next.questionAnalyses.find(item=>item.id===id);const index=STAGES.indexOf(row.stage);const nextStage=STAGES[Math.min(STAGES.length-1,Math.max(0,index)+1)];row.evidenceHistory.push({at:new Date().toISOString(),from:row.stage,to:nextStage,note:'사용자 단계 전진'});row.stage=nextStage;return commit(next,`${row.subject} ${row.questionNumber}번을 ${STAGE_LABELS[nextStage]} 단계로 옮겼습니다.`);
    }
    if(action==='relapse-weakness'){
      const next=C.clone(state);const row=next.questionAnalyses.find(item=>item.id===id);row.evidenceHistory.push({at:new Date().toISOString(),from:row.stage,to:'relapsed',note:'다음 시험에서 재발'});row.stage='relapsed';return commit(next,'재발을 숨기지 않고 기록했습니다.');
    }
    if(action==='edit-course')return openCourseDialog(state.curriculum.find(row=>row.id===id));
    if(action==='course-plus'||action==='course-minus'){
      const next=C.clone(state);const item=next.curriculum.find(row=>row.id===id);const delta=action==='course-plus'?1:-1;item.completedUnits=C.clamp(Number(item.completedUnits||0)+delta,0,Number(item.totalUnits||0));return commit(next,`${item.name} ${item.completedUnits}/${item.totalUnits}${item.unitLabel}`);
    }
    if(action==='edit-capacity')return openCapacityDialog();
    if(action==='edit-condition')return openConditionDialog();
    if(action==='close-day'){
      if(C.compareDates(date,actualToday())>0)return toast('미래 날짜는 마감할 수 없습니다.',true);
      return commit(C.closeDay(state,date),'마감 스냅샷을 고정했습니다. 이월해도 분모가 유지됩니다.');
    }
    if(action==='reopen-day'){
      if(!confirm('고정된 마감 스냅샷을 다시 열까요? 이후 변경으로 그날 통계가 달라질 수 있습니다.'))return;
      return commit(C.reopenDay(state,date),'마감을 다시 열었습니다.');
    }
    if(action==='move-tomorrow')return commit(C.moveTask(state,id,'tomorrow',date),'원래 약속을 남기고 내일로 옮겼습니다.');
    if(action==='move-waiting')return commit(C.moveTask(state,id,'waiting',date),'원래 약속을 남기고 대기함으로 옮겼습니다.');
    if(action==='toggle-task'){
      if(state.dayClosures?.[date]?.reliable)return toast('마감된 날입니다. 먼저 마감을 다시 여세요.',true);
      return commit(C.toggleTaskDone(state,id,date),'완료 상태를 반영했습니다.');
    }
    if(action==='skip-task'){
      const next=C.clone(state);const task=next.tasks.find(row=>row.id===id);task.status='skipped';task.scheduledDate=null;task.updatedAt=new Date().toISOString();return commit(next,'건너뜀으로 기록했습니다. 원래 날짜의 미완료 분모는 유지됩니다.');
    }
    if(action==='schedule-waiting'){
      const next=C.clone(state);const task=next.tasks.find(row=>row.id===id);task.status='todo';task.scheduledDate=date;task.commitmentDates ||= task.committedDate?[task.committedDate]:[];if(!task.commitmentDates.includes(date))task.commitmentDates.push(date);if(!task.committedDate){task.committedDate=date;task.historicalReliability=true;}task.updatedAt=new Date().toISOString();return commit(next,'대기 작업을 선택일의 새 약속으로 배정했습니다.');
    }
    if(action==='export-data')return exportData();
    if(action==='import-data')return document.getElementById('importFile')?.click();
    if(action==='copy-advisor')return copyAdvisor();
    if(action==='download-advisor'){Storage.download(`YEOKSANG_advisor_${timestampForFile()}.md`,advisorMarkdown(),'text/markdown');return toast('상담용 Markdown을 내려받았습니다.');}
    if(action==='reset-seed'){
      if(!confirm('현재 기기 기록을 지우고 ZIP에 선탑재된 2026-09-04 상태로 되돌릴까요? 먼저 JSON 백업을 권합니다.'))return;
      await Storage.clear();return commit(C.clone(window.YEOKSANG_INITIAL_STATE),'선탑재 상태로 초기화했습니다.');
    }
    if(action==='delete-exam'){
      if(!confirm('이 시험과 연결된 문항 분석을 삭제할까요?'))return;const next=C.clone(state);next.exams=next.exams.filter(row=>row.id!==id);next.questionAnalyses=next.questionAnalyses.filter(row=>row.examId!==id);closeDialog();return commit(next,'시험 기록을 삭제했습니다.');
    }
    if(action==='delete-block'){
      if(!confirm('이 날짜의 시간표 블록을 삭제할까요? 연결된 할 일은 삭제되지 않습니다.'))return;const next=C.clone(state);next.scheduleBlocks=next.scheduleBlocks.filter(row=>row.id!==id);closeDialog();return commit(next,'시간표 블록만 삭제했습니다.');
    }
    if(action==='apply-template'){
      const template=(state.scheduleTemplates||[]).find(row=>row.id===id);if(!template)return;if(!confirm(`${selectedDate()}의 기존 시간표 블록을 이 템플릿으로 교체할까요? 할 일은 유지됩니다.`))return;const next=C.clone(state);next.scheduleBlocks=next.scheduleBlocks.filter(row=>row.date!==selectedDate());for(const block of template.blocks||[])next.scheduleBlocks.push({...block,id:C.uid('block'),date:selectedDate(),done:false,actualMinutes:null,taskIds:[],source:'template'});closeDialog();return commit(next,'선택일 시간표만 템플릿으로 교체했습니다.');
    }
    if(action==='delete-template'){
      if(!confirm('이 시간표 템플릿을 삭제할까요? 이미 적용된 날짜는 바뀌지 않습니다.'))return;const next=C.clone(state);next.scheduleTemplates=(next.scheduleTemplates||[]).filter(row=>row.id!==id);closeDialog();return commit(next,'시간표 템플릿을 삭제했습니다.');
    }
    if(action==='clear-capacity'){
      const next=C.clone(state);delete next.settings.capacityOverrides[button.dataset.date];closeDialog();return commit(next,'날짜별 덮어쓰기를 지우고 기본값으로 복원했습니다.');
    }
  }

  document.addEventListener('click', event => {
    const routeButton=event.target.closest('[data-route]'); if(routeButton){event.preventDefault();setRoute(routeButton.dataset.route);return;}
    const actionButton=event.target.closest('[data-action]'); if(actionButton){event.preventDefault();handleAction(actionButton).catch(error=>toast(error.message,true));}
  });

  document.getElementById('moreNav').addEventListener('click',()=>{const menu=document.getElementById('moreMenu');menu.hidden=!menu.hidden;});
  document.getElementById('dialogClose').addEventListener('click',closeDialog);
  dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog();});
  dialogForm.addEventListener('submit',async event=>{
    event.preventDefault(); if(!dialogSubmit)return closeDialog();
    try{const handler=dialogSubmit;const formData=new FormData(dialogForm);closeDialog();await handler(formData);}catch(error){toast(error.message,true);}
  });

  globalDate.addEventListener('change',async()=>{const next=C.clone(state);next.settings.selectedDate=globalDate.value;await commit(next,'',true);});
  window.addEventListener('hashchange',()=>{route=routeFromHash();render();});
  document.getElementById('quickBackup').addEventListener('click',()=>exportData().catch(error=>toast(error.message,true)));

  document.addEventListener('change',async event=>{
    if(event.target.id==='examSourceFilter'){ui.examSource=event.target.value;render();}
    if(event.target.id==='weaknessSubjectFilter'){ui.weaknessSubject=event.target.value;render();}
    if(event.target.id==='weaknessStageFilter'){ui.weaknessStage=event.target.value;render();}
    if(event.target.id==='weaknessFocusFilter'){ui.weaknessFocus=event.target.checked;render();}
    if(event.target.id==='courseSubjectFilter'){ui.courseSubject=event.target.value;render();}
    if(event.target.id==='importFile'&&event.target.files?.[0]){
      try{const imported=await Storage.readJsonFile(event.target.files[0]);if(!confirm('현재 기기 데이터를 선택한 曆象 JSON으로 교체할까요?'))return;await commit(imported,'백업을 복원했습니다.');}catch(error){toast(`복원 실패: ${error.message}`,true);}finally{event.target.value='';}
    }
  });

  async function init() {
    if (!window.YEOKSANG_INITIAL_STATE) throw new Error('선탑재 데이터를 읽지 못했습니다.');
    const loaded = await Storage.load();
    state = loaded.state || C.clone(window.YEOKSANG_INITIAL_STATE);
    storageEngine = loaded.engine;
    storageWarning = loaded.warning || '';
    state.scheduleTemplates ||= [];
    state.settings.capacityOverrides ||= {};
    state.tasks.forEach(task => { task.commitmentDates ||= task.committedDate ? [task.committedDate] : []; });
    state.tasks.forEach(task => { task.completionHistory ||= task.completedDate ? { [task.completedDate]: Number(task.completedUnits||task.totalUnits||1) } : {}; });
    state.tasks.forEach(task => { task.actualMinutesHistory ||= task.completedDate ? { [task.completedDate]: Number(task.actualMinutes||task.plannedMinutes||0) } : {}; });
    state.meta ||= {};
    const today = actualToday();
    if (state.meta.lastOpenedDate !== today) {
      state.settings.selectedDate = today;
      state.meta.lastOpenedDate = today;
    }
    if (!loaded.state || loaded.state?.meta?.lastOpenedDate !== today) {
      const saved = await Storage.save(state);
      state = saved.state;
      storageEngine = saved.engine;
      storageWarning = saved.warning || '';
    }
    if (!state.settings.selectedDate) state.settings.selectedDate = today;
    shell.hidden = false;
    boot.remove();
    updateStorageStatus();
    render();
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  init().catch(error => {
    boot.innerHTML = `<div class="boot-seal">誤</div><p>앱을 시작하지 못했습니다.<br>${h(error.message)}</p>`;
  });
})();
