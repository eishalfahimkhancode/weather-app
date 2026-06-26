import "./WeatherCard.css";

const ICONS = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

export default function WeatherCard({ weather }) {
  const { name, sys, main, wind, weather: cond, visibility } = weather;
  const icon = ICONS[cond[0].icon?.slice(0, 2)] ?? "🌡️";

  return (
    <div className="weather-card">
      <h2>{name}, {sys.country}</h2>

      <span className="w-icon" role="img" aria-label={cond[0].description}>
        {icon}
      </span>

      <h1>{Math.round(main.temp)}°C</h1>
      <p className="description">{cond[0].description}</p>
      <p className="feels">Feels like: {Math.round(main.feels_like)}°C</p>

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
