import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil() {
  const [username, setUsername] = useState('')
  const [culture, setCulture] = useState('')
  const [status, setStatus] = useState('')
  const [profiles, setProfiles] = useState([])

  async function fetchProfiles() {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (error) setStatus('❌ Erreur de lecture : ' + error.message)
    else setProfiles(data)
  }

  async function saveProfile() {
    if (!username) return setStatus('⚠️ Entre au moins un nom.')
    const { error } = await supabase.from('profiles').insert([{ username, culture }])
    if (error) setStatus('❌ Erreur de sauvegarde : ' + error.message)
    else {
      setStatus('✅ Profil enregistré !')
      setUsername('')
      setCulture('')
      fetchProfiles()
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  return (
    <div className="fade-in" style={{ padding: '1rem', color: '#eee', textAlign: 'center' }}>
      <h2>👤 Mon Profil Onimoji</h2>
      <p>Crée ton profil onirique pour tisser ta mission culturelle.</p>

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