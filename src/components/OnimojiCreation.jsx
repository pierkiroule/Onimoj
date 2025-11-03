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
  const [aiText, setAiText] = useState("")

  // 🌬️ Fragments courts et suggestifs
  useEffect(() => {
    const exemples = [
      "Souffle dans la glace",
      "Mémoire du vent",
      "Silence du nord",
      "Brume des origines",
      "Chant de la mer endormie",
      "Lumière figée",
      "Trace dans la neige",
      "Ombre du souffle",
      "Écho sous la glace",
      "Respiration de la banquise"
    ]
    setFragments(exemples.sort(() => 0.5 - Math.random()).slice(0, 3))
  }, [spirit])

  // 💾 Sauvegarde
  async function handleSave() {
    if (!text.trim()) return alert("Écris ou valide ton fragment avant de continuer.")
    setLoading(true)
    try {
      const { error } = await supabase.from("revotheque_reves").insert({
        user_id: userId,
        titre: `${emoji} ${spirit} – Première contribution`,
        texte: text.trim(),
        tags,
        emoji,
        culture: "Inuite",
        spirit
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

  // 🌬️ Inspiration IA — utilise fragment + tags + esprit
  async function handleAIInspire() {
    if (!selectedFrag) return alert("Choisis d’abord un fragment inspirant.")
    if (aiCount >= 3) return alert("🌬️ L’esprit se repose maintenant…")
    setAiLoading(true)
    try {
      const joinedTags = tags.join(", ")
      const prompt = `
Tu es un poète inuit médiumnique.
L’esprit "${spirit}" (${emoji}) te souffle un rêve à co-créer : "${selectedFrag}".
Compose une amorce poétique en 5 lignes.
Chaque ligne doit faire résonner un ou plusieurs de ces mots-clés : ${joinedTags}.
Langage sensoriel, onirique et évocateur : vent, glace, souffle, silence, eau, lumière, brume...
Le ton doit être chamanique et incarné, sans explication ni morale.
Fais sentir les sensations : voir, ressentir, entendre, toucher, respirer.
`
      const result = await askNebius(prompt, {
        model: "google/gemma-2-2b-it",
        temperature: 0.9,
      })

      const formatted = `L’esprit ${spirit} te souffle un rêve à co-créer : « ${selectedFrag} »\n\n${result.trim()}`
      setAiText(formatted)
      setText(formatted)
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

      <p style={{ fontSize: ".9rem", opacity: 0.8, marginBottom: ".8rem" }}>
        Choisis un titre qui t’appelle — un souffle, un écho, une image.  
        L’IA t’inspirera ensuite un <strong>début de rêve</strong> lié à l’esprit {emoji} {spirit}.  
        Mais <strong>tu es invité à le réécrire, le transformer, l’enrichir</strong> :  
        ajoute ton propre rythme, ta mémoire, tes sensations.
      </p>

      {/* 🌬️ Choix des fragments */}
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
              setText(`"${f}" — `)
              setAiText("")
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

      {/* 🌕 Texte utilisateur */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
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
        }}
      />

      {/* 🌟 Inspiration IA en jaune lumineux */}
      {aiText && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.8rem",
            borderRadius: "10px",
            background: "rgba(255,255,150,0.08)",
            border: "1px solid rgba(255,230,128,0.3)",
            color: "#ffe680",
            whiteSpace: "pre-wrap",
            fontStyle: "italic",
            boxShadow: "0 0 6px rgba(255,230,128,0.2)",
          }}
        >
          💫 <strong>Souffle de l’esprit</strong> :
          <br />
          {aiText}
        </div>
      )}

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