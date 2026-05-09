// Weather Widget
async function fetchWeather() {
  const weatherStatus = document.getElementById('weather-status');
  const weatherMain = document.getElementById('weather-main');
  const weatherError = document.getElementById('weather-error');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherDesc = document.getElementById('weather-desc');
  const weatherMeta = document.getElementById('weather-meta');

  if (!weatherStatus) return;

  try {
    weatherStatus.textContent = 'Getting location...';

    // Get user's location
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false
      });
    });

    const { latitude, longitude } = position.coords;

    weatherStatus.textContent = 'Fetching weather...';

    // Fetch weather data from Open-Meteo (no API key required)
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`
    );

    if (!weatherResponse.ok) throw new Error('Weather data unavailable');

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Map WMO weather codes to descriptions
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with hail'
    };

    const description = weatherCodes[current.weather_code] || 'Unknown';

    // Fetch location name
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const geoData = await geoResponse.json();
    const locationName = geoData.address?.city || geoData.address?.town || 'Unknown location';

    // Update UI
    weatherStatus.textContent = '';
    weatherStatus.hidden = true;
    weatherTemp.textContent = Math.round(current.temperature_2m) + '°F';
    weatherDesc.textContent = description;
    weatherMeta.textContent = `${locationName} • Humidity: ${current.relative_humidity_2m}%`;
    weatherMain.hidden = false;
    weatherError.hidden = true;
  } catch (error) {
    console.error('Weather error:', error);
    weatherStatus.hidden = true;
    weatherMain.hidden = true;
    weatherError.hidden = false;
    weatherError.textContent = error.message || 'Unable to load weather. Please enable location access.';
  }
}

// Fetch weather on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchWeather);
} else {
  fetchWeather();
}

// Refresh weather every 10 minutes
setInterval(fetchWeather, 600000);
