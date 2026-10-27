/* ============================================
   THEME TRANSITION — flying sword + glass shatter (switching TO an anime theme)

   1. The current screen is rasterised into an image (DOM + inlined CSS/fonts in an
      SVG <foreignObject>; live canvases are copied in) and shown on a full-screen canvas.
   2. The new theme is applied underneath.
   3. A katana flies across the screen leaving a glowing cut, cracks spread from the cut,
      and the frozen old screen breaks into glass shards that tumble and fall away,
      revealing the new theme.
   If the snapshot can't be made, the theme still switches and only the sword flies over.
   ============================================ */

import { isAnimeTheme, getAnimeMotion } from './state.js';
import { createFrameGate } from './frame-gate.js';

const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const rand = (a, b) => a + Math.random() * (b - a);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const BLADE_GLOW = { sakura: '#ff6fae', neon: '#05d9e8', hero: '#3da5ff' };
const FLY_MS = 380;          // sword crosses the screen
const CRACK_MS = 220;        // cracks spread after the cut
const SHATTER_AT = 470;      // first shards start to fall
const GRAVITY = 2600;        // px / s²
const SNAPSHOT_TIMEOUT_MS = 1200;

let running = null;          // { canvas, raf } — only one transition at a time
let callSeq = 0;             // newest switch wins if clicks overlap while a snapshot is being taken
let cssCache = null;         // inlined stylesheet text (fonts as data URLs), built once

export function canAnimateInto(themeId) {
  return isAnimeTheme(themeId) && getAnimeMotion() && !reduceMotionQuery.matches;
}

// Build the inlined CSS ahead of time (called when Settings opens) so the click feels instant.
export function prewarmThemeTransition() {
  if (cssCache) return;
  const go = () => { getInlinedCss().catch(() => {}); };
  if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 2000 }); else setTimeout(go, 300);
}

// Drop any switch still waiting on its snapshot (e.g. the user clicked back to the current theme).
export function cancelPendingThemeSwitch() {
  callSeq++;
}

// `update` must apply the new theme synchronously.
export async function switchThemeWithSword(themeId, update) {
  const mySeq = ++callSeq;
  stopRunning();
  if (!canAnimateInto(themeId)) { update(); return; }

  // Layout viewport (excludes the scrollbar) so the snapshot lays out exactly like the live page.
  const W = document.documentElement.clientWidth || window.innerWidth;
  const H = document.documentElement.clientHeight || window.innerHeight;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let oldFrame = null;
  try {
    oldFrame = await withTimeout(snapshotScreen(W, H, dpr), SNAPSHOT_TIMEOUT_MS);
  } catch {
    oldFrame = null;
  }
  if (mySeq !== callSeq) return;   // a newer theme click took over

  const canvas = document.createElement('canvas');
  canvas.className = 'theme-shatter-fx';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (oldFrame) ctx.drawImage(oldFrame, 0, 0, W, H);   // old screen frozen on top…

  update();                                           // …while the new theme is applied beneath it

  const scene = buildScene(W, H, BLADE_GLOW[themeId] || BLADE_GLOW.hero);
  running = { canvas, raf: null };
  const start = performance.now();
  const gate = createFrameGate();
  const frame = (now) => {
    if (!running || running.canvas !== canvas) return;
    if (!gate(now)) { running.raf = requestAnimationFrame(frame); return; }
    const t = (now - start) / 1000;
    const done = drawScene(ctx, scene, oldFrame, t, W, H);
    if (done) { stopRunning(); return; }
    running.raf = requestAnimationFrame(frame);
  };
  running.raf = requestAnimationFrame(frame);
}

