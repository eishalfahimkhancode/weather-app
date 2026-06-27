import "./HourlyForecast.css";

const ICONS = {
  "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
  "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
};

function getIcon(iconCode) {
  return ICONS[iconCode?.slice(0, 2)] ?? "🌡️";
}

export default function HourlyForecast({ data, unit }) {
  const next24 = data.list.slice(0, 8); // 8 x 3hr = 24hrs
  const deg = unit === "metric" ? "°C" : "°F";

  return (
    <div className="hourly-card">
      <h3 className="hourly-title">🕐 Next 24 Hours</h3>
      <div className="hourly-scroll">
        {next24.map((item) => {
          const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit", minute: "2-digit",
          });
          return (
            <div className="hourly-item" key={item.dt}>
              <p className="h-time">{time}</p>
              <span className="h-icon">{getIcon(item.weather[0].icon)}</span>
              <p className="h-temp">{Math.round(item.main.temp)}{deg}</p>
              <p className="h-desc">{item.weather[0].main}</p>
              <p className="h-wind">💨 {Math.round(item.wind.speed)} {unit === "metric" ? "km/h" : "mph"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
