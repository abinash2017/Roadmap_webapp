/* ============================================
   CELEBRATE — pickable completion animations (any theme)
   levelup · impact · petals · glitch · minimal
   ("confetti" is the app's classic banner + confetti, handled in render.js)
   ============================================ */

import { createFrameGate } from './frame-gate.js';

const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const rand = (a, b) => a + Math.random() * (b - a);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let fx = null, ctx = null, W = 0, H = 0, dpr = 1, raf = null, layer = null, timers = [];

function ensureCanvas() {
  if (fx) return;
  fx = document.createElement('canvas');
  fx.className = 'cel-canvas';
  fx.setAttribute('aria-hidden', 'true');
  fx.hidden = true;   // an idle full-screen canvas would still be composited every frame
  document.body.appendChild(fx);
  ctx = fx.getContext('2d');
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    fx.width = W * dpr; fx.height = H * dpr;
    fx.style.width = W + 'px'; fx.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);
}

function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

// A new celebration always replaces the previous one — nothing stacks.
function cleanup() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  timers.forEach(clearTimeout);
  timers = [];
  if (layer) layer.remove();
  layer = null;
  document.querySelectorAll('.cel-mini-toast, .cel-halftone-burst, .cel-glitch-bar, .cel-flash').forEach(el => el.remove());
  if (ctx) ctx.clearRect(0, 0, W, H);
  if (fx) fx.hidden = true;
}

function showLayer(html, holdMs) {
  layer = document.createElement('div');
  layer.className = 'cel-layer';
  layer.setAttribute('role', 'status');
  layer.innerHTML = html;
  document.body.appendChild(layer);
  const el = layer;
  later(() => el.firstElementChild && el.firstElementChild.classList.add('cel-out'), holdMs);
  later(() => { el.remove(); if (layer === el) layer = null; }, holdMs + 480);
}

function animate(dur, draw) {
  fx.hidden = false;
  const start = performance.now();
  const gate = createFrameGate();
  const step = (now) => {
    const t = Math.max(0, Math.min(1, (now - start) / dur));
    if (t < 1 && !gate(now)) { raf = requestAnimationFrame(step); return; }
    ctx.clearRect(0, 0, W, H);
    draw(t);
    if (t < 1) raf = requestAnimationFrame(step);
    else { ctx.clearRect(0, 0, W, H); raf = null; fx.hidden = true; }
  };
  raf = requestAnimationFrame(step);
}

function flash() {
  const f = document.createElement('div');
  f.className = 'cel-flash';
  document.body.appendChild(f);
  later(() => f.remove(), 400);
}

function shake(target) {
  if (!target) return;
  target.classList.remove('cel-shake'); void target.offsetWidth; target.classList.add('cel-shake');
  later(() => target.classList.remove('cel-shake'), 500);
}

const subHtml = (sub) => (sub ? `<div class="cel-sub">${esc(sub)}</div>` : '');
const fmtLv = (n) => (Math.round(n * 10) / 10).toFixed(1);

