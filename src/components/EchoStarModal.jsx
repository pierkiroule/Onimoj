import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./EchoStarModal.css"

export default function EchoStarModal({ star, onClose }) {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // === Charger les rêves du user sélectionné ===
  useEffect(() => {
    if (!star?.id) return
    async function loadDreams() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("revotheque_reves")
          .select("id, titre, texte, date, likes")
          .eq("user_id", star.id)
          .order("date", { ascending: false })
        if (error) throw error
        setDreams(data || [])
      } catch (err) {
        console.error("⚠️ Erreur chargement rêves :", err)
        setDreams([])
      } finally {
        setLoading(false)
      }
    }
    loadDreams()
  }, [star])

  // === Ajouter une contribution ===
  async function handleAddContribution(dreamId, text) {
    if (!text.trim()) return
    try {
      setSaving(true)
      const { error } = await supabase.from("dream_contributions").insert([
        {
          dream_star_id: dreamId,
          contributor_id: star.id,
          text_fragment: text.trim(),
        },
      ])
      if (error) throw error
      alert("✨ Contribution enregistrée !")
    } catch (err) {
      console.error("⚠️ Erreur contribution :", err)
    } finally {
      setSaving(false)
    }
  }

  // === Gérer les likes ===
  async function handleLike(dreamId) {
    try {
      const dream = dreams.find((d) => d.id === dreamId)
      if (!dream) return
      const newLikes = (dream.likes || 0) + 1

      const { error } = await supabase
        .from("revotheque_reves")
        .update({ likes: newLikes })
        .eq("id", dreamId)
      if (error) throw error

      setDreams((prev) =>
        prev.map((d) => (d.id === dreamId ? { ...d, likes: newLikes } : d))
      )
    } catch (err) {
      console.error("⚠️ Erreur like :", err)
    }
  }

  const totalResonance = dreams.reduce(
    (sum, d) => sum + (d.likes || 0),
    0
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <button className="close-btn" onClick={onClose}>✖</button>

        <h3>🌟 Rêvothèque de {star.name}</h3>
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          🔮 Résonance collective : <b>{totalResonance}</b> 💗
        </p>

        {loading ? (
          <p style={{ opacity: 0.7 }}>Chargement…</p>
        ) : dreams.length > 0 ? (
          <div className="dream-list">
            {dreams.map((d) => (
              <DreamCard
                key={d.id}
                dream={d}
                onContribute={(txt) => handleAddContribution(d.id, txt)}
                onLike={() => handleLike(d.id)}
                saving={saving}
              />
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.6 }}>Aucun rêve enregistré pour cet utilisateur.</p>
        )}
      </div>
    </div>
  )
}

// === Carte Rêve ===
function DreamCard({ dream, onContribute, onLike, saving }) {
  const [text, setText] = useState("")
  const [show, setShow] = useState(false)

  return (
    <div className="dream-card">
      <h4>{dream.titre}</h4>
      <p>{dream.texte}</p>
      <small style={{ opacity: 0.6 }}>
        {new Date(dream.date).toLocaleDateString()}
      </small>

      <div className="dream-actions">
        <button className="like-btn" onClick={onLike}>
          💗 {dream.likes || 0}
        </button>
        <button className="inspire-btn" onClick={() => setShow(!show)}>
          {show ? "💭 Fermer" : "💫 Contribuer"}
        </button>
      </div>

      {show && (
        <div className="dream-contribute">
          <textarea
            placeholder="Écris ton inspiration, ton écho..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => {
              onContribute(text)
              setText("")
              setShow(false)
            }}
            disabled={saving || !text.trim()}
          >
            {saving ? "✨ Envoi..." : "🌙 Envoyer"}
          </button>
        </div>
      )}
    </div>
  )
}