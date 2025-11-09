// src/pages/OnimojiJourney.jsx
import { useState } from "react"
import { inuitSteps } from "../data/inuitSteps"
import InuitCircle from "../components/InuitCircle"
import HublotResonant from "../components/HublotResonant"
import StarPreview from "../components/StarPreview"
import { askNebius, askNebiusImage } from "../nebiusClient"
import { supabase } from "../supabaseClient"
import "./OnimojiJourney.css"

export default function OnimojiJourney({ userId }) {
  const [step, setStep] = useState(1)
  const [selectedSpirit, setSelectedSpirit] = useState(null)
  const [awakened, setAwakened] = useState([])
  const [quizPassed, setQuizPassed] = useState(false)

  const [tags, setTags] = useState([])
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [genLoading, setGenLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const isDev =
    import.meta.env.MODE === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"

  function handleSpiritCall() {
    const all = inuitSteps.map((s) => s.step_number)
    const remaining = all.filter((n) => !awakened.includes(n))
    const pool = remaining.length ? remaining : all
    const pickNum = pool[Math.floor(Math.random() * pool.length)]
    const pick = inuitSteps.find((s) => s.step_number === pickNum)
    setSelectedSpirit(pick)
    setQuizPassed(false)
  }

  function handleResetMission() {
    if (!confirm("Réinitialiser toute la mission Inuite ?")) return
    setAwakened([])
    setSelectedSpirit(null)
    setTags([])
    setTitle("")
    setText("")
    setImageUrl("")
    setQuizPassed(false)
    setStep(1)
  }

  async function generateText() {
    if (!selectedSpirit) return
    setGenLoading(true)
    try {
      const spirit = selectedSpirit.spirit_name
      const cue = tags?.length ? tags.join(", ") : "souffle, nuit, glace, écoute"
      const prompt = `
Crée un court texte hypnopoétique (6 à 9 lignes) en français.
Contexte: culture Inuite, gardien: ${spirit} (${selectedSpirit.symbol})
Mots-clés: ${cue}
Style: sensoriel, suggestif, simple, doux, sans ésotérisme.
Pas de liste, pas d’injonction. Une seule strophe fluide.
`
      const raw = await askNebius(prompt, { temperature: 0.85 })
      setText((raw || "").trim())
    } catch {
      alert("⚠️ Échec génération du texte.")
    } finally {
      setGenLoading(false)
    }
  }

  async function generateImage() {
    if (!selectedSpirit) return
    setGenLoading(true)
    try {
      const cue = tags?.length ? tags.join(", ") : "aurora, ice, inuit,  landscape, dream, awa"
      const imgPrompt = `${selectedSpirit.spirit_name}, inuit proective abstract dream atmosphere, ${cue}, soft light, aurora borealis, ethereal`
      const url = await askNebiusImage(imgPrompt)
      setImageUrl(url || "")
    } catch {
      alert("⚠️ Échec génération de l’image.")
    } finally {
      setGenLoading(false)
    }
  }

  async function handleSave() {
  if (!userId) return alert("Connecte-toi d’abord pour sauvegarder 🌙")
  if (!selectedSpirit) return
  if (!title.trim()) return alert("Ajoute un titre à ton rêve.")
  if (!text.trim()) return alert("Génère ou écris un texte avant de sauvegarder.")

  setSaveLoading(true)
  try {
    const guardianUuid = selectedSpirit.guardian_id || selectedSpirit.id || "715dcb42-7a69-4b46-ac7f-95feb051754f"

    const { data, error } = await supabase.from("dreams").insert([
      {
        user_id: userId,
        guardian_id: guardianUuid,
        titre: title.trim(),
        contenu: text.trim(),
        tags,
        image_url: imageUrl || null,
        visible: false, // 🔒 privé par défaut
        vitality: 1,
        source_guardians: [guardianUuid],
      },
    ]).select()

    if (error) throw error
    if (data?.length) alert("💾 Rêve sauvegardé dans ta Rêvothèque (privé).")

    setAwakened(prev => [...new Set([...prev, selectedSpirit.step_number])])
    setSelectedSpirit(null)
    setTags([])
    setTitle("")
    setText("")
    setImageUrl("")
    setQuizPassed(false)
    setStep(1)
  } catch (e) {
    console.error("Erreur sauvegarde rêve :", e)
    alert("❌ Sauvegarde impossible.")
  } finally {
    setSaveLoading(false)
  }
}

  // ————— ÉTAPE 1 : CERCLE DES GARDIENS —————
  if (step === 1) {
    return (
      <div className="onimoji-step fade-in" style={{ textAlign: "center", color: "#e9fffd" }}>
        <h2 style={{ color: "#7fffd4" }}>🌙 Cercle des Gardiens — Culture Inuite</h2>

        <InuitCircle
          awakenedSteps={awakened}
          selectedSpirit={selectedSpirit}
          onSelect={(s) => {
            setSelectedSpirit(s)
            setQuizPassed(false)
          }}
          onSpiritCall={handleSpiritCall}
        />

        {selectedSpirit && (
          <div style={{ marginTop: "1rem", padding: "0 1rem" }}>
            <h3>{selectedSpirit.symbol} {selectedSpirit.spirit_name}</h3>
            <p style={{ opacity: 0.8 }}>{selectedSpirit.title}</p>
            {selectedSpirit.text && (
              <p style={{ opacity: 0.7 }}>{selectedSpirit.text}</p>
            )}

            {selectedSpirit.spirit_name === "Sila" && (
              <div style={{ marginTop: "1rem" }}>
                <video
                  src="/video/Sil.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    maxWidth: "360px",
                    borderRadius: "12px",
                    boxShadow: "0 0 20px rgba(127,255,212,0.3)",
                    marginTop: "0.6rem",
                  }}
                />
                <p style={{ fontSize: "0.9rem", color: "#aefcf5", fontStyle: "italic" }}>
                  🌬️ Respire avec Sila — le souffle du monde.
                </p>
              </div>
            )}

            {/* Quiz */}
            {Array.isArray(selectedSpirit.quiz) && (
              <div
                style={{
                  marginTop: "0.5rem",
                  textAlign: "left",
                  background: "rgba(127,255,212,0.05)",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  maxWidth: "320px",
                  marginInline: "auto",
                }}
              >
                <h4 style={{ color: "#7fffd4" }}>❓ Quiz</h4>
                {selectedSpirit.quiz.map((q, qi) => (
                  <div key={qi} style={{ marginBottom: "1rem" }}>
                    <p style={{ fontWeight: "bold", color: "#aefcf5" }}>
                      {qi + 1}. {q.question}
                    </p>
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setQuizPassed(
                            i === q.correct
                              ? (alert("✅ Bonne réponse !"), true)
                              : (alert("❌ Essaie encore..."), false)
                          )
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          marginBottom: "0.4rem",
                          background: "rgba(127,255,212,0.1)",
                          border: "1px solid #7fffd4",
                          borderRadius: "6px",
                          padding: "0.4rem",
                          color: "#e9fffd",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Continuer */}
            <button
              className="next-btn pulse"
              onClick={() => {
                if (Array.isArray(selectedSpirit.quiz) && !quizPassed) {
                  alert("Réponds d’abord au quiz 🌀")
                  return
                }
                setStep(2)
              }}
              style={{
                marginTop: "1rem",
                padding: ".6rem 1rem",
                border: "1px solid #7fffd4",
                background: "transparent",
                borderRadius: "10px",
                color: "#7fffd4",
                cursor: "pointer",
                opacity: Array.isArray(selectedSpirit.quiz) ? (quizPassed ? 1 : 0.5) : 1,
              }}
            >
              🌙 Ouvrir le hublot de {selectedSpirit.spirit_name}
            </button>
          </div>
        )}

        {isDev && (
          <button
            onClick={handleResetMission}
            style={{
              marginTop: "1.5rem",
              padding: ".4rem .8rem",
              border: "1px solid #ffb3b3",
              borderRadius: "8px",
              background: "transparent",
              color: "#ffb3b3",
              fontSize: ".8rem",
            }}
          >
            🔧 Réinitialiser la mission Inuite (local)
          </button>
        )}
      </div>
    )
  }

  // ————— ÉTAPE 2 : HUBLOT —————
  if (step === 2 && selectedSpirit) {
    return (
      <HublotResonant
        step={selectedSpirit}
        onComplete={(selectedTags) => {
          setTags(selectedTags || [])
          setTitle(`${selectedSpirit.symbol} ${selectedSpirit.spirit_name}`)
          setStep(3)
        }}
        onBack={() => setStep(1)}
      />
    )
  }

  // ————— ÉTAPE 3 : CRÉATION DU RÊVE —————
  if (step === 3 && selectedSpirit) {
    return (
      <div className="fade-in" style={{ color: "#e9fffd", textAlign: "center", padding: "1rem" }}>
        <h2 style={{ color: "#7fffd4" }}>
          🌟 Création du rêve — {selectedSpirit.symbol} {selectedSpirit.spirit_name}
        </h2>
        <p style={{ opacity: 0.8 }}>À partir des mots que tu as semés, fais naître un rêve unique.</p>

        <StarPreview words={tags} centerEmoji={selectedSpirit.symbol} />

        <div style={{ maxWidth: 560, margin: "1rem auto", textAlign: "left" }}>
          <label style={{ color: "#7fffd4" }}>Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du rêve…"
            style={inputStyle}
          />

          <label style={{ color: "#7fffd4" }}>Texte</label>
          <textarea
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Génère ou écris un texte poétique…"
            style={textareaStyle}
          />

          <div style={{ display: "flex", gap: ".6rem", marginTop: ".6rem", flexWrap: "wrap" }}>
            <button onClick={generateText} disabled={genLoading} style={btnPrimary}>
              {genLoading ? "… Texte" : "🪶 Générer le texte"}
            </button>
            <button onClick={generateImage} disabled={genLoading} style={btnGhost}>
              {genLoading ? "… Image" : "🌌 Générer une image"}
            </button>
          </div>

          {imageUrl && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <img
                src={imageUrl}
                alt={title}
                style={{ width: "100%", maxWidth: 380, borderRadius: 12 }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
            <button onClick={handleSave} disabled={saveLoading} style={btnPrimary}>
              {saveLoading ? "… Sauvegarde" : "💾 Enregistrer dans la Rêvothèque"}
            </button>
            <button onClick={() => setStep(1)} style={btnGhost}>
              ⬅️ Revenir au cercle
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

/* ——— Styles de base ——— */
const btnPrimary = {
  background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
  border: "none",
  borderRadius: "10px",
  padding: ".6rem 1rem",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
}

const btnGhost = {
  background: "rgba(127,255,212,0.1)",
  border: "1px solid rgba(127,255,212,.4)",
  borderRadius: "10px",
  padding: ".6rem 1rem",
  color: "#7fffd4",
  fontWeight: 600,
  cursor: "pointer",
}

const inputStyle = {
  width: "100%",
  border: "1px solid rgba(127,255,212,.35)",
  background: "rgba(0,20,25,.6)",
  borderRadius: "8px",
  padding: ".5rem",
  color: "#bff",
  marginBottom: ".6rem",
  fontWeight: "600",
}

const textareaStyle = {
  width: "100%",
  border: "1px solid rgba(127,255,212,.35)",
  background: "rgba(0,20,25,.6)",
  borderRadius: "8px",
  padding: ".6rem",
  color: "#e9fffd",
  resize: "vertical",
}