import { useState, useEffect } from 'react'
function AutoAdvance({ delay, onAdvance }) {
  useEffect(() => {
    const t = setTimeout(() => onAdvance && onAdvance(), delay)
    return () => clearTimeout(t)
  }, [delay, onAdvance])
  return null
}
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
  const [skipped, setSkipped] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    setAvailable([...available].sort(() => 0.5 - Math.random()))
  }, [])

  const handleCatch = (emoji) => {
    if (caught.includes(emoji) || caught.length >= 5) return
    const newCaught = [...caught, emoji]
    setCaught(newCaught)
    if (newCaught.length === 5) {
      setSkipped(false)
      setReplayKey((k) => k + 1)
      setPhase('network')
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

  // Prompts contextuels "Je sèche"
  useEffect(() => {
    const spirit = step?.spirit_name || 'Esprit'
    const base = {
      Sila: [
        'Écris un souffle qui apaise.',
        'Décris un silence qui respire.',
        'Un mot pour le vent intérieur.'
      ],
      Sedna: [
        'Un souvenir lié à l’eau.',
        'Nomme une émotion profonde.',
        'Une perle au fond de la mer.'
      ],
    }
    const generic = [
      'Commence par “Ce soir,” et laisse venir.',
      'Trois mots pour tracer un horizon.',
      'Ferme les yeux, écris le premier reflet.'
    ]
    setPrompts(base[spirit] || generic)
  }, [step?.spirit_name])

  // Autosave brouillon local par étape
  useEffect(() => {
    const key = `inuite:${mission?.id}:${step?.step_number}`
    // restore
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null')
      if (saved) {
        setCaught(saved.caught || [])
        setText(saved.text || '')
        setTitle(saved.title || '')
      }
    } catch {}
    const interval = setInterval(() => {
      if (!mission || !step) return
      const data = { caught, text, title }
      try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
    }, 1500)
    return () => clearInterval(interval)
  }, [mission?.id, step?.step_number, caught, text, title])

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
        <div key={replayKey} className="network" aria-live="polite">
          <p>Les symboles s’alignent... ton étoile se tisse 🌟</p>
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '0.6rem' }}>
            <button className="dream-button" style={{ padding: '0.4rem 0.8rem' }} onClick={() => { setSkipped(true); setPhase('write') }}>⏩ Passer</button>
            <button className="dream-button" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setReplayKey((k) => k + 1)}>🔁 Rejouer</button>
          </div>
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
          {/* Transition automatique douce après 2.2s si non skippé */}
          {!skipped && (
            <AutoAdvance delay={2200} onAdvance={() => setPhase('write')} />
          )}
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
          {prompts.length > 0 && (
            <div style={{ margin: '0.6rem 0' }}>
              <button
                className="dream-button"
                style={{ padding: '0.4rem 0.8rem' }}
                onClick={() => setText((t) => (t ? t + ' ' : '') + prompts[Math.floor(Math.random()*prompts.length)])}
              >
                🤔 Je sèche
              </button>
            </div>
          )}
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
          <button onClick={handleSubmit} disabled={!(caught.length === 5 && text.trim() && title.trim())}>🚀 Envoyer dans le cosmos</button>
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