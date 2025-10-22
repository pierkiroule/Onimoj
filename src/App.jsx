import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

// 🧩 Composants
import StarField from "./components/StarField"
import BottomMenu from "./components/BottomMenu"
import Notifications from "./components/Notifications"

// 🌙 Pages
import Home from "./pages/Home"
import MissionSelect from "./pages/MissionSelect"
import MissionInuite from "./pages/MissionInuite"
import DreamStarCreator from "./pages/DreamStarCreator"
import Profil from "./pages/Profil"
import EchoCreation from "./pages/EchoCreation"
import TestSupabase from "./pages/TestSupabase"
import Auth from "./pages/Auth"
import LaboLogin from "./pages/LaboLogin"
import Labo from "./pages/Labo"

import "./App.css"

export default function App() {
  const [page, setPage] = useState("home")
  const [supabaseStatus, setSupabaseStatus] = useState("⏳ Connexion...")
  const [session, setSession] = useState(null)

  // 🚀 Vérifie la connexion Supabase
  useEffect(() => {
    async function testSupabase() {
      try {
        const { error } = await supabase.from("test_table").select("*").limit(1)
        if (error) throw error
        setSupabaseStatus("✅ Supabase OK")
      } catch (err) {
        console.error("❌ Supabase erreur:", err.message)
        setSupabaseStatus("❌ Supabase erreur")
      }
    }
    testSupabase()
  }, [])

  // 🔐 Gestion session
  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // 🧭 Navigation
  const handleNavigation = (pageId) => setPage(pageId)

  // 🔓 Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setPage("home")
  }

  // 🪄 Rendu principal
  const renderPage = () => {
    if (!session) return <Auth onAuth={(newSession) => setSession(newSession)} />

    switch (page) {
      case "home":
        return <Home onStart={() => setPage("mission-select")} />

      case "mission-select":
        return (
          <MissionSelect
            onChoose={(selected) => {
              if (selected.culture === "Inuite") setPage("mission-inuite")
            }}
          />
        )

      case "mission-inuite":
        return <MissionInuite />

      case "create":
        return <DreamStarCreator />

      case "profil":
        return <Profil user={session?.user} onLogout={handleLogout} onNavigate={setPage} />

      case "echo-creation":
        return <EchoCreation />

      case "test":
        return <TestSupabase />

      case "labo-login":
        return <LaboLogin onNavigate={setPage} />

      case "labo":
        return <Labo onNavigate={setPage} session={session} />

      default:
        return <Home onStart={() => setPage("mission-select")} />
    }
  }

  // 🌌 Interface principale
  return (
    <div className="app-root">
      <StarField />

      {/* 🔔 Notifications visibles si session active */}
      {session && <Notifications session={session} />}

      {/* 🌌 Contenu principal */}
      <main className="main-container fade-in">{renderPage()}</main>

      {/* 🌠 Menu global */}
      {session && <BottomMenu currentPage={page} onNavigate={handleNavigation} />}

      {/* ✅ Indicateur Supabase + user */}
      <div
        style={{
          position: "fixed",
          bottom: "0.6rem",
          right: "0.8rem",
          fontSize: "0.8rem",
          opacity: 0.7,
          color:
            supabaseStatus.includes("OK")
              ? "#6eff8d"
              : supabaseStatus.includes("erreur")
              ? "#ff6b6b"
              : "#ffcc66",
        }}
      >
        {supabaseStatus}
        {session?.user?.id && (
          <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
            👤 {session.user.id.slice(0, 8)}
          </div>
        )}
      </div>

      <footer className="footer">© 2025 Onimoji • Prototype Onirix Beta One</footer>
    </div>
  )
}