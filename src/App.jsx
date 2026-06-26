import { useState } from "react";
import WeatherCard from "./WeatherCard";
import "./App.css";

const API_KEY = "YOUR_API_KEY_HERE";

export default function App() {
  const [city, setCity]       = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchWeather(query) {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("City not found. Please try again.");
      setWeather(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () => city.trim() && fetchWeather(`q=${encodeURIComponent(city.trim())}`);

  const handleLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(`lat=${coords.latitude}&lon=${coords.longitude}`),
      () => setError("Location access denied.")
    );
  };

  return (
    <div className="container">
      <h1>⛅ Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <button className="location-btn" onClick={handleLocation}>
        📍 Use My Location
      </button>

      {loading && <p className="loading">Fetching weather…</p>}
      {error   && <p className="error-msg">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}
