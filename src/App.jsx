import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
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
import TestSupabase from './pages/TestSupabase'
import './App.css'

export default function App() {
  const [phase, setPhase] = useState('intro')
  const [picked, setPicked] = useState([])
  const [page, setPage] = useState('home')
  const [mission, setMission] = useState(null)
  const [supabaseStatus, setSupabaseStatus] = useState('⏳ Connexion...')
  const [userId, setUserId] = useState(null)

  // 🚀 Test rapide Supabase
  useEffect(() => {
    async function testSupabase() {
      try {
        const { data, error } = await supabase.from('test_table').select('*').limit(1)
        if (error) throw error
        console.log('✅ Supabase OK:', data)
        setSupabaseStatus('✅ Supabase OK')
      } catch (err) {
        console.error('❌ Supabase erreur:', err.message)
        setSupabaseStatus('❌ Supabase erreur')
      }
    }
    testSupabase()
  }, [])

  // 🧬 Connexion invitée (sécurisée)
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log('👤 Utilisateur déjà connecté :', user.id)
          setUserId(user.id)
          return
        }

        // Connexion sur le compte invité prédéfini
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'guest@onimoji.app',
          password: 'onimoji123',
        })

        if (error) throw error

        console.log('✨ Connecté comme invité :', data.user.id)
        setUserId(data.user.id)
      } catch (err) {
        console.error('❌ Erreur auth invitée :', err.message)
        setSupabaseStatus('❌ Auth erreur')
      }
    }

    initAuth()
  }, [])

  // 🧭 Navigation
  const handleNavigation = (pageId) => {
    setPage(pageId)
    if (pageId === 'home') setPhase('intro')
  }

  // 🚀 Lancer mission
  const startMission = () => {
    setPicked([])
    setPhase('catch')
  }

  // 🌟 Capture
  const handleCatch = (emoji) => {
    if (phase !== 'catch' || picked.length >= 5) return
    const updated = [...picked, emoji]
    setPicked(updated)
    if (updated.length === 5) setTimeout(() => setPhase('gate'), 800)
  }

  // ✨ Rendu
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
                <h1 className="title">
                  🛰️ Mission {mission?.culture || 'Onimoji'}
                </h1>
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
        return <Profil userId={userId} onBack={() => setPage('home')} />
      case 'donner':
        return <Donner userId={userId} />
      case 'recevoir':
        return <Recevoir userId={userId} />
      case 'test':
        return <TestSupabase />
      default:
        return <Home onStart={() => setPhase('mission')} />
    }
  }

  return (
    <div className="app-root">
      <StarField />

      <div className="floating-logo">
        <div className="logo-icon">🌘</div>
        <div className="logo-text">Onimoji</div>
      </div>

      <main className="main-container fade-in">{renderPage()}</main>

      <BottomMenu currentPage={page} onNavigate={handleNavigation} />

      <div
        style={{
          position: 'fixed',
          bottom: '0.6rem',
          right: '0.8rem',
          fontSize: '0.8rem',
          opacity: 0.7,
          color:
            supabaseStatus.includes('OK') ? '#6eff8d'
            : supabaseStatus.includes('erreur') ? '#ff6b6b'
            : '#ffcc66',
        }}
      >
        {supabaseStatus}
        {userId && <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>👤 {userId.slice(0, 8)}</div>}
      </div>

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}