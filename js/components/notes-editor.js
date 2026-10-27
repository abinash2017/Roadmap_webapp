/* ============================================
   NOTES EDITOR — month notes card (markdown editor, preview, history)
   Markup builder + delegated handlers (called from views/month.js).
   ============================================ */

import { state, api, renderMarkdown, escapeHtml } from '../state.js';
import { showToast } from '../toast.js';
import { activeMonths, getNotes, setNotes } from '../api-ops.js';
import { getCurrentMonthId } from '../progress.js';
import { refreshIcons } from '../effects.js';

const $ = (id) => document.getElementById(id);

export function notesCardHtml(monthId) {
  const notes = getNotes(monthId);
  const currentMonthId = getCurrentMonthId();
  const isPastMonth = currentMonthId >= 0 && monthId < currentMonthId;
  const hasExistingNote = notes && notes.trim().length > 0;
  const notesReadonly = isPastMonth && !hasExistingNote;

  return `
    <div class="card">
      <div class="card-header-with-icon" style="margin-bottom:10px">
        <div class="card-icon card-icon-notes"><i data-lucide="notebook-pen" class="lucide-icon"></i></div>
        <div class="card-title">Your Notes</div>
        <div style="flex:1"></div>
        <button class="btn btn-sm" id="notesHistoryBtn" title="View note history">
          <i data-lucide="history" class="lucide-icon sm"></i> History
        </button>
      </div>
      ${notesReadonly ? `
        <div class="notes-readonly-banner">
          <i data-lucide="lock" class="lucide-icon sm"></i> This is a past month — new notes cannot be added. You can view and edit existing notes in current/future months.
        </div>
      ` : `
      <div class="notes-editor-wrapper">
        <div class="notes-editor-toolbar" id="notesToolbar">
          <button class="toolbar-btn" data-action="bold" title="Bold (Ctrl+B)"><b>B</b></button>
          <button class="toolbar-btn" data-action="italic" title="Italic (Ctrl+I)"><i>I</i></button>
          <span class="toolbar-sep"></span>
          <button class="toolbar-btn" data-action="heading" title="Heading"># H</button>
          <button class="toolbar-btn" data-action="bullet" title="Bullet list">• List</button>
          <button class="toolbar-btn" data-action="codeblock" title="Code block">{ }</button>
          <span class="toolbar-sep"></span>
          <button class="toolbar-btn" data-action="link" title="Link">🔗</button>
          <span class="toolbar-sep"></span>
          <button class="toolbar-btn" data-action="preview" title="Toggle Preview" id="notesPreviewToggle">👁 Preview</button>
        </div>
        <textarea class="notes-textarea" id="notesTextarea" placeholder="Write your notes in Markdown..."${isPastMonth ? ' data-past="true"' : ''}>${escapeHtml(notes)}</textarea>
        <div class="notes-preview" id="notesPreview" style="display:none"></div>
        <div class="notes-editor-footer">
          <span class="notes-save-status" id="notesSaveStatus"></span>
          <button class="btn btn-sm btn-accent" id="notesSaveBtn" title="Save notes (Ctrl+S)">
            <i data-lucide="save" class="lucide-icon sm"></i> Save
          </button>
        </div>
      </div>
      `}
    </div>
  `;
}

function setStatus(text, cls, clearAfterMs = 0) {
  const el = $('notesSaveStatus');
  if (!el) return;
  el.textContent = text;
  el.className = `notes-save-status ${cls}`;
  if (clearAfterMs) setTimeout(() => { if (el.isConnected) el.textContent = ''; }, clearAfterMs);
}

function updatePreviewIfVisible(text) {
  const preview = $('notesPreview');
  if (preview && preview.style.display !== 'none') preview.innerHTML = renderMarkdown(text);
}

