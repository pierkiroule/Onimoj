import { useState } from 'react'
import { supabase } from '../supabaseClient'
import '../App.css'

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [status, setStatus] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('⏳ Connexion au cosmos...')

    try {
      let result
      if (mode === 'signup') {
        result = await supabase.auth.signUp({ email, password })
      } else {
        result = await supabase.auth.signInWithPassword({ email, password })
      }

      if (result.error) throw result.error
      setStatus('✅ Connecté !')
      onAuth(result.data.user)
    } catch (err) {
      setStatus('❌ ' + err.message)
    }
  }

  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1.5rem' }}>
      
      <h3>{mode === 'signup' ? '✨ Crée ton compte onirique' : '🌙 Connecte-toi à ton espace'}</h3>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="email"
          placeholder="Email onirique..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '0.5rem', margin: '0.3rem', borderRadius: '8px', width: '80%' }}
        />
        <input
          type="password"
          placeholder="Mot de passe secret..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.5rem', margin: '0.3rem', borderRadius: '8px', width: '80%' }}
        />
        <button
          type="submit"
          className="dream-button"
          style={{ marginTop: '0.8rem', background: '#6eff8d', border: 'none', borderRadius: '8px', padding: '0.6rem 1.2rem' }}
        >
          {mode === 'signup' ? 'Créer un compte' : 'Connexion'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', opacity: 0.8, cursor: 'pointer' }}
        onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
        {mode === 'signup'
          ? '🌀 Déjà inscrit ? Connecte-toi'
          : '🌱 Nouveau voyageur ? Crée ton compte'}
      </p>

      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>{status}</p>
    </div>
  )
}