/* ============================================
   EFFECTS — motion helpers, celebrations & confetti
   ============================================ */

import { state, getTheme, getCelebrationStyle, getNeonDecode, DEMO_MODE } from './state.js';
import { createFrameGate } from './frame-gate.js';
import { playCelebration, CELEBRATION_STYLES, THEME_CELEBRATION } from './celebrate.js';
import { getLevel } from './progress.js';

export function refreshIcons(root = document) {
  if (typeof lucide !== 'undefined') lucide.createIcons({ root });
}

export function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Tween an integer value in an element's text (used for the overall % number).
export function animateCount(el, to, suffix = '%') {
  const from = parseInt(el.textContent) || 0;
  if (prefersReducedMotion() || from === to) {
    el.textContent = `${to}${suffix}`;
    return;
  }
  const start = performance.now();
  const dur = 500;
  if (el._countRAF) cancelAnimationFrame(el._countRAF);
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = `${Math.round(from + (to - from) * eased)}${suffix}`;
    if (t < 1) el._countRAF = requestAnimationFrame(step);
  };
  el._countRAF = requestAnimationFrame(step);
}

// Pulse the streak flame when the streak increments.
export function pulseStreakBadge() {
  const el = document.getElementById('streakBadge');
  if (!el || prefersReducedMotion()) return;
  el.classList.remove('streak-bump');
  void el.offsetWidth;
  el.classList.add('streak-bump');
  setTimeout(() => el.classList.remove('streak-bump'), 700);
}

export function addRippleEffect(el, e) {
  const rect = el.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
  const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
  el.style.setProperty('--ripple-x', x + '%');
  el.style.setProperty('--ripple-y', y + '%');
  el.classList.remove('ripple');
  void el.offsetWidth;
  el.classList.add('ripple');
  setTimeout(() => el.classList.remove('ripple'), 600);
}

// Replays the tick animation on a just-toggled checklist/topic row.
export function flashChecked(el, nowChecked) {
  el.classList.remove('just-checked', 'just-completed');
  void el.offsetWidth;
  el.classList.add('just-checked');
  if (nowChecked) el.classList.add('just-completed');
  setTimeout(() => el.classList.remove('just-checked', 'just-completed'), 700);
  if (getTheme() === 'neon' && !prefersReducedMotion()) neonGlitchRow(el, nowChecked);
}

// Neon Tokyo: RGB-split glitch on the row text + a short "✓ synced" tag.
function neonGlitchRow(el, nowChecked) {
  const text = el.querySelector('.topic-check-text, .checklist-text') || el;
  text.classList.remove('neon-hit');
  void text.offsetWidth;
  text.classList.add('neon-hit');
  setTimeout(() => text.classList.remove('neon-hit'), 350);
  el.querySelector('.neon-synced')?.remove();
  if (!nowChecked) return;
  const tag = document.createElement('span');
  tag.className = 'neon-synced';
  tag.textContent = state.apiAvailable ? '✓ synced' : DEMO_MODE ? '✓ saved' : '✓ offline';
  el.appendChild(tag);
  setTimeout(() => tag.remove(), 1500);
}

// ── Neon Tokyo page transition: headings and numbers "decrypt" into place ──

const DECODE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$*/<>[]アカサタナハマ';
const DECODE_SELECTOR = [
  '.card-title', '.month-hero-title', '.month-hero-number', '.month-hero-dates', '.month-pct-badge',
  '.week-title', '.week-pct', '.overview-card-title', '.overview-card-percent', '.stat-label',
  '.tips-section-title',
].join(', ');
const DECODE_MAX_NODES = 80;

export function playNeonDecode(content) {
  if (getTheme() !== 'neon' || !getNeonDecode() || prefersReducedMotion()) return;
  const targets = [document.getElementById('topbarTitle'), ...content.querySelectorAll(DECODE_SELECTOR)];
  decodeText(targets);
}

function decodeText(elements, duration = 450) {
  const items = [];
  for (const el of elements) {
    if (!el || items.length >= DECODE_MAX_NODES) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || !r.width) continue; // only what's on screen
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n && items.length < DECODE_MAX_NODES; n = walker.nextNode()) {
      if (n.nodeValue.trim()) items.push({ n, text: n.nodeValue, last: n.nodeValue });
    }
  }
  if (!items.length) return;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    for (const it of items) {
      // Leave the node alone if something else (e.g. a live counter) changed it meanwhile.
      if (!it.n.isConnected || it.n.nodeValue !== it.last) continue;
      if (t >= 1) { it.n.nodeValue = it.text; continue; }
      const reveal = Math.floor(t * it.text.length);
      let s = '';
      for (let i = 0; i < it.text.length; i++) {
        const c = it.text[i];
        s += i < reveal || c === ' ' ? c : DECODE_GLYPHS[(Math.random() * DECODE_GLYPHS.length) | 0];
      }
      it.n.nodeValue = s;
      it.last = s;
    }
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Completion celebrations ───────────────

export function resolveCelebrationKind(style = getCelebrationStyle(), theme = getTheme()) {
  return style === 'auto' ? (THEME_CELEBRATION[theme] || 'confetti') : style;
}

export function celebrationName(kind) {
  return (CELEBRATION_STYLES.find(s => s.id === kind) || {}).name || kind;
}

// Single entry point for every completion. "confetti" keeps the original banner + confetti.
// Reduce motion (OS setting) → always the small Minimal toast, whatever the style.
const reduceMotionMQ = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
export function celebrate(title, sub = '', opts = {}) {
  const kind = reduceMotionMQ.matches ? 'minimal' : resolveCelebrationKind(opts.style);
  if (kind === 'confetti') {
    showCelebration(title, sub);
    fireConfetti();
    return;
  }
  const after = getLevel();
  const level = opts.level || (opts.levelGain ? { before: after - opts.levelGain, after } : { after });
  playCelebration(kind, { title, sub, level, shakeTarget: document.getElementById('main') });
}

export const growthHooks = {
  celebrate(title, subtitle) {
    celebrate(title, subtitle);
  }
};

export function showCelebration(title, subtitle) {
  const existing = document.querySelector('.celebration-burst');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.className = 'celebration-burst';
  el.innerHTML = `
    <div class="celebration-text">${title}</div>
    ${subtitle ? `<div class="celebration-sub">${subtitle}</div>` : ''}
  `;
  document.body.appendChild(el);

  setTimeout(() => {
    el.style.animation = 'celebFadeOut 0.4s ease forwards';
    el.addEventListener('animationend', () => el.remove());
  }, 2000);
}

export function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#0078d4', '#4ec9b0', '#dcdcaa', '#f44747', '#569cd6', '#c586c0', '#9cdcfe', '#ce9178'];
  const TOTAL = 150;

  for (let i = 0; i < TOTAL; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 8,
      opacity: 1
    });
  }

  let frame = 0;
  const maxFrames = 180;
  const gate = createFrameGate();

  function animate(now) {
    if (now !== undefined && !gate(now)) { requestAnimationFrame(animate); return; }
    if (frame >= maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.rv;
      if (frame > maxFrames * 0.6) {
        p.opacity = Math.max(0, 1 - (frame - maxFrames * 0.6) / (maxFrames * 0.4));
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    requestAnimationFrame(animate);
  }
  animate();
}
