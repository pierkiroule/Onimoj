import { useEffect, useRef, useState } from "react"

export default function TagCatcher({ initialEmojis = [], onFinish }) {
  const canvasRef = useRef(null)
  const inputRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [points, setPoints] = useState([])
  const [centerTitle, setCenterTitle] = useState("")
  const [msg, setMsg] = useState("✨ Ton étoile est tissée !")
  const [filledCount, setFilledCount] = useState(0)
  const [done, setDone] = useState(false)

  // placement direct de l’étoile
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv || initialEmojis.length !== 5) return
    const W = cv.width, H = cv.height
    const cx = W / 2, cy = H / 2, R = 120

    const placed = initialEmojis.map((emoji, i) => {
      const angle = -Math.PI / 2 + i * (2 * Math.PI / 5)
      return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle), emoji }
    })
    setSelected(placed)

    const pts = placed.map((b, i) => ({
      id: i,
      x: (b.x + cx) / 2,
      y: (b.y + cy) / 2,
      filled: false,
      word: null,
    }))
    setPoints(pts)
  }, [initialEmojis])

  // dessin
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    const W = cv.width, H = cv.height
    let raf

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const grad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, Math.max(W, H))
      grad.addColorStop(0, "#040b22")
      grad.addColorStop(1, "#000")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // réseau
      if (selected.length === 5) {
        ctx.strokeStyle = "rgba(120,240,255,0.7)"
        ctx.lineWidth = 1.6
        for (let i = 0; i < 5; i++) {
          for (let j = i + 1; j < 5; j++) {
            ctx.beginPath()
            ctx.moveTo(selected[i].x, selected[i].y)
            ctx.lineTo(selected[j].x, selected[j].y)
            ctx.stroke()
          }
        }
      }

      // émojis
      selected.forEach(b => {
        ctx.beginPath()
        ctx.arc(b.x, b.y, 34, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(120,240,255,0.9)"
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.font = "38px system-ui"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.shadowColor = "#aef"
        ctx.shadowBlur = 8
        ctx.fillText(b.emoji, b.x, b.y)
        ctx.shadowBlur = 0
      })

      // points
      points.forEach(p => {
        const pulse = p.filled ? 1 : Math.sin(Date.now() / 300 + p.id) * 0.3 + 0.9
        ctx.beginPath()
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
        ctx.fillStyle = p.filled ? "#5cd6ff" : `rgba(255,170,0,${pulse})`
        ctx.fill()
        if (p.word) {
          ctx.font = "13px Poppins"
          ctx.fillStyle = "#fff"
          ctx.textAlign = "center"
          ctx.fillText(p.word, p.x, p.y - 16)
        }
      })

      // halo + titre
      const cx = W / 2, cy = H / 2
      const breathe = Math.sin(Date.now() / 700) * 0.15 + 0.85
      ctx.beginPath()
      ctx.arc(cx, cy, 18 + 2 * breathe, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(120,240,255,0.6)"
      ctx.lineWidth = 1.4
      ctx.stroke()

      if (centerTitle) {
        ctx.font = "16px Poppins"
        ctx.fillStyle = "#cfefff"
        ctx.textAlign = "center"
        ctx.fillText(centerTitle, cx, cy - 28)
      }

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [selected, points, centerTitle])

  // clic
  const onClick = e => {
    const cv = canvasRef.current
    const rect = cv.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // clic sur points
    for (let p of points) {
      const d = Math.hypot(x - p.x, y - p.y)
      if (d < 12 && !p.filled) {
        showInput(p, rect.left + p.x, rect.top + p.y)
        return
      }
    }

    // clic centre = titre
    const cx = cv.width / 2, cy = cv.height / 2
    if (Math.hypot(x - cx, y - cy) < 24) {
      showInput({ id: "center" }, rect.left + cx, rect.top + cy - 36)
    }
  }

  const showInput = (target, absX, absY) => {
    const inp = inputRef.current
    inp.style.left = `${absX - 60}px`
    inp.style.top = `${absY - 20}px`
    inp.value = ""
    inp.dataset.target = target.id
    inp.style.display = "block"
    inp.focus()
  }

  const handleKeyDown = e => {
    if (e.key !== "Enter") return
    const val = e.target.value.trim()
    const target = e.target.dataset.target
    e.target.style.display = "none"

    if (target === "center") {
      setCenterTitle(val)
      return
    }

    const id = parseInt(target, 10)
    setPoints(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, filled: true, word: val || "…" } : p))
      const newCount = updated.filter(p => p.filled).length
      setFilledCount(newCount)
      if (newCount === 5 && centerTitle && !done) {
        setDone(true)
        setMsg("🌕 L’étoile résonne... L’esprit Onimoji s’éveille.")
        setTimeout(() => onFinish && onFinish(), 2000)
      }
      return updated
    })
  }

  return (
    <div className="tagcatcher-wrapper fade-in">
      <h2 className="phase-title">🌠 Compose ton étoile</h2>
      <p className="phase-subtitle">
        Clique les points pour écrire 5 mots. Clique le centre pour nommer ton étoile.
      </p>

      <div className="canvas-box">
        <canvas ref={canvasRef} width={700} height={480} onClick={onClick} />
      </div>

      <input
        ref={inputRef}
        placeholder="Écris ici…"
        onKeyDown={handleKeyDown}
        style={{
          position: "absolute",
          display: "none",
          background: "rgba(255,255,255,0.98)",
          color: "#0b1430",
          border: "none",
          borderRadius: "10px",
          padding: "8px 10px",
          fontSize: "14px",
          textAlign: "center",
          outline: "none",
        }}
      />

      <div className="message">{msg}</div>
    </div>
  )
}