import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabaseClient"
import "./Home.css"

export default function Profil({ user, onLogout, onNavigate }) {
  const [mission, setMission] = useState(null)
  const [bulles, setBulles] = useState([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const channelRef = useRef(null)

  // ✅ Canal de synchro local
  useEffect(() => {
    channelRef.current = new BroadcastChannel("sky-sync")
    return () => channelRef.current?.close()
  }, [])

  // Chargement initial
  useEffect(() => {
    if (user) {
      fetchProgress(user.id)
      fetchBulles(user.id)
    }
  }, [user])

  // ---- Lecture progression mission ----
  async function fetchProgress(userId) {
    const { data, error } = await supabase
      .from("user_inuit_progress")
      .select("*")
      .eq("user_id", userId)
      .single()
    if (!error && data) setMission(data)
  }

  // ---- Lecture bulles actives ----
  async function fetchBulles(userId) {
    const { data, error } = await supabase
      .from("dream_stars")
      .select("id, title, emojis, culture, created_at, completed")
      .eq("creator_id", userId)
      .eq("completed", true)
      .order("created_at", { ascending: false })
    if (!error) setBulles(data || [])
  }

  // ---- Supprimer une bulle ----
  async function removeBulle(id) {
    if (!confirm("Retirer cette bulle du ciel ?")) return
    const { error } = await supabase.from("dream_stars").delete().eq("id", id)
    if (!error) {
      setBulles(prev => prev.filter(b => b.id !== id))
      setStatus("🌀 Bulle retirée du ciel.")
      channelRef.current?.postMessage({ type: "remove", id })
    }
  }

  // ---- Activer mission Inuite avec halo cosmique ----
  async function startInuitMission() {
    if (!user) return setStatus("⚠️ Non connecté.")

    setStatus("💳 Paiement cosmique en cours...")
    setLoading(true)

    // 🌠 Halo cosmique temporaire
    const halo = document.createElement("div")
    halo.style.position = "fixed"
    halo.style.inset = "0"
    halo.style.zIndex = "9999"
    halo.style.background = "radial-gradient(circle at center, rgba(127,255,212,0.25), transparent 70%)"
    halo.style.pointerEvents = "none"
    halo.style.animation = "cosmicPulse 1.5s ease-in-out infinite alternate"
    document.body.appendChild(halo)

    setTimeout(async () => {
      try {
        const { data: existing } = await supabase
          .from("user_inuit_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle()

        if (existing) {
          setStatus("⚠️ Mission déjà activée.")
          document.body.removeChild(halo)
          setLoading(false)
          return
        }

        const { error } = await supabase.from("user_inuit_progress").insert([
          {
            user_id: user.id,
            step_number: 1,
            awakened: false,
          },
        ])
        if (error) throw error

        // 🌌 Animation de réussite
        halo.style.background = "radial-gradient(circle at center, rgba(127,255,212,0.6), transparent 80%)"
        halo.style.animation = "cosmicBurst 2s ease-out"
        setStatus("✅ Mission Inuite activée !")

        setTimeout(() => {
          document.body.removeChild(halo)
        }, 2000)

        fetchProgress(user.id)
      } catch (err) {
        console.error("❌ Erreur mission :", err)
        setStatus("Erreur mission")
        document.body.removeChild(halo)
      } finally {
        setLoading(false)
      }
    }, 1500)
  }

  // ---- Avancer la mission ----
  async function nextStep() {
    if (!mission) return
    const newStep = Math.min(mission.step_number + 1, 12)
    const { error } = await supabase
      .from("user_inuit_progress")
      .update({ step_number: newStep })
      .eq("user_id", user.id)
    if (!error) {
      setMission({ ...mission, step_number: newStep })
      setStatus(`🌟 Étape ${newStep}/12 atteinte !`)
    }
  }

  const renderBadges = progress => (
    <div style={{ display: "flex", justifyContent: "center", gap: "0.3rem", marginTop: "0.5rem" }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: i < progress ? "#6eff8d" : "#333",
            border: "1px solid #777",
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="fade-in" style={{ padding: "1rem", color: "#eee", textAlign: "center" }}>
      <h2>👤 Profil Onimoji</h2>
      {user ? (
        <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
          {user.email ? `🌕 ${user.email}` : `🌀 ID : ${user.id.slice(0, 8)}...`}
        </p>
      ) : (
        <p>Chargement du profil...</p>
      )}

      {/* 🌍 Mission actuelle */}
      <h3 style={{ marginTop: "1.5rem" }}>🌍 Mission actuelle</h3>

      {mission ? (
        <div
          style={{
            background: "#223",
            borderRadius: "10px",
            padding: "1rem",
            width: "90%",
            margin: "1rem auto",
            boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          }}
        >
          <h4>❄️ Mission Inuite</h4>
          <p>Étape {mission.step_number}/12</p>
          {renderBadges(mission.step_number)}
          <button
            onClick={nextStep}
            style={{
              background: "#6eff8d",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              marginTop: "0.8rem",
              fontWeight: "bold",
            }}
          >
            🌟 Étape suivante
          </button>
        </div>
      ) : (
        <>
          <p>Aucune mission active.</p>
          <button
            disabled={loading}
            onClick={startInuitMission}
            style={{
              background: loading ? "#1a3b3b" : "#444",
              color: "#7fffd4",
              border: "1px solid #7fffd4",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              marginTop: "0.5rem",
              boxShadow: loading
                ? "0 0 20px rgba(127,255,212,0.5)"
                : "0 0 8px rgba(127,255,212,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "💫 Paiement cosmique..." : "💳 Démarrer la Mission Inuite"}
          </button>
        </>
      )}

      {/* 🌌 Bulles oniriques */}
      <h3 style={{ marginTop: "2rem" }}>🌕 Mes bulles en maturation</h3>
      {bulles.length > 0 ? (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {bulles.map(b => (
            <div
              key={b.id}
              style={{
                background: "radial-gradient(circle, #0a0f15, #000)",
                border: "1px solid #7fffd4",
                borderRadius: "12px",
                padding: "0.8rem",
                boxShadow: "0 0 12px rgba(127,255,212,0.2)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            >
              <h4 style={{ color: "#7fffd4", marginBottom: "0.2rem" }}>{b.title}</h4>
              <p style={{ fontSize: "1.4rem" }}>{b.emojis?.join(" ")}</p>
              <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                {new Date(b.created_at).toLocaleDateString("fr-FR")}
              </p>
              <button
                onClick={() => removeBulle(b.id)}
                style={{
                  background: "#ff7070",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.3rem 0.8rem",
                  fontSize: "0.8rem",
                  marginTop: "0.4rem",
                }}
              >
                🌀 Retirer du ciel
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: "1rem", opacity: 0.7 }}>Aucune bulle active pour l’instant.</p>
      )}

      <p style={{ marginTop: "1.2rem", opacity: 0.8 }}>{status}</p>

      <div style={{ opacity: 0.4, marginTop: "1rem" }}>
        <h4>🏜️ Mission Berbère — verrouillée 🔒</h4>
        <h4>🌳 Mission Celtique — verrouillée 🔒</h4>
      </div>

      <button
        onClick={onLogout}
        style={{
          marginTop: "2rem",
          background: "#ff6b6b",
          border: "none",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        🚪 Se déconnecter
      </button>

      {user?.id === "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97" && (
        <p
          onClick={() => onNavigate("labo-login")}
          style={{
            opacity: 0.4,
            fontSize: "0.8rem",
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          🧪 Accès Labo (privé)
        </p>
      )}

      <style>
        {`
        @keyframes pulse {
          0%,100%{box-shadow:0 0 8px rgba(127,255,212,0.1);}
          50%{box-shadow:0 0 18px rgba(127,255,212,0.4);}
        }

        @keyframes cosmicPulse {
          0% { opacity: 0.2; transform: scale(1); filter: blur(5px); }
          100% { opacity: 0.5; transform: scale(1.3); filter: blur(12px); }
        }

        @keyframes cosmicBurst {
          0% { opacity: 0.6; transform: scale(1); filter: blur(5px); }
          100% { opacity: 0; transform: scale(3); filter: blur(20px); }
        }
        `}
      </style>
    </div>
  )
}