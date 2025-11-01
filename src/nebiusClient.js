// src/nebiusClient.js
// ⚡ Client universel Nebius Studio Chat (complet + filtrage poétique inuit)

const API_URL =
  import.meta.env.VITE_NEBIUS_API_URL ||
  "https://api.studio.nebius.com/v1/chat/completions"

const API_KEY =
  import.meta.env.VITE_NEBIUS_API_KEY || import.meta.env.VITE_NEBIUS_KEY

/**
 * Fonction principale : demande à Nebius une réponse textuelle.
 * @param {string} prompt - message utilisateur
 * @param {object} options :
 *    - model : modèle Nebius (défaut : google/gemma-2-9b-it-fast)
 *    - systemPrompt : instructions système
 *    - temperature : créativité
 *    - stream : true → active l’affichage progressif
 *    - onToken : callback(token) → reçoit chaque fragment
 * @returns {Promise<string>} - texte complet généré et nettoyé
 */
export async function askNebius(prompt, options = {}) {
  const body = {
    model: options.model || "google/gemma-2-9b-it-fast",
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ||
          "Tu es un conteur du Grand Nord. Raconte des rêves courts, sensoriels et poétiques en français, inspirés de la tradition inuit. Utilise des mots simples et évite toute invention lexicale mais utilise des metaphores inuites.",
      },
      ...(Array.isArray(options.examples) ? options.examples : []),
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    temperature: options.temperature ?? 0.8,
    stream: options.stream ?? false,
    max_tokens: options.max_tokens,
  }

  try {
    if (!API_KEY) {
      console.error("⛔ Clé API Nebius absente. Définis VITE_NEBIUS_API_KEY.")
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

    if (!res.ok) {
      const errText = await res.text()
      console.error("❌ Erreur Nebius:", errText)
      return ""
    }

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
          options.onToken?.(token)
        }
      }
      return cleanDreamText(fullText.trim())
    }

    const data = await res.json()
    const raw =
      data.choices?.[0]?.message?.content?.[0]?.text?.trim() ||
      data.choices?.[0]?.message?.content?.trim() ||
      ""

    return cleanDreamText(raw)
  } catch (err) {
    console.error("⚠️ Erreur connexion Nebius:", err)
    return ""
  }
}

/**
 * Extraction des tokens texte depuis le flux SSE
 */
function extractTokens(chunk) {
  const tokens = []
  const lines = chunk.split("\n").filter((l) => l.startsWith("data:"))
  for (const line of lines) {
    try {
      const json = JSON.parse(line.replace("data:", "").trim())
      const text = json?.choices?.[0]?.delta?.content?.[0]?.text
      if (text) tokens.push(text)
    } catch {}
  }
  return tokens
}

/**
 * 🌬️ Nettoyage poétique frugal
 * - remplace les mots inventés ou absurdes
 * - supprime caractères illisibles
 * - conserve le style poétique
 */
function cleanDreamText(text) {
  if (!text) return ""
  return text
    .replace(/\bsonlagt\b/gi, "chant de lumière")
    .replace(/\bsolagt\b/gi, "éclat du soleil")
    .replace(/[^\p{L}\p{M}\p{P}\p{Zs}\n]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}