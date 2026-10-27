/* ============================================
   GROWTH — anti learned-helplessness / anti tutorial-hell tools
   Stuck Log · Rebuild Without Notes · Learn vs Build tracker ·
   Weekly Solo Challenge · Proof scoreboard
   ============================================ */

import { escapeHtml } from './state.js';
import { showToast } from './toast.js';
import { SOLO_CHALLENGE_TWISTS } from './data.js';
import {
  activeMonths, getProfile, todayStr,
  getTopicStuckEntries, addStuckEntry, updateStuckEntry, deleteStuckEntry,
  getMonthStuckEntries, getStuckStats,
  isRebuildableRepo, getRebuildState, setRebuildDone, getRebuildStats,
  getTimeLog, setTimeLog, getTimeTotals, getTimeSeries, getConsumeBuildStatus, BUILD_TO_CONSUME_TARGET,
  isoWeekKey, weekBounds, getChallengeState, setChallengeState, getChallengeDoneCount
} from './api-ops.js';

function refreshIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function fmtShortDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtHours(h) {
  return `${Math.round(h * 100) / 100}h`;
}

function fmtRatio(ratio) {
  if (ratio == null) return '—';
  if (!isFinite(ratio)) return '0 : ∞';
  return `1 : ${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}`;
}

// ═════════════════════════════════════════
// STUCK LOG
// ═════════════════════════════════════════

function topicCoords(monthId, wi, di, ti) {
  const m = activeMonths()[monthId];
  const w = m?.weeks?.[wi];
  const d = w?.days?.[di];
  return { month: m, week: w, day: d, topic: d?.topics?.[ti] };
}

export function stuckButtonHtml(monthId, wi, di, ti) {
  const entries = getTopicStuckEntries(monthId, wi, di, ti);
  const open = entries.filter(e => !e.solution).length;
  const cls = entries.length === 0 ? 'empty' : open > 0 ? 'has-open' : 'all-solved';
  const title = entries.length === 0
    ? 'Stuck? Log the problem, what you tried, and the solution'
    : `${entries.length} stuck-log entr${entries.length === 1 ? 'y' : 'ies'} · ${open} still open`;
  return `<button type="button" class="topic-stuck-btn ${cls}" data-stuck="${wi}_${di}_${ti}" title="${title}" aria-label="Stuck log for this topic"><i data-lucide="life-buoy" class="lucide-icon sm"></i>${entries.length ? `<span class="topic-stuck-count">${entries.length}</span>` : ''}</button>`;
}

export function stuckLogCardHtml(monthId) {
  return `
    <div class="card collapsible" data-section="stucklog-${monthId}" id="stuckLogCard">
      <div class="card-header collapsible-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-stuck"><i data-lucide="life-buoy" class="lucide-icon"></i></div>
          <div class="card-title">Stuck Log <span class="collapse-count" id="stuckLogCount">${stuckCountLabel(monthId)}</span></div>
        </div>
        <span class="collapse-chevron">▾</span>
      </div>
      <div class="collapsible-body" id="stuckLogCardBody">${stuckLogCardBodyHtml(monthId)}</div>
    </div>
  `;
}

function stuckCountLabel(monthId) {
  const entries = getMonthStuckEntries(monthId);
  const solved = entries.filter(e => e.solution).length;
  return `${entries.length - solved} open · ${solved} solved`;
}

function stuckLogCardBodyHtml(monthId) {
  const entries = getMonthStuckEntries(monthId);
  if (!entries.length) {
    return `<div class="growth-empty">
      <i data-lucide="life-buoy" class="lucide-icon"></i>
      <div>Hit a wall? Click the <strong>Stuck</strong> icon next to any topic and write down the <em>problem</em>, <em>what you tried</em>, and later the <em>solution</em>.
      Every solved entry is proof you can get yourself unstuck.</div>
    </div>`;
  }
  const ordered = [...entries.filter(e => !e.solution), ...entries.filter(e => e.solution)];
  return `<ul class="stuck-summary-list">
    ${ordered.map(e => {
      const c = topicCoords(monthId, e.wi, e.di, e.ti);
      const where = c.day ? `${c.week.title.split('—')[0].trim()} · ${c.day.title.split(':')[0]}` : '';
      return `<li class="stuck-summary-item ${e.solution ? 'solved' : 'open'}" data-stuck="${e.wi}_${e.di}_${e.ti}" tabindex="0" role="button">
        <span class="stuck-status-dot" title="${e.solution ? 'Solved' : 'Still stuck'}"></span>
        <span class="stuck-summary-main">
          <span class="stuck-summary-problem">${escapeHtml(e.problem)}</span>
          <span class="stuck-summary-topic">${escapeHtml(c.topic || e.topic || '')}${where ? ` · ${escapeHtml(where)}` : ''}</span>
        </span>
        <span class="stuck-summary-date">${fmtShortDate(e.solved_at || e.created_at)}</span>
      </li>`;
    }).join('')}
  </ul>`;
}

