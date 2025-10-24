import { useState } from "react"
import PropTypes from "prop-types"
import ModuleInuitStep from "./ModuleInuitStep"
import OnimojiQuiz from "./OnimojiQuiz"
import HublotResonant from "./HublotResonant"
import { supabase } from "../supabaseClient"

export default function StepRenderer({ step, userId, onComplete }) {
  // Phase 0: rendu minimal + hublot simplifié pour test/intégration
  const [showHublot, setShowHublot] = useState(false)
  const [starDraft, setStarDraft] = useState(null)
  const [title, setTitle] = useState("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")

  async function saveStar() {
    if (!starDraft) return
    const payload = {
      title: title?.trim() || starDraft.title || `Étoile — Étape ${step.step_number}`,
      emojis: starDraft.emojis,
      culture: starDraft.culture,
      spirit: starDraft.spirit,
      step_number: starDraft.step_number,
      user_id: userId || null,
      resonance_level: 0.25,
      poetic_chain: [],
    }
    setSaving(true)
    setStatus("")
    try {
      await supabase.from("dreamstars").insert([payload]).select().single()
      setStatus("Bulle enregistrée")
      setStarDraft(null)
      setTitle("")
    } catch (e) {
      setStatus("Erreur d’enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <ModuleInuitStep step={step} onOpenHublot={() => setShowHublot(true)} />

      {/* Hublot résonant minimal */}
      {showHublot && (
        <div style={{ marginTop: "1rem" }}>
          <HublotResonant
            culture="Inuite"
            userId={userId}
            step={step}
            onComplete={(payload) => {
              setShowHublot(false)
              setStarDraft(payload)
            }}
          />
        </div>
      )}

      {/* Éditeur minimal d’étoile mytho-onirique */}
      {starDraft && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <input
            placeholder="Titre de ta bulle mythonirique…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mission-input"
          />
          <div>
            <button className="save-btn" onClick={saveStar} disabled={saving}>
              Enregistrer dans l’échocreation
            </button>
          </div>
          {status && <p className="status-text">{status}</p>}
        </div>
      )}

      <div className="quiz-zone">
        <OnimojiQuiz stepNumber={step.step_number} userId={userId} onComplete={onComplete} />
      </div>
    </div>
  )
}

StepRenderer.propTypes = {
  step: PropTypes.object,
  userId: PropTypes.string,
  onComplete: PropTypes.func,
}
