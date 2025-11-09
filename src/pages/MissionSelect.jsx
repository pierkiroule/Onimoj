// src/pages/HorizonSelect.jsx
import "../App.css"
import { useEffect, useState } from "react"

export default function HorizonSelect({ onChoose }) {
  const [selected, setSelected] = useState(null)

  function handleChoose(culture, name) {
    setSelected(culture)
    setTimeout(() => onChoose({ culture, name }), 1500)
  }

  return (
    <div
      className="fade-in"
      style={{
        textAlign: "center",
        color: "#e9fffd",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #020910 40%, #031a22 90%)",
      }}
    >
      {/* 🌕 LUNE CENTRALE */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #f9f9ff, #bfefff 70%, #8adfff 90%)",
          boxShadow: "0 0 40px rgba(127,255,212,0.5)",
          animation: "moonPulse 6s ease-in-out infinite",
          zIndex: 3,
        }}
      ></div>

      {/* 🌊 REFLETS HORIZONS */}
      <div
        style={{
          position: "absolute",
          bottom: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        {/* ❄️ INUITE */}
        <div
          className={`reflet inuite ${selected === "Inuite" ? "active" : ""}`}
          onClick={() => handleChoose("Inuite", "Horizon Inuite")}
          style={{
            cursor: "pointer",
          }}
        >
          <div className="ellipse ellipse-inuite"></div>
          <p className="horizon-title">❄️ Horizon Inuite</p>
        </div>

        {/* 🏜️ BERBÈRE */}
        <div className="reflet locked">
          <div className="ellipse ellipse-berbere"></div>
          <p className="horizon-title">🏜️ Horizon Berbère 🔒</p>
        </div>

        {/* 🌳 CELTIQUE */}
        <div className="reflet locked">
          <div className="ellipse ellipse-celtique"></div>
          <p className="horizon-title">🌳 Horizon Celtique 🔒</p>
        </div>
      </div>

      {/* 🌫️ LÉGENDE */}
      <div
        style={{
          position: "absolute",
          bottom: "6%",
          width: "100%",
          textAlign: "center",
          fontSize: "1rem",
          opacity: 0.85,
        }}
      >
        <p>Choisis ton horizon culturel</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          Chaque reflet ouvre un voyage de 12 gardiens du rêve.
        </p>
      </div>

      {/* 🌬️ TRANSITION */}
      {selected && (
        <div className="dream-transition">
          <p>🌕 Le souffle du Nord t’accueille...</p>
        </div>
      )}

      {/* ✨ STYLES INTERNES */}
      <style>
        {`
        @keyframes moonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(127,255,212,0.4); }
          50% { box-shadow: 0 0 50px rgba(127,255,212,0.7); }
        }

        @keyframes floatWave {
          0%, 100% { transform: scaleX(1); opacity: 0.8; }
          50% { transform: scaleX(1.25); opacity: 1; }
        }

        .ellipse {
          width: 180px;
          height: 40px;
          border-radius: 50%;
          filter: blur(2px);
          animation: floatWave 6s ease-in-out infinite;
        }

        .ellipse-inuite {
          background: radial-gradient(circle, rgba(127,255,212,0.5), rgba(0,50,70,0.3));
          box-shadow: 0 0 20px rgba(127,255,212,0.3);
        }

        .ellipse-berbere {
          background: radial-gradient(circle, rgba(255,215,150,0.15), rgba(60,40,0,0.2));
        }

        .ellipse-celtique {
          background: radial-gradient(circle, rgba(110,255,141,0.2), rgba(0,40,20,0.2));
        }

        .reflet {
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.4s ease;
        }

        .reflet:hover:not(.locked) {
          transform: scale(1.1);
        }

        .reflet.locked {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .horizon-title {
          margin-top: 0.5rem;
          color: #aef;
          font-size: 0.95rem;
        }

        .reflet.inuite.active .ellipse-inuite {
          animation: pulseGlow 1s ease-in-out infinite alternate;
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 20px rgba(127,255,212,0.4); transform: scale(1); }
          100% { box-shadow: 0 0 60px rgba(127,255,212,0.8); transform: scale(1.15); }
        }

        .dream-transition {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(127,255,212,0.15), #000);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7fffd4;
          font-size: 1.4rem;
          animation: fadeIn 1.2s ease forwards;
          z-index: 10;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}
      </style>
    </div>
  )
}