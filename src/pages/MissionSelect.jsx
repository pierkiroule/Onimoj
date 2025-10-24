import "../App.css"
import { useEffect, useState } from "react"

export default function HorizonSelect({ onChoose }) {
  const [bubbles, setBubbles] = useState([])

  useEffect(() => {
    // 🫧 Générer quelques bulles aléatoires
    const newBubbles = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 8 + Math.random() * 18,
      duration: 8 + Math.random() * 6,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.3,
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div
      className="fade-in"
      style={{
        textAlign: "center",
        color: "#f3f5ff",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🫧 Bulles oniriques */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="floating-bubble"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* 🌍 TITRE */}
      <h2
        style={{
          fontSize: "1.6rem",
          color: "#7fffd4",
          textShadow: "0 0 12px rgba(127,255,212,0.4)",
          marginBottom: "0.4rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        🌍 Choisis ton horizon culturel
      </h2>
      <p
        style={{
          opacity: 0.85,
          fontSize: "1rem",
          maxWidth: "420px",
          margin: "0 auto 1.4rem",
          zIndex: 2,
          position: "relative",
        }}
      >
        Chaque horizon est un voyage de 12 défis-doux vers un monde onirique.
      </p>

      {/* 🌠 HORIZONS */}
      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: "1.5rem",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          className="horizon-button"
          style={{
            background: "rgba(127,255,212,0.2)",
            color: "#7fffd4",
            border: "1px solid rgba(127,255,212,0.4)",
            animation: "horizonPulse 3.5s ease-in-out infinite",
          }}
          onClick={() => onChoose({ culture: "Inuite", name: "Horizon Inuite" })}
        >
          ❄️ Horizon Inuite — accessible
        </button>

        <button className="horizon-button locked">
          🏜️ Horizon Berbère — verrouillé 🔒
        </button>

        <button className="horizon-button locked">
          🌳 Horizon Celtique — verrouillé 🔒
        </button>
      </div>

      {/* ✨ Styles internes */}
      <style>
        {`
          /* 🌫️ Bulles oniriques */
          .floating-bubble {
            position: absolute;
            bottom: -40px;
            background: radial-gradient(circle, rgba(127,255,212,0.5), rgba(106,90,205,0.15));
            border-radius: 50%;
            filter: blur(1px);
            animation: floatUp linear infinite;
          }

          @keyframes floatUp {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            10% { opacity: 1; }
            50% { transform: translateY(-50vh) scale(1.05); opacity: 0.7; }
            90% { opacity: 0.3; }
            100% {
              transform: translateY(-100vh) scale(0.95);
              opacity: 0;
            }
          }

          /* 🌌 Boutons d’horizon */
          .horizon-button {
            padding: 0.9rem 1.6rem;
            border-radius: 40px;
            font-size: 1.05rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease;
            box-shadow: 0 0 10px rgba(127,255,212,0.15);
            backdrop-filter: blur(6px);
            width: 250px;
            margin: 0 auto;
          }

          .horizon-button:hover:not(.locked) {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 0 18px rgba(127,255,212,0.4);
            background: rgba(127,255,212,0.25);
            color: #aff;
          }

          .horizon-button.locked {
            background: rgba(255,255,255,0.05);
            color: #888;
            border: 1px solid rgba(255,255,255,0.1);
            cursor: not-allowed;
          }

          @keyframes horizonPulse {
            0%, 100% {
              box-shadow: 0 0 10px rgba(127,255,212,0.3),
                          0 0 20px rgba(106,90,205,0.15);
            }
            50% {
              box-shadow: 0 0 18px rgba(127,255,212,0.6),
                          0 0 28px rgba(106,90,205,0.25);
            }
          }
        `}
      </style>
    </div>
  )
}