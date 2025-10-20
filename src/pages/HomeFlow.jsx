import { useState } from 'react'
import Home from './Home'
import MissionSelect from './MissionSelect'
import ShootingEmojis from '../components/ShootingEmojis'
import DreamGate from '../components/DreamGate'
import TagCatcher from '../components/TagCatcher'
import OnimojiSpirit from '../components/OnimojiSpirit'

export default function HomeFlow() {
  const [phase, setPhase] = useState('intro')
  const [picked, setPicked] = useState([])
  const [mission, setMission] = useState(null)

  const startMission = () => {
    setPicked([])
    setPhase('catch')
  }

  const handleCatch = (emoji) => {
    if (phase !== 'catch' || picked.length >= 5) return
    const updated = [...picked, emoji]
    setPicked(updated)
    if (updated.length === 5) setTimeout(() => setPhase('gate'), 800)
  }

  return (
    <>
      {phase === 'intro' && <Home onStart={() => setPhase('mission')} />}

      {phase === 'mission' && (
        <MissionSelect
          onStart={({ culture, name }) => {
            setMission({ culture, name })
            startMission()
          }}
        />
      )}

      {phase === 'catch' && (
        <div className="mission-screen fade-in">
          <h1 className="title">🛰️ Mission {mission?.culture || 'Onimoji'}</h1>
          <p className="subtitle">
            Attrape 5 étoiles-émojis pour ouvrir la <strong>DreamGate</strong>.
          </p>
          <ShootingEmojis onCatch={handleCatch} />
          <p className="hint">Étoiles attrapées : {picked.length} / 5</p>
          {picked.length === 5 && (
            <div className="gate-open-msg">🌠 DreamGate activée...</div>
          )}
        </div>
      )}

      {phase === 'gate' && <DreamGate onEnter={() => setPhase('tissage')} />}

      {phase === 'tissage' && (
        <div className="star-phase fade-in">
          <TagCatcher initialEmojis={picked} onFinish={() => setPhase('spirit')} />
        </div>
      )}

      {phase === 'spirit' && (
        <OnimojiSpirit
          onNext={() => {
            setPhase('intro')
            setMission(null)
          }}
        />
      )}
    </>
  )
}
