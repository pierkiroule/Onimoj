import { useState, useEffect } from "react"
import "./DreamGermination.css"

export default function DreamGermination({ onFinish }) {
  const GERMINATION_HOURS = 12
  const GERMINATION_MS = GERMINATION_HOURS * 60 * 60 * 1000
  const [remaining, setRemaining] = useState(0)

  // 🌱 Initialisation
  useEffect(() => {
    const savedEnd = localStorage.getItem("dream_germination_end")
    let endTime = savedEnd ? parseInt(savedEnd) : Date.now() + GERMINATION_MS

    if (!savedEnd) {
      localStorage.setItem("dream_germination_end", endTime)
    }

    const update = () => {
      const diff = endTime - Date.now()
      if (diff <= 0) {
        setRemaining(0)
        localStorage.removeItem("dream_germination_end")
        onFinish && onFinish()
      } else {
        setRemaining(diff)
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [onFinish])

  // 🔢 Formatage
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="dream-germination fade-in">
      {remaining > 0 ? (
        <>
          <h2>🌱 Ton rêve Onimoji germe doucement…</h2>
          <p className="timer">{formatTime(remaining)}</p>
          <p className="message">
            Laisse ton esprit se déposer.  
            Comme une graine, ton rêve pousse dans le silence.  
            Reviens lorsque la lumière aura changé.
          </p>
        </>
      ) : (
        <>
          <h2>🌕 Ton rêve a germé</h2>
          <p className="message">
            Il est prêt à être cueilli, interprété ou partagé.  
            Respire profondément, et découvre ce qu’il t’a appris.
          </p>
          <button className="wake-btn" onClick={onFinish}>
            🌸 Réveiller le rêve
          </button>
        </>
      )}
    </div>
  )
}