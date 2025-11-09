import { askNebius, askNebiusImage } from "../../nebiusClient"
import { saveOnimojiAndProgress } from "../../utils/supabaseOnimoji"

export default function DreamInvocation({ userId, selectedWords }) {
  if (selectedWords.length < 5)
    return (
      <p style={{ opacity: 0.7, marginTop: "1rem" }}>
        Choisis <b>5 mots</b> du réseau pour invoquer ton gardien collectif 🌙
      </p>
    )

  async function generateGuardian() {
    const words = selectedWords.join(", ")
    const prompt = `
À partir des mots : ${words}
Invente un gardien onirique collectif (Onimoji).
Réponds en JSON :
{ "emoji":"🌬️","nom":"Nom poétique","description":"3 phrases","sagesse":"1 phrase","mythe":"3 phrases" }`

    const response = await askNebius(prompt)
    let parsed
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
    } catch {
      parsed = null
    }

    if (!parsed) {
      parsed = {
        emoji: "🌌",
        nom: "Siiluk, l’Esprit du Souffle",
        description: "Esprit du souffle céleste sur la glace.",
        sagesse: "Respire, rêve, recommence.",
        mythe: "Né du silence entre deux respirations du monde.",
      }
    }

    const imgPrompt = `${words}, ${parsed.nom}, aurora borealis`
    const img = await askNebiusImage(imgPrompt)

    await saveOnimojiAndProgress({
      userId,
      spirit: "Collectif",
      emoji: parsed.emoji,
      title: parsed.nom,
      text: `${parsed.description}\n🌙 ${parsed.sagesse}\n${parsed.mythe}`,
      imageUrl: img,
      tags: selectedWords,
      culture: "Collective",
    })

    alert(`🌟 Gardien collectif "${parsed.nom}" créé à partir de 5 mots !`)
  }

  return (
    <button
      onClick={generateGuardian}
      style={{
        background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
        border: "none",
        borderRadius: "10px",
        padding: ".6rem 1.2rem",
        color: "#111",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(127,255,212,0.3)",
        marginTop: ".8rem",
      }}
    >
      🪶 Invoquer un Onimoji collectif
    </button>
  )
}