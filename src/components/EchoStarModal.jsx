import { supabase } from "../supabaseClient"
import { useState } from "react"

export default function EchoStarModal({ star, onClose }) {
  const [chain, setChain] = useState(star.poetic_chain || [])
  const [input, setInput] = useState("")
  const [saving, setSaving] = useState(false)

  // positions des 5 émojis (pointe d’étoile)
  const starPositions = [
    { x: 0, y: -80 },
    { x: 75, y: -25 },
    { x: 45, y: 70 },
    { x: -45, y: 70 },
    { x: -75, y: -25 },
  ]

  const cx = 100, cy = 100 // centre de l’étoile (dans un SVG 200x200)
  const resonance = Math.min(1, Math.max(0, star.resonance_level ?? 0.5))
  const haloColor = resonance < 0.4 ? "#ffffff" : resonance < 0.8 ? "#ffd580" : "#ff9a3c"

  // 🪶 Ajout d’un fragment (texte court, sans émojis/son) avec auteur
  async function addFragment() {
    const text = input.trim()
    if (!text || text.length < 2 || text.length > 80) return
    setSaving(true)

    const { data: userData } = await supabase.auth.getUser()
    const username = userData?.user?.user_metadata?.username || "Anonyme"

    const { data, error } = await supabase.rpc("append_poetic_fragment", {
      star_id: star.id,
      new_text: text,
      author_name: username,
    })

    if (!error && data) {
      setChain(data)
      setInput("")
    } else {
      console.error("Erreur RPC :", error)
    }
    setSaving(false)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(15,25,25,0.95)",
          borderRadius: "16px",
          padding: "1.5rem 1rem",
          width: "340px",
          color: "#bff",
          textAlign: "center",
          boxShadow: "0 0 25px rgba(255,200,120,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Titre + Résonance */}
        <h3 style={{ margin: 0 }}>{star.title}</h3>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Résonance : {(resonance * 100).toFixed(0)}%
        </p>

        {/* Halo + Cercle central + 5 rayons */}
        <div
          style={{
            position: "relative",
            width: 200,
            height: 200,
            margin: "1rem auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* halo doux */}
          <div
            style={{
              position: "absolute",
              width: 170,
              height: 170,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${haloColor}55, transparent 70%)`,
              animation: "pulse 3s ease-in-out infinite",
              filter: "blur(6px)",
            }}
          />

          <svg width="200" height="200" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* cercle central */}
            <defs>
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={haloColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={haloColor} stopOpacity="0.1" />
              </radialGradient>
            </defs>

            {/* disque central */}
            <circle
              cx={cx}
              cy={cy}
              r={22}
              fill="url(#coreGlow)"
              stroke={haloColor}
              strokeWidth="1.4"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,200,120,0.6))" }}
            />

            {/* cercle de guidage (léger) */}
            <circle
              cx={cx}
              cy={cy}
              r={86}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeDasharray="3 6"
              strokeWidth="1"
            />

            {/* 5 rayons centre -> pointes (sans croisement) */}
            {starPositions.map((p, i) => (
              <line
                key={`ray-${i}`}
                x1={cx}
                y1={cy}
                x2={cx + p.x}
                y2={cy + p.y}
                stroke="rgba(255,200,120,0.7)"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* émojis aux extrémités */}
          {star.emojis?.map((e, i) => {
            const p = starPositions[i]
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: cy + p.y,
                  left: cx + p.x,
                  transform: "translate(-50%, -50%) scale(1.35)",
                  fontSize: "1.8rem",
                  textShadow: "0 0 10px rgba(255,200,120,0.9)",
                }}
              >
                {e}
              </div>
            )
          })}
        </div>

        {/* 🪶 Cadavre exquis */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
            padding: "0.5rem",
            marginTop: "0.5rem",
            textAlign: "left",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          {chain.length === 0 && (
            <p style={{ opacity: 0.6, textAlign: "center", fontSize: "0.85rem" }}>
              Aucun fragment encore... écris le premier.
            </p>
          )}
          {chain.map((l, i) => (
            <p
              key={i}
              style={{
                margin: "0.3rem 0",
                fontSize: "0.9rem",
                color: "#ffd",
                textAlign: "center",
                opacity: 0.9,
              }}
            >
              “{l.text}”
              <br />
              <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                — {l.author || "Anonyme"}
              </span>
            </p>
          ))}
        </div>

        {/* Champ de saisie */}
        <input
          type="text"
          placeholder="Écris un fragment court…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={80}
          style={{
            width: "100%",
            background: "#111",
            color: "#bff",
            border: "1px solid rgba(127,255,212,0.3)",
            borderRadius: "6px",
            padding: "0.4rem",
            marginTop: "0.6rem",
            textAlign: "center",
          }}
        />

        {/* Bouton ajout */}
        <button
          onClick={addFragment}
          disabled={saving || !input.trim()}
          style={{
            marginTop: "0.5rem",
            background: "linear-gradient(145deg,#6eff8d,#35a0ff)",
            border: "none",
            borderRadius: "10px",
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#111",
            width: "100%",
          }}
        >
          {saving ? "✨ Tissage..." : "🪶 Ajouter un fragment"}
        </button>

        {/* Fermer */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          style={{
            marginTop: "0.8rem",
            background: "linear-gradient(145deg,#ffd27f,#ff9035)",
            border: "none",
            borderRadius: "10px",
            padding: "0.6rem 1.3rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#111",
          }}
        >
          ✨ Fermer
        </button>

        <style>
          {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.16); opacity: 1; }
          }
          `}
        </style>
      </div>
    </div>
  )
}