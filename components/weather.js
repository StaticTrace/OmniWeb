// Weather widget using browser Geolocation + Open-Meteo (no API key)
// Updates every 10 minutes. Browser will remember permission if user allows.
(function () {
    const statusEl = document.getElementById('weather-status');
    const mainEl = document.getElementById('weather-main');
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const metaEl = document.getElementById('weather-meta');
    const errorEl = document.getElementById('weather-error');
  
    const REFRESH_MS = 10 * 60 * 1000;
  
    function showError(msg) {
      if (statusEl) statusEl.hidden = true;
      if (mainEl) mainEl.hidden = true;
      if (errorEl) { errorEl.hidden = false; errorEl.textContent = msg; }
    }
  
    async function fetchWeather(lat, lon) {
      try {
        if (statusEl) { statusEl.textContent = 'Fetching weather…'; statusEl.hidden = false; }
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current_weather=true&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather API error');
        const data = await res.json();
        const cw = data.current_weather;
        if (!cw) throw new Error('No current weather data');
  
        const temp = Math.round(cw.temperature);
        const code = cw.weathercode;
        const wind = cw.windspeed;
        const direction = cw.winddirection;
  
        const desc = weatherCodeToText(code);
  
        if (statusEl) statusEl.hidden = true;
        if (errorEl) errorEl.hidden = true;
        if (mainEl) mainEl.hidden = false;
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (descEl) descEl.textContent = desc;
        if (metaEl) metaEl.textContent = `Wind ${wind} km/h • ${Math.round(direction)}°`;
      } catch (err) {
        showError('Unable to load weather.');
        console.error(err);
      }
    }
  
    function weatherCodeToText(code) {
      // Simplified mapping from Open-Meteo weather codes
      const map = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
      };
      return map[code] || 'Unknown';
    }
  
    function requestLocationAndUpdate() {
      if (!navigator.geolocation) {
        showError('Geolocation not supported by your browser.');
        return;
      }
  
      // Use highAccuracy false to reduce prompt friction; browser will remember permission if allowed
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchWeather(lat, lon);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            showError('Location permission denied. Weather unavailable.');
          } else {
            showError('Unable to determine location.');
          }
        },
        { enableHighAccuracy: false, maximumAge: 5 * 60 * 1000, timeout: 10000 }
      );
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      requestLocationAndUpdate();
      setInterval(requestLocationAndUpdate, REFRESH_MS);
    });
  })();
  