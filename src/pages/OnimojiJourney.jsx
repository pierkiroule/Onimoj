import { useState } from "react"
import { inuitSteps } from "../data/inuitSteps"
import InuitCircle from "../components/InuitCircle"
import HublotResonant from "../components/HublotResonant"
import OnimojiCreation from "../components/OnimojiCreation"
import "./OnimojiJourney.css"

export default function OnimojiJourney({ userId }) {
  const [step, setStep] = useState(1)
  const [selectedSpirit, setSelectedSpirit] = useState(null)
  const [awakened, setAwakened] = useState([])
  const [tags, setTags] = useState([])
  const [quizPassed, setQuizPassed] = useState(false)

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
    setStep(1)
    setQuizPassed(false)
    console.log("💡 Mission Inuite réinitialisée (local uniquement)")
  }

  // 🌙 ÉTAPE 1 — Sélection d’un esprit
  if (step === 1) {
    return (
      <div
        className="onimoji-step fade-in"
        style={{ textAlign: "center", color: "#e9fffd" }}
      >
        <h2 style={{ color: "#7fffd4" }}>🌙 Cercle des 12 Esprits</h2>

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
            <h3 style={{ margin: 0 }}>
              {selectedSpirit.symbol} {selectedSpirit.spirit_name}
            </h3>
            <p style={{ opacity: 0.85, margin: ".3rem 0 .8rem" }}>
              {selectedSpirit.title}
            </p>

            {/* 🪶 Description */}
            <p style={{ opacity: 0.75, marginBottom: "0.8rem" }}>
              {selectedSpirit.text}
            </p>

            {/* 🌬️ Vidéo spéciale pour Sila */}
            {selectedSpirit.spirit_name === "Sila" && (
              <div style={{ marginTop: "1rem" }}>
                <video
                  src="/assets/video/Sil.mp4"
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
                    opacity: 0.9,
                  }}
                />
                <p
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.8,
                    marginTop: "0.5rem",
                    fontStyle: "italic",
                    color: "#aefcf5",
                  }}
                >
                  🌬️ Respire avec Sila — le souffle du monde.
                </p>
              </div>
            )}

            {/* 🌙 Rituel */}
            {selectedSpirit.ritual && (
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(127,255,212,0.2)",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  marginBottom: "1rem",
                  maxWidth: "320px",
                  marginInline: "auto",
                  fontStyle: "italic",
                  color: "#bff",
                  textShadow: "0 0 4px rgba(127,255,212,0.3)",
                }}
              >
                ✨ Rituel : <br />
                <span style={{ opacity: 0.9 }}>{selectedSpirit.ritual}</span>
              </div>
            )}

            {/* ❓ Quiz */}
            {selectedSpirit.quiz && (
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
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#7fffd4",
                    marginBottom: "0.4rem",
                  }}
                >
                  ❓ {selectedSpirit.quiz.question}
                </p>
                {selectedSpirit.quiz.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setQuizPassed(
                        i === selectedSpirit.quiz.correct
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
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* 🔘 Continuer seulement si quiz réussi */}
            <button
              className="next-btn pulse"
              onClick={() => {
                if (!quizPassed) {
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
                opacity: quizPassed ? 1 : 0.5,
                transition: "opacity 0.3s ease",
              }}
              disabled={!quizPassed}
            >
              🌙 Continuer avec {selectedSpirit.symbol}{" "}
              {selectedSpirit.spirit_name}
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
              opacity: 0.8,
              cursor: "pointer",
            }}
          >
            🔧 Réinitialiser la mission Inuite
          </button>
        )}
      </div>
    )
  }

  // 🌀 ÉTAPE 2 — Hublot résonant
  if (step === 2 && selectedSpirit) {
    return (
      <HublotResonant
        step={selectedSpirit}
        onComplete={(selectedTags) => {
          setTags(selectedTags)
          setStep(3)
        }}
      />
    )
  }

  // ✨ ÉTAPE 3 — Création et sauvegarde
  if (step === 3 && selectedSpirit) {
    return (
      <OnimojiCreation
        userId={userId}
        spirit={selectedSpirit.spirit_name}
        emoji={selectedSpirit.symbol}
        tags={tags}
        onDone={() => {
          setAwakened((prev) => [...prev, selectedSpirit.step_number])
          setSelectedSpirit(null)
          setStep(1)
        }}
      />
    )
  }

  return null
}