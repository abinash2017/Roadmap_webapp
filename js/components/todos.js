/* ============================================
   TODOS — month side column: daily to-do list + calendar
   Markup builders + delegated handlers (called from views/month.js).
   ============================================ */

import { escapeHtml } from '../state.js';
import { showToast } from '../toast.js';
import {
  getTodoItems, addTodoItem, toggleTodoItem, updateTodoItem, removeTodoItem, reorderTodoItem,
  getTodoDateStatus, todayStr, formatDateLabel
} from '../api-ops.js';
import { celebrate, refreshIcons } from '../effects.js';

// Kept outside the DOM so a same-view re-render can restore the selected day / calendar page.
const ui = { monthId: null, date: null, editingIdx: -1, cal: null, dragIdx: null };

export function todoCardHtml() {
  return `
    <div class="card side-card">
      <div class="card-header">
        <div>
          <div class="card-title"><i data-lucide="clipboard-list" class="lucide-icon"></i> Daily To-Do</div>
          <div class="todo-date-label"></div>
        </div>
        <span class="badge badge-accent" id="todoCount"></span>
      </div>
      <div class="todo-list" id="todoList"></div>
      <div class="todo-add-row">
        <input type="text" class="todo-add-input" id="todoInput" placeholder="Add a task..." />
        <button class="btn btn-accent btn-sm" id="todoAddBtn">+ Add</button>
      </div>
    </div>
  `;
}

export function calendarCardHtml(dateRange) {
  return dateRange ? '<div class="card side-card" id="calContainer"></div>' : '';
}

export function initTodos(monthId, dateRange, { preserve = false } = {}) {
  const keep = preserve && ui.monthId === monthId;
  if (!keep) {
    ui.date = todayStr();
    ui.editingIdx = -1;
  }
  ui.monthId = monthId;
  ui.cal = dateRange ? buildCalendarState(dateRange, keep ? ui.cal?.currentIdx : null) : null;
  refreshTodos();
  renderCalendar();
}

// After a background to-do sync — only if that month is still on screen.
export function refreshTodosFor(monthId) {
  if (ui.monthId === monthId && document.getElementById('todoList')) refreshTodos();
}

function buildCalendarState(dateRange, keepIdx) {
  const today = new Date();
  const startCM = new Date(dateRange.start.getFullYear(), dateRange.start.getMonth(), 1);
  const endCM = new Date(dateRange.end.getFullYear(), dateRange.end.getMonth(), 1);
  const calMonths = [];
  const cm = new Date(startCM);
  while (cm <= endCM) {
    calMonths.push(new Date(cm));
    cm.setMonth(cm.getMonth() + 1);
  }

  // Show the current real month if it's within range, else the start.
  let currentIdx = 0;
  if (keepIdx != null && keepIdx < calMonths.length) {
    currentIdx = keepIdx;
  } else {
    const todayCM = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const found = calMonths.findIndex(d => d.getTime() === todayCM);
    if (found >= 0) currentIdx = found;
  }
  return { dateRange, calMonths, currentIdx };
}

function isTodoDateEditable(dateStr) {
  return dateStr >= todayStr();
}

function getTodoCalendarCellState(dateStr) {
  const status = getTodoDateStatus(ui.monthId, dateStr);
  if (status === 'done') return { className: 'cal-done', marker: '<span class="cal-marker">✓</span>' };
  if (status === 'late-complete') return { className: 'cal-late-complete', marker: '<span class="cal-marker">✓</span>' };
  if (status === 'missed') return { className: 'cal-missed', marker: '<span class="cal-marker">✗</span>' };
  if (status === 'empty-past') return { className: 'cal-empty-past', marker: '<span class="cal-marker">✗</span>' };

  const dayDate = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const todayD = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (dayDate.getTime() === todayD.getTime()) return { className: 'cal-today', marker: '' };
  if (dayDate < todayD) return { className: 'cal-past', marker: '' };
  return { className: '', marker: '' };
}

// ── Rendering ─────────────────────────────

