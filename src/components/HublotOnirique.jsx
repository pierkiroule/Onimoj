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
  const isPointerDownRef = useRef(false)
  const dragVisitedIndicesRef = useRef(new Set())

  const CANVAS_SIZE = 280
  const BASE_RADIUS = 16 // rayon visuel de la bulle

  const getRadius = (emoji) => (selected.includes(emoji) ? BASE_RADIUS * 1.15 : BASE_RADIUS)

  // Crée des positions initiales sans chevauchement
  function generateInitialPositions(count) {
    const maxRadius = BASE_RADIUS * 1.2
    const safeRadius = CANVAS_SIZE / 2 - maxRadius - 4
    const list = []

    for (let i = 0; i < count; i++) {
      let attempts = 0
      let placed = false
      while (!placed && attempts < 200) {
        attempts++
        const a = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random()) * safeRadius
        const x = CANVAS_SIZE / 2 + Math.cos(a) * r
        const y = CANVAS_SIZE / 2 + Math.sin(a) * r
        const candidate = { x, y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 }
        const overlaps = list.some((p) => {
          const dx = p.x - candidate.x
          const dy = p.y - candidate.y
          const dist = Math.hypot(dx, dy)
          return dist < maxRadius * 2 + 2
        })
        if (!overlaps) {
          list.push(candidate)
          placed = true
        }
      }
      if (!placed) {
        // en dernier recours, place sans test
        list.push({
          x: Math.random() * (CANVAS_SIZE - 40) + 20,
          y: Math.random() * (CANVAS_SIZE - 40) + 20,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
        })
      }
    }
    return list
  }

  // 🎲 pool initial
  useEffect(() => {
    const base = [
      "🌞","🌜","⭐","🔥","💧","🌿","🪶","❄️","🌈","🌬️",
      "🌊","🕯️","🌻","🪵","🪐","💎","🐋","🪞","⚡","🌙",
      "🍃","🌹","☁️","🦋","🪸","🕊️","🌾","🦭","🧊","🌑"
    ]
    const list = base.sort(() => 0.5 - Math.random()).slice(0, 15)
    setPool(list)
    positions.current = generateInitialPositions(list.length)
  }, [])

  // Gestion sélection (tap/drag) avec Pointer Events
  const toggleEmoji = (emoji) => {
    if (selected.includes(emoji))
      setSelected(selected.filter(e => e !== emoji))
    else if (selected.length < 3)
      setSelected([...selected, emoji])
  }

  function selectAtCanvasPoint(clientX, clientY, { dragOnlyAdd = false } = {}) {
    const canvas = document.getElementById("emojiSky")
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    // trouver l'index le plus proche dans le rayon
    let hitIndex = -1
    for (let i = 0; i < positions.current.length; i++) {
      const p = positions.current[i]
      const r = getRadius(pool[i])
      if (Math.hypot(p.x - x, p.y - y) <= r + 4) {
        hitIndex = i
        break
      }
    }
    if (hitIndex === -1) return
    const emoji = pool[hitIndex]
    if (dragOnlyAdd) {
      if (!selected.includes(emoji) && selected.length < 3 && !dragVisitedIndicesRef.current.has(hitIndex)) {
        dragVisitedIndicesRef.current.add(hitIndex)
        setSelected((prev) => prev.concat(emoji))
      }
    } else {
      toggleEmoji(emoji)
    }
  }

  const handlePointerDown = (e) => {
    isPointerDownRef.current = true
    dragVisitedIndicesRef.current.clear()
    selectAtCanvasPoint(e.clientX, e.clientY, { dragOnlyAdd: false })
  }

  const handlePointerMove = (e) => {
    if (!isPointerDownRef.current) return
    selectAtCanvasPoint(e.clientX, e.clientY, { dragOnlyAdd: true })
  }

  const handlePointerUp = () => {
    isPointerDownRef.current = false
    dragVisitedIndicesRef.current.clear()
  }

  // 🌟 Création
  async function createStar() {
    if (!title.trim()) return setStatus("💭 Donne un nom à ton Onimoji.")
    if (selected.length !== 3) return setStatus("🪐 Choisis 3 émojis.")
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

  // 🌀 animation de flottement + collisions et rebonds
  useEffect(() => {
    const canvas = document.getElementById("emojiSky")
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      // mise à jour mouvement + rebond sur le bord circulaire
      for (let i = 0; i < positions.current.length; i++) {
        const p = positions.current[i]
        p.x += p.vx
        p.y += p.vy

        const dx = p.x - CANVAS_SIZE / 2
        const dy = p.y - CANVAS_SIZE / 2
        const r = getRadius(pool[i])
        const dist = Math.hypot(dx, dy)
        const limit = CANVAS_SIZE / 2 - r
        if (dist > limit) {
          // repositionne sur le cercle limite
          const angle = Math.atan2(dy, dx)
          p.x = CANVAS_SIZE / 2 + Math.cos(angle) * limit
          p.y = CANVAS_SIZE / 2 + Math.sin(angle) * limit
          // vitesse réfléchie le long de la normale
          const nx = dx / (dist || 1)
          const ny = dy / (dist || 1)
          const vn = p.vx * nx + p.vy * ny
          p.vx -= 2 * vn * nx
          p.vy -= 2 * vn * ny
          // léger amortissement
          p.vx *= 0.9
          p.vy *= 0.9
        }
      }

      // collisions simples entre bulles
      for (let i = 0; i < positions.current.length; i++) {
        for (let j = i + 1; j < positions.current.length; j++) {
          const a = positions.current[i]
          const b = positions.current[j]
          const ra = getRadius(pool[i])
          const rb = getRadius(pool[j])
          const dx = b.x - a.x
          const dy = b.y - a.y
          let d = Math.hypot(dx, dy)
          const minDist = ra + rb
          if (d === 0) d = 0.0001
          if (d < minDist) {
            const nx = dx / d
            const ny = dy / d
            const overlap = minDist - d
            // sépare moitié-moitié
            a.x -= nx * (overlap / 2)
            a.y -= ny * (overlap / 2)
            b.x += nx * (overlap / 2)
            b.y += ny * (overlap / 2)
            // impulse élastique simplifiée si les bulles se rapprochent
            const rvx = b.vx - a.vx
            const rvy = b.vy - a.vy
            const relVel = rvx * nx + rvy * ny
            if (relVel < 0) {
              const impulse = -(1.0) * relVel * 0.5
              const ix = impulse * nx
              const iy = impulse * ny
              a.vx -= ix
              a.vy -= iy
              b.vx += ix
              b.vy += iy
            }
          }
        }
      }

      // dessin des bulles + emojis
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      for (let i = 0; i < positions.current.length; i++) {
        const p = positions.current[i]
        const emoji = pool[i]
        const r = getRadius(emoji)
        const isSel = selected.includes(emoji)

        // bulle
        const grad = ctx.createRadialGradient(
          p.x - r * 0.4, p.y - r * 0.5, r * 0.2,
          p.x, p.y, r
        )
        grad.addColorStop(0, isSel ? "rgba(110,255,180,0.35)" : "rgba(180,240,255,0.25)")
        grad.addColorStop(1, "rgba(30,60,70,0.25)")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = isSel ? "rgba(110,255,180,0.7)" : "rgba(160,220,240,0.5)"
        ctx.lineWidth = isSel ? 2 : 1
        ctx.stroke()

        // emoji
        ctx.font = isSel ? "24px serif" : "22px serif"
        ctx.globalAlpha = 1
        ctx.fillText(emoji, p.x, p.y)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [pool, selected])

  // 🧩 rendu
  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <h3 style={{ color: "#bff" }}>🌠 Tisse ton Onimoji</h3>
      <p style={{ opacity: 0.8 }}>Choisis 3 émojis flottants qui résonnent avec ton rêve...</p>

      <div
        style={{
          position: "relative",
          width: CANVAS_SIZE, height: CANVAS_SIZE, margin: "1rem auto",
          borderRadius: "50%",
          overflow: "hidden",
          background: "radial-gradient(circle, #081019, #010203 85%)",
          boxShadow: "0 0 30px rgba(110,255,180,0.4)",
        }}
      >
        <canvas
          id="emojiSky"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: "pointer", touchAction: "none" }}
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
        {[0, 1, 2].map((i) => (
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
            {selected[i] || "?"}
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