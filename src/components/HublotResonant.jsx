import { useEffect, useMemo, useRef, useState } from "react"
import { inuitWordBanksByIndex } from "../data/inuitWordBanks"

/**
 * Hublot Résonant 2.0 — Dreamcatcher
 * - Bubbles = tags candidats (15 par défaut) qui flottent et rebondissent
 * - Tap = "pop" → ajoute le mot aux 5 branches de l'Onimoji
 * - Reroll = relance un tirage (sans perdre les tags déjà captés)
 * - Quand 5 tags → on affiche l'étoile + bouton Continuer (parent sauve)
 */
export default function HublotResonant({
  step = { step_number: 1, spirit_name: "Sila", symbol: "🌬️" },
  candidateCount = 15,
  onComplete, // (tags[]) => void
}) {
  const size = 320
  const radius = size / 2
  const hullR = radius - 8

  // ===== BANK =====
  const bank = useMemo(() => {
    const list = (inuitWordBanksByIndex?.[step.step_number] || []).map(o => o.fr)
    // dédoublonner proprement
    return Array.from(new Set(list))
  }, [step.step_number])

  // ===== STATE =====
  const [captured, setCaptured] = useState([]) // 0..5
  const [bubbles, setBubbles] = useState([])   // objets animés
  const [complete, setComplete] = useState(false)
  const rafRef = useRef(null)
  const containerRef = useRef(null)

  // ===== INIT BUBBLES =====
  function makeBubbles(seedList) {
    const picks = [...seedList]
      .sort(() => 0.5 - Math.random())
      .filter(t => !captured.includes(t))
      .slice(0, candidateCount)

    const objs = picks.map((label, i) => ({
      id: `${label}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      // position initiale aléatoire dans le disque (éviter le centre)
      x: radius + (Math.random() * 2 - 1) * (hullR - 24),
      y: radius + (Math.random() * 2 - 1) * (hullR - 24),
      vx: (Math.random() * 1.2 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
      vy: (Math.random() * 1.2 + 0.3) * (Math.random() < 0.5 ? -1 : 1),
      r: 18,
    }))
    return objs
  }

  // première population
  useEffect(() => {
    setBubbles(makeBubbles(bank))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank])

  // ===== POP (capture) =====
  function popBubble(id, label) {
    if (complete) return
    if (captured.includes(label)) return
    const next = [...captured, label].slice(0, 5)
    setCaptured(next)
    setBubbles(bubbles.filter(b => b.id !== id))
    if (next.length === 5) setComplete(true)
  }

  // ===== REROLL =====
  function reroll() {
    setBubbles(makeBubbles(bank))
  }

  // ===== ANIMATION =====
  useEffect(() => {
    const center = { x: radius, y: radius }
    const emojiR = 20 // rayon "collision" autour de l'emoji central

    function stepAnim() {
      setBubbles(prev =>
        prev.map(b => {
          let { x, y, vx, vy, r } = b

          // déplacement
          x += vx
          y += vy

          // rebond bord circulaire (hublot)
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.hypot(dx, dy)
          const maxDist = hullR - r
          if (dist > maxDist) {
            // normale vers le centre
            const nx = dx / dist
            const ny = dy / dist
            // repousse légèrement et inverse vitesse sur la normale
            x = center.x + nx * maxDist
            y = center.y + ny * maxDist
            const dot = vx * nx + vy * ny
            vx -= 2 * dot * nx
            vy -= 2 * dot * ny
          }

          // rebond sur l'emoji central
          const d2 = Math.hypot(x - center.x, y - center.y)
          if (d2 < emojiR + r + 4) {
            const nx = (x - center.x) / d2
            const ny = (y - center.y) / d2
            x = center.x + (emojiR + r + 4) * nx
            y = center.y + (emojiR + r + 4) * ny
            const dot = vx * nx + vy * ny
            vx -= 2 * dot * nx
            vy -= 2 * dot * ny
          }

          // micro-variations pour vie
          vx += (Math.random() - 0.5) * 0.02
          vy += (Math.random() - 0.5) * 0.02

          // limiter la vitesse
          const sp = Math.hypot(vx, vy)
          const maxV = 1.1
          if (sp > maxV) {
            vx = (vx / sp) * maxV
            vy = (vy / sp) * maxV
          }

          return { ...b, x, y, vx, vy }
        })
      )
      rafRef.current = requestAnimationFrame(stepAnim)
    }

    rafRef.current = requestAnimationFrame(stepAnim)
    return () => cancelAnimationFrame(rafRef.current)
  }, [hullR, radius])

  // ===== STAR PREVIEW (SVG 5 branches) =====
  const StarPreview = ({ emoji, tags }) => {
    const c = 160, R = 118, r = 54
    const pts = Array.from({ length: 10 }, (_, i) => {
      const a = (-90 + i * 36) * (Math.PI / 180)
      const rad = i % 2 === 0 ? R : r
      return [c + rad * Math.cos(a), c + rad * Math.sin(a)]
    })
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

    return (
      <svg viewBox="0 0 320 320" width={size} height={size} style={{ display: "block" }}>
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(127,255,212,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </radialGradient>
        </defs>
        <circle cx={c} cy={c} r={hullR} fill="url(#g)" stroke="rgba(127,255,212,.35)" />
        <path d={d} fill="none" stroke="#7fffd4" strokeWidth="1.8" />
        <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontSize="40">
          {step.symbol || "✨"}
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

  // ===== RENDER =====
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ color: "#9ae7ff", marginBottom: ".5rem", fontWeight: 600 }}>
        🌌 Bravo•° Dans ton dreamcatcher émerge l'Onimoji du jour  — {step.spirit_name}
      </div>

      {/* Hublot (mode capture) */}
      {!complete && (
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: size,
            height: size,
            margin: "0 auto",
            borderRadius: "50%",
            background: "radial-gradient(60% 60% at 50% 50%, #05121a 0%, #000 100%)",
            boxShadow: "0 0 18px rgba(127,255,212,0.35), inset 0 0 40px rgba(0,0,0,.6)",
            overflow: "hidden",
          }}
        >
          {/* emoji central */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "42px",
              filter: "drop-shadow(0 0 6px rgba(127,255,212,.35))",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {step.symbol || "✨"}
          </div>

          {/* bulles */}
          {bubbles.map(b => (
            <button
              key={b.id}
              onClick={() => popBubble(b.id, b.label)}
              style={{
                position: "absolute",
                left: b.x - 9999, // évite clignotements durant animation diff
                top: b.y - 9999,
                transform: `translate(${9999 - b.r}px, ${9999 - b.r}px)`,
                minWidth: 0,
                border: "1px solid rgba(127,255,212,.55)",
                borderRadius: "999px",
                background: "rgba(127,255,212,.10)",
                color: "#e9fffd",
                padding: ".28rem .6rem",
                fontSize: ".85rem",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                boxShadow: "0 0 8px rgba(0,0,0,.35)",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      {/* Captures en cours */}
      {!complete && (
        <div style={{ marginTop: ".8rem", color: "#e9fffd" }}>
          <div style={{ opacity: .8, fontSize: ".9rem", marginBottom: ".35rem" }}>
            Tags captés : {captured.length}/5
          </div>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center" }}>
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

          <div style={{ marginTop: ".9rem", display: "flex", gap: ".6rem", justifyContent: "center" }}>
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
              🎲 Relancer les bulles
            </button>
            <button
              disabled={captured.length < 5}
              onClick={() => setComplete(true)}
              style={{
                padding: ".55rem .9rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,.15)",
                background: captured.length < 5 ? "rgba(255,255,255,.08)" : "rgba(110,255,141,.15)",
                color: captured.length < 5 ? "#b7c9c6" : "#6eff8d",
                cursor: captured.length < 5 ? "not-allowed" : "pointer",
              }}
            >
              🌟 Tisser l’étoile
            </button>
          </div>
        </div>
      )}

      {/* Étoile finale + suite */}
      {complete && (
        <div style={{ marginTop: ".6rem", textAlign: "center" }}>
          <StarPreview emoji={step.symbol || "✨"} tags={captured} />
          <p style={{ color: "#7fffd4", marginTop: ".6rem" }}>
            ✨ Le Dreamcatcher est rempli.
          </p>
          <button
            onClick={() => onComplete && onComplete(captured)}
            style={{
              marginTop: ".6rem",
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
    </div>
  )
}