// src/pages/DreamEcho.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

// === 🌟 Sous-composant : Mini étoile à 5 branches ===
function MiniStar({ emoji = "✨", tags = [] }) {
  const c = 80, R = 55, r = 25
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (-90 + i * 36) * (Math.PI / 180)
    const rad = i % 2 === 0 ? R : r
    pts.push([c + rad * Math.cos(a), c + rad * Math.sin(a)])
  }
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

  return (
    <svg viewBox="0 0 160 160" width="120" height="120" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="grad-star" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(127,255,212,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>
      <path
        d={d}
        fill="url(#grad-star)"
        stroke="#7fffd4"
        strokeWidth="1.2"
        style={{ filter: "drop-shadow(0 0 6px rgba(127,255,212,0.4))" }}
      />
      <text x="80" y="88" textAnchor="middle" fontSize="28" dominantBaseline="middle">
        {emoji}
      </text>
      {tags.slice(0, 5).map((t, i) => {
        const a = (-90 + i * 72) * (Math.PI / 180)
        const x = 80 + Math.cos(a) * 65
        const y = 80 + Math.sin(a) * 65
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="10"
            fill="#e9fffd"
            style={{ textShadow: "0 0 4px rgba(0,0,0,0.7)" }}
          >
            {t}
          </text>
        )
      })}
    </svg>
  )
}

