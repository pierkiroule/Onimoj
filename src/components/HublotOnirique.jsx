import { useEffect, useRef } from 'react'

export default function HublotOnirique({
  emojis = ['🌬️','❄️','🌕','🌊','🔥','🌿','🪶','🌙','🧊','🐋','🦭','🐻'],
  onCatch
}) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const fxParticles = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const size = 300
    canvas.width = size
    canvas.height = size

    // 🌌 Initialisation des emojis flottants
    particles.current = emojis.map((emoji) => ({
      emoji,
      x: Math.random() * size,
      y: Math.random() * size,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      size: 26 + Math.random() * 8,
      caught: false,
      pulse: 0
    }))

    // ✨ FX animation
    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      // Fond vivant
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, 150)
      gradient.addColorStop(0, 'rgba(110,255,141,0.15)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.2)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      // Bord du hublot
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(127,255,212,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // 🌬️ Dessine les emojis
      for (const p of particles.current) {
        if (p.caught) continue
        p.x += p.vx
        p.y += p.vy
        if (p.x < 20 || p.x > size - 20) p.vx *= -1
        if (p.y < 20 || p.y > size - 20) p.vy *= -1

        // Halo pulsant
        p.pulse += 0.05
        const halo = 4 + Math.sin(p.pulse) * 2
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size / 1.8 + halo, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(127,255,212,0.1)'
        ctx.fill()

        ctx.font = `${p.size}px "Noto Color Emoji","Segoe UI Emoji"`
        ctx.fillText(p.emoji, p.x - p.size / 2, p.y + p.size / 3)
      }

      // 🌟 FX de capture
      fxParticles.current.forEach((fx) => {
        fx.life -= 1
        fx.x += fx.vx
        fx.y += fx.vy
        const alpha = fx.life / fx.maxLife
        ctx.beginPath()
        ctx.arc(fx.x, fx.y, fx.size, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      })
      fxParticles.current = fxParticles.current.filter((fx) => fx.life > 0)

      requestAnimationFrame(animate)
    }
    animate()

    // 🪶 Clic / capture
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      for (const p of particles.current) {
        if (p.caught) continue
        const dx = x - p.x
        const dy = y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < p.size * 0.7) {
          p.caught = true
          // 💥 Ajoute FX particules
          for (let i = 0; i < 20; i++) {
            fxParticles.current.push({
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              size: 1 + Math.random() * 2,
              life: 30 + Math.random() * 20,
              maxLife: 50,
            })
          }
          // 💫 Onde lumineuse
          for (let r = 0; r < 80; r += 10) {
            fxParticles.current.push({
              x: p.x,
              y: p.y,
              vx: 0,
              vy: 0,
              size: r / 5,
              life: 20,
              maxLife: 20,
            })
          }
          if (onCatch) onCatch(p.emoji)
          break
        }
      }
    }

    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [emojis, onCatch])

  return (
    <div
      style={{
        width: '300px',
        height: '300px',
        margin: '1rem auto',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 25px rgba(127,255,212,0.4)',
        background: 'radial-gradient(circle at center, rgba(0,20,30,0.85), rgba(0,0,0,0.95))',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          borderRadius: '50%',
          cursor: 'crosshair',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#7fffd4',
          fontSize: '0.8rem',
          opacity: 0.6,
          textShadow: '0 0 4px #00ffff',
        }}
      >
        🌠 Attrape les rêves
      </div>
    </div>
  )
}