import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setStatus('⚠️ Connecte-toi pour accéder à ton profil.')
      setUser(user)
      fetchMission(user.id)
    }
    loadUser()
  }, [])

  async function fetchMission(userId) {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .eq('culture', 'Inuite')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error(error.message)
      setStatus('❌ Erreur lecture mission')
    } else {
      setMission(data)
    }
  }

  async function startMission() {
    if (!user) return
    if (mission) return setStatus('⚠️ Mission déjà en cours.')

    setLoading(true)
    const { error } = await supabase.from('missions').insert([
      { user_id: user.id, culture: 'Inuite', current_step: 1, status: 'active' }
    ])

    if (error) setStatus('❌ Erreur : ' + error.message)
    else {
      setStatus('✅ Mission Inuite lancée !')
      fetchMission(user.id)
    }
    setLoading(false)
  }

  const renderBadges = (step) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: i < step ? '#6eff8d' : '#333',
          }}
        ></div>
      ))}
    </div>
  )

  return (
    <div className="fade-in" style={{ padding: '1rem', textAlign: 'center', color: '#eee' }}>
      <h2>👤 Mon Profil Onimoji</h2>
      {mission ? (
        <>
          <h3>❄️ Mission Inuite</h3>
          <p>Étape {mission.current_step}/12</p>
          {renderBadges(mission.current_step)}
        </>
      ) : (
        <>
          <p>Aucune mission active.</p>
          <button
            onClick={startMission}
            disabled={loading}
            className="dream-button"
          >
            {loading ? '💫...' : '💳 Démarrer la Mission Inuite'}
          </button>
        </>
      )}
      <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>
    </div>
  )
}