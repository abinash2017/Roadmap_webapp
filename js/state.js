/* ============================================
   STATE MANAGEMENT  (API-backed + localStorage cache)
   Uses FastAPI backend with MS SQL when available.
   Falls back to localStorage if API is down.
   Local cache is always updated first for instant UI.
   ============================================ */

import { showToast } from './toast.js';

// ── Shared mutable state object ──────────
// All modules import this object and mutate its properties directly.
export const state = {
  apiAvailable: false,
  cache: {},
  dbWarningThrottle: 0,
  currentView: 'overview',
  firstRender: true,
  lastCompletedMonths: new Set(),
  profiles: [],
  activeProfileId: null,
};

export const API_BASE = 'http://127.0.0.1:8000/api';
// Static hosting (e.g. GitHub Pages) has no backend, so run browser-only. `?demo` forces it locally.
export const DEMO_MODE = !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
  || new URLSearchParams(location.search).has('demo');
export const STORAGE_KEY = 'ai-roadmap-v1';
// Last server-synced copy of the cache, taken on the first offline save; diffed on reconnect.
export const OFFLINE_BASE_KEY = 'ai-roadmap-v1-offline-base';

// ── Theme System ─────────────────────────
export const THEMES = [
  { id: 'dark',    name: 'Dark',    colors: ['#1c1c1f', '#242428', '#2b2b30', '#0078d4'] },
  { id: 'sakura',  name: 'Sakura Night',  colors: ['#0d0a1c', '#1e163a', '#ff6fae', '#b388ff'], anime: true },
  { id: 'neon',    name: 'Neon Tokyo',    colors: ['#06060c', '#0e0e1e', '#ff2a6d', '#05d9e8'], anime: true },
  { id: 'hero',    name: 'Level Up Hero', colors: ['#03050d', '#08102a', '#3da5ff', '#ffd23f'], anime: true },
];

export function isAnimeTheme(themeId) {
  return !!THEMES.find(t => t.id === themeId && t.anime);
}

// Saved themes that no longer exist (e.g. the removed High Contrast / Dracula / Nord) fall back to Dark.
export function normalizeTheme(themeId) {
  return THEMES.some(t => t.id === themeId) ? themeId : 'dark';
}

export function getTheme() {
  return state.cache._theme ? normalizeTheme(state.cache._theme) : 'neon';
}

export function setTheme(themeId) {
  themeId = normalizeTheme(themeId);
  state.cache._theme = themeId;
  saveCache();
  applyTheme(themeId);
  if (state.apiAvailable) {
    api('/settings/theme', { method: 'PUT', body: JSON.stringify({ value: themeId }) });
  }
}

export function applyTheme(themeId) {
  themeId = normalizeTheme(themeId);
  if (themeId === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }
  // Accent only applies to Dark — re-apply (or clear) it whenever the theme changes.
  applyAccent(getAccent(), themeId);
}

// ── Anime background animation on/off (global, default on) ──
export function getAnimeMotion() {
  return state.cache._animeMotion !== false;
}

export function setAnimeMotion(on) {
  state.cache._animeMotion = !!on;
  saveCache();
  if (state.apiAvailable) {
    api('/settings/anime_motion', { method: 'PUT', body: JSON.stringify({ value: on ? 'on' : 'off' }) });
  }
}

// ── Limit animations to 60 fps (global, default on). Off = draw at the screen's own refresh rate. ──
export function getFpsLimit60() {
  return state.cache._fps60 !== false;
}

export function setFpsLimit60(on) {
  state.cache._fps60 = !!on;
  saveCache();
  if (state.apiAvailable) {
    api('/settings/fps_limit', { method: 'PUT', body: JSON.stringify({ value: on ? '60' : 'off' }) });
  }
}

// ── Completion animation style (global, default "auto" = match theme) ──
export const CELEBRATION_STYLE_IDS = ['auto', 'confetti', 'levelup', 'impact', 'petals', 'glitch', 'minimal'];

export function normalizeCelebrationStyle(id) {
  return CELEBRATION_STYLE_IDS.includes(id) ? id : 'auto';
}

export function getCelebrationStyle() {
  return normalizeCelebrationStyle(state.cache._celebStyle);
}

export function setCelebrationStyle(id) {
  id = normalizeCelebrationStyle(id);
  state.cache._celebStyle = id;
  saveCache();
  if (state.apiAvailable) {
    api('/settings/celebration_style', { method: 'PUT', body: JSON.stringify({ value: id }) });
  }
}

