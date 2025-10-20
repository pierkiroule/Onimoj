import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil({ user, onLogout }) {
  const [mission, setMission] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) fetchMission(user.id)
  }, [user])

  // 🔍 Charge la mission active
  async function fetchMission(userId) {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Lecture mission :', error.message)
      setStatus('Erreur lecture mission')
    } else setMission(data || null)
  }

  // 💳 Simulation d’achat mission
  async function buyMission(culture) {
    if (!user) return setStatus('⚠️ Non connecté.')
    if (mission && !isMissionFinished(mission))
      return setStatus('⚠️ Termine ta mission actuelle.')

    setLoading(true)
    setStatus('💳 Paiement cosmique en cours...')

    setTimeout(async () => {
      const startDate = new Date().toISOString()
      const endDate = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase.from('missions').insert([
        {
          user_id: user.id,
          culture,
          start_date: startDate,
          end_date: endDate,
          price: 1.8,
          status: 'active',
          progress: 0,
          current_step: 1,
        },
      ])

      if (error) {
        console.error('❌ Erreur mission :', error.message)
        setStatus('Erreur mission')
      } else {
        setStatus(`✅ Mission ${culture} activée !`)
        fetchMission(user.id)
      }
      setLoading(false)
    }, 1500)
  }

  // 🌟 Étape suivante
  async function nextStep() {
    if (!mission || isMissionFinished(mission)) return
    const newProgress = Math.min(mission.progress + 1, 12)
    const newStatus = newProgress === 12 ? 'completed' : 'active'

    const { error } = await supabase
      .from('missions')
      .update({ progress: newProgress, status: newStatus })
      .eq('id', mission.id)

    if (error) setStatus('❌ Erreur progression')
    else {
      setStatus(`🌟 Étape ${newProgress}/12 atteinte !`)
      fetchMission(user.id)
    }
  }

  // 🧮 Vérifie si mission terminée
  function isMissionFinished(m) {
    return m.progress >= 12 || new Date(m.end_date) < new Date()
  }

  // 🎨 Badges progression
  const renderBadges = (progress) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: i < progress ? '#6eff8d' : '#333',
            border: '1px solid #777',
          }}
        ></div>
      ))}
    </div>
  )

  // ✨ Interface
  return (
    <div className="fade-in" style={{ padding: '1rem', color: '#eee', textAlign: 'center' }}>
      <h2>👤 Profil Onimoji</h2>

      {user ? (
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          {user.email ? (
            <>🌕 {user.email}</>
          ) : (
            <>🌀 ID : {user.id.slice(0, 8)}...</>
          )}
        </p>
      ) : (
        <p>Chargement du profil...</p>
      )}

      <h3 style={{ marginTop: '1.5rem' }}>🌍 Mission actuelle</h3>

      {mission && !isMissionFinished(mission) ? (
        <div
          style={{
            background: '#223',
            borderRadius: '10px',
            padding: '1rem',
            width: '90%',
            margin: '1rem auto',
            boxShadow: '0 0 10px rgba(255,255,255,0.1)',
          }}
        >
          <h4>❄️ Mission Inuite</h4>
          <p>Étape {mission.progress}/12</p>
          {renderBadges(mission.progress)}

          <button
            onClick={nextStep}
            disabled={loading || mission.progress >= 12}
            style={{
              background: '#6eff8d',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              marginTop: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            🌟 Étape suivante
          </button>
        </div>
      ) : (
        <>
          <p>Aucune mission active.</p>
          <button
            disabled={loading}
            onClick={() => buyMission('Inuite')}
            style={{
              background: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
            }}
          >
            {loading ? '💫 Paiement...' : '💳 Démarrer la Mission Inuite'}
          </button>
        </>
      )}

      <div style={{ opacity: 0.4, marginTop: '1rem' }}>
        <h4>🏜️ Mission Berbère — verrouillée 🔒</h4>
        <h4>🌳 Mission Celtique — verrouillée 🔒</h4>
      </div>

      <p style={{ marginTop: '1rem', opacity: 0.8 }}>{status}</p>

      <button
        onClick={onLogout}
        style={{
          marginTop: '2rem',
          background: '#ff6b6b',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          color: '#fff',
          fontWeight: 'bold',
        }}
      >
        🚪 Se déconnecter
      </button>
    </div>
  )
}