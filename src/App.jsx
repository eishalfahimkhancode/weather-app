import { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";
import Forecast from "./Forecast";
import HourlyForecast from "./HourlyForecast";
import WeatherMap from "./WeatherMap";
import AQI from "./AQI";
import AIAssistant from "./AIAssistant";
import "./App.css";

const API_KEY = "af0c0fd0cd36c72b20541f124a045fd9";

export default function App() {
  const [city, setCity]         = useState("");
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourly, setHourly]     = useState(null);
  const [aqi, setAqi]           = useState(null);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit]         = useState("metric"); // metric | imperial
  const [dateTime, setDateTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today"); // today | hourly | map

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  async function fetchWeather(query) {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);
    setHourly(null);
    setAqi(null);
    setActiveTab("today");
    try {
      // Current weather
      const wRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${query}&units=${unit}&appid=${API_KEY}`
      );
      if (!wRes.ok) throw new Error("City not found. Please try again.");
      const wData = await wRes.json();
      setWeather(wData);

      // 5-day forecast
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${wData.name}&units=${unit}&appid=${API_KEY}`
      );
      const fData = await fRes.json();
      setForecast(fData);
      setHourly(fData);

      // AQI
      const aRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${wData.coord.lat}&lon=${wData.coord.lon}&appid=${API_KEY}`
      );
      const aData = await aRes.json();
      setAqi(aData);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = () =>
    city.trim() && fetchWeather(`q=${encodeURIComponent(city.trim())}`);

  const handleLocation = () => {
    if (!navigator.geolocation) return setError("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        fetchWeather(`lat=${coords.latitude}&lon=${coords.longitude}`),
      () => setError("Location access denied.")
    );
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (weather) fetchWeather(`q=${weather.name}`);
  };

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const formatTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const getBg = () => {
    if (!weather) return darkMode ? "bg-night" : "bg-default";
    const id = weather.weather[0].id;
    if (darkMode) return "bg-night";
    if (id >= 200 && id < 300) return "bg-storm";
    if (id >= 300 && id < 600) return "bg-rain";
    if (id >= 600 && id < 700) return "bg-snow";
    if (id >= 700 && id < 800) return "bg-mist";
    if (id === 800) return "bg-clear";
    return "bg-cloudy";
  };

  return (
    <div className={`app-wrapper ${getBg()}`}>
      <div className="container">

        <div className="top-bar">
          <div className="datetime">
            <p className="date">{formatDate(dateTime)}</p>
            <p className="time">{formatTime(dateTime)}</p>
          </div>
          <div className="top-controls">
            <button className="unit-toggle" onClick={toggleUnit}>
              {unit === "metric" ? "°C → °F" : "°F → °C"}
            </button>
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

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

        {weather && (
          <>
            <WeatherCard weather={weather} darkMode={darkMode} unit={unit} />
            {aqi && <AQI data={aqi} />}
            <AIAssistant weather={weather} unit={unit} />

            <div className="tabs">
              <button className={activeTab === "today"  ? "tab active" : "tab"} onClick={() => setActiveTab("today")}>📅 5-Day</button>
              <button className={activeTab === "hourly" ? "tab active" : "tab"} onClick={() => setActiveTab("hourly")}>🕐 Hourly</button>
              <button className={activeTab === "map"    ? "tab active" : "tab"} onClick={() => setActiveTab("map")}>🗺️ Map</button>
            </div>

            {activeTab === "today"  && forecast && <Forecast data={forecast} unit={unit} />}
            {activeTab === "hourly" && hourly   && <HourlyForecast data={hourly} unit={unit} />}
            {activeTab === "map"    && <WeatherMap coords={weather.coord} apiKey={API_KEY} />}
          </>
        )}

      </div>
    </div>
  );
}
