/* ============================================
   API OPERATIONS — data layer (CRUD + sync)
   All state access, API calls, and local cache
   operations for roadmap data.
   ============================================ */

import { state, api, saveCache, applyTheme, applyAccent, normalizeTheme, normalizeCelebrationStyle, OFFLINE_BASE_KEY } from './state.js';
import { getMonthsForVariant } from './data.js';
import { showToast } from './toast.js';

// ── Active roadmap resolution ────────────────────

export function getActiveRoadmapVariant() {
  if (state.profiles && state.activeProfileId != null) {
    const p = state.profiles.find(x => x.id === state.activeProfileId);
    if (p && p.roadmap_variant) return p.roadmap_variant;
  }
  const cached = state.cache && state.cache._profile;
  if (cached && cached.roadmap_variant) return cached.roadmap_variant;
  return 'ai_llm';
}

export function activeMonths() {
  return getMonthsForVariant(getActiveRoadmapVariant());
}

// Progress cache keys are namespaced by variant so each roadmap tracks separately.
function checklistCacheKey(monthId) {
  return `checklist_${getActiveRoadmapVariant()}_${monthId}`;
}
function daycheckCacheKey(monthId) {
  return `daycheck_${getActiveRoadmapVariant()}_${monthId}`;
}

// One-time: move legacy un-namespaced progress into the active variant's namespace.
export function migrateLegacyProgressKeys() {
  const variant = getActiveRoadmapVariant();
  let changed = false;
  for (let mid = 0; mid < 10; mid++) {
    const oldCl = `checklist_${mid}`, newCl = `checklist_${variant}_${mid}`;
    if (state.cache[oldCl] && state.cache[newCl] === undefined) {
      state.cache[newCl] = state.cache[oldCl];
      delete state.cache[oldCl];
      changed = true;
    }
    const oldDc = `daycheck_${mid}`, newDc = `daycheck_${variant}_${mid}`;
    if (state.cache[oldDc] && state.cache[newDc] === undefined) {
      state.cache[newDc] = state.cache[oldDc];
      delete state.cache[oldDc];
      changed = true;
    }
  }
  if (changed) saveCache();
}

// ── Checklist ────────────────────────────

export function getChecklistState(monthId) {
  return state.cache[checklistCacheKey(monthId)] || {};
}

export function setChecklistItem(monthId, index, checked) {
  const key = checklistCacheKey(monthId);
  if (!state.cache[key]) state.cache[key] = {};
  state.cache[key][index] = checked;
  saveCache();

  if (state.apiAvailable) {
    api(`/checklist/${monthId}/${index}`, {
      method: 'PUT',
      body: JSON.stringify({ checked })
    });
  }
  // Note: confetti is handled in the render layer event handler
}

// ── Notes ────────────────────────────────

export function getNotes(monthId) {
  return state.cache[`notes_${monthId}`] || '';
}

export async function setNotes(monthId, text) {
  state.cache[`notes_${monthId}`] = text;
  saveCache();

  if (state.apiAvailable) {
    const result = await api(`/notes/${monthId}`, {
      method: 'PUT',
      body: JSON.stringify({ content: text })
    }, 8000);
    return result;
  }
  return null;
}

// ── Resource & Repo Links ────────────────

export function getResourceLink(monthId, itemIndex) {
  return state.cache[`reslink_${monthId}_${itemIndex}`] || '';
}

export function setResourceLink(monthId, itemIndex, url) {
  const key = `reslink_${monthId}_${itemIndex}`;
  state.cache[key] = url;
  saveCache();
  if (state.apiAvailable) {
    api(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value: url }) });
  }
}

export function getRepoLink(monthId, itemIndex) {
  return state.cache[`repolink_${monthId}_${itemIndex}`] || '';
}

export function setRepoLink(monthId, itemIndex, url) {
  const key = `repolink_${monthId}_${itemIndex}`;
  state.cache[key] = url;
  saveCache();
  if (state.apiAvailable) {
    api(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value: url }) });
  }
}

// ── Week Notes ───────────────────────────

export function getWeekNotes(monthId, weekIdx) {
  const key = `weeknotes_${monthId}_${weekIdx}`;
  return state.cache[key] || '';
}

export function setWeekNotes(monthId, weekIdx, text) {
  const key = `weeknotes_${monthId}_${weekIdx}`;
  state.cache[key] = text;
  saveCache();

  if (state.apiAvailable) {
    api(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value: text })
    });
  }
}

// ── Day-Level Checkboxes ─────────────────

export function getDayCheckState(monthId, weekIdx, dayIdx, topicIdx) {
  const key = daycheckCacheKey(monthId);
  if (!state.cache[key]) return false;
  const sub = `${weekIdx}_${dayIdx}_${topicIdx}`;
  return state.cache[key][sub] || false;
}

