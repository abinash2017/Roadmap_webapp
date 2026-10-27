/* ============================================
   VIEW: Search (#search) — roadmap content + to-do search
   ============================================ */

import { state, api, escapeHtml } from '../state.js';
import { activeMonths, searchAllMonths, formatDateLabel } from '../api-ops.js';
import { navigate } from '../render.js';

let searchDebounce;

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function renderSearch(_view, { mount }) {
  let html = `<div class="fade-in tips-container">`;

  html += `
    <div class="card">
      <div class="card-title" style="margin-bottom:12px"><i data-lucide="search" class="lucide-icon"></i> Search Across All Months</div>
      <input type="text" class="search-input" id="searchInput"
        placeholder="Search topics, resources, goals, checklists..." autofocus />
      <div id="searchHint" style="margin-top:14px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        <div style="font-size:2rem; margin-bottom:8px; opacity:0.4;">⌨️</div>
        <div>Start typing to search across all 10 months</div>
        <div style="margin-top:6px; font-size:0.78rem; opacity:0.7;">
          Tip: Press <kbd style="background:var(--bg-input);padding:2px 6px;border-radius:4px;border:1px solid var(--border);font-family:var(--font-mono);font-size:0.75rem;">/</kbd> from anywhere to jump here
        </div>
      </div>
    </div>
    <div id="searchResults"></div>
  `;

  html += `
    <div class="card" style="margin-top:16px">
      <div class="card-title" style="margin-bottom:12px"><i data-lucide="clipboard-list" class="lucide-icon"></i> Search To-Do Tasks</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:end">
        <div style="flex:1;min-width:150px">
          <label style="font-size:0.78rem;color:var(--text-muted);display:block;margin-bottom:4px">Task text</label>
          <input type="text" class="search-input" id="todoSearchText" placeholder="Search task text..." style="margin-bottom:0" />
        </div>
        <div style="min-width:140px">
          <label style="font-size:0.78rem;color:var(--text-muted);display:block;margin-bottom:4px">From date</label>
          <input type="date" class="search-input" id="todoSearchFrom" style="margin-bottom:0" />
        </div>
        <div style="min-width:140px">
          <label style="font-size:0.78rem;color:var(--text-muted);display:block;margin-bottom:4px">To date</label>
          <input type="date" class="search-input" id="todoSearchTo" style="margin-bottom:0" />
        </div>
        <button class="btn btn-accent btn-sm" id="todoSearchBtn" style="height:36px">Search</button>
      </div>
      <div id="todoSearchResults" style="margin-top:12px"></div>
    </div>
  `;

  html += `</div>`;
  mount(html);
}

// ── Roadmap content search ────────────────

function runContentSearch(q) {
  const hint = document.getElementById('searchHint');
  const container = document.getElementById('searchResults');
  if (!container) return;
  if (!q.trim()) {
    if (hint) hint.style.display = '';
    container.innerHTML = '';
    return;
  }
  if (hint) hint.style.display = 'none';
  renderSearchResults(container, searchAllMonths(q), q);
}

