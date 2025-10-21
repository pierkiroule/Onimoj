import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabaseClient"

export default function EchoCreation() {
  const [stars, setStars] = useState([])
  const [status, setStatus] = useState("🌌 Connexion au ciel des échos...")
  const [selected, setSelected] = useState(null)
  const canvasRef = useRef(null)

  // 🪐 Chargement des étoiles
  useEffect(() => {
    async function fetchStars() {
      try {
        const { data, error } = await supabase.from("dream_stars").select("*")
        if (error) throw error
        setStars(
          (data || []).map((s) => ({
            ...s,
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            resonance: s.resonance_level || 0.5,
          }))
        )
        setStatus(`✨ ${data?.length || 0} étoiles connectées`)
      } catch (err) {
        console.error(err)
        setStatus("⚠️ Erreur lors du chargement du ciel onirique.")
      }
    }
    fetchStars()
  }, [])

  // ⭐️ fonction pour dessiner une étoile rayonnante
  const drawStar = (ctx, x, y, size, points, inner, color, glow) => {
    ctx.save()
    ctx.beginPath()
    ctx.translate(x, y)
    ctx.moveTo(0, -size)
    for (let i = 0; i < points; i++) {
      ctx.rotate(Math.PI / points)
      ctx.lineTo(0, -size * inner)
      ctx.rotate(Math.PI / points)
      ctx.lineTo(0, -size)
    }
    ctx.closePath()
    ctx.shadowColor = color
    ctx.shadowBlur = 15 * glow
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  }

  // 🌌 Animation cosmique
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = window.innerWidth
    const height = window.innerHeight * 0.8
    canvas.width = width
    canvas.height = height

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
      bg.addColorStop(0, "#010109")
      bg.addColorStop(1, "#000")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      stars.forEach((s) => {
        const x = width / 2 + s.x * width * 0.4
        const y = height / 2 + s.y * height * 0.4
        const resonance = Math.min(1, Math.max(0, s.resonance))
        const pulse = 1 + Math.sin(Date.now() / 600 + s.x * 5) * 0.1 * (0.5 + resonance)
        const size = 6 + resonance * 8

        // couleur selon résonance
        const color =
          resonance < 0.3
            ? "rgba(255,255,255,0.9)"
            : resonance < 0.7
            ? "rgba(255,240,180,0.9)"
            : "rgba(255,180,80,0.95)"

        // halo
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 6)
        gradient.addColorStop(0, color.replace("0.9", 0.3 + resonance * 0.4))
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size * 3 * pulse, 0, Math.PI * 2)
        ctx.fill()

        // étoile centrale
        drawStar(ctx, x, y, size * pulse, 5, 0.5, color, 1 + resonance * 2)

        // titre
        ctx.font = "12px Poppins"
        ctx.fillStyle = "rgba(255,255,255,0.8)"
        ctx.textAlign = "center"
        ctx.fillText(s.title || "★", x, y - size * 2)
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [stars])

  // 🖱️ clic sur une étoile
  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const xClick = (e.clientX - rect.left) / rect.width
    const yClick = (e.clientY - rect.top) / rect.height
    let nearest = null
    let minDist = Infinity
    stars.forEach((s) => {
      const dx = xClick - (s.x + 0.5)
      const dy = yClick - (s.y + 0.5)
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) {
        minDist = dist
        nearest = s
      }
    })
    if (nearest && minDist < 0.1) setSelected(nearest)
  }

  // positions 5 branches
  const starPositions = [
    { x: 0, y: -80 },
    { x: 75, y: -25 },
    { x: 45, y: 70 },
    { x: -45, y: 70 },
    { x: -75, y: -25 },
  ]

  return (
    <div style={{ color: "#eee", textAlign: "center" }}>
      <h2>🌌 Écho-Création</h2>
      <p style={{ opacity: 0.8 }}>{status}</p>

      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "70vh",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px",
          marginTop: "1rem",
          cursor: "pointer",
        }}
      />

      {/* 🌟 Modale d’identité visuelle Onimoji */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(15,25,25,0.95)",
              padding: "1.5rem",
              borderRadius: "14px",
              width: "320px",
              color: "#bff",
              textAlign: "center",
              boxShadow: "0 0 25px rgba(255,200,120,0.4)",
              position: "relative",
            }}
          >
            <h3>{selected.title}</h3>
            <p style={{ opacity: 0.8 }}>
              Résonance : {(selected.resonance_level * 100).toFixed(0)}%
            </p>

            {/* halo animé */}
            <div
              style={{
                position: "absolute",
                top: "calc(50% - 90px)",
                left: "calc(50% - 90px)",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(255,180,80,${
                  0.4 + selected.resonance_level * 0.5
                }), transparent 70%)`,
                animation: "pulse 3s ease-in-out infinite",
                filter: "blur(6px)",
              }}
            ></div>

            {/* dessin étoile 5 branches d’émojis */}
            <div
              style={{
                position: "relative",
                width: "200px",
                height: "200px",
                margin: "1rem auto",
              }}
            >
              <svg width="200" height="200" style={{ position: "absolute" }}>
                {starPositions.map((a, i) => {
                  const b = starPositions[(i + 2) % 5]
                  return (
                    <line
                      key={i}
                      x1={100 + a.x}
                      y1={100 + a.y}
                      x2={100 + b.x}
                      y2={100 + b.y}
                      stroke="rgba(255,200,120,0.8)"
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>

              {selected.emojis?.map((e, i) => {
                const p = starPositions[i]
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 100 + p.y,
                      left: 100 + p.x,
                      transform: "translate(-50%, -50%) scale(1.5)",
                      fontSize: "1.8rem",
                      textShadow: "0 0 15px rgba(255,200,120,0.8)",
                    }}
                  >
                    {e}
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{
                background: "linear-gradient(145deg,#ffd27f,#ff9035)",
                border: "none",
                borderRadius: "10px",
                padding: "0.6rem 1.3rem",
                fontWeight: "bold",
                cursor: "pointer",
                color: "#111",
              }}
            >
              ✨ Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}