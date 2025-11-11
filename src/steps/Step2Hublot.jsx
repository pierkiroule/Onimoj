// src/steps/Step2Hublot.jsx
import React, { useState, useMemo } from "react"
import { inuitWordBanksByIndex } from "../data/inuitWordBanks"
import BubbleField from "../components/hublot/BubbleField"
import StarPreview from "../components/StarPreview"

/**
 * ✨ Étape 2 : Hublot Résonant — Capture de mots oniriques
 * @param {Object} props
 * @param {Object} props.spirit - Gardien sélectionné
 * @param {Function} props.onComplete - Callback renvoyant { tags, echoMax }
 * @param {Function} props.onBack - Retour vers l’étape précédente
 */
export default function Step2Hublot({ spirit, onComplete, onBack }) {
  const [captured, setCaptured] = useState([])
  const [complete, setComplete] = useState(false)
  const [echoMax, setEchoMax] = useState(6)

  // 📚 Sélection dynamique de la banque de mots
  const bank = useMemo(() => {
    const list = (inuitWordBanksByIndex?.[spirit.step_number] || []).map((o) => o.fr)
    return Array.from(new Set(list))
  }, [spirit.step_number])

  // 🔮 Capture d’un mot
  function handleCapture(label) {
    const next = [...captured, label].slice(0, 5)
    setCaptured(next)
    if (next.length === 5) setComplete(true)
  }

  // 🎨 Styles inline
  const s = {
    container: {
      padding: "1rem",
      color: "#e9fffd",
      textAlign: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      lineHeight: 1.45,
      userSelect: "none",
    },
    title: {
      color: "#7fffd4",
      fontSize: "1.3rem",
      fontWeight: 700,
      letterSpacing: "0.02em",
      textShadow: "0 0 10px rgba(127,255,212,0.3)",
      marginBottom: "0.6rem",
    },
    paragraph: {
      opacity: 0.9,
      maxWidth: 340,
      margin: "0.6rem auto 1.2rem",
      fontSize: "0.95rem",
    },
    counter: {
      marginTop: "1rem",
      fontSize: ".9rem",
      opacity: 0.85,
      color: "#aefcf5",
      letterSpacing: "0.02em",
    },
    btnPrimary: {
      marginTop: "1.3rem",
      padding: ".7rem 1.5rem",
      borderRadius: "12px",
      border: "none",
      background: "linear-gradient(90deg, #7fffd4, #6a5acd)",
      color: "#0a0a0a",
      fontWeight: "700",
      letterSpacing: "0.03em",
      cursor: "pointer",
      boxShadow: "0 2px 10px rgba(127,255,212,0.25)",
      transition: "all 0.25s ease",
    },
    range: {
      width: "80%",
      marginTop: ".4rem",
      accentColor: "#7fffd4",
    },
  }

  return (
    <div style={s.container}>
      <h3 style={s.title}>
        {spirit.symbol} Le souffle de {spirit.spirit_name}
      </h3>

      {!complete ? (
        <>
          <p style={s.paragraph}>
            Ferme les yeux, respire. Les bulles sont les mots de ton inconscient.
            Appuie sur celles qui vibrent — cinq formeront ton étoile.
          </p>

          <BubbleField
            bank={bank}
            symbol={spirit.symbol}
            candidateCount={15}
            onCapture={handleCapture}
          />

          <div style={s.counter}>✨ Mots captés : {captured.length}/5</div>

          <button onClick={onBack} style={{ ...s.btnPrimary, marginTop: "1.5rem" }}>
            ⬅️ Retour au cercle
          </button>
        </>
      ) : (
        <div className="fade-in" style={{ marginTop: ".8rem" }}>
          <StarPreview
            words={captured}
            centerEmoji={spirit.symbol}
            echoCount={echoMax / 2}
            echoMax={echoMax}
          />

          <h4 style={{ color: "#7fffd4", marginTop: ".8rem" }}>
            Ton étoile onirique est prête
          </h4>

          <div style={{ marginTop: "1.2rem" }}>
            <h4 style={{ color: "#aefcf5", marginBottom: ".3rem" }}>
              💫 Nombre d’échos avant métamorphose
            </h4>

            <input
              type="range"
              min="3"
              max="9"
              value={echoMax}
              onChange={(e) => setEchoMax(Number(e.target.value))}
              style={s.range}
            />

            <div style={{ fontSize: ".9rem", opacity: 0.85, marginTop: ".3rem" }}>
              {echoMax} contributions avant métamorphose
            </div>
          </div>

          <button
            onClick={() => onComplete({ tags: captured, echoMax })}
            style={s.btnPrimary}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.04)"
              e.target.style.boxShadow = "0 4px 14px rgba(127,255,212,0.4)"
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)"
              e.target.style.boxShadow = "0 2px 10px rgba(127,255,212,0.25)"
            }}
          >
            ✅ Continuer
          </button>
        </div>
      )}
    </div>
  )
}