function renderSearchResults(container, results, query) {
  if (!query || query.length < 2) {
    container.innerHTML = `<div class="card" style="text-align:center;color:var(--text-muted)">Type at least 2 characters to search...</div>`;
    return;
  }
  if (results.length === 0) {
    container.innerHTML = `<div class="card" style="text-align:center;color:var(--text-muted)">No results for "${escapeHtml(query)}"</div>`;
    return;
  }

  const typeIcons = { month: '📅', goal: '🎯', topic: '📝', checklist: '✅', resource: '📚' };
  const re = new RegExp(`(${escapeRegExp(query)})`, 'gi');

  let html = `<div class="card"><div class="card-title" style="margin-bottom:12px">${results.length} result${results.length !== 1 ? 's' : ''}</div>`;
  results.forEach(r => {
    const highlighted = escapeHtml(r.text).replace(re, '<mark>$1</mark>');
    html += `
      <div class="search-result-item" data-month="${r.monthId}">
        <span class="search-result-icon">${typeIcons[r.type] || '📌'}</span>
        <div class="search-result-content">
          <div class="search-result-text">${highlighted}</div>
          <div class="search-result-sub">${r.sub}</div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// ── To-do search ──────────────────────────

function runTodoSearch() {
  const text = document.getElementById('todoSearchText').value.trim();
  const from = document.getElementById('todoSearchFrom').value;
  const to = document.getElementById('todoSearchTo').value;
  searchTodos(text, from, to);
}

async function searchTodos(text, dateFrom, dateTo) {
  if (state.apiAvailable) {
    const params = new URLSearchParams();
    if (text) params.set('q', text);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    const results = await api(`/todos/search?${params.toString()}`);
    if (results && results.items && Array.isArray(results.items)) {
      renderTodoSearchResults(results.items, text);
      return;
    }
  }

  const results = [];
  const q = text.toLowerCase();
  Object.keys(state.cache).forEach(key => {
    const m = key.match(/^todo_(\d+)_(\d{4}-\d{2}-\d{2})$/);
    if (!m) return;
    const monthId = parseInt(m[1]);
    const dateStr = m[2];
    if (dateFrom && dateStr < dateFrom) return;
    if (dateTo && dateStr > dateTo) return;
    state.cache[key].forEach(item => {
      if (q && !item.text.toLowerCase().includes(q)) return;
      results.push({ month_id: monthId, todo_date: dateStr, text: item.text, done: item.done });
    });
  });
  results.sort((a, b) => b.todo_date.localeCompare(a.todo_date));
  renderTodoSearchResults(results, text);
}

function renderTodoSearchResults(results, query) {
  const container = document.getElementById('todoSearchResults');
  if (!container) return; // user left the Search view while the request was in flight

  if (results.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:12px 0;font-size:0.88rem">No to-do tasks found</div>`;
    return;
  }

  const grouped = {};
  results.forEach(r => {
    const key = `${r.todo_date}_${r.month_id}`;
    if (!grouped[key]) grouped[key] = { date: r.todo_date, monthId: r.month_id, items: [] };
    grouped[key].items.push(r);
  });

  const re = query ? new RegExp(`(${escapeRegExp(query)})`, 'gi') : null;
  let html = '';
  Object.keys(grouped).sort((a, b) => b.localeCompare(a)).forEach(key => {
    const { items, monthId, date } = grouped[key];
    const allDone = items.every(i => i.done);
    const statusIcon = allDone ? '<span style="color:var(--success)">✓</span>' : (items.some(i => i.done) ? '<span style="color:var(--warning)">◐</span>' : '');
    const mData = activeMonths()[monthId];
    const monthTitle = mData ? mData.title : `Month ${String(monthId + 1).padStart(2, '0')}`;

    html += `<div class="todo-search-group" data-month="${monthId}" style="margin-bottom:12px;cursor:pointer;border-radius:8px;padding:8px;transition:background 0.15s" onmouseenter="this.style.background='var(--bg-input)'" onmouseleave="this.style.background='transparent'">`;
    html += `<div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px">${statusIcon} ${formatDateLabel(date)} · <span style="color:var(--accent)">${monthTitle}</span></div>`;
    items.forEach(item => {
      const escapedText = escapeHtml(item.text);
      const textHtml = re ? escapedText.replace(re, '<mark>$1</mark>') : escapedText;
      html += `
        <div style="display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:6px;background:var(--bg-primary);margin-bottom:2px">
          <span style="width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;border:2px solid ${item.done ? 'var(--success)' : 'var(--border)'};background:${item.done ? 'var(--success)' : 'transparent'};color:${item.done ? '#fff' : 'transparent'};flex-shrink:0">✓</span>
          <span style="font-size:0.85rem;${item.done ? 'text-decoration:line-through;opacity:0.55' : ''}">${textHtml}</span>
        </div>
      `;
    });
    html += `</div>`;
  });

  container.innerHTML = `<div style="max-height:400px;overflow-y:auto">${html}</div>`;
}

// ── Delegated events ──────────────────────

export const searchView = {
  title: () => 'Search All Months',
  render: renderSearch,
  events: {
    input(e) {
      if (e.target.id !== 'searchInput') return;
      clearTimeout(searchDebounce);
      const q = e.target.value;
      searchDebounce = setTimeout(() => runContentSearch(q), 200);
    },
    click(e) {
      if (e.target.closest('#todoSearchBtn')) { runTodoSearch(); return; }
      const hit = e.target.closest('.search-result-item[data-month], .todo-search-group[data-month]');
      if (hit) navigate(parseInt(hit.dataset.month));
    },
    keydown(e) {
      if (e.key === 'Enter' && ['todoSearchText', 'todoSearchFrom', 'todoSearchTo'].includes(e.target.id)) runTodoSearch();
    }
  }
};
