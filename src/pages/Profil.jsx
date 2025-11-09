// src/pages/Profil.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./Home.css"

export default function Profil({ user, onLogout }) {
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [animLine, setAnimLine] = useState(0)
  const [loadingPay, setLoadingPay] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (user) {
      fetchStats(user.id)
      fetchBadges(user.id)
    }
  }, [user])

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimLine((prev) => (prev < poeticLines.length ? prev + 1 : prev))
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  const poeticLines = [
    "🌬️ Le vent du Nord t’invite à voyager.",
    "❄️ Chaque rêve trace une onde nouvelle.",
    "🌕 L’eau du monde te reflète en douceur."
  ]

  // --- Statistiques ---
  async function fetchStats(userId) {
    try {
      const [{ count: dreamsCount }, { count: echoesCount }] = await Promise.all([
        supabase.from("dreams").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dream_echoes").select("*", { count: "exact", head: true }).eq("user_id", userId),
      ])
      setStats({
        rêves: dreamsCount || 0,
        échos: echoesCount || 0,
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
    return "🌑 Rêveur naissant"
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
      <h3 style={{ color: "#ffd46b", marginTop: "-.5rem" }}>
        {titreOnirique(stats)}
      </h3>
      <p style={{ opacity: 0.8, fontSize: ".9rem" }}>
        {user?.email || `ID : ${user?.id?.slice(0, 8)}...`}
      </p>

      {/* 🌬️ message poétique */}
      <div style={introBox}>
        <h3 style={{ color: "#7fffd4" }}>Tes ondes vivantes</h3>
        {poeticLines.slice(0, animLine).map((line, i) => (
          <p key={i} style={{ opacity: 0.9, fontSize: ".95rem" }}>{line}</p>
        ))}
      </div>

      {/* 🌊 Cercles stats */}
      {stats ? (
        <div style={bubbleContainer}>
          {dimensions.map((d, i) => (
            <div key={i} style={{ ...bubble(d), animationDelay: `${i * 0.7}s` }}>
              <div style={bubbleLabel}>
                <p style={{ fontWeight: "bold", color: "#7fffd4" }}>{d.label}</p>
                <p style={{ fontSize: "1.1rem", margin: 0 }}>{d.value}</p>
              </div>
            </div>
          ))}
          <style>
            {`
              @keyframes bubblePulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.15); opacity: 1; }
                100% { transform: scale(1); opacity: 0.7; }
              }
            `}
          </style>
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>Chargement des bulles...</p>
      )}

      {/* 🏅 Badges oniriques */}
      {badges.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ color: "#ffd46b" }}>🏅 Tes Sagesses révélées</h3>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1rem",
            marginTop: ".6rem"
          }}>
            {badges.map(b => (
              <div key={b.id} style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "radial-gradient(circle at 30% 30%, #ffe38e, #553)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "#111",
                fontWeight: "bold",
                boxShadow: "0 0 10px rgba(255,230,150,0.6)",
                animation: "floatBadge 6s ease-in-out infinite",
              }}>
                <span style={{ fontSize: "1.3rem" }}>🌕</span>
                <small style={{ fontSize: ".7rem", textAlign: "center" }}>
                  {b.guardian_name?.slice(0, 10) || "Sagesse"}
                </small>
              </div>
            ))}
            <style>
              {`
                @keyframes floatBadge {
                  0% { transform: translateY(0); }
                  50% { transform: translateY(-6px); }
                  100% { transform: translateY(0); }
                }
              `}
            </style>
          </div>
        </div>
      )}

      {/* 💠 Cercle “offrir un voyage” */}
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
        <style>
          {`
            @keyframes pulseWave {
              0% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); opacity: 0.8; }
            }
            .pulse {
              animation: pulseWave 5s ease-in-out infinite;
            }
          `}
        </style>
      </div>

      <button onClick={onLogout} style={btnLogout}>🚪 Se déconnecter</button>
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
  marginBottom: "2rem",
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

const bubbleLabel = {
  textAlign: "center",
  color: "#e9fffd",
}

const payZone = {
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
}

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