function refreshStuckUI(monthId, wi, di, ti) {
  const btn = document.querySelector(`.topic-stuck-btn[data-stuck="${wi}_${di}_${ti}"]`);
  if (btn) btn.outerHTML = stuckButtonHtml(monthId, wi, di, ti);
  const body = document.getElementById('stuckLogCardBody');
  if (body) body.innerHTML = stuckLogCardBodyHtml(monthId);
  const count = document.getElementById('stuckLogCount');
  if (count) count.textContent = stuckCountLabel(monthId);
  refreshIcons();
}

// Delegated: works for topic buttons and the summary card, survives in-place re-renders.
export function bindStuckLog(monthId) {
  const content = document.getElementById('content');
  if (!content) return;
  const open = (el) => {
    const [wi, di, ti] = el.dataset.stuck.split('_').map(n => parseInt(n));
    openStuckLogModal(monthId, wi, di, ti);
  };
  content.querySelectorAll('.week-content, #stuckLogCard').forEach(root => {
    root.addEventListener('click', (e) => {
      const el = e.target.closest('.topic-stuck-btn, .stuck-summary-item');
      if (!el || !root.contains(el)) return;
      e.stopPropagation();
      open(el);
    });
    root.addEventListener('keydown', (e) => {
      const el = e.target.closest('.stuck-summary-item');
      if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(el); }
    });
  });
}

