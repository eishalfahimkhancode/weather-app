import { useState, useEffect } from "react";
import "./AIAssistant.css";

export default function AIAssistant({ weather, unit }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (weather) fetchAdvice();
  }, [weather]);

  async function fetchAdvice() {
    setLoading(true);
    setAdvice(null);

    const temp = Math.round(weather.main.temp);
    const feels = Math.round(weather.main.feels_like);
    const desc = weather.weather[0].description;
    const humidity = weather.main.humidity;
    const wind = Math.round(weather.wind.speed);
    const deg = unit === "metric" ? "°C" : "°F";
    const city = weather.name;

    const prompt = `You are a helpful weather assistant. Based on this weather data for ${city}:
- Temperature: ${temp}${deg} (feels like ${feels}${deg})
- Condition: ${desc}
- Humidity: ${humidity}%
- Wind: ${wind} ${unit === "metric" ? "km/h" : "mph"}

Give exactly 4 short, practical tips for today. Each tip must:
- Start with a relevant emoji
- Be max 8 words
- Be specific to this weather

Respond ONLY with a JSON array like this (no extra text):
["emoji tip1", "emoji tip2", "emoji tip3", "emoji tip4"]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const tips = JSON.parse(clean);
      setAdvice(tips);
    } catch (e) {
      setAdvice([
        "🌡️ Check weather before going out",
        "💧 Stay hydrated today",
        "👀 Monitor conditions closely",
        "📱 Keep weather app handy",
      ]);
    } finally {
      setLoading(false);
    }
  }

  const temp = Math.round(weather?.main?.temp);
  const desc = weather?.weather?.[0]?.description;
  const icon = weather?.weather?.[0]?.icon;
  const ICONS = {
    "01": "☀️","02": "⛅","03": "☁️","04": "☁️",
    "09": "🌧️","10": "🌦️","11": "⛈️","13": "❄️","50": "🌫️",
  };
  const weatherEmoji = ICONS[icon?.slice(0,2)] ?? "🌡️";
  const deg = unit === "metric" ? "°C" : "°F";

  return (
    <div className="ai-card">
      <div className="ai-header">
        <div className="ai-weather-summary">
          <span className="ai-weather-icon">{weatherEmoji}</span>
          <div>
            <p className="ai-temp">{temp}{deg}</p>
            <p className="ai-desc">{desc}</p>
          </div>
        </div>
        <div className="ai-badge">
          <span>🤖</span> AI Advice
        </div>
      </div>

      <div className="ai-divider" />

      {loading && (
        <div className="ai-loading">
          <div className="ai-dots">
            <span /><span /><span />
          </div>
          <p>AI is analyzing weather…</p>
        </div>
      )}

      {advice && (
        <div className="ai-tips">
          {advice.map((tip, i) => (
            <div className="ai-tip" key={i}>
              <span className="tip-bullet">›</span>
              {tip}
            </div>
          ))}
        </div>
      )}

      <button className="ai-refresh" onClick={fetchAdvice} disabled={loading}>
        {loading ? "Analyzing…" : "🔄 Refresh Advice"}
      </button>
    </div>
  );
}
