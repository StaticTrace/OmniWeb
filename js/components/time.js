/**
 * Time Widget - Displays current time and date
 */

function initTimeWidget() {
  const clockTimeEl = document.getElementById('clock-time');
  const clockDateEl = document.getElementById('clock-date');

  if (!clockTimeEl || !clockDateEl) return;

  function updateTime() {
    const now = new Date();
    const time = formatTime(now);
    const date = formatDate(now);

    clockTimeEl.textContent = time;
    clockDateEl.textContent = date;
  }

  // Update immediately and then every second
  updateTime();
  const timeInterval = setInterval(updateTime, 1000);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(timeInterval);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeWidget);
} else {
  initTimeWidget();
}