export function openStuckLogModal(monthId, wi, di, ti) {
  const existing = document.getElementById('stuckLogOverlay');
  if (existing) existing.remove();

  const c = topicCoords(monthId, wi, di, ti);
  const firstEntry = getTopicStuckEntries(monthId, wi, di, ti)[0];
  const topicText = c.topic || firstEntry?.topic || 'Topic';
  let editingId = null;

  const overlay = document.createElement('div');
  overlay.className = 'notes-history-overlay stuck-overlay';
  overlay.id = 'stuckLogOverlay';
  overlay.innerHTML = `
    <div class="notes-history-modal stuck-modal" role="dialog" aria-modal="true" aria-labelledby="stuckModalTitle">
      <div class="notes-history-header">
        <h3 id="stuckModalTitle"><i data-lucide="life-buoy" class="lucide-icon"></i> Stuck Log</h3>
        <button class="close-btn" id="stuckModalClose" aria-label="Close stuck log">✕</button>
      </div>
      <div class="stuck-modal-body">
        <div class="stuck-topic">
          <div class="stuck-topic-text">${escapeHtml(topicText)}</div>
          ${c.day ? `<div class="stuck-topic-where">Month ${c.month.num} · ${escapeHtml(c.week.title)} · ${escapeHtml(c.day.title)}</div>` : ''}
        </div>
        <div class="stuck-ladder" title="Struggle ladder">
          <span><b>0–15m</b> read error, debug</span>
          <span><b>15–30m</b> official docs</span>
          <span><b>30–45m</b> search exact error</span>
          <span><b>45m+</b> ask for a <em>hint</em>, not the answer</span>
        </div>
        <div class="stuck-entries" id="stuckEntries"></div>
        <form class="stuck-form" id="stuckForm" autocomplete="off">
          <div class="stuck-form-title" id="stuckFormTitle">Log a new wall</div>
          <label class="stuck-label" for="stuckProblem">Problem <span class="stuck-req">*</span></label>
          <textarea class="stuck-input" id="stuckProblem" rows="2" maxlength="2000" placeholder="Exact error or what confused you…" required></textarea>
          <label class="stuck-label" for="stuckTried">What I tried</label>
          <textarea class="stuck-input" id="stuckTried" rows="3" maxlength="4000" placeholder="Every attempt — even the ones that didn't work…"></textarea>
          <label class="stuck-label" for="stuckSolution">Solution / what finally worked</label>
          <textarea class="stuck-input" id="stuckSolution" rows="3" maxlength="4000" placeholder="Leave empty while you're still stuck — come back and fill it in."></textarea>
          <div class="stuck-form-actions">
            <button type="button" class="btn btn-sm btn-outline" id="stuckCancelEdit" hidden>Cancel edit</button>
            <button type="submit" class="btn btn-sm btn-accent" id="stuckSave"><i data-lucide="check" class="lucide-icon sm"></i> Save entry</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const $ = (id) => overlay.querySelector(`#${id}`);
  const problemEl = $('stuckProblem');
  const triedEl = $('stuckTried');
  const solutionEl = $('stuckSolution');

  function resetForm() {
    editingId = null;
    problemEl.value = '';
    triedEl.value = '';
    solutionEl.value = '';
    $('stuckFormTitle').textContent = 'Log a new wall';
    $('stuckCancelEdit').hidden = true;
  }

  function renderEntries() {
    const entries = getTopicStuckEntries(monthId, wi, di, ti);
    const list = $('stuckEntries');
    if (!entries.length) {
      list.innerHTML = '';
      return;
    }
    list.innerHTML = entries.map(e => `
      <div class="stuck-entry ${e.solution ? 'solved' : 'open'}${editingId === e.id ? ' editing' : ''}" data-id="${e.id}">
        <div class="stuck-entry-head">
          <span class="stuck-badge ${e.solution ? 'solved' : 'open'}">${e.solution ? '✓ Solved' : '● Still stuck'}</span>
          <span class="stuck-entry-date">${fmtShortDate(e.created_at)}${e.solved_at ? ` → solved ${fmtShortDate(e.solved_at)}` : ''}</span>
          <span class="stuck-entry-actions">
            <button type="button" class="stuck-icon-btn" data-edit="${e.id}" title="Edit" aria-label="Edit entry"><i data-lucide="pencil" class="lucide-icon sm"></i></button>
            <button type="button" class="stuck-icon-btn danger" data-del="${e.id}" title="Delete" aria-label="Delete entry"><i data-lucide="trash-2" class="lucide-icon sm"></i></button>
          </span>
        </div>
        <div class="stuck-field"><span class="stuck-field-label">Problem</span><div class="stuck-field-text">${escapeHtml(e.problem)}</div></div>
        ${e.tried ? `<div class="stuck-field"><span class="stuck-field-label">Tried</span><div class="stuck-field-text">${escapeHtml(e.tried)}</div></div>` : ''}
        ${e.solution ? `<div class="stuck-field"><span class="stuck-field-label">Solution</span><div class="stuck-field-text">${escapeHtml(e.solution)}</div></div>` : ''}
      </div>
    `).join('');
    refreshIcons();
  }

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  $('stuckModalClose').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);

  $('stuckEntries').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-del]');
    const entries = getTopicStuckEntries(monthId, wi, di, ti);
    if (editBtn) {
      const entry = entries.find(x => x.id === editBtn.dataset.edit);
      if (!entry) return;
      editingId = entry.id;
      problemEl.value = entry.problem || '';
      triedEl.value = entry.tried || '';
      solutionEl.value = entry.solution || '';
      $('stuckFormTitle').textContent = entry.solution ? 'Edit entry' : 'Update entry — got unstuck? Add the solution';
      $('stuckCancelEdit').hidden = false;
      renderEntries();
      (entry.solution ? problemEl : solutionEl).focus();
    } else if (delBtn) {
      if (!confirm('Delete this stuck-log entry?')) return;
      deleteStuckEntry(monthId, wi, di, ti, delBtn.dataset.del);
      if (editingId === delBtn.dataset.del) resetForm();
      renderEntries();
      refreshStuckUI(monthId, wi, di, ti);
    }
  });

  $('stuckCancelEdit').addEventListener('click', () => { resetForm(); renderEntries(); });

  $('stuckForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = { problem: problemEl.value, tried: triedEl.value, solution: solutionEl.value };
    if (!fields.problem.trim()) {
      showToast('Describe the problem first', 'warning', 1800);
      problemEl.focus();
      return;
    }
    const wasOpen = editingId
      ? !getTopicStuckEntries(monthId, wi, di, ti).find(x => x.id === editingId)?.solution
      : true;
    const saved = editingId
      ? updateStuckEntry(monthId, wi, di, ti, editingId, fields)
      : addStuckEntry(monthId, wi, di, ti, topicText, fields);
    if (!saved) {
      showToast('Could not save entry', 'error', 2000);
      return;
    }
    if (saved.solution && wasOpen) {
      const { solved } = getStuckStats();
      showToast(`Unstuck yourself! That's ${solved} wall${solved === 1 ? '' : 's'} broken on your own`, 'success', 3200);
    } else if (!saved.solution && !editingId) {
      showToast('Logged. Climb the ladder — come back and add the solution', 'info', 2800);
    } else {
      showToast('Entry updated', 'success', 1500);
    }
    resetForm();
    renderEntries();
    refreshStuckUI(monthId, wi, di, ti);
  });

  renderEntries();
  refreshIcons();
  problemEl.focus();
}

