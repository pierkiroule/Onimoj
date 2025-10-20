import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './HublotEtoileCadavre.css'

export default function HublotEtoileCadavre({ userId, step, mission, onComplete }) {
  const [caught, setCaught] = useState([])
  const [available, setAvailable] = useState(['🌬️','❄️','🌊','🔥','🌕','🌿','🪶','🪷','💨','✨'])
  const [text, setText] = useState('')
  const [partial, setPartial] = useState('')
  const [title, setTitle] = useState('')
  const [phase, setPhase] = useState('catch')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setAvailable([...available].sort(() => 0.5 - Math.random()))
  }, [])

  const handleCatch = (emoji) => {
    if (caught.includes(emoji) || caught.length >= 5) return
    const newCaught = [...caught, emoji]
    setCaught(newCaught)
    if (newCaught.length === 5) {
      setTimeout(() => setPhase('network'), 400)
      setTimeout(() => setPhase('write'), 2800)
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setText(val)
    const words = val.split(/\s+/)
    setPartial(words.slice(-5).join(' '))
  }

  const handleSubmit = async () => {
    if (!title || caught.length < 5 || !text.trim()) return alert('Complète ton étoile 🌟')

    const { error } = await supabase.from('dream_stars').insert([
      {
        creator_id: userId,
        culture: 'Inuite',
        spirit: step.spirit_name,
        emojis: caught,
        story: text,
        last_words: partial,
        title,
      },
    ])

    if (error) console.error(error)
    else {
      setShowModal(true)
      if (onComplete) setTimeout(onComplete, 2500)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      {phase === 'catch' && (
        <>
          <p style={{ opacity: 0.8 }}>Attrape 5 émojis dans le hublot ✋</p>
          <div className="hublot">
            {available.map((emoji, i) => {
              const angle = (i / available.length) * 2 * Math.PI
              const radius = 90 + Math.sin(Date.now() / 1000 + i) * 5
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <div
                  key={i}
                  className="float-emoji"
                  onClick={() => handleCatch(emoji)}
                  style={{
                    left: `calc(50% + ${x}px - 14px)`,
                    top: `calc(50% + ${y}px - 14px)`,
                    filter: caught.includes(emoji) ? 'brightness(0.4)' : 'none',
                    transform: caught.includes(emoji) ? 'scale(0.8)' : 'scale(1)',
                  }}
                >
                  {emoji}
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '1rem' }}>{caught.join(' ')}</p>
        </>
      )}

      {phase === 'network' && (
        <div className="network">
          <p>Les symboles s’alignent... ton étoile se tisse 🌟</p>
          <svg width="260" height="260">
            <polygon points="130,30 210,100 170,230 90,230 50,100"
              fill="none" stroke="rgba(110,255,141,0.4)" strokeWidth="2" />
            <polyline points="130,30 170,230 50,100 210,100 90,230 130,30"
              fill="none" stroke="rgba(53,160,255,0.7)"
              style={{ filter: 'drop-shadow(0 0 6px #6eff8d)' }} />
          </svg>
          {caught.map((emoji, i) => {
            const p = [[130,30],[210,100],[170,230],[90,230],[50,100]][i]
            return <div key={i} className="node" style={{ left: p[0]-14, top:p[1]-14 }}>{emoji}</div>
          })}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="particle" style={{
              width: `${Math.random()*6+2}px`,
              height: `${Math.random()*6+2}px`,
              top: `${Math.random()*240}px`,
              left: `${Math.random()*240}px`,
              animationDelay: `${i*0.5}s`,
            }}/>
          ))}
        </div>
      )}

      {phase === 'write' && (
        <>
          <p>🪶 Continue le rêve... seuls les 5 derniers mots seront visibles</p>
          <textarea
            rows="4"
            value={text}
            onChange={handleChange}
            placeholder="Écris ton fragment poétique..."
          />
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Derniers mots : <em>{partial}</em>
          </p>
          <button onClick={() => setPhase('title')}>💫 Donner un titre</button>
        </>
      )}

      {phase === 'title' && (
        <>
          <p>🌟 Nomme ton étoile onirique</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de ton étoile..."
          />
          <button onClick={handleSubmit}>🚀 Envoyer dans le cosmos</button>
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="emoji">🌠</div>
          <h2>Ton étoile s’élève...</h2>
          <p>L’esprit <strong>{step.spirit_name}</strong> murmure :  
          <em>“{step.symbol} {step.myth || 'Le souffle du monde t’accompagne.'}”</em></p>
          <button onClick={() => setShowModal(false)}>✨ Fermer</button>
        </div>
      )}
    </div>
  )
}