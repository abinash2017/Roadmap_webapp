/* ============================================
   VIEW: Study Tips (#tips)
   ============================================ */

import { escapeHtml } from '../state.js';
import { getSharedStudyTips, getProfileStudyTips, getTop3Tips, getAntiHelplessnessTips } from '../data.js';
import { getActiveRoadmapVariant } from '../api-ops.js';
import { getVariantLabel } from '../progress.js';

const tipCard = (tip, i) => `
  <div class="card tip-card">
    <div class="tip-header">
      <span class="tip-icon">${tip.icon}</span>
      <span class="tip-title">${i + 1}. ${tip.title}</span>
    </div>
    <div class="tip-body">${tip.content}</div>
  </div>
`;

const sectionHead = (icon, title, sub) => `
  <div class="tips-section-head">
    <i data-lucide="${icon}" class="lucide-icon"></i>
    <div>
      <div class="tips-section-title">${title}</div>
      <div class="tips-section-sub">${escapeHtml(sub)}</div>
    </div>
  </div>
`;

function renderTips(_view, { mount }) {
  const variant = getActiveRoadmapVariant();
  const profileTips = getProfileStudyTips(variant);
  const top3 = getTop3Tips(variant);

  let html = `<div class="fade-in tips-container">`;

  html += `
    <div class="card tips-top3-card">
      <div class="card-title" style="margin-bottom:12px">⭐ If You Remember Nothing Else</div>
      <div class="tips-top3">
        ${top3.map((t, i) => `
          <div class="tips-top3-item">
            <span class="tips-top3-num">${i + 1}</span>
            <span>${t}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (profileTips.length) {
    html += sectionHead('target', 'Tailored to Your Track', getVariantLabel(variant));
    profileTips.forEach((tip, i) => { html += tipCard(tip, i); });
  }

  html += sectionHead('shield-check', 'Beat Learned Helplessness & Tutorial Hell', 'Habits backed by the Stuck Log, Rebuilds, Learn vs Build tracker and Weekly Solo Challenge');
  getAntiHelplessnessTips().forEach((tip, i) => { html += tipCard(tip, i); });

  html += sectionHead('book-open', 'General Study Habits', 'Shared across every roadmap');
  getSharedStudyTips().forEach((tip, i) => { html += tipCard(tip, i); });

  html += `</div>`;
  mount(html);
}

export const tipsView = {
  title: () => 'Study Tips & Best Practices',
  render: renderTips,
  events: {}
};
