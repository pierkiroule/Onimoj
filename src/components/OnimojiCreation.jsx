// src/components/OnimojiCreation.jsx
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { askNebius } from "../nebiusClient"

export default function OnimojiCreation({ userId, spirit, emoji, tags, onDone }) {
  const [fragments, setFragments] = useState([])
  const [selectedFrag, setSelectedFrag] = useState(null)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [aiCount, setAiCount] = useState(0)
  const [aiLoading, setAiLoading] = useState(false)

  // 🌬️ Génération de fragments uniques
  useEffect(() => {
    const base = [
      "Souffle dans la glace",
      "Mémoire du vent",
      "Silence du nord",
      "Brume des origines",
      "Chant de la mer endormie",
      "Lumière figée",
      "Trace dans la neige",
      "Ombre du souffle",
      "Écho sous la glace",
      "Respiration de la banquise",
      "Caresse du givre",
      "Appel du silence",
      "Souffle des étoiles",
      "Murmure de la glace",
      "Lueur des aurores"
    ]
    const unique = [...new Set(base)]
    setFragments(unique.sort(() => 0.5 - Math.random()).slice(0, 3))
  }, [spirit])

  // 💾 Sauvegarde complète
  async function handleSave() {
    if (!text.trim()) return alert("Écris ou valide ton fragment avant de continuer.")
    if (!selectedFrag) return alert("Choisis un titre pour ton rêve.")
    setLoading(true)
    try {
      const { error } = await supabase.from("revotheque_reves").insert({
        user_id: userId,
        titre: `${emoji} ${spirit} – Première contribution`,
        titre_user: selectedFrag,
        texte: text.trim(),
        tags,
        emoji,
        culture: "Inuite",
        spirit,
        ai_influence: aiCount,
        date_reve: new Date().toISOString().split("T")[0]
      })
      if (error) throw error
      setSaved(true)
    } catch (err) {
      console.error("⚠️ Erreur sauvegarde :", err)
      alert("Erreur pendant la sauvegarde.")
    } finally {
      setLoading(false)
    }
  }

  // 🌬️ Inspiration IA — ajoutée directement dans le texte principal
  async function handleAIInspire() {
    if (!selectedFrag) return alert("Choisis d’abord un fragment inspirant.")
    if (aiCount >= 3) return alert("🌬️ L’esprit se repose maintenant…")
    setAiLoading(true)
    try {
      const joinedTags = tags.join(", ")
      const prompt = `
Tu es un poète inuit médiumnique.
L’esprit "${spirit}" (${emoji}) te souffle un rêve à co-créer : "${selectedFrag}".
Compose une amorce poétique en 5 lignes, chaque ligne doit faire résonner ces mots-clés : ${joinedTags}.
Langage sensoriel et onirique : vent, glace, souffle, silence, eau, lumière, brume...
Le ton doit être chamanique et incarné, sans explication ni morale.
Fais sentir les sensations : voir, ressentir, entendre, toucher, respirer.
`
      const result = await askNebius(prompt, {
        model: "google/gemma-2-2b-it",
        temperature: 0.9,
      })

      const formatted = `💫 Souffle de l’esprit ${spirit} :\n${result.trim()}`
      // fusion dans le champ texte
      setText(prev => (prev ? prev + "\n\n" + formatted : formatted))
      setAiCount(aiCount + 1)
    } catch (err) {
      console.error("⚠️ Erreur inspiration IA :", err)
      alert("Erreur d'inspiration IA.")
    } finally {
      setAiLoading(false)
    }
  }

  // 🌟 Après sauvegarde
  if (saved)
    return (
      <div style={{ textAlign: "center", marginTop: "1rem", color: "#7fffd4" }}>
        🌟 Ton Onimoji est né.<br />
        <div style={{ opacity: 0.8, fontSize: ".9rem", marginTop: ".3rem" }}>
          {emoji} {selectedFrag} — enregistré le {new Date().toLocaleDateString()}
        </div>
        <button
          onClick={onDone}
          style={{
            marginTop: ".8rem",
            padding: ".6rem 1rem",
            border: "1px solid rgba(127,255,212,.5)",
            borderRadius: "10px",
            background: "rgba(127,255,212,.1)",
            color: "#e9fffd",
            cursor: "pointer"
          }}
        >
          🌕 Continuer le voyage
        </button>
      </div>
    )

  // 🌌 Interface principale
  return (
    <div
      style={{
        marginTop: "1rem",
        background: "rgba(0,20,25,0.6)",
        border: "1px solid rgba(127,255,212,0.3)",
        borderRadius: "12px",
        padding: "1rem",
        color: "#e9fffd",
      }}
    >
      <h3 style={{ color: "#7fffd4", marginBottom: ".6rem" }}>
        🌀 Première contribution – {spirit}
      </h3>

      <p style={{ fontSize: ".9rem", opacity: 0.85, marginBottom: ".8rem" }}>
        Choisis un titre qui t’appelle — un souffle, un écho, une image.  
        L’IA t’inspirera ensuite un <strong>début de rêve</strong> lié à l’esprit {emoji} {spirit}.  
        Mais <strong>tu es invité à le réécrire, le transformer, l’enrichir</strong> :  
        ajoute ton propre rythme, ta mémoire, tes sensations.
      </p>

      {/* 🌬️ Choix du fragment */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {fragments.map((f, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedFrag(f)
              setText(`« ${f} »\n`)
            }}
            style={{
              background:
                selectedFrag === f
                  ? "rgba(127,255,212,0.25)"
                  : "rgba(127,255,212,0.08)",
              border:
                selectedFrag === f
                  ? "1px solid rgba(127,255,212,0.8)"
                  : "1px solid rgba(127,255,212,0.2)",
              color: "#e9fffd",
              fontStyle: "italic",
              padding: ".4rem .8rem",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.9rem",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 📝 Champ texte principal */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Laisse l’esprit t’inspirer, puis ajoute ton souffle..."
        style={{
          width: "100%",
          padding: "0.8rem",
          borderRadius: "10px",
          border: "1px solid rgba(127,255,212,0.4)",
          background: "rgba(0,30,30,0.6)",
          color: "#e9fffd",
          fontFamily: "inherit",
          resize: "none",
          lineHeight: "1.5rem",
        }}
      />

      {/* 🔘 Boutons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: ".6rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={handleAIInspire}
          disabled={aiLoading || aiCount >= 3}
          style={{
            padding: ".5rem .9rem",
            borderRadius: "10px",
            border: "1px solid rgba(127,255,212,.6)",
            background: selectedFrag
              ? "rgba(127,255,212,.1)"
              : "rgba(127,255,212,.05)",
            color: "#7fffd4",
            cursor: selectedFrag ? "pointer" : "not-allowed",
            opacity: aiCount >= 3 ? 0.5 : 1,
          }}
        >
          {aiLoading
            ? "💫 L’esprit murmure..."
            : `🌬️ Inspiration IA (${3 - aiCount} restantes)`}
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: ".5rem 1.1rem",
            borderRadius: "10px",
            border: "1px solid rgba(127,255,212,.6)",
            background: loading ? "rgba(127,255,212,.1)" : "#7fffd4",
            color: loading ? "#7fffd4" : "#041018",
            fontWeight: "bold",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "💫 Sauvegarde..." : "✨ Valider ma contribution"}
        </button>
      </div>
    </div>
  )
}