import { isoToday, isoOffset, storageGet, storageSet } from '../utils.js';

const STORAGE_KEY = 'omniJournal';

let currentDate = isoToday();
let saveTimer   = null;

const getJournal = () => storageGet(STORAGE_KEY, {});

function saveEntry(date, text) {
  const journal = getJournal();
  if (text.trim()) journal[date] = text;
  else             delete journal[date];
  storageSet(STORAGE_KEY, journal);
}

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function render(el) {
  const today   = isoToday();
  const isToday = currentDate === today;
  const journal = getJournal();
  const text    = journal[currentDate] || '';
  const entries = Object.keys(journal).length;
  const words   = text.trim() ? text.trim().split(/\s+/).length : 0;

  el.innerHTML = `
    <div class="journal-nav">
      <button class="journal-nav-btn" onclick="journalNav(-1)" aria-label="Previous day">‹</button>
      <div class="journal-date-label">
        ${formatDate(currentDate)}
        ${isToday ? '<span class="journal-today-chip">Today</span>' : ''}
      </div>
      <button class="journal-nav-btn" onclick="journalNav(1)"
        ${isToday ? 'disabled' : ''} aria-label="Next day">›</button>
    </div>
    <textarea class="journal-textarea" id="journal-textarea"
      placeholder="${isToday ? "What's on your mind today?" : 'No entry for this day.'}"
      oninput="journalOnInput(this)" aria-label="Journal entry">${text}</textarea>
    <div class="journal-footer">
      <div class="journal-save-status">
        <div class="journal-save-dot" id="journal-save-dot"></div>
        <span id="journal-save-label"></span>
      </div>
      <div class="journal-stats">
        <span id="journal-wordcount">${words > 0 ? `${words} word${words !== 1 ? 's' : ''}` : ''}</span>
        <span>${entries} entr${entries !== 1 ? 'ies' : 'y'}</span>
      </div>
    </div>`;
}

window.journalNav = function (direction) {
  const today = isoToday();
  const next  = isoOffset(currentDate, direction);
  if (next > today) return;
  currentDate = next;
  const el = document.getElementById('journal-widget');
  if (el) render(el);
};

window.journalOnInput = function (textarea) {
  const text  = textarea.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const wc    = document.getElementById('journal-wordcount');
  if (wc) wc.textContent = words > 0 ? `${words} word${words !== 1 ? 's' : ''}` : '';

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveEntry(currentDate, text);
    const dot   = document.getElementById('journal-save-dot');
    const label = document.getElementById('journal-save-label');
    if (!dot || !label) return;
    label.textContent = 'Saved';
    dot.classList.add('visible');
    setTimeout(() => {
      dot.classList.remove('visible');
      label.textContent = '';
      const journal  = getJournal();
      const statsEl  = document.querySelector('.journal-stats span:last-child');
      const count    = Object.keys(journal).length;
      if (statsEl) statsEl.textContent = `${count} entr${count !== 1 ? 'ies' : 'y'}`;
    }, 1800);
  }, 600);
};

export function init() {
  const el = document.getElementById('journal-widget');
  if (!el) return;
  currentDate = isoToday();
  render(el);
}
