import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function DreamMeteo() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMeteo() {
      const { data, error } = await supabase.from("v_dream_meteo").select("*").single()
      if (error) {
        console.error("⚠️ Erreur météo :", error)
        setError(error.message)
      } else {
        setData(data)
      }
    }
    loadMeteo()
  }, [])

  if (error) {
    return <p style={{ color: "#ffb3b3" }}>⚠️ {error}</p>
  }

  if (!data) {
    return <p style={{ opacity: 0.6 }}>🌬️ Lecture du souffle collectif...</p>
  }

  // ✨ Petites métriques formatées
  const act = Math.round(data.avg_activity || 0)
  const dreamers = data.active_dreamers || 0
  const total = data.total_onimoji || 0
  const tags = data.tags?.split(", ").slice(0, 5).join(", ") || "..."

  // 💭 Génération d’un texte suggestif
  const phrase =
    act > 10
      ? "L’aurore onirique danse fort aujourd’hui — les rêves s’embrasent."
      : act > 5
      ? "Le vent du Nord transporte des songes calmes et résonants."
      : "Une paix boréale s’étend sur les rêves partagés."

  return (
    <div style={{ animation: "pulseGlow 8s ease-in-out infinite alternate" }}>
      <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>
        🌀 Météo onirique du jour
      </h3>
      <p
        style={{
          fontStyle: "italic",
          fontSize: "0.9rem",
          opacity: 0.85,
          lineHeight: "1.3rem",
        }}
      >
        {phrase}
      </p>

      <p style={{ marginTop: "0.8rem", fontSize: "0.85rem", opacity: 0.9 }}>
        🌙 {dreamers} rêveurs actifs <br />
        ✨ {total} onimojis offerts <br />
        💭 Thèmes dominants : <span style={{ color: "#ffe68a" }}>{tags}</span>
      </p>
    </div>
  )
}