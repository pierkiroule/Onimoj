import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./MiroirResonant.css"

export default function MiroirResonant() {
  const [resonances, setResonances] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadResonances() {
      try {
        const { data, error } = await supabase
          .from("view_top_resonances")
          .select("*")
        if (error) throw error
        setResonances(data || [])
      } catch (err) {
        console.error("⚠️ Erreur Miroir :", err)
        setError("Impossible de capter les résonances.")
      } finally {
        setLoading(false)
      }
    }
    loadResonances()
  }, [])

  if (loading) return <p className="miroir-status">🌌 Connexion au miroir…</p>
  if (error) return <p className="miroir-status error">{error}</p>

  return (
    <div className="miroir-resonant fade-in">
      <h3>🪞 Miroir de Résonance</h3>
      <p className="miroir-sub">
        Les 10 liens cosmiques les plus vibrants du ciel
      </p>

      <div className="miroir-list">
        {resonances.map((r) => (
          <div key={r.link_id} className="miroir-item">
            <div className="miroir-header">
              <span className="miroir-titre">
                {r.star_a_title || "—"} ↔ {r.star_b_title || "—"}
              </span>
              <div className="miroir-bar">
                <div
                  className="miroir-bar-fill"
                  style={{ width: `${r.total_strength * 100}%` }}
                />
              </div>
            </div>

            <div className="miroir-content">
              <span className="miroir-emoji">
                {(r.emojis_a || []).join(" ")} ✨ {(r.emojis_b || []).join(" ")}
              </span>
              {r.merged_tags?.length > 0 && (
                <div className="miroir-tags">
                  {r.merged_tags.slice(0, 6).map((t, i) => (
                    <span key={i} className="miroir-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}