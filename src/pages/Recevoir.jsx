import { useState } from 'react'
import '../App.css'

export default function Recevoir() {
  const messages = [
    "🌬️ Un vent doux t’apporte le souvenir d’un rêve oublié.",
    "💧 Une larme d’étoile glisse sur la mer du sommeil.",
    "🔥 Un feu intérieur s’allume dans la nuit de ton cœur.",
    "🌿 Une brise d’aurore caresse ton esprit en éveil.",
    "🪶 Un oiseau d’argent t’offre un chant venu d’ailleurs.",
    "🌕 La lune te murmure : tu es fait de lumière et d’eau.",
    "🌌 Le cosmos t’écoute… et répond par un frisson silencieux."
  ]

  const [message, setMessage] = useState('')
  const [received, setReceived] = useState(false)

  const handleReceive = () => {
    const random = messages[Math.floor(Math.random() * messages.length)]
    setMessage(random)
    setReceived(true)
  }

  return (
    <div className="app-container">
      <h1>🌙 Recevoir</h1>
      <p className="subtitle">
        Accueille un écho venu de l’univers onirique.
      </p>

      <button className="dream-button" onClick={handleReceive}>
        💫 Écouter le message
      </button>

      {received && (
        <div className="memory-bubble" style={{ marginTop: '1.5rem' }}>
          {message}
        </div>
      )}
    </div>
  )
}