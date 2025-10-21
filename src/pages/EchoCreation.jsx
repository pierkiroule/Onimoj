import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import EchoSky from "../components/EchoSky"
import EchoStarModal from "../components/EchoStarModal"

export default function EchoCreation() {
  const [stars, setStars] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState("🌌 Connexion au champ de résonance…")
  const [selectedStar, setSelectedStar] = useState(null)

  // 🔭 Chargement des étoiles et liens
  useEffect(() => {
    async function load() {
      try {
        const { data: starsData, error: sErr } = await supabase
          .from("dream_stars")
          .select("*")
        if (sErr) throw sErr

        const { data: linksData, error: lErr } = await supabase
          .from("star_links")
          .select("*")
        if (lErr) throw lErr

        setStars(
          (starsData || []).map((s) => ({
            ...s,
            resonance_level: Number(s.resonance_level) || 0.5,
            harmonic_balance: Number(s.harmonic_balance) || 0.5,
            divergence: Number(s.divergence) || 0.2,
          }))
        )
        setLinks(linksData || [])
        setStatus(`✨ ${starsData?.length || 0} étoiles détectées`)
      } catch (err) {
        console.error(err)
        setStatus("⚠️ Impossible de capter les étoiles.")
      }
    }
    load()
  }, [])

  return (
    <div className="fade-in" style={{ color: "#eee", textAlign: "center" }}>
      <h2>🌠 Champ de Résonance Cosmique</h2>
      <p style={{ opacity: 0.8 }}>{status}</p>

      <EchoSky
        stars={stars}
        links={links}
        onSelect={(star) => setSelectedStar(star)}
      />

      {selectedStar && (
        <EchoStarModal
          star={selectedStar}
          onClose={() => setSelectedStar(null)}
        />
      )}
    </div>
  )
}