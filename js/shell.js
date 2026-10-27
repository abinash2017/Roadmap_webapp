/* ============================================
   SHELL — sidebar, topbar widgets, profile picker, quick capture
   (everything outside #content)
   ============================================ */

import { state, escapeHtml, DEMO_MODE } from './state.js';
import { setAnimeMessageProvider, setNeonCityProvider, refreshNeonCity } from './anime-bg.js';
import { getCurrentMotivationQuote } from './quotes.js';
import { showToast } from './toast.js';
import {
  activeMonths, getDayProgress, getMonthDateRange, getProfile, getNotes, setNotes,
  getStreak, getStuckStats, getTimeTotals, getConsumeBuildStatus, getChallengeDoneCount,
  activateProfileById, syncFromApi
} from './api-ops.js';
import {
  getMonthBlendedProgress, getOverallProgress, getCurrentMonthId, getJourneyDay,
  getVariantLabel, initials, getNextTopic
} from './progress.js';
import { prefersReducedMotion, animateCount, refreshIcons } from './effects.js';
import { navigate, setView, renderAll } from './render.js';

// Level Up Hero "system windows" — built from the user's real progress.
setAnimeMessageProvider(() => {
  const msgs = [];
  const months = activeMonths();
  const curId = getCurrentMonthId();
  const cur = months[curId];
  const next = months[curId + 1];
  const streak = getStreak().count || 0;
  const stuck = getStuckStats();
  const week = getTimeTotals(7);
  const ratio = getConsumeBuildStatus(week.consume, week.build);
  const overall = getOverallProgress();
  msgs.push({ head: '[ STATUS ]', lines: [[{ t: 'Streak ' }, { t: `${streak} day${streak === 1 ? '' : 's'}`, hl: true }], [{ t: 'Progress ' }, { t: `${overall.percent}%`, hl: true }, { t: ` · ${overall.done}/${overall.total}` }]] });
  if (cur) msgs.push({ head: '[ CURRENT DUNGEON ]', lines: [[{ t: `Month ${cur.num}`, hl: true }], [{ t: cur.title }]] });
  if (next) msgs.push({ head: '[ WARNING ]', lines: [[{ t: 'A new gate will open:' }], [{ t: next.title, hl: true }]] });
  msgs.push({ head: '[ WALLS BROKEN ]', lines: [[{ t: 'Solved alone ' }, { t: String(stuck.solved), hl: true }], [{ t: `Still open ${stuck.open}` }]] });
  if (ratio.level === 'danger' || ratio.level === 'warn') {
    msgs.push({ head: '[ PENALTY RISK ]', lines: [[{ t: 'Consume > build this week.' }], [{ t: 'Close the tutorial.', hl: true }]] });
  } else if (ratio.level === 'good') {
    msgs.push({ head: '[ TRAINING OK ]', lines: [[{ t: 'Build ratio ' }, { t: '≥ 1 : 3', hl: true }], [{ t: 'Keep training, hunter.' }]] });
  }
  msgs.push({ head: '[ QUEST LOG ]', lines: [[{ t: 'Solo challenges cleared ' }, { t: String(getChallengeDoneCount()), hl: true }], [{ t: 'No tutorials used.' }]] });
  return msgs;
});

// Neon Tokyo: city lights follow overall %, each completed month lights a tower, billboard shows live info.
setNeonCityProvider(() => {
  const overall = getOverallProgress();
  const completedMonths = activeMonths().filter(m => getMonthBlendedProgress(m.id).percent === 100).length;
  const next = getNextTopic();
  const streak = getStreak().count || 0;
  const q = getCurrentMotivationQuote();
  const parts = [];
  if (next) {
    const topic = next.text.length > 80 ? `${next.text.slice(0, 77)}…` : next.text;
    parts.push(`NEXT ▸ M${next.monthNum}: ${topic}`);
  }
  if (streak > 0) parts.push(`🔥 ${streak}-DAY STREAK`);
  parts.push(`${overall.percent}% COMPLETE`);
  parts.push(`"${q.quote}" — ${q.author}`);
  return { power: overall.percent / 100, completedMonths, day: getJourneyDay(), ticker: parts.join('   ◆   ') };
});

// ── One-time event wiring (delegated; survives every re-render) ──

