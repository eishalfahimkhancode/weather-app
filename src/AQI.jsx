import "./AQI.css";

const AQI_LEVELS = [
  { label: "Good",        color: "#22c55e", bg: "rgba(34,197,94,0.25)",   emoji: "😊", desc: "Air quality is satisfactory." },
  { label: "Fair",        color: "#84cc16", bg: "rgba(132,204,22,0.25)",  emoji: "🙂", desc: "Acceptable air quality." },
  { label: "Moderate",    color: "#eab308", bg: "rgba(234,179,8,0.25)",   emoji: "😐", desc: "Sensitive groups may be affected." },
  { label: "Poor",        color: "#f97316", bg: "rgba(249,115,22,0.25)",  emoji: "😷", desc: "Everyone may experience effects." },
  { label: "Very Poor",   color: "#ef4444", bg: "rgba(239,68,68,0.25)",   emoji: "🤢", desc: "Health alert — avoid outdoors." },
];

export default function AQI({ data }) {
  const aqi = data?.list?.[0]?.main?.aqi;
  const components = data?.list?.[0]?.components;
  if (!aqi) return null;

  const level = AQI_LEVELS[aqi - 1];

  return (
    <div className="aqi-card" style={{ borderColor: level.color }}>
      <div className="aqi-header">
        <span className="aqi-emoji">{level.emoji}</span>
        <div>
          <p className="aqi-title">💨 Air Quality Index</p>
          <p className="aqi-label" style={{ color: level.color }}>{level.label}</p>
        </div>
        <div className="aqi-badge" style={{ background: level.bg, color: level.color }}>
          AQI {aqi}
        </div>
      </div>
      <p className="aqi-desc">{level.desc}</p>
      {components && (
        <div className="aqi-components">
          <div className="aqi-comp"><span>PM2.5</span><strong>{components.pm2_5?.toFixed(1)}</strong></div>
          <div className="aqi-comp"><span>PM10</span><strong>{components.pm10?.toFixed(1)}</strong></div>
          <div className="aqi-comp"><span>CO</span><strong>{components.co?.toFixed(0)}</strong></div>
          <div className="aqi-comp"><span>NO₂</span><strong>{components.no2?.toFixed(1)}</strong></div>
          <div className="aqi-comp"><span>O₃</span><strong>{components.o3?.toFixed(1)}</strong></div>
          <div className="aqi-comp"><span>SO₂</span><strong>{components.so2?.toFixed(1)}</strong></div>
        </div>
      )}
    </div>
  );
}