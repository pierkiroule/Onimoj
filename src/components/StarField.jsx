import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Ajuste la taille du canvas
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Création des étoiles
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 0.6 + 0.2,
      s: Math.random() * 0.3 + 0.1,
      alpha: Math.random(),
      pulse: Math.random() * 0.02 + 0.005
    }))

    // Boucle d'animation
    let rafId
    const draw = () => {
      // fond très sombre légèrement bleuté
      ctx.fillStyle = 'rgba(5, 5, 20, 0.9)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        // pulsation lente
        star.alpha += star.pulse
        if (star.alpha >= 1 || star.alpha <= 0.2) star.pulse *= -1

        // descente douce
        star.y += star.s
        if (star.y > canvas.height) star.y = 0

        // dessin
        ctx.beginPath()
        ctx.globalAlpha = star.alpha
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
      })

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  )
}