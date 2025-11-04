import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { askNebiusImage } from "../nebiusClient"

export default function DreamEcho({ userId }) {
  const [myDreams, setMyDreams] = useState([])
  const [gifts, setGifts] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState("")
  const [previewImg, setPreviewImg] = useState(null)
  const [infoMsg, setInfoMsg] = useState("")
  const [loading, setLoading] = useState(false)

  // === CHARGEMENT INITIAL ===
  useEffect(() => {
    loadMyDreams()
    loadGifts()
  }, [])

  async function loadMyDreams() {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("*")
      .eq("user_id", userId)
      .order("date_reve", { ascending: false })
    if (!error) setMyDreams(data || [])
  }

  async function loadGifts() {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from("revo_chats")
      .select("*")
      .eq("to_user", userId)
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
    if (!error) setGifts(data || [])
  }

  // === GÉNÉRER & OFFRIR UN RÊVE ===
  async function offerDream(d) {
    if (d.envol || d.image_url) {
      alert("🌬️ Ce rêve s’est déjà envolé vers un autre monde.")
      return
    }

    const ok = confirm(`🎁 Souhaites-tu vraiment offrir le rêve "${d.titre}" ?`)
    if (!ok) return

    setLoading(true)
    setInfoMsg("✨ Génération de la résonance onirique en cours...")

    // 🔮 Génération d'image Nebius
    const prompt = `${d.emoji || "🌬️"} ${d.titre}. ${d.texte?.slice(0, 200)}. 
    Style onirique, lumineux, inuit, brume, vent, glace, rêve projectif.`
    const imageDataUrl = await askNebiusImage(prompt)

    setLoading(false)

    if (!imageDataUrl) {
      alert("⚠️ Échec de la génération de l’image Nebius.")
      setInfoMsg("")
      return
    }

    // 🌠 Affiche l’image générée dans la modale
    setPreviewImg({ dataUrl: imageDataUrl, dream: d })
    setInfoMsg("")
  }

  // === FERMETURE DE LA MODALE (ENREGISTREMENT + DON) ===
  async function closePreview(save = true) {
    if (save && previewImg?.dream) {
      const d = previewImg.dream

      // 💾 Sauvegarde l’image et marque comme envolé
      await supabase
        .from("revotheque_reves")
        .update({ image_url: previewImg.dataUrl, envol: true })
        .eq("id", d.id)

      // 🎁 Don automatique à un autre utilisateur
      const { data: users } = await supabase
        .from("profiles")
        .select("user_id")
        .neq("user_id", userId)
      if (users?.length) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000)

        const { data: chat } = await supabase
          .from("revo_chats")
          .insert({
            from_user: userId,
            to_user: randomUser.user_id,
            reve_id: d.id,
            expires_at: expiresAt,
          })
          .select()
          .single()

        await supabase.from("revo_chat_messages").insert({
          chat_id: chat.id,
          sender: userId,
          content: `💫 Je t’offre mon rêve : "${d.titre}"\n\n${d.texte}`,
        })
      }

      setInfoMsg("🌌 Image enregistrée dans ta galerie Kado•° et rêve offert au vent.")
      loadMyDreams()
    }
    setPreviewImg(null)
  }

  // === CHAT ===
  async function openChat(chat) {
    setActiveChat(chat)
    const { data } = await supabase
      .from("revo_chat_messages")
      .select("*")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (!newMsg.trim() || !activeChat) return
    const { error } = await supabase.from("revo_chat_messages").insert({
      chat_id: activeChat.id,
      sender: userId,
      content: newMsg.trim(),
    })
    if (!error) {
      setMessages([
        ...messages,
        { chat_id: activeChat.id, sender: userId, content: newMsg.trim() },
      ])
      setNewMsg("")
    }
  }

  // === RENDU ===
  return (
    <div style={{ padding: "1rem", color: "#e9fffd" }}>
      <h2 style={{ textAlign: "center", color: "#7fffd4" }}>🌌 DonOnirique</h2>

      {loading && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>{infoMsg}</p>
      )}

      {/* 🌕 Mes rêves */}
      <h3 style={{ marginTop: "1rem", color: "#7fffd4" }}>🌕 Mes Rêves</h3>

      {myDreams.length === 0 && (
        <p style={{ opacity: 0.6 }}>Aucun rêve pour l’instant.</p>
      )}

      <div style={gridContainer}>
        {myDreams.map((d) => (
          <div key={d.id} style={cardStyle}>
            <h4>{d.emoji} {d.titre}</h4>

            {d.image_url ? (
              <img
                src={d.image_url}
                alt="Résonance"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: ".4rem",
                  boxShadow: "0 0 10px rgba(127,255,212,.3)",
                }}
              />
            ) : (
              <div
                style={{
                  height: "160px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7fffd4",
                  fontSize: ".8rem",
                  opacity: 0.6,
                }}
              >
                Aucune image générée
              </div>
            )}

            <p style={{ fontSize: ".9rem", opacity: 0.8 }}>
              {d.texte?.slice(0, 100)}...
            </p>

            {!d.envol && !d.image_url && (
              <button onClick={() => offerDream(d)} style={btnPrimary}>
                🎁 Offrir à un inconnu
              </button>
            )}

            {(d.envol || d.image_url) && (
              <span style={{ fontSize: ".8rem", opacity: 0.6 }}>
                🌬️ Déjà offert
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 💫 KadoOniriques reçus */}
      <h3 style={{ marginTop: "2rem", color: "#7fffd4" }}>💫 KadoOniriques reçus</h3>

      {gifts.length === 0 && (
        <p style={{ opacity: 0.6 }}>Aucun rêve reçu pour le moment.</p>
      )}

      {gifts.map((g) => (
        <div key={g.id} style={cardStyle}>
          <p style={{ opacity: 0.9 }}>
            🎁 Rêve offert par {g.from_user.slice(0, 6)}
          </p>
          <button onClick={() => openChat(g)} style={btnSecondary}>
            💭 Ouvrir le chat onirique
          </button>
        </div>
      ))}

      {/* 💬 Chat éphémère */}
      {activeChat && (
        <div style={chatOverlay}>
          <div style={chatBox}>
            <h3 style={{ color: "#7fffd4" }}>💭 Échange onirique</h3>
            <div style={chatMessages}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: m.sender === userId ? "right" : "left",
                    margin: ".4rem 0",
                    opacity: 0.9,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: ".4rem .6rem",
                      borderRadius: "12px",
                      background:
                        m.sender === userId
                          ? "rgba(127,255,212,.2)"
                          : "rgba(255,255,255,.08)",
                    }}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              rows={2}
              placeholder="Écris ton souffle..."
              style={textArea}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setActiveChat(null)} style={btnSecondary}>
                ✨ Fermer
              </button>
              <button onClick={sendMessage} style={btnPrimary}>
                ➤ Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌠 Modale image générée */}
      {previewImg && (
        <div style={previewOverlay}>
          <div style={previewBox}>
            <h3 style={{ color: "#7fffd4" }}>🌬️ Résonance générée</h3>
            <img
              src={previewImg.dataUrl}
              alt="Image onirique"
              style={{ width: "100%", borderRadius: "12px", margin: "1rem 0" }}
            />
            <button onClick={() => closePreview(true)} style={btnPrimary}>
              ✨ Enregistrer & offrir
            </button>
          </div>
        </div>
      )}

      {infoMsg && (
        <p style={{ marginTop: "1rem", color: "#7fffd4", textAlign: "center" }}>{infoMsg}</p>
      )}
    </div>
  )
}

