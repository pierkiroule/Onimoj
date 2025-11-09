// src/pages/Profil.jsx
import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import "./Home.css"

export default function Profil({ user, onLogout, onDisableTimer }) {
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [animLine, setAnimLine] = useState(0)
  const [loadingPay, setLoadingPay] = useState(false)
  const [status, setStatus] = useState("")
  const [timerMessage, setTimerMessage] = useState("")
  const timerFeedbackTimeout = useRef(null)

  useEffect(() => {
    if (user) {
      fetchStats(user.id)
      fetchBadges(user.id)
    }
  }, [user])

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimLine((prev) => (prev < poeticLines.length ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (timerFeedbackTimeout.current) {
        clearTimeout(timerFeedbackTimeout.current)
        timerFeedbackTimeout.current = null
      }
    }
  }, [])

  const poeticLines = [
    "🌬️ Le vent du Nord t’invite à voyager.",
    "❄️ Chaque rêve trace une onde nouvelle.",
    "🌕 L’eau du monde te reflète en douceur.",
    "💫 Les sagesses murmurent sous la glace."
  ]

  // --- Statistiques personnelles ---
  async function fetchStats(userId) {
    try {
      const [{ count: dreamsCount }, { count: echoesCount }, { data: dreams }] = await Promise.all([
        supabase.from("dreams").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dream_echoes").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dreams").select("guardian_id").eq("user_id", userId),
      ])

      const uniqueGuardians = [...new Set((dreams || []).map((d) => d.guardian_id))].length

      setStats({
        rêves: dreamsCount || 0,
        échos: echoesCount || 0,
        gardiens: uniqueGuardians,
        vitalité: Math.min(10, (dreamsCount + echoesCount) / 2),
        résonances: Math.max(1, Math.round(Math.random() * 5 + dreamsCount / 2)),
      })
    } catch (e) {
      console.error("Erreur chargement stats:", e)
    }
  }

  // --- Badges oniriques ---
  async function fetchBadges(userId) {
    try {
      const { data } = await supabase
        .from("dream_archive")
        .select("id, guardian_name, generated_at, wisdom_generated")
        .eq("generated_by", userId)
        .eq("wisdom_generated", true)
        .order("generated_at", { ascending: false })
        .limit(8)
      setBadges(data || [])
    } catch (err) {
      console.warn("Erreur chargement badges :", err)
    }
  }

  // --- Paiement simulé ---
  function handlePay() {
    setLoadingPay(true)
    setStatus("Traitement du voyage...")
    setTimeout(() => {
      setLoadingPay(false)
      setStatus("🌕 Voyage onirique activé ! Bon rêve…")
    }, 2000)
  }

  // --- Titre onirique selon progression ---
  function titreOnirique(stats) {
    if (!stats) return "🌙 Voyageur du Réso•°"
    const total = (stats.rêves || 0) + (stats.échos || 0)
    if (total > 50) return "🌕 Maître des Rêves"
    if (total > 20) return "🌠 Gardien des Échos"
    if (total > 5) return "✨ Voyageur Onirique"
    return "🌑 Rêveur Naissant"
  }

  function handleDisableTimer() {
    if (typeof onDisableTimer !== "function") {
      setTimerMessage("Fonction non disponible.")
      return
    }
    const confirmed =
      typeof window === "undefined"
        ? true
        : window.confirm("Désactiver le sablier de 12h pour ce navigateur ?")
    if (!confirmed) return
    onDisableTimer()
    setTimerMessage("🕰️ Sablier désactivé pour ce navigateur.")
    if (timerFeedbackTimeout.current) clearTimeout(timerFeedbackTimeout.current)
    timerFeedbackTimeout.current = setTimeout(() => {
      setTimerMessage("")
      timerFeedbackTimeout.current = null
    }, 5000)
  }

  const dimensions = stats
    ? Object.entries(stats).map(([k, v]) => ({
        label: k,
        value: v,
        radius: 40 + v * 6,
        color:
          k === "rêves"
            ? "rgba(127,255,212,0.5)"
            : k === "échos"
            ? "rgba(180,160,255,0.5)"
            : k === "résonances"
            ? "rgba(255,200,180,0.5)"
            : "rgba(150,255,230,0.5)",
      }))
    : []

  return (
    <div className="fade-in" style={{ padding: "1rem", color: "#e9fffd", textAlign: "center" }}>
      <h2>👤 Profil Réso•°</h2>
      <h3 style={{ color: "#ffd46b", marginTop: "-.5rem" }}>{titreOnirique(stats)}</h3>
      <p style={{ opacity: 0.8, fontSize: ".9rem" }}>
        {user?.email || `ID : ${user?.id?.slice(0, 8)}...`}
      </p>

      {/* 🌬️ message poétique progressif */}
      <div style={introBox}>
        <h3 style={{ color: "#7fffd4" }}>Tes ondes vivantes</h3>
        {poeticLines.slice(0, animLine).map((line, i) => (
          <p key={i} style={{ opacity: 0.9, fontSize: ".95rem", animation: "fadeIn 1s ease forwards" }}>
            {line}
          </p>
        ))}
      </div>

      {/* 🌊 Statistiques en bulles */}
      {stats ? (
        <div style={bubbleContainer}>
          {dimensions.map((d, i) => (
            <div key={i} style={{ ...bubble(d), animationDelay: `${i * 0.6}s` }}>
              <div style={bubbleLabel}>
                <p style={{ fontWeight: "bold", color: "#7fffd4" }}>{d.label}</p>
                <p style={{ fontSize: "1.1rem", margin: 0 }}>{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>Chargement des bulles...</p>
      )}

      {/* 🌕 Cercle boréal des 12 gardiens */}
      {stats?.gardiens >= 0 && (
        <div style={circleBox}>
          <h3 style={{ color: "#7fffd4", marginBottom: ".6rem" }}>🌌 Cercle des 12 Gardiens</h3>
          <div style={circleOuter}>
            <svg width="160" height="160" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="aura" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7fffd4" />
                  <stop offset="100%" stopColor="#6a5acd" />
                </linearGradient>
              </defs>

              {/* cercle fond */}
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />

              {/* progression */}
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#aura)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(stats.gardiens / 12) * 314},314`}
                style={{ transition: "stroke-dasharray 1.5s ease" }}
                transform="rotate(-90 60 60)"
              />

              {/* lune centrale */}
              <circle cx="60" cy="60" r="12" fill="#7fffd4" opacity="0.8">
                <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" />
              </circle>

              <text x="60" y="65" textAnchor="middle" fill="#001820" fontSize="12" fontWeight="bold">
                {stats.gardiens}/12
              </text>
            </svg>
            <p style={{ fontSize: ".9rem", color: "#aefcf5", marginTop: ".4rem" }}>
              {stats.gardiens === 12
                ? "🌕 Cercle complet — Sagesse éveillée"
                : `Éveillés : ${stats.gardiens} sur 12`}
            </p>
          </div>
        </div>
      )}

      {/* 🏅 Badges oniriques */}
      {badges.length > 0 && (
        <div style={{ marginTop: "1.2rem" }}>
          <h3 style={{ color: "#ffd46b" }}>🏅 Tes Sagesses révélées</h3>
          <div style={badgeContainer}>
            {badges.map((b) => (
              <div key={b.id} className="badge-mini">
                <span style={{ fontSize: "1.3rem" }}>🌕</span>
                <small style={{ fontSize: ".7rem", textAlign: "center" }}>
                  {b.guardian_name?.slice(0, 10) || "Sagesse"}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💠 Voyage onirique */}
      <div style={payZone}>
        <div className="pulse" style={payCircle}>
          <p style={{ fontSize: "1.1rem", margin: 0 }}>
            💠 S'offrir un voyage onirique au prix d'un croissant 🌜
          </p>
          <p style={{ margin: ".3rem 0", fontSize: "1.3rem", color: "#7fffd4" }}>1,90 €</p>
          <button onClick={handlePay} disabled={loadingPay} style={btnPay}>
            {loadingPay ? "… Paiement" : "🌕 Lancer le voyage"}
          </button>
          {status && (
            <p style={{ fontSize: ".8rem", marginTop: ".4rem", color: "#aefcf5" }}>{status}</p>
          )}
        </div>
      </div>

      <div style={timerBox}>
        <h3 style={{ color: "#ffd46b", marginBottom: ".4rem" }}>🧪 Mode test production</h3>
        <p style={{ fontSize: ".85rem", opacity: 0.8, marginBottom: ".6rem" }}>
          Désactive le sablier de 12h sur cet appareil pour faciliter les essais en production.
        </p>
        <button onClick={handleDisableTimer} style={btnTimer}>
          ⏱️ Désactiver le sablier (test)
        </button>
        {timerMessage && (
          <p style={{ fontSize: ".8rem", color: "#aefcf5", marginTop: ".5rem" }}>{timerMessage}</p>
        )}
      </div>

      <button onClick={onLogout} style={btnLogout}>🚪 Se déconnecter</button>

      <style>{`
        @keyframes softGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(127,255,212,0.4)); }
          50% { filter: drop-shadow(0 0 16px rgba(127,255,212,0.7)); }
        }
      `}</style>
    </div>
  )
}

/* === Styles === */
const introBox = {
  background: "rgba(0,25,35,0.5)",
  border: "1px solid rgba(127,255,212,0.3)",
  borderRadius: "12px",
  padding: "1rem",
  margin: "1rem auto",
  maxWidth: "600px",
  boxShadow: "0 0 12px rgba(127,255,212,0.15)",
}

const bubbleContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: "1.2rem",
  marginTop: "1.5rem",
  marginBottom: "1.5rem",
}

function bubble(d) {
  return {
    width: d.radius * 2,
    height: d.radius * 2,
    borderRadius: "50%",
    background: `radial-gradient(circle at 30% 30%, ${d.color}, rgba(0,30,40,0.8))`,
    boxShadow: `0 0 25px ${d.color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "bubblePulse 5s ease-in-out infinite",
  }
}

const bubbleLabel = { textAlign: "center", color: "#e9fffd" }

const circleBox = { textAlign: "center", marginTop: "1rem", marginBottom: "1rem" }

const circleOuter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  animation: "softGlow 4s ease-in-out infinite",
}

const badgeContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  marginTop: ".6rem",
}

const payZone = { display: "flex", justifyContent: "center", marginTop: "1rem" }

const payCircle = {
  width: 200,
  height: 200,
  borderRadius: "50%",
  background: "rgba(0,40,50,0.7)",
  border: "1.2px solid rgba(127,255,212,0.3)",
  boxShadow: "0 0 25px rgba(127,255,212,0.4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}

const btnPay = {
  background: "#7fffd4",
  border: "none",
  borderRadius: "10px",
  padding: ".5rem 1rem",
  marginTop: ".4rem",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#001820",
  boxShadow: "0 0 10px rgba(127,255,212,0.5)",
}

const btnLogout = {
  marginTop: "2rem",
  background: "#ff6b6b",
  border: "none",
  borderRadius: "8px",
  padding: ".5rem 1rem",
  color: "#fff",
  fontWeight: "bold",
}

const timerBox = {
  marginTop: "1.5rem",
  padding: "1rem",
  background: "rgba(0,25,35,0.45)",
  border: "1px dashed rgba(255, 212, 107, 0.4)",
  borderRadius: "12px",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 0 18px rgba(255,212,107,0.15)",
}

const btnTimer = {
  background: "rgba(255, 212, 107, 0.2)",
  border: "1px solid rgba(255, 212, 107, 0.6)",
  borderRadius: "8px",
  padding: ".5rem 1rem",
  color: "#ffd46b",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 0 12px rgba(255, 212, 107, 0.25)",
}