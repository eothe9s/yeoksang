(function (root) {
  'use strict';

  const DAY = 86400000;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function uid(prefix = 'id') {
    if (root.crypto?.randomUUID) return `${prefix}-${root.crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function parseDate(date) {
    return new Date(`${date}T00:00:00Z`);
  }

  function isoDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function addDays(date, amount) {
    const next = parseDate(date);
    next.setUTCDate(next.getUTCDate() + amount);
    return isoDate(next);
  }

  function compareDates(a, b) {
    return String(a).localeCompare(String(b));
  }

  function eachDate(start, end) {
    if (!start || !end || compareDates(start, end) > 0) return [];
    const dates = [];
    for (let date = start; compareDates(date, end) <= 0; date = addDays(date, 1)) dates.push(date);
    return dates;
  }

  function daysBetween(start, end) {
    return Math.round((parseDate(end) - parseDate(start)) / DAY);
  }

  function todayInZone(timeZone = 'Asia/Seoul', now = new Date()) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(now);
      const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
      return `${values.year}-${values.month}-${values.day}`;
    } catch {
      return now.toISOString().slice(0, 10);
    }
  }

  function clamp(number, low, high) {
    return Math.min(high, Math.max(low, number));
  }

  function capacityHours(date, settings) {
    const override = settings.capacityOverrides?.[date];
    if (override != null && Number.isFinite(Number(override))) return Math.max(0, Number(override));
    if ((settings.zeroCapacityDates || []).includes(date)) return 0;
    if ((settings.holidayStudyDates || []).includes(date)) return Number(settings.weekendCapacityHours || 14);
    const day = parseDate(date).getUTCDay();
    return day === 0 || day === 6
      ? Number(settings.weekendCapacityHours || 14)
      : Number(settings.weekdayCapacityHours || 10);
  }

  function capacitySummary(start, end, settings) {
    const dates = eachDate(start, end);
    const rows = dates.map(date => ({ date, hours: capacityHours(date, settings) }));
    return {
      start,
      end,
      calendarDays: rows.length,
      activeDays: rows.filter(row => row.hours > 0).length,
      zeroDays: rows.filter(row => row.hours === 0).length,
      totalHours: rows.reduce((sum, row) => sum + row.hours, 0),
      rows
    };
  }

  function remainingUnits(item) {
    const completed = Math.max(0, Number(item.completedUnits || 0));
    if (item.totalUnitsLow != null || item.totalUnitsHigh != null) {
      return {
        low: Math.max(0, Number(item.totalUnitsLow || 0) - completed),
        high: Math.max(0, Number(item.totalUnitsHigh ?? item.totalUnitsLow ?? 0) - completed),
        unknown: false
      };
    }
    if (item.totalUnits == null) return { low: 0, high: 0, unknown: true };
    const remain = Math.max(0, Number(item.totalUnits) - completed);
    return { low: remain, high: remain, unknown: false };
  }

  function itemWorkload(item) {
    if (!item.included || item.capacityNeutral) {
      return { low: 0, high: 0, unknown: item.totalUnits == null && item.included, remaining: remainingUnits(item) };
    }
    const remaining = remainingUnits(item);
    if (remaining.unknown) return { low: 0, high: 0, unknown: true, remaining };

    if (item.totalMinutesLow != null || item.totalMinutesHigh != null) {
      const total = Math.max(1, Number(item.totalUnits || 1));
      const ratioLow = remaining.low / total;
      const ratioHigh = remaining.high / total;
      return {
        low: Math.max(0, Number(item.totalMinutesLow ?? item.totalMinutesHigh ?? 0) * ratioLow),
        high: Math.max(0, Number(item.totalMinutesHigh ?? item.totalMinutesLow ?? 0) * ratioHigh),
        unknown: false,
        remaining
      };
    }

    const minuteLow = item.minutesPerUnitLow ?? item.minutesLow;
    const minuteHigh = item.minutesPerUnitHigh ?? item.minutesHigh ?? minuteLow;
    if (minuteLow == null && minuteHigh == null) return { low: 0, high: 0, unknown: true, remaining };
    return {
      low: remaining.low * Number(minuteLow || 0),
      high: remaining.high * Number(minuteHigh || minuteLow || 0),
      unknown: false,
      remaining
    };
  }

  function curriculumLoad(state, asOf = todayInZone(state.app?.timeZone), deadline = state.settings.curriculumDeadline) {
    const start = compareDates(asOf, state.settings.anchorDate) < 0 ? state.settings.anchorDate : asOf;
    const capacity = compareDates(start, deadline) <= 0
      ? capacitySummary(start, deadline, state.settings)
      : capacitySummary(deadline, deadline, { ...state.settings, capacityOverrides: { [deadline]: 0 } });
    const items = (state.curriculum || []).map(item => ({ item, workload: itemWorkload(item) }));
    const included = items.filter(row => row.item.included && !row.item.capacityNeutral);
    const known = included.filter(row => !row.workload.unknown);
    const confirmed = known.filter(row => ['verified', 'user'].includes(row.item.confidence));
    const unknown = included.filter(row => row.workload.unknown);
    const lowMinutes = known.reduce((sum, row) => sum + row.workload.low, 0);
    const highMinutes = known.reduce((sum, row) => sum + row.workload.high, 0);
    const confirmedLowMinutes = confirmed.reduce((sum, row) => sum + row.workload.low, 0);
    const confirmedHighMinutes = confirmed.reduce((sum, row) => sum + row.workload.high, 0);
    const capacityMinutes = capacity.totalHours * 60;
    const todayCapacityHours = compareDates(asOf, deadline) <= 0 ? capacityHours(asOf, state.settings) : 0;
    const bySubjectMap = new Map();
    for (const row of known) {
      const subject = row.item.subject || '기타';
      const current = bySubjectMap.get(subject) || { subject, lowMinutes: 0, highMinutes: 0, items: 0 };
      current.lowMinutes += row.workload.low;
      current.highMinutes += row.workload.high;
      current.items += 1;
      bySubjectMap.set(subject, current);
    }
    return {
      asOf,
      deadline,
      overdue: compareDates(asOf, deadline) > 0,
      capacity,
      lowMinutes,
      highMinutes,
      confirmedLowMinutes,
      confirmedHighMinutes,
      unknownItems: unknown.map(row => row.item),
      averageLowHours: capacity.activeDays ? lowMinutes / 60 / capacity.activeDays : 0,
      averageHighHours: capacity.activeDays ? highMinutes / 60 / capacity.activeDays : 0,
      todayCapacityHours,
      todayLowHours: capacityMinutes ? lowMinutes / capacityMinutes * todayCapacityHours : 0,
      todayHighHours: capacityMinutes ? highMinutes / capacityMinutes * todayCapacityHours : 0,
      utilizationLow: capacityMinutes ? lowMinutes / capacityMinutes : 0,
      utilizationHigh: capacityMinutes ? highMinutes / capacityMinutes : 0,
      bySubject: [...bySubjectMap.values()],
      rows: items
    };
  }

  function taskUnits(task) {
    return Math.max(1, Number(task.totalUnits || 1));
  }

  function completedOnDate(task, date) {
    if (task.completionHistory && Number.isFinite(Number(task.completionHistory[date]))) {
      return clamp(Number(task.completionHistory[date]), 0, taskUnits(task));
    }
    if (task.completedDate !== date) return 0;
    return clamp(Number(task.completedUnits ?? taskUnits(task)), 0, taskUnits(task));
  }

  function actualMinutesOnDate(task, date) {
    if (task.actualMinutesHistory && Number.isFinite(Number(task.actualMinutesHistory[date]))) return Math.max(0, Number(task.actualMinutesHistory[date]));
    return task.completedDate === date ? Math.max(0, Number(task.actualMinutes || task.plannedMinutes || 0)) : 0;
  }

  function committedOnDate(task, date) {
    if (Array.isArray(task.commitmentDates)) return task.commitmentDates.includes(date);
    return task.committedDate === date;
  }

  function deriveDayRecord(state, date, today = todayInZone(state.app?.timeZone)) {
    const scheduled = (state.tasks || []).filter(task => task.scheduledDate === date && task.status !== 'deleted');
    if (compareDates(date, today) > 0) {
      return {
        date,
        state: 'future',
        committedUnits: null,
        completedUnits: null,
        carriedUnits: null,
        mustUnits: null,
        mustCompletedUnits: null,
        plannedMinutes: scheduled.reduce((sum, task) => sum + Number(task.plannedMinutes || 0), 0),
        actualMinutes: null,
        plannedTaskCount: scheduled.length,
        rate: null,
        mustRate: null,
        timeRate: null,
        reliable: true
      };
    }

    const closure = state.dayClosures?.[date];
    if (closure) {
      if (!closure.reliable || closure.committedUnits == null) {
        return { ...closure, state: 'unavailable', rate: null, mustRate: null, timeRate: null };
      }
      return {
        ...closure,
        state: 'closed',
        rate: closure.committedUnits ? closure.completedUnits / closure.committedUnits : null,
        mustRate: closure.mustUnits ? closure.mustCompletedUnits / closure.mustUnits : null,
        timeRate: closure.plannedMinutes ? closure.actualMinutes / closure.plannedMinutes : null
      };
    }

    const committed = (state.tasks || []).filter(task => committedOnDate(task, date) && task.status !== 'deleted');
    const hasOnlyUnreliableLegacy = committed.length > 0 && committed.every(task => task.historicalReliability === false);
    if (compareDates(date, state.settings.anchorDate) < 0 && (hasOnlyUnreliableLegacy || committed.length === 0)) {
      return {
        date,
        state: 'unavailable',
        committedUnits: null,
        completedUnits: null,
        carriedUnits: null,
        mustUnits: null,
        mustCompletedUnits: null,
        plannedMinutes: null,
        actualMinutes: state.settings?.legacyStudyOverrides?.[date] ?? null,
        rate: null,
        mustRate: null,
        timeRate: null,
        reliable: false
      };
    }

    const committedUnits = committed.reduce((sum, task) => sum + taskUnits(task), 0);
    const completedUnits = committed.reduce((sum, task) => sum + completedOnDate(task, date), 0);
    const must = committed.filter(task => task.priority === 'must');
    const mustUnits = must.reduce((sum, task) => sum + taskUnits(task), 0);
    const mustCompletedUnits = must.reduce((sum, task) => sum + completedOnDate(task, date), 0);
    const carriedUnits = committed.reduce((sum, task) => {
      const moved = task.status === 'waiting' || (task.scheduledDate && compareDates(task.scheduledDate, date) > 0);
      return sum + (moved && task.completedDate !== date ? taskUnits(task) : 0);
    }, 0);
    const plannedMinutes = committed.reduce((sum, task) => sum + Number(task.plannedMinutes || 0), 0);
    const actualMinutes = committed.reduce((sum, task) => sum + actualMinutesOnDate(task, date), 0);
    return {
      date,
      state: compareDates(date, today) === 0 ? 'open' : 'derived',
      committedUnits,
      completedUnits,
      carriedUnits,
      mustUnits,
      mustCompletedUnits,
      plannedMinutes,
      actualMinutes,
      rate: committedUnits ? completedUnits / committedUnits : null,
      mustRate: mustUnits ? mustCompletedUnits / mustUnits : null,
      timeRate: plannedMinutes ? actualMinutes / plannedMinutes : null,
      reliable: true
    };
  }

  function closeDay(state, date, now = new Date().toISOString()) {
    if (state.dayClosures?.[date]?.reliable) return clone(state);
    const next = clone(state);
    const record = deriveDayRecord(next, date, date);
    next.dayClosures ||= {};
    next.dayClosures[date] = {
      date,
      closedAt: now,
      committedUnits: record.committedUnits || 0,
      completedUnits: record.completedUnits || 0,
      carriedUnits: record.carriedUnits || 0,
      mustUnits: record.mustUnits || 0,
      mustCompletedUnits: record.mustCompletedUnits || 0,
      plannedMinutes: record.plannedMinutes || 0,
      actualMinutes: record.actualMinutes || 0,
      reliable: true,
      note: '曆象 v1 고정 스냅샷'
    };
    return next;
  }

  function reopenDay(state, date) {
    const next = clone(state);
    if (next.dayClosures?.[date]?.reliable) delete next.dayClosures[date];
    return next;
  }

  function moveTask(state, taskId, destination, fromDate) {
    const next = clone(state);
    const task = next.tasks.find(row => row.id === taskId);
    if (!task || task.status === 'done') return next;
    if (destination === 'waiting') {
      task.status = 'waiting';
      task.scheduledDate = null;
    } else {
      task.status = 'todo';
      task.scheduledDate = destination === 'tomorrow' ? addDays(fromDate, 1) : destination;
      task.commitmentDates ||= task.committedDate ? [task.committedDate] : [];
      if (!task.commitmentDates.includes(task.scheduledDate)) task.commitmentDates.push(task.scheduledDate);
    }
    task.updatedAt = new Date().toISOString();
    return next;
  }

  function toggleTaskDone(state, taskId, completedDate, actualMinutes = null) {
    const next = clone(state);
    const task = next.tasks.find(row => row.id === taskId);
    if (!task) return next;
    if (task.status === 'done') {
      task.status = 'todo';
      task.completedDate = null;
      task.completedUnits = 0;
      task.actualMinutes = null;
      task.completionHistory ||= {};
      delete task.completionHistory[completedDate];
      task.actualMinutesHistory ||= {};
      delete task.actualMinutesHistory[completedDate];
    } else {
      task.status = 'done';
      task.completedDate = completedDate;
      task.completedUnits = taskUnits(task);
      task.actualMinutes = actualMinutes == null ? Number(task.plannedMinutes || 0) : Number(actualMinutes);
      task.completionHistory ||= {};
      task.completionHistory[completedDate] = taskUnits(task);
      task.actualMinutesHistory ||= {};
      task.actualMinutesHistory[completedDate] = task.actualMinutes;
    }
    task.updatedAt = new Date().toISOString();
    return next;
  }

  function examResults(exams, subject, filters = {}) {
    const rows = [];
    for (const exam of exams || []) {
      if (filters.source && filters.source !== '전체' && exam.source !== filters.source) continue;
      if (filters.scope && filters.scope !== '전체' && exam.scope !== filters.scope) continue;
      if (filters.group && exam.comparableGroup !== filters.group) continue;
      for (const result of exam.results || []) {
        if (result.subject !== subject) continue;
        rows.push({ ...result, examId: exam.id, date: exam.date, examName: exam.name, source: exam.source, scope: exam.scope, comparableGroup: exam.comparableGroup, mapComplete: exam.mapComplete });
      }
    }
    return rows.sort((a, b) => compareDates(a.date, b.date));
  }

  function repeatedQuestionData(exams, subject, group = '') {
    const rows = examResults(exams, subject, group ? { group } : {}).filter(row => row.mapComplete && row.comparableGroup);
    const groups = new Map();
    for (const row of rows) {
      if (!groups.has(row.comparableGroup)) groups.set(row.comparableGroup, []);
      groups.get(row.comparableGroup).push(row);
    }
    const selected = group ? (groups.get(group) || []) : [...groups.values()].sort((a, b) => b.length - a.length)[0] || [];
    if (selected.length < 3) return { eligible: false, sampleSize: selected.length, group: group || selected[0]?.comparableGroup || '', cells: [] };
    const maxQuestion = subject === '국어' ? 45 : subject === '수학' ? 30 : subject === '영어' ? 45 : 20;
    const cells = [];
    for (let number = 1; number <= maxQuestion; number += 1) {
      const misses = selected.filter(row => (row.wrong || []).includes(number)).length;
      cells.push({ number, misses, total: selected.length, rate: misses / selected.length });
    }
    return { eligible: true, sampleSize: selected.length, group: selected[0].comparableGroup, cells };
  }

  function focusExamSummary(state, examId = 'exam-2026-09-kice-full') {
    const exam = (state.exams || []).find(row => row.id === examId);
    const analyses = (state.questionAnalyses || []).filter(row => row.examId === examId);
    const maxScore = subject => ['경제', '사회문화', '한국사'].includes(subject) ? 50 : 100;
    const scored = (exam?.results || []).filter(row => !['한국사'].includes(row.subject) && row.score != null);
    return {
      exam,
      totalLoss: scored.reduce((sum, row) => sum + Math.max(0, maxScore(row.subject) - Number(row.score)), 0),
      wrongCount: analyses.length,
      unanalysed: analyses.filter(row => row.stage === 'unanalysed').length,
      abandoned: analyses.filter(row => row.abandoned).length,
      stable: analyses.filter(row => row.stage === 'stable').length,
      bySubject: (exam?.results || []).map(row => ({ subject: row.subject, score: row.score, loss: row.score == null ? null : maxScore(row.subject) - row.score, maxScore: maxScore(row.subject), wrong: row.wrong?.length || 0 }))
    };
  }

  function pearson(pairs) {
    const clean = pairs.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
    if (clean.length < 2) return null;
    const meanX = clean.reduce((sum, row) => sum + row[0], 0) / clean.length;
    const meanY = clean.reduce((sum, row) => sum + row[1], 0) / clean.length;
    let numerator = 0;
    let sumX = 0;
    let sumY = 0;
    for (const [x, y] of clean) {
      numerator += (x - meanX) * (y - meanY);
      sumX += (x - meanX) ** 2;
      sumY += (y - meanY) ** 2;
    }
    const denominator = Math.sqrt(sumX * sumY);
    return denominator ? numerator / denominator : null;
  }

  function conditionObservations(state) {
    const rows = (state.conditions || []).filter(row => Number.isFinite(row.sleepMinutes) && Number.isFinite(row.focus));
    if (rows.length < 5) return { eligible: false, sampleSize: rows.length, sleepFocus: null, note: '수면시간과 집중도 짝이 5일 이상 쌓여야 관찰을 표시합니다.' };
    const sleepFocus = pearson(rows.map(row => [row.sleepMinutes, row.focus]));
    return {
      eligible: true,
      sampleSize: rows.length,
      sleepFocus,
      note: '상관은 원인을 증명하지 않으며 현재 기록 범위의 관찰값입니다.'
    };
  }

  function parseQuestionNumbers(value, max = 100) {
    return [...new Set(String(value || '').split(/[^0-9]+/).map(Number).filter(number => Number.isInteger(number) && number > 0 && number <= max))].sort((a, b) => a - b);
  }

  function safePercent(value) {
    return value == null || !Number.isFinite(value) ? null : clamp(value, 0, 9.99);
  }

  root.YeoksangCore = {
    DAY,
    addDays,
    actualMinutesOnDate,
    capacityHours,
    capacitySummary,
    clamp,
    clone,
    compareDates,
    committedOnDate,
    conditionObservations,
    curriculumLoad,
    daysBetween,
    deriveDayRecord,
    eachDate,
    examResults,
    focusExamSummary,
    isoDate,
    itemWorkload,
    moveTask,
    parseDate,
    parseQuestionNumbers,
    pearson,
    remainingUnits,
    repeatedQuestionData,
    reopenDay,
    safePercent,
    todayInZone,
    toggleTaskDone,
    closeDay,
    uid
  };
})(typeof window !== 'undefined' ? window : globalThis);
