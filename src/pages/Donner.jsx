import { useState } from 'react'
import '../App.css'

export default function Donner() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (message.trim() !== '') {
      setSent(true)
      setTimeout(() => {
        setMessage('')
        setSent(false)
      }, 2500)
    }
  }

  return (
    <div className="app-container">
      <h1>💫 Donner</h1>
      <p className="subtitle">
        Offre un rêve, une intention, ou un souffle à l’univers.
      </p>

      <textarea
        className="dream-input"
        value={message}
        placeholder="Écris ici ton offrande onirique..."
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="dream-button" onClick={handleSend}>
        ✨ Envoyer
      </button>

      {sent && <p className="hint">🌠 Message envoyé dans les étoiles...</p>}
    </div>
  )
}