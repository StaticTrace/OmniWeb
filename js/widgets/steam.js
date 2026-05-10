import { escHtml } from '../utils.js';

// ── Time helpers ──────────────────────────────────────────────────────────────
function parseEndTime(raw) {
  if (!raw) return null;
  const asNum = Number(raw);
  if (!isNaN(asNum) && asNum > 1e9) return asNum * 1000;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d.getTime();
}

function timeRemaining(endTimeRaw) {
  const endMs = parseEndTime(endTimeRaw);
  if (endMs === null) return null;
  const diff = endMs - Date.now();
  if (diff <= 0) return { label: 'Expired', urgent: false };
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h < 2)  return { label: `⏱ ${h}h ${m}m left`, urgent: true };
  if (h < 24) return { label: `⏱ ${h}h left`,        urgent: true };
  return { label: `⏱ ${Math.floor(h / 24)}d ${h % 24}h left`, urgent: false };
}

function formatTimestamp(raw) {
  const asNum = Number(raw);
  const d = (!isNaN(asNum) && asNum > 1e9) ? new Date(asNum * 1000) : new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── Card builder ──────────────────────────────────────────────────────────────
function buildCard(g) {
  const imgUrl   = `https://cdn.cloudflare.steamstatic.com/steam/apps/${escHtml(g.app_id)}/header.jpg`;
  const storeUrl = `https://store.steampowered.com/app/${escHtml(g.app_id)}/`;
  const isKeep   = g.type === 'Free to Keep';

  const badge = isKeep
    ? `<span class="steam-badge steam-badge-keep">🎁 Free to Keep</span>`
    : `<span class="steam-badge steam-badge-weekend">🎮 Free Weekend</span>`;

  const tr = timeRemaining(g.end_time);
  const endLabel = tr
    ? `<span class="steam-time-left ${tr.urgent ? 'urgent' : ''}">${escHtml(tr.label)}</span>`
    : g.end_time
      ? `<span class="steam-time-left">Ends: ${escHtml(g.end_time)}</span>`
      : '';

  const startLabel = g.start_time
    ? `<span class="steam-time-started">Started: ${escHtml(formatTimestamp(g.start_time))}</span>`
    : '';

  return `
    <a class="steam-card" href="${storeUrl}" target="_blank" rel="noopener">
      <div class="steam-card-img-wrap">
        <img class="steam-card-img" src="${imgUrl}" alt="${escHtml(g.name)}"
             onerror="this.style.display='none';this.parentElement.classList.add('no-img')">
      </div>
      <div class="steam-card-body">
        ${badge}
        <div class="steam-card-title">${escHtml(g.name)}</div>
        <div class="steam-card-meta">${startLabel}${endLabel}</div>
      </div>
    </a>`;
}

// ── Render states ─────────────────────────────────────────────────────────────
function renderLoading(el) {
  el.innerHTML = `
    <div class="steam-loading">
      <span class="steam-spinner"></span>
      <span>Fetching free games from SteamDB…</span>
    </div>`;
}

function renderError(el, icon, title, message) {
  el.innerHTML = `
    <div class="steam-error">
      <span class="steam-error-icon">${icon}</span>
      <div>
        <strong>${title}</strong>
        <p>${escHtml(message)}</p>
        <button class="steam-retry-btn"
          onclick="fetchSteamGames(document.getElementById('steam-widget'))">Retry</button>
      </div>
    </div>`;
}

function renderEmpty(el) {
  el.innerHTML = `
    <p class="widget-muted">No free Steam promotions found right now. Check back later!</p>
    <div style="margin-top:10px;">
      <a href="https://steamdb.info/upcoming/free/" target="_blank" rel="noopener"
         class="steam-link-btn">View on SteamDB ↗</a>
    </div>`;
}

function renderGames(el, games) {
  el.innerHTML = `
    <div class="steam-grid">${games.map(buildCard).join('')}</div>
    <div class="steam-footer">
      <a href="https://steamdb.info/upcoming/free/" target="_blank" rel="noopener"
         class="steam-link-btn">View all on SteamDB ↗</a>
      <button class="steam-retry-btn"
        onclick="fetchSteamGames(document.getElementById('steam-widget'))">↻ Refresh</button>
    </div>`;
}

// ── Public API (called from onclick in rendered HTML) ─────────────────────────
window.fetchSteamGames = function (el) {
  renderLoading(el);
  fetch('/api/steam-free-games')
    .then(r => r.json())
    .then(data => {
      if (data.cf_blocked) {
        renderError(el, '🛡️', 'Blocked by Cloudflare',
          'SteamDB is protected and the request was blocked. Try refreshing in a moment.');
        return;
      }
      if (data.error && !data.games?.length) {
        renderError(el, '⚠️', 'Error loading games', data.error);
        return;
      }
      const games = data.games || [];
      if (!games.length) { renderEmpty(el); return; }
      renderGames(el, games);
    })
    .catch(err => {
      el.innerHTML = `<p class="widget-muted">Could not load Steam data: ${escHtml(String(err))}</p>`;
    });
};

export function init() {
  const el = document.getElementById('steam-widget');
  if (!el) return;
  window.fetchSteamGames(el);
}
