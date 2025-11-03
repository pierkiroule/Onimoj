// src/components/InuitCircle.jsx
import { inuitSteps } from "../data/inuitSteps"

export default function InuitCircle({
  awakenedSteps = [],         // [1,3,...] étapes déjà complétées
  selectedSpirit = null,      // esprit sélectionné (objet from inuitSteps) ou null
  onSelect,                   // (spirit) => void
  onSpiritCall                // () => void  (tirage aléatoire géré par le parent ou ici)
}) {
  const radius = 120

  function renderNode(spirit, i) {
    const angle = (i / inuitSteps.length) * 2 * Math.PI
    const x = 140 + radius * Math.cos(angle)
    const y = 140 + radius * Math.sin(angle)

    const awakened = awakenedSteps.includes(spirit.step_number)
    const active = selectedSpirit?.step_number === spirit.step_number

    return (
      <button
        key={spirit.spirit_name}
        onClick={() => onSelect?.(spirit)}
        title={`${spirit.spirit_name} — ${spirit.title}`}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          border: active ? "2px solid #7fffd4" : "1px solid rgba(127,255,212,0.4)",
          background: active
            ? "radial-gradient(circle at 50% 50%, rgba(127,255,212,0.25), rgba(0,0,0,0.2))"
            : "transparent",
          color: "#e9fffd",
          cursor: "pointer",
          fontSize: "1.4rem",
          lineHeight: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: awakened ? 1 : active ? 0.9 : 0.2, // 👈 endormis à 0.2
          boxShadow: active
            ? "0 0 10px rgba(127,255,212,0.6)"
            : awakened
            ? "0 0 4px rgba(127,255,212,0.3)"
            : "none",
          transition: "all .25s ease"
        }}
      >
        <span aria-hidden="true">{spirit.symbol}</span>
      </button>
    )
  }

  return (
    <div
      style={{
        width: 280,
        height: 280,
        margin: "0 auto",
        position: "relative",
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 50%, #06151b, #000)",
        boxShadow: "0 0 16px rgba(127,255,212,0.25)",
      }}
    >
      {/* Nœuds */}
      {inuitSteps.map(renderNode)}

      {/* Bouton central : SpiritCall = tirer un esprit */}
      <button
        onClick={onSpiritCall}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: "none",
          background: "radial-gradient(circle at 50% 50%, #7fffd4, #2a6060)",
          color: "#003333",
          boxShadow: "0 0 18px rgba(127,255,212,0.45), inset 0 0 10px rgba(0,0,0,0.35)",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: ".92rem"
        }}
        title="Tirer un esprit au hasard"
      >
        🌙 SpiritCall
        <div style={{ fontSize: ".75rem", opacity: .9 }}>RÊVeille un esprit</div>
      </button>
    </div>
  )
}