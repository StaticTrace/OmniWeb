// script.js - Core functionality for flat OmniWeb

document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initMobileMenu();
  initWidgets();
});

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

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
}

function initWidgets() {
  // Time widget
  const timeEl = document.getElementById('current-time');
  if (timeEl) {
    setInterval(() => {
      timeEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
  }

  // Weather (simple fallback)
  const weatherEl = document.getElementById('weather');
  if (weatherEl) {
    weatherEl.textContent = 'Loading weather...';
    fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.76&current_weather=true')
      .then(r => r.json())
      .then(data => {
        weatherEl.textContent = `${data.current_weather.temperature}°C`;
      })
      .catch(() => weatherEl.textContent = 'Weather unavailable');
  }
}

// Expose utilities globally for tool files
window.copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};