// script.js - OmniWeb Core

const GITHUB_USERNAME = 'StaticTrace';

const DEFAULT_LINKS = [
  { label: 'GitHub',   url: 'https://github.com',                  icon: '🐙' },
  { label: 'YouTube',  url: 'https://youtube.com',                  icon: '📺' },
  { label: 'Google',   url: 'https://google.com',                   icon: '🔍' },
  { label: 'MDN Docs', url: 'https://developer.mozilla.org',        icon: '📖' },
  { label: 'Dashboard',url: 'dashboard.html',                       icon: '📊' },
];

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  initDarkMode();
  initMobileMenu();
  initWidgets();
  trackPageVisit();
  initScrollAnimations();
  initFooterYear();
});

// ── Service Worker ────────────────────────────────────────────────────────────
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });
    })
    .catch(err => console.warn('SW registration failed:', err));
}

function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#6366f1;color:white;text-align:center;padding:12px 16px;font-size:0.9rem;font-weight:500;z-index:9999;display:flex;align-items:center;justify-content:center;gap:12px;font-family:Inter,system-ui,sans-serif;';
  banner.innerHTML = `
    <span>A new version of OmniWeb is available.</span>
    <button onclick="location.reload()" style="background:white;color:#6366f1;border:none;border-radius:6px;padding:5px 14px;font-weight:700;cursor:pointer;font-size:0.85rem;">Refresh</button>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.2rem;padding:0 4px;" aria-label="Dismiss">×</button>
  `;
  document.body.appendChild(banner);
}

