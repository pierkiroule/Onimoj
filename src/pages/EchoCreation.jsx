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

  // 🔄 Chargement initial des étoiles et liens
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

  // 🌐 Synchro avec Profil.jsx (BroadcastChannel)
  useEffect(() => {
    const channel = new BroadcastChannel("sky-sync")

    channel.onmessage = (e) => {
      if (e.data?.type === "remove") {
        const id = e.data.id
        console.log("🌀 Bulle retirée du ciel (synchro locale) :", id)
        // fade-out avant suppression
        setStars((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, fading: true } : s
          )
        )
        setTimeout(() => {
          setStars((prev) => prev.filter((s) => s.id !== id))
        }, 600)
      }
    }

    return () => channel.close()
  }, [])

  return (
    <div
      className="fade-in"
      style={{
        position: "relative",
        color: "#eee",
        textAlign: "center",
        overflow: "hidden",
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 40%, #02060a, #000)",
      }}
    >
      <h2 style={{ marginTop: "1rem" }}>🌠 Champ de Résonance Cosmique</h2>
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
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
        }}
      >
        <ResonantMoon />
      </div>

      {/* 🌟 Détails d'une étoile sélectionnée */}
      {selectedStar && (
        <EchoStarModal
          star={selectedStar}
          onClose={() => setSelectedStar(null)}
        />
      )}

      {/* 🌙 Style fade-out */}
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.96); }
            to { opacity: 1; transform: scale(1); }
          }
          .fading {
            opacity: 0;
            transition: opacity 0.6s ease-out;
          }
        `}
      </style>
    </div>
  )
}