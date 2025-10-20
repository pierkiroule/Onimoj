import { useEffect, useRef, useState } from 'react'
import '../App.css'

export default function HublotOnirique({ onCatch }) {
  const canvasRef = useRef(null)
  const [caught, setCaught] = useState([])

  const emojis = ['🌬️', '❄️', '🦭', '🌊', '🌕', '🦅', '🐚', '🔥']

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = (canvas.width = 260)
    const h = (canvas.height = 260)
    const radius = w / 2

    // chaque émoji devient une particule
    const particles = emojis.map((emoji) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      emoji,
      size: 24,
    }))

    function draw() {
      ctx.clearRect(0, 0, w, h)
      // cercle du hublot
      const grad = ctx.createRadialGradient(radius, radius, 100, radius, radius, 130)
      grad.addColorStop(0, 'rgba(120,255,255,0.1)')
      grad.addColorStop(1, 'rgba(10,10,30,0.9)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(radius, radius, radius, 0, Math.PI * 2)
      ctx.fill()

      // bord lumineux
      ctx.strokeStyle = 'rgba(127,255,212,0.4)'
      ctx.lineWidth = 3
      ctx.stroke()

      // mouvement + rebonds
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // rebonds doux
        if (p.x < p.size || p.x > w - p.size) p.vx *= -1
        if (p.y < p.size || p.y > h - p.size) p.vy *= -1

        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.emoji, p.x, p.y)
      })

      requestAnimationFrame(draw)
    }

    draw()

    // capture tactile
    function handleTouch(e) {
      const rect = canvas.getBoundingClientRect()
      const x = e.touches ? e.touches[0].clientX - rect.left : e.offsetX
      const y = e.touches ? e.touches[0].clientY - rect.top : e.offsetY
      particles.forEach((p) => {
        const dx = p.x - x
        const dy = p.y - y
        if (Math.sqrt(dx * dx + dy * dy) < 20 && !caught.includes(p.emoji)) {
          setCaught((prev) => {
            const updated = [...prev, p.emoji]
            onCatch(p.emoji)
            return updated
          })
        }
      })
    }

    canvas.addEventListener('click', handleTouch)
    canvas.addEventListener('touchstart', handleTouch)

    return () => {
      canvas.removeEventListener('click', handleTouch)
      canvas.removeEventListener('touchstart', handleTouch)
    }
  }, [onCatch, caught])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <canvas
        ref={canvasRef}
        width="260"
        height="260"
        style={{
          borderRadius: '50%',
          border: '2px solid rgba(127,255,212,0.4)',
          boxShadow: '0 0 20px rgba(127,255,212,0.3)',
          background: 'radial-gradient(circle, rgba(20,30,50,0.9), rgba(5,10,20,0.95))',
        }}
      ></canvas>
    </div>
  )
}