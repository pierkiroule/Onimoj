import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import EchoResoGraph from "./EchoResoGraph"
import FusionButton from "./FusionButton"

export default function EchoReso({ userId }) {
  const [selectedDreams, setSelectedDreams] = useState([])

  // Sélection max 2 rêves
  function handleSelectParents(ids) {
    setSelectedDreams(ids.slice(0, 2))
  }

  return (
    <div style={{ color: "#e9fffd", textAlign: "center", padding: "1rem" }}>
      <h2 style={{ color: "#7fffd4" }}>🌌 ÉchoReso•°</h2>
      <p style={{ opacity: 0.8 }}>
        Sélectionne <b>2 rêves vivants</b> pour les fusionner en un nouveau ✨
      </p>

      {/* Graphe onirique */}
      <EchoResoGraph userId={userId} onSelectParents={handleSelectParents} />

      {/* Bouton de fusion */}
      <FusionButton
        parents={selectedDreams}
        userId={userId}
        onFusionDone={() => {
          setSelectedDreams([])
        }}
      />
    </div>
  )
}