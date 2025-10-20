import { useEffect, useRef } from 'react'

export default function EtoileOnirique({ emojis = [], texts = [], onTextChange }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const w = (canvas.width = 280)
    const h = (canvas.height = 280)
    const cx = w / 2
    const cy = h / 2
    const radius = 100

    function drawPentagram() {
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(150,255,220,0.6)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2
        const x = cx + radius * Math.cos(angle)
        const y = cy + radius * Math.sin(angle)
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()

      // Lignes internes
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a1 = ((Math.PI * 2) / 5) * i - Math.PI / 2
        const a2 = ((Math.PI * 2) / 5) * ((i + 2) % 5) - Math.PI / 2
        ctx.moveTo(cx + radius * Math.cos(a1), cy + radius * Math.sin(a1))
        ctx.lineTo(cx + radius * Math.cos(a2), cy + radius * Math.sin(a2))
      }
      ctx.strokeStyle = 'rgba(127,255,212,0.4)'
      ctx.stroke()

      // Pulsation respirante
      const glow = Math.sin(Date.now() / 500) * 3 + 6
      ctx.shadowBlur = glow
      ctx.shadowColor = 'rgba(127,255,212,0.8)'
      ctx.stroke()

      // Émojis
      emojis.forEach((emoji, i) => {
        const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2
        const x = cx + radius * Math.cos(angle)
        const y = cy + radius * Math.sin(angle)
        ctx.font = '24px serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(emoji, x, y)
      })
    }

    const loop = () => {
      drawPentagram()
      requestAnimationFrame(loop)
    }
    loop()
  }, [emojis])

  // Positions fixes pour champs de souffle
  const positions = [
    { left: '50%', top: '24%' },
    { left: '74%', top: '46%' },
    { left: '63%', top: '76%' },
    { left: '37%', top: '76%' },
    { left: '26%', top: '46%' },
  ]

  return (
    <div style={{ position: 'relative', width: '280px', height: '280px', margin: 'auto' }}>
      <canvas
        ref={canvasRef}
        width="280"
        height="280"
        style={{
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,30,50,0.95), rgba(10,10,30,1))',
          boxShadow: '0 0 20px rgba(127,255,212,0.3)',
        }}
      />
      {positions.map((pos, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Souffle ${i + 1}`}
          value={texts[i] || ''}
          onChange={(e) => onTextChange(i, e.target.value)}
          style={{
            position: 'absolute',
            left: pos.left,
            top: pos.top,
            transform: 'translate(-50%, -50%)',
            width: '70px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(127,255,212,0.3)',
            borderRadius: '6px',
            color: '#bfe',
            fontSize: '0.7rem',
            textAlign: 'center',
            padding: '2px 4px',
          }}
        />
      ))}
    </div>
  )
}