// Site-wide initialization — header, dark mode, SW, analytics, scroll animations
import { storageGet, storageSet } from './utils.js';

export const GITHUB_USERNAME = 'StaticTrace';

export function initCore() {
  registerServiceWorker();
  initDarkMode();
  initMobileMenu();
  initFooterYear();
  trackPageVisit();
  initScrollAnimations();
}

// ── Service Worker ────────────────────────────────────────────────────────────
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });
    })
    .catch(err => console.warn('SW registration failed:', err));
}

function showUpdateBanner() {
  const banner = document.createElement('div');
  banner.style.cssText = [
    'position:fixed;bottom:0;left:0;right:0;background:#6366f1;color:white',
    'text-align:center;padding:12px 16px;font-size:0.9rem;font-weight:500;z-index:9999',
    'display:flex;align-items:center;justify-content:center;gap:12px',
    'font-family:Inter,system-ui,sans-serif',
  ].join(';');
  banner.innerHTML = `
    <span>A new version of OmniWeb is available.</span>
    <button onclick="location.reload()"
      style="background:white;color:#6366f1;border:none;border-radius:6px;padding:5px 14px;font-weight:700;cursor:pointer;font-size:0.85rem;">
      Refresh
    </button>
    <button onclick="this.parentElement.remove()"
      style="background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.2rem;padding:0 4px;"
      aria-label="Dismiss">×</button>`;
  document.body.appendChild(banner);
}

// ── Dark Mode ─────────────────────────────────────────────────────────────────
function initDarkMode() {
  const toggle = document.querySelector('.toggle-dark');
  if (!toggle) return;
  const isDark = localStorage.getItem('theme') !== 'light';
  document.documentElement.classList.toggle('light', !isDark);
  toggle.textContent = isDark ? '☀️' : '🌙';
  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    toggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav     = document.querySelector('.site-nav');
  if (!menuBtn || !nav) return;

  const open  = () => { nav.classList.add('active');    menuBtn.textContent = '✕'; menuBtn.setAttribute('aria-expanded', 'true'); };
  const close = () => { nav.classList.remove('active'); menuBtn.textContent = '☰'; menuBtn.setAttribute('aria-expanded', 'false'); };

  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.addEventListener('click', e => { e.stopPropagation(); nav.classList.contains('active') ? close() : open(); });
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// ── Footer Year ───────────────────────────────────────────────────────────────
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ── Page Visit Tracking ───────────────────────────────────────────────────────
function trackPageVisit() {
  const page  = location.pathname.split('/').pop() || 'index.html';
  const stats = storageGet('omniAnalytics', { pages: {}, sessions: 0 });
  if (!sessionStorage.getItem('omniSession')) {
    sessionStorage.setItem('omniSession', '1');
    stats.sessions = (stats.sessions || 0) + 1;
  }
  stats.pages[page] = (stats.pages[page] || 0) + 1;
  storageSet('omniAnalytics', stats);
}

// ── Scroll Animations ─────────────────────────────────────────────────────────
function initScrollAnimations() {
  const widgets = document.querySelectorAll('.widget');
  if (!widgets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  widgets.forEach(w => { w.classList.add('will-animate'); observer.observe(w); });
}
