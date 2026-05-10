import { escHtml, storageSet, storageGet } from '../utils.js';

const STORAGE_KEY = 'omniLinks';

const DEFAULT_LINKS = [
  { label: 'GitHub',    url: 'https://github.com',               icon: '🐙' },
  { label: 'YouTube',   url: 'https://youtube.com',              icon: '📺' },
  { label: 'Google',    url: 'https://google.com',               icon: '🔍' },
  { label: 'MDN Docs',  url: 'https://developer.mozilla.org',    icon: '📖' },
  { label: 'Dashboard', url: 'dashboard.html',                   icon: '📊' },
];

const getLinks = () => storageGet(STORAGE_KEY, DEFAULT_LINKS);

function render() {
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
    </div>`).join('');
}

window.addQuickLink = function () {
  const label = document.getElementById('ql-label')?.value.trim();
  const url   = document.getElementById('ql-url')?.value.trim();
  const icon  = document.getElementById('ql-icon')?.value.trim() || '🔗';
  if (!label || !url) return;
  const links = getLinks();
  links.push({ label, url, icon });
  storageSet(STORAGE_KEY, links);
  ['ql-label', 'ql-url', 'ql-icon'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  render();
};

window.deleteLink = function (i) {
  const links = getLinks();
  links.splice(i, 1);
  storageSet(STORAGE_KEY, links);
  render();
};

export function init() {
  const widget = document.getElementById('quicklinks-widget');
  if (!widget) return;
  if (!localStorage.getItem(STORAGE_KEY)) {
    storageSet(STORAGE_KEY, DEFAULT_LINKS);
  }
  render();
}
