// tools.js - OmniWeb Tool Suite

document.addEventListener('DOMContentLoaded', () => {
  initTextCounter();
  initCalculator();
});

// ── Text Counter ──────────────────────────────────────────────────────────────
function initTextCounter() {
  const textarea = document.getElementById('text-input');
  const stats = document.getElementById('text-stats');
  if (!textarea || !stats) return;

  function updateStats() {
    const text = textarea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const lines = text ? text.split('\n').length : 0;
    const readTime = Math.max(1, Math.ceil(words / 200));
    stats.innerHTML = `
Words: <strong>${words}</strong> &nbsp;|&nbsp;
Chars: <strong>${chars}</strong> &nbsp;|&nbsp;
No spaces: <strong>${charsNoSpace}</strong> &nbsp;|&nbsp;
Lines: <strong>${lines}</strong> &nbsp;|&nbsp;
~${readTime} min read`;
  }

  textarea.addEventListener('input', updateStats);
  updateStats();
}

// ── Password Generator ────────────────────────────────────────────────────────
let currentPassword = '';

function generatePassword() {
  const lengthEl = document.getElementById('pw-length');
  const length = Math.min(64, Math.max(8, parseInt(lengthEl?.value || '16')));
  const includeNumbers = document.getElementById('include-numbers')?.checked;
  const includeSymbols = document.getElementById('include-symbols')?.checked;

  const lower   = 'abcdefghijklmnopqrstuvwxyz';
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lower + upper;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  currentPassword = Array.from(arr, v => chars[v % chars.length]).join('');
  const out = document.getElementById('password-output');
  if (out) out.value = currentPassword;
}

function copyPassword() {
  if (!currentPassword) { generatePassword(); }
  navigator.clipboard.writeText(currentPassword).then(() => showToast('Password copied!'));
}

// ── Random Name Generator ──────────────────────────────────────────────────────
const ADJECTIVES = ['Swift','Dark','Neon','Ghost','Cyber','Pixel','Void','Iron','Storm','Shadow','Frost','Blaze','Lunar','Solar','Quantum','Nexus','Echo','Ember','Nova','Flux','Hyper','Onyx','Prism','Rogue','Stealth','Vector','Zenith','Apex','Cipher','Delta'];
const NOUNS      = ['Fox','Wolf','Eagle','Tiger','Raven','Cobra','Hawk','Lynx','Viper','Phoenix','Dragon','Falcon','Cipher','Vector','Pulse','Core','Node','Byte','Grid','Wave','Orbit','Comet','Quasar','Ranger','Specter','Titan','Nexus','Rift','Surge','Blaze'];
const FIRST      = ['Alex','Blake','Casey','Dana','Ellis','Finn','Gray','Hunter','Indie','Jace','Kai','Logan','Morgan','Noel','Owen','Quinn','Reese','Sage','Taylor','Uma','Vale','West','Xen','Yael','Zara','Ash','Brook','Cole','Drew','Eden'];
const LAST       = ['Stone','Cross','Wells','Blake','Frost','Hayes','Knox','Lane','Nash','Park','Quinn','Reed','Shaw','Troy','Vance','Wade','York','Zane','Adler','Crane','Drake','Ellis','Ford','Grant','Hale','Lark','Marsh','Nolan','Pierce','Rowe'];
const CODE_A     = ['Operation','Project','Mission','Protocol','Directive','Initiative','Sequence','Vector'];
const CODE_N     = ['Midnight','Ironclad','Starfall','Vortex','Eclipse','Phantom','Thunderstrike','Cobalt','Neon','Obsidian'];

const nameHistory = [];

