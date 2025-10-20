import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabaseClient'

// 🪞 Sous-composants
import HublotEtoileCadavre from '../components/HublotEtoileCadavre'
import ReseauEtoiles from '../components/ReseauEtoiles'
import OnimojiReveil from '../components/OnimojiReveil'

import '../App.css'

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [steps, setSteps] = useState([])
  const [current, setCurrent] = useState(null)
  const [view, setView] = useState('hublot') // 'hublot' | 'reseau' | 'reveil'
  const [stars, setStars] = useState([])
  const [status, setStatus] = useState('🌌 Connexion...')
  const [loading, setLoading] = useState(true)

  // 🔮 Chargement mission et étapes
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

      const { data: stepsData } = await supabase
        .from('mission_steps_inuite')
        .select('*')
        .order('step_number', { ascending: true })

      setSteps(stepsData)
      const currentStep = stepsData.find(s => s.step_number === missionData.current_step)
      setCurrent(currentStep)

      const { data: starData } = await supabase
        .from('dream_stars')
        .select('*')
        .eq('creator_id', user.id)
        .eq('culture', 'Inuite')
      setStars(starData || [])

      setLoading(false)
    }
    loadMission()
  }, [])

  // 🧭 Étape suivante
  async function nextStep() {
    if (!mission) return
    const next = Math.min(mission.current_step + 1, 12)
    const { error } = await supabase
      .from('missions')
      .update({ current_step: next })
      .eq('id', mission.id)
    if (!error) setMission({ ...mission, current_step: next })
  }

  // 🌠 Quand une étoile est créée
  const handleStarCreated = (newStar) => {
    setStars((prev) => [...prev, newStar])
    setView('reseau')
  }

  if (loading)
    return <p style={{ color: '#eee', textAlign: 'center' }}>🌘 Chargement...</p>

  if (!mission)
    return <p style={{ color: '#eee', textAlign: 'center' }}>{status}</p>

  if (!current)
    return <p style={{ color: '#eee', textAlign: 'center' }}>⚠️ Étape non trouvée.</p>

  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', overflow: 'hidden' }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>❄️ Mission Inuite</h2>
      <h3 style={{ fontWeight: 'normal', opacity: 0.9 }}>
        Étape {current.step_number}/12 — {current.spirit_name} {current.symbol}
      </h3>

      <AnimatePresence mode="wait">
        {view === 'hublot' && (
          <motion.div
            key="hublot"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <HublotEtoileCadavre
              userId={user.id}
              step={current}
              mission={mission}
              onComplete={handleStarCreated}
            />
          </motion.div>
        )}

        {view === 'reseau' && (
          <motion.div
            key="reseau"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <ReseauEtoiles
              stars={stars}
              highlight={stars[stars.length - 1]}
              onRevelation={() => setView('reveil')}
            />
          </motion.div>
        )}

        {view === 'reveil' && (
          <motion.div
            key="reveil"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <OnimojiReveil
              step={current}
              onContinue={() => {
                nextStep()
                setView('hublot')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progression visuelle */}
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