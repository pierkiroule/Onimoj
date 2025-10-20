import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function OnimojiReveil({ step, onContinue }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = (canvas.width = 300)
    const h = (canvas.height = 300)

    // 🌟 Création de particules
    const particles = Array.from({ length: 80 }).map(() => ({
      x: w / 2,
      y: h / 2,
      angle: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 2,
      size: 1 + Math.random() * 2,
      alpha: 1,
    }))

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p) => {
        const dx = Math.cos(p.angle) * p.speed
        const dy = Math.sin(p.angle) * p.speed
        p.x += dx
        p.y += dy
        p.alpha -= 0.008
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(110,255,141,${p.alpha})`
        ctx.fill()

        // Reset quand la particule disparaît
        if (p.alpha <= 0) {
          p.x = w / 2
          p.y = h / 2
          p.alpha = 1
          p.angle = Math.random() * Math.PI * 2
          p.speed = 0.5 + Math.random() * 2
        }
      })

      requestAnimationFrame(draw)
    }

    draw()
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{
        padding: '1rem',
        color: '#eee',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      {/* 🌠 Halo et particules */}
      <canvas
        ref={canvasRef}
        width="300"
        height="300"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          borderRadius: '50%',
        }}
      />

      {/* 💫 Contenu principal */}
      <div
        style={{
          background: 'radial-gradient(circle at top, rgba(20,30,50,0.8), rgba(0,0,0,0.9))',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 0 40px rgba(110,255,141,0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.h2
          animate={{ scale: [1, 1.05, 1], textShadow: ['0 0 10px #6eff8d', '0 0 30px #6eff8d'] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ color: '#6eff8d', marginBottom: '0.3rem' }}
        >
          {step.symbol} {step.spirit_name}
        </motion.h2>

        <p style={{ opacity: 0.85, marginBottom: '0.8rem', lineHeight: '1.4' }}>
          {step.description}
        </p>

        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#aaf' }}
        >
          “Le guide t’invite à poursuivre le souffle du rêve.”
        </motion.p>

        <button
          onClick={onContinue}
          style={{
            marginTop: '1rem',
            background: '#6eff8d',
            color: '#111',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
            zIndex: 2,
            position: 'relative',
          }}
        >
          ➡️ Continuer la mission
        </button>
      </div>
    </motion.div>
  )
}