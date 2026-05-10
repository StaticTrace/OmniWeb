import { storageGet, storageSet } from '../utils.js';

const STORAGE_KEY = 'omniFocus';

function load() {
  const stored = storageGet(STORAGE_KEY);
  const today  = new Date().toDateString();
  return stored?.date === today ? stored.text : '';
}

function render() {
  const el = document.getElementById('focus-widget');
  if (!el) return;
  const text = load();

  el.innerHTML = `
    <div class="focus-text ${text ? '' : 'empty'}" id="focus-display">
      ${text || 'No focus set for today yet.'}
    </div>
    <div class="focus-input-row">
      <input type="text" id="focus-input" placeholder="What's your focus today?"
             value="${text}" maxlength="120">
      <button onclick="setFocus()">Set</button>
    </div>`;

  const input = document.getElementById('focus-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.setFocus(); });
}

window.setFocus = function () {
  const input = document.getElementById('focus-input');
  const text  = input?.value.trim();
  if (!text) return;
  storageSet(STORAGE_KEY, { text, date: new Date().toDateString() });
  const display = document.getElementById('focus-display');
  if (display) { display.textContent = text; display.classList.remove('empty'); }
};

export function init() {
  if (!document.getElementById('focus-widget')) return;
  render();
}
