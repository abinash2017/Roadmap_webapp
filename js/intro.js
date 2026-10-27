/* ============================================
   INTRO — short themed startup animation with a personal welcome
   Plays once per browser session over the first paint; click or any key skips.
   Dark: name reveal + stat chips · Sakura: blossom + "okaeri" ·
   Neon: terminal login log · Hero: [ SYSTEM ] welcome + [ DAILY QUEST ] window.
   ============================================ */

import { escapeHtml, getTheme, getStartupAnim } from './state.js';
import { getProfile, getStreak, getTodoItems, todayStr } from './api-ops.js';
import { getOverallProgress, getJourneyDay, getLevel, getCurrentMonthId } from './progress.js';
import { getDsaToday } from './dsa.js';
import { prefersReducedMotion, refreshIcons } from './effects.js';

const SESSION_KEY = 'ai-roadmap-intro-played';
const HOLD_MS = { dark: 4500, sakura: 4500, neon: 4500, hero: 5000 };
const FADE_MS = 450;

function introData() {
  const monthId = getCurrentMonthId();
  const todos = monthId >= 0 ? getTodoItems(monthId, todayStr()) : [];
  return {
    percent: getOverallProgress().percent,
    day: getJourneyDay(),
    level: Math.floor(getLevel()),
    streak: getStreak().count || 0,
    name: (getProfile().display_name || '').trim() || 'Player',
    todos: { total: todos.length, done: todos.filter(t => t.done).length },
    dsa: getDsaToday(),
  };
}

const skipHint = '<div class="app-intro-skip">click anywhere to continue</div>';

function darkMarkup(d) {
  const letters = [...d.name].map((c, i) =>
    `<span style="animation-delay:${(0.15 + i * 0.06).toFixed(2)}s">${c === ' ' ? '&nbsp;' : escapeHtml(c)}</span>`).join('');
  const chips = [
    d.day > 0 ? `<span class="app-intro-chip">📅 Day ${d.day}</span>` : '',
    `<span class="app-intro-chip">📈 ${d.percent}%</span>`,
    d.streak > 0 ? `<span class="app-intro-chip">🔥 ${d.streak}-day streak</span>` : '',
  ].join('');
  return `
    <div class="app-intro-stage">
      <div class="app-intro-eyebrow">WELCOME BACK</div>
      <div class="app-intro-name">${letters}</div>
      <div class="app-intro-chips" style="--d:${(0.3 + d.name.length * 0.06).toFixed(2)}s">${chips}</div>
    </div>
    ${skipHint}
  `;
}

const blossomSvg = `
  <svg class="app-intro-blossom" viewBox="-50 -50 100 100">
    <defs>
      <radialGradient id="introPetalGrad" cx="0" cy="0" r="46" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#e0478d" />
        <stop offset="0.3" stop-color="#ff9ccb" />
        <stop offset="1" stop-color="#fff0f6" />
      </radialGradient>
    </defs>
    ${[0, 72, 144, 216, 288].map(a => `<path transform="rotate(${a})" fill="url(#introPetalGrad)" d="M0,-5 C-15,-13 -19,-33 -9,-44 L0,-37 L9,-44 C19,-33 15,-13 0,-5 Z" />`).join('')}
    <circle r="7" fill="#c2185b" />
    ${[0, 72, 144, 216, 288].map(a => `<circle transform="rotate(${a + 36})" cx="0" cy="-12" r="2.2" fill="#ffd58a" />`).join('')}
  </svg>
`;

function sakuraMarkup(d) {
  const petals = Array.from({ length: 16 }, (_, i) => {
    const left = Math.round(Math.random() * 100);
    const delay = (Math.random() * 0.9).toFixed(2);
    const dur = (2.2 + Math.random() * 1.6).toFixed(2);
    const scale = (0.7 + Math.random() * 0.7).toFixed(2);
    return `<span class="app-intro-petal" style="left:${left}%; animation-delay:${delay}s; animation-duration:${dur}s; --s:${scale}; --drift:${i % 2 ? '' : '-'}${20 + Math.round(Math.random() * 60)}px"></span>`;
  }).join('');
  return `
    <div class="app-intro-petals">${petals}</div>
    <div class="app-intro-stage">
      <div class="app-intro-bloom">${blossomSvg}</div>
      <div class="app-intro-jp">おかえり</div>
      <div class="app-intro-title">Welcome back, ${escapeHtml(d.name)}</div>
      <div class="app-intro-sub">${d.day > 0 ? `Day ${d.day} · ` : ''}${d.percent}% bloomed</div>
    </div>
    ${skipHint}
  `;
}