// ── Footer Year ───────────────────────────────────────────────────────────────
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ── Dark Mode ─────────────────────────────────────────────────────────────────
function initDarkMode() {
  const toggle = document.querySelector('.toggle-dark');
  if (!toggle) return;
  const isDark = localStorage.getItem('theme') !== 'light';
  document.documentElement.classList.toggle('light', !isDark);
  toggle.textContent = isDark ? '☀️' : '🌙';
  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    toggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.site-nav');
  if (!menuBtn || !nav) return;

  const openMenu = () => { nav.classList.add('active'); menuBtn.textContent = '✕'; menuBtn.setAttribute('aria-expanded', 'true'); };
  const closeMenu = () => { nav.classList.remove('active'); menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-expanded', 'false'); };

  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.addEventListener('click', e => { e.stopPropagation(); nav.classList.contains('active') ? closeMenu() : openMenu(); });
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// ── Scroll Animations ─────────────────────────────────────────────────────────
function initScrollAnimations() {
  const widgets = document.querySelectorAll('.widget');
  if (!widgets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  widgets.forEach(w => {
    w.classList.add('will-animate');
    observer.observe(w);
  });
}

// ── Widgets Dispatcher ────────────────────────────────────────────────────────
function initWidgets() {
  initTimeWidget();
  initWeatherWidget();
  initFocusWidget();
  initTodoWidget();
  initQuickLinksWidget();
  initAnalyticsWidget();
  initGitHubWidget();
  initPomodoroWidget();
  initHabitWidget();
  initJournalWidget();
}

// ── Time Widget ───────────────────────────────────────────────────────────────
function initTimeWidget() {
  const timeEl = document.getElementById('current-time');
  const dateEl = document.getElementById('current-date');
  if (!timeEl) return;
  const update = () => {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  update();
  setInterval(update, 1000);
}

// ── Weather Widget ────────────────────────────────────────────────────────────
function initWeatherWidget() {
  const el = document.getElementById('weather');
  if (!el) return;
  fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.76&current_weather=true')
    .then(r => r.json())
    .then(data => {
      const { temperature, windspeed, weathercode } = data.current_weather;
      el.innerHTML = `
        <span class="weather-temp">${getWeatherIcon(weathercode)} ${temperature}°C</span>
        <span class="weather-detail">Tokyo · Wind ${windspeed} km/h</span>
      `;
    })
    .catch(() => { el.textContent = 'Weather unavailable'; });
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

// ── Daily Focus Widget ────────────────────────────────────────────────────────
function initFocusWidget() {
  const el = document.getElementById('focus-widget');
  if (!el) return;
  renderFocus();
}

function renderFocus() {
  const el = document.getElementById('focus-widget');
  if (!el) return;
  const stored = JSON.parse(localStorage.getItem('omniFocus') || 'null');
  const today = new Date().toDateString();
  const text = (stored && stored.date === today) ? stored.text : '';

  el.innerHTML = `
    <div class="focus-text ${text ? '' : 'empty'}" id="focus-display">${text || 'No focus set for today yet.'}</div>
    <div class="focus-input-row">
      <input type="text" id="focus-input" placeholder="What's your focus today?" value="${text}" maxlength="120">
      <button onclick="setFocus()">Set</button>
    </div>
  `;

  const input = document.getElementById('focus-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') setFocus(); });
}

window.setFocus = function () {
  const input = document.getElementById('focus-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  localStorage.setItem('omniFocus', JSON.stringify({ text, date: new Date().toDateString() }));
  const display = document.getElementById('focus-display');
  if (display) { display.textContent = text; display.classList.remove('empty'); }
};

// ── To-Do Widget ──────────────────────────────────────────────────────────────
function initTodoWidget() {
  const list = document.getElementById('todo-list');
  if (!list) return;
  const input = document.getElementById('todo-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
  renderTodos();
}

function getTodos() { return JSON.parse(localStorage.getItem('omniTodos') || '[]'); }
function saveTodos(t) { localStorage.setItem('omniTodos', JSON.stringify(t)); }

function renderTodos() {
  const el = document.getElementById('todo-list');
  const stats = document.getElementById('todo-stats');
  if (!el) return;
  const todos = getTodos();
  const done = todos.filter(t => t.done).length;

  if (!todos.length) {
    el.innerHTML = '<p class="widget-muted" style="padding:4px 0;">No tasks yet. Add one above!</p>';
    if (stats) stats.textContent = '';
    return;
  }

  el.innerHTML = todos.map((t, i) => `
    <div class="todo-item ${t.done ? 'done' : ''}">
      <button class="todo-check" onclick="toggleTodo(${i})">${t.done ? '✓' : ''}</button>
      <span class="todo-text">${escHtml(t.text)}</span>
      <button class="todo-del" onclick="deleteTodo(${i})" title="Remove">×</button>
    </div>
  `).join('');

  if (stats) stats.textContent = `${done}/${todos.length} done`;
}

window.addTodo = function () {
  const input = document.getElementById('todo-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  const todos = getTodos();
  todos.push({ text, done: false });
  saveTodos(todos);
  if (input) input.value = '';
  renderTodos();
};

window.toggleTodo = function (i) {
  const todos = getTodos();
  todos[i].done = !todos[i].done;
  saveTodos(todos);
  renderTodos();
};

window.deleteTodo = function (i) {
  const todos = getTodos();
  todos.splice(i, 1);
  saveTodos(todos);
  renderTodos();
};

// ── Quick Links Widget ────────────────────────────────────────────────────────
function initQuickLinksWidget() {
  const el = document.getElementById('quicklinks-widget');
  if (!el) return;
  if (!localStorage.getItem('omniLinks')) {
    localStorage.setItem('omniLinks', JSON.stringify(DEFAULT_LINKS));
  }
  renderQuickLinks();
}

function getLinks() { return JSON.parse(localStorage.getItem('omniLinks') || '[]'); }

function renderQuickLinks() {
  const grid = document.getElementById('ql-grid');
  if (!grid) return;
  const links = getLinks();
  if (!links.length) {
    grid.innerHTML = '<p class="widget-muted">No links yet. Add one below.</p>';
    return;
  }
  grid.innerHTML = links.map((l, i) => `
    <div class="ql-card">
      <a href="${escHtml(l.url)}" target="_blank" rel="noopener" class="ql-link">
        <span class="ql-icon">${l.icon || '🔗'}</span>
        <span class="ql-label">${escHtml(l.label)}</span>
      </a>
      <button class="ql-del" onclick="deleteLink(${i})" title="Remove">×</button>
    </div>
  `).join('');
}

window.addQuickLink = function () {
  const label = (document.getElementById('ql-label') || {}).value?.trim();
  const url   = (document.getElementById('ql-url')   || {}).value?.trim();
  const icon  = (document.getElementById('ql-icon')  || {}).value?.trim() || '🔗';
  if (!label || !url) return;
  const links = getLinks();
  links.push({ label, url, icon });
  localStorage.setItem('omniLinks', JSON.stringify(links));
  ['ql-label','ql-url','ql-icon'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  renderQuickLinks();
};

window.deleteLink = function (i) {
  const links = getLinks();
  links.splice(i, 1);
  localStorage.setItem('omniLinks', JSON.stringify(links));
  renderQuickLinks();
};

// ── Analytics Widget ──────────────────────────────────────────────────────────
function initAnalyticsWidget() {
  const el = document.getElementById('analytics-widget');
  if (!el) return;
  const stats = getAnalyticsData();
  const pages = Object.entries(stats.pages).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = Object.values(stats.pages).reduce((s, v) => s + v, 0);
  const unique = Object.keys(stats.pages).length;

  el.innerHTML = `
    <div class="analytics-stats">
      <div class="analytics-stat"><span class="analytics-num">${total}</span><span class="analytics-label">Total Visits</span></div>
      <div class="analytics-stat"><span class="analytics-num">${unique}</span><span class="analytics-label">Pages</span></div>
      <div class="analytics-stat"><span class="analytics-num">${stats.sessions}</span><span class="analytics-label">Sessions</span></div>
    </div>
    <div class="analytics-pages">
      ${pages.map(([page, count]) => `
        <div class="analytics-row">
          <span class="analytics-page">${page}</span>
          <div class="analytics-bar-wrap"><div class="analytics-bar" style="width:${total ? Math.round((count/total)*100) : 0}%"></div></div>
          <span class="analytics-count">${count}</span>
        </div>
      `).join('')}
    </div>
    <button class="analytics-reset" onclick="resetAnalytics()">Reset Stats</button>
  `;
}

function getAnalyticsData() {
  const raw = localStorage.getItem('omniAnalytics');
  return raw ? JSON.parse(raw) : { pages: {}, sessions: 0 };
}

function trackPageVisit() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const label = page || 'index.html';
  const stats = getAnalyticsData();
  if (!sessionStorage.getItem('omniSession')) {
    sessionStorage.setItem('omniSession', '1');
    stats.sessions = (stats.sessions || 0) + 1;
  }
  stats.pages[label] = (stats.pages[label] || 0) + 1;
  localStorage.setItem('omniAnalytics', JSON.stringify(stats));
}

window.resetAnalytics = function () {
  if (confirm('Reset all analytics data?')) {
    localStorage.removeItem('omniAnalytics');
    initAnalyticsWidget();
  }
};

// ── GitHub Widget ─────────────────────────────────────────────────────────────
function initGitHubWidget() {
  const el = document.getElementById('github-widget');
  if (!el) return;
  el.innerHTML = '<p class="widget-loading">Loading activity…</p>';
  fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(events => {
      if (!events.length) { el.innerHTML = '<p class="widget-muted">No recent public activity.</p>'; return; }
      const items = events.slice(0, 7).map(ev => {
        const { type, repo, created_at } = ev;
        const repoName = repo.name.split('/')[1];
        const repoUrl = `https://github.com/${repo.name}`;
        const { icon, label } = formatEvent(type, ev.payload);
        return `
          <div class="gh-event">
            <span class="gh-icon">${icon}</span>
            <div class="gh-details">
              <span class="gh-label">${label}</span>
              <a class="gh-repo" href="${repoUrl}" target="_blank" rel="noopener">${repoName}</a>
            </div>
            <span class="gh-time">${timeAgo(new Date(created_at))}</span>
          </div>`;
      }).join('');
      el.innerHTML = `<div class="gh-feed">${items}</div><a class="gh-profile-link" href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">View GitHub Profile →</a>`;
    })
    .catch(() => { el.innerHTML = `<p class="widget-muted">Could not load GitHub activity for <strong>${GITHUB_USERNAME}</strong>.</p>`; });
}

function formatEvent(type, payload) {
  switch (type) {
    case 'PushEvent':        return { icon: '⬆️', label: `Pushed ${payload.commits?.length || 1} commit(s)` };
    case 'CreateEvent':      return { icon: '✨', label: `Created ${payload.ref_type} ${payload.ref || ''}` };
    case 'DeleteEvent':      return { icon: '🗑️', label: `Deleted ${payload.ref_type} ${payload.ref || ''}` };
    case 'PullRequestEvent': return { icon: '🔀', label: `${cap(payload.action)} pull request` };
    case 'IssuesEvent':      return { icon: '🐛', label: `${cap(payload.action)} issue` };
    case 'IssueCommentEvent':return { icon: '💬', label: 'Commented on issue' };
    case 'WatchEvent':       return { icon: '⭐', label: 'Starred' };
    case 'ForkEvent':        return { icon: '🍴', label: 'Forked' };
    case 'ReleaseEvent':     return { icon: '🚀', label: `Released ${payload.release?.tag_name || ''}` };
    default:                 return { icon: '📌', label: type.replace('Event', '') };
  }
}

// ── Daily Journal ─────────────────────────────────────────────────────────────
let journalCurrentDate = journalISOToday();
let journalSaveTimer   = null;

function journalISOToday() {
  return new Date().toISOString().slice(0, 10);
}

function journalOffsetDate(iso, days) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function journalFormatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function getJournal() {
  try { return JSON.parse(localStorage.getItem('omniJournal') || '{}'); }
  catch { return {}; }
}

function saveJournalEntry(iso, text) {
  const journal = getJournal();
  if (text.trim()) journal[iso] = text;
  else delete journal[iso];
  localStorage.setItem('omniJournal', JSON.stringify(journal));
}

function initJournalWidget() {
  const el = document.getElementById('journal-widget');
  if (!el) return;
  journalCurrentDate = journalISOToday();
  renderJournalWidget(el);
}

function renderJournalWidget(el) {
  const today   = journalISOToday();
  const isToday = journalCurrentDate === today;
  const journal = getJournal();
  const text    = journal[journalCurrentDate] || '';
  const entries = Object.keys(journal).length;
  const words   = text.trim() ? text.trim().split(/\s+/).length : 0;

  el.innerHTML = `
    <div class="journal-nav">
      <button class="journal-nav-btn" id="journal-prev" onclick="journalNav(-1)" aria-label="Previous day">‹</button>
      <div class="journal-date-label">
        ${journalFormatDate(journalCurrentDate)}
        ${isToday ? '<span class="journal-today-chip">Today</span>' : ''}
      </div>
      <button class="journal-nav-btn" id="journal-next" onclick="journalNav(1)"
        ${isToday ? 'disabled' : ''} aria-label="Next day">›</button>
    </div>
    <textarea
      class="journal-textarea"
      id="journal-textarea"
      placeholder="${isToday ? 'What\'s on your mind today?' : 'No entry for this day.'}"
      oninput="journalOnInput(this)"
      aria-label="Journal entry"
    >${text}</textarea>
    <div class="journal-footer">
      <div class="journal-save-status">
        <div class="journal-save-dot" id="journal-save-dot"></div>
        <span id="journal-save-label"></span>
      </div>
      <div class="journal-stats">
        <span id="journal-wordcount">${words > 0 ? `${words} word${words !== 1 ? 's' : ''}` : ''}</span>
        <span>${entries} entr${entries !== 1 ? 'ies' : 'y'}</span>
      </div>
    </div>
  `;
}

window.journalNav = function (direction) {
  const today = journalISOToday();
  const next  = journalOffsetDate(journalCurrentDate, direction);
  if (next > today) return;
  journalCurrentDate = next;
  const el = document.getElementById('journal-widget');
  if (el) renderJournalWidget(el);
};

window.journalOnInput = function (textarea) {
  const text  = textarea.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const wc    = document.getElementById('journal-wordcount');
  if (wc) wc.textContent = words > 0 ? `${words} word${words !== 1 ? 's' : ''}` : '';

  clearTimeout(journalSaveTimer);
  journalSaveTimer = setTimeout(() => {
    saveJournalEntry(journalCurrentDate, text);
    const dot   = document.getElementById('journal-save-dot');
    const label = document.getElementById('journal-save-label');
    if (dot && label) {
      label.textContent = 'Saved';
      dot.classList.add('visible');
      setTimeout(() => {
        dot.classList.remove('visible');
        label.textContent = '';
        // refresh entry count
        const journal = getJournal();
        const statsEl = document.querySelector('.journal-stats span:last-child');
        const e = Object.keys(journal).length;
        if (statsEl) statsEl.textContent = `${e} entr${e !== 1 ? 'ies' : 'y'}`;
      }, 1800);
    }
  }, 600);
};

// ── Habit Tracker ─────────────────────────────────────────────────────────────
const DEFAULT_HABITS = [
  { id: 'h1', icon: '📚', name: 'Read' },
  { id: 'h2', icon: '🏃', name: 'Exercise' },
  { id: 'h3', icon: '💧', name: 'Water' },
  { id: 'h4', icon: '🧘', name: 'Meditate' },
  { id: 'h5', icon: '💻', name: 'Code' },
];

function getHabits() {
  try {
    const stored = localStorage.getItem('omniHabits');
    return stored ? JSON.parse(stored) : DEFAULT_HABITS.map(h => ({ ...h, log: {} }));
  } catch { return DEFAULT_HABITS.map(h => ({ ...h, log: {} })); }
}

function saveHabits(habits) {
  localStorage.setItem('omniHabits', JSON.stringify(habits));
}

function habitTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function habitDateOffset(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function getStreak(log) {
  const today = habitTodayStr();
  let streak = 0;
  const start = log[today] ? 0 : -1;
  for (let i = start; i >= -365; i--) {
    if (log[habitDateOffset(i)]) streak++;
    else break;
  }
  return streak;
}

function initHabitWidget() {
  const el = document.getElementById('habit-widget');
  if (!el) return;
  renderHabitWidget(el);
}

function renderHabitWidget(el) {
  const habits = getHabits();
  const today  = habitTodayStr();
  el.innerHTML = `
    <div class="habit-list">${habits.map(h => renderHabitCard(h, today)).join('')}</div>
    <div class="habit-add-row">
      <input type="text" id="habit-icon-input" class="habit-icon-input" placeholder="🌟" maxlength="4">
      <input type="text" id="habit-name-input" placeholder="New habit…" maxlength="32">
      <button onclick="addHabit()">Add Habit</button>
    </div>
  `;
}

function renderHabitCard(habit, today) {
  const streak  = getStreak(habit.log);
  const checked = !!habit.log[today];
  const safeIcon = escHtml(habit.icon);
  const safeName = escHtml(habit.name);
  const dots    = Array.from({ length: 7 }, (_, i) => {
    const d    = habitDateOffset(i - 6);
    const done = !!habit.log[d];
    const cls  = ['habit-dot', done ? 'done' : '', d === today ? 'today' : ''].filter(Boolean).join(' ');
    return `<span class="${cls}" title="${d}"></span>`;
  }).join('');

  return `
    <div class="habit-card${checked ? ' checked' : ''}" id="hcard-${habit.id}">
      <div class="habit-icon">${safeIcon}</div>
      <div class="habit-info">
        <div class="habit-name">${safeName}</div>
        <div class="habit-dots">${dots}</div>
      </div>
      <div class="habit-right">
        <div class="habit-streak${streak > 0 ? ' active' : ''}">
          ${streak > 0 ? `🔥 ${streak}d` : '—'}
        </div>
        <button class="habit-check-btn${checked ? ' done' : ''}" onclick="toggleHabit('${habit.id}')"
          aria-label="${checked ? 'Uncheck' : 'Check'} ${habit.name}">
          ${checked ? '✓' : '○'}
        </button>
      </div>
      <button class="habit-delete-btn" onclick="deleteHabit('${habit.id}')" title="Remove habit" aria-label="Delete ${habit.name}">×</button>
    </div>
  `;
}

window.toggleHabit = function (id) {
  const habits = getHabits();
  const habit  = habits.find(h => h.id === id);
  if (!habit) return;
  const today = habitTodayStr();
  habit.log[today] = !habit.log[today];
  saveHabits(habits);
  const el = document.getElementById('habit-widget');
  if (el) renderHabitWidget(el);
};

window.deleteHabit = function (id) {
  saveHabits(getHabits().filter(h => h.id !== id));
  const el = document.getElementById('habit-widget');
  if (el) renderHabitWidget(el);
};

window.addHabit = function () {
  const icon = document.getElementById('habit-icon-input').value.trim() || '🌟';
  const name = document.getElementById('habit-name-input').value.trim();
  if (!name) return;
  const habits = getHabits();
  habits.push({ id: 'h' + Date.now(), icon, name, log: {} });
  saveHabits(habits);
  const el = document.getElementById('habit-widget');
  if (el) renderHabitWidget(el);
};

// ── Pomodoro Timer ────────────────────────────────────────────────────────────
const POMO_DURATIONS = { focus: 25, short: 5, long: 15 };
const POMO_LABELS    = { focus: 'Focus', short: 'Short Break', long: 'Long Break' };
const POMO_COLORS    = { focus: '#6366f1', short: '#22c55e', long: '#3b82f6' };
const POMO_CIRC      = 2 * Math.PI * 54;

let pomoMode      = 'focus';
let pomoRemaining = POMO_DURATIONS.focus * 60;
let pomoTotal     = POMO_DURATIONS.focus * 60;
let pomoRunning   = false;
let pomoTimer     = null;
let pomoSessions  = parseInt(localStorage.getItem('omniPomoSessions') || '0');

function initPomodoroWidget() {
  const el = document.getElementById('pomodoro-widget');
  if (!el) return;

  el.innerHTML = `
    <div class="pomo-container">
      <div class="pomo-modes">
        <button class="pomo-mode active" data-mode="focus"  onclick="pomoSetMode('focus')">Focus</button>
        <button class="pomo-mode"        data-mode="short"  onclick="pomoSetMode('short')">Short Break</button>
        <button class="pomo-mode"        data-mode="long"   onclick="pomoSetMode('long')">Long Break</button>
      </div>
      <div class="pomo-ring-wrap">
        <svg class="pomo-ring" viewBox="0 0 120 120">
          <circle class="pomo-ring-bg" cx="60" cy="60" r="54"/>
          <circle class="pomo-ring-fg" id="pomo-ring-fg" cx="60" cy="60" r="54"
            stroke-dasharray="${POMO_CIRC.toFixed(2)}"
            stroke-dashoffset="0"/>
        </svg>
        <div class="pomo-center">
          <div class="pomo-time" id="pomo-time">25:00</div>
          <div class="pomo-sublabel" id="pomo-sublabel">FOCUS</div>
        </div>
      </div>
      <div class="pomo-controls">
        <button id="pomo-start" class="pomo-btn-start" onclick="pomodoroToggle()">▶ Start</button>
        <button class="pomo-btn-reset" onclick="pomodoroReset()">↺ Reset</button>
      </div>
      <div class="pomo-sessions" id="pomo-sessions"></div>
    </div>
  `;

  updatePomoDisplay();
  updatePomoSessions();
}

window.pomoSetMode = function (mode) {
  if (pomoRunning) pomodoroStop();
  pomoMode      = mode;
  pomoRemaining = POMO_DURATIONS[mode] * 60;
  pomoTotal     = pomoRemaining;
  document.querySelectorAll('.pomo-mode').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode)
  );
  const startBtn = document.getElementById('pomo-start');
  if (startBtn) startBtn.textContent = '▶ Start';
  updatePomoDisplay();
};

window.pomodoroToggle = function () {
  pomoRunning ? pomodoroStop() : pomodoroStart();
};

function pomodoroStart() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  pomoRunning = true;
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '⏸ Pause';

  pomoTimer = setInterval(() => {
    pomoRemaining--;
    updatePomoDisplay();
    if (pomoRemaining <= 0) {
      clearInterval(pomoTimer);
      pomoRunning = false;
      pomoComplete();
    }
  }, 1000);
}

function pomodoroStop() {
  pomoRunning = false;
  clearInterval(pomoTimer);
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '▶ Resume';
}

window.pomodoroReset = function () {
  pomodoroStop();
  pomoRemaining = POMO_DURATIONS[pomoMode] * 60;
  pomoTotal     = pomoRemaining;
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '▶ Start';
  updatePomoDisplay();
};

function pomoComplete() {
  playPomoBeep();
  sendPomoNotification();

  if (pomoMode === 'focus') {
    pomoSessions++;
    localStorage.setItem('omniPomoSessions', pomoSessions);
    updatePomoSessions();
    window.pomoSetMode(pomoSessions % 4 === 0 ? 'long' : 'short');
  } else {
    window.pomoSetMode('focus');
  }
}

function updatePomoDisplay() {
  const mins = String(Math.floor(pomoRemaining / 60)).padStart(2, '0');
  const secs = String(pomoRemaining % 60).padStart(2, '0');

  const timeEl  = document.getElementById('pomo-time');
  const labelEl = document.getElementById('pomo-sublabel');
  const ringEl  = document.getElementById('pomo-ring-fg');

  if (timeEl)  timeEl.textContent  = `${mins}:${secs}`;
  if (labelEl) labelEl.textContent = POMO_LABELS[pomoMode].toUpperCase();

  if (ringEl) {
    const progress = pomoTotal > 0 ? pomoRemaining / pomoTotal : 1;
    ringEl.style.strokeDashoffset = (POMO_CIRC * (1 - progress)).toFixed(2);
    ringEl.style.stroke = POMO_COLORS[pomoMode];
  }

  if (pomoRunning) {
    document.title = `${mins}:${secs} · ${POMO_LABELS[pomoMode]} — OmniWeb`;
  } else {
    const titleBase = document.querySelector('title');
    if (titleBase) document.title = 'OmniWeb — Dashboard';
  }
}

function updatePomoSessions() {
  const el = document.getElementById('pomo-sessions');
  if (!el) return;
  const filled = pomoSessions % 4;
  const dots   = '🍅'.repeat(filled) + '<span class="pomo-dot-empty">○</span>'.repeat(4 - filled);
  el.innerHTML = `<span class="pomo-dots">${dots}</span>
    <span class="pomo-session-count">${pomoSessions} session${pomoSessions !== 1 ? 's' : ''} completed</span>`;
}

function sendPomoNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const isBreak = pomoMode !== 'focus';
  new Notification(isBreak ? '⏰ Break over!' : '🍅 Pomodoro complete!', {
    body: isBreak ? 'Time to get back to work.' : 'Nice work! Take a short break.',
    icon: '/favicon.svg',
    silent: false,
  });
}

function playPomoBeep() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const freq = pomoMode === 'focus' ? 880 : 660;
    [0, 180, 360].forEach(delayMs => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + delayMs / 1000;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  } catch (_) {}
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

window.copyToClipboard = text => navigator.clipboard.writeText(text);
