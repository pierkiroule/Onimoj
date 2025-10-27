import { useState } from "react"
import PropTypes from "prop-types"
import ModuleInuitStep from "./ModuleInuitStep"
import inuitSteps from "../data/inuitSteps.json"
import "./ModuleInuitContainer.css"

export default function ModuleInuitContainer({ onOpenHublot }) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = inuitSteps.length
  const step = inuitSteps[currentStep]

  // 🧭 Fonctions de navigation
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  // 💫 Classe du fond selon l’esprit
  const bgClass = (() => {
    const name = step.spirit_name?.toLowerCase() || ""
    if (name.includes("sila")) return "bg-sila"
    if (name.includes("sedna")) return "bg-sedna"
    if (name.includes("qailertetang")) return "bg-qailertetang"
    if (name.includes("anirniq")) return "bg-anirniq"
    return "bg-default"
  })()

  return (
    <div className={`inuit-container ${bgClass}`}>
      {/* 🌌 Barre de progression */}
      <div className="inuit-progress">
        {inuitSteps.map((s, i) => (
          <div
            key={i}
            className={`inuit-bubble ${
              i === currentStep
                ? "active"
                : i < currentStep
                ? "past"
                : "future"
            }`}
            title={`Étape ${s.step_number} — ${s.spirit_name}`}
            onClick={() => setCurrentStep(i)}
          >
            {s.symbol}
          </div>
        ))}
      </div>

      {/* 🌙 Étape culturelle */}
      <div key={step.step_number} className="fade-step">
        <ModuleInuitStep step={step} onOpenHublot={onOpenHublot} />
      </div>

      {/* 🔘 Navigation */}
      <div className="inuit-nav">
        <button
          className="dream-button"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          ← Précédent
        </button>

        <button
          className="dream-button"
          onClick={nextStep}
          disabled={currentStep === totalSteps - 1}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}

ModuleInuitContainer.propTypes = {
  onOpenHublot: PropTypes.func,
}