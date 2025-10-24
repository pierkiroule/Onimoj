import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import './Home.css'

export default function Profil({ user, onLogout, onNavigate }) {
  const [mission, setMission] = useState(null)
  const [bulles, setBulles] = useState([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const channelRef = useRef(null)

  // ✅ Canal de synchro local (EchoCreation <-> Profil)
  useEffect(() => {
    channelRef.current = new BroadcastChannel('sky-sync')
    return () => channelRef.current?.close()
  }, [])

  // Chargement initial
  useEffect(() => {
    if (user) {
      fetchMission(user.id)
      fetchBulles(user.id)
    }
  }, [user])

  // ---- Lecture mission active ----
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

  // ---- Lecture bulles actives ----
  async function fetchBulles(userId) {
    const { data, error } = await supabase
      .from('dream_stars')
      .select('id, title, emojis, culture, created_at, completed')
      .eq('creator_id', userId)
      .eq('completed', true)
      .order('created_at', { ascending: false })

    if (error) console.error('❌ Lecture bulles :', error.message)
    else setBulles(data || [])
  }

  // ✅ Retirer une bulle du ciel + synchro instantanée
  async function removeBulle(id) {
    if (!confirm('Retirer cette bulle du ciel ?')) return
    const { error } = await supabase.from('dream_stars').delete().eq('id', id)
    if (error) return setStatus('❌ Suppression impossible')

    setBulles(prev => prev.filter(b => b.id !== id))
    setStatus('🌀 Bulle retirée du ciel.')
    channelRef.current?.postMessage({ type: 'remove', id }) // synchro EchoCreation
  }

  // ---- Acheter mission ----
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

  // ---- Avancer mission ----
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

  function isMissionFinished(m) {
    return m.progress >= 12 || new Date(m.end_date) < new Date()
  }

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

  // ---- Rendu principal ----
  return (
    <div className="fade-in" style={{ padding: '1rem', color: '#eee', textAlign: 'center' }}>
      <h2>👤 Profil Onimoji</h2>

      {user ? (
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          {user.email ? <>🌕 {user.email}</> : <>🌀 ID : {user.id.slice(0, 8)}...</>}
        </p>
      ) : (
        <p>Chargement du profil...</p>
      )}

      {/* 🌍 Mission actuelle */}
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

      {/* 🌌 Bulles oniriques */}
      <h3 style={{ marginTop: '2rem' }}>🌕 Mes bulles en maturation</h3>
      <p style={{ fontSize: '0.9rem', opacity: 0.8, maxWidth: '80%', margin: '0 auto' }}>
        Ces bulles poursuivent leur maturation dans le ciel des Échos.  
        Tu peux les laisser vivre ou les retirer avant leur métamorphose.
      </p>

      {bulles.length > 0 ? (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {bulles.map((b) => (
            <div
              key={b.id}
              style={{
                background: 'radial-gradient(circle, #0a0f15, #000)',
                border: '1px solid #7fffd4',
                borderRadius: '12px',
                padding: '0.8rem',
                boxShadow: '0 0 12px rgba(127,255,212,0.2)',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            >
              <h4 style={{ color: '#7fffd4', marginBottom: '0.2rem' }}>{b.title}</h4>
              <p style={{ fontSize: '1.4rem' }}>{b.emojis?.join(' ')}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                {new Date(b.created_at).toLocaleDateString('fr-FR')}
              </p>
              <button
                onClick={() => removeBulle(b.id)}
                style={{
                  background: '#ff7070',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.3rem 0.8rem',
                  fontSize: '0.8rem',
                  marginTop: '0.4rem',
                }}
              >
                🌀 Retirer du ciel
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>Aucune bulle active pour l’instant.</p>
      )}

      <p style={{ marginTop: '1.2rem', opacity: 0.8 }}>{status}</p>

      <div style={{ opacity: 0.4, marginTop: '1rem' }}>
        <h4>🏜️ Mission Berbère — verrouillée 🔒</h4>
        <h4>🌳 Mission Celtique — verrouillée 🔒</h4>
      </div>

      {/* 🚪 Déconnexion */}
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

      {/* 🧪 Accès labo privé */}
      {user?.id === '2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97' && (
        <p
          onClick={() => onNavigate('labo-login')}
          style={{
            opacity: 0.4,
            fontSize: '0.8rem',
            marginTop: '1rem',
            cursor: 'pointer',
          }}
        >
          🧪 Accès Labo (privé)
        </p>
      )}

      <style>
        {`
        @keyframes pulse {
          0%,100%{box-shadow:0 0 8px rgba(127,255,212,0.1);}
          50%{box-shadow:0 0 18px rgba(127,255,212,0.4);}
        }
        `}
      </style>
    </div>
  )
}