async function saveNotesNow(monthId) {
  const textarea = $('notesTextarea');
  if (!textarea) return;
  const md = textarea.value.trim();
  setStatus('Saving...', 'unsaved');
  const result = await setNotes(monthId, md);
  if (result && result.saved) {
    if (textarea.isConnected) textarea.value = '';
    setStatus('Saved ✓', 'saved', 2000);
    showToast('Note saved', 'success', 1500);
  } else if (!state.apiAvailable) {
    setStatus('Saved locally ✓', 'saved', 2000);
    showToast('Note saved locally', 'info', 1500);
  } else {
    setStatus('Save failed — saved locally', 'unsaved');
    showToast('Save to server failed — saved locally', 'error', 2500);
  }
}

function togglePreview() {
  const textarea = $('notesTextarea');
  const preview = $('notesPreview');
  const toggle = $('notesPreviewToggle');
  if (!textarea || !preview || !toggle) return;
  const showing = preview.style.display !== 'none';
  if (showing) {
    preview.style.display = 'none';
    textarea.style.display = '';
    toggle.classList.remove('active');
  } else {
    preview.innerHTML = renderMarkdown(textarea.value);
    preview.style.display = '';
    textarea.style.display = 'none';
    toggle.classList.add('active');
  }
}

// ── Markdown toolbar — inserts syntax into the textarea ──

function insertMarkdown(textarea, before, after, placeholder) {
  textarea.focus();
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end) || placeholder;
  textarea.value = textarea.value.substring(0, start) + before + selected + after + textarea.value.substring(end);
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + selected.length;
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertLinePrefix(textarea, prefix) {
  textarea.focus();
  const start = textarea.selectionStart;
  const val = textarea.value;
  const lineStart = val.lastIndexOf('\n', start - 1) + 1;
  const lineEnd = val.indexOf('\n', start);
  const line = val.substring(lineStart, lineEnd === -1 ? val.length : lineEnd);
  if (line.startsWith(prefix)) {
    textarea.value = val.substring(0, lineStart) + line.substring(prefix.length) + val.substring(lineEnd === -1 ? val.length : lineEnd);
    textarea.selectionStart = textarea.selectionEnd = start - prefix.length;
  } else {
    textarea.value = val.substring(0, lineStart) + prefix + val.substring(lineStart);
    textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
  }
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function runToolbarAction(action) {
  const textarea = $('notesTextarea');
  if (!textarea) return;
  switch (action) {
    case 'bold':
      insertMarkdown(textarea, '**', '**', 'bold text');
      break;
    case 'italic':
      insertMarkdown(textarea, '*', '*', 'italic text');
      break;
    case 'heading':
      insertLinePrefix(textarea, '## ');
      break;
    case 'bullet':
      insertLinePrefix(textarea, '- ');
      break;
    case 'codeblock': {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end) || 'code';
      const block = '\n```\n' + selected + '\n```\n';
      textarea.value = textarea.value.substring(0, start) + block + textarea.value.substring(end);
      textarea.selectionStart = start + 5;
      textarea.selectionEnd = start + 5 + selected.length;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      break;
    }
    case 'link': {
      const url = prompt('Enter URL:');
      if (url && /^https?:\/\//i.test(url)) {
        insertMarkdown(textarea, '[', `](${url})`, 'link text');
      } else if (url) {
        showToast('URL must start with http:// or https://', 'warning', 3000);
      }
      break;
    }
  }
}

// ── Delegated handlers (return true when the event was ours) ──

export function handleNotesClick(e, monthId) {
  const t = e.target;
  if (t.closest('#notesHistoryBtn')) { openNotesHistory(monthId); return true; }
  if (t.closest('#notesSaveBtn')) { saveNotesNow(monthId); return true; }
  if (t.closest('#notesPreviewToggle')) { togglePreview(); return true; }
  const btn = t.closest('.notes-editor-toolbar .toolbar-btn[data-action]');
  if (btn) { runToolbarAction(btn.dataset.action); return true; }
  return false;
}

export function handleNotesInput(e) {
  if (e.target.id !== 'notesTextarea') return false;
  setStatus('Unsaved changes', 'unsaved');
  updatePreviewIfVisible(e.target.value);
  return true;
}

export function handleNotesKeydown(e, monthId) {
  const textarea = e.target;
  if (textarea.id !== 'notesTextarea') return false;
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveNotesNow(monthId);
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 2;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return true;
}

