// src/components/AmesSoeursConstellation.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import EchoStarModal from "./EchoStarModal"
import "./AmesSoeursConstellation.css"

export default function AmesSoeursConstellation({ currentUserId }) {
  const [ames, setAmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      if (!currentUserId) return
      try {
        const { data, error } = await supabase
          .from("view_ames_soeurs_summary")
          .select("top_ames")
          .eq("user_id", currentUserId)
          .single()

        if (error) throw error
        console.log("🧠 Âmes sœurs détectées :", data)
        setAmes(data?.top_ames || [])
      } catch (err) {
        console.error("⚠️ Erreur chargement âmes sœurs :", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUserId])

  if (loading) return <p style={{ color: "#7fffd4" }}>🌌 Connexion aux âmes sœurs...</p>
  if (!ames.length) return <p style={{ opacity: 0.6 }}>Aucune âme sœur onirique détectée.</p>

  return (
    <div className="constellation">
      {/* 🌕 Centre de la constellation */}
      <div className="centre-ame">
        <div className="halo" />
        <span className="coeur">🌕</span>
      </div>

      {/* 💫 Bulles orbitantes */}
      {ames.map((a, i) => {
        const score = a.resonance_score || 0.5
        const size = 40 + score * 40
        const orbit = 100 + i * 70
        const angle = (i / ames.length) * 2 * Math.PI

        return (
          <div
            key={a.autre_user}
            className="bulle-ame"
            style={{
              "--angle": `${angle}rad`,
              "--orbit": `${orbit}px`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${i * 0.8}s`,
            }}
            title={`Âme sœur ${a.autre_user.slice(0, 4)}…`}
            onClick={() => setSelected(a)}
          >
            <span>💫</span>
          </div>
        )
      })}

      {/* 💠 Modale Rêvothèque */}
      {selected && (
        <EchoStarModal
          star={{
            id: selected.autre_user,
            name: `Âme sœur ${selected.autre_user.slice(0, 4)}…`,
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}