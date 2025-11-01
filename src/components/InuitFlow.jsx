// src/components/InuitFlow.jsx
import { useState } from "react"
import HublotResonant from "./HublotResonant"
import { askNebius } from "../nebiusClient"
import { inuitSteps } from "../data/inuitSteps"
import "./InuitFlow.css"

export default function InuitFlow({ userId }) {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState("intro")
  const [dream, setDream] = useState("")
  const [loading, setLoading] = useState(false)
  const [drawnWords, setDrawnWords] = useState([])

  const step = inuitSteps[i]
  if (!step) return <p>❄️ Fin du voyage.</p>

  // === 🌱 Génération du rêve ===
  async function generateDream() {
    setLoading(true)
    const tags =
      drawnWords?.map(w => w.fr).join(", ") ||
      "vent, mer, glace, souffle, silence"

    const prompt = `
Raconte un rêve inuit au présent, inspiré de l’esprit ${step.spirit_name} (${step.symbol}).
Inspire-toi aussi de ces mots : ${tags}.
Décris des sensations, des sons, des gestes, des éléments naturels.
Utilise un style poétique, sensoriel, sobre et apaisé.
Ne crée pas de mots inventés.
    `

    const text = await askNebius(prompt, {
      model: "google/gemma-2-9b-it-fast",
      temperature: 0.8,
    })

    setDream(text)
    setLoading(false)
  }

  // === Structure de progression ===
  return (
    <div className="flow fade-in">
      <h2>
        {step.symbol} {step.spirit_name}
      </h2>
      <h3>{step.title}</h3>

      {/* INTRO */}
      {phase === "intro" && (
        <>
          <p>{step.text}</p>
          <button onClick={() => setPhase("ritual")}>✨ Continuer</button>
        </>
      )}

      {/* RITUEL */}
      {phase === "ritual" && (
        <>
          <blockquote>{step.ritual}</blockquote>
          <button onClick={() => setPhase("quiz")}>🌬️ Énigme</button>
        </>
      )}

      {/* QUIZ */}
      {phase === "quiz" && (
        <Quiz quiz={step.quiz} onNext={() => setPhase("hublot")} />
      )}

      {/* HUBLOT — étoile interactive */}
      {phase === "hublot" && (
        <HublotResonant
          step={step}
          userId={userId}
          onComplete={(words) => {
            // récupération des 5 mots tirés depuis StarCardDream
            setDrawnWords(words)
            setPhase("dream")
          }}
        />
      )}

      {/* IA — génération du rêve */}
      {phase === "dream" && (
        <>
          <button onClick={generateDream} disabled={loading}>
            {loading ? "🌙 Inspiration..." : "🌱 Générer la graine OnimojIA"}
          </button>
          {dream && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                textAlign: "center",
                lineHeight: "1.5",
                marginTop: "1rem",
              }}
            >
              {dream}
            </pre>
          )}
          <button
            onClick={() => {
              setDream("")
              setPhase("intro")
              setI(i + 1)
            }}
          >
            → Esprit suivant
          </button>
        </>
      )}
    </div>
  )
}

// === Composant quiz minimal ===
function Quiz({ quiz, onNext }) {
  const [answer, setAnswer] = useState(null)
  return (
    <div className="quiz fade-in">
      <p>{quiz.question}</p>
      {quiz.options.map((opt, i) => (
        <button key={i} onClick={() => setAnswer(i)}>
          {opt}
        </button>
      ))}
      {answer !== null && (
        <>
          <p>
            {answer === quiz.correct
              ? "✅ Bonne réponse"
              : "❌ Essaie encore"}
          </p>
          {answer === quiz.correct && (
            <button onClick={onNext}>🌕 Continuer</button>
          )}
        </>
      )}
    </div>
  )
}