import { useState } from "react"
import ModuleInuitStep from "./ModuleInuitStep"
import inuitSteps from "../data/inuitSteps.json"
import "./ModuleInuitContainer.css"

export default function ModuleInuitContainer({ onOpenHublot }) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = inuitSteps.length
  const step = inuitSteps[currentStep]

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1 < totalSteps ? prev + 1 : prev))
  }
  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  // 💫 Classe du fond selon l’étape
  const bgClass = (() => {
    const name = step.spirit_name?.toLowerCase() || ""
    if (name.includes("sila")) return "bg-sila"
    if (name.includes("sedna")) return "bg-sedna"
    if (name.includes("qailertetang")) return "bg-qailertetang"
    if (name.includes("anirniq")) return "bg-anirniq"
    return "bg-default"
  })()

  return (
    <div className={`inuit-container fade-in ${bgClass}`}>
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
      <ModuleInuitStep step={step} onOpenHublot={onOpenHublot} />

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