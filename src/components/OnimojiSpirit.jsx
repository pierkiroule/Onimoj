
import { useEffect, useState } from "react"

export default function OnimojiSpirit({ onNext }) {
  const [visible, setVisible] = useState(false)
  const [spirit, setSpirit] = useState(null)

  // base de données locale — poèmes et ressources
  const spirits = [
    {
      name: "Lumae",
      emoji: "🌕",
      title: "Esprit du Souffle calme",
      message: "Ce que tu écoutes devient lumière.",
      ritual: "Respire trois fois lentement, puis observe une lueur autour de toi.",
    },
    {
      name: "Selyr",
      emoji: "💫",
      title: "Esprit du Rêve nomade",
      message: "Chaque pas du son t’ouvre un horizon.",
      ritual: "Ferme les yeux et imagine ton prochain départ.",
    },
    {
      name: "Aren",
      emoji: "🌊",
      title: "Esprit des Marées intérieures",
      message: "Tes émotions sont des vagues qui parlent du ciel.",
      ritual: "Note un mot qui te traverse avant de t’endormir.",
    },
    {
      name: "Kaori",
      emoji: "🍃",
      title: "Esprit des Souffles clairs",
      message: "Le silence a besoin de ton écoute pour respirer.",
      ritual: "Éteins un instant les écrans. Laisse ton souffle redevenir vent.",
    },
    {
      name: "Norell",
      emoji: "🔥",
      title: "Esprit de la Flamme douce",
      message: "Ta clarté réchauffe le monde invisible.",
      ritual: "Allume une bougie ou pense à une lumière intérieure.",
    },
  ]

  useEffect(() => {
    // choisir un esprit aléatoire
    const randomSpirit = spirits[Math.floor(Math.random() * spirits.length)]
    setSpirit(randomSpirit)
    // effet d’apparition douce
    const t = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(t)
  }, [])

  if (!spirit) return null

  return (
    <div className="onimoji-spirit fade-in">
      <div className="spirit-orb">
        <div className="orb-glow"></div>
        <div className="orb-symbol">{spirit.emoji}</div>
      </div>

      <h2 className="spirit-name">{spirit.name}</h2>
      <h3 className="spirit-title">{spirit.title}</h3>

      {visible && (
        <div className="spirit-message fade-in-slow">
          <p className="quote">“{spirit.message}”</p>
          <p className="ritual">🌙 {spirit.ritual}</p>
        </div>
      )}

      {visible && (
        <button className="dream-button" onClick={onNext}>
          💫 Revenir au CosmoDream
        </button>
      )}
    </div>
  )
}