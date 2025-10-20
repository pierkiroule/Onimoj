import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import StarField from './components/StarField'
import BottomMenu from './components/BottomMenu'
import HomeFlow from './pages/HomeFlow'
import Profil from './pages/Profil'
import Donner from './pages/Donner'
import Recevoir from './pages/Recevoir'
import TestSupabase from './pages/TestSupabase'
import './App.css'

export default function App() {
  const [supabaseStatus, setSupabaseStatus] = useState('⏳ Connexion...')

  // 🚀 Test Supabase au démarrage (silencieux, seulement en dev)
  useEffect(() => {
    if (!import.meta.env.DEV) return
    let isMounted = true
    async function testSupabase() {
      try {
        const { data, error } = await supabase.from('test_table').select('*').limit(1)
        if (error) throw error
        if (isMounted) setSupabaseStatus('✅ Supabase OK')
        // eslint-disable-next-line no-console
        console.log('✅ Supabase OK:', data)
      } catch (err) {
        if (isMounted) setSupabaseStatus('❌ Supabase erreur')
        // eslint-disable-next-line no-console
        console.error('❌ Supabase erreur:', err?.message || err)
      }
    }
    testSupabase()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="app-root">
      <StarField />

      <div className="floating-logo">
        <div className="logo-icon">🌘</div>
        <div className="logo-text">Onimoji</div>
      </div>

      <main className="main-container fade-in">
        <Routes>
          <Route path="/" element={<HomeFlow />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/donner" element={<Donner />} />
          <Route path="/recevoir" element={<Recevoir />} />
          <Route path="/test" element={<TestSupabase />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <BottomMenu />

      <div
        style={{
          position: 'fixed',
          bottom: '0.6rem',
          right: '0.8rem',
          fontSize: '0.8rem',
          opacity: 0.7,
          color:
            supabaseStatus.includes('OK') ? '#6eff8d' :
            supabaseStatus.includes('erreur') ? '#ff6b6b' : '#ffcc66',
        }}
      >
        {supabaseStatus}
      </div>

      <footer className="footer">© 2025 Onimoji • Prototype Onirix Beta One</footer>
    </div>
  )
}