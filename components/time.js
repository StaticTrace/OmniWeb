// Auto-detecting live clock — uses the user's system time
(function () {
    function updateClock() {
      const now = new Date();
  
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
  
      const date = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
  
      const tEl = document.getElementById("clock-time");
      const dEl = document.getElementById("clock-date");
      if (tEl) tEl.textContent = time;
      if (dEl) dEl.textContent = date;
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      updateClock();
      setInterval(updateClock, 1000);
    });
  })();
  