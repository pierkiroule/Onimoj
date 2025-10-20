import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './HublotEtoileCadavre.css'

export default function HublotEtoileCadavre({ userId, step, mission, onComplete }) {
  const [emojis] = useState(['🌬️','❄️','🌊','🔥','🌕','🪶','🌿','💫','🪞','🌙'])
  const [bubbles, setBubbles] = useState([])
  const [selected, setSelected] = useState([])
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [prevTail, setPrevTail] = useState('')
  const [status, setStatus] = useState('')

  // 🌬️ Initialisation
  useEffect(() => {
    const arr = Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 10) * 2 * Math.PI
      const radius = 90 + Math.random() * 20
      const x = 120 + Math.cos(angle) * radius
      const y = 120 + Math.sin(angle) * radius
      return {
        id: crypto.randomUUID(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x, y,
        delay: Math.random() * 2,
        speed: 4 + Math.random() * 2
      }
    })
    setBubbles(arr)
  }, [])

  // 🎯 Sélection
  function catchEmoji(id) {
    if (selected.length >= 5) return
    const chosen = bubbles.find(b => b.id === id)
    if (!chosen) return
    setSelected(prev => [...prev, chosen.emoji])
    setBubbles(prev => prev.map(b => (b.id === id ? { ...b, caught: true } : b)))
  }

  // ✨ Envoi à Supabase
  async function sendStar() {
    if (selected.length < 5) return setStatus('⚠️ Choisis 5 symboles.')
    if (!text.trim()) return setStatus('💭 Écris ton souffle onirique.')

    const star = {
      creator_id: userId,
      title: title || step?.spirit_name || 'Étoile Inuite',
      emojis: selected,
      texts: [text],
      culture: 'Inuite'
    }

    const { data, error } = await supabase.from('dream_stars').insert([star]).select().single()
    if (error) return setStatus('❌ ' + error.message)

    setPrevTail(text.split(/\s+/).slice(-5).join(' '))
    setSelected([])
    setTitle('')
    setText('')
    setStatus('🌟 Étoile tissée et envoyée !')
    onComplete?.(data)
  }

  return (
    <div className="hublot-container">
      <div className="hublot">
        {bubbles.map(b => (
          <div
            key={b.id}
            className={`float-emoji ${b.caught ? 'caught' : ''}`}
            style={{
              left: b.x,
              top: b.y,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.speed}s`
            }}
            onClick={() => catchEmoji(b.id)}
          >
            {b.emoji}
          </div>
        ))}
      </div>

      {/* sélection */}
      <div style={{ fontSize: '1.8rem', letterSpacing: '0.2rem' }}>
        {selected.map((e, i) => <span key={i}>{e}</span>)}
      </div>
      <p style={{ opacity: 0.8 }}>
        {selected.length < 5 ? 'Attrape 5 symboles du rêve…' : '✨ Ton étoile est prête à tisser.'}
      </p>

      {/* texte cadavre exquis */}
      {prevTail && (
        <p style={{ opacity: 0.6, fontStyle: 'italic' }}>…{prevTail}</p>
      )}
      <input
        type="text"
        placeholder="Titre de ton étoile"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Écris la suite du rêve..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={sendStar} disabled={selected.length < 5}>
        💫 Tisser l’étoile
      </button>
      {status && <p style={{ marginTop: '0.4rem', opacity: 0.8 }}>{status}</p>}
    </div>
  )
}