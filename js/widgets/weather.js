const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=35.68&longitude=139.76&current_weather=true';

const WEATHER_ICONS = [
  [0,  '☀️'],
  [3,  '🌤️'],
  [48, '🌫️'],
  [67, '🌧️'],
  [77, '❄️'],
  [82, '🌦️'],
];

function weatherIcon(code) {
  const match = WEATHER_ICONS.find(([max]) => code <= max);
  return match ? match[1] : '⛈️';
}

export function init() {
  const el = document.getElementById('weather');
  if (!el) return;

  fetch(OPEN_METEO_URL)
    .then(r => r.json())
    .then(({ current_weather: { temperature, windspeed, weathercode } }) => {
      el.innerHTML = `
        <span class="weather-temp">${weatherIcon(weathercode)} ${temperature}°C</span>
        <span class="weather-detail">Tokyo · Wind ${windspeed} km/h</span>`;
    })
    .catch(() => { el.textContent = 'Weather unavailable'; });
}
