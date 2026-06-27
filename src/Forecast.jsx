import "./Forecast.css";

const ICONS = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

function getIcon(iconCode) {
  return ICONS[iconCode?.slice(0, 2)] ?? "🌡️";
}

function getDayName(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function Forecast({ data }) {
  // API gives 3-hour intervals — pick one per day (noon reading)
  const daily = [];
  const seen = new Set();

  for (const item of data.list) {
    const day = item.dt_txt.slice(0, 10);
    if (!seen.has(day) && item.dt_txt.includes("12:00:00")) {
      seen.add(day);
      daily.push(item);
    }
  }

  
  if (daily.length === 0) {
    for (const item of data.list) {
      const day = item.dt_txt.slice(0, 10);
      if (!seen.has(day)) {
        seen.add(day);
        daily.push(item);
      }
    }
  }

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.slice(0, 5).map((item) => (
          <div className="forecast-day" key={item.dt}>
            <p className="f-day">{getDayName(item.dt_txt)}</p>
            <span className="f-icon" role="img" aria-label={item.weather[0].description}>
              {getIcon(item.weather[0].icon)}
            </span>
            <p className="f-temp">{Math.round(item.main.temp)}°C</p>
            <p className="f-desc">{item.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
