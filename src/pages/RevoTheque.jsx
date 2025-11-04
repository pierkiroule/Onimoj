// src/pages/RevoTheque.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function RevoTheque({ userId, voyage = "Mission Inuite" }) {
  const [tab, setTab] = useState("my")
  const [dreams, setDreams] = useState([])
  const [voyageMembers, setVoyageMembers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedDream, setSelectedDream] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")

  // === Chargement de mes rêves ===
  async function loadDreams() {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("*")
      .eq("user_id", userId)
      .order("date_reve", { ascending: false })
    if (!error) setDreams(data || [])
  }

  // === Membres du voyage ===
  async function loadMembers() {
    const { data, error } = await supabase
      .from("voyage_members")
      .select("*")
      .eq("voyage", voyage)
    if (!error) setVoyageMembers(data || [])
  }

  // === Rêves publics d'un membre ===
  async function loadUserDreams(id) {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("*")
      .eq("user_id", id)
      .eq("visible", true)
      .order("date_reve", { ascending: false })
    if (!error) setDreams(data || [])
  }

  // === Rêves publics de tous ===
  async function loadPublicDreams() {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("*")
      .eq("visible", true)
      .order("date_reve", { ascending: false })
    if (!error) setDreams(data || [])
  }

  useEffect(() => {
    if (tab === "my") loadDreams()
    if (tab === "voyage") loadMembers()
    if (tab === "explore") loadPublicDreams()
  }, [tab])

  // === Visibilité ===
  async function toggleVisibility(dream) {
    const { error } = await supabase
      .from("revotheque_reves")
      .update({ visible: !dream.visible })
      .eq("id", dream.id)
    if (!error) loadDreams()
  }

  // === Like ===
  async function likeDream(dream) {
    const { error } = await supabase
      .from("revotheque_reves")
      .update({ likes: (dream.likes || 0) + 1 })
      .eq("id", dream.id)
    if (!error) loadPublicDreams()
  }

  // === Commentaires ===
  async function loadComments(reveId) {
    const { data, error } = await supabase
      .from("revotheque_comments")
      .select("*")
      .eq("reve_id", reveId)
      .order("created_at", { ascending: true })
    if (!error) setComments(data || [])
  }

  async function addComment(reveId) {
    if (!newComment.trim()) return
    const { error } = await supabase.from("revotheque_comments").insert({
      reve_id: reveId,
      user_id: userId,
      author_name: userId.slice(0, 6),
      comment: newComment.trim(),
    })
    if (!error) {
      setNewComment("")
      loadComments(reveId)
    }
  }

  // === MODAL ===
  const openDream = async (d) => {
    setSelectedDream(d)
    await loadComments(d.id)
  }

  return (
    <div style={{ padding: "1rem", color: "#e9fffd" }}>
      <h2 style={{ textAlign: "center", color: "#7fffd4" }}>🌌 Rêvothèque</h2>

      {/* Onglets */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        {["my", "voyage", "explore"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setSelectedUser(null)
              setSelectedDream(null)
            }}
            style={{
              margin: "0 .3rem",
              padding: ".4rem .8rem",
              borderRadius: "8px",
              border: "1px solid rgba(127,255,212,.4)",
              background: tab === t ? "rgba(127,255,212,.15)" : "transparent",
              color: tab === t ? "#7fffd4" : "#b9dede",
              cursor: "pointer",
            }}
          >
            {t === "my"
              ? "🌙 Mes rêves"
              : t === "voyage"
              ? "🧭 Voyage"
              : "🌐 Explorer"}
          </button>
        ))}
      </div>

      {/* === Onglet MES RÊVES === */}
      {tab === "my" && (
        <div>
          {dreams.map((d) => (
            <div
              key={d.id}
              style={{
                border: "1px solid rgba(127,255,212,.3)",
                borderRadius: "10px",
                padding: ".6rem",
                marginBottom: ".6rem",
                background: "rgba(0,30,40,.4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, color: "#aefcf5" }}>
                  {d.emoji} {d.titre_user || d.titre}
                </h3>
                <span style={{ fontSize: ".8rem", opacity: 0.8 }}>
                  {new Date(d.date_reve).toLocaleDateString("fr-FR")}
                </span>
              </div>

              <p style={{ opacity: 0.8, fontSize: ".9rem" }}>
                {d.texte?.slice(0, 120)}...
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => toggleVisibility(d)}
                  style={{
                    background: "transparent",
                    color: d.visible ? "#7fffd4" : "#999",
                    border: "1px solid rgba(127,255,212,.3)",
                    borderRadius: "6px",
                    padding: ".3rem .6rem",
                    cursor: "pointer",
                  }}
                >
                  {d.visible ? "🌐 Visible" : "🔒 Privé"}
                </button>
                <button
                  onClick={() => openDream(d)}
                  style={{
                    background: "transparent",
                    color: "#bdefff",
                    border: "1px solid rgba(127,255,212,.3)",
                    borderRadius: "6px",
                    padding: ".3rem .6rem",
                    cursor: "pointer",
                  }}
                >
                  🔍 Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Onglet VOYAGE === */}
      {tab === "voyage" && !selectedUser && (
        <div style={{ textAlign: "center" }}>
          <p style={{ opacity: 0.8 }}>Membres du voyage {voyage} :</p>
          {voyageMembers.map((m) => (
            <button
              key={m.user_id}
              onClick={() => {
                setSelectedUser(m.user_id)
                loadUserDreams(m.user_id)
              }}
              style={{
                display: "block",
                margin: ".3rem auto",
                padding: ".4rem .8rem",
                borderRadius: "8px",
                border: "1px solid rgba(127,255,212,.3)",
                background: "rgba(0,30,40,.4)",
                color: "#e9fffd",
                cursor: "pointer",
              }}
            >
              👤 Voyageur {m.user_id.slice(0, 6)}
            </button>
          ))}
        </div>
      )}

      {/* Rêves du membre sélectionné */}
      {tab === "voyage" && selectedUser && (
        <div>
          <button
            onClick={() => setSelectedUser(null)}
            style={{
              marginBottom: ".5rem",
              border: "none",
              background: "transparent",
              color: "#7fffd4",
              cursor: "pointer",
            }}
          >
            ← Retour aux membres
          </button>
          {dreams.map((d) => (
            <div
              key={d.id}
              style={{
                border: "1px solid rgba(127,255,212,.3)",
                borderRadius: "10px",
                padding: ".6rem",
                marginBottom: ".6rem",
                background: "rgba(0,30,40,.4)",
              }}
              onClick={() => openDream(d)}
            >
              <h3 style={{ margin: 0, color: "#aefcf5" }}>
                {d.emoji} {d.titre_user}
              </h3>
              <p style={{ fontSize: ".9rem", opacity: 0.8 }}>
                {d.texte?.slice(0, 100)}...
              </p>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>
                ❤️ {d.likes || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Onglet EXPLORER === */}
      {tab === "explore" && (
        <div>
          {dreams.map((d) => (
            <div
              key={d.id}
              style={{
                border: "1px solid rgba(127,255,212,.3)",
                borderRadius: "10px",
                padding: ".6rem",
                marginBottom: ".6rem",
                background: "rgba(0,30,40,.4)",
              }}
              onClick={() => openDream(d)}
            >
              <h3 style={{ margin: 0, color: "#aefcf5" }}>
                {d.emoji} {d.titre_user}
              </h3>
              <p style={{ fontSize: ".9rem", opacity: 0.8 }}>
                {d.texte?.slice(0, 100)}...
              </p>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>
                ❤️ {d.likes || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === MODAL DÉTAIL === */}
      {selectedDream && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              background: "rgba(0,20,25,.95)",
              borderRadius: "12px",
              padding: "1rem",
              maxWidth: "400px",
              width: "100%",
              color: "#e9fffd",
            }}
          >
            <h3>
              {selectedDream.emoji} {selectedDream.titre_user}
            </h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                lineHeight: "1.5rem",
                opacity: 0.9,
              }}
            >
              {selectedDream.texte}
            </pre>

            <div style={{ display: "flex", gap: ".6rem", marginTop: ".6rem" }}>
              <button
                onClick={() => likeDream(selectedDream)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#ffb3b3",
                  cursor: "pointer",
                }}
              >
                ❤️ {selectedDream.likes || 0}
              </button>
              <button
                onClick={() => setSelectedDream(null)}
                style={{
                  border: "1px solid rgba(127,255,212,.5)",
                  background: "transparent",
                  borderRadius: "6px",
                  padding: ".3rem .6rem",
                  color: "#7fffd4",
                  cursor: "pointer",
                }}
              >
                ✨ Fermer
              </button>
            </div>

            {/* Commentaires */}
            <div style={{ marginTop: ".8rem" }}>
              <h4 style={{ color: "#7fffd4", marginBottom: ".3rem" }}>
                💭 Commentaires
              </h4>
              {comments.map((c) => (
                <div key={c.id} style={{ fontSize: ".85rem", marginBottom: ".3rem" }}>
                  <strong>{c.author_name}</strong> : {c.comment}
                </div>
              ))}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                placeholder="Écrire un commentaire..."
                style={{
                  width: "100%",
                  marginTop: ".3rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(127,255,212,.4)",
                  background: "rgba(0,30,30,.6)",
                  color: "#e9fffd",
                  padding: ".4rem",
                  resize: "none",
                }}
              />
              <button
                onClick={() => addComment(selectedDream.id)}
                style={{
                  marginTop: ".3rem",
                  border: "1px solid rgba(127,255,212,.5)",
                  background: "rgba(127,255,212,.1)",
                  borderRadius: "8px",
                  color: "#7fffd4",
                  padding: ".3rem .7rem",
                  cursor: "pointer",
                }}
              >
                ➤ Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}