import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import StarPreview from "../../components/StarPreview"

export default function EchoResoCosmogonie() {
  const [dreams, setDreams] = useState([])
  const [selected, setSelected] = useState(null)
  const [likes, setLikes] = useState({})
  const [inputText, setInputText] = useState("")

  useEffect(() => {
    loadDreams()
  }, [])

  async function loadDreams() {
    try {
      const { data, error } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, emoji, visible")
        .eq("visible", true)
        .limit(12)
      let rows = data || []
      if (!rows.length) {
        rows = [
          { id: "1", titre: "Souffle polaire", emoji: "🌬️", tags: ["vent", "glace"], contenu: "Un souffle traverse la nuit boréale..." },
          { id: "2", titre: "Aurore boréale", emoji: "🌌", tags: ["lumière", "nuit"], contenu: "Sous les ciels verts, la terre rêve encore..." },
          { id: "3", titre: "Rêve de mousse", emoji: "🌿", tags: ["terre", "brume"], contenu: "Le sol respire, couvert d’un manteau tendre..." },
          { id: "4", titre: "Mémoire d’eau", emoji: "💧", tags: ["mer", "reflet"], contenu: "Chaque vague se souvient d’un visage..." },
          { id: "5", titre: "Flamme douce", emoji: "🔥", tags: ["chaleur", "ombre"], contenu: "Une flamme veille dans la neige..." },
        ]
      }
      // placement circulaire
      const radius = 32
      const center = { x: 50, y: 50 }
      const placed = rows.map((d, i) => {
        const ang = (i / rows.length) * 2 * Math.PI
        return {
          ...d,
          x: center.x + radius * Math.cos(ang),
          y: center.y + radius * Math.sin(ang),
        }
      })
      setDreams(placed)
    } catch (e) {
      console.error("⚠️ Erreur chargement :", e)
    }
  }

  function addLike(id) {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "90vh",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 50%, #001820, #000710 90%)",
      }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes drift {
          0% { transform: translateX(0px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0px); }
        }
      `}</style>

      {/* bulles flottantes */}
      {dreams.map((d, i) => (
        <div
          key={d.id}
          onClick={() => setSelected(d)}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            transform: "translate(-50%,-50%)",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 20%, #aefcf5, rgba(0,40,40,0.6))",
            boxShadow: "0 0 20px rgba(127,255,212,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            animation: `float ${6 + i % 3}s ease-in-out infinite alternate, drift ${
              10 + i % 5
            }s ease-in-out infinite alternate`,
          }}
        >
          <div style={{ fontSize: "1.8rem" }}>{d.emoji || "✨"}</div>
        </div>
      ))}

      {/* modale du rêve */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "rgba(0,30,40,0.95)",
              border: "1px solid rgba(127,255,212,0.4)",
              borderRadius: "12px",
              padding: "1rem",
              textAlign: "center",
              color: "#e9fffd",
              width: "90%",
              maxWidth: 420,
              boxShadow: "0 0 20px rgba(127,255,212,0.3)",
            }}
          >
            <h3>{selected.emoji} {selected.titre}</h3>

            <StarPreview
              words={selected.tags || []}
              centerEmoji={selected.emoji || "✨"}
            />

            <p style={{ opacity: 0.85, marginTop: ".8rem" }}>
              {selected.contenu}
            </p>

            {/* champ de contribution */}
            <textarea
              rows={3}
              placeholder="Ajoute ton écho, ton ressenti..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                width: "100%",
                marginTop: ".8rem",
                borderRadius: "8px",
                background: "rgba(0,20,25,0.6)",
                border: "1px solid rgba(127,255,212,0.3)",
                color: "#e9fffd",
                padding: ".4rem",
              }}
            />

            <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", marginTop: ".8rem" }}>
              <button
                onClick={() => {
                  addLike(selected.id)
                  alert("💖 Merci pour ton écho !")
                }}
                style={{
                  background: "rgba(127,255,212,0.2)",
                  border: "1px solid rgba(127,255,212,0.4)",
                  borderRadius: "8px",
                  padding: ".4rem .8rem",
                  color: "#7fffd4",
                  cursor: "pointer",
                }}
              >
                👍 {likes[selected.id] || 0}
              </button>

              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(127,255,212,0.3)",
                  borderRadius: "8px",
                  padding: ".4rem .8rem",
                  color: "#bff",
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