// src/pages/Labo.jsx
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Labo({ onNavigate, session: initialSession }) {
  const [session, setSession] = useState(initialSession)
  const user = session?.user
  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [media, setMedia] = useState(null)
  const [type, setType] = useState("texte")
  const [message, setMessage] = useState("")
  const [recent, setRecent] = useState([])
  const [challenges, setChallenges] = useState([])
  const [sending, setSending] = useState(false)

  // ✅ Session Supabase
  useEffect(() => {
    async function restore() {
      const { data } = await supabase.auth.getSession()
      if (data?.session) setSession(data.session)
    }
    restore()
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => listener?.subscription?.unsubscribe?.()
  }, [])

  // 🔁 Chargement
  useEffect(() => {
    fetchRecent()
    fetchChallenges()
  }, [])

  async function fetchRecent() {
    const { data } = await supabase
      .from("echoressources")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
    setRecent(data || [])
  }

  async function fetchChallenges() {
    const { data } = await supabase
      .from("dream_challenges")
      .select("id, user_id, titre, texte, created_at")
      .order("created_at", { ascending: false })
    setChallenges(data || [])
  }

  // 💾 Publication personnelle
  async function handleSubmit(e) {
    e.preventDefault()
    setMessage("")

    if (!user) return setMessage("⚠️ Non authentifié.")
    if (!titre.trim()) return setMessage("⚠️ Titre requis.")

    setSending(true)
    try {
      let mediaUrl = null
      if (media) {
        const path = `${user.id}/${Date.now()}_${media.name}`
        const { error: uploadError } = await supabase.storage
          .from("echomedia")
          .upload(path, media)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from("echomedia").getPublicUrl(path)
        mediaUrl = urlData.publicUrl
      }

      const { error } = await supabase.from("echoressources").insert([
        {
          titre,
          description,
          type,
          url: mediaUrl,
          user_id: user.id,
          visible: true,
        },
      ])
      if (error) throw error

      setMessage("🌙 Rêve partagé avec succès !")
      setTitre("")
      setDescription("")
      setMedia(null)
      fetchRecent()
    } catch (err) {
      console.error(err)
      setMessage("❌ Erreur d’envoi")
    } finally {
      setSending(false)
    }
  }

  // ✏️ Modification en direct du texte du défi
  async function updateChallengeText(id, newText) {
    const { error } = await supabase
      .from("dream_challenges")
      .update({ texte: newText })
      .eq("id", id)
    if (error) console.error("Erreur maj défi:", error.message)
  }

  // 🚀 Transfert vers echoressources (publication)
  async function transferToEcho(c) {
    if (!confirm(`Publier le rêve « ${c.titre} » en notification ?`)) return
    try {
      const { error } = await supabase.from("echoressources").insert([
        {
          titre: c.titre,
          description: c.texte,
          type: "texte",
          user_id: user.id,
          visible: true,
        },
      ])
      if (error) throw error
      alert("✨ Rêve transféré vers les Échos !")
      fetchRecent()
    } catch (err) {
      console.error("Erreur transfert:", err)
      alert("⚠️ Échec du transfert.")
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setMessage("🚪 Déconnecté.")
  }

  return (
    <div style={pageStyle}>
      <h2>🧪 Labo des Rêves des Gardiens</h2>
      <p style={{ opacity: 0.8 }}>
        Ici s’élaborent les <strong>rêves partagés et les défis oniriques</strong> du Révonet.
      </p>

      {/* 🔐 Profil */}
      <p style={{ opacity: 0.6, fontSize: ".85rem" }}>
        {user ? `👤 ${user.email}` : "⚠️ Non connecté"}
      </p>
      {user && <button onClick={handleLogout} style={logoutBtn}>🚪 Déconnexion</button>}

      {/* 💭 Défis oniriques reçus */}
      <div style={recentBox}>
        <h3 style={{ color: "#7fffd4" }}>💭 Défis oniriques reçus</h3>
        {challenges.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Aucun défi reçu pour l’instant...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {challenges.map((c) => (
              <li key={c.id} style={challengeItem}>
                <strong style={{ color: "#aefcf5" }}>{c.titre}</strong>
                <textarea
                  defaultValue={c.texte}
                  onChange={(e) => updateChallengeText(c.id, e.target.value)}
                  rows={4}
                  style={textArea}
                />
                <p style={{ fontSize: ".75rem", opacity: 0.6 }}>
                  ✍️ {c.user_id.slice(0, 6)} — {new Date(c.created_at).toLocaleString("fr-FR")}
                </p>
                <button onClick={() => transferToEcho(c)} style={publishBtn}>
                  🚀 Transférer en notification
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🌌 Créations personnelles */}
      <div style={formStyle}>
        <h3>🌠 Nouvelle création onirique</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={inputStyle}
            required
          />
          <textarea
            placeholder="Description ou texte poétique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ ...inputStyle, resize: "none" }}
          />
          <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
            <option value="texte">📝 Texte</option>
            <option value="image">🖼️ Image</option>
            <option value="audio">🎧 Audio</option>
            <option value="video">🎞️ Vidéo</option>
          </select>

          <input
            type="file"
            accept={type === "image" ? "image/*" : type === "audio" ? "audio/*" : type === "video" ? "video/*" : "*/*"}
            onChange={(e) => setMedia(e.target.files[0])}
            style={{ marginTop: ".6rem" }}
          />
          <button type="submit" disabled={sending} style={submitBtn}>
            {sending ? "⏳ Envoi..." : "✨ Partager"}
          </button>
        </form>
        {message && (
          <p style={{ color: message.startsWith("🌙") ? "#7fffd4" : "#ff7070", marginTop: ".5rem" }}>
            {message}
          </p>
        )}
      </div>

      {/* 🪶 Dernières créations publiées */}
      <div style={recentBox}>
        <h3 style={{ color: "#7fffd4" }}>🌕 Rêves publiés</h3>
        {recent.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Aucun rêve partagé pour l’instant...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recent.map((r) => (
              <li key={r.id} style={recentItem}>
                <strong>{r.titre}</strong>
                <p style={{ opacity: 0.8 }}>{r.description}</p>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    Ouvrir média ↗
                  </a>
                )}
                <p style={{ fontSize: ".75rem", opacity: 0.6 }}>
                  {new Date(r.created_at).toLocaleString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => onNavigate("home")} style={backBtn}>
        ⬅️ Retour à l’accueil
      </button>
    </div>
  )
}

/* 🎨 Styles */
const pageStyle = { color: "#fff", textAlign: "center", marginTop: "6vh", paddingBottom: "5rem" }
const formStyle = { background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "1.2rem", width: "90%", maxWidth: 480, margin: "1.5rem auto" }
const inputStyle = { width: "100%", marginBottom: "0.6rem", padding: "0.6rem", borderRadius: "6px", border: "1px solid #7fffd440", background: "rgba(0,0,0,0.3)", color: "#fff" }
const selectStyle = { background: "rgba(0,0,0,0.4)", border: "1px solid #7fffd440", color: "#7fffd4", borderRadius: "6px", padding: "0.3rem 0.5rem", width: "100%", marginBottom: ".8rem" }
const submitBtn = { background: "linear-gradient(90deg, #6a5acd, #7fffd4)", border: "none", borderRadius: 8, padding: ".6rem 1.6rem", color: "#111", fontWeight: "bold", cursor: "pointer" }
const logoutBtn = { background: "rgba(255,255,255,0.1)", border: "1px solid #7fffd4", borderRadius: 8, padding: ".4rem 1rem", color: "#7fffd4", fontWeight: 600, marginTop: ".6rem", cursor: "pointer" }
const recentBox = { background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: 10, width: "90%", maxWidth: 500, margin: "1rem auto" }
const recentItem = { margin: ".5rem 0", borderBottom: "1px solid #333", paddingBottom: ".4rem" }
const linkStyle = { color: "#7fffd4", fontWeight: "bold", textDecoration: "none" }
const challengeItem = { marginBottom: ".8rem", background: "rgba(0,0,0,0.3)", padding: ".8rem", borderRadius: "8px", border: "1px solid rgba(127,255,212,.3)" }
const textArea = { width: "100%", borderRadius: "8px", border: "1px solid rgba(127,255,212,.4)", background: "rgba(0,30,30,.6)", color: "#e9fffd", padding: ".5rem", resize: "none", marginTop: ".3rem" }
const publishBtn = { background: "rgba(127,255,212,0.15)", border: "1px solid #7fffd4", borderRadius: "8px", padding: ".3rem .8rem", color: "#7fffd4", cursor: "pointer", marginTop: ".4rem" }
const backBtn = { marginTop: "1.2rem", background: "transparent", border: "1px solid #7fffd4", borderRadius: 8, padding: ".4rem 1rem", color: "#7fffd4", cursor: "pointer" }