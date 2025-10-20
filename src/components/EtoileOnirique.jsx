import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function EtoileOnirique({ user, mission, step }) {
  const [title, setTitle] = useState('')
  const [emojis, setEmojis] = useState(['', '', '', '', ''])
  const [texts, setTexts] = useState(['', '', '', '', ''])
  const [status, setStatus] = useState('')

  async function handleSubmit() {
    if (!title.trim()) return setStatus('⚠️ Donne un titre à ton étoile.')
    setStatus('💫 Tissage en cours...')

    const { error } = await supabase.from('dream_stars').insert([
      {
        creator_id: user.id,
        title,
        emojis,
        texts,
        culture: mission.culture,
      },
    ])

    if (error) {
      console.error(error)
      return setStatus('❌ Erreur : ' + error.message)
    }

    // Avancer la mission
    const newStep = mission.current_step + 1
    await supabase
      .from('missions')
      .update({ current_step: newStep })
      .eq('id', mission.id)

    setStatus('✅ Étoile tissée et envoyée aux Esprits !')
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h4>🌟 Crée ton Étoile Onirique</h4>
      <input
        placeholder="Titre de ton étoile..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          margin: '0.5rem',
          padding: '0.5rem',
          borderRadius: '6px',
          width: '90%',
        }}
      />
      <p>🔥❄️🌬️🌕🌊</p>

      {emojis.map((v, i) => (
        <input
          key={i}
          placeholder={`Émoji ${i + 1}`}
          value={v}
          onChange={(e) =>
            setEmojis(emojis.map((x, j) => (j === i ? e.target.value : x)))
          }
          style={{ margin: '0.2rem', padding: '0.4rem', borderRadius: '6px' }}
        />
      ))}

      {texts.map((v, i) => (
        <input
          key={i}
          placeholder={`Souffle ${i + 1}`}
          value={v}
          onChange={(e) =>
            setTexts(texts.map((x, j) => (j === i ? e.target.value : x)))
          }
          style={{ margin: '0.2rem', padding: '0.4rem', borderRadius: '6px' }}
        />
      ))}

      <button
        onClick={handleSubmit}
        className="dream-button"
        style={{ marginTop: '0.5rem' }}
      >
        💫 Envoyer mon étoile
      </button>

      <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>{status}</p>
    </div>
  )
}