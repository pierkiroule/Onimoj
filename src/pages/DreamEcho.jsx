// src/pages/DreamEcho.jsx
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import "./DreamEcho.css"

// === 🌟 Mini composant : Étoile visuelle ===
function StarSVG({ emoji = "✨", words = [] }) {
  const c = 80, R = 60, r = 28
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = (-90 + i * 36) * (Math.PI / 180)
    const rad = i % 2 === 0 ? R : r
    pts.push([c + rad * Math.cos(a), c + rad * Math.sin(a)])
  }
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z"

  return (
    <svg viewBox="0 0 160 160" width="140" height="140" className="mini-star">
      <defs>
        <radialGradient id="grad-mini" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(127,255,212,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>
      <path
        d={d}
        fill="url(#grad-mini)"
        stroke="#7fffd4"
        strokeWidth="1.2"
        filter="drop-shadow(0 0 6px rgba(127,255,212,.3))"
      />
      <text x="80" y="88" textAnchor="middle" fontSize="28" dominantBaseline="middle">
        {emoji}
      </text>
      {words.slice(0, 5).map((w, i) => {
        const angle = (-90 + i * 72) * (Math.PI / 180)
        const x = 80 + Math.cos(angle) * 70
        const y = 80 + Math.sin(angle) * 70
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="10"
            fill="#e9fffd"
            style={{ textShadow: "0 0 4px rgba(0,0,0,0.6)" }}
          >
            {w}
          </text>
        )
      })}
    </svg>
  )
}

// === 🌌 PAGE PRINCIPALE ===
export default function DreamEcho({ userId }) {
  const [tab, setTab] = useState("mine")
  const [stars, setStars] = useState([])
  const [selected, setSelected] = useState(null)
  const [contribs, setContribs] = useState([])
  const [newText, setNewText] = useState("")
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  useEffect(() => {
    console.log("🔑 userId détecté :", userId)
    if (userId) loadStars()
    else {
      setLoading(false)
      setStatus("⚠️ Connecte-toi pour voir tes Onimojis.")
    }
  }, [tab, userId])

  // === Charger les étoiles ===
  async function loadStars() {
    setLoading(true)
    try {
      let query = supabase.from("revotheque_reves").select("*").order("date", { ascending: false })
      if (tab === "mine") query = query.eq("user_id", userId)

      const { data, error } = await query
      if (error) throw error

      console.log("📦 Données reçues :", data)
      setStars(data || [])
      setStatus(
        `🌟 ${data?.length || 0} Onimoji${data?.length > 1 ? "s" : ""} trouvée${data?.length > 1 ? "s" : ""}`
      )
    } catch (err) {
      console.error("⚠️ Erreur chargement Onimojis :", err)
      setStatus(`⚠️ Impossible de charger les Onimojis (${err.message || err.details || "erreur inconnue"})`)
    } finally {
      setLoading(false)
    }
  }

  // === Ouvrir une étoile ===
  async function openStar(star) {
    setSelected(star)
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("dream_contributions")
        .select("*")
        .eq("dream_star_id", star.id)
        .order("created_at", { ascending: true })
      if (error) throw error
      setContribs(data || [])
    } catch (err) {
      console.error("⚠️ Erreur chargement contributions :", err)
      setContribs([])
    } finally {
      setLoading(false)
    }
  }

  // === Ajouter une contribution ===
  async function addContribution() {
    if (!newText.trim()) return
    const { error } = await supabase.from("dream_contributions").insert({
      dream_star_id: selected.id,
      contributor_id: userId,
      text_fragment: newText,
    })
    if (!error) {
      setContribs([...contribs, { text_fragment: newText, author_name: "toi" }])
      setNewText("")
    }
  }

  if (loading) return <p className="echo-status">⏳ {status}</p>

  // === 🌀 Liste des Onimojis ===
  if (!selected)
    return (
      <div className="echo-page">
        <header className="echo-header">
          <h2>🌌 DreamEcho•°</h2>
          <div className="tabs">
            <button className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}>
              🌙 Mes Onimojis créés
            </button>
            <button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>
              💞 Tous les Onimojis
            </button>
          </div>
        </header>

        <p className="status">{status}</p>

        <div className="star-list">
          {stars.map((s) => (
            <div key={s.id} className="star-item" onClick={() => openStar(s)}>
              <h3>
                {s.emoji} {s.titre || s.spirit || "Onimoji sans nom"}
              </h3>
              <p className="meta">
                {s.culture} • étape {s.step_number} • {new Date(s.date).toLocaleDateString()}
              </p>
              <p className="preview">{(s.texte || "").slice(0, 100)}…</p>
            </div>
          ))}
        </div>
      </div>
    )

  // === 🌠 Détail d’un Onimoji ===
  return (
    <div className="echo-detail">
      <button className="back-btn" onClick={() => setSelected(null)}>← Retour</button>

      <div className="star-header">
        <StarSVG emoji={selected.emoji} words={(selected.tags || []).slice(0, 5)} />
        <h2>{selected.emoji} {selected.titre || selected.spirit}</h2>
        <p>{selected.culture} • étape {selected.step_number}</p>
      </div>

      <div className="contrib-list fade-in">
        {contribs.length === 0 && <p>Aucune contribution encore.</p>}
        {contribs.map((c, i) => (
          <div key={i} className="contrib">
            <p>{c.text_fragment}</p>
            <span className="author">— {c.author_name || "anonyme"}</span>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Ajoute ton écho ou ton souvenir..."
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        rows={3}
      />
      <button onClick={addContribution}>✨ Ajouter</button>
    </div>
  )
}