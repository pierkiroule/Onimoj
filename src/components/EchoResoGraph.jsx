import { useState } from "react"
import GlobalResonanceGraph from "../components/GlobalResonanceGraph"
import MiniResonanceGraph from "../components/MiniResonanceGraph"

const inuitSpirits = [
  { name: "Sila", emoji: "🌬️" },
  { name: "Sedna", emoji: "🌊" },
  { name: "Qilak", emoji: "🌌" },
  { name: "Torngasuk", emoji: "🔥" },
  { name: "Nuliajuk", emoji: "🧜‍♀️" },
  { name: "Tuktu", emoji: "🦌" },
  { name: "Qajaq", emoji: "🛶" },
  { name: "Amaruq", emoji: "🐺" },
  { name: "Aniu", emoji: "❄️" },
  { name: "Nanuq", emoji: "🐻‍❄️" },
  { name: "Ayarnaq", emoji: "🌒" },
  { name: "Turnngaq", emoji: "🌀" },
]

export default function EchoResoGraph() {
  const [selectedSpirit, setSelectedSpirit] = useState("Global")
  const center = 180
  const radius = 140

  const spirits = inuitSpirits.map((s, i) => {
    const angle = (i / inuitSpirits.length) * 2 * Math.PI
    return {
      ...s,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  })

  return (
    <div style={{ textAlign: "center", color: "#e9fffd" }}>
      <h2 style={{ color: "#7fffd4" }}>🌌 Résonances de notre inconscient partagé</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          marginTop: "1rem",
        }}
      >
        <svg
          width="360"
          height="360"
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 50%, #021014, #000)",
            boxShadow: "0 0 25px rgba(127,255,212,0.4)",
          }}
        >
          {/* 🌌 Cercle des esprits */}
          {spirits.map((s) => (
            <text
              key={s.name}
              x={s.x}
              y={s.y}
              fontSize="22"
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                cursor: "pointer",
                opacity:
                  selectedSpirit === "Global"
                    ? 0.8
                    : selectedSpirit === s.name
                    ? 1
                    : 0.25,
                transition: "opacity 0.3s, transform 0.3s",
              }}
              onClick={() => setSelectedSpirit(s.name)}
            >
              {s.emoji}
            </text>
          ))}

          {/* 🌀 Bulle centrale */}
          <g
            onClick={() => setSelectedSpirit("Global")}
            style={{ cursor: "pointer", transition: "all 0.4s ease" }}
          >
            <circle
              cx={center}
              cy={center}
              r="50"
              fill="rgba(127,255,212,0.08)"
              stroke="#7fffd4"
              strokeWidth="1.5"
            />
            <text
              x={center}
              y={center - 20}
              textAnchor="middle"
              fill="#7fffd4"
              fontSize="18"
            >
              {selectedSpirit === "Global"
                ? "🌐"
                : inuitSpirits.find((s) => s.name === selectedSpirit)?.emoji}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              fill="#e9fffd"
              fontSize="14"
            >
              {selectedSpirit}
            </text>
          </g>
        </svg>

        {/* 🌠 Graph intégré */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -45%)",
            width: "280px",
            height: "280px",
            transition: "opacity 0.8s",
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,20,25,0.8), transparent)",
            borderRadius: "50%",
            boxShadow: "0 0 18px rgba(127,255,212,0.2)",
          }}
        >
          {selectedSpirit === "Global" ? (
            <GlobalResonanceGraph />
          ) : (
            <MiniResonanceGraph spirit={selectedSpirit} />
          )}
        </div>
      </div>
    </div>
  )
}