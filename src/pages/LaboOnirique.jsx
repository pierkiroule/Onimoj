import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import DashboardInspirant from "../components/DashboardInspirant"
import UploaderOnirique from "../components/UploaderOnirique"

export default function LaboOnirique({ onNavigate, session: initialSession }) {
  const [session, setSession] = useState(initialSession)
  const user = session?.user
  const [msg, setMsg] = useState("")

  // 🔐 Restaure session
  useEffect(() => {
    async function restore() {
      const { data } = await supabase.auth.getSession()
      if (data?.session) setSession(data.session)
    }
    restore()
    const { data: lis } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => lis?.subscription?.unsubscribe?.()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
    setMsg("🚪 Déconnecté.")
  }

  return (
    <div style={page}>
      <h2>🧪 Labo des Rêves — Gardiens Onimoji</h2>
      <p style={{ opacity: .8, marginTop: 4 }}>
        Imagine. Compose. Diffuse des <b>rêves multimédias</b> (texte, image, audio, vidéo).
      </p>

      <p style={{ opacity:.6, fontSize:".85rem", marginTop: 6 }}>
        {user ? `👤 ${user.email || user.id.slice(0,8)}` : "⚠️ Non authentifié"}
      </p>

      <div style={bar}>
        <button onClick={() => onNavigate("home")} style={btnGhost}>⬅️ Accueil</button>
        {user && <button onClick={handleLogout} style={btnOutline}>🚪 Déconnexion</button>}
      </div>

      {msg && <p style={{ color:"#7fffd4", fontWeight:600 }}>{msg}</p>}

      {/* 🔮 Module 1 : Dashboard d’inspiration */}
      <section style={card}>
        <DashboardInspirant />
      </section>

      {/* 🌌 Module 2 : Uploader & ÉchoRessource + notif */}
      <section style={card}>
        <UploaderOnirique user={user} />
      </section>
    </div>
  )
}

/* 🎨 mini styles */
const page = { color:"#fff", textAlign:"center", margin:"7vh auto 6vh", width:"min(980px, 92%)" }
const bar  = { marginTop:"10px", display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap" }
const card = { background:"rgba(255,255,255,0.05)", border:"1px solid #7fffd420", borderRadius:12, padding:"1rem", marginTop:"1rem", boxShadow:"0 0 14px rgba(127,255,212,0.14)" }
const btnGhost = { background:"transparent", border:"1px solid #7fffd4", color:"#7fffd4", borderRadius:8, padding:"0.45rem 0.9rem", cursor:"pointer" }
const btnOutline = { ...btnGhost, borderColor:"#ff8e8e", color:"#ff8e8e" }