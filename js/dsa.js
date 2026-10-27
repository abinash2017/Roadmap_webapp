/* ============================================
   DSA TRACK — dated interview-prep problem plan
   Spreads the curated list in js/dsa-sheet.js over the active roadmap's calendar
   (profile start_date + month durations):
     Phase 1 (Months 01–05)  Foundations — very light, load ramps up slowly
     Phase 2 (Month 06 → end) Interview prep — Mediums by pattern, then Hards
   Every 7th day of a phase is a revision day (no new problems); the final
   7 days of the roadmap are a mock-interview week.
   ============================================ */

import { escapeHtml } from './state.js';
import { showToast } from './toast.js';
import { DSA_FOUNDATION, DSA_INTERVIEW, DSA_COMPANIES } from './dsa-sheet.js';
import { activeMonths, getProfile, getMonthDateRange, todayStr, getDsaProgress, setDsaSolved } from './api-ops.js';

export const INTERVIEW_PREP_MONTH = 5;   // 0-based month index → interview prep starts at "Month 06"
const RAMP = 1.5;                        // a phase's last study day carries 2.5× the load of its first
const MOCK_WEEK_DAYS = 7;
const BACKLOG_PREVIEW = 8;

const ALL = [...DSA_FOUNDATION, ...DSA_INTERVIEW];
const BY_ID = new Map(ALL.map(p => [p.id, p]));
const FIRST_OF_TOPIC = new Set();
{
  const seen = new Set();
  ALL.forEach(p => {
    if (!seen.has(p.topic)) { seen.add(p.topic); FIRST_OF_TOPIC.add(p.id); }
  });
}

function refreshIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

function fmtDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ── Schedule ─────────────────────────────

function fillPhase(plan, problems, start, totalDays, phase, mockDays) {
  const studyDays = [];
  for (let i = 0; i < totalDays; i++) {
    const date = dateKey(addDays(start, i));
    let kind = 'study';
    if (i >= totalDays - mockDays) kind = 'mock';
    else if (i % 7 === 6) kind = 'revision';
    const entry = { date, phase, kind, ids: [] };
    plan.byDate.set(date, entry);
    if (kind === 'study') studyDays.push(entry);
  }
  const n = problems.length, d = studyDays.length;
  if (!d) return;
  // Cumulative share of problems by study day i follows a linearly rising daily load.
  let prev = 0;
  studyDays.forEach((entry, i) => {
    const x = (i + 1) / d;
    const end = Math.ceil(n * (x + RAMP * x * x / 2) / (1 + RAMP / 2) - 1e-9);
    entry.ids = problems.slice(prev, end).map(p => p.id);
    entry.ids.forEach(id => plan.dateOf.set(id, entry.date));
    prev = end;
  });
}

let _planCache = { key: '', plan: null };

// Returns null when there is no start date (or too few months to split into phases).
export function getDsaPlan() {
  const months = activeMonths();
  if (!getProfile().start_date || months.length <= INTERVIEW_PREP_MONTH) return null;
  const first = getMonthDateRange(0);
  const interview = getMonthDateRange(INTERVIEW_PREP_MONTH);
  const last = getMonthDateRange(months.length - 1);
  if (!first || !interview || !last) return null;

  const key = `${dateKey(first.start)}|${dateKey(interview.start)}|${dateKey(last.end)}`;
  if (_planCache.key === key) return _planCache.plan;

  const plan = {
    byDate: new Map(),
    dateOf: new Map(),
    start: dateKey(first.start),
    interviewStart: dateKey(interview.start),
    end: dateKey(last.end),
    interviewMonthNum: months[INTERVIEW_PREP_MONTH].num,
  };
  fillPhase(plan, DSA_FOUNDATION, first.start, daysBetween(first.start, interview.start), 1, 0);
  fillPhase(plan, DSA_INTERVIEW, interview.start, daysBetween(interview.start, last.end) + 1, 2, MOCK_WEEK_DAYS);
  _planCache = { key, plan };
  return plan;
}

export function getDsaStats(today = todayStr()) {
  const plan = getDsaPlan();
  const done = getDsaProgress();
  const phase = { 1: { total: 0, solved: 0 }, 2: { total: 0, solved: 0 } };
  const level = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
  let solved = 0, due = 0, dueSolved = 0;
  ALL.forEach((p, i) => {
    const ph = i < DSA_FOUNDATION.length ? 1 : 2;
    const isDone = !!done[p.id];
    phase[ph].total++;
    level[p.level].total++;
    if (isDone) { solved++; phase[ph].solved++; level[p.level].solved++; }
    const ds = plan && plan.dateOf.get(p.id);
    if (ds && ds <= today) {
      due++;
      if (isDone) dueSolved++;
    }
  });
  return { total: ALL.length, solved, due, behind: due - dueSolved, phase, level };
}

