// src/App.jsx
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

// 🌠 Composants globaux
import StarField from "./components/StarField"
import BottomMenu from "./components/BottomMenu"
import Notifications from "./components/Notifications"

// 📄 Pages
import Home from "./pages/Home"
import HorizonSelect from "./pages/HorizonSelect"
import OnimojiJourney from "./pages/OnimojiJourney"
import DreamStarCreator from "./pages/DreamStarCreator"
import Profil from "./pages/Profil"
import EchoReso from "./pages/echoreso/Index.jsx"
import Revotheque from "./pages/Revotheque"
import LaboLogin from "./pages/LaboLogin"
import Labo from "./pages/Labo"
import InuiteAdmin from "./pages/InuiteAdmin"
import Auth from "./pages/Auth"
import Register from "./pages/Register"
import TestSupabase from "./pages/TestSupabase"

import "./App.css"

export default function App() {
  const [page, setPage] = useState("home")
  const [session, setSession] = useState(null)
  const [supabaseStatus, setSupabaseStatus] = useState("⏳ Connexion à Supabase…")
  const [checkingSession, setCheckingSession] = useState(true)
  const [dreamLock, setDreamLock] = useState(false)
  const DELAY = 12 * 60 * 60 * 1000 // 12h

  // 🔌 Vérifie connexion Supabase
  useEffect(() => {
    async function testSupabase() {
      try {
        const { error } = await supabase.from("dreams").select("id").limit(1)
        if (error) throw error
        setSupabaseStatus("✅ Supabase connecté")
      } catch {
        setSupabaseStatus("⚠️ Mode local (offline)")
      }
    }
    testSupabase()
    const interval = setInterval(testSupabase, 60000)
    return () => clearInterval(interval)
  }, [])

  // 🔐 Session persistante
  useEffect(() => {
    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (data?.session) setSession(data.session)
      } catch {
        setSupabaseStatus("⚠️ Mode local (offline)")
      } finally {
        setCheckingSession(false)
      }

      const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
        setSession(sess)
      })
      return () => listener?.subscription?.unsubscribe()
    }
    initSession()
  }, [])

  // 🕰️ Vérifie le sablier (localStorage)
  useEffect(() => {
    const last = parseInt(localStorage.getItem("lastDreamTime") || "0")
    const diff = Date.now() - last
    if (diff < DELAY) {
      setDreamLock(true)
      localStorage.setItem("dreamLock", "true")
    } else {
      setDreamLock(false)
      localStorage.removeItem("dreamLock")
    }
  }, [session, page])

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setPage("home")
  }

  function disableDreamLock() {
    localStorage.removeItem("lastDreamTime")
    localStorage.removeItem("dreamLock")
    setDreamLock(false)
  }

  // 🧭 Routage principal
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
      case "create":
        return <DreamStarCreator />
      case "revotheque":
        return <Revotheque userId={session?.user?.id} />
      case "echoreso":
        return <EchoReso userId={session?.user?.id} />
      case "profil":
        return (
          <Profil
            user={session?.user}
            onLogout={handleLogout}
            onDisableTimer={disableDreamLock}
            onNavigate={setPage}
          />
        )
      case "labo-login":
        return <LaboLogin onNavigate={setPage} />
      case "labo":
        return <Labo onNavigate={setPage} session={session} />
      case "admin-inuite":
        return <InuiteAdmin onNavigate={setPage} session={session} />
      case "test":
        return <TestSupabase />
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

  // 🌙 État de chargement
  if (checkingSession) {
    return (
      <div
        className="app-root"
        style={{ color: "#7fffd4", textAlign: "center", marginTop: "40vh" }}
      >
        🌌 Restauration de la session...
      </div>
    )
  }

  return (
    <div className="app-root">
      <StarField />

      {/* ⚠️ Bandeau mode local */}
      {supabaseStatus.includes("offline") && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            background: "rgba(255,204,102,0.15)",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#ffcc66",
            padding: "0.3rem 0",
            zIndex: 100,
          }}
        >
          ⚠️ Mode local (offline)
        </div>
      )}

      {/* 🔔 Notifications */}
      {session && <Notifications session={session} />}

      {/* 🌀 Pages */}
      <main className="main-container fade-in">{renderPage()}</main>

      {/* 🧭 Menu bas persistant */}
      {(!checkingSession && (session || supabaseStatus.includes("offline") || dreamLock)) && (
        <BottomMenu currentPage={page} onNavigate={setPage} dreamLock={dreamLock} />
      )}

      {/* 🕰️ Statut bas-droit */}
      <div
        style={{
          position: "fixed",
          bottom: "0.6rem",
          right: "0.8rem",
          fontSize: "0.8rem",
          opacity: 0.8,
          color: supabaseStatus.startsWith("✅")
            ? "#6eff8d"
            : supabaseStatus.includes("offline")
            ? "#ffcc66"
            : "#ff6b6b",
          textShadow: "0 0 6px rgba(0,0,0,0.5)",
        }}
      >
        {supabaseStatus}
        {dreamLock && (
          <div
            className="dreamlock-pulse"
            style={{
              color: "#ffe38e",
              fontSize: "0.75rem",
              marginTop: "0.3rem",
              textShadow: "0 0 10px rgba(255,230,150,0.5)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            🔮 Voyage en incubation (12h)
          </div>
        )}
        {session?.user?.id && (
          <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
            👤 {session.user.id.slice(0, 8)}
          </div>
        )}
      </div>

      <footer className="footer">© 2025 Onimoji • Prototype Onirix Beta One</footer>

      {/* ✨ Animation sablier boréal */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}