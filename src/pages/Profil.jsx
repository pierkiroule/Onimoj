// src/pages/Profil.jsx
import { useEffect, useState, useRef } from "react"
import { supabase } from "../supabaseClient"
import "./Home.css"

export default function Profil({ user, onLogout, onNavigate }) {
  const [mission, setMission] = useState(null)
  const [bulles, setBulles] = useState([])
  const [dreams, setDreams] = useState([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeDream, setActiveDream] = useState(null)
  const [userText, setUserText] = useState("")
  const channelRef = useRef(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel("sky-sync")
    return () => channelRef.current?.close()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProgress(user.id)
      fetchBulles(user.id)
      fetchDreamImages(user.id)
    }
  }, [user])

  async function fetchProgress(userId) {
    const { data } = await supabase
      .from("user_inuit_progress")
      .select("*")
      .eq("user_id", userId)
      .single()
    if (data) setMission(data)
  }

  async function fetchBulles(userId) {
    const { data, error } = await supabase
      .from("dream_stars")
      .select("id, title, emojis, culture, created_at, completed")
      .eq("creator_id", userId)
      .eq("completed", true)
      .order("created_at", { ascending: false })
    if (!error) setBulles(data || [])
  }

  async function fetchDreamImages(userId) {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("id, titre, emoji, image_url, tags, texte, date_reve")
      .eq("user_id", userId)
      .not("image_url", "is", null)
      .order("date_reve", { ascending: false })
    if (!error) setDreams(data || [])
  }

  async function removeBulle(id) {
    if (!confirm("Retirer cette bulle du ciel ?")) return
    const { error } = await supabase.from("dream_stars").delete().eq("id", id)
    if (!error) {
      setBulles(prev => prev.filter(b => b.id !== id))
      setStatus("🌀 Bulle retirée du ciel.")
      channelRef.current?.postMessage({ type: "remove", id })
    }
  }

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

  async function sendScript() {
    if (!userText.trim()) return alert("Écris ton rêve avant d’envoyer 🌙")
    try {
      await supabase.from("dream_challenges").insert({
        user_id: user.id,
        dream_id: activeDream.id,
        texte: userText.trim(),
        titre: activeDream.titre,
      })
      setUserText("")
      setActiveDream(null)
      alert("🌠 Ton rêve a été envoyé au Labo pour sélection !")
    } catch (e) {
      console.error("Erreur envoi script:", e)
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
        <p>Chargement...</p>
      )}

      {/* 🌍 Mission actuelle */}
      {mission && (
        <div style={missionCard}>
          <h4>❄️ Mission Inuite</h4>
          <p>Étape {mission.step_number}/12</p>
          {renderBadges(mission.step_number)}
          <button onClick={nextStep} style={btnGreen}>🌟 Étape suivante</button>
        </div>
      )}

      {/* 🌕 Bulles */}
      <h3 style={{ marginTop: "2rem" }}>🌕 Mes bulles</h3>
      {bulles.length > 0 ? (
        <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
          {bulles.map(b => (
            <div key={b.id} style={bulleCard}>
              <h4 style={{ color: "#7fffd4" }}>{b.title}</h4>
              <p>{b.emojis?.join(" ")}</p>
              <p style={{ fontSize: ".8rem", opacity: .6 }}>
                {new Date(b.created_at).toLocaleDateString("fr-FR")}
              </p>
              <button onClick={() => removeBulle(b.id)} style={btnRed}>
                🌀 Retirer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: .7 }}>Aucune bulle active.</p>
      )}

      {/* 🪞 Galerie des Résonances */}
      <h3 style={{ marginTop: "2rem", color: "#7fffd4" }}>🪞 Défis Oniriques</h3>
      <p style={{ fontSize: ".9rem", opacity: .8 }}>
        Clique sur une image pour écrire ton propre rêve inspiré d’elle.
      </p>
      {dreams.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: ".8rem",
            marginTop: "1rem",
          }}
        >
          {dreams.map(d => (
            <div
              key={d.id}
              onClick={() => setActiveDream(d)}
              style={{
                cursor: "pointer",
                background: "rgba(0,25,35,0.5)",
                border: "1px solid rgba(127,255,212,0.3)",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 0 8px rgba(127,255,212,0.15)",
              }}
            >
              <img
                src={d.image_url}
                alt={d.titre}
                style={{ width: "100%", height: "140px", objectFit: "cover" }}
              />
              <div style={{ padding: ".5rem" }}>
                <h4 style={{ fontSize: ".9rem", color: "#aefcf5" }}>
                  {d.emoji} {d.titre}
                </h4>
                <p style={{ fontSize: ".7rem", opacity: .6 }}>
                  {new Date(d.date_reve).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: .6 }}>Aucune image générée pour l’instant.</p>
      )}

      {/* 📝 Modale Défi */}
      {activeDream && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ color: "#7fffd4" }}>💭 Défi Onirique</h3>
            <img
              src={activeDream.image_url}
              alt={activeDream.titre}
              style={{ width: "100%", borderRadius: "8px", marginBottom: ".5rem" }}
            />
            <p style={{ fontSize: ".9rem", opacity: .8 }}>
              Inspire-toi de cette image pour écrire un rêve, une vision ou un poème onirique.
            </p>
            <textarea
              value={userText}
              onChange={e => setUserText(e.target.value)}
              rows={6}
              placeholder="Écris ton rêve ici..."
              style={{
                width: "100%",
                borderRadius: "10px",
                padding: ".5rem",
                border: "1px solid rgba(127,255,212,.3)",
                background: "rgba(0,30,30,.6)",
                color: "#e9fffd",
                marginTop: ".5rem",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".6rem" }}>
              <button onClick={() => setActiveDream(null)} style={btnGrey}>❌ Fermer</button>
              <button onClick={sendScript} style={btnGreen}>📩 Envoyer au Labo</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚪 Déconnexion */}
      <button onClick={onLogout} style={btnLogout}>🚪 Se déconnecter</button>

      {/* 🧪 Accès Labo privé */}
      {user?.id === "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97" && (
        <p
          onClick={() => onNavigate("labo-login")}
          style={{
            opacity: 0.5,
            fontSize: "0.9rem",
            marginTop: "1.2rem",
            cursor: "pointer",
          }}
        >
          🧪 Accès Labo (privé)
        </p>
      )}
    </div>
  )
}

// --- Styles (inchangés) ---
const missionCard = {
  background: "#223",
  borderRadius: "10px",
  padding: "1rem",
  width: "90%",
  margin: "1rem auto",
}
const bulleCard = {
  background: "radial-gradient(circle, #0a0f15, #000)",
  border: "1px solid #7fffd4",
  borderRadius: "12px",
  padding: "0.8rem",
}
const btnGreen = { background: "#6eff8d", border: "none", borderRadius: "8px", padding: "0.4rem 0.8rem", cursor: "pointer" }
const btnRed = { background: "#ff7070", border: "none", borderRadius: "6px", padding: ".3rem .8rem", cursor: "pointer" }
const btnGrey = { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(127,255,212,.3)", borderRadius: "8px", padding: ".4rem .8rem" }
const btnLogout = { marginTop: "2rem", background: "#ff6b6b", border: "none", borderRadius: "8px", padding: ".5rem 1rem", color: "#fff", fontWeight: "bold" }
const overlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", zIndex: 9999 }
const modal = { background: "rgba(0,20,25,.95)", borderRadius: "12px", padding: "1rem", maxWidth: "420px", width: "100%", color: "#e9fffd", boxShadow: "0 0 20px rgba(127,255,212,0.2)" }