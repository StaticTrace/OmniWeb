// sw.js - OmniWeb Service Worker

const CACHE_NAME = 'omniweb-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/about.html',
  '/projects.html',
  '/tools.html',
  '/vault.html',
  '/contact.html',
  '/style.css',
  '/script.js',
  '/tools.js',
  '/favicon.svg',
  '/manifest.json',
];

// ── Install: cache all static assets ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: delete old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for static, network-first for APIs ────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // External API calls — network first, no cache fallback
  if (
    url.hostname === 'api.open-meteo.com' ||
    url.hostname === 'api.github.com' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(fetch(request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Static assets — cache first, fall back to network
  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          // Cache valid same-origin responses
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
      .catch(() => {
        // Offline fallback for HTML navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      })
  );
});
