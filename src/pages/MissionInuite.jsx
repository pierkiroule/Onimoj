import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import inuitSteps from "../data/inuitSteps.json"
import ModuleInuitStep from "../components/ModuleInuitStep"
import OnimojiQuiz from "../components/OnimojiQuiz"
import "./MissionInuite.css"

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [status, setStatus] = useState("")
  const [fade, setFade] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
    }
    loadUser()
  }, [])

  const step = inuitSteps[currentStep]

  const handleNext = () => {
    if (currentStep < inuitSteps.length - 1) {
      setFade(true)
      setTimeout(() => {
        setCurrentStep((s) => s + 1)
        setFade(false)
      }, 400)
      setStatus("✨ Étape suivante activée")
    } else {
      setStatus("🏁 Voyage terminé — les esprits te saluent.")
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setFade(true)
      setTimeout(() => {
        setCurrentStep((s) => s - 1)
        setFade(false)
      }, 400)
    }
  }

  if (!step) return <p>🌘 Chargement du rêve…</p>

  return (
    <div className="mission-inuite">
      <h2>❄️ Voyage Inuite</h2>
      <p className="mission-sub">Étape {currentStep + 1} / {inuitSteps.length}</p>

      {/* 🔹 Barre d’étapes */}
      <div className="step-bar">
        {inuitSteps.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentStep ? "active" : ""}`}
          />
        ))}
      </div>

      {/* 🌙 Contenu */}
      <div className={`fade-wrapper ${fade ? "fade-out" : "fade-in"}`}>
        <ModuleInuitStep step={step} />
      </div>

      {/* 🧭 Navigation */}
      <div className="nav-buttons">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="btn-prev"
        >
          ⬅️ Précédent
        </button>

        <button
          onClick={handleNext}
          className="btn-next"
        >
          ➡️ Suivant
        </button>
      </div>

      {/* 🧩 Quiz */}
      <div className="quiz-zone">
        <OnimojiQuiz
          stepNumber={currentStep + 1}
          userId={user?.id}
          onComplete={handleNext}
        />
      </div>

      {status && <p className="mission-status">{status}</p>}
    </div>
  )
}