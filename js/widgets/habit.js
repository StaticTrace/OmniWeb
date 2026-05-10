import { escHtml, isoToday, isoOffset, storageGet, storageSet } from '../utils.js';

const STORAGE_KEY = 'omniHabits';

const DEFAULT_HABITS = [
  { id: 'h1', icon: '📚', name: 'Read' },
  { id: 'h2', icon: '🏃', name: 'Exercise' },
  { id: 'h3', icon: '💧', name: 'Water' },
  { id: 'h4', icon: '🧘', name: 'Meditate' },
  { id: 'h5', icon: '💻', name: 'Code' },
];

const getHabits  = ()       => storageGet(STORAGE_KEY, DEFAULT_HABITS.map(h => ({ ...h, log: {} })));
const saveHabits = (habits) => storageSet(STORAGE_KEY, habits);

function streak(log) {
  const today = isoToday();
  let count = 0;
  const start = log[today] ? 0 : -1;
  for (let i = start; i >= -365; i--) {
    if (log[isoOffset(today, i)]) count++;
    else break;
  }
  return count;
}

function habitCard(habit, today) {
  const s       = streak(habit.log);
  const checked = !!habit.log[today];
  const dots    = Array.from({ length: 7 }, (_, i) => {
    const d    = isoOffset(today, i - 6);
    const done = !!habit.log[d];
    const cls  = ['habit-dot', done ? 'done' : '', d === today ? 'today' : ''].filter(Boolean).join(' ');
    return `<span class="${cls}" title="${d}"></span>`;
  }).join('');

  return `
    <div class="habit-card${checked ? ' checked' : ''}" id="hcard-${habit.id}">
      <div class="habit-icon">${escHtml(habit.icon)}</div>
      <div class="habit-info">
        <div class="habit-name">${escHtml(habit.name)}</div>
        <div class="habit-dots">${dots}</div>
      </div>
      <div class="habit-right">
        <div class="habit-streak${s > 0 ? ' active' : ''}">${s > 0 ? `🔥 ${s}d` : '—'}</div>
        <button class="habit-check-btn${checked ? ' done' : ''}" onclick="toggleHabit('${habit.id}')"
          aria-label="${checked ? 'Uncheck' : 'Check'} ${habit.name}">
          ${checked ? '✓' : '○'}
        </button>
      </div>
      <button class="habit-delete-btn" onclick="deleteHabit('${habit.id}')"
        title="Remove habit" aria-label="Delete ${habit.name}">×</button>
    </div>`;
}

function render(el) {
  const habits = getHabits();
  const today  = isoToday();
  el.innerHTML = `
    <div class="habit-list">${habits.map(h => habitCard(h, today)).join('')}</div>
    <div class="habit-add-row">
      <input type="text" id="habit-icon-input" class="habit-icon-input" placeholder="🌟" maxlength="4">
      <input type="text" id="habit-name-input" placeholder="New habit…" maxlength="32">
      <button onclick="addHabit()">Add Habit</button>
    </div>`;
}

window.toggleHabit = function (id) {
  const habits = getHabits();
  const habit  = habits.find(h => h.id === id);
  if (!habit) return;
  habit.log[isoToday()] = !habit.log[isoToday()];
  saveHabits(habits);
  const el = document.getElementById('habit-widget');
  if (el) render(el);
};

window.deleteHabit = function (id) {
  saveHabits(getHabits().filter(h => h.id !== id));
  const el = document.getElementById('habit-widget');
  if (el) render(el);
};

window.addHabit = function () {
  const icon = document.getElementById('habit-icon-input')?.value.trim() || '🌟';
  const name = document.getElementById('habit-name-input')?.value.trim();
  if (!name) return;
  const habits = getHabits();
  habits.push({ id: `h${Date.now()}`, icon, name, log: {} });
  saveHabits(habits);
  const el = document.getElementById('habit-widget');
  if (el) render(el);
};

export function init() {
  const el = document.getElementById('habit-widget');
  if (!el) return;
  render(el);
}