// === 🌌 Page principale DreamEcho ===
export default function DreamEcho({ userId }) {
  const [stars, setStars] = useState([])
  const [selected, setSelected] = useState(null)
  const [contribs, setContribs] = useState([])
  const [newText, setNewText] = useState("")
  const [editing, setEditing] = useState(null)
  const [status, setStatus] = useState("")

  // === Charger la liste personnelle ===
  useEffect(() => {
    if (userId) loadStars()
  }, [userId])

  async function loadStars() {
    const { data, error } = await supabase
      .from("revotheque_reves")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
    if (error) return console.error(error)
    setStars(data || [])
  }

  // === Charger les contributions ===
  async function openStar(star) {
    setSelected(star)
    const { data, error } = await supabase
      .from("dream_contributions")
      .select("*")
      .eq("dream_star_id", star.id)
      .order("created_at", { ascending: true })
    if (!error) setContribs(data || [])
  }

  // === Ajouter ou modifier une contribution ===
  async function saveContribution() {
    if (!newText.trim()) return
    if (editing) {
      await supabase
        .from("dream_contributions")
        .update({ text_fragment: newText })
        .eq("id", editing)
      setEditing(null)
    } else {
      await supabase.from("dream_contributions").insert({
        dream_star_id: selected.id,
        contributor_id: userId,
        text_fragment: newText,
      })
    }
    setNewText("")
    openStar(selected)
  }

  // === Supprimer contribution ===
  async function deleteContribution(id) {
    if (!confirm("Supprimer cette contribution ?")) return
    await supabase.from("dream_contributions").delete().eq("id", id)
    openStar(selected)
  }

  // === Métamorphose finale ===
  async function metamorphose() {
    if (!confirm("✨ Offrir ce rêve au ciel collectif ? (irréversible)")) return
    const fullText = [selected.texte, ...contribs.map(c => c.text_fragment)].join(" ")
    setStatus("🌀 Génération poétique en cours...")
    try {
      // Appels fictifs IA (à relier plus tard)
      const aiText = `Texte poétique généré à partir de ${selected.spirit} et des tags ${selected.tags.join(", ")}`
      const aiImage = "https://placehold.co/600x400/0a0a0a/7fffd4?text=Etoile+Eternelle"

      await supabase.from("dream_scripts_shared").insert({
        user_a: userId,
        title: selected.titre,
        text_generated: aiText,
        image_url: aiImage,
        culture: selected.culture,
        tags: selected.tags,
        emoji: selected.emoji,
        resonance_score: 1,
      })

      await supabase.from("revotheque_reves").delete().eq("id", selected.id)
      setSelected(null)
      loadStars()
      setStatus("🌌 Ton rêve est devenu Étoile Éternelle !")
    } catch (err) {
      console.error(err)
      setStatus("⚠️ Erreur lors de la métamorphose.")
    }
  }

  // === Style global inline ===
  const pageStyle = {
    color: "#e9fffd",
    padding: "1rem",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  }

  const cardStyle = {
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(127,255,212,0.2)",
    borderRadius: "14px",
    padding: "1rem",
    margin: "1rem auto",
    maxWidth: "420px",
    boxShadow: "0 0 12px rgba(127,255,212,0.15)",
  }

  const btnStyle = {
    background: "linear-gradient(135deg,#7fffd4,#b9fff2)",
    border: "none",
    borderRadius: "10px",
    padding: "0.6rem 1.2rem",
    margin: "0.3rem",
    cursor: "pointer",
    color: "#001a14",
    fontWeight: "600",
  }

  const textareaStyle = {
    width: "100%",
    borderRadius: "8px",
    padding: ".6rem",
    border: "1px solid rgba(127,255,212,0.4)",
    background: "rgba(0,0,0,0.4)",
    color: "#e9fffd",
    marginTop: ".6rem",
  }

  // === Liste principale ===
  if (!selected)
    return (
      <div style={pageStyle}>
        <h2>🌙 Rêvothèque personnelle</h2>
        <p>Explore, ajuste et transmue tes Onimojis avant leur offrande.</p>
        {stars.map((s) => (
          <div key={s.id} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
              <MiniStar emoji={s.emoji} tags={s.tags || []} />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ margin: "0", color: "#7fffd4" }}>{s.titre}</h3>
                <p style={{ opacity: 0.8, margin: 0 }}>
                  {s.culture} • {s.spirit} • étape {s.step_number}
                </p>
                <small>{new Date(s.date).toLocaleString()}</small>
              </div>
            </div>
            <button style={btnStyle} onClick={() => openStar(s)}>
              🌕 Ouvrir
            </button>
          </div>
        ))}
        <p style={{ opacity: 0.7, marginTop: "1rem" }}>{status}</p>
      </div>
    )

  // === Détail Onimoji ===
  return (
    <div style={pageStyle}>
      <button
        onClick={() => setSelected(null)}
        style={{ ...btnStyle, background: "rgba(127,255,212,0.15)", color: "#7fffd4" }}
      >
        ← Retour
      </button>

      <div style={{ margin: "1rem auto", maxWidth: "480px" }}>
        <MiniStar emoji={selected.emoji} tags={selected.tags || []} />
        <h2 style={{ marginTop: "0.5rem" }}>{selected.titre}</h2>
        <p style={{ opacity: 0.8 }}>
          {selected.spirit} • étape {selected.step_number} • {selected.culture}
        </p>
      </div>

      <div style={cardStyle}>
        <h3>💬 Contributions</h3>
        {contribs.length === 0 && <p>Aucune contribution encore.</p>}
        {contribs.map((c) => (
          <div
            key={c.id}
            style={{
              background: "rgba(255,255,255,0.05)",
              margin: ".4rem 0",
              padding: ".5rem",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <p style={{ margin: 0 }}>{c.text_fragment}</p>
            <div style={{ textAlign: "right", marginTop: ".2rem" }}>
              <button
                onClick={() => {
                  setEditing(c.id)
                  setNewText(c.text_fragment)
                }}
                style={{ ...btnStyle, padding: ".2rem .6rem", fontSize: ".8rem" }}
              >
                ✏️
              </button>
              <button
                onClick={() => deleteContribution(c.id)}
                style={{
                  ...btnStyle,
                  padding: ".2rem .6rem",
                  fontSize: ".8rem",
                  background: "rgba(255,100,100,0.3)",
                  color: "#fff",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <textarea
          style={textareaStyle}
          rows={3}
          placeholder="Ajoute ou modifie un fragment onirique..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button style={btnStyle} onClick={saveContribution}>
          {editing ? "💾 Enregistrer la modification" : "➕ Ajouter une contribution"}
        </button>
      </div>

      <button style={{ ...btnStyle, marginTop: "1rem" }} onClick={metamorphose}>
        🌌 Offrir au ciel collectif
      </button>

      <p style={{ opacity: 0.8, marginTop: "0.6rem" }}>{status}</p>
    </div>
  )
}