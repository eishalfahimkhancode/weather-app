import "./WeatherMap.css";
import { useState } from "react";

const MAP_LAYERS = [
  { id: "temp_new",           label: "🌡️ Temperature" },
  { id: "precipitation_new",  label: "🌧️ Precipitation" },
  { id: "wind_new",           label: "💨 Wind" },
  { id: "clouds_new",         label: "☁️ Clouds" },
  { id: "pressure_new",       label: "🔵 Pressure" },
];

export default function WeatherMap({ coords, apiKey }) {
  const [layer, setLayer] = useState("temp_new");
  const zoom = 6;
  const { lat, lon } = coords;

  const mapUrl = `https://tile.openweathermap.org/map/${layer}/${zoom}/${Math.floor((lon + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png?appid=${apiKey}`;

  const iframeUrl = `https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${layer}&lat=${lat}&lon=${lon}&zoom=${zoom}`;

  return (
    <div className="map-card">
      <h3 className="map-title">🗺️ Weather Map</h3>
      <div className="map-layers">
        {MAP_LAYERS.map((l) => (
          <button
            key={l.id}
            className={`layer-btn ${layer === l.id ? "active" : ""}`}
            onClick={() => setLayer(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="map-frame-wrapper">
        <iframe
          title="Weather Map"
          src={iframeUrl}
          className="map-frame"
          allowFullScreen
        />
      </div>
      <p className="map-note">📍 Centered on your searched city</p>
    </div>
  );
}
