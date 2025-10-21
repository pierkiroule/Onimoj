import { useState, useEffect, useRef } from "react"
import { supabase } from "../supabaseClient"
import { askNebius } from "../nebiusClient"

export default function EchoStarModal({ star, onClose }) {
  const [chain, setChain] = useState(star.poetic_chain || [])
  const [input, setInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [iaFragment, setIaFragment] = useState(
    star.poetic_chain?.some(f => f.author === "Souffleur") ? true : null
  )

  const canvasRef = useRef()

  // 🌌 animation "bulle Onimoji"
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const emojis = star.emojis.slice(0, 3)
    const cx = 120, cy = 120
    const baseR = 80
    const innerR = 35
    const start = Date.now()
    const haloColor =
      star.resonance_level < 0.4
        ? "#88fff0"
        : star.resonance_level < 0.8
        ? "#ffd580"
        : "#ff9a3c"

    function draw() {
      const t = (Date.now() - start) / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 🌌 bulle mère
      const pulse = 1 + 0.05 * Math.sin(t * 2)
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, baseR * pulse)
      grad.addColorStop(0, `${haloColor}22`)
      grad.addColorStop(1, "rgba(20,40,50,0.35)")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * pulse, 0, Math.PI * 2)
      ctx.fill()

      // 🌬 halo IA s’il existe
      if (iaFragment) {
        ctx.beginPath()
        ctx.arc(cx, cy, baseR * pulse * 1.2, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(180,255,255,0.35)"
        ctx.lineWidth = 3
        ctx.shadowColor = "rgba(180,255,255,0.5)"
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // 🫧 trois bulles émojis
      for (let i = 0; i < emojis.length; i++) {
        const angle = (i * (2 * Math.PI)) / 3 + t * 0.5
        const r = innerR + 10 * Math.sin(t * 1.2 + i)
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r

        const grad2 = ctx.createRadialGradient(x, y, 5, x, y, 22)
        grad2.addColorStop(0, "rgba(200,255,240,0.35)")
        grad2.addColorStop(1, "rgba(0,30,40,0.3)")
        ctx.fillStyle = grad2
        ctx.beginPath()
        ctx.arc(x, y, 22, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = "24px serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(emojis[i], x, y)
      }
      requestAnimationFrame(draw)
    }

    draw()
  }, [star, iaFragment])

  // 🌿 ajout d’un fragment utilisateur + souffle IA (inchangé)
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
    if (error) {
      console.error("Erreur RPC :", error)
      setSaving(false)
      return
    }
    setChain(data)
    setInput("")

    // 🌬 souffle IA si pas encore généré
    const hasSouffleur = data.some(f => f.author === "Souffleur")
    if (!hasSouffleur) {
      const prompt = `
      Inspire-toi de ces trois emojis : ${star.emojis.join(" ")}.
      Thème : ${star.title}.
      Écris une phrase brève (≤25 mots), poétique, onirique et apaisante.
      Évoque la glace, la mer et le souffle.
      N’utilise pas les mots "rêve", "IA", ni "humain".
      `
      try {
        const souffle = await askNebius(prompt, { temperature: 0.85 })
        if (souffle) {
          setIaFragment(souffle)
          const newChain = [...data, { text: souffle, author: "Souffleur" }]
          setChain(newChain)
          await supabase.rpc("append_poetic_fragment", {
            star_id: star.id,
            new_text: souffle,
            author_name: "Souffleur",
          })
        }
      } catch (e) {
        console.warn("Souffleur silencieux :", e)
      }
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
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(15,25,25,0.95)",
          borderRadius: "16px",
          padding: "1.5rem 1rem",
          width: "340px",
          color: "#bff",
          textAlign: "center",
          boxShadow: "0 0 25px rgba(255,200,120,0.35)",
        }}
      >
        <h3>{star.title}</h3>
        <p style={{ opacity: 0.8 }}>Résonance : {(star.resonance_level * 100).toFixed(0)}%</p>

        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          style={{
            background: "radial-gradient(circle,#000810,#000)",
            borderRadius: "50%",
            boxShadow: "0 0 30px rgba(110,255,180,0.4)",
            margin: "1rem auto",
          }}
        />

        {/* Fragments */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
            padding: "0.5rem",
            marginTop: "0.5rem",
            maxHeight: "120px",
            overflowY: "auto",
          }}
        >
          {chain.length === 0 ? (
            <p style={{ opacity: 0.6, textAlign: "center", fontSize: "0.85rem" }}>
              Aucun fragment encore... écris le premier.
            </p>
          ) : (
            chain.map((l, i) => (
              <p key={i} style={{ color: l.author === "Souffleur" ? "#aef" : "#ffd" }}>
                “{l.text}” <br />
                <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>— {l.author || "Anonyme"}</span>
              </p>
            ))
          )}
        </div>

        {/* Champ + boutons */}
        <input
          type="text"
          placeholder="Écris un fragment court…"
          value={input}
          onChange={e => setInput(e.target.value)}
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

        <button
          onClick={e => {
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
      </div>
    </div>
  )
}