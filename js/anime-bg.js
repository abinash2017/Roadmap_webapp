/* ============================================
   ANIME BACKGROUND — live scenery + canvas particles for the anime themes
   (Sakura Night · Neon Tokyo · Level Up Hero). Mounted only while an anime
   theme is active; fully torn down otherwise. Sits behind all content
   (z-index -1, pointer-events none).
   ============================================ */

import { getTheme, isAnimeTheme, getAnimeMotion } from './state.js';
import { createFrameGate } from './frame-gate.js';

const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const rand = (a, b) => a + Math.random() * (b - a);

let current = null;          // { theme, root, canvas, ctx, draw, raf, listeners[], timers[] }
let messageProvider = null;  // () => [{ head, lines: [[{ t, hl }]] }]
let neonProvider = null;     // () => { power: 0..1, completedMonths, day, ticker }

const NEON_MIN_POWER = 0.05; // a few windows stay lit even at 0% so the city never goes fully dark
const NEON_UNLIT_FILL = '#1b2340';

export function setAnimeMessageProvider(fn) {
  messageProvider = typeof fn === 'function' ? fn : null;
}

export function setNeonCityProvider(fn) {
  neonProvider = typeof fn === 'function' ? fn : null;
}

// Neon only: light the near skyline to match progress and update the billboard. Cheap when nothing changed.
export function refreshNeonCity() {
  const c = current;
  if (!c || c.theme !== 'neon' || !neonProvider || !c.neonWins) return;
  let data;
  try { data = neonProvider(); } catch { return; }
  if (!data) return;

  const power = Math.max(NEON_MIN_POWER, Math.min(1, data.power || 0));
  const towersLit = Math.min(c.neonTowers.length, data.completedMonths || 0);
  const first = c.neonPower == null;
  const newTowers = first ? [] : c.neonTowers.slice(c.neonTowersLit, towersLit);
  c.neonPower = power;
  c.neonTowersLit = towersLit;
  c.neonLitTowers = new Set(c.neonTowers.slice(0, towersLit));
  const animate = !first && !reduceMotionQuery.matches;

  for (const w of c.neonWins) {
    const lit = w.r < power || c.neonLitTowers.has(w.b);
    if (lit === w.lit) continue;
    const turningOn = lit && w.lit === false;
    w.lit = lit;
    w.el.setAttribute('fill', lit ? w.c : NEON_UNLIT_FILL);
    w.el.setAttribute('opacity', lit ? w.a : '0.35');
    if (turningOn && animate && !newTowers.includes(w.b)) flashClass(c, w.el, 'ab-win-on', 700);
  }
  if (animate) newTowers.forEach(b => surgeTower(c, b));
  updateBillboard(c, data);
}

function neonWindowLit(c, f) {
  if (f.r < 0) return true;
  return f.r < (c.neonPower ?? NEON_MIN_POWER) || (c.neonLitTowers && c.neonLitTowers.has(f.b));
}

function flashClass(c, el, cls, ms) {
  el.classList.remove(cls);
  void el.getBoundingClientRect();
  el.classList.add(cls);
  c.timers.push(setTimeout(() => el.classList.remove(cls), ms));
}

// A month was completed: its tower lights up floor by floor, bottom to top.
function surgeTower(c, b) {
  const wins = c.neonWins.filter(w => w.b === b);
  if (!wins.length) return;
  const ys = wins.map(w => w.y);
  const minY = Math.min(...ys), maxY = Math.max(...ys), span = Math.max(1, maxY - minY);
  wins.forEach(w => {
    w.el.style.setProperty('--sd', `${Math.round(((maxY - w.y) / span) * 900)}ms`);
    flashClass(c, w.el, 'ab-win-surge', 1700);
  });
}

function updateBillboard(c, data) {
  const bb = c.neonBillboard;
  if (!bb) return;
  bb.hidden = !data.ticker;
  const dayEl = bb.querySelector('.ab-billboard-day');
  const textEl = bb.querySelector('.ab-billboard-text');
  const dayText = data.day > 0 ? `DAY ${data.day}` : 'TOKYO';
  if (dayEl.textContent !== dayText) dayEl.textContent = dayText;
  if (textEl.textContent !== data.ticker) textEl.textContent = data.ticker || '';
}

// Idempotent: call after any theme / setting change or re-render.
export function syncAnimeBackground() {
  const theme = getTheme();
  if (!isAnimeTheme(theme)) { unmount(); return; }
  if (!current || current.theme !== theme) {
    unmount();
    mount(theme);
  }
  setRunning(getAnimeMotion() && !reduceMotionQuery.matches);
}

function on(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  current.listeners.push(() => target.removeEventListener(type, fn, opts));
}

function unmount() {
  if (!current) return;
  if (current.raf) cancelAnimationFrame(current.raf);
  current.listeners.forEach(off => off());
  current.timers.forEach(clearTimeout);
  current.root.remove();
  document.documentElement.classList.remove('anime-motion-off');
  current = null;
}

