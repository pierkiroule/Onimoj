import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import EchoSky from "../components/EchoSky"
import EchoStarModal from "../components/EchoStarModal"
import ResonantMoon from "../components/ResonantMoon"

export default function EchoCreation() {
  const [stars, setStars] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState("🌌 Connexion au champ de résonance…")
  const [selectedStar, setSelectedStar] = useState(null)

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

        setStars(starsData || [])
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
    <div
      className="fade-in"
      style={{
        position: "relative",
        color: "#eee",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <h2>🌠 Champ de Résonance Cosmique</h2>
      <p style={{ opacity: 0.8 }}>{status}</p>

      {/* 🌌 Fond du ciel */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <EchoSky
          stars={stars}
          links={links}
          onSelect={(star) => setSelectedStar(star)}
        />
      </div>

      {/* 🌘 Lune Résonante */}
      <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 5 }}>
        <ResonantMoon />
      </div>

      {selectedStar && (
        <EchoStarModal star={selectedStar} onClose={() => setSelectedStar(null)} />
      )}
    </div>
  )
}