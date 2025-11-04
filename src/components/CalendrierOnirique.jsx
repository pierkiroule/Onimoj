import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./CalendrierOnirique.css"

export default function CalendrierOnirique() {
  const [reves, setReves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReves() {
      const { data, error } = await supabase
        .from("view_echoressources_notifs")
        .select("*")
        .order("planned_at", { ascending: true })

      if (error) {
        console.error("⚠️ Erreur chargement calendrier :", error.message)
      } else {
        setReves(data || [])
      }
      setLoading(false)
    }
    loadReves()
  }, [])

  if (loading) return <p className="oniriq-loading">Chargement des rêves...</p>

  return (
    <div className="calendrier-container fade-in">
      <h2 className="calendrier-title">🌙 Calendrier Onirique</h2>
      <p className="calendrier-subtitle">
        Chaque bulle est une rêvonance planifiée : une trace du rêve qui vient.
      </p>

      <div className="timeline">
        {reves.length === 0 ? (
          <p>Aucun rêve enregistré pour l’instant...</p>
        ) : (
          reves.map((r, i) => (
            <div key={r.echo_id || i} className="timeline-item">
              <div className={`bulle ${r.notif_read ? "read" : "unread"}`}>
                <span className="bulle-emoji">💫</span>
              </div>

              <div className="timeline-content">
                <h3>{r.titre}</h3>
                {r.description && <p>{r.description}</p>}
                {r.planned_at && (
                  <p className="timeline-date">
                    📅 {new Date(r.planned_at).toLocaleString("fr-FR")}
                  </p>
                )}
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="timeline-link"
                  >
                    Voir la ressource ↗
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}