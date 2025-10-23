import { useEffect, useRef, useMemo } from "react"

export default function BulleMythonirique({ bulle }) {
  const canvasRef = useRef()

  const phrasePoetique = useMemo(() => {
    const map = {
      "🌬️": "le souffle du monde",
      "🐋": "la mer-mère des transformations",
      "🦌": "le voyage de l’âme",
      "🧙‍♂️": "le passeur des mondes",
      "🌘": "le rythme du rêve",
      "🪶": "le messager du ciel"
    }
    const l = bulle.emojis.map(e => map[e] || e)
    if (l.length === 3)
      return `Entre ${l[0]}, ${l[1]} et ${l[2]}, une bulle de rêve s’élève.`
    return `Une bulle s’éveille entre terre et ciel.`
  }, [bulle.emojis])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const emojis = bulle.emojis
    const cx = 120, cy = 120
    const baseR = 80
    const innerR = 35
    const start = Date.now()

    function draw() {
      const t = (Date.now() - start) / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pulse = 1 + 0.05 * Math.sin(t * 2)
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseR * pulse)
      grad.addColorStop(0, "rgba(150,255,200,0.08)")
      grad.addColorStop(1, "rgba(20,40,60,0.4)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * pulse, 0, Math.PI * 2)
      ctx.fill()

      for (let i = 0; i < emojis.length; i++) {
        const angle = (i * (2 * Math.PI)) / emojis.length + t * 0.5
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
  }, [bulle])

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h3 style={{ color: "#bff", marginBottom: "0.3rem" }}>{bulle.titre}</h3>
      <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>{phrasePoetique}</p>
      <canvas
        ref={canvasRef}
        width={240}
        height={240}
        style={{
          background: "radial-gradient(circle,#010a10,#000)",
          borderRadius: "50%",
          boxShadow: "0 0 30px rgba(150,255,200,0.3)",
          marginTop: "0.5rem"
        }}
      />
    </div>
  )
}