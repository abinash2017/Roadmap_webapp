/* ============================================
   MAIN — DOMContentLoaded entry point
   ============================================ */

import { state, loadCache, applyTheme, getTheme, applyAccent, getAccent, api, DEMO_MODE } from './state.js';
import { showToast } from './toast.js';
import { syncFromApi, activeMonths, migrateLegacyProgressKeys } from './api-ops.js';
import { rotateQuoteIfDue } from './quotes.js';
import { renderAll, setView, parseViewHash, initContentEvents } from './render.js';
import { initShell, initQuickCapture, updateDbStatusIcon, renderTopbarQuote, initDemoBanner } from './shell.js';
import { getMonthBlendedProgress } from './progress.js';
import { playIntro } from './intro.js';

document.addEventListener('DOMContentLoaded', async () => {
  loadCache();
  applyTheme(getTheme());
  applyAccent(getAccent());
  migrateLegacyProgressKeys();
  playIntro();

  activeMonths().forEach(m => {
    if (getMonthBlendedProgress(m.id).percent === 100) state.lastCompletedMonths.add(m.id);
  });

  initShell();
  initDemoBanner();
  initContentEvents();
  renderAll();

  initQuickCapture();

  window.addEventListener('hashchange', () => {
    const newView = parseViewHash(location.hash) ?? 'overview';
    if (newView !== state.currentView) {
      setView(newView);
      renderAll();
    }
  });

  updateDbStatusIcon();
  await syncFromApi();
  updateDbStatusIcon();

  if (state.apiAvailable) {
    renderAll();
  } else if (DEMO_MODE) {
    if (!localStorage.getItem('ai-roadmap-demo-notice')) {
      localStorage.setItem('ai-roadmap-demo-notice', '1');
      showToast('Demo mode — your progress is saved in this browser only', 'info', 6000);
    }
  } else {
    showToast('Server offline — changes are saved in this browser and sync when it reconnects', 'warning', 5000);
  }

  let pollTimer = setInterval(pollHealth, 10000);
  pollQuoteRotation();
  let quoteTimer = setInterval(pollQuoteRotation, 60000);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(pollTimer);
      pollTimer = null;
      clearInterval(quoteTimer);
      quoteTimer = null;
    } else {
      if (!pollTimer) {
        pollHealth();
        pollTimer = setInterval(pollHealth, 10000);
      }
      if (!quoteTimer) {
        pollQuoteRotation();
        quoteTimer = setInterval(pollQuoteRotation, 60000);
      }
    }
  });

  function pollQuoteRotation() {
    const quoteRotated = rotateQuoteIfDue();
    if (quoteRotated) {
      renderTopbarQuote();
      showToast('New philosopher quote unlocked', 'info', 2500);
    }
  }

  async function pollHealth() {
    if (DEMO_MODE) return;
    const wasAvailable = state.apiAvailable;
    const health = await api('/health', {}, 5000);
    state.apiAvailable = !!(health && health.status !== 'degraded');
    if (state.apiAvailable !== wasAvailable) {
      updateDbStatusIcon();
      if (state.apiAvailable) {
        showToast('Server online', 'success');
        await syncFromApi();
        renderAll();
      } else {
        showToast('Server offline — changes saved locally', 'warning', 4000);
      }
    }
  }
});