// ═════════════════════════════════════════
// REBUILD WITHOUT NOTES
// ═════════════════════════════════════════

function rebuildCountLabel(monthId) {
  const m = activeMonths()[monthId];
  const st = getRebuildState(monthId);
  let total = 0, done = 0;
  (m?.repos || []).forEach((r, ri) => {
    if (!isRebuildableRepo(r)) return;
    total++;
    if (st[ri]) done++;
  });
  return { total, done };
}

export function rebuildCardHtml(monthId) {
  const m = activeMonths()[monthId];
  const { total, done } = rebuildCountLabel(monthId);
  if (!m || total === 0) return '';
  const st = getRebuildState(monthId);
  return `
    <div class="card collapsible" data-section="rebuild-${monthId}" id="rebuildCard">
      <div class="card-header collapsible-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-rebuild"><i data-lucide="rotate-ccw" class="lucide-icon"></i></div>
          <div class="card-title">Rebuild Without Notes <span class="collapse-count" id="rebuildCount">${done}/${total}</span></div>
        </div>
        <span class="collapse-chevron">▾</span>
      </div>
      <div class="collapsible-body">
        <p class="growth-hint">Finished a project? Wait 2–3 days, open an <strong>empty folder</strong> and rebuild its core from memory — no tutorial, no notes, no AI. Tick it only when it works.</p>
        <ul class="rebuild-list">
          ${m.repos.map((r, ri) => {
            if (!isRebuildableRepo(r)) return '';
            const at = st[ri];
            return `
              <li class="rebuild-item ${at ? 'checked' : ''}" data-idx="${ri}" tabindex="0" role="checkbox" aria-checked="${at ? 'true' : 'false'}">
                <span class="rebuild-check">${at ? '✓' : ''}</span>
                <span class="rebuild-name">${escapeHtml(r)}</span>
                <span class="rebuild-date">${at ? `Rebuilt ${fmtShortDate(at)}` : 'Not rebuilt yet'}</span>
              </li>`;
          }).join('')}
        </ul>
      </div>
    </div>
  `;
}

export function bindRebuildCard(monthId, hooks = {}) {
  const card = document.getElementById('rebuildCard');
  if (!card) return;
  const toggle = (el) => {
    const idx = parseInt(el.dataset.idx);
    const isDone = !!getRebuildState(monthId)[idx];
    if (!isDone && !confirm('Honest check: did you rebuild this from an empty folder — no tutorial, no notes, no AI?')) return;
    setRebuildDone(monthId, idx, !isDone);
    const at = getRebuildState(monthId)[idx];
    el.classList.toggle('checked', !!at);
    el.setAttribute('aria-checked', at ? 'true' : 'false');
    el.querySelector('.rebuild-check').textContent = at ? '✓' : '';
    el.querySelector('.rebuild-date').textContent = at ? `Rebuilt ${fmtShortDate(at)}` : 'Not rebuilt yet';
    const { total, done } = rebuildCountLabel(monthId);
    const countEl = document.getElementById('rebuildCount');
    if (countEl) countEl.textContent = `${done}/${total}`;
    if (at) {
      showToast('Rebuilt from scratch — that knowledge is yours now', 'success', 2600);
      if (hooks.celebrate && done === total) hooks.celebrate('All Projects Rebuilt!', 'You can build these without a tutorial');
    }
  };
  card.querySelectorAll('.rebuild-item').forEach(el => {
    el.addEventListener('click', () => toggle(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(el); }
    });
  });
}