function refreshTodos() {
  const monthId = ui.monthId;
  const items = getTodoItems(monthId, ui.date);
  const listEl = document.getElementById('todoList');
  const countEl = document.getElementById('todoCount');
  if (!listEl) return;
  const canEdit = isTodoDateEditable(ui.date);
  if (ui.editingIdx >= items.length) ui.editingIdx = -1;
  const editing = canEdit ? ui.editingIdx : -1;

  if (countEl) countEl.textContent = `${items.filter(t => t.done).length}/${items.length}`;

  const dateLabelEl = document.querySelector('.todo-date-label');
  if (dateLabelEl) dateLabelEl.textContent = formatDateLabel(ui.date);

  // Update calendar selection and statuses
  const calContainer = document.getElementById('calContainer');
  if (calContainer) {
    calContainer.querySelectorAll('.cal-cell[data-date]').forEach(cell => {
      const date = cell.dataset.date;
      cell.classList.remove('cal-selected', 'cal-done', 'cal-missed', 'cal-empty-past', 'cal-late-complete', 'cal-past', 'cal-today');
      cell.querySelector('.cal-marker')?.remove();
      if (date === ui.date) cell.classList.add('cal-selected');
      const cellState = getTodoCalendarCellState(date);
      if (cellState.className) {
        cell.classList.add(cellState.className);
        if (cellState.marker) cell.insertAdjacentHTML('beforeend', cellState.marker);
      }
    });
  }

  const addRow = document.querySelector('.todo-add-row');
  const input = document.getElementById('todoInput');
  const addBtn = document.getElementById('todoAddBtn');
  if (addRow) addRow.classList.toggle('todo-add-row-locked', !canEdit);
  if (input) {
    input.disabled = !canEdit;
    input.placeholder = canEdit ? 'Add a task...' : 'Past day locked - tick only';
  }
  if (addBtn) {
    addBtn.disabled = !canEdit;
    if (canEdit) addBtn.removeAttribute('title');
    else addBtn.setAttribute('title', 'Past days are tick-only');
  }

  const draggable = canEdit && editing < 0;
  listEl.innerHTML = items.map((item, i) => {
    const isEditingThis = i === editing;
    return `
      <div class="todo-item ${item.done ? 'done' : ''} ${canEdit ? '' : 'todo-item-locked'}" data-idx="${i}" ${draggable ? 'draggable="true"' : ''}>
        ${draggable ? '<span class="todo-drag-handle" title="Drag to reorder"><i data-lucide="grip-vertical"></i></span>' : ''}
        <span class="todo-check">${item.done ? '✓' : ''}</span>
        ${isEditingThis ? `
          <div class="todo-inline-edit">
            <input type="text" class="todo-inline-input" data-idx="${i}" value="${escapeHtml(item.text)}" maxlength="280" />
            <button class="todo-inline-btn todo-inline-save" data-idx="${i}" title="Save">Save</button>
            <button class="todo-inline-btn todo-inline-cancel" data-idx="${i}" title="Cancel">Cancel</button>
          </div>
        ` : `<span class="todo-text">${escapeHtml(item.text)}</span>`}
        ${canEdit && !isEditingThis ? `<button class="todo-edit" data-idx="${i}" title="Edit" aria-label="Edit task"><i data-lucide="pencil"></i></button>` : ''}
        ${canEdit && !isEditingThis ? `<button class="todo-delete" data-idx="${i}" title="Remove" aria-label="Delete task"><i data-lucide="trash-2"></i></button>` : ''}
      </div>
    `;
  }).join('') || '<div class="todo-empty">No tasks yet — add your daily goals below!</div>';

  refreshIcons(listEl);

  if (editing >= 0) {
    const activeInput = listEl.querySelector(`.todo-inline-input[data-idx="${editing}"]`);
    if (activeInput) {
      activeInput.focus();
      activeInput.select();
    }
  }
}

function renderCalendar() {
  const cs = ui.cal;
  const container = document.getElementById('calContainer');
  if (!cs || !container) return;

  const cm = cs.calMonths[cs.currentIdx];
  const year = cm.getFullYear();
  const month = cm.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInCalMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cm.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const hasPrev = cs.currentIdx > 0;
  const hasNext = cs.currentIdx < cs.calMonths.length - 1;

  let h = `
    <div class="card-header">
      <button class="cal-nav-btn ${hasPrev ? '' : 'cal-nav-disabled'}" id="calPrev" aria-label="Previous month">‹</button>
      <div class="card-title cal-title">📅 ${monthLabel}</div>
      <button class="cal-nav-btn ${hasNext ? '' : 'cal-nav-disabled'}" id="calNext" aria-label="Next month">›</button>
    </div>
    <div class="cal-grid">
      <div class="cal-head">S</div><div class="cal-head">M</div><div class="cal-head">T</div>
      <div class="cal-head">W</div><div class="cal-head">T</div><div class="cal-head">F</div><div class="cal-head">S</div>
  `;

  for (let i = 0; i < firstDow; i++) h += `<div class="cal-cell cal-empty"></div>`;

  for (let d = 1; d <= daysInCalMonth; d++) {
    const dayDate = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const inRange = dayDate >= cs.dateRange.start && dayDate <= cs.dateRange.end;
    const cellState = inRange ? getTodoCalendarCellState(dateStr) : { className: '', marker: '' };

    let cls = 'cal-cell';
    let marker = '';
    if (!inRange) {
      cls += ' cal-outside';
    } else if (cellState.className) {
      cls += ` ${cellState.className}`;
      marker = cellState.marker;
    }
    if (dateStr === ui.date && inRange) cls += ' cal-selected';

    h += `<div class="${cls}" ${inRange ? `data-date="${dateStr}"` : ''}>${d}${marker}</div>`;
  }

  h += `</div>`;
  container.innerHTML = h;
}

// ── Actions ───────────────────────────────