// ── Startup intro animation on/off (global, default on) ──
export function getStartupAnim() {
  return state.cache._startupAnim !== false;
}

export function setStartupAnim(on) {
  state.cache._startupAnim = !!on;
  saveCache();
  if (state.apiAvailable) {
    api('/settings/startup_anim', { method: 'PUT', body: JSON.stringify({ value: on ? 'on' : 'off' }) });
  }
}

// ── Neon Tokyo page transition: "data decode" on, plain fade off (global, default on) ──
export function getNeonDecode() {
  return state.cache._neonDecode !== false;
}

export function setNeonDecode(on) {
  state.cache._neonDecode = !!on;
  saveCache();
  if (state.apiAvailable) {
    api('/settings/neon_decode', { method: 'PUT', body: JSON.stringify({ value: on ? 'on' : 'off' }) });
  }
}

// ── Accent color picker ──────────────────
export const ACCENTS = [
  { id: 'default', name: 'Theme default', color: '' },
  { id: 'blue',    name: 'Azure',   color: '#0078d4', light: '#569cd6', dark: '#005a9e' },
  { id: 'indigo',  name: 'Indigo',  color: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
  { id: 'violet',  name: 'Violet',  color: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
  { id: 'fuchsia', name: 'Fuchsia', color: '#d946ef', light: '#e879f9', dark: '#c026d3' },
  { id: 'pink',    name: 'Pink',    color: '#ec4899', light: '#f472b6', dark: '#db2777' },
  { id: 'rose',    name: 'Rose',    color: '#f43f5e', light: '#fb7185', dark: '#e11d48' },
  { id: 'orange',  name: 'Orange',  color: '#f97316', light: '#fb923c', dark: '#ea580c' },
  { id: 'amber',   name: 'Amber',   color: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
  { id: 'lime',    name: 'Lime',    color: '#84cc16', light: '#a3e635', dark: '#65a30d' },
  { id: 'emerald', name: 'Emerald', color: '#10b981', light: '#34d399', dark: '#059669' },
  { id: 'teal',    name: 'Teal',    color: '#14b8a6', light: '#2dd4bf', dark: '#0d9488' },
  { id: 'cyan',    name: 'Cyan',    color: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
];

export function getAccent() {
  return state.cache._accent || 'default';
}

export function getCustomAccent() {
  return state.cache._accentCustom || '#0078d4';
}

export function setAccent(id, customHex) {
  state.cache._accent = id;
  if (id === 'custom' && customHex) state.cache._accentCustom = customHex;
  saveCache();
  applyAccent(id);
  if (state.apiAvailable) {
    const value = id === 'custom' ? `custom:${state.cache._accentCustom}` : id;
    api('/settings/accent', { method: 'PUT', body: JSON.stringify({ value }) });
  }
}

// A user-picked accent overrides the Dark theme's accent via inline custom props.
// Anime themes always use their own palette, so the accent is cleared while one is active.
const ACCENT_PROPS = ['--accent', '--accent-light', '--accent-dark', '--accent-glow'];
export function applyAccent(id, themeId = getTheme()) {
  const root = document.documentElement;
  if (isAnimeTheme(themeId)) {
    ACCENT_PROPS.forEach(p => root.style.removeProperty(p));
    return;
  }
  let color, light, dark;
  if (id === 'custom') {
    color = state.cache._accentCustom || '#0078d4';
    light = `color-mix(in srgb, ${color} 72%, white)`;
    dark  = `color-mix(in srgb, ${color} 82%, black)`;
  } else {
    const a = ACCENTS.find(x => x.id === id);
    if (!a || !a.color) {
      ACCENT_PROPS.forEach(p => root.style.removeProperty(p));
      return;
    }
    color = a.color; light = a.light; dark = a.dark;
  }
  root.style.setProperty('--accent', color);
  root.style.setProperty('--accent-light', light);
  root.style.setProperty('--accent-dark', dark);
  root.style.setProperty('--accent-glow', `color-mix(in srgb, ${color} 14%, transparent)`);
}

// ── Markdown rendering helper ────────────
export function renderMarkdown(text) {
  if (!text) return '';
  if (typeof marked !== 'undefined') {
    try {
      const renderer = new marked.Renderer();
      const opts = {
        breaks: true,
        gfm: true,
        renderer: renderer
      };
      if (typeof marked.setOptions === 'function') {
        marked.setOptions(opts);
      }
      let html = (typeof marked.parse === 'function') ? marked.parse(text) : marked(text);
      return sanitizeMarkdownHtml(html);
    } catch (e) {
      console.warn('Markdown parse error:', e);
    }
  }
  return escapeHtml(text).replace(/\n/g, '<br>');
}

// ── HTML sanitizer ───────────────────────
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function sanitizeMarkdownHtml(html) {
  if (typeof DOMParser === 'undefined') {
    return escapeHtml(html).replace(/\n/g, '<br>');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="md-root">${html}</div>`, 'text/html');
  const root = doc.getElementById('md-root');
  if (!root) return '';

  const allowedTags = new Map([
    ['A', new Set(['href', 'title', 'target', 'rel'])],
    ['B', new Set()],
    ['BLOCKQUOTE', new Set(['cite'])],
    ['BR', new Set()],
    ['CODE', new Set(['class'])],
    ['DEL', new Set()],
    ['EM', new Set()],
    ['H1', new Set()],
    ['H2', new Set()],
    ['H3', new Set()],
    ['H4', new Set()],
    ['H5', new Set()],
    ['H6', new Set()],
    ['HR', new Set()],
    ['I', new Set()],
    ['KBD', new Set()],
    ['LI', new Set()],
    ['OL', new Set(['start'])],
    ['P', new Set()],
    ['PRE', new Set(['class'])],
    ['S', new Set()],
    ['SMALL', new Set()],
    ['SPAN', new Set(['class'])],
    ['STRONG', new Set()],
    ['SUB', new Set()],
    ['SUP', new Set()],
    ['TABLE', new Set(['class'])],
    ['TBODY', new Set()],
    ['TD', new Set(['colspan', 'rowspan', 'class'])],
    ['TH', new Set(['colspan', 'rowspan', 'class'])],
    ['THEAD', new Set()],
    ['TR', new Set()],
    ['UL', new Set()],
  ]);

  const blockedTags = new Set([
    'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON',
    'TEXTAREA', 'SELECT', 'OPTION', 'SVG', 'MATH', 'LINK', 'META', 'BASE', 'NOSCRIPT'
  ]);

  const isSafeUrl = (value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) return false;
    if (trimmed.startsWith('#')) return true;
    try {
      const parsed = new URL(trimmed, window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  Array.from(root.querySelectorAll('*')).reverse().forEach(el => {
    const tag = el.tagName;
    if (blockedTags.has(tag)) {
      el.remove();
      return;
    }

    const allowedAttrs = allowedTags.get(tag);
    if (!allowedAttrs) {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
      }
      return;
    }

    Array.from(el.attributes).forEach(attr => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;
      if (!allowedAttrs.has(attrName)) {
        el.removeAttribute(attr.name);
        return;
      }

      if (attrName === 'href') {
        if (!isSafeUrl(attrValue)) {
          el.removeAttribute(attr.name);
          return;
        }
        if ((el.getAttribute('target') || '').toLowerCase() === '_blank') {
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }

      if (attrName === 'target') {
        const target = attrValue.toLowerCase();
        if (!['_blank', '_self', '_parent', '_top'].includes(target)) {
          el.removeAttribute(attr.name);
        } else if (target === '_blank') {
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }

      if ((attrName === 'start' || attrName === 'colspan' || attrName === 'rowspan') && !/^\d+$/.test(attrValue)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return root.innerHTML;
}

// ── Local cache helpers ──────────────────
export function loadCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.cache = raw ? JSON.parse(raw) : {};
  } catch { state.cache = {}; }
  return state.cache;
}

export function saveCache() {
  const offline = !state.apiAvailable && !DEMO_MODE;
  try {
    if (offline && localStorage.getItem(OFFLINE_BASE_KEY) === null) {
      localStorage.setItem(OFFLINE_BASE_KEY, localStorage.getItem(STORAGE_KEY) || '{}');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cache));
  } catch (e) {
    console.warn('Could not write local cache:', e.message);
  }
  if (offline) {
    const now = Date.now();
    if (now - state.dbWarningThrottle > 30000) {
      state.dbWarningThrottle = now;
      showToast('Database offline — saved in this browser, will sync when it reconnects', 'warning', 4000);
    }
  }
}

// ── API helper (fire-and-forget with error handling) ──
export async function api(path, options = {}, timeout = 2000) {
  if (DEMO_MODE) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API call failed: ${path}`, e.message);
    return null;
  }
}