export function setDayCheck(monthId, weekIdx, dayIdx, topicIdx, checked) {
  const key = daycheckCacheKey(monthId);
  if (!state.cache[key]) state.cache[key] = {};
  const sub = `${weekIdx}_${dayIdx}_${topicIdx}`;
  state.cache[key][sub] = checked;
  saveCache();

  if (state.apiAvailable) {
    api(`/settings/daycheck_${monthId}`, {
      method: 'PUT',
      body: JSON.stringify({ value: JSON.stringify(state.cache[key]) })
    });
  }
}

export function getDayProgress(monthId) {
  const key = daycheckCacheKey(monthId);
  const data = state.cache[key] || {};
  let total = 0, done = 0;
  const months = activeMonths();
  if (!months[monthId]) return { done: 0, total: 0, percent: 0 };
  months[monthId].weeks.forEach((w, wi) => {
    w.days.forEach((d, di) => {
      d.topics.forEach((t, ti) => {
        total++;
        if (data[`${wi}_${di}_${ti}`]) done++;
      });
    });
  });
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

// ── Streak ───────────────────────────────

export function getStreak() {
  const lastDate = state.cache['streak_last_date'] || '';
  const count = parseInt(state.cache['streak_count']) || 0;
  return { lastDate, count };
}

export function updateStreak() {
  const today = new Date();
  const todayKey = todayStr(); // use local time consistent with the rest of the app
  const streak = getStreak();

  if (streak.lastDate === todayKey) return streak; // already logged today

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

  let newCount;
  if (streak.lastDate === yKey) {
    newCount = streak.count + 1; // consecutive day
  } else {
    newCount = 1; // streak broken, restart
  }

  state.cache['streak_last_date'] = todayKey;
  state.cache['streak_count'] = newCount;
  saveCache();

  if (state.apiAvailable) {
    api('/settings/streak_last_date', {
      method: 'PUT', body: JSON.stringify({ value: todayKey })
    });
    api('/settings/streak_count', {
      method: 'PUT', body: JSON.stringify({ value: String(newCount) })
    });
  }

  return { lastDate: todayKey, count: newCount };
}

// ── Anti-helplessness: Stuck Log ─────────
// One key per month: { "<wi>_<di>_<ti>": [ {id, topic, problem, tried, solution, created_at, updated_at, solved_at} ] }

function putProfileSetting(key, value) {
  if (state.apiAvailable) {
    api(`/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
  }
}

function stuckLogCacheKey(monthId) {
  return `stucklog_${getActiveRoadmapVariant()}_${monthId}`;
}

export function stuckTopicKey(weekIdx, dayIdx, topicIdx) {
  return `${weekIdx}_${dayIdx}_${topicIdx}`;
}

export function getStuckLog(monthId) {
  const data = state.cache[stuckLogCacheKey(monthId)];
  return data && typeof data === 'object' ? data : {};
}

export function getTopicStuckEntries(monthId, weekIdx, dayIdx, topicIdx) {
  const list = getStuckLog(monthId)[stuckTopicKey(weekIdx, dayIdx, topicIdx)];
  return Array.isArray(list) ? list : [];
}

function saveStuckLog(monthId, log) {
  const key = stuckLogCacheKey(monthId);
  Object.keys(log).forEach(k => { if (!log[k] || !log[k].length) delete log[k]; });
  state.cache[key] = log;
  saveCache();
  putProfileSetting(key, JSON.stringify(log));
}

function cleanStuckFields(fields) {
  const clip = (v, max) => String(v || '').trim().slice(0, max);
  return {
    problem: clip(fields.problem, 2000),
    tried: clip(fields.tried, 4000),
    solution: clip(fields.solution, 4000),
  };
}

export function addStuckEntry(monthId, weekIdx, dayIdx, topicIdx, topicText, fields) {
  const clean = cleanStuckFields(fields);
  if (!clean.problem) return null;
  const now = new Date().toISOString();
  const entry = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    topic: String(topicText || '').slice(0, 300),
    ...clean,
    created_at: now,
    updated_at: now,
    solved_at: clean.solution ? now : null,
  };
  const log = { ...getStuckLog(monthId) };
  const tk = stuckTopicKey(weekIdx, dayIdx, topicIdx);
  log[tk] = [...(log[tk] || []), entry];
  saveStuckLog(monthId, log);
  return entry;
}

export function updateStuckEntry(monthId, weekIdx, dayIdx, topicIdx, entryId, fields) {
  const clean = cleanStuckFields(fields);
  if (!clean.problem) return null;
  const log = { ...getStuckLog(monthId) };
  const tk = stuckTopicKey(weekIdx, dayIdx, topicIdx);
  let updated = null;
  log[tk] = (log[tk] || []).map(e => {
    if (e.id !== entryId) return e;
    const now = new Date().toISOString();
    updated = {
      ...e,
      ...clean,
      updated_at: now,
      solved_at: clean.solution ? (e.solved_at || now) : null,
    };
    return updated;
  });
  if (updated) saveStuckLog(monthId, log);
  return updated;
}

export function deleteStuckEntry(monthId, weekIdx, dayIdx, topicIdx, entryId) {
  const log = { ...getStuckLog(monthId) };
  const tk = stuckTopicKey(weekIdx, dayIdx, topicIdx);
  log[tk] = (log[tk] || []).filter(e => e.id !== entryId);
  saveStuckLog(monthId, log);
}

// Flattened list of every entry in a month, with its topic coordinates.
export function getMonthStuckEntries(monthId) {
  const out = [];
  Object.entries(getStuckLog(monthId)).forEach(([tk, list]) => {
    const [wi, di, ti] = tk.split('_').map(n => parseInt(n));
    (Array.isArray(list) ? list : []).forEach(e => out.push({ ...e, monthId, wi, di, ti }));
  });
  return out.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export function getStuckStats() {
  let total = 0, solved = 0;
  activeMonths().forEach(m => {
    getMonthStuckEntries(m.id).forEach(e => {
      total++;
      if (e.solution) solved++;
    });
  });
  return { total, solved, open: total - solved };
}

// ── Anti-helplessness: Rebuild From Scratch ──
// One key per month: { "<repoIdx>": "<ISO date rebuilt>" }

function rebuildCacheKey(monthId) {
  return `rebuild_${getActiveRoadmapVariant()}_${monthId}`;
}

// Blog posts and "(extend …)" notes aren't standalone projects you can rebuild.
export function isRebuildableRepo(name) {
  const n = String(name || '').trim();
  if (!n) return false;
  return !n.startsWith('(') || /^\(optional:/i.test(n);
}

export function getRebuildState(monthId) {
  const data = state.cache[rebuildCacheKey(monthId)];
  return data && typeof data === 'object' ? data : {};
}

export function setRebuildDone(monthId, repoIdx, done) {
  const key = rebuildCacheKey(monthId);
  const next = { ...getRebuildState(monthId) };
  if (done) next[repoIdx] = new Date().toISOString();
  else delete next[repoIdx];
  state.cache[key] = next;
  saveCache();
  putProfileSetting(key, JSON.stringify(next));
}

export function getRebuildStats() {
  let total = 0, done = 0;
  activeMonths().forEach(m => {
    const st = getRebuildState(m.id);
    (m.repos || []).forEach((r, ri) => {
      if (!isRebuildableRepo(r)) return;
      total++;
      if (st[ri]) done++;
    });
  });
  return { total, done };
}

// ── Anti-helplessness: Consume vs Build time log ──
// One key per day: timelog_<YYYY-MM-DD> = { consume: hrs, build: hrs }

export const BUILD_TO_CONSUME_TARGET = 3;

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function cleanHours(v) {
  const n = parseFloat(v);
  if (!isFinite(n) || n < 0) return 0;
  return Math.min(24, Math.round(n * 4) / 4);
}

export function getTimeLog(dateStr) {
  const data = state.cache[`timelog_${dateStr}`];
  return {
    consume: cleanHours(data && data.consume),
    build: cleanHours(data && data.build),
  };
}

export function setTimeLog(dateStr, consume, build) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || '')) return null;
  const c = cleanHours(consume);
  let b = cleanHours(build);
  if (c + b > 24) b = Math.max(0, 24 - c);
  const key = `timelog_${dateStr}`;
  state.cache[key] = { consume: c, build: b };
  saveCache();
  putProfileSetting(key, JSON.stringify(state.cache[key]));
  return state.cache[key];
}

// days = N → the last N days including today; days = null → all-time.
export function getTimeTotals(days = 7) {
  let consume = 0, build = 0;
  if (days == null) {
    Object.keys(state.cache).forEach(k => {
      if (!k.startsWith('timelog_')) return;
      const t = getTimeLog(k.slice('timelog_'.length));
      consume += t.consume;
      build += t.build;
    });
  } else {
    getTimeSeries(days).forEach(d => { consume += d.consume; build += d.build; });
  }
  return { consume, build };
}

export function getTimeSeries(days = 7) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const ds = dateKey(d);
    out.push({ date: ds, ...getTimeLog(ds) });
  }
  return out;
}

// level: 'none' (nothing logged) | 'good' (≥ 1:3) | 'warn' (building, but < 1:3) | 'danger' (consuming more than building)
export function getConsumeBuildStatus(consume, build) {
  if (consume <= 0 && build <= 0) return { level: 'none', ratio: null };
  if (consume <= 0) return { level: 'good', ratio: Infinity };
  const ratio = build / consume;
  if (ratio >= BUILD_TO_CONSUME_TARGET) return { level: 'good', ratio };
  if (ratio >= 1) return { level: 'warn', ratio };
  return { level: 'danger', ratio };
}

// ── Anti-helplessness: Weekly Solo Challenge ──
// One key per ISO week: challenge_<YYYY>-W<ww> = { seed, title, twist, custom, done, done_at, reflection }

export function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

// Monday–Sunday bounds of the week containing `date` (local time).
export function weekBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export function getChallengeState(weekKey) {
  const data = state.cache[`challenge_${weekKey}`];
  return {
    seed: 0, title: '', twist: '', custom: false, done: false, done_at: null, reflection: '',
    ...(data && typeof data === 'object' ? data : {}),
  };
}

export function setChallengeState(weekKey, patch) {
  const key = `challenge_${weekKey}`;
  const next = { ...getChallengeState(weekKey), ...patch };
  next.title = String(next.title || '').slice(0, 300);
  next.twist = String(next.twist || '').slice(0, 300);
  next.reflection = String(next.reflection || '').slice(0, 4000);
  state.cache[key] = next;
  saveCache();
  putProfileSetting(key, JSON.stringify(next));
  return next;
}

export function getChallengeDoneCount() {
  return Object.keys(state.cache).filter(k => {
    if (!k.startsWith('challenge_')) return false;
    const v = state.cache[k];
    return v && typeof v === 'object' && v.done;
  }).length;
}

// ── DSA track ────────────────────────────
// One key per profile: dsa_progress = { "<problemId>": "<ISO time solved>" } (ids from js/dsa-sheet.js)

const DSA_PROGRESS_KEY = 'dsa_progress';

export function getDsaProgress() {
  const data = state.cache[DSA_PROGRESS_KEY];
  return data && typeof data === 'object' ? data : {};
}

export function setDsaSolved(problemId, solved) {
  const next = { ...getDsaProgress() };
  if (solved) next[problemId] = new Date().toISOString();
  else delete next[problemId];
  state.cache[DSA_PROGRESS_KEY] = next;
  saveCache();
  putProfileSetting(DSA_PROGRESS_KEY, JSON.stringify(next));
}

// ── Search ───────────────────────────────

export function searchAllMonths(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  activeMonths().forEach(m => {
    if (m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) {
      results.push({ monthId: m.id, type: 'month', text: m.title, sub: m.description });
    }
    m.goals.forEach(g => {
      if (g.toLowerCase().includes(q)) {
        results.push({ monthId: m.id, type: 'goal', text: g, sub: `Month ${m.num}` });
      }
    });
    m.weeks.forEach((w) => {
      w.days.forEach(d => {
        d.topics.forEach(t => {
          if (t.toLowerCase().includes(q)) {
            results.push({ monthId: m.id, type: 'topic', text: t, sub: `Month ${m.num} → ${w.title}` });
          }
        });
      });
    });
    m.checklist.forEach(c => {
      if (c.toLowerCase().includes(q)) {
        results.push({ monthId: m.id, type: 'checklist', text: c, sub: `Month ${m.num} checklist` });
      }
    });
    m.resources.forEach(r => {
      if (r.name.toLowerCase().includes(q)) {
        results.push({ monthId: m.id, type: 'resource', text: r.name, sub: `Month ${m.num} — ${r.type}` });
      }
    });
  });

  return results.slice(0, 50);
}

// ── Sync: Load all data from API into cache ──

export async function syncFromApi() {
  const health = await api('/health', {}, 5000);
  if (!health || health.status === 'degraded') {
    state.apiAvailable = false;
    console.log('⚡ Running in offline mode (localStorage only)');
    return;
  }

  state.apiAvailable = true;
  console.log('✅ Connected to MS SQL backend');

  const offlineProfileId = state.cache._profile && state.cache._profile.id;

  // Pull profile roster + which one is active before fetching profile-scoped data
  await refreshProfiles();
  const activeProfile = await api('/profile');
  if (offlineProfileId == null || !activeProfile || activeProfile.id === offlineProfileId) {
    await pushOfflineChanges();
  } else {
    localStorage.removeItem(OFFLINE_BASE_KEY); // a different profile is active on the server now
  }
  if (activeProfile && activeProfile.id != null) {
    state.cache._profile = { ...DEFAULT_PROFILE, ...activeProfile };
  }

  const months = activeMonths();
  const checklistPromises = months.map(m =>
    api(`/checklist/${m.id}`).then(data => {
      if (data) state.cache[checklistCacheKey(m.id)] = data;
    })
  );

  const notesPromises = months.map(m =>
    api(`/notes/${m.id}`).then(data => {
      if (data && typeof data.content === 'string') {
        state.cache[`notes_${m.id}`] = data.content;
      } else if (data && !data.content) {
        state.cache[`notes_${m.id}`] = '';
      }
    })
  );

  await Promise.all([
    ...checklistPromises,
    ...notesPromises
  ]);

  const settingsData = await api('/settings?prefix=daycheck_');
  if (settingsData) {
    const variant = getActiveRoadmapVariant();
    Object.entries(settingsData).forEach(([key, value]) => {
      // server key is `daycheck_<monthId>`; namespace it to the active variant
      const nsKey = `daycheck_${variant}_${key.slice('daycheck_'.length)}`;
      try { state.cache[nsKey] = JSON.parse(value); } catch { state.cache[nsKey] = {}; }
    });
  }
  const weekNotesData = await api('/settings?prefix=weeknotes_');
  if (weekNotesData) {
    Object.entries(weekNotesData).forEach(([key, value]) => {
      state.cache[key] = value;
    });
  }

  const resLinksData = await api('/settings?prefix=reslink_');
  if (resLinksData) {
    Object.entries(resLinksData).forEach(([key, value]) => { state.cache[key] = value; });
  }
  const repoLinksData = await api('/settings?prefix=repolink_');
  if (repoLinksData) {
    Object.entries(repoLinksData).forEach(([key, value]) => { state.cache[key] = value; });
  }

  // Anti-helplessness data — all values are JSON blobs
  const growthPrefixes = ['stucklog_', 'rebuild_', 'timelog_', 'challenge_', 'dsa_'];
  const growthData = await Promise.all(growthPrefixes.map(p => api(`/settings?prefix=${p}`)));
  growthData.forEach(data => {
    if (!data) return;
    Object.entries(data).forEach(([key, value]) => {
      try { state.cache[key] = JSON.parse(value); } catch { /* skip malformed */ }
    });
  });

  const themeData = await api('/settings/theme');
  if (themeData && themeData.value) {
    state.cache._theme = normalizeTheme(themeData.value);
    applyTheme(state.cache._theme);
  }

  const motionData = await api('/settings/anime_motion');
  if (motionData && motionData.value) {
    state.cache._animeMotion = motionData.value !== 'off';
  }

  const fpsData = await api('/settings/fps_limit');
  if (fpsData && fpsData.value) {
    state.cache._fps60 = fpsData.value !== 'off';
  }

  const celebData = await api('/settings/celebration_style');
  if (celebData && celebData.value) {
    state.cache._celebStyle = normalizeCelebrationStyle(celebData.value);
  }

  const introData = await api('/settings/startup_anim');
  if (introData && introData.value) {
    state.cache._startupAnim = introData.value !== 'off';
  }

  const decodeData = await api('/settings/neon_decode');
  if (decodeData && decodeData.value) {
    state.cache._neonDecode = decodeData.value !== 'off';
  }

  const accentData = await api('/settings/accent');
  if (accentData && accentData.value) {
    const v = accentData.value;
    if (v.startsWith('custom:')) {
      state.cache._accent = 'custom';
      state.cache._accentCustom = v.slice('custom:'.length);
    } else {
      state.cache._accent = v;
    }
    applyAccent(state.cache._accent);
  }

  saveCache();
}

// ── Offline changes → server (on reconnect, before pulling) ──

const onOff = v => (v === false ? 'off' : 'on');
const GLOBAL_SETTINGS = {
  _theme: v => ['theme', normalizeTheme(v)],
  _animeMotion: v => ['anime_motion', onOff(v)],
  _fps60: v => ['fps_limit', v === false ? 'off' : '60'],
  _celebStyle: v => ['celebration_style', normalizeCelebrationStyle(v)],
  _startupAnim: v => ['startup_anim', onOff(v)],
  _neonDecode: v => ['neon_decode', onOff(v)],
};

async function pushOfflineTodos(key, items, prevItems) {
  const [, monthId, dateStr] = key.match(/^todo_(\d+)_(\d{4}-\d{2}-\d{2})$/) || [];
  if (!monthId) return [];
  const results = [];
  const put = (path, body) => api(path, { method: 'PUT', body: JSON.stringify(body) }, 5000);
  const liveIds = new Set(items.map(i => i.dbId).filter(Boolean));
  for (const prev of prevItems) {
    if (prev.dbId && !liveIds.has(prev.dbId)) results.push(await api(`/todos/${prev.dbId}`, { method: 'DELETE' }, 5000));
  }
  for (const item of items) {
    if (!item.dbId) {
      const res = await api(`/todos/${monthId}/${dateStr}`, { method: 'POST', body: JSON.stringify({ text: item.text }) }, 5000);
      results.push(res);
      if (res && res.id && item.done) results.push(await put(`/todos/${res.id}/toggle`, { done: true }));
      continue;
    }
    const prev = prevItems.find(p => p.dbId === item.dbId);
    if (!prev || prev.text !== item.text) results.push(await put(`/todos/${item.dbId}`, { text: item.text }));
    if (!prev || !!prev.done !== !!item.done) results.push(await put(`/todos/${item.dbId}/toggle`, { done: !!item.done }));
  }
  return results;
}

export async function pushOfflineChanges() {
  const raw = localStorage.getItem(OFFLINE_BASE_KEY);
  if (raw === null) return;
  localStorage.removeItem(OFFLINE_BASE_KEY); // claim it now so an overlapping sync can't push twice
  let base = {};
  try { base = JSON.parse(raw) || {}; } catch { /* corrupt snapshot — treat everything as changed */ }

  const cur = state.cache;
  const variant = getActiveRoadmapVariant();
  const put = (path, body) => api(path, { method: 'PUT', body: JSON.stringify(body) }, 5000);
  const changed = k => JSON.stringify(cur[k]) !== JSON.stringify(base[k]);
  const calls = [];
  const todoResults = [];

  for (const key of Object.keys(cur)) {
    if (!changed(key)) continue;
    const v = cur[key];
    let m;
    if ((m = key.match(/^checklist_(.+)_(\d+)$/))) {
      if (m[1] !== variant) continue;
      const prev = base[key] || {};
      Object.entries(v || {}).forEach(([idx, checked]) => {
        if (!!prev[idx] !== !!checked) calls.push(put(`/checklist/${m[2]}/${idx}`, { checked: !!checked }));
      });
    } else if ((m = key.match(/^daycheck_(.+)_(\d+)$/))) {
      if (m[1] === variant) calls.push(put(`/settings/daycheck_${m[2]}`, { value: JSON.stringify(v || {}) }));
    } else if ((m = key.match(/^notes_(\d+)$/))) {
      calls.push(put(`/notes/${m[1]}`, { content: v || '' }));
    } else if (/^(reslink|repolink|weeknotes)_/.test(key) || key === 'streak_last_date' || key === 'streak_count') {
      calls.push(put(`/settings/${key}`, { value: String(v ?? '') }));
    } else if (/^(stucklog|rebuild|timelog|challenge|dsa)_/.test(key)) {
      calls.push(put(`/settings/${key}`, { value: JSON.stringify(v) }));
    } else if (key.startsWith('todo_')) {
      todoResults.push(...await pushOfflineTodos(key, v || [], base[key] || []));
    } else if (key === '_profile') {
      const prev = base._profile || DEFAULT_PROFILE;
      const diff = {};
      Object.keys(DEFAULT_PROFILE).forEach(f => {
        if (v && v[f] !== undefined && JSON.stringify(v[f]) !== JSON.stringify(prev[f])) diff[f] = v[f];
      });
      if (Object.keys(diff).length) calls.push(put('/profile', diff));
    } else if (GLOBAL_SETTINGS[key]) {
      const [name, value] = GLOBAL_SETTINGS[key](v);
      calls.push(put(`/settings/${name}`, { value }));
    }
  }
  if (changed('_accent') || changed('_accentCustom')) {
    const value = cur._accent === 'custom' ? `custom:${cur._accentCustom}` : (cur._accent || 'default');
    calls.push(put('/settings/accent', { value }));
  }

  const results = [...await Promise.all(calls), ...todoResults];
  if (!results.length) return;
  const failed = results.filter(r => !r).length;
  if (failed) {
    showToast(`Synced offline changes — ${failed} could not be saved to the database`, 'warning', 5000);
  } else {
    showToast(`Synced ${results.length} offline change${results.length === 1 ? '' : 's'} to the database`, 'success', 3000);
  }
}

// ── Month date ranges from start_date ────

// Get the actual number of content days in a month by parsing the highest
// day number from the weekly breakdown titles (e.g. "Day 29–31" → 31).
export function getMonthContentDays(monthIdx) {
  const m = activeMonths()[monthIdx];
  if (!m) return 0;
  let maxDay = 0;
  m.weeks.forEach(w => {
    w.days.forEach(d => {
      const nums = d.title.match(/\d+/g);
      if (nums) {
        const last = parseInt(nums[nums.length - 1]);
        if (last > maxDay) maxDay = last;
      }
    });
  });
  return maxDay || (parseInt(m.duration) || 4) * 7;
}

// Get the total scheduled days for a month (duration in weeks × 7).
// This includes buffer/catch-up time beyond the content days.
function getMonthScheduledDays(monthIdx) {
  const m = activeMonths()[monthIdx];
  return (parseInt(m?.duration) || 4) * 7;
}

export function getMonthDateRange(monthId) {
  const profile = getProfile();
  const startStr = profile.start_date;
  if (!startStr) return null;
  const start = new Date(startStr + 'T00:00:00');
  if (isNaN(start)) return null;

  // Sum scheduled days (duration × 7) of preceding months — includes buffer
  let offsetDays = 0;
  for (let i = 0; i < monthId; i++) {
    offsetDays += getMonthScheduledDays(i);
  }
  const scheduledDays = getMonthScheduledDays(monthId);
  const contentDays = getMonthContentDays(monthId);
  const monthStart = new Date(start);
  monthStart.setDate(monthStart.getDate() + offsetDays);
  const monthEnd = new Date(start);
  monthEnd.setDate(monthEnd.getDate() + offsetDays + scheduledDays - 1);

  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const fmtShort = (d) => d.toLocaleDateString('en-US', { month: 'short' });
  const monthName = `${monthStart.toLocaleDateString('en-US', { month: 'long' })} ${monthStart.getFullYear()}`;

  return {
    start: monthStart,
    end: monthEnd,
    days: scheduledDays,
    contentDays: contentDays,
    label: `${fmt(monthStart)} – ${fmt(monthEnd)}, ${monthEnd.getFullYear()}`,
    monthName: monthName,
    shortMonth: fmtShort(monthStart),
  };
}

// ── Daily To-Do utilities ─────────────────

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function getTodoItems(monthId, dateStr) {
  if (!dateStr) dateStr = todayStr();
  const key = `todo_${monthId}_${dateStr}`;
  return state.cache[key] || [];
}

function isTodoDateEditable(dateStr) {
  return !!dateStr && dateStr >= todayStr();
}

export function addTodoItem(monthId, dateStr, text) {
  if (!isTodoDateEditable(dateStr)) return;
  const key = `todo_${monthId}_${dateStr}`;
  if (!state.cache[key]) state.cache[key] = [];
  const item = { text, done: false, created_at: new Date().toISOString(), completed_at: null, dbId: null, _pending: null };
  state.cache[key].push(item);
  saveCache();

  if (state.apiAvailable) {
    item._pending = api(`/todos/${monthId}/${dateStr}`, {
      method: 'POST',
      body: JSON.stringify({ text })
    }).then(res => {
      if (res && res.id) {
        item.dbId = res.id;
      }
      if (res && Object.prototype.hasOwnProperty.call(res, 'created_at')) {
        item.created_at = res.created_at;
      }
      if (res && Object.prototype.hasOwnProperty.call(res, 'completed_at')) {
        item.completed_at = res.completed_at;
      }
      item._pending = null;
      saveCache();
    }).catch(e => {
      console.warn('addTodoItem API failed:', e);
      item._pending = null;
    });
  }
}

export function toggleTodoItem(monthId, dateStr, index) {
  const key = `todo_${monthId}_${dateStr}`;
  if (!state.cache[key] || !state.cache[key][index]) return;
  const item = state.cache[key][index];
  item.done = !item.done;
  const doneSnapshot = item.done; // capture at toggle time to avoid race
  item.completed_at = doneSnapshot ? new Date().toISOString() : null;
  saveCache();

  if (state.apiAvailable) {
    const syncToggle = () => {
      if (item.dbId) {
        api(`/todos/${item.dbId}/toggle`, {
          method: 'PUT',
          body: JSON.stringify({ done: doneSnapshot })
        }).then(res => {
          if (res && Object.prototype.hasOwnProperty.call(res, 'created_at')) {
            item.created_at = res.created_at;
          }
          if (res && Object.prototype.hasOwnProperty.call(res, 'completed_at')) {
            item.completed_at = res.completed_at;
            saveCache();
          }
        }).catch(e => {
          console.warn('toggleTodoItem API failed:', e);
        });
      }
    };
    if (item._pending && typeof item._pending.then === 'function') {
      item._pending.then(syncToggle);
    } else {
      syncToggle();
    }
  }
}

export function updateTodoItem(monthId, dateStr, index, text) {
  if (!isTodoDateEditable(dateStr)) return false;
  const key = `todo_${monthId}_${dateStr}`;
  if (!state.cache[key] || !state.cache[key][index]) return false;

  const nextText = (text || '').trim();
  if (!nextText) return false;

  const item = state.cache[key][index];
  item.text = nextText;
  saveCache();

  if (state.apiAvailable) {
    const syncUpdate = () => {
      if (item.dbId) {
        api(`/todos/${item.dbId}`, {
          method: 'PUT',
          body: JSON.stringify({ text: nextText })
        }).catch(e => {
          console.warn('updateTodoItem API failed:', e);
        });
      }
    };
    if (item._pending && typeof item._pending.then === 'function') {
      item._pending.then(syncUpdate);
    } else {
      syncUpdate();
    }
  }

  return true;
}

export function removeTodoItem(monthId, dateStr, index) {
  if (!isTodoDateEditable(dateStr)) return;
  const key = `todo_${monthId}_${dateStr}`;
  if (!state.cache[key]) return;
  const item = state.cache[key][index];
  state.cache[key].splice(index, 1);
  saveCache();

  if (state.apiAvailable && item && item.dbId) {
    api(`/todos/${item.dbId}`, { method: 'DELETE' });
  }
}

export function reorderTodoItem(monthId, dateStr, fromIdx, toIdx) {
  if (!isTodoDateEditable(dateStr)) return;
  const key = `todo_${monthId}_${dateStr}`;
  if (!state.cache[key]) return;
  const items = state.cache[key];
  if (fromIdx < 0 || fromIdx >= items.length || toIdx < 0 || toIdx >= items.length) return;
  const [moved] = items.splice(fromIdx, 1);
  items.splice(toIdx, 0, moved);
  saveCache();

  if (state.apiAvailable) {
    // Sync the new order to the backend
    const ordered = items
      .filter(it => it.dbId)
      .map((it, i) => ({ id: it.dbId, item_index: i }));
    if (ordered.length) {
      api(`/todos/reorder/${monthId}/${dateStr}`, {
        method: 'PUT',
        body: JSON.stringify({ items: ordered })
      });
    }
  }
}

export function getTodoDateStatus(monthId, dateStr) {
  const items = getTodoItems(monthId, dateStr);
  const today = todayStr();
  const isPast = dateStr < today;
  const dueEnd = new Date(`${dateStr}T23:59:59.999`);
  const relevantItems = items.filter(item => {
    if (!item.created_at) return true;
    const createdAt = new Date(item.created_at);
    return !isNaN(createdAt) && createdAt <= dueEnd;
  });

  if (relevantItems.length === 0) return isPast ? 'empty-past' : 'empty';

  const allDone = relevantItems.every(t => t.done);
  if (allDone) {
    if (!isPast) return 'done';

    const anyLate = relevantItems.some(t => {
      if (!t.completed_at) return false;
      const completedAt = new Date(t.completed_at);
      return !isNaN(completedAt) && completedAt > dueEnd;
    });
    return anyLate ? 'late-complete' : 'done';
  }

  if (isPast) return 'missed';

  const anyDone = relevantItems.some(t => t.done);
  if (anyDone) return 'partial';
  return 'pending';
}

export async function syncTodosFromApi(monthId) {
  if (!state.apiAvailable) return;
  try {
    const allData = await api(`/todos/all/${monthId}`);
    if (allData && typeof allData === 'object') {
      Object.keys(state.cache).forEach(k => {
        if (k.startsWith(`todo_${monthId}_`)) delete state.cache[k];
      });
      Object.entries(allData).forEach(([dateStr, items]) => {
        state.cache[`todo_${monthId}_${dateStr}`] = items.map(item => ({
          text: item.text,
          done: item.done,
          created_at: item.created_at || null,
          completed_at: item.completed_at || null,
          dbId: item.id
        }));
      });
      saveCache();
    }
  } catch(e) {
    console.warn(`syncTodosFromApi(${monthId}) failed:`, e);
  }
}

// ── Profile ───────────────────────────────

export const DEFAULT_PROFILE = {
  display_name: 'Learner',
  target_role: 'AI/LLM Engineer',
  start_date: todayStr(),
  target_end_date: '',
  hours_per_day: 5,
  days_per_week: 6,
  leetcode_target: 150,
  show_difficulty: true,
  show_streak: true,
  auto_expand_week: false,
  compact_mode: false,
  roadmap_variant: 'ai_llm',
};

export function getProfile() {
  return state.cache._profile || { ...DEFAULT_PROFILE };
}

export function setProfileField(key, value) {
  if (!state.cache._profile) state.cache._profile = { ...DEFAULT_PROFILE };
  state.cache._profile[key] = value;
  saveCache();
}

// ── Multi-profile helpers ──────────────────────

// Keys/prefixes that hold profile-scoped data in `state.cache`.
const _PROFILE_CACHE_PREFIXES = [
  'checklist_', 'notes_', 'daycheck_', 'weeknotes_',
  'reslink_', 'repolink_', 'todo_',
  'stucklog_', 'rebuild_', 'timelog_', 'challenge_', 'dsa_'
];
const _PROFILE_CACHE_EXACT = new Set([
  'streak_last_date', 'streak_count', '_profile'
]);

export function clearProfileScopedCache() {
  Object.keys(state.cache).forEach(key => {
    if (_PROFILE_CACHE_EXACT.has(key) || _PROFILE_CACHE_PREFIXES.some(p => key.startsWith(p))) {
      delete state.cache[key];
    }
  });
  saveCache();
}

export async function refreshProfiles() {
  if (!state.apiAvailable) return null;
  const data = await api('/profiles');
  if (data && Array.isArray(data.profiles)) {
    state.profiles = data.profiles;
    state.activeProfileId = data.active_profile_id;
  }
  return data;
}

export async function createProfile(payload) {
  if (!state.apiAvailable) return null;
  const res = await api('/profiles', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, 5000);
  if (res) await refreshProfiles();
  return res;
}

export async function deleteProfileById(id) {
  if (!state.apiAvailable) return null;
  const res = await api(`/profiles/${id}`, { method: 'DELETE' }, 5000);
  if (res) await refreshProfiles();
  return res;
}

export async function activateProfileById(id) {
  if (!state.apiAvailable) return null;
  const res = await api(`/profiles/${id}/activate`, { method: 'POST' }, 5000);
  if (res) {
    clearProfileScopedCache();
    state.activeProfileId = res.active_profile_id;
  }
  return res;
}
