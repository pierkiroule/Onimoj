import { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

export default function Donner({ userId }) {
  const [message, setMessage] = useState('')
  const [hint, setHint] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const inspirations = [
    '🌬️ Un souffle traverse la nuit et apaise les cœurs.',
    '🌙 La lune confie ses secrets à qui sait écouter.',
    '🌊 Chaque vague porte un rêve à partager.',
    '🌳 Un arbre ancien veille sur tes songes.',
    '🔥 Une braise d’espoir dans le froid des étoiles.',
  ]

  async function handleSend() {
    if (message.trim() === '') {
      setHint('⚠️ Écris d’abord un message onirique.')
      return
    }

    setSending(true)
    setHint('⏳ Envoi en cours...')

    try {
      let effectiveUserId = userId
      if (!effectiveUserId) {
        const { data, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        effectiveUserId = data?.user?.id || null
      }

      if (!effectiveUserId) {
        setHint('⚠️ Connecte-toi avant d’offrir un rêve.')
        return
      }

      const { error } = await supabase.from('offrandes_oniriques').insert([
        {
          user_id: effectiveUserId,
          message: message.trim(),
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      setSent(true)
      setHint(inspirations[Math.floor(Math.random() * inspirations.length)])

      setTimeout(() => {
        setMessage('')
        setSent(false)
        setHint('')
      }, 2800)
    } catch (err) {
      console.error('❌ Erreur handleSend :', err)
      setHint('❌ Erreur : offrande non envoyée.')
    } finally {
      setSending(false)
    }
  }

  const remaining = 240 - message.length

  return (
    <div className="fade-in" style={{ padding: '1.2rem', textAlign: 'center', color: '#eee' }}>
      <h2>💫 Donner</h2>
      <p className="subtitle" style={{ opacity: 0.8 }}>
        Offre une parole, un rêve, une image pour quelqu’un qui en a besoin.
      </p>

      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '1rem',
          marginTop: '1rem',
        }}
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 240))}
          placeholder="Écris ici ton offrande onirique..."
          rows={5}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            padding: '0.8rem',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', opacity: 0.7 }}>
          <span>{hint}</span>
          <span>{remaining} caractères</span>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={sending || message.trim() === ''}
        className="dream-button"
        style={{
          marginTop: '1rem',
          background: '#bfe',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
          fontWeight: 'bold',
          opacity: sending ? 0.6 : 1,
        }}
        aria-busy={sending}
      >
        {sending ? '🚀 Envoi...' : sent ? '🌟 Envoyé' : '✨ Offrir au cosmos'}
      </button>
    </div>
  )
}