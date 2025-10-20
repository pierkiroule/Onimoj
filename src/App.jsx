import { useState } from 'react'
import StarField from './components/StarField'
import ShootingEmojis from './components/ShootingEmojis'
import DreamGate from './components/DreamGate'
import TagCatcher from './components/TagCatcher'
import OnimojiSpirit from './components/OnimojiSpirit'
import Home from './pages/Home'
import MissionSelect from './pages/MissionSelect'
import Profil from './pages/Profil'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('intro') // intro → mission → catch → gate → tissage → spirit
  const [picked, setPicked] = useState([])
  const [page, setPage] = useState('home') // home ou profil
  const [mission, setMission] = useState(null)

  // 🧭 NAVIGATION
  const goHome = () => {
    setPhase('intro')
    setPage('home')
  }
  const goProfil = () => setPage('profil')

  // 🚀 Lancer la mission
  const startMission = () => {
    setPicked([])
    setPhase('catch')
  }

  // 🌟 Capture des emojis
  const handleCatch = (emoji) => {
    if (phase !== 'catch') return
    if (picked.length >= 5) return
    const next = [...picked, emoji]
    setPicked(next)
    if (next.length === 5) {
      setTimeout(() => setPhase('gate'), 800)
    }
  }

  return (
    <div className="app-root">
      <StarField />

      {/* 🧭 MENU GLOBAL */}
      <nav className="main-nav">
        <div className="logo-mini" onClick={goHome}>🌘 Onimoji</div>
        <div className="nav-links">
          <button onClick={goHome}>🏠 Accueil</button>
          <button onClick={goProfil}>👤 Profil</button>
        </div>
      </nav>

      {/* --- PAGE ACCUEIL --- */}
      {page === 'home' && (
        <>
          {phase === 'intro' && (
            <Home onStart={() => setPhase('mission')} />
          )}

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
              <h1 className="title">🛰️ Mission {mission?.culture || "Onimoji"}</h1>
              <p className="subtitle">
                Attrape 5 étoiles-émojis pour ouvrir la DreamGate.
              </p>
              <ShootingEmojis onCatch={handleCatch} />
              <p className="hint">Étoiles attrapées : {picked.length} / 5</p>
              {picked.length === 5 && (
                <div className="gate-open-msg">🌠 DreamGate activée...</div>
              )}
            </div>
          )}

          {phase === 'gate' && (
            <DreamGate onEnter={() => setPhase('tissage')} />
          )}

          {phase === 'tissage' && (
            <div className="star-phase fade-in">
              <TagCatcher
                initialEmojis={picked}
                onFinish={() => setPhase('spirit')}
              />
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
      )}

      {/* --- PAGE PROFIL --- */}
      {page === 'profil' && (
        <Profil onBack={goHome} />
      )}

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}