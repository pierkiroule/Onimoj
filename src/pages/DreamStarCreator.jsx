import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

// 🧭 Fonction utilitaire : attribue un esprit selon l’étape 1-12
function getInuitSpirit(step) {
  const spirits = [
    { name: 'Sila', desc: 'Souffle du monde et respiration du ciel.' },
    { name: 'Sedna', desc: 'Gardienne des mers et des émotions profondes.' },
    { name: 'Tarqeq', desc: 'Lune blanche qui éclaire tes nuits.' },
    { name: 'Qailertetang', desc: 'Protectrice des glaces et des femmes.' },
    { name: 'Tekkeitsertok', desc: 'Chasseur intérieur, intuition et courage.' },
    { name: 'Pinga', desc: 'Guérisseuse des corps et des rêves.' },
    { name: 'Hila', desc: 'Souffle libre du vent qui relie les âmes.' },
    { name: 'Aningan', desc: 'Lune masculine, frère des cycles.' },
    { name: 'Nanook', desc: 'Ours polaire, calme et force tranquille.' },
    { name: 'Malina', desc: 'Soleil de clarté et de renouveau.' },
    { name: 'Nuliajuk', desc: 'Mère des animaux et gardienne des mémoires.' },
    { name: 'Quanik', desc: 'Neige du silence, repos et renaissance.' }
  ]
  return spirits[(step - 1) % spirits.length]
}

export default function DreamStarCreator({ step = 1 }) {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [emojis, setEmojis] = useState(['', '', '', '', ''])
  const [texts, setTexts] = useState(['', '', '', '', ''])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [spirit, setSpirit] = useState(null)
  const [echoMax, setEchoMax] = useState(6) // 🌱 nouveau : limite de ricochets

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    loadUser()
  }, [])

  async function saveDreamStar() {
    if (!user) return setStatus('⚠️ Connecte-toi avant de créer une étoile.')
    if (!title.trim()) return setStatus('🌠 Donne un titre à ton étoile.')

    setLoading(true)
    setStatus('✨ Création de ton étoile en cours...')

    try {
      const filledEmojis = emojis.filter(e => e.trim() !== '')
      const filledTexts = texts.filter(t => t.trim() !== '')

      // Enregistre dans Supabase
      const { error } = await supabase.from('dream_stars').insert([
        {
          creator_id: user.id,
          title,
          emojis: filledEmojis,
          texts: filledTexts,
          culture: 'Inuite',
          stage: filledEmojis.length,
          echo_max: echoMax, // 🌙 nouveau champ Ricochet
        },
      ])

      if (error) throw error

      const spiritData = getInuitSpirit(step)
      setSpirit(spiritData)

      setStatus(`✅ Ton étoile ${title} a éveillé ${spiritData.name} !`)
      setTitle('')
      setEmojis(['', '', '', '', ''])
      setTexts(['', '', '', '', ''])
      setEchoMax(6)
    } catch (err) {
      console.error(err)
      setStatus('❌ Erreur lors de la création : ' + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="fade-in" style={{ color: '#eee', textAlign: 'center', padding: '1rem' }}>
      <h2>🌟 Crée ton Étoile Onirique</h2>
      <p style={{ opacity: 0.8 }}>
        5 symboles, 5 souffles, 1 titre — tisse ton rêve pour nourrir la mission inuite.
      </p>

      <div style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
        Étape {step}/12 — l’esprit t’écoute...
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de ton étoile..."
        style={{
          marginTop: '1rem',
          padding: '0.6rem',
          width: '90%',
          borderRadius: '8px',
          border: '1px solid #666',
          background: '#111',
          color: '#eee',
          textAlign: 'center',
        }}
      />

      {/* 🪶 Champ Ricochets */}
      <div style={{ marginTop: '1rem' }}>
        <h4>💫 Nombre de ricochets avant métamorphose</h4>
        <input
          type="number"
          min="3"
          max="9"
          value={echoMax}
          onChange={(e) => setEchoMax(parseInt(e.target.value))}
          style={{
            width: '4rem',
            marginTop: '.3rem',
            padding: '.4rem',
            borderRadius: '6px',
            background: '#111',
            color: '#fff',
            border: '1px solid #666',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        />
        <p style={{ opacity: 0.6, fontSize: '.85rem' }}>
          (le nombre d’échos nécessaires avant que ton rêve devienne sagesse)
        </p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>✨ Émojis symboliques (jusqu’à 5)</h4>
        {emojis.map((emoji, i) => (
          <input
            key={i}
            type="text"
            maxLength={2}
            value={emoji}
            onChange={(e) => {
              const updated = [...emojis]
              updated[i] = e.target.value
              setEmojis(updated)
            }}
            placeholder={`Émoji ${i + 1}`}
            style={{
              width: '3rem',
              margin: '0.2rem',
              padding: '0.4rem',
              textAlign: 'center',
              borderRadius: '6px',
              background: '#111',
              color: '#fff',
              border: '1px solid #666',
              fontSize: '1.2rem',
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>💬 Textes courts (jusqu’à 5)</h4>
        {texts.map((text, i) => (
          <input
            key={i}
            type="text"
            value={text}
            onChange={(e) => {
              const updated = [...texts]
              updated[i] = e.target.value
              setTexts(updated)
            }}
            placeholder={`Texte ${i + 1}`}
            style={{
              width: '90%',
              margin: '0.2rem 0',
              padding: '0.4rem',
              borderRadius: '6px',
              background: '#111',
              color: '#eee',
              border: '1px solid #666',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          />
        ))}
      </div>

      <button
        onClick={saveDreamStar}
        disabled={loading}
        className="dream-button"
        style={{
          marginTop: '1rem',
          background: '#6eff8d',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
          fontWeight: 'bold',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? '🌬️ Création...' : '💫 Envoyer mon étoile'}
      </button>

      {status && (
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>
      )}

      {spirit && (
        <div
          className="fade-in"
          style={{
            marginTop: '1.5rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '1rem',
          }}
        >
          <h3>🕊️ {spirit.name}</h3>
          <p style={{ fontStyle: 'italic', opacity: 0.8 }}>{spirit.desc}</p>
        </div>
      )}
    </div>
  )
}