// ── History modal (built on open, removed on close) ──

const emptyMsg = (text) => `<div style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:20px">${text}</div>`;

async function openNotesHistory(monthId) {
  $('notesHistoryOverlay')?.remove();
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="notes-history-overlay" id="notesHistoryOverlay" style="display:flex">
      <div class="notes-history-modal">
        <div class="notes-history-header">
          <h3><i data-lucide="history" class="lucide-icon"></i> Notes History — Month ${activeMonths()[monthId].num}</h3>
          <button class="close-btn" id="notesHistoryClose" aria-label="Close history">✕</button>
        </div>
        <div class="notes-history-list" id="notesHistoryList">${emptyMsg('Loading history...')}</div>
      </div>
    </div>
  `;
  const overlay = wrap.firstElementChild;
  document.body.appendChild(overlay);
  refreshIcons(overlay);

  const close = () => overlay.remove();
  let history = [];

  overlay.addEventListener('click', async (e) => {
    if (e.target === overlay || e.target.closest('#notesHistoryClose')) { close(); return; }

    const btn = e.target.closest('[data-restore], [data-view-rev], [data-delete]');
    if (!btn) return;
    const entry = history[parseInt(btn.dataset.restore ?? btn.dataset.viewRev ?? btn.dataset.delete)];
    if (!entry) return;

    if ('restore' in btn.dataset) {
      if (!confirm('Restore this version? Current unsaved changes will be lost.')) return;
      const textarea = $('notesTextarea');
      if (textarea) {
        textarea.value = entry.content || '';
        setStatus('Restored — click Save to keep', 'unsaved');
        updatePreviewIfVisible(entry.content);
      }
      close();
      showToast('Note restored from history', 'info');
    } else if ('viewRev' in btn.dataset) {
      const win = window.open('', '_blank', 'width=600,height=500');
      win.document.write(`<html><head><title>Note History</title><style>body{font-family:sans-serif;padding:20px;background:#1e1e1e;color:#d4d4d4;}pre{white-space:pre-wrap;word-wrap:break-word;}</style></head><body><h3>Note revision</h3><pre>${escapeHtml(entry.content)}</pre></body></html>`);
    } else {
      if (!confirm('Delete this history entry?')) return;
      if (state.apiAvailable) await api(`/notes/${monthId}/history/${entry.id}`, { method: 'DELETE' });
      btn.closest('.notes-history-item')?.remove();
      showToast('History entry deleted', 'info', 1500);
    }
  });

  if (state.apiAvailable) {
    const data = await api(`/notes/${monthId}/history?limit=30`, {}, 8000);
    if (data) history = data;
  }

  const listEl = overlay.querySelector('#notesHistoryList');
  if (history.length === 0) {
    listEl.innerHTML = emptyMsg('No saved revisions yet. Save a note to start tracking history.');
    return;
  }
  listEl.innerHTML = history.map((h, idx) => {
    const date = h.saved_at ? new Date(h.saved_at) : null;
    const dateStr = date ? date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown date';
    const preview = h.content.length > 120 ? h.content.substring(0, 120) + '...' : h.content;
    return `
      <div class="notes-history-item" data-idx="${idx}">
        <div class="notes-history-item-header">
          <span class="notes-history-date">${dateStr}</span>
          <span class="notes-history-size">${h.content.length} chars</span>
        </div>
        <div class="notes-history-preview">${escapeHtml(preview)}</div>
        <div class="notes-history-actions">
          <button class="btn btn-sm btn-accent" data-restore="${idx}" title="Restore this version">
            <i data-lucide="undo-2" class="lucide-icon sm"></i> Restore
          </button>
          <button class="btn btn-sm" data-view-rev="${idx}" title="View full content">
            <i data-lucide="eye" class="lucide-icon sm"></i> View
          </button>
          <button class="btn btn-sm btn-danger" data-delete="${idx}" title="Delete this revision">
            <i data-lucide="trash-2" class="lucide-icon sm"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
  refreshIcons(listEl);
}
