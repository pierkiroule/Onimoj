import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import HublotEtoileCadavre from '../components/HublotEtoileCadavre'
import './Home.css'

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [steps, setSteps] = useState([])
  const [current, setCurrent] = useState(null)
  const [status, setStatus] = useState('🌌 Connexion...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMission() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setStatus('⚠️ Connecte-toi d’abord.')
      setUser(user)

      const { data: missionData } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('culture', 'Inuite')
        .single()

      if (!missionData) {
        setStatus('🌙 Lance ta mission Inuite depuis ton profil.')
        setLoading(false)
        return
      }

      setMission(missionData)

      const { data: stepsData, error } = await supabase
        .from('mission_steps_inuite')
        .select('*')
        .order('step_number', { ascending: true })

      if (error) console.error(error)
      setSteps(stepsData)
      const currentStep = stepsData.find(s => s.step_number === missionData.current_step)
      setCurrent(currentStep)
      setLoading(false)
    }

    loadMission()
  }, [])

  async function nextStep() {
    if (!mission) return
    const next = Math.min(mission.current_step + 1, 12)
    const { error } = await supabase
      .from('missions')
      .update({ current_step: next })
      .eq('id', mission.id)
    if (!error) setMission({ ...mission, current_step: next })
  }

  if (loading)
    return <p style={{ color: '#eee', textAlign: 'center' }}>🌘 Chargement...</p>

  if (!mission)
    return <p style={{ color: '#eee', textAlign: 'center' }}>{status}</p>

  if (!current)
    return <p style={{ color: '#eee', textAlign: 'center' }}>⚠️ Étape non trouvée.</p>

  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>❄️ Mission Inuite</h2>
      <h3 style={{ fontWeight: 'normal', opacity: 0.9 }}>
        Étape {current.step_number}/12 — {current.spirit_name} {current.symbol}
      </h3>
      <p style={{ margin: '0.8rem auto', maxWidth: '85%', fontSize: '0.95rem', opacity: 0.85 }}>
        {current.description}
      </p>

      <HublotEtoileCadavre
        userId={user.id}
        step={current}
        mission={mission}
        onComplete={nextStep}
      />

      <div style={{ marginTop: '1rem' }}>
        <p style={{ opacity: 0.7 }}>Progression : {mission.current_step}/12</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: i < mission.current_step ? '#6eff8d' : '#333',
              }}
            ></div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '1rem', opacity: 0.6 }}>
        © 2025 Onimoji • Cycle des 12 Esprits Inuits
      </footer>
    </div>
  )
}