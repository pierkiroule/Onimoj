import { useEffect, useRef } from "react"

export default function OnimojiCard({ star }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const emojis = star.emojis.slice(0, 3)
    const cx = 120, cy = 120
    const baseR = 80
    const innerR = 35
    const start = Date.now()

    function draw() {
      const t = (Date.now() - start) / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 🌌 bulle mère
      const pulse = 1 + 0.05 * Math.sin(t * 2)
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseR * pulse)
      grad.addColorStop(0, "rgba(110,255,180,0.08)")
      grad.addColorStop(1, "rgba(30,60,70,0.35)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * pulse, 0, Math.PI * 2)
      ctx.fill()

      // 🫧 trois bulles internes animées
      for (let i = 0; i < emojis.length; i++) {
        const angle = (i * (2 * Math.PI)) / 3 + t * 0.5
        const r = innerR + 10 * Math.sin(t * 1.2 + i)
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        const grad2 = ctx.createRadialGradient(x, y, 5, x, y, 22)
        grad2.addColorStop(0, "rgba(180,255,240,0.3)")
        grad2.addColorStop(1, "rgba(0,20,30,0.3)")
        ctx.fillStyle = grad2
        ctx.beginPath()
        ctx.arc(x, y, 22, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = "24px serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(emojis[i], x, y)
      }
      requestAnimationFrame(draw)
    }
    draw()
  }, [star])

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h3 style={{ color: "#bff", marginBottom: "0.3rem" }}>{star.title}</h3>
      <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
        🌌 Résonance : {(star.resonance_level * 100).toFixed(0)}%
      </p>
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        style={{
          background: "radial-gradient(circle,#010a10,#000)",
          borderRadius: "50%",
          boxShadow: "0 0 30px rgba(110,255,180,0.3)",
          marginTop: "0.5rem",
        }}
      />
    </div>
  )
}