import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./Home.css"

export default function Profil({ user, onLogout, onDisableTimer }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingPay, setLoadingPay] = useState(false)
  const [status, setStatus] = useState("")
  const [timerMessage, setTimerMessage] = useState("")

  // --- Chargement des stats depuis la vue sécurisée ---
  useEffect(() => {
    if (!user) return
    fetchStats(user.id)
  }, [user])

  async function fetchStats(userId) {
    try {
      const { data, error } = await supabase
        .from("user_universe_stats_secure")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle() // plus sûr
      if (error) console.warn("Erreur chargement stats:", error.message)
      setStats(data || {})
    } catch (err) {
      console.warn("Erreur SQL:", err.message)
      setStats({})
    } finally {
      setLoading(false)
    }
  }

  // --- Simulation de paiement ---
  function handlePay() {
    setLoadingPay(true)
    setStatus("Traitement du voyage...")
    setTimeout(() => {
      setLoadingPay(false)
      setStatus("🌕 Voyage onirique activé ! Bon rêve…")
    }, 2000)
  }

  // --- Désactivation du sablier ---
  function handleDisableTimer() {
    if (!onDisableTimer) return
    const ok = confirm("Désactiver le sablier de 12h pour ce navigateur ?")
    if (!ok) return
    if (typeof window !== "undefined") {
      localStorage.setItem("devCooldownOff", "true")
    }
    onDisableTimer()
    setTimerMessage("🕰️ Sablier désactivé.")
    setTimeout(() => setTimerMessage(""), 4000)
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "#7fffd4", marginTop: "3rem" }}>
        Chargement du profil…
      </div>
    )
  }

  // Sécurisation des champs
  const dream = safeJSON(stats?.last_shared_dream)
  const top = safeJSON(stats?.top_guardian)

  return (
    <div style={{ padding: "1rem", color: "#e9fffd", textAlign: "center" }}>
      <h2>👤 Profil Réso•°</h2>
      <h3 style={{ color: "#ffd46b", marginTop: "-.5rem" }}>
        {stats?.dream_title || "🌙 Voyageur du Réso•°"}
      </h3>
      <p style={{ opacity: 0.8 }}>{user?.email}</p>

      {/* 🌬️ Dernier rêve partagé */}
      <div style={introBox}>
        <h3 style={{ color: "#7fffd4" }}>Dernier rêve partagé</h3>
        {dream?.titre ? (
          <>
            <p>
              {dream.emoji || "💤"} <strong>{dream.titre}</strong>
            </p>
            <p>
              {dream.guardian_emoji || "🌕"} {dream.guardian_name || ""}
            </p>
            <p style={{ fontSize: ".85rem", opacity: 0.8 }}>
              💫 {dream.echo_count || 0} échos
            </p>
          </>
        ) : (
          <p style={{ opacity: 0.6 }}>Aucun rêve partagé pour l’instant…</p>
        )}
      </div>

      {/* 🌊 Statistiques */}
      <div style={bubbleContainer}>
        <Stat label="Rêves" value={stats?.dreams_count} />
        <Stat label="Échos" value={stats?.echoes_count} />
        <Stat label="Gardiens" value={stats?.guardians_count} />
        <Stat label="Sagesses" value={stats?.wisdom_count} />
        <Stat label="Vitalité" value={stats?.vitality_score} />
      </div>

      {/* 🧿 Gardien dominant */}
      {top?.guardian_name && (
        <div style={introBox}>
          <h3 style={{ color: "#ffd46b" }}>🧿 Gardien dominant</h3>
          <p>
            {top.guardian_emoji || "🌕"} <strong>{top.guardian_name}</strong> —{" "}
            {top.dreams_with_guardian || 0} rêves
          </p>
        </div>
      )}

      {/* 💠 Voyage onirique */}
      <div style={payZone}>
        <div style={payCircle}>
          <p>💠 Voyage onirique 🌜</p>
          <p style={{ color: "#7fffd4" }}>1,90 €</p>
          <button onClick={handlePay} disabled={loadingPay} style={btnPay}>
            {loadingPay ? "… Paiement" : "🌕 Lancer le voyage"}
          </button>
          {status && <p style={{ fontSize: ".8rem", color: "#aefcf5" }}>{status}</p>}
        </div>
      </div>

      {/* 🧪 Mode test */}
      <div style={timerBox}>
        <h3 style={{ color: "#ffd46b" }}>🧪 Mode test</h3>
        <p style={{ fontSize: ".85rem", opacity: 0.8 }}>
          Désactive le sablier de 12h pour faciliter les essais.
        </p>
        <button onClick={handleDisableTimer} style={btnTimer}>
          ⏱️ Désactiver le sablier
        </button>
        {timerMessage && <p style={{ color: "#aefcf5" }}>{timerMessage}</p>}
      </div>

      <button onClick={onLogout} style={btnLogout}>
        🚪 Se déconnecter
      </button>
    </div>
  )
}

/* --- Sous-composants --- */
function Stat({ label, value }) {
  const v = Number(value) || 0
  const radius = 40 + v * 4
  return (
    <div
      style={{
        width: radius,
        height: radius,
        borderRadius: "50%",
        background: "rgba(127,255,212,0.2)",
        margin: "0.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(127,255,212,0.4)",
      }}
    >
      <p style={{ margin: 0, fontSize: ".9rem" }}>{label}</p>
      <p style={{ margin: 0, fontWeight: "bold" }}>{v}</p>
    </div>
  )
}

/* --- Fonctions utilitaires --- */
function safeJSON(value) {
  if (!value) return {}
  try {
    return typeof value === "string" ? JSON.parse(value) : value
  } catch {
    return {}
  }
}

/* --- Styles --- */
const introBox = {
  background: "rgba(0,25,35,0.5)",
  border: "1px solid rgba(127,255,212,0.3)",
  borderRadius: "12px",
  padding: "1rem",
  margin: "1rem auto",
  maxWidth: "600px",
}
const bubbleContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "1rem",
  marginBottom: "1rem",
}
const payZone = { display: "flex", justifyContent: "center", marginTop: "1rem" }
const payCircle = {
  width: 200,
  height: 200,
  borderRadius: "50%",
  background: "rgba(0,40,50,0.7)",
  border: "1px solid rgba(127,255,212,0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}
const btnPay = {
  background: "#7fffd4",
  border: "none",
  borderRadius: "8px",
  padding: ".4rem 1rem",
  color: "#001820",
  fontWeight: "bold",
  cursor: "pointer",
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
  border: "1px dashed rgba(255,212,107,0.4)",
  borderRadius: "12px",
  maxWidth: "400px",
  margin: "1rem auto",
}
const btnTimer = {
  background: "rgba(255,212,107,0.2)",
  border: "1px solid rgba(255,212,107,0.6)",
  borderRadius: "8px",
  padding: ".5rem 1rem",
  color: "#ffd46b",
  fontWeight: "bold",
  cursor: "pointer",
}