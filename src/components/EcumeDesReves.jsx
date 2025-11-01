import { useEffect, useState } from "react"
import timerVideo from "../assets/video/timer.mp4"
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
  duration = 43200, // 12h = 12*60*60 secondes
  onComplete,
}) {
  const [i, setI] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration)

  // 💬 rotation des phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setI((p) => (p + 1) % phrases.length)
    }, cycle)
    return () => clearInterval(interval)
  }, [cycle, phrases.length])

  // ⏳ décompte visuel (en secondes)
  useEffect(() => {
    if (timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  return (
    <div className="resotimer">
      {/* ——— Horloge haute ——— */}
      <div className="resotimer__topTimer">
        <span className="resotimer__time">{formatTime(timeLeft)}</span>
        <div className="particles">
          {[...Array(12)].map((_, k) => (
            <span key={k} className="dot" />
          ))}
        </div>
      </div>

      {/* ——— Vidéo onirique ——— */}
      <div className="resotimer__videoWrap">
        <video
          src={timerVideo}
          autoPlay
          loop
          muted
          playsInline
          className="resotimer__video"
        />
        <div key={i} className="resotimer__phrase fade-in">
          {phrases[i]}
        </div>
      </div>

      {/* ——— Texte poétique Durand ——— */}
      <div className="resotimer__guide">
        <p>
          Ton rêve Onimoji sera RÊVélé dans 12h. En attendant ton Onimoji est disponible dans l'espace d'Échocréation pour s'enrichir des échos des autres membres et de notre inspirIA. Ton Onimoji va maturer pendant 12h. Patience, déconnexion et ralentissement... Quand le jour rêve la nuit, la nuit inspire le jour.  
          Ce voyage de douze heures suit le rythme des imaginaires chers à <b>Gilbert Durand</b> :  
          <br /><br />
          Le <b>régime diurne</b> — solaire, ascendant, porteur d’élan et de clarté —  
          s’incline devant le <b>régime nocturne</b> — lunaire, intérieur,  
          où le monde s’enveloppe et se régénère.  
          <br /><br />
          Ensemble, ils tissent la respiration symbolique de l’âme :  
          le souffle du jour éclaire ton rêve,  
          et le rêve de la nuit éclaire ton jour.
        </p>

        <button className="dream-button" onClick={() => onComplete?.()}>
          ⏭️ Passer
        </button>
      </div>
    </div>
  )
}