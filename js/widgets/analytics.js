import { storageGet, storageRemove } from '../utils.js';

const STORAGE_KEY = 'omniAnalytics';

function render() {
  const el = document.getElementById('analytics-widget');
  if (!el) return;

  const stats  = storageGet(STORAGE_KEY, { pages: {}, sessions: 0 });
  const pages  = Object.entries(stats.pages).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total  = Object.values(stats.pages).reduce((s, v) => s + v, 0);
  const unique = Object.keys(stats.pages).length;

  el.innerHTML = `
    <div class="analytics-stats">
      <div class="analytics-stat">
        <span class="analytics-num">${total}</span>
        <span class="analytics-label">Total Visits</span>
      </div>
      <div class="analytics-stat">
        <span class="analytics-num">${unique}</span>
        <span class="analytics-label">Pages</span>
      </div>
      <div class="analytics-stat">
        <span class="analytics-num">${stats.sessions}</span>
        <span class="analytics-label">Sessions</span>
      </div>
    </div>
    <div class="analytics-pages">
      ${pages.map(([page, count]) => `
        <div class="analytics-row">
          <span class="analytics-page">${page}</span>
          <div class="analytics-bar-wrap">
            <div class="analytics-bar" style="width:${total ? Math.round((count / total) * 100) : 0}%"></div>
          </div>
          <span class="analytics-count">${count}</span>
        </div>`).join('')}
    </div>
    <button class="analytics-reset" onclick="resetAnalytics()">Reset Stats</button>`;
}

window.resetAnalytics = function () {
  if (confirm('Reset all analytics data?')) {
    storageRemove(STORAGE_KEY);
    render();
  }
};

export function init() {
  if (!document.getElementById('analytics-widget')) return;
  render();
}
