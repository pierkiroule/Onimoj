// src/pages/Revotheque.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import StarPreview from "../components/StarPreview"

export default function Revotheque({ userId }) {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [errText, setErrText] = useState("")
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      setDreams([])
      setErrText("")
      return
    }
    loadDreams(userId)
  }, [userId])

  async function loadDreams(currentUserId = userId) {
    if (!currentUserId) return

    setErrText("")
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("dreams")
        .select(`
          id, titre, contenu, tags, image_url, created_at,
          visible, expired_at, guardian_id, user_id,
          echo_count, echo_max
        `)
        .eq("user_id", currentUserId)
        .is("expired_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error
      setDreams(data || [])
    } catch (e) {
      setErrText(e.message || "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  async function toggleVisibility(id, newState) {
    try {
      const { error } = await supabase
        .from("dreams")
        .update({ visible: newState })
        .eq("id", id)

      if (error) throw error
      alert(newState ? "🌌 Rêve offert au Réso•°" : "💤 Rêve retiré du Réso•°")
      setSelected(null)
      loadDreams()
    } catch (e) {
      alert("⚠️ Erreur de mise à jour : " + e.message)
    }
  }

  const stripEmoji = (str = "") =>
    str.replace(/^[\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\u200D\s]+/u, "").trim()

  if (loading)
    return <p style={{ color: "#7fffd4", textAlign: "center" }}>Chargement…</p>

  return (
    <div style={{ color: "#e9fffd", textAlign: "center", padding: "1rem" }}>
      <h2 style={{ color: "#7fffd4" }}>💤 Ma Rêvothèque</h2>
      <p style={{ opacity: 0.75, marginTop: "-.2rem" }}>
        Tes rêves privés et ceux offerts au Réso•°.
      </p>

      {errText && <p style={{ color: "#ff9999" }}>⚠️ {errText}</p>}
      {dreams.length === 0 && !errText && <p>Aucun rêve enregistré 🌙</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {dreams.map((d) => {
          const title = stripEmoji(d.titre || "Sans titre")

          return (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              style={{
                textAlign: "left",
                background: d.visible
                  ? "rgba(0,50,60,0.6)"
                  : "rgba(0,25,35,0.5)",
                border: `1px solid ${
                  d.visible
                    ? "rgba(127,255,212,0.5)"
                    : "rgba(127,255,212,0.3)"
                }`,
                borderRadius: "12px",
                padding: ".6rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <div style={{ fontWeight: 700, color: "#aefcf5" }}>{title}</div>

              {d.image_url && (
                <img
                  src={d.image_url}
                  alt={title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginTop: ".5rem",
                    boxShadow: "0 0 10px rgba(127,255,212,.15)",
                  }}
                />
              )}

              <div
                style={{
                  fontSize: ".8rem",
                  opacity: 0.7,
                  marginTop: ".4rem",
                }}
              >
                {d.visible ? "🌌 Offert au Réso•°" : "🔒 Privé"}
              </div>
            </button>
          )
        })}
      </div>

      {/* Modal étoile */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.7)",
            display: "grid",
            placeItems: "center",
            padding: "1rem",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 440,
              background: "rgba(0,20,25,.95)",
              border: "1px solid rgba(127,255,212,.25)",
              borderRadius: "14px",
              padding: "1rem",
              color: "#e9fffd",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <StarPreview
                words={(selected.tags || []).slice(0, 5)}
                centerEmoji="💤"
                echoCount={selected.echo_count || 0}
                echoMax={selected.echo_max || 6}
              />
            </div>

            <h3
              style={{
                textAlign: "center",
                color: "#aefcf5",
                marginTop: ".6rem",
              }}
            >
              💤 {stripEmoji(selected.titre || "Sans titre")}
            </h3>

            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.titre}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: ".5rem",
                  boxShadow: "0 0 20px rgba(127,255,212,.25)",
                }}
              />
            )}

            {selected.contenu && (
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  lineHeight: "1.55",
                  marginTop: ".8rem",
                  opacity: 0.95,
                }}
              >
                {selected.contenu}
              </pre>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: ".6rem",
                marginTop: ".8rem",
                fontSize: ".86rem",
                opacity: 0.8,
              }}
            >
              <span>Gardien #{selected.guardian_id || "—"}</span>
              <span>
                {new Date(selected.created_at || Date.now()).toLocaleDateString("fr-FR")}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: ".6rem",
                marginTop: ".9rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  toggleVisibility(selected.id, !selected.visible)
                }
                style={{
                  border: "1px solid rgba(127,255,212,.5)",
                  background: selected.visible
                    ? "rgba(255,120,120,0.15)"
                    : "rgba(127,255,212,0.15)",
                  borderRadius: "8px",
                  padding: ".45rem .9rem",
                  color: selected.visible ? "#ffb3b3" : "#7fffd4",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {selected.visible
                  ? "💤 Retirer du Réso•°"
                  : "🎁 Offrir au Réso•°"}
              </button>

              <button
                onClick={() => setSelected(null)}
                style={{
                  border: "1px solid rgba(127,255,212,.5)",
                  background: "transparent",
                  borderRadius: "8px",
                  padding: ".45rem .9rem",
                  color: "#7fffd4",
                  cursor: "pointer",
                }}
              >
                ✨ Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}