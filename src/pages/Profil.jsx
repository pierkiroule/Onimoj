import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil() {
  const [username, setUsername] = useState('')
  const [culture, setCulture] = useState('')
  const [status, setStatus] = useState('')
  const [profiles, setProfiles] = useState([])
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user ?? null)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      sub.subscription?.unsubscribe?.()
    }
  }, [])

  async function fetchProfiles(currentUser) {
    setStatus('')
    try {
      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
        if (error) throw error
        setProfiles(data)
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        setProfiles(data)
      }
    } catch (e) {
      // Si la colonne user_id n'existe pas encore, fallback sans filtre
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setStatus('❌ Erreur de lecture : ' + error.message)
      else setProfiles(data)
    }
  }

  async function saveProfile() {
    if (!username) return setStatus('⚠️ Entre au moins un nom.')
    try {
      const row = user ? { username, culture, user_id: user.id } : { username, culture }
      const { error } = await supabase.from('profiles').insert([row])
      if (error) throw error
      setStatus('✅ Profil enregistré !')
      setUsername('')
      setCulture('')
      fetchProfiles(user)
    } catch (e) {
      // Tentative sans user_id si la colonne n'existe pas
      const { error } = await supabase.from('profiles').insert([{ username, culture }])
      if (error) setStatus('❌ Erreur de sauvegarde : ' + error.message)
      else {
        setStatus('✅ Profil enregistré !')
        setUsername('')
        setCulture('')
        fetchProfiles(user)
      }
    }
  }

  async function sendMagicLink() {
    if (!email) return setStatus('⚠️ Entre une adresse email valide.')
    setStatus('✉️ Envoi du lien magique...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/profil`,
      },
    })
    if (error) setStatus('❌ Erreur d’envoi : ' + error.message)
    else setStatus('✅ Lien envoyé, vérifie ton email !')
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    fetchProfiles(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="fade-in" style={{ padding: '1rem', color: '#eee', textAlign: 'center' }}>
      <h2>👤 Mon Profil Onimoji</h2>
      <p>Crée ton profil onirique pour tisser ta mission culturelle.</p>

      {!user && (
        <div style={{ marginTop: '1rem' }}>
          <h3>🔐 Connexion</h3>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', width: '90%' }}
          />
          <button
            onClick={sendMagicLink}
            style={{
              marginTop: '0.6rem',
              background: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
            }}
          >
            ✉️ Recevoir un lien magique
          </button>
        </div>
      )}

      {user && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ opacity: 0.8 }}>Connecté en tant que {user.email}</p>
          <button
            onClick={signOut}
            style={{
              marginTop: '0.6rem',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
            }}
          >
            🚪 Se déconnecter
          </button>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Ton pseudo onirique..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '8px', width: '90%' }}
        />

        <input
          type="text"
          placeholder="Culture choisie (Inuite, Berbère, Celtique...)"
          value={culture}
          onChange={(e) => setCulture(e.target.value)}
          style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '8px', width: '90%' }}
        />

        <button
          onClick={saveProfile}
          style={{
            marginTop: '1rem',
            background: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
          }}
        >
          💾 Enregistrer
        </button>
      </div>

      <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>

      <h3 style={{ marginTop: '2rem' }}>📜 Profils enregistrés :</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {profiles.map((p) => (
          <li key={p.id} style={{ margin: '0.5rem 0' }}>
            🌟 <strong>{p.username}</strong> — {p.culture || 'non précisée'}
          </li>
        ))}
      </ul>
    </div>
  )
}