/* ============================================
   TOAST NOTIFICATION SYSTEM
   No dependencies.
   ============================================ */

export const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
};

export function showToast(message, type = 'success', duration = 2500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.innerHTML = TOAST_ICONS[type] || '';
  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

let _saveIndicatorTimer;
export function showSaveIndicator() {
  const el = document.getElementById('saveIndicator');
  if (!el) return;
  el.classList.add('visible');
  clearTimeout(_saveIndicatorTimer);
  _saveIndicatorTimer = setTimeout(() => el.classList.remove('visible'), 2000);
}
