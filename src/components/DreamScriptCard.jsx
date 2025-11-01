// src/components/DreamScriptCard.jsx
import "./DreamScriptCard.css"

export default function DreamScriptCard({ script }) {
  if (!script) return null

  return (
    <div className="dreamscript-card fade-in">
      {/* Image générée */}
      {script.image_url && (
        <div className="dreamscript-img">
          <img src={script.image_url} alt="illustration onirique" loading="lazy" />
        </div>
      )}

      {/* Texte du script */}
      <div className="dreamscript-content">
        <h4>{script.title || "Rêve partagé"}</h4>
        <p className="dreamscript-text">
          {(script.text_generated || "").slice(0, 240)}…
        </p>

        {/* Auteurs */}
        <div className="dreamscript-meta">
          <span>
            ✨ Cocréé par <b>{script.user_a_name || "un rêveur"}</b> et{" "}
            <b>{script.user_b_name || "son DreamFriend"}</b>
          </span>
          <span className="score">
            💞 Résonance {Math.round((script.resonance_score || 0) * 100) / 100}
          </span>
        </div>
      </div>
    </div>
  )
}