/* === Styles === */
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0.8rem",
  marginTop: "1rem",
}
const cardStyle = {
  background: "rgba(0,25,35,.5)",
  border: "1px solid rgba(127,255,212,.3)",
  borderRadius: "10px",
  padding: "0.8rem",
  textAlign: "center",
}
const btnPrimary = {
  border: "none",
  borderRadius: "8px",
  padding: ".4rem .8rem",
  background: "linear-gradient(90deg, #7fffd4, #6a5acd)",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: ".4rem",
}
const btnSecondary = {
  border: "1px solid rgba(127,255,212,.4)",
  borderRadius: "8px",
  padding: ".3rem .8rem",
  background: "rgba(127,255,212,.1)",
  color: "#7fffd4",
  cursor: "pointer",
  marginTop: ".4rem",
}
const chatOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  zIndex: 999,
}
const chatBox = {
  background: "rgba(0,20,25,.95)",
  borderRadius: "12px",
  padding: "1rem",
  maxWidth: "420px",
  width: "100%",
  color: "#e9fffd",
}
const chatMessages = {
  maxHeight: "280px",
  overflowY: "auto",
  marginBottom: ".6rem",
  padding: ".3rem",
  background: "rgba(0,0,0,.2)",
  borderRadius: "8px",
}
const textArea = {
  width: "100%",
  borderRadius: "10px",
  padding: ".5rem",
  border: "1px solid rgba(127,255,212,.3)",
  background: "rgba(0,30,30,.6)",
  color: "#e9fffd",
  resize: "none",
  marginBottom: ".6rem",
}
const previewOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
  animation: "fadeIn 0.5s ease",
}
const previewBox = {
  background: "rgba(10,20,25,0.95)",
  padding: "1rem",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "420px",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(127,255,212,.3)",
}