import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil({ userId }) {
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState('')
  const [missions, setMissions] = useState([])

  // 🔹 Charge missions de l’utilisateur
  useEffect(() => {
    if (!userId) return
    fetchMissions()
  }, [userId, fetchMissions])

  const fetchMissions = useCallback(async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) setStatus('❌ Erreur de lecture : ' + error.message)
    else setMissions(data)
  }, [userId])

  async function saveProfile() {
    if (!username) return setStatus('⚠️ Entre un nom onirique.')
    const { error } = await supabase.from('profiles').upsert([{ id: userId, username }])
    if (error) setStatus('❌ Erreur : ' + error.message)
    else setStatus('✅ Profil sauvegardé.')
  }

  return (
    <div className="fade-in" style={{ padding: '1rem', textAlign: 'center', color: '#eee' }}>
      <h2>👤 Profil Onimoji</h2>
      <p style={{ opacity: 0.7 }}>
        ID utilisateur : <code>{userId ? userId.slice(0, 8) : 'chargement...'}</code>
      </p>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Ton pseudo onirique..."
        style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '8px', width: '90%' }}
      />
      <button
        onClick={saveProfile}
        style={{
          marginTop: '0.5rem',
          background: '#444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.6rem 1.2rem',
        }}
      >
        💾 Sauvegarder
      </button>

      <p style={{ marginTop: '0.8rem', opacity: 0.8 }}>{status}</p>

      <h3 style={{ marginTop: '1.5rem' }}>🪶 Missions</h3>
      {missions.length === 0 ? (
        <p style={{ opacity: 0.6 }}>Aucune mission enregistrée.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {missions.map((m) => (
            <li key={m.id} style={{ margin: '0.5rem 0' }}>
              🌍 <strong>{m.culture}</strong> — Étape {m.progress}/12
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}