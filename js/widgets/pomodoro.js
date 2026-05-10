const DURATIONS = { focus: 25, short: 5,  long: 15 };
const LABELS    = { focus: 'Focus', short: 'Short Break', long: 'Long Break' };
const COLORS    = { focus: '#6366f1', short: '#22c55e', long: '#3b82f6' };
const CIRC      = 2 * Math.PI * 54;

let mode      = 'focus';
let remaining = DURATIONS.focus * 60;
let total     = DURATIONS.focus * 60;
let running   = false;
let timer     = null;
let sessions  = parseInt(localStorage.getItem('omniPomoSessions') || '0', 10);

// ── Internal helpers ──────────────────────────────────────────────────────────
function updateDisplay() {
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  const timeEl  = document.getElementById('pomo-time');
  const labelEl = document.getElementById('pomo-sublabel');
  const ringEl  = document.getElementById('pomo-ring-fg');

  if (timeEl)  timeEl.textContent  = `${mins}:${secs}`;
  if (labelEl) labelEl.textContent = LABELS[mode].toUpperCase();

  if (ringEl) {
    const progress = total > 0 ? remaining / total : 1;
    ringEl.style.strokeDashoffset = (CIRC * (1 - progress)).toFixed(2);
    ringEl.style.stroke = COLORS[mode];
  }

  document.title = running
    ? `${mins}:${secs} · ${LABELS[mode]} — OmniWeb`
    : 'OmniWeb — Dashboard';
}

function updateSessions() {
  const el = document.getElementById('pomo-sessions');
  if (!el) return;
  const filled = sessions % 4;
  const dots   = '🍅'.repeat(filled) + '<span class="pomo-dot-empty">○</span>'.repeat(4 - filled);
  el.innerHTML = `<span class="pomo-dots">${dots}</span>
    <span class="pomo-session-count">${sessions} session${sessions !== 1 ? 's' : ''} completed</span>`;
}

function stop() {
  running = false;
  clearInterval(timer);
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '▶ Resume';
}

function beep() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const freq = mode === 'focus' ? 880 : 660;
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

function notify() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const isBreak = mode !== 'focus';
  new Notification(isBreak ? '⏰ Break over!' : '🍅 Pomodoro complete!', {
    body: isBreak ? 'Time to get back to work.' : 'Nice work! Take a short break.',
    icon: '/favicon.svg',
    silent: false,
  });
}

function complete() {
  beep();
  notify();
  if (mode === 'focus') {
    sessions++;
    localStorage.setItem('omniPomoSessions', sessions);
    updateSessions();
    window.pomoSetMode(sessions % 4 === 0 ? 'long' : 'short');
  } else {
    window.pomoSetMode('focus');
  }
}

// ── Window-exposed API (called from inline onclick) ───────────────────────────
window.pomoSetMode = function (newMode) {
  if (running) stop();
  mode      = newMode;
  remaining = DURATIONS[newMode] * 60;
  total     = remaining;
  document.querySelectorAll('.pomo-mode').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === newMode));
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '▶ Start';
  updateDisplay();
};

window.pomodoroToggle = function () { running ? stop() : pomodoroStart(); };

window.pomodoroReset = function () {
  stop();
  remaining = DURATIONS[mode] * 60;
  total     = remaining;
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '▶ Start';
  updateDisplay();
};

function pomodoroStart() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  running = true;
  const btn = document.getElementById('pomo-start');
  if (btn) btn.textContent = '⏸ Pause';
  timer = setInterval(() => {
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(timer);
      running = false;
      complete();
    }
  }, 1000);
}

export function init() {
  const el = document.getElementById('pomodoro-widget');
  if (!el) return;

  el.innerHTML = `
    <div class="pomo-container">
      <div class="pomo-modes">
        <button class="pomo-mode active" data-mode="focus" onclick="pomoSetMode('focus')">Focus</button>
        <button class="pomo-mode" data-mode="short" onclick="pomoSetMode('short')">Short Break</button>
        <button class="pomo-mode" data-mode="long"  onclick="pomoSetMode('long')">Long Break</button>
      </div>
      <div class="pomo-ring-wrap">
        <svg class="pomo-ring" viewBox="0 0 120 120">
          <circle class="pomo-ring-bg" cx="60" cy="60" r="54"/>
          <circle class="pomo-ring-fg" id="pomo-ring-fg" cx="60" cy="60" r="54"
            stroke-dasharray="${CIRC.toFixed(2)}" stroke-dashoffset="0"/>
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
    </div>`;

  updateDisplay();
  updateSessions();
}