// Today's scheduled DSA work ({ kind: 'study'|'revision'|'mock', total, solved }), or null if not scheduled.
export function getDsaToday(today = todayStr()) {
  const entry = getDsaPlan()?.byDate.get(today);
  if (!entry) return null;
  const done = getDsaProgress();
  return { kind: entry.kind, total: entry.ids.length, solved: entry.ids.filter(id => done[id]).length };
}

function backlogIds(plan, today) {
  const done = getDsaProgress();
  return ALL.filter(p => {
    const ds = plan.dateOf.get(p.id);
    return ds && ds < today && !done[p.id];
  }).map(p => p.id);
}

function nextStudyDate(plan, fromDate) {
  const from = new Date(fromDate + 'T00:00:00');
  for (let i = 1; i <= 21; i++) {
    const entry = plan.byDate.get(dateKey(addDays(from, i)));
    if (entry && entry.ids.length) return entry.date;
  }
  return null;
}

// Unsolved problems from the 6 days before a revision day.
function weekCatchUpIds(plan, revisionDate) {
  const done = getDsaProgress();
  const base = new Date(revisionDate + 'T00:00:00');
  const ids = [];
  for (let i = 6; i >= 1; i--) {
    const entry = plan.byDate.get(dateKey(addDays(base, -i)));
    if (entry) entry.ids.forEach(id => { if (!done[id]) ids.push(id); });
  }
  return ids;
}

// ── UI ───────────────────────────────────

function problemRowHtml(id, done) {
  const p = BY_ID.get(id);
  if (!p) return '';
  const solved = !!done[id];
  const cos = DSA_COMPANIES[id] || [];
  return `
    <li class="dsa-item${solved ? ' solved' : ''}">
      <button type="button" class="dsa-check" data-id="${id}" role="checkbox" aria-checked="${solved}" aria-label="Mark ${escapeHtml(p.title)} as solved">${solved ? '✓' : ''}</button>
      <div class="dsa-item-body">
        <a class="dsa-title" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title)}</a>
        <div class="dsa-tags">
          <span class="dsa-level dsa-level-${p.level.toLowerCase()}">${p.level}</span>
          <span class="dsa-topic">${escapeHtml(p.topic)}</span>
          ${p.star ? '<span class="dsa-star" title="Must-do for interviews">★ must-do</span>' : ''}
          ${FIRST_OF_TOPIC.has(id) ? '<span class="dsa-new" title="First problem of this pattern — skim the basics before solving">new pattern</span>' : ''}
          ${cos.length ? `<span class="dsa-co" title="Asked at: ${escapeHtml(cos.join(', '))}">${escapeHtml(cos[0])}${cos.length > 1 ? ` +${cos.length - 1}` : ''}</span>` : ''}
        </div>
      </div>
    </li>`;
}

function listHtml(ids, done) {
  return `<ul class="dsa-list">${ids.map(id => problemRowHtml(id, done)).join('')}</ul>`;
}

function noteHtml(icon, text) {
  return `<div class="dsa-note"><i data-lucide="${icon}" class="lucide-icon sm"></i><span>${text}</span></div>`;
}

function dayBodyHtml(plan, dateStr, done) {
  const entry = plan.byDate.get(dateStr);
  if (!entry) {
    return dateStr < plan.start
      ? noteHtml('calendar-clock', `Your DSA plan starts on ${fmtDate(plan.start)}.`)
      : noteHtml('flag', 'Roadmap finished — keep solving 2–3 problems a day until you land the offer.');
  }
  if (entry.kind === 'mock') {
    return noteHtml('mic', 'Mock-interview week — no new problems. Each day: one timed Medium (25 min) and one starred problem you found hard, explained out loud as if in an interview.');
  }
  if (entry.kind === 'revision') {
    const catchUp = weekCatchUpIds(plan, dateStr);
    return noteHtml('rotate-ccw', catchUp.length
      ? 'Revision day — no new problems. Finish what is left from this week first:'
      : 'Revision day — all caught up. Re-solve 2 of this week\'s problems from a blank file, with a timer.')
      + (catchUp.length ? listHtml(catchUp, done) : '');
  }
  if (!entry.ids.length) {
    const next = nextStudyDate(plan, dateStr);
    return noteHtml('coffee', `No DSA today — focus on the roadmap topics.${next ? ` Next problem: ${fmtDate(next)}.` : ''}`);
  }
  return listHtml(entry.ids, done);
}

function backlogHtml(plan, dateStr, done, open) {
  if (dateStr !== todayStr()) return '';
  const ids = backlogIds(plan, dateStr);
  if (!ids.length) return '';
  return `
    <details class="dsa-backlog"${open ? ' open' : ''}>
      <summary><i data-lucide="history" class="lucide-icon sm"></i> ${ids.length} unsolved from earlier days</summary>
      ${listHtml(ids.slice(0, BACKLOG_PREVIEW), done)}
      ${ids.length > BACKLOG_PREVIEW ? `<div class="dsa-more">+${ids.length - BACKLOG_PREVIEW} more — clear the oldest first</div>` : ''}
    </details>`;
}

