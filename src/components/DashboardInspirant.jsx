import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { inspirations } from "../data/inspirations"

export default function DashboardInspirant() {
  const [recent, setRecent] = useState([])
  const [pick, setPick] = useState([])

  useEffect(() => {
    refreshInspiration()
    loadRecent()
  }, [])

  function refreshInspiration() {
    // 3 inspirations aléatoires
    const shuffled = [...inspirations].sort(() => 0.5 - Math.random())
    setPick(shuffled.slice(0, 3))
  }

  async function loadRecent() {
    const { data, error } = await supabase
      .from("echoressources")
      .select("id,titre,description,url,created_at")
      .order("created_at", { ascending: false })
      .limit(5)
    if (!error) setRecent(data || [])
  }

  return (
    <div>
      <h3 style={{ color:"#7fffd4", marginBottom:8 }}>🔮 Dashboard d’inspiration</h3>
      <p style={{ opacity:.8, marginTop:0 }}>Citations, images mentales, amorces poétiques.</p>

      {/* Inspirations locales */}
      <div style={grid}>
        {pick.map((it, i) => (
          <div key={i} style={tile}>
            <div style={{ fontSize:"1.4rem", marginBottom:6 }}>{it.emoji}</div>
            <h4 style={{ margin:"0 0 6px 0" }}>{it.title}</h4>
            <p style={{ opacity:.85, margin:0, whiteSpace:"pre-wrap" }}>{it.text}</p>
            {it.prompt && <p style={{ opacity:.6, fontSize:".85rem", marginTop:8 }}>🎧 Prompt: {it.prompt}</p>}
          </div>
        ))}
      </div>

      <button onClick={refreshInspiration} style={btn}>
        ♻️ Régénérer les inspirations
      </button>

      {/* Dernières ressources depuis la base */}
      <div style={{ marginTop:"1rem", textAlign:"left" }}>
        <h4 style={{ color:"#7fffd4" }}>🗂️ Dernières ÉchoRessources</h4>
        {recent.length === 0 ? (
          <p style={{ opacity:.7 }}>— aucune pour l’instant —</p>
        ) : (
          <ul style={{ listStyle:"none", padding:0, margin:0 }}>
            {recent.map(r => (
              <li key={r.id} style={{ borderBottom:"1px solid #2a2f33", padding:"6px 0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"baseline" }}>
                  <strong>{r.titre}</strong>
                  <span style={{ fontSize:".75rem", opacity:.6 }}>
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                {r.description && <p style={{ margin:"4px 0 0 0", opacity:.8 }}>{r.description}</p>}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ color:"#a7ffe7", fontSize:".9rem" }}>
                    Ouvrir le média ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const grid = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:"10px", marginTop:"10px" }
const tile = { background:"rgba(255,255,255,0.04)", border:"1px solid #7fffd420", borderRadius:10, padding:"10px" }
const btn = { marginTop:"10px", background:"linear-gradient(90deg,#6a5acd,#7fffd4)", border:"none", borderRadius:8, padding:"0.5rem 1rem", color:"#111", fontWeight:700, cursor:"pointer" }