function setRunning(run) {
  if (!current) return;
  document.documentElement.classList.toggle('anime-motion-off', !run);
  if (run && !current.raf && !document.hidden) {
    current.raf = requestAnimationFrame(loop);
  } else if (!run && current.raf) {
    cancelAnimationFrame(current.raf);
    current.raf = null;
    current.ctx.clearRect(0, 0, current.W, current.H);
  }
  current.running = run;
}

function loop(now) {
  if (!current) return;
  const c = current;
  c.raf = requestAnimationFrame(loop);
  if (!c.gate(now)) return;   // 60 fps limit: keep the last frame on screen
  c.ctx.clearRect(0, 0, c.W, c.H);
  c.draw(now);
  c.mouse.vx *= 0.85; c.mouse.vy *= 0.85;
}

function mount(theme) {
  const root = document.createElement('div');
  root.className = `anime-bg anime-bg-${theme}`;
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `<div class="anime-scenery"></div><canvas class="anime-canvas"></canvas><div class="anime-overlay"></div>`;
  document.body.prepend(root);

  const canvas = root.querySelector('canvas');
  current = {
    theme, root, canvas, ctx: canvas.getContext('2d'),
    W: 0, H: 0, dpr: 1, raf: null, running: false, listeners: [], timers: [],
    gate: createFrameGate(),
    mouse: { x: -9999, y: -9999, vx: 0, vy: 0 }, cache: {},
    layoutVersion: 0,   // bumped whenever the scenery box changes size → cached element rects are re-read
  };

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    current.dpr = dpr;
    current.W = window.innerWidth; current.H = window.innerHeight;
    canvas.width = current.W * dpr; canvas.height = current.H * dpr;
    canvas.style.width = current.W + 'px'; canvas.style.height = current.H + 'px';
    current.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  on(window, 'resize', resize);
  // Also catches size changes without a window resize (e.g. the page scrollbar appearing).
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { if (current) current.layoutVersion++; });
    ro.observe(root);
    current.listeners.push(() => ro.disconnect());
  } else {
    on(window, 'resize', () => { current.layoutVersion++; });
  }
  on(window, 'pointermove', (e) => {
    const m = current.mouse;
    m.vx = e.clientX - m.x; m.vy = e.clientY - m.y;
    m.x = e.clientX; m.y = e.clientY;
  }, { passive: true });
  on(document, 'visibilitychange', () => {
    if (!current) return;
    if (document.hidden && current.raf) { cancelAnimationFrame(current.raf); current.raf = null; }
    else if (!document.hidden && current.running && !current.raf) current.raf = requestAnimationFrame(loop);
  });
  if (reduceMotionQuery.addEventListener) on(reduceMotionQuery, 'change', () => syncAnimeBackground());

  buildScenery(theme, root.querySelector('.anime-scenery'), root.querySelector('.anime-overlay'));
  current.draw = SYSTEMS[theme]();
  if (theme === 'neon') refreshNeonCity();
}

