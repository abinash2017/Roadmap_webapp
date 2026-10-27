/* ============================================
   VIEW: Settings (#settings) — profiles, schedule, UI prefs, milestones, reset
   ============================================ */

import {
  state, THEMES, isAnimeTheme, getTheme, setTheme, ACCENTS, getAccent, setAccent, getCustomAccent,
  getAnimeMotion, setAnimeMotion, getFpsLimit60, setFpsLimit60, getCelebrationStyle, setCelebrationStyle,
  getStartupAnim, setStartupAnim, getNeonDecode, setNeonDecode,
  escapeHtml, saveCache, api, DEMO_MODE
} from '../state.js';
import { playIntro } from '../intro.js';
import { syncAnimeBackground } from '../anime-bg.js';
import { CELEBRATION_STYLES } from '../celebrate.js';
import { switchThemeWithSword, prewarmThemeTransition, cancelPendingThemeSwitch } from '../theme-transition.js';
import { ROADMAP_VARIANTS } from '../data.js';
import { showToast, showSaveIndicator } from '../toast.js';
import {
  getProfile, setProfileField, DEFAULT_PROFILE, refreshProfiles, createProfile, deleteProfileById
} from '../api-ops.js';
import { getLevel, LEVEL_PER_TOPIC, getVariantLabel, initials } from '../progress.js';
import { celebrate, resolveCelebrationKind, celebrationName, refreshIcons } from '../effects.js';
import { applyProfilePrefs, renderProfilePicker, switchProfile } from '../shell.js';
import { renderAll } from '../render.js';

const $ = (id) => document.getElementById(id);

const PROFILE_FIELDS = {
  s_displayName: { key: 'display_name' },
  s_targetRole: { key: 'target_role' },
  s_startDate: { key: 'start_date' },
  s_targetEndDate: { key: 'target_end_date' },
  s_hoursPerDay: { key: 'hours_per_day', parse: parseFloat },
  s_daysPerWeek: { key: 'days_per_week', parse: parseInt },
};

const TOGGLE_FIELDS = {
  s_showDifficulty: 'show_difficulty',
  s_showStreak: 'show_streak',
  s_autoExpand: 'auto_expand_week',
  s_compactMode: 'compact_mode',
};

const profileFieldTimers = new Map();
let hoverPrewarmed = false;

// ── Markup helpers ────────────────────────

function themeCardMarkup(t, currentTheme) {
  return `
    <div class="theme-card${t.id === currentTheme ? ' active' : ''}${t.anime ? ' theme-card-anime' : ''}" data-theme="${t.id}">
      <div class="theme-card-preview">
        ${t.colors.map(c => `<span style="background:${c}"></span>`).join('')}
      </div>
      <div class="theme-card-name">${escapeHtml(t.name)}</div>
    </div>
  `;
}

function renderToggle(id, label, desc, checked) {
  return `
    <div class="settings-toggle-row">
      <div class="settings-toggle-info">
        <div class="settings-toggle-label">${label}</div>
        <div class="settings-toggle-desc">${desc}</div>
      </div>
      <label class="settings-switch">
        <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} />
        <span class="settings-switch-slider"></span>
      </label>
    </div>
  `;
}