function addTodo() {
  const input = document.getElementById('todoInput');
  if (!input) return;
  if (!isTodoDateEditable(ui.date)) {
    showToast('Past days are locked. You can only tick tasks.', 'warning', 2000);
    return;
  }
  const text = input.value.trim();
  if (!text) return;
  ui.editingIdx = -1;
  addTodoItem(ui.monthId, ui.date, text);
  input.value = '';
  refreshTodos();
  input.focus();
  showToast('Task added', 'success');
}

function commitEdit(idx, rawValue) {
  const currentText = getTodoItems(ui.monthId, ui.date)[idx]?.text || '';
  const nextText = (rawValue || '').trim();
  if (!nextText) {
    showToast('Task cannot be empty', 'warning', 1800);
    return;
  }
  ui.editingIdx = -1;
  if (nextText === currentText) {
    refreshTodos();
    return;
  }
  const ok = updateTodoItem(ui.monthId, ui.date, idx, nextText);
  refreshTodos();
  if (ok) showToast('Task updated', 'success', 1400);
  else showToast('Unable to update task', 'warning', 1800);
}

function cancelEdit() {
  ui.editingIdx = -1;
  refreshTodos();
}

// ── Delegated handlers (return true when the event was ours) ──

export function handleTodoClick(e) {
  const t = e.target;

  if (t.closest('#todoAddBtn')) { addTodo(); return true; }

  if (t.closest('#calPrev')) {
    if (ui.cal && ui.cal.currentIdx > 0) { ui.cal.currentIdx--; renderCalendar(); }
    return true;
  }
  if (t.closest('#calNext')) {
    if (ui.cal && ui.cal.currentIdx < ui.cal.calMonths.length - 1) { ui.cal.currentIdx++; renderCalendar(); }
    return true;
  }
  const cell = t.closest('#calContainer .cal-cell[data-date]');
  if (cell) {
    ui.date = cell.dataset.date;
    ui.editingIdx = -1;
    refreshTodos();
    return true;
  }

  if (!t.closest('#todoList')) return false;
  const canEdit = isTodoDateEditable(ui.date);

  const editBtn = t.closest('.todo-edit');
  if (editBtn) {
    if (canEdit) { ui.editingIdx = parseInt(editBtn.dataset.idx); refreshTodos(); }
    return true;
  }
  const saveBtn = t.closest('.todo-inline-save');
  if (saveBtn) {
    const idx = parseInt(saveBtn.dataset.idx);
    commitEdit(idx, document.querySelector(`#todoList .todo-inline-input[data-idx="${idx}"]`)?.value || '');
    return true;
  }
  if (t.closest('.todo-inline-cancel')) { cancelEdit(); return true; }
  const delBtn = t.closest('.todo-delete');
  if (delBtn) {
    if (canEdit) {
      ui.editingIdx = -1;
      removeTodoItem(ui.monthId, ui.date, parseInt(delBtn.dataset.idx));
      refreshTodos();
    }
    return true;
  }

  const item = t.closest('.todo-item');
  if (!item || t.closest('.todo-drag-handle, .todo-inline-edit') || ui.editingIdx >= 0) return true;
  toggleTodoItem(ui.monthId, ui.date, parseInt(item.dataset.idx));
  refreshTodos();
  const updated = getTodoItems(ui.monthId, ui.date);
  if (updated.length > 0 && updated.every(x => x.done)) {
    celebrate('All Tasks Done!', 'Daily to-dos complete');
  }
  return true;
}

export function handleTodoKeydown(e) {
  const t = e.target;
  if (t.id === 'todoInput') {
    if (e.key === 'Enter') addTodo();
    return true;
  }
  if (t.classList?.contains('todo-inline-input')) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit(parseInt(t.dataset.idx), t.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
    return true;
  }
  return false;
}

export function handleTodoDrag(e) {
  const listEl = document.getElementById('todoList');
  const el = e.target instanceof Element ? e.target.closest('.todo-item[draggable]') : null;
  if (!listEl || !el || !listEl.contains(el)) return;
  const clearOver = () => listEl.querySelectorAll('.todo-item').forEach(item => item.classList.remove('drag-over'));

  switch (e.type) {
    case 'dragstart':
      ui.dragIdx = parseInt(el.dataset.idx);
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', ui.dragIdx);
      break;
    case 'dragend':
      el.classList.remove('dragging');
      clearOver();
      break;
    case 'dragover':
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      clearOver();
      el.classList.add('drag-over');
      break;
    case 'dragleave':
      el.classList.remove('drag-over');
      break;
    case 'drop': {
      e.preventDefault();
      const toIdx = parseInt(el.dataset.idx);
      if (ui.dragIdx !== null && ui.dragIdx !== toIdx && isTodoDateEditable(ui.date)) {
        reorderTodoItem(ui.monthId, ui.date, ui.dragIdx, toIdx);
        refreshTodos();
        showToast('Task reordered', 'info');
      }
      clearOver();
      ui.dragIdx = null;
      break;
    }
  }
}
