import { useState } from 'react'
import { supabase } from '../supabaseClient'

const inspirations = [
  '✨ Ton rêve voyage dans l\'univers...',
  '🌙 Merci pour cette offrande onirique',
  '💫 Ton étoile rejoint la constellation',
  '🌠 Un nouveau rêve naît dans le cosmos'
]

export default function Donner() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [hint, setHint] = useState('')

  const handleSend = async () => {
    if (message.trim() === '') return

    try {
      // 🔐 Récupération sécurisée de l'utilisateur
      const { data, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const user = data?.user
      if (!user) {
        setHint('⚠️ Connecte-toi avant d\'offrir un rêve.')
        return
      }

      // 💾 Enregistrement de l'offrande
      const { error } = await supabase.from('offrandes_oniriques').insert([
        {
          user_id: user.id,
          message,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      // ✨ Feedback visuel
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
    }
  }

  return (
    <div className="fade-in" style={{ padding: '1rem', textAlign: 'center', color: '#eee' }}>
      <h2>💫 Offrir un rêve</h2>
      <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
        Partage ton rêve avec la communauté onirique
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écris ton rêve ici..."
        style={{
          width: '90%',
          height: '120px',
          padding: '0.8rem',
          borderRadius: '8px',
          border: '1px solid #555',
          background: '#333',
          color: '#fff',
          resize: 'vertical',
          marginBottom: '1rem'
        }}
      />

      <button
        onClick={handleSend}
        disabled={sent || !message.trim()}
        style={{
          background: sent ? '#4a4' : '#666',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.8rem 1.5rem',
          cursor: sent ? 'not-allowed' : 'pointer',
          opacity: sent ? 0.7 : 1
        }}
      >
        {sent ? '✨ Envoyé !' : '🌠 Envoyer le rêve'}
      </button>

      {hint && (
        <p style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
          {hint}
        </p>
      )}
    </div>
  )
}