function profileRowMarkup(p, activeId) {
  const isActive = p.id === activeId;
  const variantLabel = getVariantLabel(p.roadmap_variant);
  const role = p.target_role || '';
  // Hide the role tag when it just repeats the variant label.
  const showRole = role && role.trim().toLowerCase() !== variantLabel.trim().toLowerCase();
  return `
    <div class="profile-row ${isActive ? 'active' : ''}" data-profile-id="${p.id}">
      <div class="profile-row-avatar">${initials(p.display_name)}</div>
      <div class="profile-row-info">
        <div class="profile-row-name-row">
          <span class="profile-row-name">${escapeHtml(p.display_name)}</span>
          ${isActive ? '<span class="profile-row-active-badge">Active</span>' : ''}
        </div>
        <div class="profile-row-meta">
          <span class="profile-row-variant">${escapeHtml(variantLabel)}</span>
          ${showRole ? `<span class="profile-row-sep">·</span><span class="profile-row-role">${escapeHtml(role)}</span>` : ''}
        </div>
      </div>
      <div class="profile-row-actions">
        ${!isActive ? `<button class="btn btn-sm profile-activate-btn" data-id="${p.id}" type="button" title="Activate this profile"><i data-lucide="log-in" class="lucide-icon sm"></i> Activate</button>` : ''}
        ${!isActive ? `<button class="btn btn-sm btn-danger profile-delete-btn" data-id="${p.id}" type="button" title="Delete profile and all its data"><i data-lucide="trash-2" class="lucide-icon sm"></i></button>` : ''}
      </div>
    </div>
  `;
}

function profilesListHtml() {
  const list = state.profiles || [];
  return list.length === 0
    ? '<div class="settings-empty">No profiles loaded. Try reconnecting to the server.</div>'
    : list.map(p => profileRowMarkup(p, state.activeProfileId)).join('');
}

function milestonesListHtml(milestones) {
  if (milestones.length === 0) {
    return '<div class="settings-empty"><i data-lucide="target" class="lucide-icon"></i> No milestones yet. Add your first goal below!</div>';
  }
  return milestones.map(m => `
    <div class="milestone-row ${m.completed ? 'completed' : ''}" data-id="${m.id}">
      <button class="milestone-check" data-id="${m.id}" title="Toggle complete" aria-label="Toggle milestone complete">${m.completed ? '✓' : ''}</button>
      <div class="milestone-info">
        <span class="milestone-title">${escapeHtml(m.title)}</span>
        ${m.target_date ? `<span class="milestone-date"><i data-lucide="calendar" class="lucide-icon sm"></i> ${m.target_date}</span>` : ''}
      </div>
      <button class="milestone-delete" data-id="${m.id}" title="Delete" aria-label="Delete milestone"><i data-lucide="trash-2" class="lucide-icon sm"></i></button>
    </div>
  `).join('');
}

async function fetchMilestones() {
  if (!state.apiAvailable) return [];
  try {
    const ms = await api('/milestones');
    return Array.isArray(ms) ? ms : [];
  } catch (e) {
    return [];
  }
}

// ── Render ────────────────────────────────

