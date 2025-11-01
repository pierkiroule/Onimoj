import { useState } from "react"
import { inuitLexicon } from "../data/inuitLexicon"
import { getWordPoolForStep } from "../data/inuitWordBanks"

export default function InuitWordsDisplay({ step }) {
  const [active, setActive] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)
  const words = getWordPoolForStep(step)

  const handleTouchStart = (word) => {
    const id = setTimeout(() => setActive(word), 500)
    setTimeoutId(id)
  }
  const handleTouchEnd = () => clearTimeout(timeoutId)

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        padding: "1rem",
        color: "#bdeaff",
        fontSize: "1.2rem",
      }}
    >
      {words.map((term, i) => (
        <div
          key={i}
          onMouseEnter={() => setActive(term)}
          onMouseLeave={() => setActive(null)}
          onTouchStart={() => handleTouchStart(term)}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "relative",
            cursor: "pointer",
            padding: "0.2rem 0.4rem",
            borderBottom: "1px dotted rgba(255,255,255,0.4)",
          }}
        >
          {term}
          {active === term && (
            <div
              style={{
                position: "absolute",
                bottom: "130%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                padding: "0.5rem 0.7rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                zIndex: 10,
                animation: "fadeIn 0.3s ease",
              }}
            >
              {inuitLexicon[term] || "…"}
            </div>
          )}
        </div>
      ))}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, 10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `}
      </style>
    </div>
  )
}