import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import EchoSky from "./EchoSky"

export default function ResoCalcul() {
  const [stars, setStars] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState("🌀 Calcul en cours...")
  const [refreshing, setRefreshing] = useState(false)

  // 🔁 Fonction principale
  async function refreshData() {
    setRefreshing(true)
    setStatus("🧮 Recalcul des résonances...")

    try {
      // 1️⃣ Appel à la fonction PostgreSQL
      const { error: rpcError } = await supabase.rpc("update_star_resonances_with_divergence")
      if (rpcError) throw rpcError

      // 2️⃣ Récupère toutes les étoiles
      const { data: starsData, error: starsError } = await supabase
        .from("dream_stars")
        .select("id, title, resonance_level, harmonic_balance, divergence, x, y")
      if (starsError) throw starsError

      // 3️⃣ Récupère les liens (top 300 max)
      const { data: linksData, error: linksError } = await supabase
        .from("star_links")
        .select("star_a, star_b, total_strength, emoji_similarity, resonance_similarity")
        .gt("total_strength", 0.01)
        .limit(300)
      if (linksError) throw linksError

      setStars(starsData)
      setLinks(linksData)
      setStatus(`🌌 ${starsData.length} étoiles — ${linksData.length} liens.`)
    } catch (e) {
      console.error(e)
      setStatus("⚠️ Erreur de résonance cosmique.")
    } finally {
      setRefreshing(false)
    }
  }

  // 🔂 Auto-chargement au montage
  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div style={{ textAlign: "center", color: "#eee" }}>
      <h2>🌠 Champ de Résonance Cosmique</h2>
      <p>{status}</p>

      {stars.length > 0 && (
        <EchoSky stars={stars} links={links} onSelect={(s) => alert(`⭐ ${s.title}`)} />
      )}

      <button
        onClick={refreshData}
        disabled={refreshing}
        style={{
          marginTop: "1rem",
          background: "linear-gradient(145deg,#6eff8d,#35a0ff)",
          border: "none",
          borderRadius: "10px",
          padding: "0.6rem 1.3rem",
          fontWeight: "bold",
          cursor: "pointer",
          color: "#111",
        }}
      >
        {refreshing ? "✨ Recalcul..." : "🔁 Recalculer les résonances"}
      </button>
    </div>
  )
}