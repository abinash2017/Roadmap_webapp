/* ============================================
   RENDER — view router, renderAll, delegated #content events,
   and UI-state preservation for same-view re-renders.

   Each view (js/views/*.js) exports { title(view), render(view, { mount, preserve }), events }.
   `events` maps DOM event types to handlers; ONE listener per type is attached to #content
   at startup and forwards to the active view, so nothing is re-bound after a render.
   ============================================ */

import { state } from './state.js';
import { syncAnimeBackground } from './anime-bg.js';
import { prefersReducedMotion, refreshIcons, playNeonDecode } from './effects.js';
import {
  renderSidebar, renderOverallProgress, renderStreakBadge, renderTopbarQuote, renderProfilePicker,
  applyProfilePrefs, applyProgressRingGlow, closeSidebar
} from './shell.js';
import { overviewView } from './views/overview.js';
import { monthView } from './views/month.js';
import { tipsView } from './views/tips.js';
import { searchView } from './views/search.js';
import { settingsView } from './views/settings.js';

const NAMED_VIEW_IDS = ['overview', 'tips', 'search', 'settings'];
const CONTENT_EVENTS = ['click', 'dblclick', 'input', 'change', 'keydown', 'pointerover', 'dragstart', 'dragover', 'dragleave', 'drop', 'dragend'];

// ── Routing ───────────────────────────────

export function parseViewHash(hash) {
  const h = (hash || '').replace('#', '');
  if (NAMED_VIEW_IDS.includes(h)) return h;
  if (/^\d+$/.test(h) && parseInt(h) >= 0 && parseInt(h) <= 9) return parseInt(h);
  return null;
}

// Restore the view from the URL hash on module load.
{
  const initial = parseViewHash(location.hash);
  if (initial !== null) state.currentView = initial;
}

// Resolved lazily: the view modules import this module back (navigate/renderAll).
function viewFor(view) {
  if (typeof view === 'number') return monthView;
  return { overview: overviewView, tips: tipsView, search: searchView, settings: settingsView }[view] || overviewView;
}

export function setView(view) {
  state.currentView = view;
  location.hash = typeof view === 'number' ? String(view) : view;
}

export function navigate(view) {
  setView(view);
  renderAll();
  closeSidebar();
}

// ── Delegated #content events ─────────────

export function initContentEvents() {
  const content = document.getElementById('content');
  content.addEventListener('click', (e) => {
    const header = e.target.closest('.collapsible-header');
    if (header) header.closest('.collapsible')?.classList.toggle('collapsed');
  });
  CONTENT_EVENTS.forEach(type => {
    content.addEventListener(type, (e) => viewFor(state.currentView).events?.[type]?.(e));
  });
}

// ── Rendering ─────────────────────────────

let lastRenderedView = null;

/**
 * Re-render the shell and the current view.
 * Re-rendering the view that is already on screen (server sync, reconnect) keeps scroll position,
 * open weeks/sections, focus and unsaved input. Pass { keepUi: false } when the data underneath
 * changed identity (profile switch, reset).
 */
export function renderAll({ keepUi } = {}) {
  const preserve = keepUi ?? (lastRenderedView === state.currentView);
  lastRenderedView = state.currentView;

  renderSidebar();
  renderOverallProgress();
  renderStreakBadge();
  renderTopbarQuote();
  renderProfilePicker();
  renderContent({ preserve });
  applyProfilePrefs();
  syncAnimeBackground();
  refreshIcons();
  if (!preserve) window.scrollTo({ top: 0, behavior: 'smooth' });
  applyProgressRingGlow();
}

export function renderContent({ preserve = false } = {}) {
  const content = document.getElementById('content');
  const viewId = state.currentView;
  const view = viewFor(viewId);

  function doRender() {
    content.classList.remove('content-transition-exit');
    document.getElementById('topbarTitle').textContent = view.title(viewId);

    let snapshot = null;
    const mount = (html) => {
      if (preserve) snapshot = captureUiState(content);
      content.classList.toggle('ui-preserved', preserve);
      content.innerHTML = html;
      if (preserve) content.firstElementChild?.classList.remove('fade-in');
      refreshIcons(content);
    };
    const finish = () => {
      if (snapshot) restoreUiState(content, snapshot);
      applyProfilePrefs();
      if (!preserve) playNeonDecode(content);
    };
    const result = view.render(viewId, { mount, preserve });
    if (result instanceof Promise) result.then(finish);
    else finish();

    if (!preserve) {
      content.classList.remove('content-transition-enter');
      void content.offsetWidth;
      content.classList.add('content-transition-enter');
    }
  }

  if (preserve || state.firstRender) {
    state.firstRender = false;
    doRender();
  } else if (!prefersReducedMotion() && document.startViewTransition) {
    document.startViewTransition(() => doRender());
  } else {
    content.classList.remove('view-transition', 'content-transition-enter');
    content.classList.add('content-transition-exit');
    setTimeout(doRender, 120);
  }
}

// ── UI-state preservation ─────────────────

function fieldKey(el) {
  if (el.id) return `#${el.id}`;
  const data = Object.entries(el.dataset).map(([k, v]) => `${k}=${v}`).join('&');
  return data ? `${el.tagName}.${el.className}[${data}]` : null;
}

function captureUiState(root) {
  const fields = [];
  root.querySelectorAll('input, textarea').forEach(el => {
    if (el.type === 'checkbox' || el.type === 'radio') return;
    const key = fieldKey(el);
    if (key && el.value !== el.defaultValue) fields.push({ key, value: el.value, defaultValue: el.defaultValue });
  });

  let focus = null;
  const active = document.activeElement;
  if (active && active !== root && root.contains(active)) {
    const key = fieldKey(active);
    let start = null, end = null;
    try { start = active.selectionStart; end = active.selectionEnd; } catch { /* no text selection on this input type */ }
    if (key) focus = { key, start, end };
  }

  return {
    scrollY: window.scrollY,
    openWeeks: [...root.querySelectorAll('.week-accordion.open')].map(el => el.dataset.week),
    collapsed: Object.fromEntries(
      [...root.querySelectorAll('.collapsible[data-section]')].map(el => [el.dataset.section, el.classList.contains('collapsed')])
    ),
    fields,
    focus,
  };
}

function restoreUiState(root, snap) {
  root.querySelectorAll('.week-accordion[data-week]').forEach(el => {
    el.classList.toggle('open', snap.openWeeks.includes(el.dataset.week));
  });
  root.querySelectorAll('.collapsible[data-section]').forEach(el => {
    const collapsed = snap.collapsed[el.dataset.section];
    if (collapsed !== undefined) el.classList.toggle('collapsed', collapsed);
  });

  const byKey = new Map();
  root.querySelectorAll('input, textarea, select, button').forEach(el => {
    const key = fieldKey(el);
    if (key) byKey.set(key, el);
  });

  // Only restore typing over the same underlying value — if the data changed, the new data wins.
  snap.fields.forEach(f => {
    const el = byKey.get(f.key);
    if (!el || el.disabled || el.defaultValue !== f.defaultValue) return;
    el.value = f.value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  if (snap.focus) {
    const el = byKey.get(snap.focus.key);
    if (el) {
      el.focus({ preventScroll: true });
      if (snap.focus.start != null) {
        try { el.setSelectionRange(snap.focus.start, snap.focus.end); } catch { /* not a text input */ }
      }
    }
  }

  window.scrollTo(0, snap.scrollY);
}
