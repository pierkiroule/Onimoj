import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function Labo({ onNavigate, session }) {
  const user = session?.user
  const [titre, setTitre] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [visible, setVisible] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState("")
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetchRecent()
  }, [])

  async function fetchRecent() {
    const { data, error } = await supabase
      .from("echoressources")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
    if (error) console.error("Erreur chargement:", error.message)
    setRecent(data || [])
  }
console.log("👤 Session test :", session)
console.log("👤 User ID :", session?.user?.id)
  async function handleSubmit(e) {
    e.preventDefault()
    setMessage("")

    if (!user) {
      setMessage("⚠️ Non authentifié. Merci de te reconnecter.")
      return
    }
    if (!titre.trim() || !url.trim()) {
      setMessage("⚠️ Titre et lien requis.")
      return
    }

    setSending(true)
    try {
      const { data, error } = await supabase
        .from("echoressources")
        .insert([
          {
            titre,
            description,
            url,
            visible,
            user_read: false,
            user_id: user.id,
          },
        ])
        .select()

      if (error) throw error

      setMessage("✅ ÉchoRessource envoyée !")
      setTitre("")
      setDescription("")
      setUrl("")
      fetchRecent()
    } catch (err) {
      console.error("Erreur insertion:", err)
      setMessage("❌ " + (err.message || JSON.stringify(err)))
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ color: "#fff", textAlign: "center", marginTop: "8vh" }}>
      <h2>🧪 Labo des ÉchoRessources</h2>
      <p style={{ opacity: 0.8 }}>
        Crée et diffuse des Rêvonances vers les explorateurs Onimoji.
      </p>
      <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
        {user ? `👤 ${user.id.slice(0, 8)}…` : "⚠️ Non authentifié"}
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: "1.5rem",
          width: "90%",
          maxWidth: 500,
          margin: "2rem auto",
          boxShadow: "0 0 14px rgba(127,255,212,0.2)",
        }}
      >
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          style={{ ...inputStyle, resize: "none" }}
        />
        <input
          type="url"
          placeholder="Lien web (https://…)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={inputStyle}
        />
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={visible}
            onChange={(e) => setVisible(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Visible pour les explorateurs
        </label>
        <button type="submit" disabled={sending} style={buttonStyle}>
          {sending ? "⏳ Envoi..." : "✨ Ajouter l’ÉchoRessource"}
        </button>
        {message && (
          <p
            style={{
              marginTop: "1rem",
              color: message.startsWith("✅") ? "#7fffd4" : "#ff8080",
            }}
          >
            {message}
          </p>
        )}
      </form>

      {/* Liste des dernières */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          padding: "1rem",
          borderRadius: 10,
          width: "90%",
          maxWidth: 500,
          margin: "0 auto",
        }}
      >
        <h3 style={{ color: "#7fffd4" }}>Dernières ÉchoRessources</h3>
        {recent.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Aucune pour le moment…</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recent.map((r) => (
              <li
                key={r.id}
                style={{
                  margin: "0.5rem 0",
                  borderBottom: "1px solid #333",
                  paddingBottom: "0.4rem",
                }}
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#7fffd4",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  {r.titre}
                </a>
                {r.description && (
                  <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    {r.description}
                  </p>
                )}
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                  {new Date(r.created_at).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => onNavigate("home")}
        style={{
          marginTop: "1.2rem",
          background: "transparent",
          border: "1px solid #7fffd4",
          borderRadius: 8,
          padding: "0.4rem 1rem",
          color: "#7fffd4",
          cursor: "pointer",
        }}
      >
        ⬅️ Retour à l’accueil
      </button>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  marginBottom: "0.8rem",
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #7fffd440",
  background: "rgba(0,0,0,0.3)",
  color: "#fff",
}

const buttonStyle = {
  background: "linear-gradient(90deg, #6a5acd, #7fffd4)",
  border: "none",
  borderRadius: 8,
  padding: "0.6rem 1.6rem",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
}