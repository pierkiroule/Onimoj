// src/components/HublotResonant.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { inuitWordBanksByIndex } from "../data/inuitWordBanks"

export default function HublotResonant({
  step = { step_number: 1, spirit_name: "Sila", symbol: "🌬️" },
  candidateCount = 15,
  onComplete,
}) {
  const size = 340
  const radius = size / 2
  const hullR = radius - 18
  const center = { x: radius, y: radius }

  // 🔤 Banque de mots pour ce gardien
  const bank = useMemo(() => {
    const list = (inuitWordBanksByIndex?.[step.step_number] || []).map((o) => o.fr)
    return Array.from(new Set(list))
  }, [step.step_number])

  const [captured, setCaptured] = useState([])
  const [bubbles, setBubbles] = useState([])
  const [complete, setComplete] = useState(false)
  const [echoMax, setEchoMax] = useState(6)
  const rafRef = useRef(null)

  // ========= Création des bulles =========
  function makeBubbles(seedList) {
    const picks = [...seedList]
      .sort(() => 0.5 - Math.random())
      .filter((t) => !captured.includes(t))
      .slice(0, candidateCount)

    return picks.map((label, i) => {
      // rayon "physique" approximatif en fonction de la longueur du mot
      const baseR = 26
      const extra = Math.min(label.length, 12) * 1.2
      const r = baseR + extra

      return {
        id: `${label}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        label,
        // positions centrées
        x: radius + (Math.random() * 2 - 1) * (hullR - r),
        y: radius + (Math.random() * 2 - 1) * (hullR - r),
        vx: (Math.random() * 0.6 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.6 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
        r,
        fading: false,
      }
    })
  }

  useEffect(() => {
    setCaptured([])
    setComplete(false)
    setBubbles(makeBubbles(bank))
  }, [bank])

  // ========= Animation fluide =========
  useEffect(() => {
    let stopped = false

    function animate() {
      if (stopped) return

      setBubbles((prev) => {
        const updated = [...prev]

        for (let i = 0; i < updated.length; i++) {
          const a = updated[i]
          a.x += a.vx
          a.y += a.vy

          // rebond sur bord du hublot (cercle)
          const dx = a.x - center.x
          const dy = a.y - center.y
          const dist = Math.hypot(dx, dy)
          const maxDist = hullR - a.r * 0.6 // marge pour garder visuellement à l’intérieur
          if (dist > maxDist && dist > 0) {
            const nx = dx / dist
            const ny = dy / dist
            a.x = center.x + nx * maxDist
            a.y = center.y + ny * maxDist
            const dot = a.vx * nx + a.vy * ny
            a.vx -= 1.8 * dot * nx
            a.vy -= 1.8 * dot * ny
          }

          // collisions légères entre bulles
          for (let j = i + 1; j < updated.length; j++) {
            const b = updated[j]
            const dx2 = b.x - a.x
            const dy2 = b.y - a.y
            const dist2 = Math.hypot(dx2, dy2)
            const minDist = (a.r + b.r) * 0.6 + 6
            if (dist2 < minDist && dist2 > 0) {
              const nx = dx2 / dist2
              const ny = dy2 / dist2
              const overlap = (minDist - dist2) / 2
              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap
            }
          }
        }

        return updated
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ========= Capture d’une bulle =========
  function popBubble(id, label) {
    if (complete || captured.includes(label)) return
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, fading: true } : b)))

    setTimeout(() => {
      const next = [...captured, label].slice(0, 5)
      setCaptured(next)
      setBubbles((prev) => prev.filter((b) => b.id !== id))
      if (next.length === 5) setComplete(true)
    }, 180)
  }

  // ========= Relancer les bulles =========
  function reroll() {
    setBubbles(makeBubbles(bank))
  }

  // ========= Aperçu étoile =========
  const StarPreview = ({ emoji, tags }) => {
    const c = 160
    const R = 115
    const r = 55
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (-90 + i * 36) * (Math.PI / 180)
      const rad = i % 2 === 0 ? R : r
      return [c + rad * Math.cos(a), c + rad * Math.sin(a)]
    })
    const d =
      pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

    return (
      <svg viewBox="0 0 320 320" width={size} height={size}>
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(127,255,212,0.45)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
          </radialGradient>
        </defs>
        <circle
          cx={c}
          cy={c}
          r={hullR}
          fill="url(#g)"
          stroke="rgba(127,255,212,.35)"
        />
        <path d={d} fill="none" stroke="#7fffd4" strokeWidth="2" />
        <text
          x={c}
          y={c}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="42"
        >
          {emoji}
        </text>
        {tags.map((t, i) => {
          const angle = (-90 + i * (360 / tags.length)) * (Math.PI / 180)
          const x = c + Math.cos(angle) * (R + 22)
          const y = c + Math.sin(angle) * (R + 22)
          return (
            <text
              key={t}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="13"
              fill="#e9fffd"
              style={{
                textShadow: "0 0 6px rgba(0,0,0,.7)",
                fontWeight: 600,
              }}
            >
              {t}
            </text>
          )
        })}
      </svg>
    )
  }

  // ========= Rendu principal =========
  return (
    <div style={{ padding: "1rem", color: "#e9fffd", textAlign: "center" }}>
      <h3 style={{ color: "#7fffd4", marginBottom: ".6rem" }}>
        {step.symbol} Le souffle de {step.spirit_name}
      </h3>

      {!complete ? (
        <>
          <p style={{ opacity: 0.9, maxWidth: 320, margin: "0 auto 1rem" }}>
            Ferme les yeux, respire. Les bulles sont les mots de ton inconscient.
            Appuie sur celles qui vibrent — cinq formeront ton étoile.
          </p>

          {/* Hublot */}
          <div
            style={{
              position: "relative",
              width: size,
              height: size,
              margin: "0 auto",
              borderRadius: "50%",
              background:
                "radial-gradient(65% 65% at 50% 50%, #061520, #000)",
              boxShadow:
                "0 0 25px rgba(100,180,255,0.4), inset 0 0 40px rgba(0,0,0,0.8)",
              overflow: "hidden",
            }}
          >
            {/* emoji centre */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "42px",
                filter: "drop-shadow(0 0 8px rgba(127,255,212,0.6))",
                animation: "pulseCenter 3s ease-in-out infinite",
              }}
            >
              {step.symbol}
            </div>

            {bubbles.map((b) => (
              <button
                key={b.id}
                onClick={() => popBubble(b.id, b.label)}
                style={{
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "999px",
                  border: "1px solid rgba(127,255,212,0.55)",
                  background: "rgba(10,60,70,0.85)",
                  color: "#e9fffd",
                  fontSize: "0.8rem",
                  padding: "0.25rem 0.6rem",
                  minWidth: 48,
                  maxWidth: 90,
                  textAlign: "center",
                  whiteSpace: "normal",
                  lineHeight: 1.15,
                  cursor: "pointer",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  boxShadow: "0 0 10px rgba(127,255,212,0.3)",
                  opacity: b.fading ? 0 : 1,
                  transformOrigin: "center center",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  animation: "bubbleFloat 7s ease-in-out infinite",
                  ...(b.fading ? { transform: "translate(-50%, -50%) scale(0.6)" } : {}),
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <div style={{ fontSize: ".9rem", opacity: 0.85 }}>
              ✨ Mots captés : {captured.length}/5
            </div>
            <div style={{ marginTop: ".8rem" }}>
              <button onClick={reroll} style={btnGhost}>
                🎲 Relancer
              </button>
            </div>
          </div>

          <style>{`
            @keyframes pulseCenter {
              0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
              50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
            }
            @keyframes bubbleFloat {
              0%, 100% { transform: translate(-50%, -50%) translateY(0); }
              50% { transform: translate(-50%, -50%) translateY(-4px); }
            }
          `}</style>
        </>
      ) : (
        <div className="fade-in" style={{ marginTop: ".8rem" }}>
          <StarPreview emoji={step.symbol} tags={captured} />
          <h4 style={{ color: "#7fffd4", marginTop: ".6rem" }}>
            Ton étoile onirique est prête
          </h4>

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ color: "#aefcf5" }}>💫 Nombre d’échos avant métamorphose</h4>
            <input
              type="range"
              min="3"
              max="9"
              value={echoMax}
              onChange={(e) => setEchoMax(Number(e.target.value))}
              style={{ width: "80%", marginTop: ".4rem" }}
            />
            <div style={{ fontSize: ".9rem", opacity: 0.85 }}>
              {echoMax} contributions avant métamorphose
            </div>
          </div>

          <button
            onClick={() => onComplete && onComplete({ tags: captured, echoMax })}
            style={btnPrimary}
          >
            ✅ Continuer
          </button>
        </div>
      )}
    </div>
  )
}

/* — Styles boutons — */
const btnPrimary = {
  marginTop: "1rem",
  padding: ".6rem 1.2rem",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
}

const btnGhost = {
  padding: ".5rem 1rem",
  borderRadius: "10px",
  border: "1px solid rgba(127,255,212,.4)",
  background: "rgba(127,255,212,.1)",
  color: "#7fffd4",
  fontWeight: 600,
  cursor: "pointer",
}