// src/components/HublotResonant.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { inuitWordBanksByIndex } from "../data/inuitWordBanks"

export default function HublotResonant({
  step = { step_number: 1, spirit_name: "Sila", symbol: "🌬️" },
  candidateCount = 15,
  onComplete
}) {
  const size = 320
  const radius = size / 2
  const hullR = radius - 10
  const center = { x: radius, y: radius }

  // ==== BANQUE ====
  const bank = useMemo(() => {
    const list = (inuitWordBanksByIndex?.[step.step_number] || []).map(o => o.fr)
    return Array.from(new Set(list))
  }, [step.step_number])

  // ==== ÉTATS ====
  const [captured, setCaptured] = useState([])
  const [bubbles, setBubbles] = useState([])
  const [complete, setComplete] = useState(false)
  const rafRef = useRef(null)

  // ==== CRÉATION DES BULLES ====
  function makeBubbles(seedList) {
    const picks = [...seedList]
      .sort(() => 0.5 - Math.random())
      .filter(t => !captured.includes(t))
      .slice(0, candidateCount)

    return picks.map((label, i) => ({
      id: `${label}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      label,
      x: radius + (Math.random() * 2 - 1) * (hullR - 20),
      y: radius + (Math.random() * 2 - 1) * (hullR - 20),
      vx: (Math.random() * 1 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 1 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
      r: 20,
      fading: false,
    }))
  }

  useEffect(() => {
    setBubbles(makeBubbles(bank))
  }, [bank])

  // ==== CAPTURE ====
  function popBubble(id, label) {
    if (complete || captured.includes(label)) return
    setBubbles(prev =>
      prev.map(b => (b.id === id ? { ...b, fading: true } : b))
    )
    setTimeout(() => {
      const next = [...captured, label].slice(0, 5)
      setCaptured(next)
      setBubbles(prev => prev.filter(b => b.id !== id))
      if (next.length === 5) setComplete(true)
    }, 300)
  }

  // ==== REROLL ====
  function reroll() {
    setBubbles(makeBubbles(bank))
  }

  // ==== ANIMATION + COLLISIONS ====
  useEffect(() => {
    let stopped = false
    function stepAnim() {
      if (stopped) return
      setBubbles(prev => {
        const updated = [...prev]

        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const a = updated[i]
            const b = updated[j]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const dist = Math.hypot(dx, dy)
            const minDist = a.r + b.r
            if (dist < minDist) {
              const overlap = (minDist - dist) / 2
              const nx = dx / dist
              const ny = dy / dist
              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap
            }
          }
        }

        return updated.map(b => {
          let { x, y, vx, vy, r } = b
          x += vx
          y += vy
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.hypot(dx, dy)
          const maxDist = hullR - r
          if (dist > maxDist) {
            const nx = dx / dist
            const ny = dy / dist
            x = center.x + nx * maxDist
            y = center.y + ny * maxDist
            const dot = vx * nx + vy * ny
            vx -= 2 * dot * nx
            vy -= 2 * dot * ny
          }
          return { ...b, x, y, vx, vy }
        })
      })
      rafRef.current = requestAnimationFrame(stepAnim)
    }

    rafRef.current = requestAnimationFrame(stepAnim)
    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ==== STAR PREVIEW ====
  const StarPreview = ({ emoji, tags }) => {
    const c = 160, R = 118, r = 54
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (-90 + i * 36) * (Math.PI / 180)
      const rad = i % 2 === 0 ? R : r
      return [c + rad * Math.cos(a), c + rad * Math.sin(a)]
    })
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

    return (
      <svg viewBox="0 0 320 320" width={size} height={size}>
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(127,255,212,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </radialGradient>
        </defs>
        <circle cx={c} cy={c} r={hullR} fill="url(#g)" stroke="rgba(127,255,212,.35)" />
        <path d={d} fill="none" stroke="#7fffd4" strokeWidth="1.8" />
        <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontSize="40">
          {emoji}
        </text>
        {tags.map((t, i) => {
          const angle = (-90 + i * 72) * (Math.PI / 180)
          const x = c + Math.cos(angle) * (R + 14)
          const y = c + Math.sin(angle) * (R + 14)
          return (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="13"
              fill="#e9fffd"
              style={{ textShadow: "0 0 6px rgba(0,0,0,.6)", fontWeight: 500 }}
            >
              {t}
            </text>
          )
        })}
      </svg>
    )
  }

  // ==== AFFICHAGE ====
  return (
    <div style={{ padding: "1rem", color: "#e9fffd" }}>
      <h3 style={{ textAlign: "center", color: "#7fffd4", marginBottom: ".6rem" }}>
        {step.symbol} Le souffle de {step.spirit_name}
      </h3>

      <p
        style={{
          textAlign: "center",
          fontSize: ".95rem",
          color: "#bdefff",
          opacity: 0.9,
          maxWidth: 300,
          margin: "0 auto 1rem",
        }}
      >
        Ferme les yeux. Respire lentement.  
        Les bulles qui apparaissent sont les mots de ton inconscient.  
        Appuie sur celles qui vibrent avec toi — cinq d’entre elles formeront ton étoile.
      </p>

      {!complete && (
        <>
          {/* HUBLOT */}
          <div
            style={{
              position: "relative",
              width: size,
              height: size,
              margin: "0 auto",
              borderRadius: "50%",
              background:
                "radial-gradient(60% 60% at 50% 50%, #061520, #000)",
              boxShadow:
                "0 0 20px rgba(100,180,255,0.4), inset 0 0 30px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "40px",
                filter: "drop-shadow(0 0 8px rgba(127,255,212,0.6))",
                animation: "pulseCenter 3s ease-in-out infinite",
              }}
            >
              {step.symbol}
            </div>

            {bubbles.map(b => (
              <button
                key={b.id}
                onClick={() => popBubble(b.id, b.label)}
                style={{
                  position: "absolute",
                  left: b.x - b.r,
                  top: b.y - b.r,
                  padding: ".3rem .6rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(127,255,212,0.5)",
                  background: "rgba(127,255,212,0.08)",
                  color: "#e9fffd",
                  fontSize: ".85rem",
                  cursor: "pointer",
                  boxShadow: "0 0 10px rgba(127,255,212,0.25)",
                  opacity: b.fading ? 0 : 1,
                  transform: b.fading ? "scale(0.7)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* CAPTURE */}
          <div style={{ textAlign: "center", marginTop: ".8rem" }}>
            <div style={{ fontSize: ".9rem", opacity: 0.8 }}>
              ✨ Mots captés : {captured.length}/5
            </div>

            <div
              style={{
                marginTop: ".6rem",
                display: "flex",
                gap: ".5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {captured.map(t => (
                <span
                  key={t}
                  style={{
                    padding: ".25rem .6rem",
                    borderRadius: "999px",
                    background: "rgba(127,255,212,.12)",
                    border: "1px solid rgba(127,255,212,.45)",
                    fontSize: ".85rem",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: ".9rem",
                display: "flex",
                gap: ".6rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={reroll}
                style={{
                  padding: ".55rem .9rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(127,255,212,.5)",
                  background: "rgba(127,255,212,.08)",
                  color: "#e9fffd",
                  cursor: "pointer",
                }}
              >
                🎲 Relancer
              </button>

              <button
                disabled={captured.length < 5}
                onClick={() => setComplete(true)}
                style={{
                  padding: ".55rem .9rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,.15)",
                  background:
                    captured.length < 5
                      ? "rgba(255,255,255,.08)"
                      : "rgba(110,255,141,.15)",
                  color: captured.length < 5 ? "#b7c9c6" : "#6eff8d",
                  cursor: captured.length < 5 ? "not-allowed" : "pointer",
                  animation:
                    captured.length === 5 ? "pulseCenter 2s ease-in-out infinite" : "none",
                }}
              >
                🌟 Tisser ton étoile
              </button>
            </div>
          </div>
        </>
      )}

      {complete && (
        <div style={{ textAlign: "center", marginTop: ".6rem" }}>
          <StarPreview emoji={step.symbol} tags={captured} />
          <p style={{ color: "#7fffd4" }}>🌟 Ton étoile du rêve est prête.</p>
          <button
            onClick={() => onComplete && onComplete(captured)}
            style={{
              padding: ".65rem 1rem",
              borderRadius: "12px",
              border: "1px solid rgba(127,255,212,.55)",
              background: "rgba(127,255,212,.12)",
              color: "#e9fffd",
              cursor: "pointer",
            }}
          >
            ✅ Continuer
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulseCenter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  )
}