import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import DreamStarCreator from './DreamStarCreator'
import '../App.css'

export default function MissionInuite() {
  const [mission, setMission] = useState(null)
  const [step, setStep] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [showCreator, setShowCreator] = useState(false)

  useEffect(() => {
    async function loadMission() {
      try {
        setLoading(true)
        setStatus('🌌 Connexion à la mission en cours...')

        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        if (userErr || !user) {
          setStatus('⚠️ Aucun utilisateur connecté.')
          setLoading(false)
          return
        }

        // 🔍 Récupération mission active
        const { data: missionData, error: missionErr } = await supabase
          .from('missions')
          .select('*')
          .eq('user_id', user.id)
          .eq('culture', 'Inuite')
          .single()

        if (missionErr || !missionData) {
          console.warn('Mission non trouvée :', missionErr?.message)
          setStatus('🌙 Lance d’abord ta mission Inuite depuis ton profil.')
          setLoading(false)
          return
        }

        setMission(missionData)

        // 🔮 Récupération de l’étape actuelle
        const { data: stepData, error: stepErr } = await supabase
          .from('mission_steps_inuite')
          .select('*')
          .eq('step_number', missionData.current_step || 1)
          .maybeSingle()

        if (stepErr) {
          console.error('Erreur lecture étape :', stepErr.message)
          setStatus('⚠️ Erreur lors du chargement des étapes.')
        } else if (!stepData) {
          setStatus('❄️ Étape non trouvée. Vérifie la table mission_steps_inuite.')
        } else {
          setStep(stepData)
          setStatus('')
        }
      } catch (err) {
        console.error('🔥 Erreur inattendue MissionInuite:', err)
        setStatus('⚠️ Problème inattendu, vérifie ta connexion ou Supabase.')
      } finally {
        setLoading(false)
      }
    }

    loadMission()
  }, [])

  // 🌀 État de chargement
  if (loading) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '2rem' }}>
        <p>🌌 Chargement de ta mission inuite...</p>
      </div>
    )
  }

  // 🪶 Si mission ou étape absente
  if (!mission || !step) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '2rem' }}>
        <h2>❄️ Mission Inuite</h2>
        <p style={{ opacity: 0.8 }}>{status || 'Aucune mission trouvée.'}</p>
      </div>
    )
  }

  // 🌟 Interface principale
  return (
    <div className="fade-in" style={{ padding: '1rem', textAlign: 'center', color: '#eee' }}>
      <h2>❄️ Mission Inuite</h2>

      <h3 style={{ marginTop: '0.5rem' }}>
        Étape {step.step_number}/12 — {step.spirit_name} {step.symbol}
      </h3>

      <p style={{ opacity: 0.8, marginTop: '0.4rem' }}>{step.description}</p>

      {!showCreator ? (
        <button
          onClick={() => setShowCreator(true)}
          className="dream-button"
          style={{
            marginTop: '1.2rem',
            background: '#6eff8d',
            color: '#111',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontWeight: 'bold',
          }}
        >
          🌟 Créer ton Onimoji pour {step.spirit_name}
        </button>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <DreamStarCreator step={step.step_number} />
        </div>
      )}

      <div style={{ marginTop: '1.5rem', opacity: 0.7 }}>
        <p>Progression : {mission?.current_step || 1}/12</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.3rem',
            marginTop: '0.4rem',
          }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: i < (mission?.current_step || 1) ? '#6eff8d' : '#333',
                border: '1px solid #555',
              }}
            ></div>
          ))}
        </div>
      </div>

      {status && (
        <p style={{ marginTop: '1rem', color: '#ffb', opacity: 0.8 }}>{status}</p>
      )}

      <footer style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6 }}>
        © 2025 Onimoji • Cycle des 12 Esprits Inuits
      </footer>
    </div>
  )
}