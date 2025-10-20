import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import HublotOnirique from '../components/HublotOnirique'
import EtoileOnirique from '../components/EtoileOnirique'
import '../App.css'

export default function MissionInuite() {
  const [mission, setMission] = useState(null)
  const [step, setStep] = useState(null)
  const [phase, setPhase] = useState('intro')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [emojis, setEmojis] = useState([])
  const [title, setTitle] = useState('')
  const [texts, setTexts] = useState(['', '', '', '', ''])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  // 🌌 Chargement mission + étape
  useEffect(() => {
    async function loadMission() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStatus('⚠️ Connecte-toi d’abord.')
        setLoading(false)
        return
      }

      const { data: missionData } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('culture', 'Inuite')
        .single()

      if (!missionData) {
        setStatus('🌙 Lance d’abord ta mission Inuite depuis ton profil.')
        setLoading(false)
        return
      }

      setMission(missionData)

      const { data: stepData } = await supabase
        .from('mission_steps_inuite')
        .select('*')
        .eq('step_number', missionData.current_step)
        .single()

      setStep(stepData)
      setLoading(false)
    }

    loadMission()
  }, [])

  // 🧲 Capture d’émojis
  const handleCatch = (emoji) => {
    if (emojis.includes(emoji) || emojis.length >= 5) return
    const updated = [...emojis, emoji]
    setEmojis(updated)
    if (updated.length === 5) {
      setTimeout(() => setPhase('create'), 1000)
    }
  }

  // 💫 Sauvegarde étoile
  async function handleSend() {
    if (!title.trim()) return setStatus('⚠️ Donne un titre à ton étoile.')
    setSending(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('dream_stars').insert([
        {
          creator_id: user.id,
          title,
          emojis,
          texts,
          culture: 'Inuite',
          step_number: step?.step_number || 1,
        },
      ])
      if (error) throw error
      setDone(true)
      setStatus('🌠 Ton étoile s’élève dans le ciel des rêves...')
    } catch (err) {
      console.error(err)
      setStatus('⚠️ Erreur lors de l’envoi.')
    }
    setSending(false)
  }

  if (loading) return <p style={{ color: '#eee' }}>🌌 Connexion aux esprits...</p>
  if (!step) return <p style={{ color: '#eee' }}>{status}</p>

  return (
    <div className="fade-in" style={{ color: '#eee', textAlign: 'center', padding: '1rem' }}>
      <h2>❄️ Mission Inuite</h2>
      <h3>Étape {step.step_number}/12 — {step.spirit_name} {step.symbol}</h3>
      <p style={{ opacity: 0.8 }}>{step.description}</p>

      {/* 🪶 INTRO */}
      {phase === 'intro' && (
        <>
          <p style={{ marginTop: '1rem', opacity: 0.9 }}>
            L’esprit {step.spirit_name} t’invite à ouvrir ton hublot intérieur
            et à attraper 5 symboles du vent arctique.
          </p>
          <button
            onClick={() => setPhase('catch')}
            className="dream-button"
            style={{ marginTop: '1rem' }}
          >
            🌌 Ouvrir le hublot onirique
          </button>
        </>
      )}

      {/* 🌀 PHASE CAPTURE */}
      {phase === 'catch' && (
        <div className="fade-in" style={{ marginTop: '1rem' }}>
          <HublotOnirique onCatch={handleCatch} />
          <p className="hint" style={{ marginTop: '0.6rem' }}>
            Attrape 5 symboles du vent 🌬️
          </p>
          <p>Étoiles attrapées : {emojis.length}/5</p>
        </div>
      )}

      {/* 🌟 PHASE CRÉATION D’ÉTOILE */}
      {phase === 'create' && !done && (
        <div className="fade-in" style={{ marginTop: '1rem' }}>
          <h4>🌟 Crée ton Étoile Onirique</h4>
          <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
            5 symboles, 5 souffles, 1 titre — tisse ton rêve.
          </p>

          <input
            type="text"
            placeholder="Titre de ton étoile..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '90%',
              margin: '0.5rem auto',
              borderRadius: '8px',
              padding: '0.6rem',
            }}
          />

          <div style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>
            {emojis.map((e, i) => (
              <span key={i} style={{ margin: '0 0.2rem' }}>{e}</span>
            ))}
          </div>

          {/* 🔯 Étoile graphique */}
          <EtoileOnirique
            emojis={emojis}
            texts={texts}
            onTextChange={(i, val) => {
              const updated = [...texts]
              updated[i] = val
              setTexts(updated)
            }}
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="dream-button"
            style={{
              marginTop: '1.5rem',
              background: '#6eff8d',
              color: '#111',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.2rem',
              fontWeight: 'bold',
            }}
          >
            {sending ? '💫 Envoi...' : '💫 Envoyer mon étoile'}
          </button>

          <p style={{ marginTop: '1rem', opacity: 0.7 }}>{status}</p>
        </div>
      )}

      {/* 🌠 PHASE FINALE */}
      {done && (
        <div className="fade-in" style={{ marginTop: '1.5rem' }}>
          <h3>🌠 Ton étoile brille dans le ciel de {step.spirit_name}...</h3>
          <p style={{ opacity: 0.8 }}>
            L’esprit t’accorde sa bénédiction pour la prochaine étape.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="dream-button"
            style={{ marginTop: '1rem' }}
          >
            🧭 Continuer la mission
          </button>
        </div>
      )}

      {/* 🧭 PROGRESSION */}
      <div style={{ marginTop: '2rem', opacity: 0.7 }}>
        <p>Progression : {mission?.current_step || 1}/12</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: i < (mission?.current_step || 1) ? '#6eff8d' : '#333',
              }}
            ></div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '2rem', opacity: 0.5 }}>
        © 2025 Onimoji • Cycle des 12 Esprits Inuits
      </footer>
    </div>
  )
}