function generateName() {
  const mode = document.querySelector('input[name="namegen-mode"]:checked')?.value || 'username';
  let result = '';

  if (mode === 'username') {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 90) + 10;
    result = `${adj}${noun}${num}`;
  } else if (mode === 'fullname') {
    const first = FIRST[Math.floor(Math.random() * FIRST.length)];
    const last  = LAST[Math.floor(Math.random() * LAST.length)];
    result = `${first} ${last}`;
  } else {
    const a = CODE_A[Math.floor(Math.random() * CODE_A.length)];
    const n = CODE_N[Math.floor(Math.random() * CODE_N.length)];
    result = `${a} ${n}`;
  }

  document.getElementById('namegen-result').textContent = result;
  nameHistory.unshift(result);
  if (nameHistory.length > 5) nameHistory.pop();

  const hist = document.getElementById('namegen-history');
  if (hist && nameHistory.length > 1) {
    hist.innerHTML = `<p style="font-size:0.78rem;color:var(--muted);margin-bottom:6px;">Recent</p>` +
      nameHistory.slice(1).map(n => `<span style="display:inline-block;font-size:0.82rem;color:var(--muted);margin-right:10px;cursor:pointer;" onclick="document.getElementById('namegen-result').textContent='${n}'">${n}</span>`).join('');
  }
}

function copyName() {
  const text = document.getElementById('namegen-result')?.textContent;
  if (!text || text === 'Hit Generate ↓') return;
  navigator.clipboard.writeText(text).then(() => showToast('Name copied!'));
}

// ── Calculator ────────────────────────────────────────────────────────────────
function initCalculator() {
  const display = document.getElementById('calc-display');
  const calcGrid = document.querySelector('.calc-grid');
  if (!calcGrid || !display) return;

  let currentInput = '0';
  let shouldReset = false;

  const buttons = [
    { label: 'C',   cls: 'special' }, { label: '±', cls: 'special' }, { label: '%', cls: 'special' }, { label: '÷', cls: 'operator' },
    { label: '7' },  { label: '8' },  { label: '9' },  { label: '×', cls: 'operator' },
    { label: '4' },  { label: '5' },  { label: '6' },  { label: '-', cls: 'operator' },
    { label: '1' },  { label: '2' },  { label: '3' },  { label: '+', cls: 'operator' },
    { label: '0',  cls: 'zero' },     { label: '.' },   { label: '=', cls: 'equals operator' },
  ];

  buttons.forEach(({ label, cls }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (cls) cls.split(' ').forEach(c => btn.classList.add(c));
    btn.addEventListener('click', () => handleCalcInput(label));
    calcGrid.appendChild(btn);
  });

  function handleCalcInput(val) {
    if ('0123456789.'.includes(val)) {
      if (shouldReset) { currentInput = val; shouldReset = false; }
      else { currentInput = currentInput === '0' && val !== '.' ? val : currentInput + val; }
    } else if (val === 'C') {
      currentInput = '0'; shouldReset = false;
    } else if (val === '±') {
      currentInput = String(-parseFloat(currentInput));
    } else if (val === '%') {
      currentInput = String(parseFloat(currentInput) / 100);
    } else if (['+', '-', '×', '÷'].includes(val)) {
      currentInput += ` ${val} `;
    } else if (val === '=') {
      try {
        const expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        currentInput = String(Function('"use strict";return (' + expr + ')')());
      } catch { currentInput = 'Error'; }
      shouldReset = true;
    }
    display.value = currentInput;
  }
}

// ── JSON Formatter ────────────────────────────────────────────────────────────
function formatJSON() {
  const input = document.getElementById('json-input');
  const output = document.getElementById('json-output');
  try {
    output.textContent = JSON.stringify(JSON.parse(input.value), null, 2);
    output.style.color = 'var(--text)';
  } catch (err) {
    output.textContent = '✗ ' + err.message;
    output.style.color = '#f87171';
  }
}

function minifyJSON() {
  const input = document.getElementById('json-input');
  const output = document.getElementById('json-output');
  try {
    output.textContent = JSON.stringify(JSON.parse(input.value));
    output.style.color = 'var(--text)';
  } catch (err) {
    output.textContent = '✗ ' + err.message;
    output.style.color = '#f87171';
  }
}

function copyJSON() {
  const output = document.getElementById('json-output');
  if (!output?.textContent) return;
  navigator.clipboard.writeText(output.textContent).then(() => showToast('JSON copied!'));
}

// ── Toast Notification ────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('ow-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ow-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#22c55e;color:white;padding:10px 18px;border-radius:8px;font-size:0.88rem;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.2s ease;font-family:Inter,system-ui,sans-serif;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
}
