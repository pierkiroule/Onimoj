import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./RevoTheque.css"

export default function RevoTheque() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  // 🔮 Chargement des rêves depuis la Rêvothèque
  useEffect(() => {
    async function loadDreams() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("revotheque_reves")
          .select("*")
          .order("date", { ascending: false })
        if (error) throw error
        setDreams(data || [])
      } catch (err) {
        console.error("⚠️ Erreur de chargement :", err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDreams()
  }, [])

  if (loading) return <p className="loading">🌙 Lecture des songes en cours...</p>

  return (
    <div className="revo-container fade-in">
      <h2>🌌 La Rêvothèque</h2>
      <p className="intro">
        Archives vivantes des rêves générés par Onimoji.<br />
        Chaque souffle devient un poème, chaque étoile un écho du monde intérieur.
      </p>

      {/* 🌠 Liste des rêves */}
      <div className="revo-list">
        {dreams.map((d) => (
          <div
            key={d.id}
            className="revo-card"
            onClick={() => setSelected(d)}
          >
            <div className="revo-header">
              <h3>{d.titre || "Rêve sans titre"}</h3>
              <span className="revo-date">
                {new Date(d.date).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <p className="revo-culture">
              {d.culture || "inconnue"} • {d.tags?.join(", ") || "sans tags"}
            </p>
            <p className="revo-extrait">
              {d.texte?.slice(0, 120)}...
            </p>
          </div>
        ))}
      </div>

      {/* 🌙 Modal de détail */}
      {selected && (
        <div className="revo-modal">
          <div className="revo-modal-content">
            <h3>{selected.titre}</h3>
            <p className="revo-meta">
              {selected.culture} • {selected.model_used}
            </p>
            <pre className="revo-poem">{selected.texte}</pre>

            {selected.tags?.length > 0 && (
              <div className="revo-tags">
                {selected.tags.map((t) => (
                  <span key={t} className="revo-tag">#{t}</span>
                ))}
              </div>
            )}

            <button className="revo-close" onClick={() => setSelected(null)}>
              ✨ Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}