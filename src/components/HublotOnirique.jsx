import { useState, useEffect, useRef } from "react"
import { supabase } from "../supabaseClient"

export default function HublotOnirique({ step, userId, onComplete }) {
  const [pool, setPool] = useState([])
  const [selected, setSelected] = useState([])
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)

  const animRef = useRef()
  const positions = useRef([])

  // 🎲 pool initial
  useEffect(() => {
    const base = [
      "🌞","🌜","⭐","🔥","💧","🌿","🪶","❄️","🌈","🌬️",
      "🌊","🕯️","🌻","🪵","🪐","💎","🐋","🪞","⚡","🌙",
      "🍃","🌹","☁️","🦋","🪸","🕊️","🌾","🦭","🧊","🌑"
    ]
    const list = base.sort(() => 0.5 - Math.random()).slice(0, 15)
    setPool(list)
    positions.current = list.map(() => ({
      x: Math.random() * 240 + 20,
      y: Math.random() * 240 + 20,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }))
  }, [])

  // 🌀 animation de flottement
  useEffect(() => {
    const canvas = document.getElementById("emojiSky")
    const ctx = canvas.getContext("2d")
    const size = 280

    function draw() {
      ctx.clearRect(0, 0, size, size)
      positions.current.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        // rebond sur bords circulaires
        const dx = p.x - size / 2
        const dy = p.y - size / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > size / 2 - 20) {
          const angle = Math.atan2(dy, dx)
          p.vx = -Math.cos(angle) * 0.5
          p.vy = -Math.sin(angle) * 0.5
        }
        ctx.font = selected.includes(pool[i]) ? "30px serif" : "26px serif"
        ctx.globalAlpha = selected.includes(pool[i]) ? 0.4 : 0.9
        ctx.fillText(pool[i], p.x, p.y)
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [pool, selected])

  // 🎯 Sélection stable
  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    positions.current.forEach((p, i) => {
      const dist = Math.hypot(p.x - x, p.y - y)
      if (dist < 20) toggleEmoji(pool[i])
    })
  }

  const toggleEmoji = (emoji) => {
    if (selected.includes(emoji))
      setSelected(selected.filter(e => e !== emoji))
    else if (selected.length < 5)
      setSelected([...selected, emoji])
  }

  // 🌟 Création
  async function createStar() {
    if (!title.trim()) return setStatus("💭 Donne un nom à ton Onimoji.")
    if (selected.length !== 5) return setStatus("🪐 Choisis 5 émojis.")
    setSaving(true)

    const newStar = {
      creator_id: userId,
      title,
      emojis: selected,
      culture: "Inuite",
      spirit: step?.spirit_name || "",
      step_number: step?.step_number || 1,
      completed: true,
    }

    const { data: inserted, error } = await supabase
      .from("dream_stars")
      .insert([newStar])
      .select()
      .single()

    if (error) {
      console.error(error)
      setStatus("❌ Erreur de tissage.")
      setSaving(false)
      return
    }

    await supabase.rpc("update_star_resonances_with_divergence")

    const { data: star } = await supabase
      .from("cosmic_field")
      .select("*")
      .eq("id", inserted.id)
      .single()

    setSaving(false)
    setStatus("🌟 Onimoji tissé avec succès !")
    onComplete(star)
  }

  // 🧩 rendu
  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h3 style={{ color: "#bff" }}>🌠 Tisse ton Onimoji</h3>
      <p style={{ opacity: 0.8 }}>Choisis 5 émojis flottants qui résonnent avec ton rêve...</p>

      <div
        style={{
          position: "relative",
          width: 280, height: 280, margin: "1rem auto",
          borderRadius: "50%",
          overflow: "hidden",
          background: "radial-gradient(circle, #081019, #010203 85%)",
          boxShadow: "0 0 30px rgba(110,255,180,0.4)",
        }}
      >
        <canvas
          id="emojiSky"
          width="280"
          height="280"
          onClick={handleCanvasClick}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* 🪞 affichage des 5 cases étoilées */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.6rem",
          margin: "0.8rem 0",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "45px", height: "45px",
              borderRadius: "50%",
              background: selected[i] ? "radial-gradient(circle, #6eff8d55, #1a1a1a 80%)" : "#0c0f0f",
              border: "1px solid rgba(127,255,212,0.4)",
              boxShadow: selected[i]
                ? "0 0 10px rgba(110,255,180,0.7)"
                : "0 0 5px rgba(127,255,212,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem",
            }}
          >
            {selected[i] || "⭐"}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Nom de ton Onimoji..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          background: "#111", color: "#bff",
          border: "1px solid rgba(127,255,212,0.3)",
          borderRadius: "6px", padding: "0.4rem 0.6rem", textAlign: "center",
        }}
      />

      <button
        onClick={createStar}
        disabled={saving}
        style={{
          marginTop: "0.8rem", background: "linear-gradient(145deg,#6eff8d,#35a0ff)",
          border: "none", borderRadius: "10px", padding: "0.7rem 1.3rem",
          fontWeight: "bold", cursor: "pointer", color: "#111",
        }}
      >
        {saving ? "✨ Tissage..." : "🌟 Valider l’Onimoji"}
      </button>
      <p style={{ opacity: 0.7 }}>{status}</p>
    </div>
  )
}