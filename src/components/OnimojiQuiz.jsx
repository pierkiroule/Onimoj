import { useEffect, useMemo, useState } from "react"
import { onimojiQuizFr } from "../data/onimojiQuizFr"

export default function OnimojiQuiz({ stepNumber, userId, onComplete }) {
  const quizItem = useMemo(
    () => onimojiQuizFr.find((q) => q.step === stepNumber) || null,
    [stepNumber]
  )

  const storageKey = useMemo(
    () => `onimoji-quiz-inuite-${userId || "anon"}-step-${stepNumber}`,
    [userId, stepNumber]
  )

  const [selected, setSelected] = useState("")
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved?.selected) setSelected(saved.selected)
        if (saved?.revealed) setRevealed(true)
      }
    } catch (_) {
      // ignore
    }
  }, [storageKey])

  if (!quizItem) return null

  const isCorrect = selected && selected === quizItem.answer

  const handleSelect = (opt) => {
    if (revealed) return
    setSelected(opt)
  }

  const handleReveal = () => {
    if (!selected) return
    setRevealed(true)
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ selected, revealed: true, at: new Date().toISOString() })
      )
    } catch (_) {
      // ignore
    }
  }

  return (
    <div
      style={{
        marginTop: "1rem",
        padding: "0.9rem 1rem",
        border: "1px solid rgba(127,255,212,0.3)",
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(8,16,25,0.9), rgba(2,4,6,0.9))",
        boxShadow: "0 0 20px rgba(110,255,180,0.15)",
        color: "#e8fff6",
        maxWidth: 560,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: "1.3rem" }}>📘</div>
        <div style={{ fontWeight: 700 }}>Mini-quiz initiatique — Étape {stepNumber}/12</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.9 }}>
        <span style={{ fontSize: "1.2rem" }}>{quizItem.symbol}</span>
        <span style={{ fontWeight: 600 }}>{quizItem.spirit}</span>
      </div>

      <p style={{ margin: "0.6rem 0 0.8rem", opacity: 0.95 }}>{quizItem.question}</p>

      <div style={{ display: "grid", gap: 8 }}>
        {quizItem.options.map((label) => {
          const opt = label.charAt(0)
          const isSel = selected === opt
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              style={{
                textAlign: "left",
                padding: "0.55rem 0.7rem",
                background: isSel ? "rgba(110,255,180,0.18)" : "#0c1418",
                color: isSel ? "#bff" : "#e8fff6",
                border: `1px solid ${isSel ? "rgba(110,255,180,0.6)" : "rgba(127,255,212,0.25)"}`,
                borderRadius: 10,
                cursor: revealed ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {!revealed && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={handleReveal}
            disabled={!selected}
            style={{
              background: selected ? "#6eff8d" : "#335",
              color: selected ? "#111" : "#99aac0",
              border: "none",
              borderRadius: 10,
              padding: "0.45rem 0.9rem",
              fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            Valider ma réponse
          </button>
        </div>
      )}

      {revealed && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: isCorrect ? "#6eff8d" : "#ff9090",
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{isCorrect ? "✅" : "❌"}</span>
            <span>
              {isCorrect ? "Bonne réponse !" : `Réponse attendue : ${quizItem.answer}.`}
            </span>
          </div>

          <p style={{ marginTop: 8, opacity: 0.9 }}>{quizItem.comment}</p>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              onClick={() => onComplete && onComplete({ step: stepNumber, selected, correct: isCorrect })}
              style={{
                background: "linear-gradient(145deg,#6eff8d,#35a0ff)",
                color: "#111",
                border: "none",
                borderRadius: 10,
                padding: "0.52rem 0.95rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
