export function init() {
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');
    if (!timeEl) return;
  
    const tick = () => {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
        });
      }
    };
  
    tick();
    setInterval(tick, 1000);
  }
  