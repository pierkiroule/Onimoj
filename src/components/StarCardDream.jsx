// src/components/StarCardDream.jsx
import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import { getWordPoolForStep } from "../data/inuitWordBanks"

export default function StarCardDream({
  userId,
  emoji = "✨",
  culture = "Inuite",
  spirit = "Sila",
  step_number = 1,
  step = {},
  allowReroll = true,
  showBeforeSave = true,
  onSaved,
}) {
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")
  const [saved, setSaved] = useState(false)
  const hasDrawn = useRef(false)

  // === Tirage stable de 5 mots ===
  function drawTags() {
    const pool = getWordPoolForStep(step)
    if (!Array.isArray(pool) || pool.length === 0) return []
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5).map((w) => w.fr)
  }

  useEffect(() => {
    if (!hasDrawn.current) {
      setTags(drawTags())
      hasDrawn.current = true
    }
  }, [])

  // === Sauvegarde ===
  async function saveToRevotheque() {
    if (!userId) return alert("Connecte-toi pour sauvegarder ton étoile.")
    if (!tags.length) return setStatus("⚠️ Aucun tag à sauvegarder.")
    setSaving(true)
    try {
      const { error } = await supabase.from("revotheque_reves").insert({
        user_id: userId,
        culture,
        spirit,
        step_number,
        emoji,
        titre: `${spirit} – Étoile du Souffle`,
        texte: tags.join(", "),
        tags,
        date: new Date(),
      })
      if (error) throw error
      setSaved(true)
      setStatus("🌟 Étoile sauvegardée dans ta Rêvothèque.")
      onSaved && onSaved()
    } catch (err) {
      console.error("⚠️ Erreur sauvegarde :", err)
      setStatus("Erreur de sauvegarde.")
    } finally {
      setSaving(false)
    }
  }

  // === Données SVG ===
  const c = 160, R = 120, r = 55
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180)
    const rad = i % 2 === 0 ? R : r
    return [c + rad * Math.cos(a), c + rad * Math.sin(a)]
  })
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

  // === Styles inline ===
  const cardStyle = {
    margin: "1.5rem auto",
    padding: "1rem",
    maxWidth: "360px",
    textAlign: "center",
    background: "radial-gradient(circle at 50% 30%, rgba(8,18,26,.85), rgba(0,0,0,.8))",
    border: "1px solid rgba(127,255,212,.25)",
    borderRadius: "16px",
    boxShadow: "0 0 24px rgba(127,255,212,.15)",
    color: "#eaffff",
    fontFamily: "system-ui, sans-serif",
    transition: "all .5s ease",
  }

  const btnStyle = {
    padding: "0.6rem 1.2rem",
    margin: "0.4rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "0.95rem",
    cursor: "pointer",
    color: "#001a14",
    background: "linear-gradient(135deg, #7fffd4, #c3ffe8)",
    boxShadow: "0 0 10px rgba(127,255,212,.4)",
    transition: "transform .2s",
  }

  const btnPulse = {
    ...btnStyle,
    animation: "pulseGlow 2s infinite ease-in-out",
  }

  const statusStyle = {
    fontSize: "0.85rem",
    opacity: 0.8,
    marginTop: ".6rem",
  }

  // === Rendu ===
  return (
    <div style={cardStyle}>
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
          style={{ filter: "drop-shadow(0 0 6px rgba(127,255,212,.4))" }}
        />

        <text x="160" y="165" textAnchor="middle" fontSize="40" dominantBaseline="middle">
          {emoji}
        </text>

        {showBeforeSave &&
          tags.map((t, i) => {
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
                style={{ textShadow: "0 0 8px rgba(0,0,0,0.6)", letterSpacing: "0.5px" }}
              >
                {t}
              </text>
            )
          })}
      </svg>

      {!saved && (
        <>
          {allowReroll && (
            <button
              style={btnStyle}
              onClick={() => {
                setTags(drawTags())
                setStatus("🎲 Nouveau tirage effectué.")
              }}
            >
              🎲 Relancer le tirage des 5 mots resonants
            </button>
          )}

          <button
            style={btnPulse}
            onClick={saveToRevotheque}
            disabled={saving}
          >
            {saving ? "💾 Sauvegarde..." : "🌟 Sauvegarder l’étoile"}
          </button>
        </>
      )}

      {status && <p style={statusStyle}>{status}</p>}
    </div>
  )
}