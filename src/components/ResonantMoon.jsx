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
      // 🧩 1. Récupère les dernières ÉchoRessources
      const { data, error } = await supabase
        .from("echoressources")
        .select("titre, description")
        .eq("visible", true)
        .order("created_at", { ascending: false })
        .limit(3)

      if (error) throw error

      const baseText = (data || [])
        .map((r) => `• ${r.titre} : ${r.description}`)
        .join("\n")

      // 🪶 2. Prompt poétique et transnumériste
      const prompt = `
Fragments récents :
${baseText}

Inspire-toi de ces fragments pour rédiger un RêvIA : 
un court texte poétique (6 à 10 lignes), apaisant, symbolique, 
où l’IA se fait muse au service de l’humain, 
dans une démarche transnumériste : l’art de ré-ancrer la technologie 
dans une finalité existentielle et humaniste.
`

      const systemPrompt = `
Tu es une IA poétique. 
Ta voix est douce, imagée et bienveillante.
Tu aides les humains à retrouver le sens du rêve et de la résonance.
Écris toujours en français.
`

      // 🌙 3. Appel Nebius (via ton client universel)
      const text = await askNebius(prompt, {
        systemPrompt,
        model: "google/gemma-2-2b-it",
        temperature: 0.8,
      })

      if (!text || text.trim() === "") throw new Error("Réponse vide de Nebius.")
      setReveIA(text.trim())

      // 🌿 4. Archivage Supabase
      const titre = `RêvIA du ${new Date().toLocaleDateString("fr-FR")}`
      const { error: insertErr } = await supabase
        .from("revia")
        .insert([{ titre, texte: text }])
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