(function (root) {
  'use strict';

  const C = root.YeoksangCore;

  function esc(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function empty(message) {
    return `<div class="chart-empty"><span class="chart-empty-mark">·</span><p>${esc(message)}</p></div>`;
  }

  function trend(rows, options = {}) {
    const data = rows.filter(row => Number.isFinite(Number(row.value))).map(row => ({ ...row, value: Number(row.value) }));
    if (!data.length) return empty(options.empty || '기록이 아직 없습니다.');
    const color = options.color || '#2559b8';
    const width = 680;
    const height = 230;
    const pad = { left: 42, right: 24, top: 30, bottom: 48 };
    const values = data.map(row => row.value);
    let min = options.min != null ? Number(options.min) : Math.min(...values);
    let max = options.max != null ? Number(options.max) : Math.max(...values);
    if (min === max) { min -= 1; max += 1; }
    const span = max - min;
    const x = index => data.length === 1
      ? width / 2
      : pad.left + index * (width - pad.left - pad.right) / (data.length - 1);
    const y = value => {
      const ratio = (value - min) / span;
      const normal = options.lowerIsBetter ? ratio : 1 - ratio;
      return pad.top + normal * (height - pad.top - pad.bottom);
    };
    const grid = [0, .25, .5, .75, 1].map(ratio => {
      const gy = pad.top + ratio * (height - pad.top - pad.bottom);
      const value = options.lowerIsBetter ? min + ratio * span : max - ratio * span;
      return `<line x1="${pad.left}" x2="${width - pad.right}" y1="${gy}" y2="${gy}" class="chart-grid"/><text x="${pad.left - 8}" y="${gy + 4}" text-anchor="end" class="chart-axis">${esc(options.format ? options.format(value) : Math.round(value))}</text>`;
    }).join('');
    const labels = data.map((row, index) => `<text x="${x(index)}" y="${height - 18}" text-anchor="middle" class="chart-axis">${esc(row.shortLabel || row.date?.slice(5) || index + 1)}</text>`).join('');

    let marks = '';
    if (data.length === 1) {
      marks = `<line x1="${pad.left}" x2="${width - pad.right}" y1="${y(data[0].value)}" y2="${y(data[0].value)}" class="single-rule" style="stroke:${color}"/><circle cx="${x(0)}" cy="${y(data[0].value)}" r="7" style="fill:${color}"><title>${esc(data[0].label || data[0].date)} · ${esc(options.format ? options.format(data[0].value) : data[0].value)}</title></circle><text x="${x(0)}" y="${y(data[0].value) - 13}" text-anchor="middle" class="chart-value">${esc(options.format ? options.format(data[0].value) : data[0].value)}</text>`;
    } else if (data.length === 2) {
      const barWidth = 76;
      const bottom = height - pad.bottom;
      marks = data.map((row, index) => {
        const top = y(row.value);
        return `<rect x="${x(index) - barWidth / 2}" y="${top}" width="${barWidth}" height="${Math.max(3, bottom - top)}" rx="3" style="fill:${color};opacity:${index ? 1 : .65}"><title>${esc(row.label || row.date)} · ${esc(options.format ? options.format(row.value) : row.value)}</title></rect><text x="${x(index)}" y="${top - 9}" text-anchor="middle" class="chart-value">${esc(options.format ? options.format(row.value) : row.value)}</text>`;
      }).join('');
    } else {
      const points = data.map((row, index) => `${x(index)},${y(row.value)}`).join(' ');
      marks = `<polyline points="${points}" fill="none" style="stroke:${color}" class="trend-line"/>${data.map((row, index) => `<circle cx="${x(index)}" cy="${y(row.value)}" r="5" style="fill:${color}" tabindex="0"><title>${esc(row.label || row.date)} · ${esc(options.format ? options.format(row.value) : row.value)}</title></circle>`).join('')}`;
    }

    const descriptor = data.length === 1 ? '단일 관측값' : data.length === 2 ? '두 시험 비교 막대' : `${data.length}회 추세선`;
    return `<div class="chart-wrap" role="img" aria-label="${esc(options.ariaLabel || descriptor)}"><svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">${grid}${marks}${labels}</svg><p class="chart-footnote">n=${data.length} · ${descriptor}${options.note ? ` · ${esc(options.note)}` : ''}</p></div>`;
  }

  function lossBars(rows, options = {}) {
    const data = rows.filter(row => Number.isFinite(Number(row.loss)));
    if (!data.length) return empty('점수 기록이 없습니다.');
    const max = Math.max(1, options.max || Math.max(...data.map(row => Number(row.loss))));
    return `<div class="loss-bars" role="img" aria-label="과목별 만점 손실">${data.map(row => {
      const width = C.clamp(Number(row.loss) / max * 100, 0, 100);
      return `<div class="loss-row"><div class="loss-label"><span>${esc(row.subject)}</span><strong>−${esc(row.loss)}점</strong></div><div class="loss-track"><span style="width:${width}%"></span><i class="zero-target" title="목표: 손실 0점"></i></div><small>오답 ${esc(row.wrong)}문항</small></div>`;
    }).join('')}</div>`;
  }

  function heatmap(data) {
    if (!data.eligible) return empty(`비교 가능한 완전 문항표가 ${data.sampleSize}/3회입니다. 3회부터 반복 번호를 판정합니다.`);
    return `<div class="heatmap" role="grid" aria-label="${esc(data.group)} 반복 오답 번호">${data.cells.map(cell => {
      const level = cell.rate === 0 ? 0 : cell.rate < .34 ? 1 : cell.rate < .67 ? 2 : 3;
      return `<div class="heat-cell heat-${level}" role="gridcell" tabindex="0" aria-label="${cell.number}번, ${cell.total}회 중 ${cell.misses}회 오답"><strong>${cell.number}</strong><small>${cell.misses}/${cell.total}</small></div>`;
    }).join('')}</div><p class="chart-footnote">${esc(data.group)} · 완전 문항표 n=${data.sampleSize} · 진할수록 반복 오답률이 높음</p>`;
  }

  function miniProgress(value, label, color = '#2559b8') {
    const ratio = C.clamp(Number(value || 0), 0, 1);
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    return `<svg class="mini-ring" viewBox="0 0 88 88" role="img" aria-label="${esc(label)} ${Math.round(ratio * 100)}%"><circle cx="44" cy="44" r="${radius}" class="ring-base"/><circle cx="44" cy="44" r="${radius}" class="ring-value" style="stroke:${color};stroke-dasharray:${circumference};stroke-dashoffset:${circumference * (1 - ratio)}"/><text x="44" y="48" text-anchor="middle">${Math.round(ratio * 100)}%</text></svg>`;
  }

  root.YeoksangCharts = { empty, esc, heatmap, lossBars, miniProgress, trend };
})(typeof window !== 'undefined' ? window : globalThis);
