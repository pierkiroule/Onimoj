// src/steps/Step1Circle.jsx
import React from "react"
import InuitCircle from "../components/InuitCircle"

/**
 * 🌙 Étape 1 : Cercle des Gardiens (culture Inuite)
 * @param {Object} props
 * @param {Array} props.awakenedSteps - gardiens déjà éveillés
 * @param {Object} props.selectedSpirit - gardien sélectionné
 * @param {Function} props.onSpiritSelect - callback quand un gardien est choisi
 * @param {Function} props.onSpiritCall - fonction d'appel aléatoire
 * @param {Function} props.onContinue - passe à l'étape suivante
 * @param {Boolean} props.quizPassed - état du quiz
 * @param {Function} props.setQuizPassed - setter du quiz
 * @param {Function} [props.onReset] - reset de mission (dev)
 * @param {Boolean} [props.isDev=false]
 */
export default function Step1Circle({
  awakenedSteps,
  selectedSpirit,
  onSpiritSelect,
  onSpiritCall,
  onContinue,
  quizPassed,
  setQuizPassed,
  onReset,
  isDev = false,
}) {
  return (
    <div
      className="fade-in"
      style={{
        textAlign: "center",
        color: "#e9fffd",
        padding: "1.4rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <h2 style={{ color: "#7fffd4" }}>🌙 Cercle des Gardiens — Culture Inuite</h2>

      <InuitCircle
        awakenedSteps={awakenedSteps}
        selectedSpirit={selectedSpirit}
        onSelect={onSpiritSelect}
        onSpiritCall={onSpiritCall}
      />

      {selectedSpirit && (
        <div style={{ marginTop: "1rem", padding: "0 1rem" }}>
          <h3>
            {selectedSpirit.symbol} {selectedSpirit.spirit_name}
          </h3>
          <p style={{ opacity: 0.8 }}>{selectedSpirit.title}</p>

          {/* Quiz éventuel */}
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

          {/* Bouton continuer */}
          <button
            className="next-btn pulse"
            onClick={() => {
              if (Array.isArray(selectedSpirit.quiz) && !quizPassed) {
                alert("Réponds d’abord au quiz 🌀")
                return
              }
              onContinue()
            }}
            style={{
              marginTop: "1rem",
              padding: ".6rem 1rem",
              border: "1px solid #7fffd4",
              background: "transparent",
              borderRadius: "10px",
              color: "#7fffd4",
              cursor: "pointer",
              opacity: Array.isArray(selectedSpirit.quiz)
                ? quizPassed
                  ? 1
                  : 0.5
                : 1,
            }}
          >
            🌙 Ouvrir le hublot de {selectedSpirit.spirit_name}
          </button>
        </div>
      )}

      {isDev && (
        <button
          onClick={onReset}
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