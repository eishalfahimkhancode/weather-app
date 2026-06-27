import "./WeatherCard.css";

const ICONS = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

function formatTime(unix, timezone) {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(-12, -7);
}

export default function WeatherCard({ weather, darkMode }) {
  const { name, sys, main, wind, weather: cond, visibility, timezone } = weather;
  const icon = ICONS[cond[0].icon?.slice(0, 2)] ?? "🌡️";

  return (
    <div className={`weather-card ${darkMode ? "dark-card" : ""}`}>
      <h2>{name}, {sys.country}</h2>

      <span className="w-icon" role="img" aria-label={cond[0].description}>
        {icon}
      </span>

      <h1>{Math.round(main.temp)}°C</h1>
      <p className="description">{cond[0].description}</p>
      <p className="feels">Feels like: {Math.round(main.feels_like)}°C</p>

      <div className="sun-row">
        <div className="sun-item">
          <span>🌅</span>
          <div>
            <p className="sun-label">Sunrise</p>
            <p className="sun-val">{formatTime(sys.sunrise, timezone)}</p>
          </div>
        </div>
        <div className="sun-divider" />
        <div className="sun-item">
          <span>🌇</span>
          <div>
            <p className="sun-label">Sunset</p>
            <p className="sun-val">{formatTime(sys.sunset, timezone)}</p>
          </div>
        </div>
      </div>

      <div className="details">
        <div className="detail-tile">
          <span className="tile-icon blue">💧</span>
          <div>
            <p className="tile-label">Humidity</p>
            <p className="tile-val">{main.humidity}%</p>
          </div>
        </div>

        <div className="detail-tile">
          <span className="tile-icon green">🌬️</span>
          <div>
            <p className="tile-label">Wind</p>
            <p className="tile-val">{Math.round(wind.speed)} km/h</p>
          </div>
        </div>

        {visibility && (
          <div className="detail-tile">
            <span className="tile-icon amber">👁️</span>
            <div>
              <p className="tile-label">Visibility</p>
              <p className="tile-val">{(visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        )}

        <div className="detail-tile">
          <span className="tile-icon purple">🔵</span>
          <div>
            <p className="tile-label">Pressure</p>
            <p className="tile-val">{main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
