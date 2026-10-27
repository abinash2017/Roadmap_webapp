/* ============================================
   VIEW: Month page (#0 … #9)
   Hero, progress, resources, weekly breakdown, checklist, repos, growth cards,
   notes editor, and the side column (to-dos, calendar, DSA, time log, challenge).
   ============================================ */

import { state, escapeHtml } from '../state.js';
import { showToast } from '../toast.js';
import { getTopicLinks } from '../topic-links.js';
import {
  stuckButtonHtml, stuckLogCardHtml, bindStuckLog, rebuildCardHtml, bindRebuildCard,
  timeLogCardHtml, bindTimeLogCard, challengeCardHtml, bindChallengeCard
} from '../growth.js';
import { dsaCardHtml, bindDsaCard } from '../dsa.js';
import {
  activeMonths, getChecklistState, setChecklistItem, getResourceLink, getRepoLink,
  getWeekNotes, setWeekNotes, getDayCheckState, setDayCheck, getDayProgress,
  getMonthDateRange, getProfile, getStreak, updateStreak, syncTodosFromApi
} from '../api-ops.js';
import {
  getDayStatus, dayStatusIconHtml, getMonthProgress, getChallengeMonthId, checkMonthCompletion,
  LEVEL_PER_TOPIC, LEVEL_PER_CHECKLIST
} from '../progress.js';
import { celebrate, growthHooks, addRippleEffect, flashChecked, pulseStreakBadge } from '../effects.js';
import { updateSidebarProgress, renderOverallProgress, renderStreakBadge } from '../shell.js';
import { navigate } from '../render.js';
import {
  todoCardHtml, calendarCardHtml, initTodos, refreshTodosFor,
  handleTodoClick, handleTodoKeydown, handleTodoDrag
} from '../components/todos.js';
import { notesCardHtml, handleNotesClick, handleNotesInput, handleNotesKeydown } from '../components/notes-editor.js';
import { handleLinkableClick, handleLinkableDblclick } from '../components/link-editor.js';

const weekNoteTimers = new Map();
let currentMonthId = 0;

// ── Sticky side column ────────────────────
// A sticky side column taller than the viewport would hide its lower cards until the page end.
// Negative `top` makes it scroll with the page until its bottom is visible, then stick.
const SIDE_COL_TOP = 72;
let sideColObserver = null;
function applySideColTop() {
  const col = document.querySelector('.month-side-col');
  if (!col) return;
  col.style.top = `${Math.min(SIDE_COL_TOP, window.innerHeight - col.offsetHeight - 16)}px`;
}
function fitStickySideCol() {
  if (sideColObserver) sideColObserver.disconnect();
  const col = document.querySelector('.month-side-col');
  if (!col) return;
  if (typeof ResizeObserver !== 'undefined') {
    sideColObserver = new ResizeObserver(applySideColTop);
    sideColObserver.observe(col);
  }
  applySideColTop();
}
window.addEventListener('resize', applySideColTop);

// ── Markup ────────────────────────────────

function heroHtml(m, dateRange) {
  return `
    <div class="month-hero compact">
      <div class="month-hero-number">${m.num}</div>
      <div class="month-hero-title">${m.title}</div>
      ${dateRange ? `<div class="month-hero-dates">${dateRange.label}</div>` : ''}
      <div class="month-hero-desc">${m.description}</div>
      <div class="meta-tags">
        <span class="meta-tag duration"><i data-lucide="timer" class="lucide-icon sm"></i> ${m.duration}</span>
        <span class="meta-tag ${m.diffClass}"><i data-lucide="diamond" class="lucide-icon sm"></i> ${m.difficulty}</span>
        <span class="meta-tag hours"><i data-lucide="clock" class="lucide-icon sm"></i> ${m.hours}</span>
        ${dateRange ? `<span class="meta-tag duration"><i data-lucide="calendar" class="lucide-icon sm"></i> ${dateRange.days} days</span>` : ''}
      </div>
    </div>
  `;
}

