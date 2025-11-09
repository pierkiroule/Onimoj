// src/pages/echoreso/EchoResoNetwork.jsx
import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import EchoResoGraph from "./EchoResoGraph"
import FusionButton from "./FusionButton"

export default function EchoResoNetwork({ userId }) {
  const [dreams, setDreams] = useState([])
  const [selectedParents, setSelectedParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDreams()
  }, [])

  async function loadDreams() {
    try {
      setLoading(true)
      setError("")

      const { data, error } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, image_url, created_at, guardian_id, visible, expired_at")
        .eq("visible", true)
        .is("expired_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error
      setDreams(data || [])
    } catch (err) {
      console.error("⚠️ Erreur de chargement :", err)
      setError(err.message || "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  function toggleSelect(id) {
    setSelectedParents((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  return (
    <div style={{ color: "#e9fffd", textAlign: "center" }}>
      <h3 style={{ color: "#7fffd4" }}>🔮 Réseau Onirique</h3>
      <p style={{ opacity: 0.8 }}>
        Sélectionne deux rêves vivants pour les fusionner.
      </p>

      {loading && <p>Chargement du réseau...</p>}
      {error && <p style={{ color: "#ff9999" }}>⚠️ {error}</p>}

      {!loading && dreams.length === 0 && (
        <p>Aucun rêve actif pour l’instant 🌙</p>
      )}

      {!loading && dreams.length > 0 && (
        <>
          <EchoResoGraph
            data={dreams}
            selected={selectedParents}
            onSelect={toggleSelect}
          />

          {selectedParents.length === 2 && (
            <FusionButton
              parents={selectedParents}
              creatorId={userId}
              onFusionDone={loadDreams}
            />
          )}
        </>
      )}
    </div>
  )
}