function neonMarkup(d) {
  const user = escapeHtml(d.name.toLowerCase().replace(/\s+/g, '_'));
  return `
    <div class="app-intro-scan"></div>
    <div class="app-intro-stage">
      <div class="app-intro-term">
        <div class="app-intro-line" style="--d:0.1s">&gt; auth --user ${user}</div>
        <div class="app-intro-line" style="--d:0.45s">&gt; <span class="app-intro-ok">✓ access granted</span></div>
        <div class="app-intro-line" style="--d:0.8s">&gt; loading roadmap... ${d.percent}%</div>
        <div class="app-intro-line" style="--d:1.15s">&gt; <span class="app-intro-hot">welcome back.${d.day > 0 ? ` day ${d.day}.` : ''} let's go.</span></div>
      </div>
    </div>
    ${skipHint}
  `;
}

function questRow(label, value, delay) {
  return `<div class="app-intro-line app-intro-quest" style="--d:${delay}s"><span>${label}</span><span>${value}</span></div>`;
}

function heroMarkup(d) {
  const quests = [];
  quests.push(['Daily to-dos', d.todos.total ? `[ ${d.todos.done} / ${d.todos.total} ]` : '[ not set ]']);
  if (d.dsa) {
    if (d.dsa.kind === 'study' && d.dsa.total) quests.push(['DSA problems', `[ ${d.dsa.solved} / ${d.dsa.total} ]`]);
    else if (d.dsa.kind === 'revision') quests.push(['DSA', '[ revision day ]']);
    else if (d.dsa.kind === 'mock') quests.push(['DSA', '[ mock interview ]']);
  }
  return `
    <div class="app-intro-stage">
      <div class="app-intro-window">
        <div class="app-intro-window-head">[ SYSTEM ]</div>
        <div class="app-intro-line" style="--d:0.35s">Welcome back, Prime <b>${escapeHtml(d.name)}</b>.</div>
        <div class="app-intro-line" style="--d:0.6s">${d.day > 0 ? `Day <b>${d.day}</b> · ` : ''}Level <b>${d.level}</b> · Progress <b>${d.percent}%</b></div>
        <div class="app-intro-window-head app-intro-subhead app-intro-line" style="--d:0.9s">[ DAILY QUEST ]</div>
        ${quests.map(([label, value], i) => questRow(label, value, (1.1 + i * 0.2).toFixed(2))).join('')}
        <div class="app-intro-line app-intro-note" style="--d:${(1.2 + quests.length * 0.2).toFixed(2)}s">Clear today's quests to grow stronger.</div>
      </div>
    </div>
    ${skipHint}
  `;
}

const MARKUP = { dark: darkMarkup, sakura: sakuraMarkup, neon: neonMarkup, hero: heroMarkup };

/**
 * Show the intro. Normal startup: only if enabled, not yet shown this session, and motion is allowed.
 * `force` (Settings → Preview) ignores the setting and the session flag. Returns true if it played.
 */
export function playIntro({ force = false } = {}) {
  if (prefersReducedMotion()) return false;
  if (!force) {
    if (!getStartupAnim()) return false;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return false;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch { /* storage blocked — just play */ }
  }

  document.querySelector('.app-intro')?.remove();
  const theme = MARKUP[getTheme()] ? getTheme() : 'dark';
  const data = introData();
  const el = document.createElement('div');
  el.className = `app-intro app-intro-${theme}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = MARKUP[theme](data);
  document.body.appendChild(el);
  refreshIcons(el);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    window.removeEventListener('keydown', finish, true);
    el.classList.add('app-intro-out');
    setTimeout(() => el.remove(), FADE_MS);
  };
  const timer = setTimeout(finish, HOLD_MS[theme]);
  el.addEventListener('pointerdown', finish);
  window.addEventListener('keydown', finish, true);
  return true;
}
