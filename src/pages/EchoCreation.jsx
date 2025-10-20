import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

export default function EchoCreation() {
  const [stars, setStars] = useState([])
  const [status, setStatus] = useState('🌌 Connexion au ciel des échos...')
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  // 🌠 Chargement des étoiles
  useEffect(() => {
    async function fetchStars() {
      try {
        const { data, error } = await supabase.from('echo_creations').select('*')
        if (error) throw error
        setStars(data || [])
        setStatus(`✨ ${data?.length || 0} étoiles en résonance`)
      } catch (err) {
        console.error(err)
        setStatus('⚠️ Impossible de capter les étoiles.')
      }
    }
    fetchStars()
  }, [])

  // 🪶 Animation cosmique
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight * 0.8
    canvas.width = width
    canvas.height = height

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // fond doux
      const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
      bg.addColorStop(0, '#050510')
      bg.addColorStop(1, '#000')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // 💫 Lignes de résonance
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i]
          const b = stars[j]
          const dx = (a.x - b.x)
          const dy = (a.y - b.y)
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 0.15) {
            const strength = 1 - dist / 0.15
            ctx.strokeStyle = `rgba(127,255,212,${strength * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(
              (a.x * width * zoom) + offset.x + width / 2 - (width / 2) * zoom,
              (a.y * height * zoom) + offset.y + height / 2 - (height / 2) * zoom
            )
            ctx.lineTo(
              (b.x * width * zoom) + offset.x + width / 2 - (width / 2) * zoom,
              (b.y * height * zoom) + offset.y + height / 2 - (height / 2) * zoom
            )
            ctx.stroke()
          }
        }
      }

      // 🌟 Étoiles
      stars.forEach((star) => {
        const x = (star.x * width * zoom) + offset.x + width / 2 - (width / 2) * zoom
        const y = (star.y * height * zoom) + offset.y + height / 2 - (height / 2) * zoom
        const size = (5 + star.size * 6) * zoom
        const glow = star.glow || 1.0

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8)
        gradient.addColorStop(0, `${star.color}aa`)
        gradient.addColorStop(0.3, `${star.color}33`)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size * glow, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2)
        ctx.fill()

        star.x += Math.sin(Date.now() / 4000 + y) * 0.00003
        star.y += Math.cos(Date.now() / 4000 + x) * 0.00003
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [stars, zoom, offset])

  // 🔭 Zoom souris + déplacement tactile
  useEffect(() => {
    const canvas = canvasRef.current
    let dragging = false
    let lastX, lastY

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoom((z) => Math.min(3, Math.max(0.5, z * delta)))
    }

    const handleDown = (e) => {
      dragging = true
      lastX = e.clientX || e.touches?.[0]?.clientX
      lastY = e.clientY || e.touches?.[0]?.clientY
    }

    const handleMove = (e) => {
      if (!dragging) return
      const x = e.clientX || e.touches?.[0]?.clientX
      const y = e.clientY || e.touches?.[0]?.clientY
      setOffset((o) => ({ x: o.x + (x - lastX), y: o.y + (y - lastY) }))
      lastX = x
      lastY = y
    }

    const handleUp = () => (dragging = false)

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('mousedown', handleDown)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseup', handleUp)
    canvas.addEventListener('touchstart', handleDown)
    canvas.addEventListener('touchmove', handleMove)
    canvas.addEventListener('touchend', handleUp)

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleDown)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseup', handleUp)
      canvas.removeEventListener('touchstart', handleDown)
      canvas.removeEventListener('touchmove', handleMove)
      canvas.removeEventListener('touchend', handleUp)
    }
  }, [])

  // 🌠 Clic : afficher un rêve
  const handleClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const xClick = (event.clientX - rect.left) / rect.width
    const yClick = (event.clientY - rect.top) / rect.height

    const nearest = stars.reduce((acc, s) => {
      const dx = s.x - xClick
      const dy = s.y - yClick
      const dist = Math.sqrt(dx * dx + dy * dy)
      return dist < acc.dist ? { star: s, dist } : acc
    }, { star: null, dist: 999 })

    if (nearest.star && nearest.dist < 0.05) {
      const f = nearest.star.fragments?.[nearest.star.fragments.length - 1]
      alert(
        `🌟 ${nearest.star.title}\n` +
        `Culture : ${nearest.star.culture}\n` +
        `Brillance : ${nearest.star.glow}\n\n` +
        `Dernier écho :\n“${f?.text_fragment || '…rêve en cours…'}”`
      )
    }
  }

  return (
    <div className="fade-in" style={{ color: '#eee', textAlign: 'center' }}>
      <h2>🌌 Écho-Création</h2>
      <p style={{ opacity: 0.8 }}>{status}</p>

      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          width: '100%',
          height: '70vh',
          background: 'black',
          border: '1px solid rgba(127,255,212,0.2)',
          borderRadius: '8px',
          marginTop: '1rem',
          cursor: 'grab',
          touchAction: 'none'
        }}
      />

      <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
        🔭 Touchez, zoomez et déplacez-vous dans le ciel onirique.
      </p>
    </div>
  )
}