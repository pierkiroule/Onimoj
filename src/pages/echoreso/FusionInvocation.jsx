import { useState } from "react"
import { supabase } from "../../supabaseClient"

export default function FusionInvocation({ userId, parents = [], onFusionDone }) {
  const [loading, setLoading] = useState(false)
  const [fusionDone, setFusionDone] = useState(false)
  const [newStar, setNewStar] = useState(null)

  async function handleFusion() {
    if (parents.length !== 2 || !userId) return
    setLoading(true)

    try {
      // 🔮 Récupère les deux parents
      const { data: parentData, error: e1 } = await supabase
        .from("onimoji")
        .select("*")
        .in("id", parents)
      if (e1) throw e1
      const [p1, p2] = parentData

      // 🌠 Fusion symbolique
      const mergedTags = Array.from(new Set([...(p1.tags || []), ...(p2.tags || [])]))
        .slice(0, 5)
      const childTitle = `${p1.titre.split(",")[0]} ✨ ${p2.titre.split(",")[0]}`
      const childSpirit = `${p1.spirit.split(" ")[0]}-${p2.spirit.split(" ")[0]}`
      const childEmoji = Math.random() > 0.5 ? p1.emoji : p2.emoji

      // 🎇 Création enfant dans la table onimoji
      const { data: newOnimoji, error: e2 } = await supabase
        .from("onimoji")
        .insert([
          {
            user_id: userId,
            emoji: childEmoji,
            titre: childTitle,
            texte: `Fusion de ${p1.titre} et ${p2.titre}. Un nouvel esprit du rêve est né.`,
            tags: mergedTags,
            culture: "Collective",
            spirit: childSpirit,
            visible: true,
            shared: true,
          },
        ])
        .select()
        .single()
      if (e2) throw e2

      // 🌌 Liens de filiation
      const { error: e3 } = await supabase.from("resonance_links").insert([
        { source_id: parents[0], target_id: newOnimoji.id, strength: 0.8 },
        { source_id: parents[1], target_id: newOnimoji.id, strength: 0.8 },
      ])
      if (e3) throw e3

      // ✅ Succès
      setNewStar(newOnimoji)
      setFusionDone(true)
      if (onFusionDone) onFusionDone()
    } catch (err) {
      console.error("❌ Erreur fusion :", err)
      alert("Erreur lors de la fusion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
      {!fusionDone ? (
        <>
          <p style={{ fontSize: ".9rem", opacity: 0.85 }}>
            ✨ Fusion en préparation entre <b>{parents.length}</b> gardiens…
          </p>
          <button
            onClick={handleFusion}
            disabled={loading}
            style={{
              background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
              color: "#111",
              border: "none",
              borderRadius: "10px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "🌌 Invocation…" : "🌠 Invoquer le nouvel esprit"}
          </button>
        </>
      ) : (
        <div style={{ animation: "pulse 3s infinite", marginTop: "1rem" }}>
          <h3 style={{ color: "#7fffd4" }}>
            {newStar?.emoji || "🌟"} {newStar?.titre}
          </h3>
          <p style={{ opacity: 0.8 }}>
            est né de la rencontre entre deux gardiens.  
            Une nouvelle étoile résonne dans la constellation collective.
          </p>
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </div>
  )
}