// ── Scenery (static SVG / CSS-animated DOM) ─────────
function buildScenery(theme, scenery, overlay) {
  if (theme === 'sakura') {
    let blossoms = '';
    [[60,40],[110,62],[150,48],[190,80],[235,70],[280,96],[320,90],[95,110],[170,120],[255,128],[350,118],[40,90],[210,40]].forEach(([x, y]) => {
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2, px = x + Math.cos(a) * 6, py = y + Math.sin(a) * 6;
        blossoms += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="6" ry="4.2" transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${px.toFixed(1)} ${py.toFixed(1)})" fill="#ffc4de" opacity="0.92"/>`;
      }
      blossoms += `<circle cx="${x}" cy="${y}" r="2.6" fill="#ff7fb6"/>`;
    });
    const clouds = [[58, 340, 70, -10], [66, 260, 55, -38], [20, 420, 90, -60]]
      .map(([top, w, dur, delay]) => `<div class="ab-cloud" style="top:${top}%;width:${w}px;animation-duration:${dur}s;animation-delay:${delay}s"></div>`).join('');
    scenery.innerHTML = `
      <div class="ab-moon-rays"></div>
      <div class="ab-moon"></div>
      ${clouds}
      <svg class="ab-branch" viewBox="0 0 420 180">
        <path d="M0 20 C80 30, 140 50, 200 70 S320 110, 400 120" stroke="#2a1830" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M120 45 C140 80, 160 100, 175 122" stroke="#2a1830" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M240 85 C255 100, 258 115, 255 130" stroke="#2a1830" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M60 25 C55 50, 48 70, 40 90" stroke="#2a1830" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${blossoms}
      </svg>`;
  }

  if (theme === 'neon') {
    // Near-skyline windows get a random rank and are lit when rank < overall progress (refreshNeonCity).
    // Flickering ones are drawn on the canvas so the big skyline SVG never repaints.
    const flicker = [];
    const towers = [];
    const city = (W, H, minH, maxH, fill, stroke, winRate, near) => {
      let x = 0, bld = '', wins = '', bi = 0;
      while (x < W) {
        const w = rand(50, 130), h = rand(minH, maxH);
        bld += `<rect x="${x.toFixed(0)}" y="${(H - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
        if (Math.random() < 0.25) {
          bld += `<rect x="${(x + w / 2 - 1).toFixed(0)}" y="${(H - h - 26).toFixed(0)}" width="2" height="26" fill="${stroke}"/>`;
          if (near) flicker.push({ x: x + w / 2 - 2.5, y: H - h - 29.5, w: 5, h: 5, c: '#ff2a6d', period: 1600, off: rand(0, 1600), dot: true, r: -1 });
        }
        if (near) towers.push({ b: bi, h });
        for (let wy = H - h + 12; wy < H - 10; wy += 16) {
          for (let wx = x + 8; wx < x + w - 10; wx += 14) {
            if (Math.random() < winRate) {
              const c = Math.random() < 0.5 ? '#05d9e8' : (Math.random() < 0.5 ? '#ff2a6d' : '#ffe9a8');
              const a = rand(0.35, 0.9);
              if (!near) {
                wins += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="8" fill="${c}" opacity="${a.toFixed(2)}"/>`;
                continue;
              }
              const r = Math.random();
              if (Math.random() < 0.15) {
                flicker.push({ x: wx, y: wy, w: 6, h: 8, c, a, period: 4000, off: rand(0, 4000), r, b: bi });
              } else {
                wins += `<rect class="ab-win" x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="6" height="8" fill="${NEON_UNLIT_FILL}" opacity="0.35" data-c="${c}" data-a="${a.toFixed(2)}" data-r="${r.toFixed(3)}" data-b="${bi}"/>`;
              }
            }
          }
        }
        x += w + rand(2, 10);
        bi++;
      }
      return bld + wins;
    };
    scenery.innerHTML = `
      <div class="ab-beam" style="left:30%"></div>
      <div class="ab-beam ab-beam-pink" style="left:72%"></div>
      <div class="ab-skyline ab-skyline-far"><svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">${city(1600, 420, 180, 410, '#0a0a1c', 'rgba(255,42,109,0.15)', 0.12, false)}</svg></div>
      <div class="ab-skyline ab-skyline-near"><svg viewBox="0 0 1600 340" preserveAspectRatio="xMidYMax slice">${city(1600, 340, 90, 320, '#07070f', 'rgba(5,217,232,0.2)', 0.5, true)}</svg></div>
      <div class="ab-neon-sign">東京夜行</div>
      <div class="ab-neon-sign ab-neon-cyan">ネオン</div>
      <div class="ab-scanlines"></div>`;
    overlay.innerHTML = `<div class="ab-lightning"></div>`;
    // The billboard ticker lives in the topbar (in place of the plain quote) so content never covers it.
    const bb = document.createElement('div');
    bb.className = 'ab-billboard';
    bb.hidden = true;
    bb.setAttribute('role', 'marquee');
    bb.innerHTML = '<div class="ab-billboard-head">速報 · <span class="ab-billboard-day"></span></div><div class="ab-billboard-track"><span class="ab-billboard-text"></span></div>';
    document.getElementById('topbarQuote')?.after(bb);
    current.listeners.push(() => bb.remove());
    current.neonBillboard = bb;
    current.neonFlicker = flicker;
    // The 10 tallest near buildings become "month towers": each completed month lights one fully.
    current.neonTowers = towers.sort((a, b) => b.h - a.h).slice(0, 10).map(t => t.b);
    current.neonTowersLit = 0;
    current.neonPower = null;
    current.neonWins = [...scenery.querySelectorAll('.ab-win')].map(el => ({
      el, r: +el.dataset.r, b: +el.dataset.b, y: +el.getAttribute('y'), c: el.dataset.c, a: el.dataset.a, lit: null,
    }));
  }

  if (theme === 'hero') {
    let eyes = '';
    for (let i = 0; i < 22; i++) {
      eyes += `<div class="ab-eye-pair" style="left:${rand(2, 96).toFixed(1)}%;bottom:${rand(2, 22).toFixed(1)}vh;opacity:${rand(0.35, 0.9).toFixed(2)};transform:scale(${rand(0.6, 1.3).toFixed(2)});animation-delay:${rand(0, 5).toFixed(2)}s;animation-duration:${rand(4, 8).toFixed(1)}s"><i></i><i></i></div>`;
    }
    scenery.innerHTML = `
      <div class="ab-hexgrid"></div>
      <div class="ab-gate">
        <div class="ab-gate-glow"></div>
        <div class="ab-gate-core"></div>
        <div class="ab-gate-swirl"></div>
        <div class="ab-gate-ring"></div>
        <div class="ab-gate-ring ab-gate-ring-inner"></div>
      </div>
      <div class="ab-eyes">${eyes}</div>
      <div class="ab-sys-layer"></div>`;
  }
}

