import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

// 🌠 Composants globaux
import StarField from "./components/StarField"
import BottomMenu from "./components/BottomMenu"
import Notifications from "./components/Notifications"

// 📄 Pages
import Home from "./pages/Home"
import HorizonSelect from "./pages/HorizonSelect"
import OnimojiJourney from "./pages/OnimojiJourney" // ✅ remplace MissionInuite
import MissionInuiteEditor from "./pages/MissionInuiteEditor"
import DreamStarCreator from "./pages/DreamStarCreator"
import Profil from "./pages/Profil"
import DreamEcho from "./pages/DreamEcho"
import EchoReso from "./pages/EchoReso"              // ✅ nouveau nom
import TestSupabase from "./pages/TestSupabase"
import Auth from "./pages/Auth"
import Register from "./pages/Register"
import LaboLogin from "./pages/LaboLogin"
import Labo from "./pages/Labo"
import InuiteAdmin from "./pages/InuiteAdmin"

import "./App.css"

export default function App() {
  const [page, setPage] = useState("home")
  const [session, setSession] = useState(null)
  const [supabaseStatus, setSupabaseStatus] = useState("⏳ Connexion à Supabase…")
  const [checkingSession, setCheckingSession] = useState(true)

  // 🔌 Vérifie connexion Supabase
  useEffect(() => {
    async function testSupabase() {
      try {
        const { error } = await supabase.from("test_table").select("*").limit(1)
        if (error) throw error
        setSupabaseStatus("✅ Supabase connecté")
      } catch {
        setSupabaseStatus("⚠️ Mode local (offline)")
      }
    }
    testSupabase()
    const interval = setInterval(testSupabase, 30000)
    return () => clearInterval(interval)
  }, [])

  // 🔐 Session persistante
  useEffect(() => {
    async function initSession() {
      const { data } = await supabase.auth.getSession()
      if (data?.session) setSession(data.session)
      setCheckingSession(false)
      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        setSession(sess)
      })
      return () => listener?.subscription?.unsubscribe()
    }
    initSession()
  }, [])

  const handleNavigation = (id) => setPage(id)

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setPage("home")
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <Home
            onStart={() => setPage("mission-select")}
            onLogin={() => setPage("login")}
            onRegister={() => setPage("register")}
          />
        )

      case "login":
        return <Auth onAuth={setSession} onNavigate={setPage} />

      case "register":
        return <Register onAuth={setSession} onNavigate={setPage} />

      case "mission-select":
        return (
          <HorizonSelect
            onChoose={(sel) =>
              sel.culture === "Inuite" && setPage("onimoji-journey")
            }
          />
        )

      case "onimoji-journey":
        return <OnimojiJourney userId={session?.user?.id} />

      case "mission-editor":
        return <MissionInuiteEditor />

      case "create":
        return <DreamStarCreator />

      case "profil":
        return (
          <Profil
            user={session?.user}
            onLogout={handleLogout}
            onNavigate={setPage}
          />
        )

      case "echo-creation":
        return <DreamEcho userId={session?.user?.id} />

      // 🌌 Nouveau EchoReso intégré ici
      case "echoreso":
        return <EchoReso userId={session?.user?.id} />

      case "test":
        return <TestSupabase />

      case "labo-login":
        return <LaboLogin onNavigate={setPage} />

      case "labo":
        return <Labo onNavigate={setPage} session={session} />

      case "admin-inuite":
        return <InuiteAdmin onNavigate={setPage} session={session} />

      default:
        return (
          <Home
            onStart={() => setPage("mission-select")}
            onLogin={() => setPage("login")}
            onRegister={() => setPage("register")}
          />
        )
    }
  }

  if (checkingSession) {
    return (
      <div
        className="app-root"
        style={{
          color: "#7fffd4",
          textAlign: "center",
          marginTop: "40vh",
        }}
      >
        🌌 Restauration de la session...
      </div>
    )
  }

  return (
    <div className="app-root">
      <StarField />
      {session && <Notifications session={session} />}

      <main className="main-container fade-in">{renderPage()}</main>

      {session && <BottomMenu currentPage={page} onNavigate={handleNavigation} />}

      <div
        style={{
          position: "fixed",
          bottom: "0.6rem",
          right: "0.8rem",
          fontSize: "0.8rem",
          opacity: 0.75,
          color: supabaseStatus.startsWith("✅")
            ? "#6eff8d"
            : supabaseStatus.includes("offline")
            ? "#ffcc66"
            : "#ff6b6b",
          textShadow: "0 0 6px rgba(0,0,0,0.5)",
        }}
      >
        {supabaseStatus}
        {session?.user?.id && (
          <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
            👤 {session.user.id.slice(0, 8)}
          </div>
        )}
      </div>

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}