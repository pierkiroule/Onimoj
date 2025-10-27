import { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('⏳ Connexion au cosmos...')

    try {
      let result

      if (mode === 'signup') {
        result = await supabase.auth.signUp({ email, password })
      } else if (mode === 'signin') {
        result = await supabase.auth.signInWithPassword({ email, password })
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setStatus('📩 Lien de réinitialisation envoyé à ton adresse e-mail.')
        return
      }

      if (result.error) throw result.error

      // ✅ Connexion réussie
      setStatus('✅ Connecté au champ de rêves !')
      onAuth(result.data.session)

    } catch (err) {
      setStatus('❌ ' + err.message)
    }
  }

  // 🌙 Titre dynamique
  const titles = {
    signin: '🌙 Connecte-toi à ton espace onirique',
    signup: '✨ Crée ton compte onirique',
    reset: '🔑 Réinitialise ton mot de passe',
  }

  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1.5rem' }}>
      <h3>{titles[mode]}</h3>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="email"
          placeholder="Email onirique..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.6rem',
            margin: '0.3rem',
            borderRadius: '8px',
            width: '80%',
            border: 'none',
          }}
        />

        {mode !== 'reset' && (
          <input
            type="password"
            placeholder="Mot de passe secret..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '0.6rem',
              margin: '0.3rem',
              borderRadius: '8px',
              width: '80%',
              border: 'none',
            }}
          />
        )}

        <button
          type="submit"
          className="dream-button"
          style={{
            marginTop: '0.8rem',
            background: '#6eff8d',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
          }}
        >
          {mode === 'signup'
            ? 'Créer un compte'
            : mode === 'signin'
            ? 'Connexion'
            : 'Envoyer le lien'}
        </button>
      </form>

      {/* 🔁 Changement de mode */}
      <div style={{ marginTop: '1rem', opacity: 0.8 }}>
        {mode === 'signup' && (
          <p onClick={() => setMode('signin')} style={{ cursor: 'pointer' }}>
            🌀 Déjà inscrit ? Connecte-toi
          </p>
        )}
        {mode === 'signin' && (
          <>
            <p onClick={() => setMode('signup')} style={{ cursor: 'pointer' }}>
              🌱 Nouveau voyageur ? Crée ton compte
            </p>
            <p onClick={() => setMode('reset')} style={{ cursor: 'pointer', fontSize: '0.9rem', opacity: 0.6 }}>
              🔑 Mot de passe oublié ?
            </p>
          </>
        )}
        {mode === 'reset' && (
          <p onClick={() => setMode('signin')} style={{ cursor: 'pointer' }}>
            🌙 Retour à la connexion
          </p>
        )}
      </div>

      <p style={{ fontSize: '0.9rem', marginTop: '0.8rem', opacity: 0.7 }}>{status}</p>
    </div>
  )
}