// ═════════════════════════════════════════
// LEARN vs BUILD (consume : build) TRACKER
// ═════════════════════════════════════════

const STATUS_COPY = {
  none:   { icon: 'info',           text: 'Log today\'s hours. Watching / reading / courses = consume. Coding with the tutorial closed = build.' },
  good:   { icon: 'circle-check',   text: `Healthy: you're building at least ${BUILD_TO_CONSUME_TARGET}× what you consume. Keep it that way.` },
  warn:   { icon: 'triangle-alert', text: `Below 1 : ${BUILD_TO_CONSUME_TARGET}. You're building, but consuming too much — close the tab and build.` },
  danger: { icon: 'siren',          text: 'Tutorial-hell risk: you consumed more than you built. Stop watching — build something small today.' },
};

function timeStatsHtml(compact) {
  const week = getTimeTotals(7);
  const status = getConsumeBuildStatus(week.consume, week.build);
  const sum = week.consume + week.build;
  const buildPct = sum ? Math.round((week.build / sum) * 100) : 0;
  const targetPct = Math.round((BUILD_TO_CONSUME_TARGET / (BUILD_TO_CONSUME_TARGET + 1)) * 100);
  const copy = STATUS_COPY[status.level];

  let h = `
    <div class="time-summary">
      <div class="time-summary-item"><span class="time-dot consume"></span>Consume <b>${fmtHours(week.consume)}</b></div>
      <div class="time-summary-item"><span class="time-dot build"></span>Build <b>${fmtHours(week.build)}</b></div>
      <div class="time-summary-item time-ratio ${status.level}">Ratio <b>${fmtRatio(status.ratio)}</b></div>
    </div>
    <div class="time-ratio-bar" title="Build share of the last 7 days (target ≥ ${targetPct}%)">
      <div class="time-ratio-consume" style="width:${sum ? 100 - buildPct : 0}%"></div>
      <div class="time-ratio-build" style="width:${buildPct}%"></div>
      <div class="time-ratio-target" style="left:${100 - targetPct}%"></div>
    </div>
    <div class="time-ratio-caption">Last 7 days · marker = 1 : ${BUILD_TO_CONSUME_TARGET} target</div>
    <div class="growth-alert ${status.level}"><i data-lucide="${copy.icon}" class="lucide-icon sm"></i><span>${copy.text}</span></div>
  `;

  if (!compact) {
    const series = getTimeSeries(7);
    const max = Math.max(1, ...series.map(d => d.consume + d.build));
    h += `<div class="time-chart">
      ${series.map(d => {
        const label = new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' });
        return `<div class="time-chart-col" title="${d.date}: consume ${fmtHours(d.consume)} · build ${fmtHours(d.build)}">
          <div class="time-chart-stack">
            <div class="time-chart-build" style="height:${(d.build / max) * 100}%"></div>
            <div class="time-chart-consume" style="height:${(d.consume / max) * 100}%"></div>
          </div>
          <div class="time-chart-label${d.date === todayStr() ? ' today' : ''}">${label}</div>
        </div>`;
      }).join('')}
    </div>`;
    const all = getTimeTotals(null);
    const allStatus = getConsumeBuildStatus(all.consume, all.build);
    h += `<div class="time-alltime">All-time: consume ${fmtHours(all.consume)} · build ${fmtHours(all.build)} · ratio ${fmtRatio(allStatus.ratio)}</div>`;
  }
  return h;
}

export function timeLogCardHtml({ compact = false } = {}) {
  const today = todayStr();
  const t = getTimeLog(today);
  return `
    <div class="card growth-time-card${compact ? ' side-card compact' : ''}" id="timeLogCard">
      <div class="card-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-time"><i data-lucide="scale" class="lucide-icon"></i></div>
          <div>
            <div class="card-title">Learn vs Build</div>
            <div class="card-subtitle">Target ≥ 1 : ${BUILD_TO_CONSUME_TARGET} (consume : build)</div>
          </div>
        </div>
        <input type="date" class="time-date-input" id="timeLogDate" value="${today}" max="${today}" aria-label="Day to log" />
      </div>
      <div class="time-inputs">
        <label class="time-input-group">
          <span class="time-input-label"><span class="time-dot consume"></span>Consume</span>
          <span class="time-input-row">
            <input type="number" class="time-input" id="timeConsume" min="0" max="24" step="0.25" value="${t.consume}" aria-label="Consume hours" />
            <button type="button" class="time-plus" data-add="consume" title="+30 min">+½h</button>
          </span>
          <span class="time-input-hint">videos · courses · reading</span>
        </label>
        <label class="time-input-group">
          <span class="time-input-label"><span class="time-dot build"></span>Build</span>
          <span class="time-input-row">
            <input type="number" class="time-input" id="timeBuild" min="0" max="24" step="0.25" value="${t.build}" aria-label="Build hours" />
            <button type="button" class="time-plus" data-add="build" title="+30 min">+½h</button>
          </span>
          <span class="time-input-hint">coding with tutorial closed</span>
        </label>
      </div>
      <div id="timeLogStats">${timeStatsHtml(compact)}</div>
    </div>
  `;
}

