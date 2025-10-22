// src/nebiusClient.js
// ⚡ Client universel Nebius Studio Chat (complet + streaming)

const API_URL =
  import.meta.env.VITE_NEBIUS_API_URL ||
  "https://api.studio.nebius.com/v1/chat/completions"
// Support both the correct name and the older one to avoid prod breakage
const API_KEY =
  import.meta.env.VITE_NEBIUS_API_KEY || import.meta.env.VITE_NEBIUS_KEY

/**
 * Fonction principale : demande à Nebius une réponse textuelle.
 * @param {string} prompt - message utilisateur
 * @param {object} options :
 *    - model : modèle Nebius (défaut : google/gemma-2-2b-it)
 *    - systemPrompt : instructions système
 *    - temperature : créativité
 *    - stream : true → active l’affichage progressif
 *    - onToken : callback(token) → reçoit chaque fragment
 * @returns {Promise<string>} - texte complet généré
 */
export async function askNebius(prompt, options = {}) {
  const body = {
    model: options.model || "google/gemma-2-2b-it",
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ||
          "Tu es un assistant poétique et bienveillant. Réponds en français, avec des images sensorielles, un ton apaisant et concis.",
      },
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    temperature: options.temperature ?? 0.8,
    stream: options.stream ?? false,
  }

  try {
    if (!API_KEY) {
      console.error(
        "⛔ Clé API Nebius absente. Définis VITE_NEBIUS_API_KEY dans tes variables d'environnement (et redéploie)."
      )
      return ""
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        ...(options.stream ? { Accept: "text/event-stream" } : {}),
      },
      body: JSON.stringify(body),
    })

    // 🚨 Si erreur HTTP
    if (!res.ok) {
      const errText = await res.text()
      console.error("❌ Erreur Nebius:", errText)
      return ""
    }

    // ⚡ Mode streaming : lecture progressive du flux texte
    if (options.stream) {
      const reader = res.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullText = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const tokens = extractTokens(chunk)
        for (const token of tokens) {
          fullText += token
          options.onToken?.(token) // callback à chaque fragment
        }
      }
      return fullText.trim()
    }

    // 🌊 Réponse complète (non-streamée)
    const data = await res.json()
    return (
      data.choices?.[0]?.message?.content?.[0]?.text?.trim() ||
      data.choices?.[0]?.message?.content?.trim() ||
      ""
    )
  } catch (err) {
    console.error("⚠️ Erreur connexion Nebius:", err)
    return ""
  }
}

/**
 * Fonction utilitaire pour extraire les tokens texte depuis le flux SSE
 * @param {string} chunk - bloc brut de données
 * @returns {string[]} - liste de tokens
 */
function extractTokens(chunk) {
  const tokens = []
  const lines = chunk.split("\n").filter((l) => l.startsWith("data:"))
  for (const line of lines) {
    try {
      const json = JSON.parse(line.replace("data:", "").trim())
      const text = json?.choices?.[0]?.delta?.content?.[0]?.text
      if (text) tokens.push(text)
    } catch {
      /* ignore parsing errors */
    }
  }
  return tokens
}