// ── System Level Up ─────────────────────────────
function levelup({ title, sub, level }) {
  let headline = 'QUEST CLEARED';
  let lvLine = '';
  if (level && Number.isFinite(level.after)) {
    const before = Number.isFinite(level.before) ? level.before : level.after;
    if (Math.floor(level.after + 1e-9) > Math.floor(before + 1e-9)) headline = 'LEVEL UP!';
    lvLine = before !== level.after
      ? `<div class="cel-lvl-from">Lv. ${fmtLv(before)} → <b>Lv. ${fmtLv(level.after)}</b></div>`
      : `<div class="cel-lvl-from">Lv. <b>${fmtLv(level.after)}</b></div>`;
  }
  const gain = level && Number.isFinite(level.before) && level.after > level.before ? `+${fmtLv(level.after - level.before)} Lv` : '';
  showLayer(`
    <div class="cel-lvl-window">
      <div class="cel-lvl-head">[ NOTIFICATION ]</div>
      <div class="cel-lvl-big">${headline}</div>
      ${lvLine}
      <div class="cel-lvl-line" style="animation-delay:.45s">Quest cleared: ${esc(title)}<span>✓</span></div>
      ${sub ? `<div class="cel-lvl-line" style="animation-delay:.6s">${esc(sub)}</div>` : ''}
      ${gain ? `<div class="cel-lvl-line" style="animation-delay:.75s">Experience<span>${gain}</span></div>` : ''}
    </div>`, 2500);
  const pillars = Array.from({ length: 14 }, () => ({ x: rand(0, W), w: rand(20, 70), d: rand(0, 0.3), c: Math.random() < 0.6 ? '61,165,255' : '155,92,255' }));
  const motes = Array.from({ length: 90 }, () => ({ x: W / 2 + rand(-200, 200), y: H / 2 + rand(-80, 80), vx: rand(-2, 2), vy: rand(-4, -0.5), r: rand(1, 3) }));
  animate(2400, (t) => {
    ctx.globalCompositeOperation = 'lighter';
    const fade = 1 - Math.max(0, t - 0.6) / 0.4;
    pillars.forEach(p => {
      const k = Math.max(0, Math.min(1, (t - p.d) / 0.35));
      const g = ctx.createLinearGradient(0, H, 0, H - H * k);
      g.addColorStop(0, `rgba(${p.c},${0.35 * fade})`); g.addColorStop(1, `rgba(${p.c},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(p.x - p.w / 2, H - H * k, p.w, H * k);
    });
    ctx.fillStyle = 'rgba(170,220,255,0.9)';
    ctx.globalAlpha = 1 - t;
    motes.forEach(m => {
      m.x += m.vx; m.y += m.vy;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.28); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  });
}

// ── Impact Punch ────────────────────────────────
function impact({ title, sub, shakeTarget }) {
  flash();
  shake(shakeTarget);
  const burst = document.createElement('div');
  burst.className = 'cel-halftone-burst';
  document.body.appendChild(burst);
  later(() => burst.remove(), 950);
  const debris = Array.from({ length: 40 }, () => {
    const a = rand(0, 6.28), v = rand(8, 20);
    return { x: W / 2, y: H / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: rand(3, 8), rot: rand(0, 6) };
  });
  // Speed lines are generated once (not re-randomised per frame) so they never strobe (WCAG 2.3.1).
  const lines = Array.from({ length: 110 }, () => ({ ang: Math.random() * 6.28, inner: rand(0.24, 0.42), sp: rand(0.003, 0.012) }));
  animate(1500, (t) => {
    const cx = W / 2, cy = H / 2, outer = Math.hypot(W, H);
    const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
    const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.2, cx, cy, outer / 2);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${0.6 * fade})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    if (t < 0.75) {
      const push = 1 + t * 0.25;
      ctx.beginPath();
      for (const l of lines) {
        const inner = Math.min(W, H) * l.inner * push;
        ctx.moveTo(cx + Math.cos(l.ang) * inner, cy + Math.sin(l.ang) * inner);
        ctx.lineTo(cx + Math.cos(l.ang - l.sp) * outer, cy + Math.sin(l.ang - l.sp) * outer);
        ctx.lineTo(cx + Math.cos(l.ang + l.sp) * outer, cy + Math.sin(l.ang + l.sp) * outer);
        ctx.closePath();
      }
      ctx.fillStyle = `rgba(255,255,255,${0.8 * Math.min(fade, 1 - t / 0.75)})`;
      ctx.fill();
    }
    const ease = 1 - Math.pow(1 - t, 3);
    [[1, '255,210,63'], [0.72, '255,255,255'], [0.5, '232,32,42']].forEach(([k, c]) => {
      ctx.strokeStyle = `rgba(${c},${0.85 * (1 - t)})`;
      ctx.lineWidth = 10 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, ease * outer * 0.45 * k), 0, 6.28); ctx.stroke();
    });
    ctx.globalAlpha = fade;
    ctx.fillStyle = '#2a2a2a'; ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1;
    debris.forEach(d => {
      d.x += d.vx; d.y += d.vy; d.vy += 0.4; d.rot += 0.2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(d.x, d.y); ctx.rotate(d.rot);
      ctx.fillRect(-d.s / 2, -d.s / 2, d.s, d.s); ctx.strokeRect(-d.s / 2, -d.s / 2, d.s, d.s);
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  });
  showLayer(`<div class="cel-center"><div class="cel-impact-text">${esc(title).toUpperCase()}</div>${subHtml(sub)}</div>`, 1700);
}

// ── Petal Storm ─────────────────────────────────
function petals({ title, sub }) {
  const ps = Array.from({ length: 160 }, () => ({
    a: rand(0, 6.28), r: rand(0, 40), vr: rand(4, 11), spin: rand(0.02, 0.06) * (Math.random() < 0.5 ? -1 : 1),
    s: rand(5, 12), rot: rand(0, 6.28), vrot: rand(-0.15, 0.15), flip: rand(0, 6), hue: Math.round(rand(325, 350)),
  }));
  ps.forEach(p => { p.fill = `hsl(${p.hue}, 95%, 82%)`; });
  animate(2600, (t) => {
    const cx = W / 2, cy = H / 2;
    ctx.globalAlpha = 1 - Math.max(0, t - 0.65) / 0.35;
    ps.forEach(p => {
      p.r += p.vr * (1 - t * 0.7); p.a += p.spin; p.rot += p.vrot; p.flip += 0.08;
      const x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r + t * 120;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.translate(x, y); ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
      ctx.fillStyle = p.fill;
      ctx.beginPath();
      ctx.moveTo(0, p.s);
      ctx.bezierCurveTo(p.s * 0.9, p.s * 0.4, p.s * 0.7, -p.s * 0.8, p.s * 0.18, -p.s);
      ctx.lineTo(0, -p.s * 0.72); ctx.lineTo(-p.s * 0.18, -p.s);
      ctx.bezierCurveTo(-p.s * 0.7, -p.s * 0.8, -p.s * 0.9, p.s * 0.4, 0, p.s);
      ctx.fill();
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
  });
  showLayer(`<div class="cel-center"><div class="cel-soft-text">${esc(title)}</div>${subHtml(sub)}</div>`, 2000);
}

// ── Neon Glitch ─────────────────────────────────
function glitch({ title, sub }) {
  for (let i = 0; i < 9; i++) {
    const b = document.createElement('div');
    b.className = 'cel-glitch-bar';
    b.style.top = `${rand(0, 95).toFixed(1)}%`;
    b.style.height = `${Math.round(rand(4, 40))}px`;
    b.style.background = Math.random() < 0.5 ? 'rgba(5,217,232,0.55)' : 'rgba(255,42,109,0.55)';
    b.style.animationDelay = `${rand(0, 0.1).toFixed(2)}s`;
    document.body.appendChild(b);
    later(() => b.remove(), 650);
  }
  // Glitch blocks are re-drawn at most ~2.5×/s (WCAG 2.3.1: ≤ 3 flashes per second).
  let blocks = [], blocksAt = -1;
  animate(1800, (t) => {
    const y = t * H * 1.2 - H * 0.1;
    const g = ctx.createLinearGradient(0, y - 60, 0, y + 6);
    g.addColorStop(0, 'rgba(5,217,232,0)'); g.addColorStop(1, `rgba(5,217,232,${0.45 * (1 - t)})`);
    ctx.fillStyle = g; ctx.fillRect(0, y - 60, W, 66);
    if (t < 0.5) {
      const slot = Math.floor(t * 1800 / 400);
      if (slot !== blocksAt) {
        blocksAt = slot;
        blocks = Array.from({ length: 26 }, () => ({ x: rand(0, W), y: rand(0, H), w: rand(8, 60), h: rand(2, 10), c: Math.random() < 0.5 ? 'rgba(255,42,109,0.5)' : 'rgba(5,217,232,0.5)' }));
      }
      blocks.forEach(b => { ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.w, b.h); });
    }
  });
  showLayer(`<div class="cel-center"><div class="cel-glitch-text">${esc(title).toUpperCase()}</div>${subHtml(sub)}</div>`, 1700);
}

// ── Minimal ─────────────────────────────────────
function minimal({ title, sub }) {
  const t = document.createElement('div');
  t.className = 'cel-mini-toast';
  t.setAttribute('role', 'status');
  t.innerHTML = `<span class="cel-ck">✓</span><span>${esc(title)}${sub ? ` · <span class="cel-mini-sub">${esc(sub)}</span>` : ''}</span>`;
  document.body.appendChild(t);
  later(() => t.classList.add('cel-out'), 2200);
  later(() => t.remove(), 2700);
}

const KINDS = { levelup, impact, petals, glitch, minimal };

export const CELEBRATION_STYLES = [
  { id: 'auto',     name: 'Match theme' },
  { id: 'confetti', name: 'Classic Confetti' },
  { id: 'levelup',  name: 'System Level Up' },
  { id: 'impact',   name: 'Impact Punch' },
  { id: 'petals',   name: 'Petal Storm' },
  { id: 'glitch',   name: 'Neon Glitch' },
  { id: 'minimal',  name: 'Minimal' },
];

// "Match theme" mapping.
export const THEME_CELEBRATION = { dark: 'confetti', sakura: 'petals', neon: 'glitch', hero: 'levelup' };

export function playCelebration(kind, opts = {}) {
  ensureCanvas();
  cleanup();
  const fn = reduceMotionQuery.matches ? minimal : (KINDS[kind] || minimal);
  fn({ title: opts.title || 'Complete', sub: opts.sub || '', level: opts.level || null, shakeTarget: opts.shakeTarget || null });
}