export function bindTimeLogCard({ compact = false, onChange } = {}) {
  const card = document.getElementById('timeLogCard');
  if (!card) return;
  const dateEl = card.querySelector('#timeLogDate');
  const consumeEl = card.querySelector('#timeConsume');
  const buildEl = card.querySelector('#timeBuild');
  const statsEl = card.querySelector('#timeLogStats');

  const refreshStats = () => {
    statsEl.innerHTML = timeStatsHtml(compact);
    refreshIcons();
  };

  const save = () => {
    const date = dateEl.value;
    if (!date || date > todayStr()) {
      showToast('Pick today or a past day', 'warning', 1800);
      dateEl.value = todayStr();
      return;
    }
    const c = parseFloat(consumeEl.value) || 0;
    const b = parseFloat(buildEl.value) || 0;
    if (c + b > 24) showToast('A day only has 24 hours — build time was capped', 'warning', 2200);
    const saved = setTimeLog(date, c, b);
    if (!saved) return;
    consumeEl.value = saved.consume;
    buildEl.value = saved.build;
    refreshStats();
    if (onChange) onChange();
  };

  dateEl.addEventListener('change', () => {
    if (!dateEl.value || dateEl.value > todayStr()) dateEl.value = todayStr();
    const t = getTimeLog(dateEl.value);
    consumeEl.value = t.consume;
    buildEl.value = t.build;
  });
  consumeEl.addEventListener('change', save);
  buildEl.addEventListener('change', save);
  card.querySelectorAll('.time-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.dataset.add === 'consume' ? consumeEl : buildEl;
      input.value = (parseFloat(input.value) || 0) + 0.5;
      save();
    });
  });
}

// ═════════════════════════════════════════
// WEEKLY SOLO CHALLENGE
// ═════════════════════════════════════════

const CHALLENGE_RULES = [
  'Blank file — no tutorial or video open',
  'AI only for hints, and only after 30 min stuck',
  'Timebox ≈ 2 hours; ugly-but-finished wins',
  'Log every wall in the Stuck Log'
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Deterministic per (week, seed, month) until the user interacts — then the text is snapshotted.
function resolveChallenge(weekKey, sourceMonthId) {
  const st = getChallengeState(weekKey);
  if (st.title) return st;
  const months = activeMonths();
  const m = months[sourceMonthId] || months[0];
  const pool = (m.checklist && m.checklist.length) ? m.checklist : m.goals;
  const h = hashStr(weekKey);
  return {
    ...st,
    title: pool[(h + st.seed) % pool.length],
    twist: SOLO_CHALLENGE_TWISTS[(Math.floor(h / 7) + st.seed) % SOLO_CHALLENGE_TWISTS.length],
    source: `Month ${m.num} · ${m.title}`,
  };
}

function challengeHistoryHtml() {
  const startStr = getProfile().start_date;
  const start = startStr ? new Date(startStr + 'T00:00:00') : null;
  const now = new Date();
  const dots = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
    const key = isoWeekKey(d);
    const { start: ws, end: we } = weekBounds(d);
    const st = getChallengeState(key);
    let cls = 'na', title = `${key}: before your start date`;
    if (st.done) { cls = 'done'; title = `${key}: done`; }
    else if (i === 0) { cls = 'current'; title = `${key}: this week`; }
    else if (!start || we >= start) { cls = 'missed'; title = `${key}: not done`; }
    dots.push(`<span class="challenge-dot ${cls}" title="${title} (${fmtShortDate(ws)})"></span>`);
  }
  const doneCount = getChallengeDoneCount();
  return `<div class="challenge-history">
    <span class="challenge-dots">${dots.join('')}</span>
    <span class="challenge-history-label">${doneCount} solo challenge${doneCount === 1 ? '' : 's'} completed</span>
  </div>`;
}

