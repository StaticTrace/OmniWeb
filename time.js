// Time Widget
function updateTime() {
  const clockTimeEl = document.getElementById('clock-time');
  const clockDateEl = document.getElementById('clock-date');

  if (!clockTimeEl || !clockDateEl) return;

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  clockTimeEl.textContent = time;
  clockDateEl.textContent = date;
}

// Update immediately and then every second
updateTime();
setInterval(updateTime, 1000);
