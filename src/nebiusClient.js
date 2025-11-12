// src/nebiusClient.js
// ⚡ Client universel Nebius Studio (via Edge Function sécurisée)
// Compatible mobile / cache local / prompts poétiques inuit

import { supabase } from "./supabaseClient"

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "") ?? null
const FUNCTION_ENDPOINT = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/nebius-proxy`
  : null

async function fetchAccessToken() {
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session?.access_token ?? null
  } catch (err) {
    console.warn("⚠️ Impossible de récupérer le token Supabase :", err)
    return null
  }
}

async function callNebiusProxy(payload) {
  if (!FUNCTION_ENDPOINT) {
    throw new Error("VITE_SUPABASE_URL non configurée : proxy Nebius inaccessible.")
  }

  const token = await fetchAccessToken()
  if (!token) {
    throw new Error("Utilisateur non authentifié : accès Nebius refusé.")
  }

  const res = await fetch(FUNCTION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = await res.text()
    try {
      const parsed = JSON.parse(message)
      message = parsed?.message || parsed?.error || message
    } catch {
      // garde `message`
    }
    throw new Error(`Proxy Nebius indisponible (${res.status}) : ${message}`)
  }

  return res.json()
}

/**
 * 🧠 Fonction principale : génération textuelle poétique
 */
export async function askNebius(prompt, options = {}) {
  try {
    const response = await callNebiusProxy({
      type: "text",
      prompt,
      options: {
        model: options.model,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.max_tokens,
        systemPrompt: options.systemPrompt,
        examples: Array.isArray(options.examples) ? options.examples : undefined,
        messages: Array.isArray(options.messages) ? options.messages : undefined,
      },
    })

    const raw = response?.data?.text ?? ""
    return cleanDreamText(String(raw ?? ""))
  } catch (err) {
    console.error("⚠️ Erreur proxy Nebius:", err)
    return ""
  }
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
  // 🌙 Vérifie si l'image existe déjà dans le cache
  const cacheKey = `nebius_${btoa(unescape(encodeURIComponent(prompt))).slice(0, 100)}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    console.log("🌀 Image chargée depuis le cache Nebius")
    return cached
  }

  try {
    console.log("✨ Appel Nebius pour :", prompt)

    const response = await callNebiusProxy({
      type: "image",
      prompt,
      options: {
        model: "black-forest-labs/flux-schnell",
        size: "512x512",
      },
    })

    const result = response?.data ?? {}
    console.log("🧠 Réponse Nebius proxy :", result)

    const base64 = result.base64
    const url = result.url

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
    console.error("⚠️ Erreur Nebius proxy:", err)
    return null
  }
}