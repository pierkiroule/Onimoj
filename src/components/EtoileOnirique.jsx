import { useState, useEffect } from 'react'

export default function EtoileOnirique({ user, mission, step }) {
  const [emojis, setEmojis] = useState(['🔥', '❄️', '🌬️', '🌕', '🌊'])
  const [texts, setTexts] = useState(['', '', '', '', ''])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')

  // Positionne les 5 points du pentagramme
  const positions = [
    { x: 50, y: 5 },
    { x: 95, y: 38 },
    { x: 77, y: 90 },
    { x: 23, y: 90 },
    { x: 5, y: 38 }
  ]

  // Animation simple : rotation lente du pentagramme
  useEffect(() => {
    const star = document.getElementById('star-field')
    let angle = 0
    const anim = setInterval(() => {
      if (star) star.style.transform = `rotate(${angle}deg)`
      angle += 0.1
    }, 50)
    return () => clearInterval(anim)
  }, [])

  async function handleSubmit() {
    if (!title.trim()) return setStatus('⚠️ Donne un titre à ton étoile.')

    // (Optionnel) enregistre dans Supabase
    try {
      const { error } = await supabase.from('dream_stars').insert([
        {
          creator_id: user?.id || null,
          title,
          emojis,
          texts,
          culture: mission?.culture || 'Inuite',
        },
      ])
      if (error) throw error
      setStatus('🌟 Ton étoile a été envoyée dans le ciel onirique !')
    } catch (err) {
      console.error(err)
      setStatus('❌ Erreur lors de la création de ton étoile.')
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>🌟 Crée ton Étoile Onirique</h3>
      <p style={{ opacity: 0.8 }}>
        5 symboles, 5 souffles, 1 titre — tisse ton rêve.
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de ton étoile..."
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          borderRadius: '8px',
          width: '80%',
          textAlign: 'center',
        }}
      />

      {/* 💫 Etoile visuelle */}
      <div
        id="star-field"
        style={{
          position: 'relative',
          margin: '2rem auto',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.05), transparent 70%)',
          animation: 'float 10s infinite ease-in-out',
        }}
      >
        {/* Lignes de l’étoile */}
        <svg
          viewBox="0 0 100 100"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <polygon
            points="50,5 95,38 77,90 23,90 5,38"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <polygon
            points="50,5 77,90 5,38 95,38 23,90"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />
        </svg>

        {positions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: '1.8rem',
              transition: 'transform 0.3s ease',
            }}
          >
            {emojis[i]}
          </div>
        ))}
      </div>

      {/* 🫧 Souffles */}
      <div style={{ display: 'grid', gap: '0.4rem', width: '80%', margin: 'auto' }}>
        {texts.map((t, i) => (
          <input
            key={i}
            value={t}
            onChange={(e) => {
              const arr = [...texts]
              arr[i] = e.target.value
              setTexts(arr)
            }}
            placeholder={`Souffle ${i + 1}`}
            style={{
              padding: '0.4rem',
              borderRadius: '6px',
              textAlign: 'center',
            }}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: '1rem',
          background: '#6eff8d',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
          fontWeight: 'bold',
        }}
      >
        💫 Envoyer mon étoile
      </button>

      <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>
    </div>
  )
}