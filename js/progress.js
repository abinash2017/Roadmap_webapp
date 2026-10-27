/* ============================================
   PROGRESS — derived progress, schedule & level math (no DOM)
   ============================================ */

import { state } from './state.js';
import { ROADMAP_VARIANTS } from './data.js';
import {
  activeMonths, getChecklistState, getDayCheckState, getDayProgress,
  getMonthDateRange, getProfile
} from './api-ops.js';

// ── Day-level status ──────────────────────

export function getDayStatus(monthId, weekIdx, dayIdx) {
  const m = activeMonths()[monthId];
  const day = m?.weeks[weekIdx]?.days[dayIdx];
  if (!day) return 'pending';

  let allDone = true;
  let anyDone = false;
  day.topics.forEach((t, ti) => {
    if (getDayCheckState(monthId, weekIdx, dayIdx, ti)) anyDone = true;
    else allDone = false;
  });

  const range = getMonthDateRange(monthId);
  let isPast = false;
  if (range) {
    const nums = day.title.match(/\d+/g);
    const endDay = nums ? parseInt(nums[nums.length - 1]) : (weekIdx * 7 + (dayIdx + 1) * 2);
    const dayDate = new Date(range.start);
    dayDate.setDate(dayDate.getDate() + endDay - 1);
    // Only mark as past after the end day is fully over (i.e., next day has started)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dayDate);
    endOfDay.setHours(0, 0, 0, 0);
    endOfDay.setDate(endOfDay.getDate() + 1);
    isPast = endOfDay <= today;
  }

  if (allDone && day.topics.length > 0) return isPast ? 'late-complete' : 'complete';
  if (isPast && !allDone) return 'missed';
  if (anyDone) return 'partial';
  return 'pending';
}

export function dayStatusIconHtml(status) {
  if (status === 'complete') return '<span class="day-status day-status-complete" title="All topics done">✓</span>';
  if (status === 'late-complete') return '<span class="day-status day-status-late" title="Completed late">✓</span>';
  if (status === 'missed') return '<span class="day-status day-status-missed" title="Day passed – incomplete">✗</span>';
  if (status === 'partial') return '<span class="day-status day-status-partial" title="In progress">◐</span>';
  return '';
}

// ── Month / overall progress ──────────────

export function getMonthProgress(monthId) {
  const cl = getChecklistState(monthId);
  const total = activeMonths()[monthId]?.checklist.length || 0;
  const done = Object.values(cl).filter(Boolean).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

// Blended month progress = checklist items + daily topics counted as one pool.
export function getMonthBlendedProgress(monthId) {
  const cl = getMonthProgress(monthId);
  const dp = getDayProgress(monthId);
  const done = cl.done + dp.done;
  const total = cl.total + dp.total;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function getOverallProgress() {
  let done = 0, total = 0;
  activeMonths().forEach(m => {
    const p = getMonthBlendedProgress(m.id);
    done += p.done;
    total += p.total;
  });
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export function getCurrentMonthId() {
  const profile = getProfile();
  const startStr = profile.start_date;
  if (!startStr) return -1;
  const startDate = new Date(startStr + 'T00:00:00');
  if (isNaN(startDate)) return -1;
  const today = new Date();
  const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return -1;

  // Use getMonthDateRange to check which month's scheduled window today falls in
  const months = activeMonths();
  for (let i = 0; i < months.length; i++) {
    const dr = getMonthDateRange(i);
    if (!dr) continue;
    const startMs = dr.start.getTime();
    const endMs = dr.end.getTime();
    const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    if (todayMs >= startMs && todayMs <= endMs) return i;
  }
  return -1; // past all months
}

// Month the weekly solo challenge draws from: the scheduled month, else the first unfinished one.
export function getChallengeMonthId() {
  const current = getCurrentMonthId();
  if (current >= 0) return current;
  const months = activeMonths();
  const unfinished = months.find(m => getMonthBlendedProgress(m.id).percent < 100);
  return unfinished ? unfinished.id : months.length - 1;
}

export function getJourneyDay() {
  const profile = getProfile();
  if (!profile.start_date) return 0;
  const start = new Date(profile.start_date + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (isNaN(start) || today < start) return 0;
  return Math.floor((today - start) / 86400000) + 1;
}

// First unticked topic, starting with the current month. Returns { monthId, monthNum, text } or null.
export function getNextTopic() {
  const months = activeMonths();
  const cur = getCurrentMonthId();
  const order = cur >= 0 ? [cur, ...months.map(m => m.id).filter(id => id !== cur)] : months.map(m => m.id);
  for (const mid of order) {
    const m = months[mid];
    for (let wi = 0; wi < m.weeks.length; wi++) {
      const days = m.weeks[wi].days;
      for (let di = 0; di < days.length; di++) {
        const topics = days[di].topics;
        for (let ti = 0; ti < topics.length; ti++) {
          if (!getDayCheckState(mid, wi, di, ti)) {
            return { monthId: mid, monthNum: m.num, text: topics[ti].replace(/<[^>]*>/g, '') };
          }
        }
      }
    }
  }
  return null;
}

// ── Level ─────────────────────────────────
// Level = 1 + 0.2 per completed topic + 0.5 per completed end-of-month checklist item.
export const LEVEL_PER_TOPIC = 0.2;
export const LEVEL_PER_CHECKLIST = 0.5;

export function getLevel() {
  let topics = 0, checklist = 0;
  activeMonths().forEach(m => {
    topics += getDayProgress(m.id).done;
    checklist += getMonthProgress(m.id).done;
  });
  return 1 + topics * LEVEL_PER_TOPIC + checklist * LEVEL_PER_CHECKLIST;
}

// Tracks which months are 100% (checklist + topics) and returns the id of a month that
// just became complete, or -1. Never fires anything itself — callers decide via celebrate().
export function checkMonthCompletion() {
  const completed = new Set();
  activeMonths().forEach(m => {
    const prog = getMonthBlendedProgress(m.id);
    if (prog.percent === 100) completed.add(m.id);
  });
  let newlyCompleted = -1;
  for (const id of completed) {
    if (!state.lastCompletedMonths.has(id)) { newlyCompleted = id; break; }
  }
  state.lastCompletedMonths = completed;
  return newlyCompleted;
}

// ── Labels ────────────────────────────────

// Read labels straight from data.js so adding a variant is a 1-file change.
export function getVariantLabel(variantId) {
  return ROADMAP_VARIANTS[variantId]?.label || variantId || 'Unknown roadmap';
}

export function initials(name) {
  return (name || 'U').split(/\s+/).map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || 'U';
}
