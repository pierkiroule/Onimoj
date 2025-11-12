import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const chatEndpoint =
  Deno.env.get("NEBIUS_CHAT_URL") ??
  "https://api.studio.nebius.com/v1/chat/completions"
const imageEndpoint =
  Deno.env.get("NEBIUS_IMAGE_URL") ??
  "https://api.studio.nebius.com/v1/images/generations"
const apiKey =
  Deno.env.get("NEBIUS_API_KEY") ?? Deno.env.get("VITE_NEBIUS_API_KEY")

if (!apiKey) {
  console.error(
    "⚠️  NEBIUS_API_KEY non configurée dans l'environnement Supabase."
  )
}

function jsonResponse(
  body: unknown,
  init: ResponseInit = { status: 200 }
): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
}

const defaultSystemPrompt =
  "Tu es un conteur du Grand Nord. Raconte des rêves courts, sensoriels et poétiques en français, inspirés de la tradition inuit. Utilise des mots simples, des images naturelles et évite les inventions lexicales."

async function forwardText(prompt: string, options: Record<string, unknown>) {
  if (!apiKey) {
    throw new Error("NEBIUS_API_KEY absente côté serveur.")
  }

  let messages: unknown[] | undefined = undefined
  if (Array.isArray(options?.messages) && options.messages.length > 0) {
    messages = options.messages as unknown[]
    const hasUserMessage = (messages as Array<{ role?: string }>).some(
      (msg) => msg?.role === "user"
    )
    if (!hasUserMessage) {
      messages = [
        ...messages,
        { role: "user", content: [{ type: "text", text: prompt }] },
      ]
    }
  } else {
    const systemPrompt =
      typeof options?.systemPrompt === "string"
        ? options.systemPrompt
        : defaultSystemPrompt
    const examples = Array.isArray(options?.examples)
      ? (options.examples as unknown[])
      : []
    messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...examples,
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ]
  }

  const payload = {
    model: options?.model ?? "google/gemma-2-9b-it-fast",
    messages,
    temperature: options?.temperature ?? 0.8,
    max_tokens: options?.max_tokens,
    stream: false,
  }

  const upstream = await fetch(chatEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok) {
    const errText = await upstream.text()
    throw new Error(
      `Erreur Nebius (texte) ${upstream.status}: ${errText.slice(0, 300)}`
    )
  }

  const data = await upstream.json()
  const text =
    data?.choices?.[0]?.message?.content?.[0]?.text ??
    data?.choices?.[0]?.message?.content ??
    ""
  return { text }
}

async function forwardImage(prompt: string, options: Record<string, unknown>) {
  if (!apiKey) {
    throw new Error("NEBIUS_API_KEY absente côté serveur.")
  }

  const payload = {
    model: options?.model ?? "black-forest-labs/flux-schnell",
    prompt,
    size: options?.size ?? "512x512",
    response_format: options?.response_format ?? "b64_json",
  }

  const upstream = await fetch(imageEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok) {
    const errText = await upstream.text()
    throw new Error(
      `Erreur Nebius (image) ${upstream.status}: ${errText.slice(0, 300)}`
    )
  }

  const data = await upstream.json()
  const base64 = data?.data?.[0]?.b64_json ?? null
  const url = data?.data?.[0]?.url ?? null
  return { base64, url }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, { status: 405 })
  }

  const authHeader = req.headers.get("Authorization")
  if (!authHeader) {
    return jsonResponse({ error: "missing_jwt" }, { status: 401 })
  }

  let body: {
    prompt?: unknown
    type?: string
    options?: Record<string, unknown>
  }

  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: "invalid_json" }, { status: 400 })
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return jsonResponse({ error: "missing_prompt" }, { status: 400 })
  }

  const type = body.type ?? "text"
  const options = body.options ?? {}

  try {
    if (type === "image") {
      const data = await forwardImage(body.prompt, options)
      return jsonResponse({ data, type: "image" })
    }
    const data = await forwardText(body.prompt, options)
    return jsonResponse({ data, type: "text" })
  } catch (error) {
    console.error("[nebius-proxy] error:", error)
    return jsonResponse(
      {
        error: "proxy_error",
        message:
          error instanceof Error ? error.message : "Erreur inconnue du proxy.",
      },
      { status: 502 }
    )
  }
})
