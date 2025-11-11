import { useEffect, useRef, useState } from "react"
import { btnGhost } from "./buttons"

export default function BubbleField({ bank, symbol, candidateCount = 15, onCapture }) {
  const size = 340
  const radius = size / 2
  const hullR = radius - 28
  const center = { x: radius, y: radius }

  const [bubbles, setBubbles] = useState([])
  const [captured, setCaptured] = useState([])
  const rafRef = useRef(null)

  /* ------------------ Placement harmonieux ------------------ */
  function makeBubbles(list) {
    const picks = [...list]
      .sort(() => 0.5 - Math.random())
      .filter((t) => !captured.includes(t))
      .slice(0, candidateCount)
    const newBubbles = []

    for (const label of picks) {
      const len = label.length
      const r = 18 + Math.min(len * 1.2, 26)
      let x, y, safe = false, attempts = 0
      while (!safe && attempts < 200) {
        const angle = Math.random() * 2 * Math.PI
        const dist = Math.random() * (hullR - r - 5)
        x = center.x + Math.cos(angle) * dist
        y = center.y + Math.sin(angle) * dist
        safe = !newBubbles.some(b => Math.hypot(x - b.x, y - b.y) < b.r + r + 8)
        attempts++
      }
      newBubbles.push({
        id: `${label}-${Math.random().toString(36).slice(2, 6)}`,
        label, x, y, r,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        fading: false,
      })
    }
    return newBubbles
  }

  /* ------------------ Initialisation ------------------ */
  useEffect(() => setBubbles(makeBubbles(bank)), [bank])

  /* ------------------ Animation physique douce ------------------ */
  useEffect(() => {
    let stop = false
    const animate = () => {
      if (stop) return
      setBubbles(prev => {
        const updated = prev.map(a => ({ ...a }))
        for (let i = 0; i < updated.length; i++) {
          const a = updated[i]
          a.x += a.vx
          a.y += a.vy

          // bord du hublot
          const dx = a.x - center.x
          const dy = a.y - center.y
          const dist = Math.hypot(dx, dy)
          const maxDist = hullR - a.r
          if (dist > maxDist && dist > 0) {
            const nx = dx / dist, ny = dy / dist
            a.x = center.x + nx * maxDist
            a.y = center.y + ny * maxDist
            const dot = a.vx * nx + a.vy * ny
            a.vx -= 1.8 * dot * nx
            a.vy -= 1.8 * dot * ny
          }

          // collisions entre bulles
          for (let j = i + 1; j < updated.length; j++) {
            const b = updated[j]
            const dx2 = b.x - a.x, dy2 = b.y - a.y
            const dist2 = Math.hypot(dx2, dy2)
            const minDist = a.r + b.r + 4
            if (dist2 < minDist && dist2 > 0) {
              const nx = dx2 / dist2, ny = dy2 / dist2
              const overlap = (minDist - dist2) / 2
              a.x -= nx * overlap
              a.y -= ny * overlap
              b.x += nx * overlap
              b.y += ny * overlap
              // vitesse échangée partiellement
              const avx = a.vx, avy = a.vy
              a.vx = b.vx * 0.8
              a.vy = b.vy * 0.8
              b.vx = avx * 0.8
              b.vy = avy * 0.8
            }
          }

          // légère friction pour stabiliser
          a.vx *= 0.98
          a.vy *= 0.98
        }
        return updated
      })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      stop = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* ------------------ Interaction ------------------ */
  function popBubble(id, label) {
    setBubbles(p => p.map(b => (b.id === id ? { ...b, fading: true } : b)))
    setTimeout(() => {
      setBubbles(p => p.filter(b => b.id !== id))
      if (!captured.includes(label)) {
        const next = [...captured, label].slice(0, 5)
        setCaptured(next)
        onCapture(label)
      }
    }, 250)
  }

  const reroll = () => setBubbles(makeBubbles(bank))

  /* ------------------ Rendu ------------------ */
  return (
    <div style={{ textAlign: "center" }}>
      {/* Hublot */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          margin: "0 auto",
          borderRadius: "50%",
          background: "radial-gradient(65% 65% at 50% 50%, #0b1b25, #000)",
          boxShadow: "0 0 30px rgba(100,180,255,0.4), inset 0 0 50px rgba(0,0,0,0.9)",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        {/* symbole central */}
        <div
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "42px",
            filter: "drop-shadow(0 0 8px rgba(127,255,212,0.6))",
            animation: "pulseCenter 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          {symbol}
        </div>

        {bubbles.map(b => (
          <button
            key={b.id}
            onClick={() => popBubble(b.id, b.label)}
            style={{
              position: "absolute",
              left: b.x, top: b.y,
              transform: "translate(-50%, -50%)",
              background: "transparent",
              border: "none",
              color: "#aefcf5",
              fontSize: "0.9rem",
              fontWeight: 600,
              textShadow: "0 0 6px rgba(127,255,212,0.6)",
              cursor: "pointer",
              opacity: b.fading ? 0 : 1,
              transition: "opacity 0.4s ease",
              pointerEvents: b.fading ? "none" : "auto",
              userSelect: "none",
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Liste claire des mots capturés */}
      {captured.length > 0 && (
        <div
          style={{
            marginTop: "1.2rem",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.7rem 1.2rem",
            color: "#7fffd4",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textShadow: "0 0 8px rgba(127,255,212,0.4)",
          }}
        >
          {captured.map((t, i) => (
            <span
              key={t}
              style={{
                animation: "fadeInTag 0.6s ease",
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
                animationFillMode: "forwards",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={reroll} style={btnGhost}>🎲 Relancer</button>
      </div>

      <style>{`
        @keyframes pulseCenter {
          0%,100% { transform: translate(-50%, -50%) scale(1); opacity: .9; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes fadeInTag {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}