// ── Canvas helpers ───────────────────────────────
function glowSprite(color, size = 64) {
  const key = 'g' + color + size;
  if (current.cache[key]) return current.cache[key];
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.15, color);
  grd.addColorStop(0.45, color.replace(/[\d.]+\)$/, '0.25)'));
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return (current.cache[key] = c);
}

function petalSprite(top, bottom, blur = 0) {
  const key = 'p' + top + bottom + blur;
  if (current.cache[key]) return current.cache[key];
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (blur) g.filter = `blur(${blur}px)`;
  g.translate(32, 32);
  const s = 20;
  const grd = g.createLinearGradient(0, -s, 0, s);
  grd.addColorStop(0, top); grd.addColorStop(1, bottom);
  g.fillStyle = grd;
  g.beginPath();
  g.moveTo(0, s);
  g.bezierCurveTo(s * 0.9, s * 0.4, s * 0.7, -s * 0.8, s * 0.18, -s);
  g.lineTo(0, -s * 0.72);
  g.lineTo(-s * 0.18, -s);
  g.bezierCurveTo(-s * 0.7, -s * 0.8, -s * 0.9, s * 0.4, 0, s);
  g.fill();
  return (current.cache[key] = c);
}

// Pre-rendered text so the Neon code glyphs cost a drawImage instead of a fillText each frame.
function glyphSprite(ch, size) {
  const key = 't' + ch + size;
  if (current.cache[key]) return current.cache[key];
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = `600 ${size}px Consolas, monospace`;
  g.font = font;
  c.width = Math.ceil(g.measureText(ch).width) + 2;
  c.height = Math.ceil(size * 1.3);
  g.font = font;
  g.fillStyle = '#7ff6ff';
  g.textBaseline = 'top';
  g.fillText(ch, 1, 0);
  return (current.cache[key] = c);
}

function pushFromMouse(p, radius = 110, strength = 0.06) {
  const m = current.mouse;
  const dx = p.x - m.x, dy = p.y - m.y;
  const d2 = dx * dx + dy * dy;
  if (d2 < radius * radius) {
    const d = Math.sqrt(d2) || 1, f = 1 - d / radius;
    p.x += (dx / d) * f * 3 + m.vx * f * strength;
    p.y += (dy / d) * f * 3 + m.vy * f * strength;
  }
}

function makeWind(minGap, maxGap, minStr, maxStr) {
  let gust = null, next = performance.now() + rand(1500, 3500);
  return (now) => {
    if (!gust && now > next) gust = { start: now, dur: rand(1800, 3000), str: rand(minStr, maxStr) };
    if (gust) {
      const p = (now - gust.start) / gust.dur;
      if (p >= 1) { gust = null; next = now + rand(minGap, maxGap); return 0; }
      return Math.sin(Math.PI * Math.max(0, p)) * gust.str;
    }
    return 0;
  };
}

// Particle counts scale down on small or low-power screens.
function density() {
  const small = window.innerWidth < 900;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
  return small || lowPower ? 0.55 : 1;
}

