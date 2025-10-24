import { useState } from "react"
import { supabase } from "../supabaseClient"
import { askNebius } from "../nebiusClient"

export default function ResonantMoon() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reveIA, setReveIA] = useState("")
  const [error, setError] = useState("")

  async function openReveIA() {
    setShowModal(true)
    setLoading(true)
    setError("")
    setReveIA("")

    try {
      // 🧩 1. Récupère les dernières ÉchoRessources visibles
      const { data, error } = await supabase
        .from("echoressources")
        .select("titre, description")
        .eq("visible", true)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error

      const fragments = (data || [])
        .map((r) => `• ${r.titre} — ${r.description}`)
        .join("\n")

      // 🌕 2. Nouveau prompt : sobre, culturel, sensoriel
      const prompt = `
Voici quelques fragments récents issus des Échos créés :
${fragments}

À partir de ces fragments, compose un texte bref (6 à 15 lignes) 
appelé "RêvIA". Il doit exprimer un souffle poétique, apaisant et concret,
comme si la nature elle-même parlait à travers le vent ou les aurores boréales et la neige.
Ne parle jamais de technologie, d'IA ou de machine.
Utilise un ton calme, incarné, inspiré par la sagesse du Nord et des peuples du rêve inuit.
Chaque phrase décrit une sensation onirique, un geste ou un lien entre humain et monde.
Écris toujours en français.
`

      const systemPrompt = `
Tu es un conteur ancien, ancré dans la neige, le vent et la mer.
Tu n'évoques jamais la technologie ni les IA.
Tu racontes un rêve inuit comme un souffle lent, en phrases courtes, calmes, sensoriellement riches et imagées.
Ta parole doit aider à ressentir l’unité entre l’humain et la nature.
`

      // 🌙 3. Appel Nebius (texte onirique)
      const text = await askNebius(prompt, {
        systemPrompt,
        model: "google/gemma-2-2b-it",
        temperature: 0.7,
      })

      if (!text || text.trim() === "") throw new Error("Réponse vide de Nebius.")
      const cleanText = text
        .replace(/\b(IA|machine|technologie|code|algorithme)\b/gi, "")
        .trim()

      setReveIA(cleanText)

      // 🌿 4. Archivage dans Supabase
      const titre = `RêvIA du ${new Date().toLocaleDateString("fr-FR")}`
      const { error: insertErr } = await supabase
        .from("revia")
        .insert([{ titre, texte: cleanText }])
      if (insertErr) console.warn("⚠️ Archivage RêvIA:", insertErr.message)
    } catch (err) {
      console.error("Erreur RêvIA:", err)
      setError("❌ " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 🌘 Lune résonante */}
      <div className="moon-wrapper" onClick={openReveIA}>
        <div className="moon-emoji">🌘</div>
        <p className="moon-caption">Découvre le RêvIA du moment</p>
      </div>

      {/* 🪶 Modale */}
      {showModal && (
        <div className="moon-modal">
          <div className="moon-content">
            {loading ? (
              <p className="moon-loading">✨ La Lune tisse ton rêve...</p>
            ) : error ? (
              <p style={{ color: "#ff8080" }}>{error}</p>
            ) : (
              <pre className="moon-reve">{reveIA}</pre>
            )}
            <button onClick={() => setShowModal(false)} className="moon-close">
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .moon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            cursor: pointer;
            margin: 2rem 0;
            animation: fadeIn 2s ease-in;
          }
          .moon-emoji {
            font-size: 5rem;
            animation: pulse 4s ease-in-out infinite;
            text-shadow: 0 0 20px rgba(127,255,212,0.8);
          }
          .moon-caption {
            margin-top: 1rem;
            color: #7fffd4;
            font-size: 1.1rem;
            opacity: 0.8;
          }
          @keyframes pulse {
            0%,100%{transform:scale(1);text-shadow:0 0 15px rgba(127,255,212,0.5);}
            50%{transform:scale(1.1);text-shadow:0 0 35px rgba(127,255,212,1);}
          }
          .moon-modal {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
          }
          .moon-content {
            background: #101020;
            border-radius: 16px;
            padding: 2rem;
            width: 85%;
            max-width: 500px;
            box-shadow: 0 0 30px rgba(127,255,212,0.3);
            color: #dff;
            text-align: center;
          }
          .moon-reve {
            white-space: pre-wrap;
            text-align: left;
            line-height: 1.5;
            max-height: 60vh;
            overflow-y: auto;
          }
          .moon-close {
            margin-top: 1.2rem;
            background: #7fffd4;
            color: #111;
            border: none;
            border-radius: 8px;
            padding: 0.6rem 1.2rem;
            font-weight: 600;
            cursor: pointer;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </>
  )
}