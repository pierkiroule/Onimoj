import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { inuitSteps } from "../data/inuitSteps"
import SpiritGraphModal from "../components/SpiritGraphModal"
import DreamMeteo from "../components/DreamMeteo"
import DreamPulse from "../components/DreamPulse"

export default function EchoReso() {
  const [selectedSpirit, setSelectedSpirit] = useState(null)
  const [meteoData, setMeteoData] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🌐 Charger la météo onirique depuis la vue SQL
  useEffect(() => {
    async function loadMeteo() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("v_dream_meteo").select("*").single()
        if (error) throw error
        setMeteoData(data)
      } catch (err) {
        console.error("⚠️ Erreur chargement météo :", err)
        // Valeurs par défaut si pas de data
        setMeteoData({
          avg_activity: 5,
          tags: "souffle, horizon, étoile, silence, neige",
          dominant_culture: "Inuite",
        })
      } finally {
        setLoading(false)
      }
    }
    loadMeteo()
  }, [])

  return (
    <div
      className="echoreso-page fade-in"
      style={{
        textAlign: "center",
        color: "#e9fffd",
        overflow: selectedSpirit ? "hidden" : "visible",
        minHeight: "100vh",
        position: "relative",
        background: "radial-gradient(circle at 50% 20%, #020d0f, #000)",
        paddingBottom: "3rem",
      }}
    >
      <h2
        style={{
          color: "#7fffd4",
          marginTop: "1rem",
          textShadow: "0 0 10px rgba(127,255,212,0.4)",
        }}
      >
        🌀 Résonances de notre inconscient partagé
      </h2>

      {/* 🌐 Cercle des 12 esprits */}
      {!selectedSpirit && (
        <div
          style={{
            position: "relative",
            width: "320px",
            height: "320px",
            margin: "2rem auto",
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 50%, #021014, #000)",
            boxShadow: "0 0 25px rgba(127,255,212,0.4)",
          }}
        >
          {/* 🌐 Bulle centrale : Global */}
          <button
            onClick={() => setSelectedSpirit({ spirit_name: "Global", symbol: "🌐" })}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "rgba(127,255,212,0.1)",
              border: "1px solid #7fffd4",
              borderRadius: "50%",
              width: "70px",
              height: "70px",
              fontSize: "26px",
              color: "#7fffd4",
              cursor: "pointer",
              boxShadow: "0 0 12px rgba(127,255,212,0.4)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)")
            }
          >
            🌐
          </button>

          {/* 🌙 12 esprits autour */}
          {inuitSteps.map((s, i) => {
            const angle = (i / 12) * 2 * Math.PI
            const radius = 130
            const x = 150 + radius * Math.cos(angle)
            const y = 150 + radius * Math.sin(angle)
            return (
              <button
                key={s.step_number}
                onClick={() => setSelectedSpirit(s)}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)",
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  opacity: 0.85,
                  transition: "transform 0.3s, opacity 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.3)"
                  e.currentTarget.style.opacity = 1
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)"
                  e.currentTarget.style.opacity = 0.85
                }}
              >
                {s.symbol}
              </button>
            )
          })}
        </div>
      )}

      {/* 🌈 Météo onirique */}
      {!selectedSpirit && !loading && (
        <div
          style={{
            marginTop: "1rem",
            textAlign: "center",
            padding: "1rem",
            borderRadius: "12px",
            background: "radial-gradient(circle at 50% 50%, #021014, #000)",
            boxShadow: "0 0 20px rgba(127,255,212,0.3)",
            color: "#e9fffd",
            maxWidth: "360px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <DreamMeteo data={meteoData} />
        </div>
      )}

      {/* 🌌 Animation hypnonirique reliée à la base */}
      {!selectedSpirit && meteoData && (
        <DreamPulse
          activity={meteoData.avg_activity || 5}
          tags={
            meteoData.tags
              ? meteoData.tags.split(",").map((t) => t.trim())
              : ["souffle", "étoile", "glace", "silence"]
          }
          images={[
            "/assets/aurora_dream.jpg",
            "/assets/ice_breath.jpg",
            "/assets/whale_spirit.jpg",
          ]}
        />
      )}

      {/* 🌌 Modale graphique */}
      {selectedSpirit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
          }}
        >
          <SpiritGraphModal
            spirit={selectedSpirit}
            onClose={() => setSelectedSpirit(null)}
          />
        </div>
      )}

      <footer
        style={{
          opacity: 0.6,
          marginTop: "1.5rem",
          fontSize: "0.8rem",
        }}
      >
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}