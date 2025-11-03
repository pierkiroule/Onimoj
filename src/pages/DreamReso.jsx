import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import DreamGraph from "../components/DreamGraph"
import DreamScriptCard from "../components/DreamScriptCard"

export default function DreamReso({ userId }) {
  const [network, setNetwork] = useState([])
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // 🧩 1. Réseau des résonances (communautés oniriques)
        const { data: netData, error: netError } = await supabase.rpc("get_resonance_network")
        if (netError) throw netError
        setNetwork(netData || [])

        // 📜 2. Rêves partagés (hypno-scripts récents)
        const { data: scriptsData, error: sErr } = await supabase
          .from("revotheque_reves")
          .select("id, titre, texte, date, spirit, culture, emoji, tags")
          .order("date", { ascending: false })
          .limit(5)
        if (sErr) throw sErr
        setScripts(scriptsData || [])
      } catch (err) {
        console.error("⚠️ Erreur DreamReso:", err)
        setError(err.message || "Erreur inconnue.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // === 🌀 État de chargement ===
  if (loading) {
    return (
      <div
        style={{
          color: "#7fffd4",
          textAlign: "center",
          marginTop: "25vh",
          opacity: 0.8,
          fontSize: "1.1rem",
        }}
      >
        🌌 Connexion aux résonances oniriques...
      </div>
    )
  }

  // === ⚠️ Erreur ===
  if (error) {
    return (
      <div
        style={{
          color: "#ffb3b3",
          textAlign: "center",
          marginTop: "25vh",
          fontStyle: "italic",
        }}
      >
        ⚠️ Impossible de charger les résonances.  
        <br />
        <small style={{ opacity: 0.7 }}>{error}</small>
      </div>
    )
  }

  // === 🌌 Contenu principal ===
  return (
    <div
      style={{
        padding: "1rem",
        color: "#e9fffd",
        textAlign: "center",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#7fffd4", marginBottom: "1rem" }}>
        🌌 ÉchoReso•° — Résonances oniriques
      </h2>

      {/* 🌠 Réseau communautaire */}
      {network.length > 0 ? (
        <DreamGraph nodes={network} currentUserId={userId} />
      ) : (
        <p
          style={{
            opacity: 0.7,
            fontStyle: "italic",
            marginTop: "1rem",
          }}
        >
          🌙 Aucun voyageur résonant détecté pour l’instant...
        </p>
      )}

      {/* 📜 Scripts récents */}
      <h3 style={{ marginTop: "2rem", color: "#9ae7ff" }}>
        📜 Scripts hypno-oniriques partagés
      </h3>

      {scripts.length > 0 ? (
        scripts.map((s) => <DreamScriptCard key={s.id} script={s} />)
      ) : (
        <p
          style={{
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Aucun script cocréé pour le moment.
        </p>
      )}

      <footer style={{ marginTop: "2rem", opacity: 0.6, fontSize: "0.8rem" }}>
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}