export function challengeCardHtml(sourceMonthId, { compact = false, editing = false } = {}) {
  const weekKey = isoWeekKey();
  const ch = resolveChallenge(weekKey, sourceMonthId);
  const { start, end } = weekBounds();
  const msLeft = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1) - new Date();
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `
    <div class="card growth-challenge-card${compact ? ' side-card compact' : ''}${ch.done ? ' done' : ''}" id="challengeCard">
      <div class="card-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-challenge"><i data-lucide="swords" class="lucide-icon"></i></div>
          <div>
            <div class="card-title">Weekly Solo Challenge</div>
            <div class="card-subtitle">${fmt(start)} – ${fmt(end)} · ${ch.done ? 'completed' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}</div>
          </div>
        </div>
        <span class="challenge-status ${ch.done ? 'done' : ''}">${ch.done ? '✓ Done' : 'No tutorials'}</span>
      </div>
      ${editing ? `
        <div class="challenge-edit">
          <label class="stuck-label" for="challengeTitleInput">Your challenge</label>
          <input type="text" class="stuck-input" id="challengeTitleInput" maxlength="300" value="${escapeHtml(ch.title)}" placeholder="e.g. Build a rate-limited URL shortener API" />
          <label class="stuck-label" for="challengeTwistInput">Twist / constraint</label>
          <input type="text" class="stuck-input" id="challengeTwistInput" maxlength="300" value="${escapeHtml(ch.twist || '')}" placeholder="e.g. Docs only, 90-minute timebox" />
          <div class="stuck-form-actions">
            <button type="button" class="btn btn-sm btn-outline" data-ch="cancel-edit">Cancel</button>
            <button type="button" class="btn btn-sm btn-accent" data-ch="save-edit"><i data-lucide="check" class="lucide-icon sm"></i> Save</button>
          </div>
        </div>
      ` : `
        <div class="challenge-title">${escapeHtml(ch.title)}</div>
        ${ch.twist ? `<div class="challenge-twist"><i data-lucide="sparkles" class="lucide-icon sm"></i> <span><b>Twist:</b> ${escapeHtml(ch.twist)}</span></div>` : ''}
        <div class="challenge-source">${ch.custom ? 'Your own challenge' : `From ${escapeHtml(ch.source || '')} checklist`}</div>
      `}
      ${compact ? '' : `<ul class="challenge-rules">${CHALLENGE_RULES.map(r => `<li>${r}</li>`).join('')}</ul>`}
      ${editing ? '' : `
        <div class="challenge-actions">
          ${ch.done
            ? `<button type="button" class="btn btn-sm btn-outline" data-ch="undo"><i data-lucide="undo-2" class="lucide-icon sm"></i> Undo</button>`
            : `<button type="button" class="btn btn-sm btn-accent" data-ch="done"><i data-lucide="flag" class="lucide-icon sm"></i> I built it</button>
               <button type="button" class="btn btn-sm btn-outline" data-ch="reroll" title="Pick a different challenge"><i data-lucide="shuffle" class="lucide-icon sm"></i> Reroll</button>
               <button type="button" class="btn btn-sm btn-outline" data-ch="edit" title="Write your own challenge"><i data-lucide="pencil" class="lucide-icon sm"></i> Own</button>`}
        </div>
        <textarea class="challenge-reflection" id="challengeReflection" rows="2" maxlength="4000" placeholder="Reflection: what blocked you? What did you figure out alone?">${escapeHtml(ch.reflection || '')}</textarea>
      `}
      ${compact ? '' : challengeHistoryHtml()}
    </div>
  `;
}

