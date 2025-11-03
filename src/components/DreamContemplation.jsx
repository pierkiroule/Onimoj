import { useState, useEffect } from "react"
import "./DreamContemplation.css"

const contemplations = {
  Sila: {
    title: "🌬️ Sila – Le souffle du monde",
    text: `
Sila t'invite à respirer le monde.
À sentir dans ton souffle la continuité du ciel et de la mer.
Sa sagesse rappelle que le sommeil commence par le relâchement :
celui du contrôle, du poids, du jour.
Quand tu inspires lentement, c’est Sila qui entre en toi.
Quand tu expires, c’est ton esprit qui rejoint le vent.`
  },
  Sedna: {
    title: "🌊 Sedna – La gardienne des profondeurs",
    text: `
Sedna t’apprend à plonger sans peur.
Sous la surface du rêve se cachent les mémoires, les émotions figées.
Elle t’encourage à écouter ce qui dort, à caresser les ombres.
Le sommeil, pour Sedna, est un océan de réparation.`
  },
  Qilak: {
    title: "🌌 Qilak – Le ciel résonant",
    text: `
Qilak t’invite à contempler les constellations intérieures.
Chaque étoile est une pensée paisible, un souvenir lumineux.
En t’endormant, imagine ton esprit flotter doucement
dans le ciel du monde, libre et léger.`
  }
}

export default function DreamContemplation({ spirit = "Sila", onNext }) {
  const [text, setText] = useState(null)

  useEffect(() => {
    setText(contemplations[spirit] || contemplations.Sila)
  }, [spirit])

  return (
    <div className="dream-contemplation fade-in">
      <h2>{text?.title}</h2>
      <p className="contempl-text">{text?.text}</p>
      <button className="next-btn" onClick={onNext}>
        🌱 Laisser germer le rêve Onimoji
      </button>
    </div>
  )
}