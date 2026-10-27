/* ============================================
   LINK EDITOR — resource rows & repo chips in the month view
   Click = open link · double-click = edit URL. Patches the clicked item in place.
   ============================================ */

import { escapeHtml } from '../state.js';
import { showToast } from '../toast.js';
import { setResourceLink, setRepoLink } from '../api-ops.js';
import { refreshIcons } from '../effects.js';

const LINKABLE = '.resource-row.linkable, .repo-chip.linkable';
let clickTimer = null;

const linkType = (el) => (el.classList.contains('repo-chip') ? 'repo' : 'resource');

// ── Delegated handlers (return true when the event was ours) ──

export function handleLinkableClick(e) {
  const el = e.target.closest(LINKABLE);
  if (!el) return false;
  if (el.querySelector('.link-edit-popup')) return true;

  if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; return true; }

  clickTimer = setTimeout(() => {
    clickTimer = null;
    const link = el.dataset.link;
    if (link && /^https?:\/\//i.test(link)) {
      window.open(link, '_blank', 'noopener');
    } else if (link) {
      showToast('Invalid URL — must start with http:// or https://', 'warning');
    } else {
      openLinkEditor(el);
    }
  }, 280);
  return true;
}

export function handleLinkableDblclick(e) {
  const el = e.target.closest(LINKABLE);
  if (!el) return false;
  e.preventDefault();
  if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
  openLinkEditor(el);
  return true;
}

// ── Editor popup ──────────────────────────

function openLinkEditor(el) {
  if (el.querySelector('.link-edit-popup')) return;

  const type = linkType(el);
  const monthId = parseInt(el.dataset.month);
  const idx = parseInt(el.dataset.idx);
  const currentLink = el.dataset.link || '';

  const popup = document.createElement('div');
  popup.className = 'link-edit-popup';
  popup.innerHTML = `
    <input type="url" class="link-edit-input" placeholder="Paste URL here..." value="${escapeHtml(currentLink)}" />
    <div class="link-edit-actions">
      <button class="link-edit-btn save" title="Save"><i data-lucide="check" class="lucide-icon sm"></i></button>
      <button class="link-edit-btn cancel" title="Cancel"><i data-lucide="x" class="lucide-icon sm"></i></button>
      ${currentLink ? '<button class="link-edit-btn remove" title="Remove link"><i data-lucide="trash-2" class="lucide-icon sm"></i></button>' : ''}
    </div>
  `;

  el.classList.add('editing');
  el.appendChild(popup);
  refreshIcons(popup);

  const input = popup.querySelector('.link-edit-input');
  input.focus();
  input.select();

  // Keep popup clicks away from the row's open/edit handlers.
  popup.addEventListener('click', e => e.stopPropagation());
  popup.addEventListener('dblclick', e => e.stopPropagation());

  function closePopup() {
    el.classList.remove('editing');
    if (popup.parentNode) popup.remove();
  }

  function commit(url) {
    if (type === 'resource') setResourceLink(monthId, idx, url);
    else setRepoLink(monthId, idx, url);
    closePopup();
    patchLinkable(el, type, url);
  }

  function saveLink() {
    const url = input.value.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      showToast('URL must start with http:// or https://', 'warning');
      return;
    }
    commit(url);
    if (url) showToast('Link saved', 'success');
  }

  function removeLink() {
    commit('');
    showToast('Link removed', 'info');
  }

  popup.querySelector('.save').addEventListener('click', saveLink);
  popup.querySelector('.cancel').addEventListener('click', closePopup);
  popup.querySelector('.remove')?.addEventListener('click', removeLink);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveLink();
    if (e.key === 'Escape') closePopup();
  });

  setTimeout(() => {
    function outsideClick(e) {
      if (!popup.contains(e.target)) {
        closePopup();
        document.removeEventListener('click', outsideClick);
      }
    }
    document.addEventListener('click', outsideClick);
  }, 10);
}

// Update just this row/chip to reflect the new link (no month re-render).
function patchLinkable(el, type, url) {
  const hasLink = url.length > 0;
  el.dataset.link = url;
  el.classList.toggle('has-link', hasLink);

  if (type === 'resource') {
    el.title = hasLink ? 'Click to open · Double-click to edit link' : 'Double-click to add a link';
    el.querySelector('.link-indicator, .link-add-hint')?.remove();
    el.querySelector('.resource-name')?.insertAdjacentHTML('afterend', hasLink
      ? '<i data-lucide="external-link" class="link-indicator lucide-icon sm"></i>'
      : '<i data-lucide="plus-circle" class="link-add-hint lucide-icon sm"></i>');
  } else {
    el.title = hasLink ? 'Click to open · Double-click to edit' : 'Double-click to add link';
    el.querySelector('svg, i[data-lucide]')?.remove();
    if (hasLink) el.insertAdjacentHTML('beforeend', '<i data-lucide="external-link" class="lucide-icon sm"></i>');
  }
  refreshIcons(el);
}
