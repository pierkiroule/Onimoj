// 🌌 Générateur de rêve du jour via Nebius Studio
export async function generateDreamOfTheDay(emojis, words, spirit, culture) {
  const prompt = `
Tu es un poète chaman inuk.
Compose un rêve onirique et méditatif inspiré par ces éléments :
Esprit : ${spirit}
Culture : ${culture}
Émojis : ${emojis.join(" ")}
Mots inuits : ${words.join(", ")}
Le texte doit être poétique, apaisé, imagé, entre 6 et 10 lignes.
Pas de titres ni d'explication.
Utilise une langue française douce et évocatrice, entre souffle et lumière.
  `.trim()

  const response = await fetch("https://api.studio.nebius.ai/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_NEBIUS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemma-2b-it-fast",
      prompt,
      temperature: 0.8,
      max_tokens: 220,
    }),
  })

  const data = await response.json()
  const text = data?.choices?.[0]?.text || "..."
  return text.trim()
}