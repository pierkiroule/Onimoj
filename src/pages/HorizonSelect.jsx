import "../App.css"
import { useEffect, useState } from "react"

export default function HorizonSelect({ onChoose }) {
  const [bubbles, setBubbles] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const newBubbles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * 24,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.3,
    }))
    setBubbles(newBubbles)
  }, [])

  function handleChoose(culture, name) {
    setSelected(culture)
    setTimeout(() => onChoose({ culture, name }), 800)
  }

  return (
    <div
      className="fade-in"
      style={{
        textAlign: "center",
        color: "#f3f5ff",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
        minHeight: "85vh",
      }}
    >
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

      <h2
        style={{
          fontSize: "1.8rem",
          color: "#7fffd4",
          textShadow: "0 0 14px rgba(127,255,212,0.5)",
          marginBottom: "0.5rem",
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
          margin: "0 auto 2rem",
          zIndex: 2,
          position: "relative",
        }}
      >
        Chaque horizon ouvre un voyage de 12 défis-doux vers un monde onirique.
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          className={`horizon-button ${
            selected === "Inuite" ? "active" : ""
          }`}
          style={{
            background: "rgba(127,255,212,0.18)",
            color: "#7fffd4",
            border: "1px solid rgba(127,255,212,0.4)",
            animation: "horizonPulse 3.5s ease-in-out infinite",
          }}
          onClick={() => handleChoose("Inuite", "Horizon Inuite")}
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

      {selected && (
        <div className="dream-transition">
          <p>✨ Entrée dans le rêve {selected}...</p>
        </div>
      )}

      <style>
        {`
          .floating-bubble {
            position: absolute;
            bottom: -40px;
            background: radial-gradient(circle, rgba(127,255,212,0.45), rgba(106,90,205,0.12));
            border-radius: 50%;
            filter: blur(1px);
            animation: floatUp linear infinite;
          }

          @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            50% { transform: translateY(-50vh) scale(1.05); opacity: 0.7; }
            90% { opacity: 0.3; }
            100% { transform: translateY(-100vh) scale(0.95); opacity: 0; }
          }

          .horizon-button {
            padding: 1rem 1.6rem;
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
            transform: translateY(-3px) scale(1.04);
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

          .horizon-button.active {
            transform: scale(1.1);
            background: rgba(127,255,212,0.3);
            color: #fff;
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

          .dream-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(127,255,212,0.2), #000);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7fffd4;
            font-size: 1.4rem;
            animation: dreamFade 1s ease forwards;
            z-index: 20;
          }

          @keyframes dreamFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}