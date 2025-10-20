import { useState } from 'react'
import StarField from './components/StarField'
import ShootingEmojis from './components/ShootingEmojis'
import DreamGate from './components/DreamGate'
import TagCatcher from './components/TagCatcher'
import OnimojiSpirit from './components/OnimojiSpirit'
import BottomMenu from './components/BottomMenu'
import Home from './pages/Home'
import MissionSelect from './pages/MissionSelect'
import Profil from './pages/Profil'
import Donner from './pages/Donner'
import Recevoir from './pages/Recevoir'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('intro') // intro → mission → catch → gate → tissage → spirit
  const [picked, setPicked] = useState([])
  const [page, setPage] = useState('home')
  const [mission, setMission] = useState(null)

  // 🧭 Navigation globale
  const handleNavigation = (pageId) => {
    setPage(pageId)
    if (pageId === 'home') setPhase('intro')
  }

  // 🚀 Lancer une mission
  const startMission = () => {
    setPicked([])
    setPhase('catch')
  }

  // 🌟 Capture des émojis
  const handleCatch = (emoji) => {
    if (phase !== 'catch' || picked.length >= 5) return
    const updated = [...picked, emoji]
    setPicked(updated)
    if (updated.length === 5) setTimeout(() => setPhase('gate'), 800)
  }

  // ✨ Rendu par page
  const renderPage = () => {
    switch (page) {
      case 'home':
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
        )

      case 'profil':
        return <Profil onBack={() => setPage('home')} />

      case 'donner':
        return <Donner />

      case 'recevoir':
        return <Recevoir />

      default:
        return <Home onStart={() => setPhase('mission')} />
    }
  }

  return (
    <div className="app-root">
      <StarField />

      {/* 🌘 LOGO FLOTTANT UNIQUE */}
      <div className="floating-logo">
        <div className="logo-icon">🌘</div>
        <div className="logo-text">Onimoji</div>
      </div>

      {/* 🌌 CONTENU CENTRAL */}
      <main className="main-container fade-in">{renderPage()}</main>

      {/* 🌠 MENU GLOBAL */}
      <BottomMenu currentPage={page} onNavigate={handleNavigation} />

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}