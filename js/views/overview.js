/* ============================================
   VIEW: Overview dashboard (#overview)
   ============================================ */

import { state } from '../state.js';
import {
  timeLogCardHtml, bindTimeLogCard, challengeCardHtml, bindChallengeCard, growthScoreboardHtml
} from '../growth.js';
import { dsaCardHtml, bindDsaCard, getDsaStats } from '../dsa.js';
import { activeMonths, getDayProgress, getMonthDateRange, getActiveRoadmapVariant } from '../api-ops.js';
import {
  getMonthProgress, getMonthBlendedProgress, getOverallProgress, getCurrentMonthId,
  getChallengeMonthId, getJourneyDay, getVariantLabel
} from '../progress.js';
import { growthHooks, prefersReducedMotion, refreshIcons } from '../effects.js';
import { navigate } from '../render.js';

// Animate stat numbers counting up to their final values on render.
function animateStatValues() {
  if (prefersReducedMotion()) return;
  document.querySelectorAll('.stats-row .stat-value').forEach(el => {
    const finalText = el.textContent;
    const targets = (finalText.match(/\d+/g) || []).map(Number);
    if (!targets.length) return;
    const duration = 650;
    const start = performance.now();
    el.classList.add('counting');
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      let i = 0;
      el.textContent = finalText.replace(/\d+/g, () => String(Math.round(targets[i++] * eased)));
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
        el.classList.remove('counting');
      }
    };
    requestAnimationFrame(frame);
  });
}

function refreshScoreboard() {
  const el = document.querySelector('.growth-scoreboard');
  if (!el) return;
  el.outerHTML = growthScoreboardHtml();
  refreshIcons();
}

function renderOverview(_view, { mount, preserve }) {
  const overall = getOverallProgress();
  const dsaStats = getDsaStats();
  const currentMonthId = getCurrentMonthId();

  let html = `<div class="fade-in">`;

  html += `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">${overall.percent}%</div>
        <div class="stat-label">Complete</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${overall.done}/${overall.total}</div>
        <div class="stat-label">Tasks Done</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${dsaStats.solved}/${dsaStats.total}</div>
        <div class="stat-label">DSA Solved</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${getJourneyDay()}</div>
        <div class="stat-label">Journey Day</div>
      </div>
    </div>
  `;

  const challengeMonthId = getChallengeMonthId();
  html += growthScoreboardHtml();
  html += `
    <div class="growth-grid">
      ${challengeCardHtml(challengeMonthId)}
      ${timeLogCardHtml()}
    </div>
  `;
  html += dsaCardHtml();

  html += `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i data-lucide="calendar-days" class="lucide-icon"></i> All Months</div>
      </div>
      <div class="overview-grid">
  `;

  activeMonths().forEach(m => {
    const prog = getMonthBlendedProgress(m.id);
    const dr = getMonthDateRange(m.id);
    const numLabel = dr ? dr.shortMonth : m.num;
    const isCurrent = m.id === currentMonthId;
    html += `
      <div class="overview-card${isCurrent ? ' current' : ''}" data-month="${m.id}">
        <div class="overview-card-num">${numLabel}</div>
        <div class="meta-tag ${m.diffClass}" style="margin-bottom:8px; display:inline-flex">${m.difficulty}</div>
        <div class="overview-card-title">${m.title}</div>
        <div class="overview-card-desc">${m.duration} · ${m.hours}</div>
        <div class="overview-card-progress">
          <div class="overview-card-progress-fill" style="width:${prog.percent}%"></div>
        </div>
        <div class="overview-card-percent">${prog.percent}% · ${prog.done}/${prog.total} tasks</div>
      </div>
    `;
  });

  html += `</div></div>`;

  html += `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i data-lucide="trending-up" class="lucide-icon"></i> Progress by Month</div>
      </div>
      <div class="progress-chart">
        <div class="chart-y-axis">
          <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
        </div>
        <div class="chart-area">
          <div class="chart-grid-lines">
            <div class="chart-grid-line"></div>
            <div class="chart-grid-line"></div>
            <div class="chart-grid-line"></div>
            <div class="chart-grid-line"></div>
            <div class="chart-grid-line"></div>
          </div>
          <div class="chart-bars-container">
            ${activeMonths().map((m, idx) => {
              const prog = getMonthProgress(m.id);
              const dayProg = getDayProgress(m.id);
              const cdr = getMonthDateRange(m.id);
              const cLabel = cdr ? cdr.shortMonth : m.num;
              const avgPct = Math.round((prog.percent + dayProg.percent) / 2);
              const isCurrent = state.currentView === m.id;
              return `
                <div class="chart-bar-group ${isCurrent ? 'chart-bar-active' : ''}" data-month="${m.id}">
                  <div class="chart-bar-tooltip">${avgPct > 0 ? avgPct + '%' : ''}</div>
                  <div class="chart-bars">
                    <div class="chart-bar chart-bar-checklist" style="height: ${Math.max(2, prog.percent)}%; --delay: ${idx * 0.05}s" title="Checklist: ${prog.percent}%">
                      ${prog.percent >= 20 ? '<span class="chart-bar-val">' + prog.percent + '%</span>' : ''}
                    </div>
                    <div class="chart-bar chart-bar-topics" style="height: ${Math.max(2, dayProg.percent)}%; --delay: ${idx * 0.05 + 0.03}s" title="Topics: ${dayProg.percent}%">
                      ${dayProg.percent >= 20 ? '<span class="chart-bar-val">' + dayProg.percent + '%</span>' : ''}
                    </div>
                  </div>
                  <div class="chart-label">${cLabel}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="chart-legend">
        <span class="chart-legend-item" data-toggle="checklist"><span class="chart-dot chart-dot-checklist"></span> Checklist</span>
        <span class="chart-legend-item" data-toggle="topics"><span class="chart-dot chart-dot-topics"></span> Topics</span>
      </div>
    </div>
  `;

  html += `</div>`;
  mount(html);

  if (!preserve) animateStatValues();
  // Growth/DSA cards own their in-card listeners (they re-render themselves in place).
  bindChallengeCard(challengeMonthId, { hooks: { ...growthHooks, onChange: refreshScoreboard } });
  bindTimeLogCard({ onChange: refreshScoreboard });
  bindDsaCard({ hooks: growthHooks });
}

function onClick(e) {
  const card = e.target.closest('.overview-card[data-month]');
  if (card) {
    card.classList.add('morphing');
    setTimeout(() => navigate(parseInt(card.dataset.month)), 200);
    return;
  }

  const bar = e.target.closest('.chart-bar-group[data-month]');
  if (bar) {
    navigate(parseInt(bar.dataset.month));
    return;
  }

  const legend = e.target.closest('.chart-legend-item[data-toggle]');
  if (legend) {
    legend.classList.toggle('disabled');
    const hidden = legend.classList.contains('disabled');
    document.querySelectorAll(`.chart-bar-${legend.dataset.toggle}`).forEach(b => {
      b.style.display = hidden ? 'none' : '';
    });
  }
}

export const overviewView = {
  title: () => `${getVariantLabel(getActiveRoadmapVariant())} — 10 Month Roadmap`,
  render: renderOverview,
  events: { click: onClick }
};
