import { initCore } from '../core.js';
import { escHtml } from '../utils.js';

// ── Vault storage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY = 'omniVault';

const getVaultNotes = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const setVaultNotes = (notes) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

// ── Toast (inline — vault has its own error/success style) ────────────────────
function vaultToast(msg, isError = false) {
  let t = document.getElementById('vault-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'vault-toast';
    t.style.cssText = [
      'position:fixed;bottom:24px;right:24px;padding:10px 18px',
      'border-radius:8px;font-size:0.88rem;font-weight:600;z-index:9999',
      'opacity:0;transition:opacity 0.2s ease;font-family:Inter,system-ui,sans-serif;color:white',
    ].join(';');
    document.body.appendChild(t);
  }
  t.textContent      = msg;
  t.style.background = isError ? '#ef4444' : '#22c55e';
  t.style.opacity    = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderNotes() {
  const list  = document.getElementById('vault-list');
  const notes = getVaultNotes();
  if (!list) return;

  if (!notes.length) {
    list.innerHTML = '<p style="color:var(--muted);">No notes yet.</p>';
    return;
  }

  list.innerHTML = notes.map((n, i) => `
    <div style="background:var(--surface2);padding:14px;border-radius:8px;margin-bottom:12px;position:relative;">
      <small style="color:var(--muted);">${escHtml(n.date)}</small>
      <p style="margin-top:8px;white-space:pre-wrap;word-break:break-word;">${escHtml(n.text)}</p>
      <button onclick="deleteVaultNote(${i})" title="Delete note"
        style="position:absolute;top:10px;right:10px;background:none;border:none;color:var(--muted);font-size:1rem;cursor:pointer;padding:2px 6px;line-height:1;">×</button>
    </div>`).join('');
}

// ── Window-exposed handlers (called from inline onclick in vault.html) ─────────
window.saveVault = function () {
  const input = document.getElementById('vault-input');
  const text  = input?.value.trim();
  if (!text) { vaultToast('Note is empty!', true); return; }
  const notes = getVaultNotes();
  notes.unshift({ text, date: new Date().toLocaleString() });
  setVaultNotes(notes);
  if (input) input.value = '';
  vaultToast('Note saved!');
  renderNotes();
};

window.loadVault = function () { renderNotes(); };

window.deleteVaultNote = function (i) {
  const notes = getVaultNotes();
  notes.splice(i, 1);
  setVaultNotes(notes);
  vaultToast('Note deleted.');
  renderNotes();
};

window.clearVault = function () {
  if (confirm('Clear all notes permanently?')) {
    localStorage.removeItem(STORAGE_KEY);
    vaultToast('All notes cleared.');
    renderNotes();
  }
};

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCore();
  renderNotes();
});
