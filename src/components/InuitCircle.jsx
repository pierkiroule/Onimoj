import { useEffect, useState } from "react"
import { inuitSteps } from "../data/inuitSteps"

export default function InuitCircle({
  awakenedSteps = [],
  selectedSpirit = null,
  onSelect,
  onSpiritCall
}) {
  const [particles, setParticles] = useState([])

  // Particules flottantes bleutées
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 280,
      y: Math.random() * 280,
      size: 2 + Math.random() * 3,
      duration: 4000 + Math.random() * 3000,
      direction: Math.random() > 0.5 ? 1 : -1
    }))
    setParticles(newParticles)
  }, [])

  // Animation manuelle
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(p =>
        p.map(pt => {
          let y = pt.y + pt.direction * 0.3
          if (y < 0 || y > 280) pt.direction *= -1
          return { ...pt, y }
        })
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

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
          border: active ? "2px solid #66ccff" : "1px solid rgba(100,180,255,0.3)",
          background: active
            ? "radial-gradient(circle at 50% 50%, rgba(100,180,255,0.3), rgba(0,0,40,0.3))"
            : "transparent",
          color: "#cfeeff",
          cursor: "pointer",
          fontSize: "1.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: awakened ? 1 : active ? 0.8 : 0.25,
          boxShadow: active
            ? "0 0 14px rgba(100,180,255,0.6)"
            : awakened
            ? "0 0 6px rgba(100,180,255,0.3)"
            : "none",
          transition: "all .3s ease"
        }}
      >
        {spirit.symbol}
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
        background: "radial-gradient(circle at 50% 50%, #0b1c40, #000010)",
        boxShadow: "0 0 18px rgba(100,180,255,0.4)",
        overflow: "hidden"
      }}
    >
      {/* Particules */}
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "rgba(150,200,255,0.7)",
            boxShadow: "0 0 6px rgba(150,200,255,0.8)",
            opacity: 0.8
          }}
        />
      ))}

      {/* Nœuds des gardiens */}
      {inuitSteps.map(renderNode)}

      {/* Bouton central */}
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
          background: "radial-gradient(circle at 50% 50%, #5aaaff, #002b80)",
          color: "#e9f4ff",
          boxShadow:
            "0 0 22px rgba(100,180,255,0.6), inset 0 0 10px rgba(0,0,40,0.5)",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: ".9rem",
          transition: "transform .4s ease, box-shadow .4s ease"
        }}
        title="Sélectionner un gardien au hasard"
        onMouseEnter={e => {
          e.currentTarget.style.transform =
            "translate(-50%, -50%) scale(1.1)"
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(150,200,255,0.9), inset 0 0 10px rgba(0,0,40,0.6)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform =
            "translate(-50%, -50%) scale(1)"
          e.currentTarget.style.boxShadow =
            "0 0 22px rgba(100,180,255,0.6), inset 0 0 10px rgba(0,0,40,0.5)"
        }}
      >
        🌌
        <div style={{ fontSize: ".75rem", opacity: 0.9 }}>Mon gardien</div>
      </button>
    </div>
  )
}