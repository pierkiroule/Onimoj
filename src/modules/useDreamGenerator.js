// src/modules/useDreamGenerator.js
import { useState } from "react"
import { askNebius, askNebiusImage } from "../nebiusClient"

/**
 * 🌌 Hook : Génération IA (texte + image)
 * - Centralise l'appel aux modèles Nebius
 * - Fournit état de chargement, erreurs, texte et image
 * - Paramétrable pour toute culture / gardien / mots-clés
 */
export function useDreamGenerator() {
  const [genLoading, setGenLoading] = useState(false)
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  // === GÉNÉRATION TEXTE ===
  async function generateText(spirit, tags = [], culture = "inuit") {
    if (!spirit) throw new Error("Gardien non défini")

    const cue = tags.length ? tags.join(", ") : "souffle, nuit, glace, écoute"
    const prompt = `
Crée un court texte hypnopoétique (6 à 9 lignes) en français.
Contexte: culture ${culture}, gardien: ${spirit.spirit_name} (${spirit.symbol})
Mots-clés: ${cue}
Style: sensoriel, suggestif, simple, doux, sans ésotérisme.
Pas de liste, pas d’injonction. Une seule strophe fluide.
`

    setGenLoading(true)
    try {
      const raw = await askNebius(prompt, { temperature: 0.85 })
      const generated = (raw || "").trim()
      setText(generated)
      return generated
    } catch (err) {
      console.error("❌ Erreur génération texte :", err)
      throw new Error("Échec de la génération du texte.")
    } finally {
      setGenLoading(false)
    }
  }

  // === GÉNÉRATION IMAGE ===
  async function generateImage(spirit, tags = [], culture = "inuit") {
    if (!spirit) throw new Error("Gardien non défini")

    const cue = tags.length ? tags.join(", ") : "aurora, ice, dream, landscape"
    const imgPrompt = `${spirit.spirit_name}, ${culture} dream guardian, ${cue}, aurora borealis, ethereal light`

    setGenLoading(true)
    try {
      const url = await askNebiusImage(imgPrompt)
      if (!url) throw new Error("Aucune image reçue")
      setImageUrl(url)
      return url
    } catch (err) {
      console.error("❌ Erreur génération image :", err)
      throw new Error("Échec de la génération de l’image.")
    } finally {
      setGenLoading(false)
    }
  }

  // === RÉINITIALISATION (utile si on relance un autre gardien)
  function reset() {
    setText("")
    setImageUrl("")
  }

  return {
    text,
    imageUrl,
    genLoading,
    generateText,
    generateImage,
    reset,
  }
}