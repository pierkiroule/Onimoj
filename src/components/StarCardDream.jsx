// src/components/StarCardDream.jsx
import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import { getWordPoolForStep } from "../data/inuitWordBanks"
import "./StarCardDream.css"

export default function StarCardDream({
  userId,
  emoji = "✨",
  culture = "Inuite",
  spirit = "Sila",
  step_number = 1,
  step = {},
  onSaved
}) {
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")
  const wordsRef = useRef([])

  // 🎲 Tirage unique des 5 mots
  useEffect(() => {
    if (wordsRef.current.length === 0) {
      wordsRef.current = getWordPoolForStep(step)
    }
  }, [step])

  const words = wordsRef.current

  // 💾 Sauvegarde dans la rêvothèque
  async function saveToRevotheque() {
    if (!userId) return alert("Connecte-toi pour sauvegarder ton étoile.")
    setSaving(true)
    try {
      const { error } = await supabase.from("revotheque_reves").insert({
        user_id: userId,
        culture,
        spirit,
        step_number,
        emoji,
        titre: `${spirit} – Étoile du Souffle`,
        texte: words.map(w => w.fr).join(", "),
        tags: words.map(w => w.fr),
        date: new Date(),
      })
      if (error) throw error
      setStatus("🌟 Étoile sauvegardée dans ta Rêvothèque.")
      onSaved && onSaved(words)
    } catch (err) {
      console.error("⚠️ Erreur sauvegarde :", err)
      setStatus("Erreur de sauvegarde.")
    } finally {
      setSaving(false)
    }
  }

  // ⭐ Dessin de l’étoile
  const c = 160, R = 120, r = 55
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (-90 + i * 36) * (Math.PI / 180)
    const rad = i % 2 === 0 ? R : r
    pts.push([c + rad * Math.cos(a), c + rad * Math.sin(a)])
  }
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

  return (
    <div className="star-card fade-in">
      <svg viewBox="0 0 320 320" width="240" height="240">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(127,255,212,0.4)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </radialGradient>
        </defs>

        <path
          d={d}
          fill="url(#grad)"
          stroke="#7fffd4"
          strokeWidth="1.5"
          filter="drop-shadow(0 0 6px rgba(127,255,212,.4))"
        />

        {/* 🌟 Emoji central */}
        <text
          x="160"
          y="165"
          textAnchor="middle"
          fontSize="40"
          dominantBaseline="middle"
        >
          {emoji}
        </text>

        {/* 💬 Mots FR sur les branches */}
        {words.map((w, i) => {
          const angle = (-90 + i * 72) * (Math.PI / 180)
          const x = 160 + Math.cos(angle) * 130
          const y = 160 + Math.sin(angle) * 130
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="13"
              fill="#e9fffd"
              fontWeight="500"
              style={{
                textShadow: "0 0 8px rgba(0,0,0,0.6)",
                letterSpacing: "0.5px"
              }}
            >
              {w.fr}
            </text>
          )
        })}
      </svg>

      <button
        onClick={saveToRevotheque}
        disabled={saving}
        className="save-btn pulse"
      >
        {saving ? "💾 Sauvegarde..." : "🌟 Sauvegarder l’étoile"}
      </button>

      {status && <p className="status">{status}</p>}
    </div>
  )
}