function progressCardHtml(monthId) {
  const prog = getMonthProgress(monthId);
  const dp = getDayProgress(monthId);
  return `
    <div class="card month-progress-card">
      <div class="card-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-progress"><i data-lucide="bar-chart-3" class="lucide-icon"></i></div>
          <div>
            <div class="card-title">Checklist</div>
            <div class="card-subtitle">${prog.done}/${prog.total} completed</div>
          </div>
        </div>
        <span class="month-pct-badge ${prog.percent === 100 ? 'complete' : ''}">${prog.percent}%</span>
      </div>
      <div class="month-progress-bar">
        <div class="month-progress-fill" style="width:${prog.percent}%"></div>
      </div>
      <div class="card-header" style="margin-top:12px; padding-top:8px; border-top:1px solid var(--border)">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-progress"><i data-lucide="book-open" class="lucide-icon"></i></div>
          <div>
            <div class="card-title" style="font-size:0.85rem">Topics</div>
            <div class="card-subtitle" id="topicSubtitle">${dp.done}/${dp.total} topics completed</div>
          </div>
        </div>
        <span class="month-pct-badge" id="topicPctBadge">${dp.percent}%</span>
      </div>
      <div class="month-progress-bar">
        <div class="month-progress-fill" id="topicProgressFill" style="width:${dp.percent}%; background: var(--warning)"></div>
      </div>
    </div>
  `;
}

