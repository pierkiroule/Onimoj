import { useEffect, useRef } from 'react'

export default function ReseauEtoiles({ stars, highlight, onRevelation }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = (canvas.width = 300)
    const h = (canvas.height = 300)

    function draw() {
      ctx.clearRect(0, 0, w, h)
      stars.forEach((s, i) => {
        const angle = (i / stars.length) * 2 * Math.PI
        const r = 100
        const x = w / 2 + Math.cos(angle) * r
        const y = h / 2 + Math.sin(angle) * r
        const size = 6 + (s.texts?.[0]?.length || 0) / 30
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = s.id === highlight?.id ? '#6eff8d' : 'rgba(255,255,255,0.6)'
        ctx.fill()
      })
      requestAnimationFrame(draw)
    }
    draw()
  }, [stars, highlight])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        style={{
          margin: '1rem auto',
          display: 'block',
          background: 'radial-gradient(circle, #000, #111)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(255,255,255,0.2)',
        }}
      />
      <button
        onClick={onRevelation}
        style={{
          background: '#6eff8d',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
        }}
      >
        🌙 Révéler l’Onimoji du jour
      </button>
    </div>
  )
}