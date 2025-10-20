import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import EtoileOnirique from '../components/EtoileOnirique'
import './Home.css'

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [step, setStep] = useState(null)
  const [status, setStatus] = useState('Chargement...')

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
        return
      }

      setMission(missionData)
      const { data: stepData } = await supabase
        .from('mission_steps_inuite')
        .select('*')
        .eq('step_number', missionData.current_step)
        .single()
      setStep(stepData)
    }
    loadMission()
  }, [])

  if (!step)
    return <p style={{ color: '#eee', textAlign: 'center' }}>{status}</p>

  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1rem' }}>
      <h2>❄️ Mission Inuite</h2>
      <h3>Étape {step.step_number}/12 — {step.spirit_name} {step.symbol}</h3>
      <p style={{ opacity: 0.8 }}>{step.description}</p>
      <EtoileOnirique user={user} mission={mission} step={step} />
    </div>
  )
}