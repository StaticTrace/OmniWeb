// Dark Mode Toggle
const darkModeToggle = document.querySelector('.toggle-dark');
const html = document.documentElement;

function initDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedMode ? JSON.parse(savedMode) : prefersDark;
  
  if (isDark) {
    document.body.classList.add('dark-mode');
    updateDarkModeToggle(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateDarkModeToggle(false);
  }
}

function updateDarkModeToggle(isDark) {
  if (darkModeToggle) {
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  }
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    updateDarkModeToggle(isDark);
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const siteNav = document.querySelector('.site-nav');

if (mobileMenuBtn && siteNav) {
  mobileMenuBtn.addEventListener('click', () => {
    siteNav.classList.toggle('active');
    mobileMenuBtn.textContent = siteNav.classList.contains('active') ? '✕' : '☰';
  });

  // Close menu when a link is clicked
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
    });
  });
}

// Initialize dark mode on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}