export function initShell() {
  document.getElementById('hamburger').addEventListener('click', openSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeSidebar);

  document.getElementById('sidebarNav').addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item[data-view]');
    if (!item) return;
    const view = item.dataset.view;
    navigate(/^\d+$/.test(view) ? parseInt(view) : view);
  });

  const btn = document.getElementById('profilePickerBtn');
  const menu = document.getElementById('profilePickerMenu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = menu.hidden;
    menu.hidden = !isHidden;
    btn.setAttribute('aria-expanded', String(isHidden));
  });
  menu.addEventListener('click', onProfileMenuClick);

  document.addEventListener('click', (e) => {
    const picker = document.getElementById('profilePicker');
    if (!picker || picker.contains(e.target)) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  });
}

function onProfileMenuClick(e) {
  const menu = e.currentTarget;
  const row = e.target.closest('.profile-picker-row');
  const action = e.target.closest('.profile-picker-action');
  if (!row && !action) return;
  e.stopPropagation();
  menu.hidden = true;

  if (row) {
    const id = parseInt(row.dataset.profileId);
    if (id === state.activeProfileId) return;
    switchProfile(id, row.querySelector('.profile-picker-row-name').textContent);
  } else if (action.id === 'profilePickerNew') {
    setView('settings');
    renderAll();
    setTimeout(() => document.getElementById('profilesCreateBtn')?.click(), 120);
  } else if (action.id === 'profilePickerManage') {
    setView('settings');
    renderAll();
    setTimeout(() => document.getElementById('profilesSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }
}

export async function switchProfile(id, name = `#${id}`) {
  showToast(`Switching to ${name}…`, 'info', 1500);
  const res = await activateProfileById(id);
  if (!res) {
    showToast('Failed to switch profile', 'error');
    return;
  }
  await syncFromApi();
  renderAll({ keepUi: false });
  showToast(`Switched to ${name}`, 'success');
}

// ── Demo mode banner ─────────────────────────

function demoRepoUrl() {
  // <user>.github.io/<repo>/ → github.com/<user>/<repo>, so forks link to themselves.
  const user = location.hostname.endsWith('.github.io') ? location.hostname.split('.')[0] : '';
  const repo = location.pathname.split('/').filter(Boolean)[0] || '';
  return user && repo ? `https://github.com/${encodeURIComponent(user)}/${encodeURIComponent(repo)}` : '';
}

export function initDemoBanner() {
  if (!DEMO_MODE) return;
  const banner = document.createElement('div');
  banner.className = 'demo-banner';
  banner.setAttribute('role', 'note');
  const tag = document.createElement('span');
  tag.className = 'demo-banner-tag';
  tag.textContent = 'DEMO';
  const text = document.createElement('span');
  text.textContent = 'Progress is saved in this browser only.';
  banner.append(tag, text);
  const repo = demoRepoUrl();
  if (repo) {
    const link = document.createElement('a');
    link.href = repo;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Get the full version →';
    banner.append(link);
  }
  document.getElementById('main')?.prepend(banner);

  const logoTitle = document.querySelector('.logo-title');
  if (logoTitle) {
    const pill = document.createElement('span');
    pill.className = 'logo-demo-tag';
    pill.textContent = 'DEMO';
    logoTitle.append(pill);
  }
  document.title = `DEMO · ${document.title}`;
}

// ── Sidebar ───────────────────────────────

// Position the sliding active indicator in the sidebar nav (FLIP across rebuilds).
function positionNavSlider() {
  const nav = document.getElementById('sidebarNav');
  if (!nav) return;
  const active = nav.querySelector('.nav-item.active');
  let slider = nav._slider;
  if (!slider || !nav.contains(slider)) {
    slider = document.createElement('div');
    slider.className = 'nav-slider';
    nav.appendChild(slider);
    nav._slider = slider;
  }
  if (!active) { slider.classList.remove('visible'); return; }
  const top = active.offsetTop;
  const height = active.offsetHeight;
  const prev = nav._sliderPos;
  if (prev && !prefersReducedMotion()) {
    slider.style.transition = 'none';
    slider.style.top = `${prev.top}px`;
    slider.style.height = `${prev.height}px`;
    void slider.offsetWidth;
    slider.style.transition = '';
  }
  slider.style.top = `${top}px`;
  slider.style.height = `${height}px`;
  slider.classList.add('visible');
  nav._sliderPos = { top, height };
}

function navStatusIconHtml(isComplete, isCurrent, hasProgress) {
  if (isComplete) return '<span class="nav-status nav-status-done"><i data-lucide="check-circle-2"></i></span>';
  if (isCurrent) return '<span class="nav-status nav-status-active"><i data-lucide="play-circle"></i></span>';
  if (hasProgress) return '<span class="nav-status nav-status-partial"><i data-lucide="clock"></i></span>';
  return '';
}

export function renderSidebar() {
  const nav = document.getElementById('sidebarNav');
  const currentMonthId = getCurrentMonthId();

  let html = `
    <div class="nav-section-label">Navigation</div>
    <div class="nav-item ${state.currentView === 'overview' ? 'active' : ''}" data-view="overview">
      <div class="nav-badge"><i data-lucide="layout-dashboard"></i></div>
      <div class="nav-info">
        <div class="nav-label">Overview</div>
      </div>
    </div>
    <div class="nav-item ${state.currentView === 'search' ? 'active' : ''}" data-view="search">
      <div class="nav-badge"><i data-lucide="search"></i></div>
      <div class="nav-info">
        <div class="nav-label">Search</div>
      </div>
    </div>

    <div class="nav-divider"></div>
    <div class="nav-section-label">Months</div>
  `;

  activeMonths().forEach(m => {
    const prog = getMonthBlendedProgress(m.id);
    const dayProg = getDayProgress(m.id);
    const pct = prog.percent;
    const isComplete = prog.percent === 100;
    const isActive = state.currentView === m.id;
    const isCurrent = m.id === currentMonthId;
    const isPast = m.id < currentMonthId;
    const isFuture = m.id > currentMonthId && currentMonthId >= 0;
    const hasProgress = pct > 0 || dayProg.percent > 0;
    const dr = getMonthDateRange(m.id);
    const badgeText = dr ? dr.shortMonth : m.num;

    let statusClass = '';
    if (isComplete) statusClass = 'completed';
    else if (isCurrent) statusClass = 'current-month';
    else if (isPast && !isComplete) statusClass = 'past-incomplete';
    else if (isFuture) statusClass = 'future-month';

    const title = m.title.split('+')[0].trim();

    html += `
      <div class="nav-item ${isActive ? 'active' : ''} ${statusClass}" data-view="${m.id}" title="${m.title}">
        <div class="nav-badge">${badgeText}</div>
        <div class="nav-info">
          <div class="nav-label-row">
            <div class="nav-label">${title}</div>
            ${pct > 0 ? `<span class="nav-pct">${pct}%</span>` : ''}
          </div>
          ${pct > 0 ? `<div class="nav-progress-mini"><div class="nav-progress-mini-fill" style="width: ${pct}%"></div></div>` : ''}
        </div>
        ${navStatusIconHtml(isComplete, isCurrent, hasProgress)}
      </div>
    `;
  });

  html += `
    <div class="nav-divider"></div>
    <div class="nav-section-label">More</div>
    <div class="nav-item ${state.currentView === 'tips' ? 'active' : ''}" data-view="tips">
      <div class="nav-badge"><i data-lucide="lightbulb"></i></div>
      <div class="nav-info">
        <div class="nav-label">Study Tips</div>
      </div>
    </div>
    <div class="nav-item ${state.currentView === 'settings' ? 'active' : ''}" data-view="settings">
      <div class="nav-badge"><i data-lucide="settings"></i></div>
      <div class="nav-info">
        <div class="nav-label">Settings</div>
      </div>
    </div>
  `;

  nav.innerHTML = html;
  positionNavSlider();
}

/**
 * Targeted sidebar update — only patches progress/status for one month.
 * Avoids rebuilding the entire sidebar DOM on every checkbox click.
 */
export function updateSidebarProgress(monthId) {
  const nav = document.getElementById('sidebarNav');
  const navItem = nav?.querySelector(`.nav-item[data-view="${monthId}"]`);
  if (!navItem) return;

  const prog = getMonthBlendedProgress(monthId);
  const dayProg = getDayProgress(monthId);
  const pct = prog.percent;
  const currentMonthId = getCurrentMonthId();
  const isComplete = pct === 100;
  const isCurrent = monthId === currentMonthId;
  const isPast = monthId < currentMonthId;
  const hasProgress = pct > 0 || dayProg.percent > 0;

  navItem.classList.remove('completed', 'current-month', 'past-incomplete', 'future-month');
  if (isComplete) navItem.classList.add('completed');
  else if (isCurrent) navItem.classList.add('current-month');
  else if (isPast && !isComplete) navItem.classList.add('past-incomplete');
  else if (monthId > currentMonthId) navItem.classList.add('future-month');

  let pctEl = navItem.querySelector('.nav-pct');
  if (pct > 0) {
    if (pctEl) { pctEl.textContent = `${pct}%`; }
    else {
      const labelRow = navItem.querySelector('.nav-label-row');
      if (labelRow) labelRow.insertAdjacentHTML('beforeend', `<span class="nav-pct">${pct}%</span>`);
    }
  } else if (pctEl) {
    pctEl.remove();
  }

  let barWrap = navItem.querySelector('.nav-progress-mini');
  if (pct > 0) {
    if (barWrap) {
      barWrap.querySelector('.nav-progress-mini-fill').style.width = `${pct}%`;
    } else {
      const infoEl = navItem.querySelector('.nav-info');
      if (infoEl) infoEl.insertAdjacentHTML('beforeend', `<div class="nav-progress-mini"><div class="nav-progress-mini-fill" style="width: ${pct}%"></div></div>`);
    }
  } else if (barWrap) {
    barWrap.remove();
  }

  navItem.querySelector('.nav-status')?.remove();
  const statusHtml = navStatusIconHtml(isComplete, isCurrent, hasProgress);
  if (statusHtml) navItem.insertAdjacentHTML('beforeend', statusHtml);

  refreshIcons(navItem);
}

export function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
}

export function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// ── Overall progress ring ─────────────────

export function renderOverallProgress() {
  const p = getOverallProgress();
  const percentEl = document.getElementById('overallPercent');
  animateCount(percentEl, p.percent);
  percentEl.classList.remove('count-pulse');
  void percentEl.offsetWidth;
  percentEl.classList.add('count-pulse');
  document.getElementById('overallFill').style.width = `${p.percent}%`;
  document.getElementById('overallDetail').textContent = `${p.done} / ${p.total} tasks completed`;
  const ring = document.getElementById('overallRing');
  if (ring) {
    const circumference = 2 * Math.PI * 34;
    ring.style.strokeDashoffset = circumference - (p.percent / 100) * circumference;
  }
  refreshNeonCity();
}

export function applyProgressRingGlow() {
  document.querySelectorAll('.progress-ring-fill').forEach(ring => {
    const offset = ring.style.strokeDashoffset || ring.getAttribute('stroke-dashoffset');
    if (offset !== null && offset !== '' && parseFloat(offset) === 0) {
      ring.classList.add('complete-glow');
    } else {
      ring.classList.remove('complete-glow');
    }
  });
}

// ── Topbar widgets ────────────────────────

export function renderStreakBadge() {
  const day = getJourneyDay();
  const el = document.getElementById('streakBadge');
  el.innerHTML = `<i data-lucide="flame" class="lucide-icon sm"></i> ${day > 0 ? `Day ${day}` : '0 days'}`;
  el.classList.remove('streak-hot');
  refreshIcons(el);
}

export function renderTopbarQuote() {
  const el = document.getElementById('topbarQuote');
  if (!el) return;

  const q = getCurrentMotivationQuote();
  const hasNamedAuthor = typeof q.author === 'string' && q.author.trim().toLowerCase() !== 'anonymous';
  const quoteLine = hasNamedAuthor ? `"${q.quote}" - ${q.author}` : `"${q.quote}"`;
  const nextRefreshLabel = new Date(q.nextRefreshAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  el.textContent = quoteLine;
  const sourcePart = q.source ? ` (${q.source})` : '';
  el.title = `${quoteLine}${sourcePart}\nNext refresh: ${nextRefreshLabel}`;
}

export function renderProfilePicker() {
  const btn = document.getElementById('profilePickerBtn');
  const menu = document.getElementById('profilePickerMenu');
  const avatarEl = document.getElementById('profilePickerAvatar');
  const nameEl = document.getElementById('profilePickerName');
  if (!btn || !menu || !avatarEl || !nameEl) return;

  const profiles = state.profiles || [];
  const activeId = state.activeProfileId;

  if (!profiles.length) {
    // Backend hasn't reported profiles yet — hide picker until sync completes.
    btn.style.display = 'none';
    menu.hidden = true;
    return;
  }
  btn.style.display = '';

  const active = profiles.find(p => p.id === activeId) || profiles[0];
  avatarEl.textContent = initials(active.display_name);
  nameEl.textContent = active.display_name || 'Profile';

  const rows = profiles.map(p => {
    const isActive = p.id === activeId;
    const label = getVariantLabel(p.roadmap_variant);
    return `
      <button class="profile-picker-row ${isActive ? 'active' : ''}" data-profile-id="${p.id}" type="button">
        <span class="profile-picker-row-avatar">${initials(p.display_name)}</span>
        <span class="profile-picker-row-info">
          <span class="profile-picker-row-name">${escapeHtml(p.display_name)}</span>
          <span class="profile-picker-row-variant">${escapeHtml(label)}</span>
        </span>
        ${isActive ? '<i data-lucide="check" class="lucide-icon sm"></i>' : ''}
      </button>
    `;
  }).join('');

  menu.innerHTML = `
    <div class="profile-picker-header">Profiles (${profiles.length})</div>
    <div class="profile-picker-list">${rows}</div>
    <div class="profile-picker-divider"></div>
    <button class="profile-picker-action" id="profilePickerNew" type="button"><i data-lucide="plus" class="lucide-icon sm"></i> New Profile</button>
    <button class="profile-picker-action" id="profilePickerManage" type="button"><i data-lucide="settings" class="lucide-icon sm"></i> Manage Profiles</button>
  `;

  refreshIcons(menu);
}

export function applyProfilePrefs() {
  const profile = getProfile();
  document.body.classList.toggle('compact-mode', !!profile.compact_mode);
  const streakEl = document.getElementById('streakBadge');
  if (streakEl) streakEl.style.display = profile.show_streak ? '' : 'none';
  document.querySelectorAll('.meta-tag[class*="difficulty-"]').forEach(el => {
    el.style.display = profile.show_difficulty ? '' : 'none';
  });
}

export function updateDbStatusIcon() {
  const icon = document.getElementById('dbStatusIcon');
  if (!icon) return;
  if (DEMO_MODE) {
    icon.style.display = 'none';
    return;
  }
  if (state.apiAvailable) {
    icon.classList.remove('db-disconnected', 'db-checking');
    icon.classList.add('db-connected');
    icon.dataset.tooltip = 'Server online';
  } else {
    icon.classList.remove('db-connected', 'db-checking');
    icon.classList.add('db-disconnected');
    icon.dataset.tooltip = 'Server offline — changes saved locally';
  }
}

// ── Quick Capture ─────────────────────────

export function initQuickCapture() {
  const fab = document.getElementById('quickCaptureFab');
  const overlay = document.getElementById('quickCaptureOverlay');
  const closeBtn = document.getElementById('quickCaptureClose');
  const saveBtn = document.getElementById('quickCaptureSave');
  const input = document.getElementById('quickCaptureInput');
  const tag = document.getElementById('quickCaptureTag');

  if (!fab || !overlay) return;

  function openQuickCapture() {
    const monthId = getCurrentMonthId();
    const months = activeMonths();
    const m = months[monthId] || months[0];
    tag.textContent = `Auto-tagged: Month ${m.num} — ${m.title}`;
    input.value = '';
    overlay.classList.add('visible');
    setTimeout(() => input.focus(), 200);
  }

  function closeQuickCapture() {
    overlay.classList.remove('visible');
  }

  async function saveQuickCapture() {
    const text = input.value.trim();
    if (!text) return;

    const monthId = getCurrentMonthId();
    if (monthId < 0) {
      showToast('Set a start date in Settings first', 'warning');
      return;
    }

    const existing = getNotes(monthId);
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const captured = `\n\n---\n**Quick Note** (${timestamp}):\n${text}`;
    const updated = existing + captured;

    setNotes(monthId, updated);
    closeQuickCapture();
    showToast('Note captured!', 'success');
  }

  fab.addEventListener('click', openQuickCapture);
  closeBtn.addEventListener('click', closeQuickCapture);
  saveBtn.addEventListener('click', saveQuickCapture);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeQuickCapture();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuickCapture();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveQuickCapture();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      if (overlay.classList.contains('visible')) {
        closeQuickCapture();
      } else {
        openQuickCapture();
      }
    }
  });
}