function stopRunning() {
  if (!running) return;
  if (running.raf) cancelAnimationFrame(running.raf);
  running.canvas.remove();
  running = null;
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

// ── Snapshot: DOM → SVG foreignObject → canvas ─────────

async function getInlinedCss() {
  if (cssCache) return cssCache;
  const urls = new Map();
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const base = sheet.href || location.href;
    for (const rule of Array.from(rules)) {
      css += rule.cssText.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, u) => {
        if (u.startsWith('data:') || u.startsWith('#')) return m;
        const abs = new URL(u, base).href;
        urls.set(abs, null);
        return `url("${abs}")`;
      }) + '\n';
    }
  }
  await Promise.all(Array.from(urls.keys()).map(async (abs) => {
    try {
      const blob = await (await fetch(abs)).blob();
      urls.set(abs, await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); }));
    } catch { /* leave as-is: the resource just won't render in the snapshot */ }
  }));
  css = css.replace(/url\("([^"]+)"\)/g, (m, u) => (urls.get(u) ? `url("${urls.get(u)}")` : m));
  // Inside a foreignObject `:root` is the <svg>, so the app's variables must hang off the inner <html>.
  css = css.replace(/:root\b/g, 'html').replace(/font-display:\s*\w+/g, 'font-display: block');
  cssCache = css.split(']]>').join(']] >');
  return cssCache;
}

// An SVG image freezes CSS animations at t=0 (fade-in views would be invisible); jump them to their end state.
const FREEZE_CSS = '*,*::before,*::after{animation-delay:-3600s!important;animation-play-state:paused!important;transition:none!important;}';

