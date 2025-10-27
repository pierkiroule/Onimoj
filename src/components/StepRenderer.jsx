import { useState } from "react"
import PropTypes from "prop-types"
import ModuleInuitStep from "./ModuleInuitStep"
import OnimojiQuiz from "./OnimojiQuiz"
import HublotResonant from "./HublotResonant"
import { supabase } from "../supabaseClient"

export default function StepRenderer({ step, userId, onComplete }) {
  const [showHublot, setShowHublot] = useState(false)
  const [starDraft, setStarDraft] = useState(null)
  const [title, setTitle] = useState("")
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")

  const handleOpenHublot = () => {
    console.log("🌀 Ouverture du Hublot Résonnant…")
    setShowHublot(true)
    setStatus("🌌 Hublot résonant ouvert")
  }

  const handleCloseHublot = () => {
    console.log("❄️ Fermeture du Hublot Résonnant")
    setShowHublot(false)
  }

  async function saveStar() {
    if (!starDraft) return
    const payload = {
      title: title?.trim() || `Étoile — Étape ${step.step_number}`,
      emojis: starDraft.emojis,
      culture: "Inuite",
      spirit: step.spirit_name,
      step_number: step.step_number,
      user_id: userId || null,
      resonance_level: 0.25,
      poetic_chain: [],
    }

    setSaving(true)
    setStatus("")
    try {
      await supabase.from("dream_stars").insert([payload]).select().single()
      setStatus("💾 Bulle enregistrée avec succès")
      setStarDraft(null)
      setTitle("")
    } catch (err) {
      console.error("❌ Erreur Supabase :", err)
      setStatus("⚠️ Erreur d’enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="step-renderer">
      <ModuleInuitStep step={step} onOpenHublot={handleOpenHublot} />

      {/* Hublot résonnant */}
      {showHublot && (
        <div className="hublot-wrapper">
          <HublotResonant
            culture="Inuite"
            step={step}
            onClose={handleCloseHublot}
            onComplete={(payload) => {
              console.log("✅ Hublot complété :", payload)
              setStarDraft(payload)
              setShowHublot(false)
              setStatus("✨ Inspiration reçue du hublot")
            }}
          />
        </div>
      )}

      {/* Éditeur de bulle */}
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
              {saving ? "⏳ Enregistrement…" : "💾 Sauvegarder"}
            </button>
          </div>
        </div>
      )}

      {/* Statut */}
      {status && (
        <p className="status-text" style={{ textAlign: "center", marginTop: "0.6rem" }}>
          {status}
        </p>
      )}

      {/* Quiz */}
      <div className="quiz-zone">
        <OnimojiQuiz stepNumber={step.step_number} userId={userId} onComplete={onComplete} />
      </div>
    </div>
  )
}

StepRenderer.propTypes = {
  step: PropTypes.object.isRequired,
  userId: PropTypes.string,
  onComplete: PropTypes.func,
}