function resourcesCardHtml(m, monthId) {
  return `
    <div class="card collapsible collapsed" data-section="resources-${monthId}">
      <div class="card-header collapsible-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-resources"><i data-lucide="book-open" class="lucide-icon"></i></div>
          <div class="card-title">Resources <span class="collapse-count">${m.resources.length}</span></div>
        </div>
        <span class="collapse-chevron">▾</span>
      </div>
      <div class="collapsible-body">
        <div class="resources-grid compact">
          ${m.resources.map((r, ri) => {
            const typeIcon = r.type === 'Course' ? 'graduation-cap' : r.type === 'Book' ? 'book-open' : r.type === 'Video' ? 'play-circle' : 'globe';
            const link = getResourceLink(monthId, ri) || r.link || '';
            const hasLink = link.length > 0;
            return `
            <div class="resource-row compact linkable${hasLink ? ' has-link' : ''}" data-month="${monthId}" data-idx="${ri}" data-link="${escapeHtml(link)}" title="${hasLink ? 'Click to open · Double-click to edit link' : 'Double-click to add a link'}">
              <i data-lucide="${typeIcon}" class="resource-type-icon lucide-icon sm"></i>
              <span class="resource-name">${r.name}</span>
              ${hasLink ? '<i data-lucide="external-link" class="link-indicator lucide-icon sm"></i>' : '<i data-lucide="plus-circle" class="link-add-hint lucide-icon sm"></i>'}
              <span class="resource-type">${r.type}</span>
              <span class="resource-cost">${r.cost}</span>
            </div>
          `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function weeksCardHtml(m, monthId, dateRange) {
  let html = `<div class="card">
    <div class="card-header-with-icon" style="margin-bottom:14px">
      <div class="card-icon card-icon-weeks"><i data-lucide="calendar-range" class="lucide-icon"></i></div>
      <div class="card-title">Weekly Breakdown</div>
    </div>`;
  let foundStartHere = false;
  m.weeks.forEach((w, wi) => {
    const weekNote = getWeekNotes(monthId, wi);
    let weekTotal = 0, weekDone = 0;
    w.days.forEach((d, di) => {
      d.topics.forEach((t, ti) => {
        weekTotal++;
        if (getDayCheckState(monthId, wi, di, ti)) weekDone++;
      });
    });
    const weekPct = weekTotal ? Math.round((weekDone / weekTotal) * 100) : 0;

    let weekDateLabel = w.tag;
    let bufferDaysInWeek = 0;
    if (dateRange) {
      // Distribute scheduled days proportionally across weeks (includes buffer)
      const daysPerWeek = dateRange.days / m.weeks.length;
      const wStartOffset = Math.round(wi * daysPerWeek);
      const wEndOffset = Math.round((wi + 1) * daysPerWeek) - 1;
      const wStart = new Date(dateRange.start);
      wStart.setDate(wStart.getDate() + wStartOffset);
      const wEnd = new Date(dateRange.start);
      wEnd.setDate(wEnd.getDate() + wEndOffset);
      const fmtW = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const totalWeekDays = wEndOffset - wStartOffset + 1;
      weekDateLabel = `${fmtW(wStart)} – ${fmtW(wEnd)}`;

      // How many content days are in this week
      const firstNums = w.days[0]?.title.match(/\d+/g);
      const lastNums = w.days[w.days.length - 1]?.title.match(/\d+/g);
      if (firstNums && lastNums) {
        const contentDays = parseInt(lastNums[lastNums.length - 1]) - parseInt(firstNums[0]) + 1;
        bufferDaysInWeek = Math.max(0, totalWeekDays - contentDays);
      }
    }

    html += `
      <div class="week-accordion" data-week="${wi}" style="--i:${wi}">
        <div class="week-header">
          <span class="week-chevron">▶</span>
          <span class="week-title">${w.title}</span>
          <div class="week-header-right">
            <span class="week-pct">${weekPct}%</span>
            <span class="week-tag">${weekDateLabel}</span>
          </div>
        </div>
        <div class="week-progress-mini"><div class="week-progress-mini-fill" style="width:${weekPct}%"></div></div>
        <div class="week-body">
          <div class="week-content">
            ${w.days.map((d, di) => `
              <div class="day-section">
                <div class="day-title">${dayStatusIconHtml(getDayStatus(monthId, wi, di))}${d.title}</div>
                <ul class="topic-list topic-list-checkable">
                  ${d.topics.map((t, ti) => {
                    const isChecked = getDayCheckState(monthId, wi, di, ti);
                    const isStartHere = !isChecked && !foundStartHere;
                    if (isStartHere) foundStartHere = true;
                    const tLinks = getTopicLinks(monthId, wi, di, ti);
                    const linksHtml = tLinks.length ? `<span class="topic-links">${tLinks.map(l => {
                      const icon = l.type === 'video' ? '▶' : l.type === 'problem' ? '⚡' : '📄';
                      return `<a href="${l.url}" target="_blank" rel="noopener" class="topic-link topic-link-${l.type}" title="${l.label}">${icon}</a>`;
                    }).join('')}</span>` : '';
                    return `
                      <li class="topic-check-item ${isChecked ? 'checked' : ''}${isStartHere ? ' topic-start-here' : ''}"
                          data-m="${monthId}" data-w="${wi}" data-d="${di}" data-t="${ti}">
                        <span class="topic-check-box">${isChecked ? '✓' : ''}</span>
                        <span class="topic-meta">
                          <span class="topic-check-text">${t}</span>
                          ${linksHtml}
                          ${stuckButtonHtml(monthId, wi, di, ti)}
                        </span>
                      </li>`;
                  }).join('')}
                </ul>
              </div>
            `).join('')}
            ${bufferDaysInWeek > 0 ? `
            <div class="day-section buffer-day-section">
              <div class="day-title"><span class="buffer-badge">↻ +${bufferDaysInWeek} buffer day${bufferDaysInWeek > 1 ? 's' : ''}</span> Review & Practice</div>
              <ul class="topic-list">
                <li>Review weak areas from this week</li>
                <li>Redo exercises without looking at notes</li>
                <li>${wi < m.weeks.length - 1 ? 'Preview next week\'s topics' : 'Rest and recharge before next month'}</li>
                <li>LeetCode practice (1–2 problems)</li>
              </ul>
            </div>` : ''}
            <div class="week-notes-section">
              <div class="week-notes-label"><i data-lucide="pencil" class="lucide-icon sm"></i> Week Notes</div>
              <textarea class="week-notes-area" data-month="${monthId}" data-week="${wi}"
                placeholder="Notes for ${w.title}...">${weekNote}</textarea>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function checklistCardHtml(m, monthId) {
  const prog = getMonthProgress(monthId);
  const cl = getChecklistState(monthId);
  return `
    <div class="card collapsible collapsed" data-section="checklist-${monthId}">
      <div class="card-header collapsible-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-checklist"><i data-lucide="circle-check-big" class="lucide-icon"></i></div>
          <div class="card-title">End of Month Checklist <span class="collapse-count">${prog.done}/${prog.total}</span></div>
        </div>
        <span class="collapse-chevron">▾</span>
      </div>
      <div class="collapsible-body">
        <ul class="checklist">
          ${m.checklist.map((item, i) => `
            <li class="checklist-item ${cl[i] ? 'checked' : ''}" data-month="${monthId}" data-idx="${i}">
              <span class="checklist-check">${cl[i] ? '✓' : ''}</span>
              <span class="checklist-text">${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

function reposCardHtml(m, monthId) {
  return `
    <div class="card collapsible collapsed" data-section="repos-${monthId}">
      <div class="card-header collapsible-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-repos"><i data-lucide="folder-git-2" class="lucide-icon"></i></div>
          <div class="card-title">GitHub Repos <span class="collapse-count">${m.repos.length}</span></div>
        </div>
        <span class="collapse-chevron">▾</span>
      </div>
      <div class="collapsible-body">
        <div class="repo-chips-wrap">
          ${m.repos.map((r, ri) => {
            const rLink = getRepoLink(monthId, ri);
            const hasLink = rLink.length > 0;
            return `<span class="repo-chip linkable${hasLink ? ' has-link' : ''}" data-month="${monthId}" data-idx="${ri}" data-link="${escapeHtml(rLink)}" title="${hasLink ? 'Click to open · Double-click to edit' : 'Double-click to add link'}">${r}${hasLink ? ' <i data-lucide="external-link" class="lucide-icon sm"></i>' : ''}</span>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Render ────────────────────────────────

function renderMonth(monthId, { mount, preserve }) {
  currentMonthId = monthId;
  const months = activeMonths();
  const m = months[monthId];
  const dateRange = getMonthDateRange(monthId);
  const showChallengeHere = monthId === getChallengeMonthId();

  const html = `
    <div class="fade-in">
      ${heroHtml(m, dateRange)}
      <div class="month-two-col">
        <div class="month-main-col">
          ${progressCardHtml(monthId)}
          ${resourcesCardHtml(m, monthId)}
          ${weeksCardHtml(m, monthId, dateRange)}
          ${checklistCardHtml(m, monthId)}
          ${reposCardHtml(m, monthId)}
          ${rebuildCardHtml(monthId)}
          ${stuckLogCardHtml(monthId)}
          ${notesCardHtml(monthId)}
        </div>
        <div class="month-side-col">
          ${todoCardHtml()}
          ${calendarCardHtml(dateRange)}
          ${dsaCardHtml({ compact: true })}
          ${timeLogCardHtml({ compact: true })}
          ${showChallengeHere ? challengeCardHtml(monthId, { compact: true }) : ''}
        </div>
      </div>
      <div class="month-nav-row">
        ${monthId > 0 ? `<button class="btn btn-outline" id="prevMonth">← Month ${months[monthId - 1].num}</button>` : '<div></div>'}
        ${monthId < 9 ? `<button class="btn btn-accent" id="nextMonth">Month ${months[monthId + 1].num} →</button>` : '<div></div>'}
      </div>
    </div>
  `;
  mount(html);

  // Growth/DSA cards own their in-card listeners (they re-render themselves in place).
  bindStuckLog(monthId);
  bindRebuildCard(monthId, growthHooks);
  bindTimeLogCard({ compact: true });
  bindDsaCard({ compact: true, hooks: growthHooks });
  if (showChallengeHere) bindChallengeCard(monthId, { compact: true, hooks: growthHooks });
  fitStickySideCol();

  initTodos(monthId, dateRange, { preserve });
  if (!preserve) autoExpandWeek();

  if (state.apiAvailable) {
    syncTodosFromApi(monthId).then(() => refreshTodosFor(monthId));
  }
}

function autoExpandWeek() {
  if (!getProfile().auto_expand_week) return;
  const accordions = [...document.querySelectorAll('.week-accordion')];
  const target = accordions.find(acc => parseInt(acc.querySelector('.week-pct')?.textContent) < 100);
  if (target) {
    target.classList.add('open');
    const wi = target.dataset.week;
    // Look the week up again: a quick re-render may have replaced this element.
    setTimeout(() => document.querySelector(`.week-accordion[data-week="${wi}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  } else if (accordions.length > 0) {
    accordions[accordions.length - 1].classList.add('open');
  }
}

// ── Topic & checklist toggles (patch the DOM in place) ──

function onTopicClick(el, e) {
  addRippleEffect(el, e);
  const mid = parseInt(el.dataset.m);
  const wi = parseInt(el.dataset.w);
  const di = parseInt(el.dataset.d);
  const ti = parseInt(el.dataset.t);
  const current = getDayCheckState(mid, wi, di, ti);
  setDayCheck(mid, wi, di, ti, !current);
  const completions = [];
  if (!current) {
    const prevStreak = getStreak().count;
    const res = updateStreak();
    if (res.count > prevStreak) pulseStreakBadge();
  }
  el.classList.toggle('checked');
  el.querySelector('.topic-check-box').textContent = !current ? '✓' : '';
  flashChecked(el, !current);

  // Move start-here glow to next unchecked topic
  if (!current && el.classList.contains('topic-start-here')) {
    el.classList.remove('topic-start-here');
    document.querySelector('.topic-check-item:not(.checked)')?.classList.add('topic-start-here');
  }

  renderStreakBadge();

  const daySection = el.closest('.day-section');
  if (daySection) {
    const dayTitle = daySection.querySelector('.day-title');
    if (dayTitle) {
      dayTitle.querySelector('.day-status')?.remove();
      const iconHtml = dayStatusIconHtml(getDayStatus(mid, wi, di));
      if (iconHtml) dayTitle.insertAdjacentHTML('afterbegin', iconHtml);
    }

    if (!current) {
      const dayTopics = [...daySection.querySelectorAll('.topic-check-item')];
      if (dayTopics.length > 0 && dayTopics.every(item => item.classList.contains('checked'))) {
        const dayName = dayTitle
          ? [...dayTitle.childNodes].filter(n => !(n.classList && n.classList.contains('day-status'))).map(n => n.textContent).join('').trim()
          : 'Day';
        completions.push({ rank: 1, title: 'Day Complete!', sub: dayName });
      }
    }
  }

  const accordion = el.closest('.week-accordion');
  if (accordion) {
    const items = [...accordion.querySelectorAll('.topic-check-item')];
    const wt = items.length;
    const wd = items.filter(item => item.classList.contains('checked')).length;
    const weekPct = wt ? Math.round((wd / wt) * 100) : 0;
    const pctEl = accordion.querySelector('.week-pct');
    if (pctEl) pctEl.textContent = `${weekPct}%`;
    const weekFill = accordion.querySelector('.week-progress-mini-fill');
    if (weekFill) weekFill.style.width = `${weekPct}%`;
    if (wt > 0 && wd === wt && !current) {
      const weekTitle = accordion.querySelector('.week-title');
      completions.push({ rank: 2, title: 'Week Complete!', sub: weekTitle ? weekTitle.textContent : '' });
    }
  }

  const dp = getDayProgress(mid);
  const topicSub = document.getElementById('topicSubtitle');
  if (topicSub) topicSub.textContent = `${dp.done}/${dp.total} topics completed`;
  const topicPct = document.getElementById('topicPctBadge');
  if (topicPct) topicPct.textContent = `${dp.percent}%`;
  const topicFill = document.getElementById('topicProgressFill');
  if (topicFill) topicFill.style.width = `${dp.percent}%`;

  updateSidebarProgress(mid);
  renderOverallProgress();
  const newlyCompletedMonth = checkMonthCompletion();
  if (newlyCompletedMonth >= 0 && !current) {
    const md = activeMonths()[newlyCompletedMonth];
    completions.push({ rank: 3, title: 'Month Complete!', sub: md ? md.title : '' });
  }
  // One click can finish a day, week and month at once — only the biggest one plays.
  if (completions.length) {
    const top = completions.reduce((a, b) => (b.rank > a.rank ? b : a));
    celebrate(top.title, top.sub, { levelGain: LEVEL_PER_TOPIC });
  }
}

function onChecklistClick(el, e) {
  addRippleEffect(el, e);
  const mid = parseInt(el.dataset.month);
  const idx = parseInt(el.dataset.idx);
  const current = getChecklistState(mid)[idx] || false;
  setChecklistItem(mid, idx, !current);
  el.classList.toggle('checked');
  el.querySelector('.checklist-check').textContent = !current ? '✓' : '';
  flashChecked(el, !current);
  if (!current) showToast('Checklist item completed', 'success');
  renderOverallProgress();
  updateSidebarProgress(mid);
  renderStreakBadge();
  const newlyCompletedMonth = checkMonthCompletion();
  const newProg = getMonthProgress(mid);
  const progressCard = document.querySelector('.month-progress-card');
  const progBadge = progressCard?.querySelector('.month-pct-badge');
  if (progBadge) progBadge.textContent = `${newProg.percent}%`;
  const subtitle = progressCard?.querySelector('.card-subtitle');
  if (subtitle) subtitle.textContent = `${newProg.done}/${newProg.total} completed`;
  const fill = progressCard?.querySelector('.month-progress-fill');
  if (fill) fill.style.width = `${newProg.percent}%`;
  const countEl = el.closest('.collapsible')?.querySelector('.collapse-count');
  if (countEl) countEl.textContent = `${newProg.done}/${newProg.total}`;
  if (!current && (newProg.percent === 100 || newlyCompletedMonth >= 0)) {
    const monthData = activeMonths().find(m => m.id === mid);
    celebrate('Month Complete!', monthData ? monthData.title : '', { levelGain: LEVEL_PER_CHECKLIST });
  }
}

// ── Delegated events ──────────────────────

function onClick(e) {
  if (handleTodoClick(e)) return;
  if (handleNotesClick(e, currentMonthId)) return;
  if (handleLinkableClick(e)) return;

  const t = e.target;
  const weekHeader = t.closest('.week-header');
  if (weekHeader) { weekHeader.parentElement.classList.toggle('open'); return; }

  const topic = t.closest('.topic-check-item');
  if (topic) {
    if (t.closest('.topic-link, .topic-stuck-btn')) return; // link navigates / stuck log opens instead
    onTopicClick(topic, e);
    return;
  }

  const checklistItem = t.closest('.checklist-item');
  if (checklistItem) { onChecklistClick(checklistItem, e); return; }

  if (t.closest('#prevMonth')) navigate(currentMonthId - 1);
  else if (t.closest('#nextMonth')) navigate(currentMonthId + 1);
}

function onInput(e) {
  const el = e.target;
  if (el.classList.contains('week-notes-area')) {
    const key = `${el.dataset.month}_${el.dataset.week}`;
    clearTimeout(weekNoteTimers.get(key));
    weekNoteTimers.set(key, setTimeout(() => {
      setWeekNotes(parseInt(el.dataset.month), parseInt(el.dataset.week), el.value);
    }, 500));
    return;
  }
  handleNotesInput(e);
}

export const monthView = {
  title(monthId) {
    const m = activeMonths()[monthId];
    const dr = getMonthDateRange(monthId);
    return dr ? `${dr.monthName}: ${m.title}` : `Month ${m.num}: ${m.title}`;
  },
  render: renderMonth,
  events: {
    click: onClick,
    dblclick: handleLinkableDblclick,
    input: onInput,
    keydown(e) {
      if (!handleNotesKeydown(e, currentMonthId)) handleTodoKeydown(e);
    },
    dragstart: handleTodoDrag,
    dragover: handleTodoDrag,
    dragleave: handleTodoDrag,
    drop: handleTodoDrag,
    dragend: handleTodoDrag
  }
};
