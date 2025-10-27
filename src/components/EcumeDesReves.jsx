import { useEffect, useState, useRef } from "react"
import "./EcumeDesReves.css"

export default function EcumeDesReves({
  phrases = [
    "Respire…",
    "Laisse le silence te parler…",
    "Le rêve s’approche.",
    "Tout est déjà là.",
    "🌕",
  ],
  cycle = 6000,
  repeat = 3,
  onComplete,
}) {
  const [i, setI] = useState(0)
  const [count, setCount] = useState(0)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  // --- gestion du cycle
  useEffect(() => {
    // fin normale
    if (count >= repeat) {
      timeoutRef.current = setTimeout(() => onComplete?.(), 800)
      return () => clearTimeout(timeoutRef.current)
    }

    // sinon on continue à défiler les phrases
    intervalRef.current = setInterval(() => {
      setI((p) => (p + 1) % phrases.length)
      setCount((c) => c + 1)
    }, cycle)

    return () => clearInterval(intervalRef.current)
  }, [count, repeat, cycle, phrases.length, onComplete])

  // --- bouton passer
  const handleSkip = () => {
    clearInterval(intervalRef.current)
    clearTimeout(timeoutRef.current)
    onComplete?.()
  }

  return (
    <div className="resotimer">
      {/* halo respirant et ondes */}
      <div className="resotimer__halo"></div>
      <div className="resotimer__circle resotimer__circle--1"></div>
      <div className="resotimer__circle resotimer__circle--2"></div>
      <div className="resotimer__circle resotimer__circle--3"></div>

      {/* phrase centrale */}
      <div key={i} className="resotimer__phrase fade-in">
        {phrases[i]}
      </div>

      {/* texte guide */}
      <div className="resotimer__guide">
        <p>
          Nous te proposons de ralentir.  
          De laisser ton regard flotter, ton souffle se poser.  
          Chaque onde est un temps de respiration.  
          Quand la dernière se dissipera, le rêve s’ouvrira.
        </p>
      </div>

      {/* ⏭️ Bouton Passer */}
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
          background: "rgba(127,255,212,0.15)",
          color: "#7fffd4",
          border: "1px solid rgba(127,255,212,0.4)",
          borderRadius: "8px",
          padding: "0.4rem 0.8rem",
          cursor: "pointer",
          fontSize: "0.9rem",
          zIndex: 5,
        }}
      >
        ⏭️ Passer
      </button>
    </div>
  )
}