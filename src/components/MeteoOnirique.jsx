import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function MeteoOnirique() {
  const [stars, setStars] = useState([])
  const [status, setStatus] = useState("Chargement de la météo onirique…")

  async function fetchData() {
    try {
      const { data, error } = await supabase
        .from("dream_stars")
        .select("id, title, resonance_level, divergence_score, poetic_chain")

      if (error) throw error
      if (!data || data.length === 0) {
        setStars([])
        setStatus("🌫️ Aucun signal dans le ciel onirique.")
        return
      }

      setStars(data)
      setStatus("")
    } catch (err) {
      console.error("⚠️ Erreur lors du relevé du ciel onirique:", err.message)
      setStatus("⚠️ Erreur lors du relevé du ciel onirique.")
      setTimeout(fetchData, 20000)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (!stars.length)
    return (
      <div
        style={{
          textAlign: "center",
          color: "#bff",
          fontSize: "0.9rem",
          opacity: 0.7,
          marginTop: "1rem",
        }}
      >
        {status}
      </div>
    )

  // 🌠 Calculs
  const totalStars = stars.length
  const totalFragments = stars.reduce(
    (sum, s) => sum + (s.poetic_chain?.length || 0),
    0
  )
  const avgResonance =
    stars.reduce((acc, s) => acc + (s.resonance_level || 0), 0) / totalStars
  const avgDivergence =
    stars.reduce((acc, s) => acc + (s.divergence_score || 0), 0) / totalStars

  // 🌈 Humeur collective
  let moodLabel = "Silence cosmique"
  let moodColor = "#bff"

  if (totalFragments > 80 && avgResonance > 0.7)
    (moodLabel = "Aurore flamboyante"), (moodColor = "#ffb347")
  else if (avgResonance > 0.6)
    (moodLabel = "Brise rêveuse"), (moodColor = "#8efcff")
  else if (avgDivergence > 0.5)
    (moodLabel = "Nébuleuse agitée"), (moodColor = "#ff9a3c")
  else if (totalFragments > 20)
    (moodLabel = "Murmure d’étoiles"), (moodColor = "#cfdfff")

  return (
    <div
      style={{
        marginTop: "1rem",
        textAlign: "center",
        background: "rgba(255,255,255,0.05)",
        borderRadius: "10px",
        padding: "0.8rem",
        color: "#bff",
        fontSize: "0.9rem",
        maxWidth: "360px",
        marginInline: "auto",
        boxShadow: "0 0 15px rgba(100,200,255,0.2)",
        transition: "all 0.8s ease",
      }}
    >
      <h4
        style={{
          margin: "0 0 0.3rem 0",
          color: moodColor,
          textShadow: `0 0 6px ${moodColor}99`,
          transition: "color 1s ease",
        }}
      >
        🌦️ MétéOnirique
      </h4>
      <p style={{ margin: "0.3rem 0", opacity: 0.8 }}>
        ✨ {totalStars} étoiles actives • 🪶 {totalFragments} fragments tissés
      </p>
      <p
        style={{
          margin: 0,
          color: moodColor,
          fontWeight: "bold",
          transition: "color 1s ease",
        }}
      >
        Humeur du cosmos : <strong>{moodLabel}</strong>
      </p>
      <p style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.3rem" }}>
        Résonance moyenne : {(avgResonance * 100).toFixed(0)}% • Divergence :{" "}
        {(avgDivergence * 100).toFixed(0)}%
      </p>
    </div>
  )
}