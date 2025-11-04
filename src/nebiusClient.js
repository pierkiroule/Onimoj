// src/nebiusClient.js
// ⚡ Client universel Nebius Studio : texte + image onirique
// Compatible mobile / cache local / prompts poétiques inuit

const API_CHAT_URL =
  import.meta.env.VITE_NEBIUS_API_URL ||
  "https://api.studio.nebius.com/v1/chat/completions"

const API_IMAGE_URL = "https://api.studio.nebius.com/v1/images/generations"

const API_KEY =
  import.meta.env.VITE_NEBIUS_API_KEY || import.meta.env.VITE_NEBIUS_KEY

/**
 * 🧠 Fonction principale : génération textuelle poétique
 */
export async function askNebius(prompt, options = {}) {
  if (!API_KEY) {
    console.error("⛔ Clé API Nebius absente. Définis VITE_NEBIUS_API_KEY.")
    return ""
  }

  const body = {
    model: options.model || "google/gemma-2-9b-it-fast",
    messages: [
      {
        role: "system",
        content:
          options.systemPrompt ||
          "Tu es un conteur du Grand Nord. Raconte des rêves courts, sensoriels et poétiques en français, inspirés de la tradition inuit. Utilise des mots simples, des images naturelles et évite les inventions lexicales.",
      },
      ...(Array.isArray(options.examples) ? options.examples : []),
      { role: "user", content: [{ type: "text", text: prompt }] },
    ],
    temperature: options.temperature ?? 0.8,
    stream: options.stream ?? false,
    max_tokens: options.max_tokens,
  }

  try {
    const res = await fetch(API_CHAT_URL, {
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

    // 🌀 Mode streaming
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

    // ✨ Réponse simple
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
 * 🔤 Extraction des tokens texte depuis le flux SSE
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

/**
 * 🖼️ Génération d'image onirique (mobile + cache local)
 */
export async function askNebiusImage(prompt) {
  if (!API_KEY) {
    console.error("❌ Clé Nebius manquante : VITE_NEBIUS_API_KEY")
    alert("⚠️ Clé Nebius absente : ajoute-la dans ton fichier .env")
    return null
  }

  // 🌙 Vérifie si l'image existe déjà dans le cache
  const cacheKey = `nebius_${btoa(unescape(encodeURIComponent(prompt))).slice(0, 100)}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    console.log("🌀 Image chargée depuis le cache Nebius")
    return cached
  }

  try {
    console.log("✨ Appel Nebius pour :", prompt)

    const response = await fetch(API_IMAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "black-forest-labs/flux-schnell",
        prompt,
        size: "512x512",
      }),
    })

    if (!response.ok) throw new Error(`Erreur Nebius: ${response.statusText}`)

    const result = await response.json()
    console.log("🧠 Réponse Nebius brute :", result)

    const base64 = result.data?.[0]?.b64_json
    const url = result.data?.[0]?.url

    // 🧩 Cas 1 : base64
    if (base64) {
      const dataUrl = `data:image/png;base64,${base64}`
      localStorage.setItem(cacheKey, dataUrl)
      console.log("🌌 Image (base64) générée et mise en cache.")
      return dataUrl
    }

    // 🧩 Cas 2 : URL distante
    if (url) {
      localStorage.setItem(cacheKey, url)
      console.log("🌌 Image (URL) générée et mise en cache.")
      return url
    }

    // 🚫 Cas d'erreur
    throw new Error("Réponse Nebius vide (ni b64_json ni url).")
  } catch (err) {
    console.error("⚠️ Erreur Nebius Studio:", err)
    return null
  }
}