export function bindChallengeCard(sourceMonthId, { compact = false, hooks = {} } = {}) {
  const card = document.getElementById('challengeCard');
  if (!card) return;
  const weekKey = isoWeekKey();

  const rerender = (opts = {}) => {
    card.outerHTML = challengeCardHtml(sourceMonthId, { compact, ...opts });
    refreshIcons();
    bindChallengeCard(sourceMonthId, { compact, hooks });
    if (opts.editing) document.getElementById('challengeTitleInput')?.focus();
  };
  // Freeze the generated text once the user starts working on it.
  const snapshot = () => {
    const ch = resolveChallenge(weekKey, sourceMonthId);
    return { title: ch.title, twist: ch.twist, source: ch.source || '' };
  };

  card.querySelectorAll('[data-ch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.ch;
      const st = getChallengeState(weekKey);
      if (action === 'done') {
        setChallengeState(weekKey, { ...snapshot(), done: true, done_at: new Date().toISOString() });
        rerender();
        if (hooks.celebrate) hooks.celebrate('Solo Challenge Done!', 'Built without a tutorial — proof you can');
        else showToast('Solo challenge done!', 'success');
      } else if (action === 'undo') {
        setChallengeState(weekKey, { done: false, done_at: null });
        rerender();
      } else if (action === 'reroll') {
        setChallengeState(weekKey, { seed: (st.seed || 0) + 1, title: '', twist: '', source: '', custom: false });
        rerender();
      } else if (action === 'edit') {
        rerender({ editing: true });
      } else if (action === 'cancel-edit') {
        rerender();
      } else if (action === 'save-edit') {
        const title = (card.querySelector('#challengeTitleInput')?.value || '').trim();
        const twist = (card.querySelector('#challengeTwistInput')?.value || '').trim();
        if (!title) {
          showToast('Write a challenge first', 'warning', 1800);
          return;
        }
        setChallengeState(weekKey, { title, twist, source: '', custom: true });
        rerender();
        showToast('Challenge set — close the tutorials and go', 'success', 2000);
      }
      if (hooks.onChange && action !== 'edit' && action !== 'cancel-edit') hooks.onChange();
    });
  });

  const reflection = card.querySelector('#challengeReflection');
  if (reflection) {
    let timer;
    const persist = () => {
      clearTimeout(timer);
      const current = getChallengeState(weekKey);
      if ((current.reflection || '') === reflection.value) return;
      setChallengeState(weekKey, { ...snapshot(), reflection: reflection.value });
    };
    reflection.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(persist, 800);
    });
    reflection.addEventListener('blur', persist);
  }
}

// ═════════════════════════════════════════
// PROOF SCOREBOARD (overview)
// ═════════════════════════════════════════

export function growthScoreboardHtml() {
  const stuck = getStuckStats();
  const rebuild = getRebuildStats();
  const challenges = getChallengeDoneCount();
  const all = getTimeTotals(null);
  const ratioStatus = getConsumeBuildStatus(all.consume, all.build);

  const message = stuck.solved > 0
    ? `You've gotten yourself unstuck <strong>${stuck.solved}</strong> time${stuck.solved === 1 ? '' : 's'}. Next time you think “I can't do this”, you already have ${stuck.solved} counter-example${stuck.solved === 1 ? '' : 's'}.`
    : '';

  return `
    <div class="card growth-scoreboard">
      <div class="card-header">
        <div class="card-header-with-icon">
          <div class="card-icon card-icon-proof"><i data-lucide="shield-check" class="lucide-icon"></i></div>
          <div>
            <div class="card-title">Proof You Can Do Hard Things</div>
            <div class="card-subtitle">Evidence beats self-doubt — every number here is something you did without a tutorial</div>
          </div>
        </div>
      </div>
      <div class="growth-stats">
        <div class="growth-stat">
          <div class="growth-stat-value">${stuck.solved}</div>
          <div class="growth-stat-label">Walls broken alone</div>
          <div class="growth-stat-sub">${stuck.open} still open</div>
        </div>
        <div class="growth-stat">
          <div class="growth-stat-value">${rebuild.done}/${rebuild.total}</div>
          <div class="growth-stat-label">Projects rebuilt w/o notes</div>
          <div class="growth-stat-sub">from an empty folder</div>
        </div>
        <div class="growth-stat">
          <div class="growth-stat-value">${challenges}</div>
          <div class="growth-stat-label">Solo challenges done</div>
          <div class="growth-stat-sub">no tutorials</div>
        </div>
        <div class="growth-stat ratio-${ratioStatus.level}">
          <div class="growth-stat-value">${fmtRatio(ratioStatus.ratio)}</div>
          <div class="growth-stat-label">Consume : Build</div>
          <div class="growth-stat-sub">all-time · target 1 : ${BUILD_TO_CONSUME_TARGET}</div>
        </div>
      </div>
      ${message ? `<div class="growth-message">${message}</div>` : ''}
    </div>
  `;
}