// ── Theme systems ────────────────────────────────
const SYSTEMS = {
  sakura() {
    const { ctx } = current;
    const k = density();
    const pink = [
      petalSprite('hsla(340,100%,90%,0.95)', 'hsla(330,90%,74%,0.9)'),
      petalSprite('hsla(345,100%,86%,0.95)', 'hsla(335,85%,68%,0.9)'),
      petalSprite('hsla(330,100%,94%,0.95)', 'hsla(325,80%,78%,0.9)'),
    ];
    const pinkBlur = [petalSprite('hsla(340,100%,88%,0.8)', 'hsla(330,90%,70%,0.7)', 3)];
    const layers = [
      { count: Math.round(45 * k), size: [3, 5], speed: 0.55, alpha: 0.55, sprites: pink },
      { count: Math.round(50 * k), size: [6, 10], speed: 1, alpha: 0.95, sprites: pink },
      { count: Math.round(9 * k), size: [16, 24], speed: 1.8, alpha: 0.75, sprites: pinkBlur },
    ];
    const petals = [];
    const newPetal = (L, init) => ({
      L, x: rand(-80, current.W + 40), y: init ? rand(-current.H, current.H) : rand(-80, -10),
      size: rand(L.size[0], L.size[1]), vy: rand(0.5, 1.2) * L.speed, vx: rand(0.2, 0.8) * L.speed,
      sway: rand(0.6, 1.6), phase: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-0.03, 0.03),
      flip: rand(0, 6.28), vf: rand(0.03, 0.08), alpha: L.alpha * rand(0.75, 1),
      sprite: L.sprites[Math.floor(Math.random() * L.sprites.length)],
    });
    layers.forEach(L => { for (let i = 0; i < L.count; i++) petals.push(newPetal(L, true)); });
    const wind = makeWind(5000, 9000, 3, 6);
    const stars = Array.from({ length: Math.round(150 * k) }, () => ({ x: rand(0, 1), y: rand(0, 0.75), r: rand(0.4, 1.5), p: rand(0, 6.28), s: rand(0.01, 0.05) }));
    const shooting = [];
    let nextShoot = performance.now() + rand(1500, 4000);
    const sparkles = [];
    const shootGlow = glowSprite('rgba(255,220,240,0.9)');
    const sparkleGlow = glowSprite('rgba(255,170,215,0.9)');

    return (now) => {
      const { W, H, dpr } = current;
      ctx.fillStyle = '#fff';
      stars.forEach(s => {
        s.p += s.s;
        ctx.globalAlpha = 0.4 + Math.sin(s.p) * 0.3;
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.28); ctx.fill();
      });
      if (now > nextShoot) {
        const ang = rand(0.35, 0.6);
        shooting.push({ x: rand(W * 0.2, W * 0.9), y: rand(0, H * 0.3), vx: -Math.cos(ang) * 14, vy: Math.sin(ang) * 14, life: 1 });
        nextShoot = now + rand(3500, 7500);
      }
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += s.vx; s.y += s.vy; s.life -= 0.022;
        if (s.life <= 0) { shooting.splice(i, 1); continue; }
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 9, s.y - s.vy * 9);
        g.addColorStop(0, `rgba(255,255,255,${s.life})`); g.addColorStop(1, 'rgba(255,180,230,0)');
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 9, s.y - s.vy * 9); ctx.stroke();
        ctx.drawImage(shootGlow, s.x - 8, s.y - 8, 16, 16);
      }
      if (sparkles.length < 12 && Math.random() < 0.06) sparkles.push({ x: rand(0, W), y: rand(0, H), life: 0, max: rand(40, 80), r: rand(4, 9) });
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life++;
        if (s.life > s.max) { sparkles.splice(i, 1); continue; }
        const a = Math.sin((s.life / s.max) * Math.PI);
        ctx.globalAlpha = a * 0.9;
        ctx.strokeStyle = '#fff0f8'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * a, s.y); ctx.lineTo(s.x + s.r * a, s.y);
        ctx.moveTo(s.x, s.y - s.r * a * 1.4); ctx.lineTo(s.x, s.y + s.r * a * 1.4);
        ctx.stroke();
        ctx.drawImage(sparkleGlow, s.x - 6, s.y - 6, 12, 12);
      }
      const w = wind(now);
      petals.forEach((p, i) => {
        const depth = p.L.speed;
        p.phase += 0.02 + Math.abs(w) * 0.01;
        p.rot += p.vr * (1 + Math.abs(w) * 0.6);
        p.flip += p.vf * (1 + Math.abs(w) * 0.4);
        p.x += p.vx + w * depth + Math.sin(p.phase) * p.sway * 0.6;
        p.y += p.vy + Math.cos(p.phase * 1.3) * Math.abs(w) * 0.4;
        pushFromMouse(p, 120, 0.08);
        if (p.y > H + 40 || p.x > W + 80) { petals[i] = newPetal(p.L, false); return; }
        // Same transform steps as before, but reset the matrix directly instead of a full
        // save()/restore() of the whole canvas state for every petal.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(p.sprite, -p.size, -p.size, p.size * 2, p.size * 2);
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
    };
  },

  neon() {
    const { ctx } = current;
    const k = density();
    const drop = (init, kind) => {
      const n = kind === 'near';
      const d = {
        kind, x: rand(-100, current.W + 100), y: init ? rand(-current.H, current.H) : rand(-120, -20),
        len: n ? rand(22, 40) : rand(8, 16), v: n ? rand(14, 20) : rand(7, 10),
        c: Math.random() < 0.7 ? '5,217,232' : '255,42,109', a: n ? rand(0.3, 0.6) : rand(0.1, 0.22),
      };
      // Batch key = the stroke colour itself (alpha rounded to 0.1), built once per drop, not every frame.
      d.style = `rgba(${d.c},${(Math.round(d.a * 10) / 10).toFixed(1)})`;
      return d;
    };
    const far = Array.from({ length: Math.round(160 * k) }, () => drop(true, 'far'));
    const near = Array.from({ length: Math.round(90 * k) }, () => drop(true, 'near'));
    const bokeh = Array.from({ length: Math.round(26 * k) }, () => {
      const b = { x: rand(0, current.W), y: rand(0, current.H), r: rand(14, 46), vy: rand(-0.15, -0.4), c: Math.random() < 0.5 ? 'rgba(5,217,232,0.5)' : 'rgba(255,42,109,0.5)', p: rand(0, 6) };
      b.spr = glowSprite(b.c);
      return b;
    });
    const GLYPHS = ['0', '1', '{', '}', '</>', 'λ', '∑', '#', '=>', 'Δ', '[ ]', 'AI'];
    const glyph = (init) => {
      const g = { x: rand(0, current.W), y: init ? rand(0, current.H) : current.H + 20, vy: rand(0.2, 0.6), ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], s: Math.round(rand(11, 18)), p: rand(0, 6) };
      g.spr = glyphSprite(g.ch, g.s);
      return g;
    };
    const glyphs = Array.from({ length: Math.round(36 * k) }, () => glyph(true));
    const trainGlow = glowSprite('rgba(200,255,255,0.9)', 128);
    const trains = [];
    let nextTrain = performance.now() + rand(1000, 3000);
    let nextBolt = performance.now() + rand(5000, 9000), bolt = null;
    let nextGlitch = performance.now() + rand(3000, 6000);
    const lightning = current.root.querySelector('.ab-lightning');
    const nearSky = current.root.querySelector('.ab-skyline-near');
    const flicker = current.neonFlicker || [];
    let sky = null, skyVersion = -1;

    return (now) => {
      const { W, H } = current;
      // Flickering skyline windows, mapped from the SVG's viewBox (xMidYMax slice) to screen pixels.
      if (nearSky && flicker.length) {
        if (!sky || skyVersion !== current.layoutVersion) {
          const r = nearSky.getBoundingClientRect();
          const scale = Math.max(r.width / 1600, r.height / 340);
          sky = { scale, ox: r.left + (r.width - 1600 * scale) / 2, oy: r.top + r.height - 340 * scale };
          skyVersion = current.layoutVersion;
        }
        for (const f of flicker) {
          if (!neonWindowLit(current, f)) continue;
          const ph = ((now + f.off) % f.period) / f.period;
          if (f.dot ? ph > 0.5 : (ph > 0.47 && ph < 0.52)) continue;
          ctx.globalAlpha = f.dot ? 0.95 : f.a;
          ctx.fillStyle = f.c;
          ctx.fillRect(sky.ox + f.x * sky.scale, sky.oy + f.y * sky.scale, f.w * sky.scale, f.h * sky.scale);
        }
        ctx.globalAlpha = 1;
      }
      bokeh.forEach(b => {
        b.y += b.vy; b.p += 0.02;
        if (b.y < -60) { b.y = H + 60; b.x = rand(0, W); }
        ctx.globalAlpha = 0.25 + Math.sin(b.p) * 0.12;
        ctx.drawImage(b.spr, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      });
      ctx.fillStyle = '#7ff6ff';
      glyphs.forEach((g, i) => {
        g.y -= g.vy; g.p += 0.05;
        if (g.y < -20) { glyphs[i] = glyph(false); return; }
        ctx.globalAlpha = 0.12 + Math.max(0, Math.sin(g.p)) * 0.25;
        const spr = g.spr;
        ctx.drawImage(spr, g.x, g.y - g.s, spr.width, spr.height);
      });
      ctx.globalAlpha = 1;

      if (now > nextTrain) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        trains.push({ dir, x: dir > 0 ? -600 : W + 600, y: H - rand(0.06, 0.16) * H, len: rand(320, 520), v: rand(9, 15) });
        nextTrain = now + rand(4000, 8000);
      }
      for (let i = trains.length - 1; i >= 0; i--) {
        const t = trains[i];
        t.x += t.v * t.dir;
        if ((t.dir > 0 && t.x - t.len > W) || (t.dir < 0 && t.x + t.len < 0)) { trains.splice(i, 1); continue; }
        const tail = t.x - t.len * t.dir;
        const g = ctx.createLinearGradient(t.x, 0, tail, 0);
        g.addColorStop(0, 'rgba(230,255,255,0.95)'); g.addColorStop(0.15, 'rgba(5,217,232,0.7)'); g.addColorStop(1, 'rgba(255,42,109,0)');
        ctx.fillStyle = g;
        ctx.fillRect(Math.min(t.x, tail), t.y, t.len, 5);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(Math.min(t.x, tail), t.y + 9, t.len, 1.5);
        ctx.globalAlpha = 1;
        ctx.drawImage(trainGlow, t.x - 40, t.y - 38, 80, 80);
      }

      // Rain: batched into a few paths (colour × alpha bucket) instead of ~250 separate strokes.
      ctx.lineWidth = 1.1;
      const buckets = new Map();
      [far, near].forEach(list => list.forEach((d, i) => {
        d.y += d.v; d.x -= d.v * 0.18;
        if (d.kind === 'near') pushFromMouse(d, 90, 0.02);
        if (d.y > H + 40) { list[i] = drop(false, d.kind); return; }
        let b = buckets.get(d.style);
        if (!b) { b = []; buckets.set(d.style, b); }
        b.push(d);
      }));
      buckets.forEach((drops, style) => {
        ctx.strokeStyle = style;
        ctx.beginPath();
        for (const d of drops) {
          ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len * 0.18, d.y - d.len);
          if (d.kind === 'near' && d.y > H - 8) { ctx.moveTo(d.x + 7, H - 3); ctx.ellipse(d.x, H - 3, 7, 1.6, 0, 0, 6.28); }
        }
        ctx.stroke();
      });

      // Lightning: a bolt + one double sky flash at most every 9 s (well under 3 flashes/second).
      if (now > nextBolt) {
        const pts = [[rand(W * 0.1, W * 0.9), 0]];
        while (pts[pts.length - 1][1] < H * rand(0.3, 0.45)) {
          const [px, py] = pts[pts.length - 1];
          pts.push([px + rand(-40, 40), py + rand(20, 50)]);
        }
        bolt = { pts, until: now + 260 };
        if (lightning) { lightning.classList.remove('strike'); void lightning.offsetWidth; lightning.classList.add('strike'); }
        nextBolt = now + rand(9000, 16000);
      }
      if (bolt && now < bolt.until) {
        ctx.globalCompositeOperation = 'lighter';
        [[8, 'rgba(120,200,255,0.25)'], [2, 'rgba(235,250,255,0.95)']].forEach(([lw, c]) => {
          ctx.strokeStyle = c; ctx.lineWidth = lw;
          ctx.beginPath(); bolt.pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        });
        ctx.globalCompositeOperation = 'source-over';
      }

      if (now > nextGlitch) {
        const title = document.querySelector('.month-hero-title');
        if (title) { title.classList.remove('ab-glitch'); void title.offsetWidth; title.classList.add('ab-glitch'); }
        nextGlitch = now + rand(6000, 10000);
      }
    };
  },

  hero() {
    const { ctx } = current;
    const k = density();
    const gate = current.root.querySelector('.ab-gate');
    const newSmoke = (init) => {
      const s = { x: rand(-50, current.W + 50), y: init ? rand(current.H * 0.4, current.H + 80) : current.H + rand(40, 120), r: rand(60, 150), vy: rand(0.25, 0.7), vx: rand(-0.2, 0.2), a: rand(0.08, 0.2), p: rand(0, 6) };
      // A puff's colours never change, so its gradient is built once on a unit circle and
      // positioned/sized with the transform (instead of a new gradient per puff per frame).
      s.grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      s.grad.addColorStop(0, `rgba(60,20,120,${s.a})`); s.grad.addColorStop(0.6, `rgba(25,8,60,${s.a * 0.6})`); s.grad.addColorStop(1, 'rgba(0,0,0,0)');
      return s;
    };
    const smoke = Array.from({ length: Math.round(34 * k) }, () => newSmoke(true));
    const newMote = (init) => {
      const m = { x: rand(0, current.W), y: init ? rand(0, current.H) : current.H + 10, vy: rand(0.3, 1.1), p: rand(0, 6), r: rand(1, 2.6), c: Math.random() < 0.65 ? 'rgba(80,180,255,0.9)' : 'rgba(170,120,255,0.9)' };
      m.spr = glowSprite(m.c);
      return m;
    };
    const motes = Array.from({ length: Math.round(70 * k) }, () => newMote(true));
    const impactGlow = glowSprite('rgba(255,230,140,0.95)', 128);
    const arcs = [];
    const impacts = [];
    let nextImpact = performance.now() + rand(2500, 5000);
    const sysLayer = current.root.querySelector('.ab-sys-layer');
    let nextWindow = performance.now() + 900;
    let gateRect = null, gateVersion = -1;

    return (now) => {
      const { W, H, dpr } = current;
      smoke.forEach((s, i) => {
        s.y -= s.vy; s.x += s.vx + Math.sin((s.p += 0.01)) * 0.3; s.r = Math.min(s.r + 0.12, 260);
        if (s.y + s.r < H * 0.25) { smoke[i] = newSmoke(false); return; }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.translate(s.x, s.y); ctx.scale(s.r, s.r);
        ctx.fillStyle = s.grad;
        ctx.beginPath(); ctx.arc(0, 0, 1, 0, 6.28); ctx.fill();
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = 'lighter';
      motes.forEach((m, i) => {
        m.p += 0.05; m.y -= m.vy; m.x += Math.sin(m.p) * 0.4;
        pushFromMouse(m, 110, 0.06);
        if (m.y < -10) { motes[i] = newMote(false); return; }
        ctx.globalAlpha = 0.45 + Math.sin(m.p * 2) * 0.35;
        const sz = m.r * 7;
        ctx.drawImage(m.spr, m.x - sz / 2, m.y - sz / 2, sz, sz);
      });

      if (gate && Math.random() < 0.12) {
        if (!gateRect || gateVersion !== current.layoutVersion) { gateRect = gate.getBoundingClientRect(); gateVersion = current.layoutVersion; }
        const r = gateRect;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const a0 = rand(0, 6.28), rx = r.width / 2 * 0.95, ry = r.height / 2 * 0.95;
        const pts = [];
        for (let j = 0; j <= 7; j++) {
          const a = a0 + j * 0.09, jit = rand(-14, 14);
          pts.push([cx + Math.cos(a) * (rx + jit), cy + Math.sin(a) * (ry + jit)]);
        }
        arcs.push({ pts, life: 1 });
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.life -= 0.12;
        if (a.life <= 0) { arcs.splice(i, 1); continue; }
        ctx.globalAlpha = 1;
        [[5, `rgba(120,170,255,${0.35 * a.life})`], [1.5, `rgba(230,245,255,${a.life})`]].forEach(([lw, c]) => {
          ctx.strokeStyle = c; ctx.lineWidth = lw;
          ctx.beginPath(); a.pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
        });
      }

      if (now > nextImpact) {
        impacts.push({ x: rand(W * 0.1, W * 0.9), y: rand(H * 0.15, H * 0.75), start: now, dir: rand(0, 6.28) });
        nextImpact = now + rand(6000, 11000);
      }
      for (let i = impacts.length - 1; i >= 0; i--) {
        const im = impacts[i];
        const t = Math.max(0, (now - im.start) / 1400);
        if (t >= 1) { impacts.splice(i, 1); continue; }
        const ease = 1 - Math.pow(1 - t, 3);
        if (t < 0.12) {
          ctx.globalAlpha = 1 - t / 0.12;
          ctx.drawImage(impactGlow, im.x - 90, im.y - 90, 180, 180);
        }
        ctx.globalAlpha = 1;
        [[1, 'rgba(255,210,63,'], [0.7, 'rgba(255,255,255,'], [0.45, 'rgba(61,165,255,']].forEach(([kk, c]) => {
          ctx.strokeStyle = c + (0.7 * (1 - t)) + ')';
          ctx.lineWidth = 3 * (1 - t) + 0.5;
          ctx.beginPath(); ctx.ellipse(im.x, im.y, ease * 260 * kk, ease * 90 * kk, 0, 0, 6.28); ctx.stroke();
        });
        ctx.strokeStyle = `rgba(255,240,200,${0.6 * (1 - t)})`;
        ctx.lineWidth = 1.2;
        for (let j = 0; j < 16; j++) {
          const a = (j / 16) * 6.28 + im.dir, r1 = ease * 60, r2 = ease * 200 + 20;
          ctx.beginPath();
          ctx.moveTo(im.x + Math.cos(a) * r1, im.y + Math.sin(a) * r1 * 0.45);
          ctx.lineTo(im.x + Math.cos(a) * r2, im.y + Math.sin(a) * r2 * 0.45);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (sysLayer && now > nextWindow) {
        showSystemWindow(sysLayer);
        nextWindow = now + rand(2600, 4600);
      }
    };
  },
};

const FALLBACK_MESSAGES = [
  { head: '[ DAILY QUEST ]', lines: [[{ t: 'Finish ' }, { t: '3', hl: true }, { t: ' topics' }], [{ t: 'Reward: ' }, { t: '+0.6 Lv', hl: true }]] },
  { head: '[ NOTICE ]', lines: [[{ t: 'Close the tutorial.' }], [{ t: 'Build it ' }, { t: 'yourself', hl: true }, { t: '.' }]] },
  { head: '[ SKILL TREE ]', lines: [[{ t: 'Backend ' }, { t: '→', hl: true }, { t: ' AI Engineer' }], [{ t: 'Keep training, hunter.' }]] },
];

// Built with DOM nodes (textContent) so app data can never inject markup.
function showSystemWindow(layer) {
  if (layer.childElementCount >= 2) return;
  let pool = FALLBACK_MESSAGES;
  try {
    const custom = messageProvider ? messageProvider() : null;
    if (Array.isArray(custom) && custom.length) pool = custom;
  } catch { /* keep fallback */ }
  const msg = pool[Math.floor(Math.random() * pool.length)];
  const el = document.createElement('div');
  el.className = 'ab-sys-window';
  el.style.left = `${rand(4, 70).toFixed(1)}%`;
  el.style.top = `${rand(14, 72).toFixed(1)}%`;
  const head = document.createElement('div');
  head.className = 'ab-sw-head';
  head.textContent = msg.head;
  el.appendChild(head);
  (msg.lines || []).forEach(segs => {
    const line = document.createElement('div');
    segs.forEach(seg => {
      const span = document.createElement('span');
      if (seg.hl) span.className = 'ab-sw-hl';
      span.textContent = seg.t;
      line.appendChild(span);
    });
    el.appendChild(line);
  });
  layer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  const c = current;
  c.timers.push(setTimeout(() => el.classList.remove('show'), 3800));
  c.timers.push(setTimeout(() => el.remove(), 4300));
  if (c.timers.length > 40) c.timers.splice(0, c.timers.length - 40);
}