async function renderSettings(_view, { mount }) {
  let profile = getProfile();
  if (state.apiAvailable) {
    try {
      await refreshProfiles();
      const p = await api('/profile');
      if (p && !p.error) {
        profile = { ...DEFAULT_PROFILE, ...p };
        state.cache._profile = profile;
        saveCache();
      }
    } catch (e) { /* use cache */ }
  }
  const milestones = await fetchMilestones();

  if (state.currentView !== 'settings') return;
  prewarmThemeTransition();
  hoverPrewarmed = false;

  let html = `<div class="fade-in settings-container">`;

  html += `<div class="settings-save-indicator" id="saveIndicator"><i data-lucide="check-circle-2" class="lucide-icon sm"></i> All changes saved</div>`;

  const defaultStart = new Date().toISOString().slice(0, 10);
  if (DEMO_MODE) html += `
    <div class="card settings-section" id="demoSection">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-profile"><i data-lucide="monitor-smartphone" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Demo Mode</div>
          <div class="settings-section-desc">Your progress is saved in this browser only. Clearing site data erases it. Multiple profiles, milestones and note history need the local version with a database (see the README).</div>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-field">
          <label class="settings-label" for="s_demoVariant">Roadmap</label>
          <select class="settings-input" id="s_demoVariant">
            ${Object.values(ROADMAP_VARIANTS).map(v =>
              `<option value="${v.id}"${v.id === profile.roadmap_variant ? ' selected' : ''}>${escapeHtml(v.label)}</option>`
            ).join('')}
          </select>
        </div>
      </div>
    </div>
  `;
  else html += `
    <div class="card settings-section" id="profilesSection">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-profile"><i data-lucide="users" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Profiles</div>
          <div class="settings-section-desc">Switch between separate roadmaps. Each profile has its own progress, notes, todos, and streak.</div>
        </div>
      </div>
      <div class="profiles-list" id="profilesList">${profilesListHtml()}</div>
      <div class="profiles-create-toolbar">
        <button class="btn btn-accent btn-sm" id="profilesCreateBtn" type="button">
          <i data-lucide="plus" class="lucide-icon sm"></i> New Profile
        </button>
      </div>
      <div class="profiles-create-form" id="profilesCreateForm" hidden>
        <div class="settings-grid">
          <div class="settings-field">
            <label class="settings-label">Display Name *</label>
            <input type="text" class="settings-input" id="np_displayName" placeholder="e.g. AI + Full-Stack track" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Target Role</label>
            <input type="text" class="settings-input" id="np_targetRole" placeholder="AI + Full-Stack Backend Developer" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Roadmap Variant</label>
            <select class="settings-input" id="np_roadmapVariant">
              ${Object.values(ROADMAP_VARIANTS).map(v =>
                `<option value="${v.id}"${v.id === 'ai_fullstack' ? ' selected' : ''}>${escapeHtml(v.label)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="settings-field">
            <label class="settings-label">Start Date</label>
            <input type="date" class="settings-input" id="np_startDate" value="${defaultStart}" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Hours per Day</label>
            <input type="number" class="settings-input" id="np_hoursPerDay" value="3" min="0.5" max="16" step="0.5" />
          </div>
          <div class="settings-field">
            <label class="settings-label">Days per Week</label>
            <input type="number" class="settings-input" id="np_daysPerWeek" value="6" min="1" max="7" />
          </div>
        </div>
        <div class="profiles-create-actions">
          <button class="btn btn-accent" id="np_saveBtn" type="button"><i data-lucide="check" class="lucide-icon sm"></i> Create Profile</button>
          <button class="btn" id="np_cancelBtn" type="button">Cancel</button>
        </div>
      </div>
    </div>
  `;

  html += `
    <div class="card settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-profile"><i data-lucide="user" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Active Profile Details</div>
          <div class="settings-section-desc">Edit the identity and dates of the currently active profile</div>
        </div>
      </div>
      <div class="settings-profile-hero">
        <div class="settings-avatar">${initials(profile.display_name)}</div>
        <div class="settings-profile-info">
          <div class="settings-profile-name">${escapeHtml(profile.display_name || 'User')}</div>
          <div class="settings-profile-role">${escapeHtml(profile.target_role || 'Set your target role')}</div>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-field">
          <label class="settings-label">Display Name</label>
          <div class="settings-input-wrap">
            <i data-lucide="user" class="settings-input-icon lucide-icon"></i>
            <input type="text" class="settings-input has-icon" id="s_displayName" value="${escapeHtml(profile.display_name || '')}" />
          </div>
        </div>
        <div class="settings-field">
          <label class="settings-label">Target Role</label>
          <div class="settings-input-wrap">
            <i data-lucide="briefcase" class="settings-input-icon lucide-icon"></i>
            <input type="text" class="settings-input has-icon" id="s_targetRole" value="${escapeHtml(profile.target_role || '')}" />
          </div>
        </div>
        <div class="settings-field">
          <label class="settings-label">Start Date</label>
          <div class="settings-input-wrap">
            <i data-lucide="calendar" class="settings-input-icon lucide-icon"></i>
            <input type="date" class="settings-input has-icon" id="s_startDate" value="${profile.start_date || ''}" />
          </div>
        </div>
        <div class="settings-field">
          <label class="settings-label">Target End Date</label>
          <div class="settings-input-wrap">
            <i data-lucide="calendar-check" class="settings-input-icon lucide-icon"></i>
            <input type="date" class="settings-input has-icon" id="s_targetEndDate" value="${profile.target_end_date || ''}" />
          </div>
        </div>
      </div>
    </div>
  `;

  html += `
    <div class="card settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-schedule"><i data-lucide="calendar-clock" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Study Schedule</div>
          <div class="settings-section-desc">Configure your daily study routine and targets</div>
        </div>
      </div>
      <div class="settings-grid">
        <div class="settings-field">
          <label class="settings-label">Hours per Day</label>
          <div class="settings-input-wrap">
            <i data-lucide="clock" class="settings-input-icon lucide-icon"></i>
            <input type="number" class="settings-input has-icon" id="s_hoursPerDay" value="${profile.hours_per_day}" min="0.5" max="16" step="0.5" />
          </div>
        </div>
        <div class="settings-field">
          <label class="settings-label">Days per Week</label>
          <div class="settings-input-wrap">
            <i data-lucide="calendar-days" class="settings-input-icon lucide-icon"></i>
            <input type="number" class="settings-input has-icon" id="s_daysPerWeek" value="${profile.days_per_week}" min="1" max="7" />
          </div>
        </div>
      </div>
    </div>
  `;

  const currentTheme = getTheme();
  const currentAccent = getAccent();
  const isAnime = isAnimeTheme(currentTheme);
  html += `
    <div class="card settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-ui"><i data-lucide="palette" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">UI Preferences</div>
          <div class="settings-section-desc">Customize how the app looks and behaves</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="settings-toggle-label" style="margin-bottom: 10px">Theme</div>
        <div class="theme-picker-grid">
          ${THEMES.filter(t => !t.anime).map(t => themeCardMarkup(t, currentTheme)).join('')}
        </div>
        <div class="settings-toggle-label theme-group-label" style="margin: 16px 0 10px">Anime <span class="theme-anime-badge">animated</span></div>
        <div class="theme-picker-grid">
          ${THEMES.filter(t => t.anime).map(t => themeCardMarkup(t, currentTheme)).join('')}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <div class="settings-toggle-label" style="margin-bottom: 10px">Accent Color</div>
        <div class="accent-anime-hint" id="accentAnimeHint"${isAnime ? '' : ' hidden'}>
          <i data-lucide="info" class="lucide-icon sm"></i> Anime themes use their own colours. The accent colour applies to the Dark theme.
        </div>
        <div class="accent-picker-grid" id="accentPickerGrid"${isAnime ? ' hidden' : ''}>
          ${ACCENTS.map(a => `
            <div class="accent-swatch${a.id === currentAccent ? ' active' : ''}${a.color ? '' : ' accent-default'}"
                 data-accent="${a.id}" title="${escapeHtml(a.name)}"
                 ${a.color ? `style="background:${a.color}"` : ''}></div>
          `).join('')}
          <label class="accent-swatch accent-custom${currentAccent === 'custom' ? ' active' : ''}" title="Custom color"
                 style="background:${currentAccent === 'custom' ? escapeHtml(getCustomAccent()) : 'var(--bg-input)'}">
            <input type="color" id="accentCustomInput" value="${escapeHtml(getCustomAccent())}" />
            ${currentAccent === 'custom' ? '' : '<span class="accent-custom-plus">+</span>'}
          </label>
        </div>
      </div>

      <div class="settings-toggles">
        ${renderToggle('s_showDifficulty', 'Show Difficulty Badges', 'Display Easy/Medium/Hard tags on months', profile.show_difficulty)}
        ${renderToggle('s_showStreak', 'Show Streak Counter', 'Display the 🔥 streak badge in the top bar', profile.show_streak)}
        ${renderToggle('s_autoExpand', 'Auto-Expand Current Week', 'Automatically open the first incomplete week', profile.auto_expand_week)}
        ${renderToggle('s_compactMode', 'Compact Mode', 'Tighter spacing and smaller cards', profile.compact_mode)}
        <div class="anime-motion-row${isAnime ? '' : ' is-disabled'}" id="animeMotionRow">
          ${renderToggle('s_animeMotion', 'Background Animation', 'Animated anime background and glowing month banner. Only applies to anime themes.', getAnimeMotion())}
        </div>
        <div class="anime-motion-row${currentTheme === 'neon' ? '' : ' is-disabled'}" id="neonDecodeRow">
          ${renderToggle('s_neonDecode', 'Neon Page Transition: Data Decode', 'Neon Tokyo only. When you switch pages, headings and numbers "decrypt" from random characters into place. Off = plain fade.', getNeonDecode())}
        </div>
        ${renderToggle('s_fps60', 'Limit Animations to 60 FPS', 'Keeps animations at 60 frames per second, the speed they are designed for. Turn off to use your screen’s full refresh rate. No difference on a 60 Hz screen.', getFpsLimit60())}
        <div class="settings-toggle-row">
          <div class="settings-toggle-info">
            <div class="settings-toggle-label">Startup Animation</div>
            <div class="settings-toggle-desc">Short intro in the style of your theme when the app opens (once per browser session). Click or press any key to skip.</div>
          </div>
          <div class="celeb-setting-controls">
            <button type="button" class="btn btn-sm btn-outline" id="s_introPreview"><i data-lucide="play" class="lucide-icon sm"></i> Preview</button>
            <label class="settings-switch">
              <input type="checkbox" id="s_startupAnim" ${getStartupAnim() ? 'checked' : ''} />
              <span class="settings-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="settings-toggle-row celeb-setting-row">
          <div class="settings-toggle-info">
            <div class="settings-toggle-label">Completion Animation</div>
            <div class="settings-toggle-desc">Plays when you finish a day, week, month, all daily to-dos, a solo challenge or every rebuild. Works with any theme.</div>
          </div>
          <div class="celeb-setting-controls">
            <select class="settings-input celeb-select" id="s_celebStyle" aria-label="Completion animation">
              ${CELEBRATION_STYLES.map(s => `<option value="${s.id}"${s.id === getCelebrationStyle() ? ' selected' : ''}>${s.id === 'auto' ? `Match theme (${celebrationName(resolveCelebrationKind('auto', currentTheme))})` : s.name}</option>`).join('')}
            </select>
            <button type="button" class="btn btn-sm btn-outline" id="s_celebTest"><i data-lucide="play" class="lucide-icon sm"></i> Test</button>
          </div>
        </div>
      </div>

    </div>
  `;

  if (!DEMO_MODE) html += `
    <div class="card settings-section">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-milestones"><i data-lucide="trophy" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Custom Milestones</div>
          <div class="settings-section-desc">Track personal goals and deadlines</div>
        </div>
      </div>
      <div id="milestonesList">${milestonesListHtml(milestones)}</div>
      <div class="milestone-add-row">
        <input type="text" class="settings-input" id="milestoneTitle" placeholder="Add a milestone..." style="flex:1" />
        <input type="date" class="settings-input" id="milestoneDate" style="width:150px" />
        <button class="btn btn-accent btn-sm" id="addMilestoneBtn"><i data-lucide="plus" class="lucide-icon sm"></i> Add</button>
      </div>
    </div>
  `;

  html += `
    <div class="card settings-section settings-danger">
      <div class="settings-section-header">
        <div class="settings-section-icon settings-icon-danger"><i data-lucide="triangle-alert" class="lucide-icon"></i></div>
        <div>
          <div class="card-title">Danger Zone</div>
          <div class="settings-section-desc">Irreversible actions — proceed with caution</div>
        </div>
      </div>
      <div class="settings-danger-row">
        <div>
          <div class="settings-danger-title">Reset All Progress</div>
          <div class="settings-danger-desc">Deletes checklists, notes, and day-level progress. Keeps your profile and milestones.</div>
        </div>
        <button class="btn btn-danger" id="s_resetBtn"><i data-lucide="trash-2" class="lucide-icon sm"></i> Reset Progress</button>
      </div>
    </div>
  `;

  html += `</div>`;
  mount(html);

  const motionInput = $('s_animeMotion');
  if (motionInput) motionInput.disabled = !isAnime;
  const decodeInput = $('s_neonDecode');
  if (decodeInput) decodeInput.disabled = currentTheme !== 'neon';
}

// ── Partial refreshes (instead of re-rendering the whole page) ──

async function refreshMilestones() {
  const listEl = $('milestonesList');
  if (!listEl) return;
  const milestones = await fetchMilestones();
  if (!listEl.isConnected) return;
  listEl.innerHTML = milestonesListHtml(milestones);
  refreshIcons(listEl);
}

async function refreshProfilesSection() {
  await refreshProfiles();
  const listEl = $('profilesList');
  if (listEl) {
    listEl.innerHTML = profilesListHtml();
    refreshIcons(listEl);
  }
  renderProfilePicker();
}

function resetCreateProfileForm() {
  const form = $('profilesCreateForm');
  const createBtn = $('profilesCreateBtn');
  if (!form) return;
  form.hidden = true;
  if (createBtn) createBtn.style.display = '';
  form.querySelectorAll('input').forEach(el => { el.value = el.defaultValue; });
  form.querySelectorAll('select').forEach(el => {
    const idx = [...el.options].findIndex(o => o.defaultSelected);
    el.selectedIndex = Math.max(0, idx);
  });
}

// ── Actions ───────────────────────────────

function onProfileFieldInput(el) {
  const field = PROFILE_FIELDS[el.id];
  if (field.key === 'display_name') {
    const nameEl = document.querySelector('.settings-profile-name');
    const avatarEl = document.querySelector('.settings-avatar');
    if (nameEl) nameEl.textContent = el.value || 'User';
    if (avatarEl) avatarEl.textContent = initials(el.value);
  }
  if (field.key === 'target_role') {
    const roleEl = document.querySelector('.settings-profile-role');
    if (roleEl) roleEl.textContent = el.value || 'Set your target role';
  }
  clearTimeout(profileFieldTimers.get(el.id));
  profileFieldTimers.set(el.id, setTimeout(() => {
    const val = field.parse ? field.parse(el.value) : el.value;
    setProfileField(field.key, val);
    if (state.apiAvailable) {
      api('/profile', { method: 'PUT', body: JSON.stringify({ [field.key]: val }) });
    }
    showSaveIndicator();
  }, 600));
}

function onThemeCardClick(el) {
  const themeId = el.dataset.theme;
  if (themeId === getTheme()) { cancelPendingThemeSwitch(); return; }
  // Everything that changes the look happens inside the transition so the "new" frame is complete.
  switchThemeWithSword(themeId, () => {
    setTheme(themeId);
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const anime = isAnimeTheme(themeId);
    const hint = $('accentAnimeHint');
    if (hint) hint.hidden = !anime;
    const accentGrid = $('accentPickerGrid');
    if (accentGrid) accentGrid.hidden = anime;
    $('animeMotionRow')?.classList.toggle('is-disabled', !anime);
    const motionInput = $('s_animeMotion');
    if (motionInput) motionInput.disabled = !anime;
    $('neonDecodeRow')?.classList.toggle('is-disabled', themeId !== 'neon');
    const decodeInput = $('s_neonDecode');
    if (decodeInput) decodeInput.disabled = themeId !== 'neon';
    const autoOpt = document.querySelector('#s_celebStyle option[value="auto"]');
    if (autoOpt) autoOpt.textContent = `Match theme (${celebrationName(resolveCelebrationKind('auto', themeId))})`;
    syncAnimeBackground();
    showSaveIndicator();
    const themeName = (THEMES.find(t => t.id === themeId) || {}).name || themeId;
    showToast(`Theme changed to ${themeName}`, 'success');
  });
}

function selectAccentSwatch(sw) {
  document.querySelectorAll('.accent-swatch').forEach(c => c.classList.remove('active'));
  sw.classList.add('active');
  showSaveIndicator();
}

async function addMilestone() {
  const titleEl = $('milestoneTitle');
  const dateEl = $('milestoneDate');
  const title = titleEl.value.trim();
  if (!title) return;
  const target_date = dateEl.value || null;
  if (state.apiAvailable) {
    await api('/milestones', { method: 'POST', body: JSON.stringify({ title, target_date }) });
  }
  titleEl.value = '';
  dateEl.value = '';
  showToast('Milestone added', 'success');
  refreshMilestones();
}

async function toggleMilestone(btn) {
  const id = parseInt(btn.dataset.id);
  const isCompleted = btn.closest('.milestone-row').classList.contains('completed');
  if (state.apiAvailable) {
    await api(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify({ completed: !isCompleted }) });
  }
  refreshMilestones();
}

async function deleteMilestone(btn) {
  if (!confirm('Delete this milestone?')) return;
  if (state.apiAvailable) await api(`/milestones/${parseInt(btn.dataset.id)}`, { method: 'DELETE' });
  refreshMilestones();
}

function toggleCreateProfileForm() {
  const form = $('profilesCreateForm');
  const createBtn = $('profilesCreateBtn');
  const willShow = form.hidden;
  form.hidden = !willShow;
  createBtn.style.display = willShow ? 'none' : '';
  if (willShow) setTimeout(() => $('np_displayName')?.focus(), 40);
}

async function submitCreateProfile(saveBtn) {
  const name = $('np_displayName').value.trim();
  if (!name) {
    showToast('Display name is required', 'warning');
    $('np_displayName')?.focus();
    return;
  }
  const payload = {
    display_name: name,
    target_role: $('np_targetRole').value.trim() || null,
    roadmap_variant: $('np_roadmapVariant').value,
    start_date: $('np_startDate').value || null,
    hours_per_day: parseFloat($('np_hoursPerDay').value) || 3,
    days_per_week: parseInt($('np_daysPerWeek').value) || 6,
  };
  saveBtn.disabled = true;
  const res = await createProfile(payload);
  saveBtn.disabled = false;
  if (!res) {
    showToast('Failed to create profile (server rejected or offline)', 'error');
    return;
  }
  showToast(`Profile "${name}" created`, 'success');
  resetCreateProfileForm();
  refreshProfilesSection();
}

async function deleteProfile(btn) {
  const id = parseInt(btn.dataset.id);
  const target = state.profiles.find(p => p.id === id);
  if (!target) return;
  const ok = confirm(`Delete profile "${target.display_name}" and ALL its data (checklists, notes, todos, milestones)?\n\nThis cannot be undone.`);
  if (!ok) return;
  const res = await deleteProfileById(id);
  if (!res) {
    showToast('Failed to delete profile', 'error');
    return;
  }
  showToast(`Deleted "${target.display_name}"`, 'success');
  refreshProfilesSection();
}

export async function resetProgress() {
  if (!state.apiAvailable && !DEMO_MODE) {
    showToast('Reset needs the database — try again when it is back online', 'warning', 4000);
    return;
  }
  if (!confirm('⚠️ This will reset ALL your progress (checklists, notes, streak). Are you sure?')) return;
  const savedProfile = state.cache._profile ? { ...state.cache._profile } : null;
  // Appearance settings are global, not progress — keep them through a reset.
  const keepKeys = ['_theme', '_accent', '_accentCustom', '_animeMotion', '_fps60', '_celebStyle', '_startupAnim', '_neonDecode'];
  const kept = Object.fromEntries(keepKeys.filter(k => k in state.cache).map(k => [k, state.cache[k]]));
  state.cache = { ...kept };
  if (savedProfile) state.cache._profile = savedProfile;
  saveCache();

  if (state.apiAvailable) {
    const result = await api('/reset', { method: 'POST' });
    if (!result) {
      showToast('Server reset failed — local progress cleared only', 'error');
    }
  }

  showToast('All progress has been reset', 'warning');
  renderAll({ keepUi: false });
}

// ── Delegated events ──────────────────────

function onClick(e) {
  const t = e.target;
  const theme = t.closest('.theme-card[data-theme]');
  if (theme) { onThemeCardClick(theme); return; }

  const swatch = t.closest('.accent-swatch[data-accent]');
  if (swatch) { setAccent(swatch.dataset.accent); selectAccentSwatch(swatch); return; }

  if (t.closest('#s_celebTest')) {
    const lv = getLevel();
    celebrate('Day Complete!', 'Test — this is what a completion looks like', { level: { before: lv, after: lv + LEVEL_PER_TOPIC } });
    return;
  }

  if (t.closest('#s_introPreview')) {
    if (!playIntro({ force: true })) showToast('Animations are off because your system has "reduce motion" enabled', 'info');
    return;
  }

  if (t.closest('#addMilestoneBtn')) { addMilestone(); return; }
  const msCheck = t.closest('.milestone-check');
  if (msCheck) { toggleMilestone(msCheck); return; }
  const msDelete = t.closest('.milestone-delete');
  if (msDelete) { deleteMilestone(msDelete); return; }

  if (t.closest('#s_resetBtn')) { resetProgress(); return; }

  if (t.closest('#profilesCreateBtn')) { toggleCreateProfileForm(); return; }
  if (t.closest('#np_cancelBtn')) { resetCreateProfileForm(); return; }
  const saveBtn = t.closest('#np_saveBtn');
  if (saveBtn) { submitCreateProfile(saveBtn); return; }
  const activateBtn = t.closest('.profile-activate-btn');
  if (activateBtn) {
    const id = parseInt(activateBtn.dataset.id);
    switchProfile(id, state.profiles.find(p => p.id === id)?.display_name);
    return;
  }
  const deleteBtn = t.closest('.profile-delete-btn');
  if (deleteBtn) deleteProfile(deleteBtn);
}

function onInput(e) {
  const el = e.target;
  if (PROFILE_FIELDS[el.id]) { onProfileFieldInput(el); return; }
  if (el.id === 'accentCustomInput') {
    const hex = el.value;
    setAccent('custom', hex);
    const sw = el.closest('.accent-swatch');
    sw.style.background = hex;
    sw.querySelector('.accent-custom-plus')?.remove();
    selectAccentSwatch(sw);
  }
}

function onChange(e) {
  const el = e.target;
  const toggleKey = TOGGLE_FIELDS[el.id];
  if (toggleKey) {
    setProfileField(toggleKey, el.checked);
    if (state.apiAvailable) {
      api('/profile', { method: 'PUT', body: JSON.stringify({ [toggleKey]: el.checked }) });
    }
    applyProfilePrefs();
    showSaveIndicator();
  } else if (el.id === 's_demoVariant') {
    setProfileField('roadmap_variant', el.value);
    state.lastCompletedMonths.clear();
    renderAll({ keepUi: false });
    showSaveIndicator();
  } else if (el.id === 's_animeMotion') {
    setAnimeMotion(el.checked);
    syncAnimeBackground();
    showSaveIndicator();
  } else if (el.id === 's_fps60') {
    setFpsLimit60(el.checked);
    showSaveIndicator();
  } else if (el.id === 's_startupAnim') {
    setStartupAnim(el.checked);
    showSaveIndicator();
  } else if (el.id === 's_neonDecode') {
    setNeonDecode(el.checked);
    showSaveIndicator();
  } else if (el.id === 's_celebStyle') {
    setCelebrationStyle(el.value);
    showSaveIndicator();
  }
}

export const settingsView = {
  title: () => 'Settings',
  render: renderSettings,
  events: {
    click: onClick,
    input: onInput,
    change: onChange,
    pointerover(e) {
      if (hoverPrewarmed || !e.target.closest('.theme-card[data-theme]')) return;
      hoverPrewarmed = true;
      prewarmThemeTransition();
    }
  }
};