function footerHtml(compact) {
  const s = getDsaStats();
  const pct = s.total ? Math.round((s.solved / s.total) * 100) : 0;
  const status = s.behind > 0 ? `${s.behind} behind schedule` : 'On track';
  if (compact) {
    return `<div class="dsa-footer-mini ${s.behind > 0 ? 'behind' : 'ok'}">${status} · ${s.solved}/${s.total} solved</div>`;
  }
  return `
    <div class="dsa-footer">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="dsa-stats">
        <span class="dsa-stat ${s.behind > 0 ? 'behind' : 'ok'}">${status}</span>
        <span class="dsa-stat">Foundations ${s.phase[1].solved}/${s.phase[1].total}</span>
        <span class="dsa-stat">Interview ${s.phase[2].solved}/${s.phase[2].total}</span>
        <span class="dsa-stat"><span class="dsa-level dsa-level-easy">E</span> ${s.level.Easy.solved}/${s.level.Easy.total}</span>
        <span class="dsa-stat"><span class="dsa-level dsa-level-medium">M</span> ${s.level.Medium.solved}/${s.level.Medium.total}</span>
        <span class="dsa-stat"><span class="dsa-level dsa-level-hard">H</span> ${s.level.Hard.solved}/${s.level.Hard.total}</span>
      </div>
    </div>`;
}

function dsaCardInner(dateStr, compact, backlogOpen) {
  const plan = getDsaPlan();
  const done = getDsaProgress();
  const s = getDsaStats();
  const entry = plan && plan.byDate.get(dateStr);
  const subtitle = !entry
    ? 'Interview problem plan'
    : entry.phase === 1
      ? 'Phase 1 · Foundations — light practice'
      : `Phase 2 · Interview prep (from Month ${plan.interviewMonthNum})`;
  const isToday = dateStr === todayStr();

  let html = `
    <div class="card-header">
      <div class="card-header-with-icon">
        <div class="card-icon card-icon-dsa"><i data-lucide="code-xml" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">DSA Practice</div>
          <div class="card-subtitle">${subtitle}</div>
        </div>
      </div>
      <span class="badge badge-accent" title="Solved / total problems">${s.solved}/${s.total}</span>
    </div>`;

  if (!plan) {
    return html + noteHtml('calendar-x', 'Set your start date in Settings to get a dated DSA plan.');
  }

  html += `
    <div class="dsa-date-nav">
      <button type="button" class="dsa-nav" data-step="-1" aria-label="Previous day">‹</button>
      <span class="dsa-date-label">${fmtDate(dateStr)}${isToday ? ' · Today' : ''}</span>
      <button type="button" class="dsa-nav" data-step="1" aria-label="Next day">›</button>
      ${isToday ? '' : '<button type="button" class="btn btn-sm btn-outline dsa-today">Today</button>'}
    </div>`;
  html += dayBodyHtml(plan, dateStr, done);
  html += backlogHtml(plan, dateStr, done, backlogOpen);
  html += footerHtml(compact);
  return html;
}

export function dsaCardHtml({ compact = false } = {}) {
  const today = todayStr();
  return `<div class="card dsa-card${compact ? ' side-card compact' : ''}" id="dsaCard" data-date="${today}">${dsaCardInner(today, compact, false)}</div>`;
}

export function bindDsaCard({ compact = false, hooks = {} } = {}) {
  const card = document.getElementById('dsaCard');
  if (!card) return;

  const rerender = (dateStr) => {
    const backlogOpen = !!card.querySelector('.dsa-backlog')?.open;
    card.dataset.date = dateStr;
    card.innerHTML = dsaCardInner(dateStr, compact, backlogOpen);
    refreshIcons();
  };

  card.addEventListener('click', (e) => {
    const check = e.target.closest('.dsa-check');
    if (check) {
      const id = check.dataset.id;
      const nowSolved = !getDsaProgress()[id];
      setDsaSolved(id, nowSolved);
      rerender(card.dataset.date);
      if (!nowSolved) return;
      const entry = getDsaPlan()?.byDate.get(card.dataset.date);
      const dayIds = entry && entry.kind === 'study' ? entry.ids : [];
      const done = getDsaProgress();
      if (hooks.celebrate && dayIds.includes(id) && dayIds.every(x => done[x])) {
        hooks.celebrate('DSA Day Cleared!', `${dayIds.length} problem${dayIds.length === 1 ? '' : 's'} solved`);
      } else {
        showToast('Solved — logged in your DSA plan', 'success', 1500);
      }
      return;
    }
    const nav = e.target.closest('.dsa-nav');
    if (nav) {
      const d = new Date(card.dataset.date + 'T00:00:00');
      rerender(dateKey(addDays(d, parseInt(nav.dataset.step))));
      return;
    }
    if (e.target.closest('.dsa-today')) rerender(todayStr());
  });
}