async function snapshotScreen(W, H, dpr) {
  const css = await getInlinedCss();
  const body = document.body;
  const clone = body.cloneNode(true);

  // Live canvases (anime background, confetti…) don't serialise — copy their pixels in as images.
  const liveCanvases = Array.from(body.querySelectorAll('canvas'));
  const cloneCanvases = Array.from(clone.querySelectorAll('canvas'));
  liveCanvases.forEach((c, i) => {
    const target = cloneCanvases[i];
    if (!target) return;
    if (!c.width || !c.height || c.classList.contains('theme-shatter-fx')) { target.remove(); return; }
    let src = '';
    try {
      const scale = Math.min(1, 900 / Math.max(c.width, c.height));
      const tmp = document.createElement('canvas');
      tmp.width = Math.max(1, Math.round(c.width * scale)); tmp.height = Math.max(1, Math.round(c.height * scale));
      tmp.getContext('2d').drawImage(c, 0, 0, tmp.width, tmp.height);
      src = tmp.toDataURL('image/png');
    } catch { /* tainted or empty */ }
    const img = document.createElement('img');
    for (const a of Array.from(target.attributes)) {
      if (a.name !== 'width' && a.name !== 'height') img.setAttribute(a.name, a.value);
    }
    if (c.clientWidth && c.clientHeight) {
      img.setAttribute('style', (c.getAttribute('style') || '') + `;width:${c.clientWidth}px;height:${c.clientHeight}px;`);
    }
    if (src) img.setAttribute('src', src);
    target.replaceWith(img);
  });

  // Form state lives in properties, not attributes.
  const liveFields = Array.from(body.querySelectorAll('input, textarea, select'));
  const cloneFields = Array.from(clone.querySelectorAll('input, textarea, select'));
  liveFields.forEach((f, i) => {
    const c = cloneFields[i];
    if (!c) return;
    if (f.tagName === 'TEXTAREA') c.textContent = f.value;
    else if (f.tagName === 'SELECT') Array.from(c.options).forEach((o, k) => { if (k === f.selectedIndex) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
    else if (f.type === 'checkbox' || f.type === 'radio') { if (f.checked) c.setAttribute('checked', ''); else c.removeAttribute('checked'); }
    else c.setAttribute('value', f.value);
  });

  // Reproduce the current scroll position inside the fixed-size snapshot.
  const scrollY = window.scrollY;
  clone.style.height = H + 'px';
  clone.style.overflow = 'hidden';
  const main = clone.querySelector('#main');
  if (main && scrollY) {
    main.style.marginTop = `-${scrollY}px`;
    const topbar = main.querySelector('.topbar');
    if (topbar) { topbar.style.position = 'relative'; topbar.style.top = `${scrollY}px`; }
  }
  const liveNav = document.getElementById('sidebarNav');
  const cloneNav = clone.querySelector('#sidebarNav');
  if (liveNav && cloneNav && liveNav.scrollTop) {
    cloneNav.style.overflow = 'hidden';
    if (cloneNav.firstElementChild) cloneNav.firstElementChild.style.marginTop = `-${liveNav.scrollTop}px`;
  }
  clone.querySelectorAll('.cel-layer, .cel-mini-toast, .theme-shatter-fx').forEach(el => el.remove());

  // Outside the snapshot the body background is painted on the canvas, below the z-index:-1 anime
  // scenery. Inside a foreignObject it would cover it, so move it onto an isolated <html>.
  const bs = getComputedStyle(document.body);
  const rootBg = `html{isolation:isolate;height:${H}px;overflow:hidden;background-color:${bs.backgroundColor};` +
    `background-image:${bs.backgroundImage};background-size:${bs.backgroundSize};background-position:${bs.backgroundPosition};` +
    `background-repeat:${bs.backgroundRepeat};}body{background:transparent!important;}`;

  const html = document.documentElement;
  const attrs = [];
  for (const a of Array.from(html.attributes)) {
    if (a.name === 'xmlns') continue;
    attrs.push(`${a.name}="${a.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`);
  }
  const bodyXml = new XMLSerializer().serializeToString(clone);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="font-size:${getComputedStyle(html).fontSize}">` +
    `<foreignObject x="0" y="0" width="${W}" height="${H}">` +
    `<html xmlns="http://www.w3.org/1999/xhtml" ${attrs.join(' ')}><head><style><![CDATA[${css}\n${FREEZE_CSS}\n${rootBg.split(']]>').join('')}]]></style></head>${bodyXml}</html>` +
    `</foreignObject></svg>`;

  // A blob URL decodes faster than a huge data URL; the canvas only ever draws it, so tainting doesn't matter.
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    // Rasterise once at device resolution so each animation frame is a cheap bitmap copy.
    const out = document.createElement('canvas');
    out.width = Math.round(W * dpr); out.height = Math.round(H * dpr);
    out.getContext('2d').drawImage(img, 0, 0, out.width, out.height);
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ── Scene: sword path, crack grid, shards ──────────────

function buildScene(W, H, glow) {
  const diag = Math.hypot(W, H);
  const fromLeft = Math.random() < 0.5;
  const tilt = rand(0.28, 0.5) * (Math.random() < 0.5 ? -1 : 1);
  const ang = fromLeft ? tilt : Math.PI + tilt;
  const dx = Math.cos(ang), dy = Math.sin(ang);
  const P = [W / 2 + rand(-W * 0.12, W * 0.12), H / 2 + rand(-H * 0.12, H * 0.12)];
  const reach = diag * 0.75;
  const S = [P[0] - dx * reach, P[1] - dy * reach];
  const E = [P[0] + dx * reach, P[1] + dy * reach];

  // Polar crack grid around the impact point; two rays follow the cut itself.
  const rays = [ang, ang + Math.PI];
  const extra = 12;
  for (let i = 0; i < extra; i++) rays.push(ang + ((i + 0.5) / extra) * Math.PI * 2 + rand(-0.18, 0.18));
  const norm = (a) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const angles = Array.from(new Set(rays.map(norm))).sort((a, b) => a - b);
  const radii = [rand(55, 95), rand(150, 230), rand(320, 460), diag * 1.1];
  const pts = angles.map(a => radii.map((r, k) => {
    const jr = k === radii.length - 1 ? 0 : rand(-0.14, 0.14) * r;
    const ja = k === radii.length - 1 ? 0 : rand(-0.05, 0.05);
    return [P[0] + Math.cos(a + ja) * (r + jr), P[1] + Math.sin(a + ja) * (r + jr)];
  }));

  const nx = -dy, ny = dx;
  const shards = [];
  for (let i = 0; i < angles.length; i++) {
    const j = (i + 1) % angles.length;
    for (let k = 0; k < radii.length; k++) {
      const poly = k === 0
        ? [P, pts[i][0], pts[j][0]]
        : [pts[i][k - 1], pts[i][k], pts[j][k], pts[j][k - 1]];
      const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
      const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
      if (cx < -W * 0.6 || cx > W * 1.6 || cy < -H * 0.6 || cy > H * 1.6) continue;
      const distCut = Math.abs((cx - P[0]) * nx + (cy - P[1]) * ny);
      const side = Math.sign((cx - P[0]) * nx + (cy - P[1]) * ny) || 1;
      const out = Math.hypot(cx - P[0], cy - P[1]) || 1;
      shards.push({
        poly, cx, cy,
        release: SHATTER_AT / 1000 + (distCut / diag) * 0.45 + rand(0, 0.08),
        vx: ((cx - P[0]) / out) * rand(60, 220) + nx * side * rand(80, 260),
        vy: ((cy - P[1]) / out) * rand(40, 160) + ny * side * rand(80, 260) - rand(120, 320),
        spin: rand(-5, 5), flip: rand(2, 7),
      });
    }
  }
  const edges = [];
  for (let i = 0; i < angles.length; i++) {
    edges.push([P, ...pts[i]]);
    const j = (i + 1) % angles.length;
    for (let k = 0; k < radii.length - 1; k++) edges.push([pts[i][k], pts[j][k]]);
  }
  return { S, E, P, ang, dx, dy, shards, edges, glow, diag };
}

function drawCracks(c, sc, crackT) {
  c.save();
  c.lineJoin = 'round';
  c.beginPath();
  for (const edge of sc.edges) {
    edge.forEach((p, i) => {
      const q = [sc.P[0] + (p[0] - sc.P[0]) * crackT, sc.P[1] + (p[1] - sc.P[1]) * crackT];
      i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
    });
  }
  c.strokeStyle = 'rgba(255,255,255,0.85)';
  c.lineWidth = 1.3;
  c.shadowColor = sc.glow; c.shadowBlur = 8;
  c.stroke();
  c.restore();
}

function drawScene(ctx, sc, oldFrame, t, W, H) {
  ctx.clearRect(0, 0, W, H);
  const fly = Math.min(1, (t * 1000) / FLY_MS);
  const e = easeInOut(fly);
  const swordX = sc.S[0] + (sc.E[0] - sc.S[0]) * e;
  const swordY = sc.S[1] + (sc.E[1] - sc.S[1]) * e;
  let allGone = t * 1000 > SHATTER_AT;

  // 1. Frozen old screen…
  if (oldFrame) {
    // 2. …with cracks spreading from the cut (drawn before the holes so fallen glass takes its cracks along)…
    const crackT = Math.max(0, Math.min(1, (t * 1000 - FLY_MS * 0.7) / CRACK_MS));
    if (crackT >= 1) {
      // Once the cracks are fully grown, "old screen + cracks (with glow)" is the same every frame:
      // render it once with the exact same steps and then just copy the pixels 1:1.
      if (!sc.crackedFrame) {
        const base = document.createElement('canvas');
        base.width = ctx.canvas.width; base.height = ctx.canvas.height;
        const bctx = base.getContext('2d');
        bctx.setTransform(ctx.getTransform());
        bctx.drawImage(oldFrame, 0, 0, W, H);
        drawCracks(bctx, sc, 1);
        sc.crackedFrame = base;
      }
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(sc.crackedFrame, 0, 0);
      ctx.restore();
    } else {
      ctx.drawImage(oldFrame, 0, 0, W, H);
      if (crackT > 0) drawCracks(ctx, sc, crackT);
    }

    // …and holes where shards have broken away.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;   // also erases the crack glow along the hole's rim
    for (const s of sc.shards) {
      if (t < s.release) continue;
      ctx.beginPath();
      s.poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    // 3. Falling glass shards (carrying their piece of the old screen).
    for (const s of sc.shards) {
      if (t < s.release) { allGone = false; continue; }
      const dt = t - s.release;
      const ox = s.vx * dt, oy = s.vy * dt + 0.5 * GRAVITY * dt * dt;
      if (s.cy + oy - 200 > H) continue;
      allGone = false;
      const flip = Math.cos(s.flip * dt);
      ctx.save();
      ctx.translate(s.cx + ox, s.cy + oy);
      ctx.rotate(s.spin * dt);
      ctx.scale(Math.max(0.15, Math.abs(flip)), 1);
      ctx.translate(-s.cx, -s.cy);
      ctx.globalAlpha = Math.max(0, 1 - dt * 0.55);
      ctx.beginPath();
      s.poly.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.save();
      ctx.clip();
      ctx.drawImage(oldFrame, 0, 0, W, H);
      const g = ctx.createLinearGradient(s.cx - 80, s.cy - 80, s.cx + 80, s.cy + 80);
      g.addColorStop(0, 'rgba(255,255,255,0.22)');
      g.addColorStop(0.5, 'rgba(255,255,255,0.02)');
      g.addColorStop(1, 'rgba(255,255,255,0.12)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // 4. The cut line left behind the blade.
  const cutFade = Math.max(0, 1 - Math.max(0, t * 1000 - FLY_MS) / 500);
  if (cutFade > 0) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    [[18, sc.glow, 0.25], [7, sc.glow, 0.6], [2.2, '#ffffff', 1]].forEach(([lw, c, a]) => {
      ctx.globalAlpha = a * cutFade;
      ctx.strokeStyle = c; ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(sc.S[0], sc.S[1]); ctx.lineTo(swordX, swordY); ctx.stroke();
    });
    ctx.restore();
  }

  // 5. The flying sword (with motion ghosts) until it leaves the screen.
  if (fly < 1) {
    allGone = false;
    for (let k = 4; k >= 0; k--) {
      const ek = easeInOut(Math.max(0, fly - k * 0.035));
      const gx = sc.S[0] + (sc.E[0] - sc.S[0]) * ek, gy = sc.S[1] + (sc.E[1] - sc.S[1]) * ek;
      drawKatana(ctx, gx, gy, sc.ang, k === 0 ? 1 : 0.18 / k, sc.glow);
    }
  }
  return allGone && t * 1000 > FLY_MS + 600;
}

// Original stylised katana pointing along +x (tip forward), centred on (x, y).
function drawKatana(ctx, x, y, angle, alpha, glow) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.globalAlpha = alpha;
  // glow
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = glow; ctx.globalAlpha = alpha * 0.35; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-40, 0); ctx.quadraticCurveTo(70, -10, 190, -4); ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = alpha;
  // blade (slight curve, edge on the bottom)
  const blade = ctx.createLinearGradient(0, -7, 0, 6);
  blade.addColorStop(0, '#8d98aa'); blade.addColorStop(0.45, '#f4f8ff'); blade.addColorStop(1, '#c6d0de');
  ctx.fillStyle = blade;
  ctx.beginPath();
  ctx.moveTo(-42, -4);
  ctx.quadraticCurveTo(70, -14, 196, -6);   // back of the blade up to the tip
  ctx.lineTo(186, 0);
  ctx.quadraticCurveTo(70, -4, -42, 4);     // cutting edge
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-40, 3); ctx.quadraticCurveTo(70, -5, 186, 0); ctx.stroke();
  // habaki (collar)
  ctx.fillStyle = '#d9a441'; ctx.fillRect(-50, -5, 9, 10);
  // tsuba (guard)
  ctx.fillStyle = '#2b2b33';
  ctx.beginPath(); ctx.ellipse(-55, 0, 5, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = glow; ctx.lineWidth = 1.2; ctx.stroke();
  // tsuka (handle) with diamond wrap
  ctx.fillStyle = '#1a1a22'; ctx.fillRect(-128, -5.5, 72, 11);
  ctx.strokeStyle = 'rgba(230,230,240,0.55)'; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let hx = -124; hx < -60; hx += 9) { ctx.moveTo(hx, -5); ctx.lineTo(hx + 4.5, 0); ctx.lineTo(hx, 5); ctx.moveTo(hx + 4.5, 0); ctx.lineTo(hx + 9, -5); }
  ctx.stroke();
  // kashira (pommel)
  ctx.fillStyle = '#d9a441'; ctx.fillRect(-132, -6, 5, 12);
  ctx.restore();
}
