import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

// 🧩 Composants
import StarField from './components/StarField'
import BottomMenu from './components/BottomMenu'

// 🌙 Pages
import Home from './pages/Home'
import MissionSelect from './pages/MissionSelect'
import MissionInuite from './pages/MissionInuite'
import DreamStarCreator from './pages/DreamStarCreator'
import Profil from './pages/Profil'
import Donner from './pages/Donner'
import Recevoir from './pages/Recevoir'
import TestSupabase from './pages/TestSupabase'

import './App.css'

export default function App() {
  const [page, setPage] = useState('home')
  const [supabaseStatus, setSupabaseStatus] = useState('⏳ Connexion...')
  const [userId, setUserId] = useState(null)
  const [mission, setMission] = useState(null)

  // 🚀 Vérifie Supabase au démarrage
  useEffect(() => {
    async function testSupabase() {
      try {
        const { data, error } = await supabase.from('test_table').select('*').limit(1)
        if (error) throw error
        setSupabaseStatus('✅ Supabase OK')
      } catch (err) {
        console.error('❌ Supabase erreur:', err.message)
        setSupabaseStatus('❌ Supabase erreur')
      }
    }
    testSupabase()
  }, [])

  // 🧬 Connexion anonyme automatique
  useEffect(() => {
    async function initAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        return
      }
      const { data, error } = await supabase.auth.signInAnonymously()
      if (!error && data?.user) setUserId(data.user.id)
    }
    initAuth()
  }, [])

  // 🧭 Navigation
  const handleNavigation = (pageId) => setPage(pageId)

  // ✨ Rendu principal
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home onStart={() => setPage('mission-select')} />

      case 'mission-select':
        return (
          <MissionSelect
            onChoose={(selected) => {
              setMission(selected)
              if (selected.culture === 'Inuite') setPage('mission-inuite')
            }}
          />
        )

      case 'mission-inuite':
        return <MissionInuite />

      case 'create':
        return <DreamStarCreator />

      case 'profil':
        return <Profil onBack={() => setPage('home')} />

      case 'donner':
        return <Donner />

      case 'recevoir':
        return <Recevoir />

      case 'test':
        return <TestSupabase />

      default:
        return <Home onStart={() => setPage('mission-select')} />
    }
  }

  return (
    <div className="app-root">
      <StarField />

      {/* 🌘 Logo flottant */}
      <div className="floating-logo">
        <div className="logo-icon">🌘</div>
        <div className="logo-text">Onimoji</div>
      </div>

      {/* 🌌 Contenu principal */}
      <main className="main-container fade-in">{renderPage()}</main>

      {/* 🌠 Menu global */}
      <BottomMenu currentPage={page} onNavigate={handleNavigation} />

      {/* ✅ Indicateur technique */}
      <div
        style={{
          position: 'fixed',
          bottom: '0.6rem',
          right: '0.8rem',
          fontSize: '0.8rem',
          opacity: 0.7,
          color:
            supabaseStatus.includes('OK')
              ? '#6eff8d'
              : supabaseStatus.includes('erreur')
              ? '#ff6b6b'
              : '#ffcc66',
        }}
      >
        {supabaseStatus}
        {userId && (
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>
            👤 {userId.slice(0, 8)}
          </div>
        )}
      </div>

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}