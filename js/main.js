// Utility: Set current year in footer
function setCurrentYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Dark Mode Management
const darkModeToggle = document.querySelector('.toggle-dark');
const html = document.documentElement;

function initDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedMode !== null ? JSON.parse(savedMode) : prefersDark;
  applyDarkMode(isDark);
}

function applyDarkMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  if (darkModeToggle) {
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  }
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    updateDarkModeIcon(isDark);
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const siteNav = document.querySelector('.site-nav');

function closeMenu() {
  if (siteNav && mobileMenuBtn) {
    siteNav.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.textContent = '☰';
  }
}

function toggleMenu() {
  if (siteNav && mobileMenuBtn) {
    const isActive = siteNav.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', isActive);
    mobileMenuBtn.textContent = isActive ? '✕' : '☰';
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', toggleMenu);
}

if (siteNav) {
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// Scroll to Top
const scrollToTopBtn = document.querySelector('.scroll-to-top');
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Navigation Link
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.site-nav a[data-page]');
  
  navLinks.forEach((link) => {
    link.classList.remove('nav-active');
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
      link.classList.add('nav-active');
    }
  });
}

// Initialize on DOM ready
function init() {
  setCurrentYear();
  initDarkMode();
  setActiveNavLink();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (localStorage.getItem('darkMode') === null) {
    applyDarkMode(e.matches);
  }
});
