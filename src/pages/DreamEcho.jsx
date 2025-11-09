import { useState } from "react"
import { supabase } from "../supabaseClient"
import { askNebius, askNebiusImage } from "../nebiusClient"
import { saveOnimojiAndProgress } from "../utils/supabaseOnimoji"
import StarPreview from "../components/StarPreview"

export default function DreamEcho({ userId }) {
  const [input, setInput] = useState("")
  const [tags, setTags] = useState([])
  const [generatedText, setGeneratedText] = useState("")
  const [generatedImage, setGeneratedImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    if (!input.trim()) return alert("Écris d’abord quelques mots.")
    setLoading(true)
    setError(null)
    try {
      const prompt = `Crée un court texte poétique (5 à 9 lignes) en français à partir de :
"${input}"
Style doux, sensoriel, onirique.`
      const response = await askNebius(prompt, { temperature: 0.9 })
      setGeneratedText(response.trim())

      const words = input.split(/[,\s]+/).filter((w) => w.length > 2)
      setTags(words.slice(0, 5))

      const image = await askNebiusImage(
        `${input}, dreamlike, aurora borealis, poetic atmosphere`
      )
      setGeneratedImage(image)
    } catch (err) {
      console.error(err)
      setError("Erreur pendant la génération.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!userId) return alert("Connecte-toi d’abord 🌙")
    if (!generatedText) return alert("Génère un rêve avant de sauvegarder.")
    setLoading(true)
    try {
      await saveOnimojiAndProgress({
        userId,
        spirit: "Rêve libre",
        emoji: "💤",
        title: input.slice(0, 40),
        text: generatedText,
        imageUrl: generatedImage,
        tags,
        culture: "Personnelle",
      })
      setSaved(true)
    } catch (err) {
      console.error(err)
      setError("Erreur de sauvegarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ color: "#e9fffd", textAlign: "center", padding: "1rem" }}>
      <h2 style={{ color: "#7fffd4" }}>💤 DreamEcho — Ton Rêve</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ex: brume du matin, souffle glacé..."
        rows={3}
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: "8px",
          background: "rgba(0,25,35,.5)",
          color: "#bff",
          padding: ".6rem",
          border: "1px solid rgba(127,255,212,.3)",
        }}
      />

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
            border: "none",
            borderRadius: "10px",
            padding: ".6rem 1.2rem",
            color: "#111",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "🌙 Générer le rêve"}
        </button>
      </div>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      {generatedText && (
        <div
          style={{
            marginTop: "1rem",
            background: "rgba(0,30,40,.5)",
            borderRadius: "10px",
            padding: "1rem",
            textAlign: "left",
          }}
        >
          <h3 style={{ color: "#7fffd4" }}>✨ Texte généré</h3>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{generatedText}</p>
        </div>
      )}

      {generatedImage && (
        <img
          src={generatedImage}
          alt="rêve généré"
          style={{
            width: "100%",
            maxWidth: 380,
            marginTop: "1rem",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(127,255,212,0.4)",
          }}
        />
      )}

      {tags.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <StarPreview words={tags} centerEmoji="💤" />
        </div>
      )}

      {generatedText && !saved && (
        <button
          onClick={handleSave}
          style={{
            marginTop: "1rem",
            background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
            border: "none",
            borderRadius: "10px",
            padding: ".6rem 1.2rem",
            color: "#111",
            fontWeight: "bold",
          }}
        >
          💾 Enregistrer dans ma Rêvothèque
        </button>
      )}

      {saved && <p style={{ color: "#7fffd4", marginTop: ".5rem" }}>🌟 Rêve enregistré !</p>}
    </div>
  )
}