import { useState } from "react"
import { supabase } from "../supabaseClient"

const BUCKET = "media" // crée ou garde ton bucket public Supabase Storage

export default function UploaderOnirique({ user }) {
  const [titre, setTitre] = useState("")
  const [texte, setTexte] = useState("")
  const [tags, setTags] = useState("")
  const [visible, setVisible] = useState(true)
  const [files, setFiles] = useState([])
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState("")
  const [createNotif, setCreateNotif] = useState(true)
  const [datePlanif, setDatePlanif] = useState("")

  function handleFiles(e) {
    setFiles(Array.from(e.target.files || []))
  }

  async function uploadAll() {
    const urls = []
    for (const f of files) {
      const path = `${user?.id || "anon"}/${Date.now()}-${f.name}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, f, { upsert: false })
      if (error) throw error
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)
      urls.push({ name: f.name, url: pub.publicUrl, type: f.type })
    }
    return urls
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg("")
    if (!user) return setMsg("⚠️ Connecte-toi.")
    if (!titre.trim()) return setMsg("⚠️ Titre requis.")

    setSending(true)
    try {
      const uploaded = files.length ? await uploadAll() : []
      const mainUrl = uploaded[0]?.url || null

      // Enregistre l’ÉchoRessource
      const { data, error } = await supabase.from("echoressources").insert([{
        titre,
        description: texte,
        url: mainUrl,
        visible,
        user_read: false,
        user_id: user.id,
        tags,
        planned_at: datePlanif || null
      }]).select("id").single()
      if (error) throw error

      // Crée la notification associée
      if (createNotif && data?.id) {
        await supabase.from("echonotifs").insert([{
          user_id: user.id,
          echo_id: data.id,
          read: false,
          planned_at: datePlanif || null
        }])
      }

      setMsg("✅ Rêve planifié" + (createNotif ? " + notif enregistrée." : "."))
      setTitre(""); setTexte(""); setTags(""); setFiles([]); setDatePlanif("")
    } catch (err) {
      console.error(err)
      setMsg("❌ " + (err.message || "Échec upload/enregistrement"))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <h3 style={{ color:"#7fffd4", marginBottom:8 }}>🌌 Uploader un rêve multimédia</h3>
      <p style={{ opacity:.8, marginTop:0 }}>
        Prépare un rêve (texte, image, son, vidéo) et choisis quand il émergera dans la nuit collective.
      </p>

      <form onSubmit={handleSubmit} style={form}>
        <input
          type="text"
          placeholder="Titre du rêve"
          value={titre}
          onChange={e=>setTitre(e.target.value)}
          required
          style={inp}
        />
        <textarea
          placeholder="Texte poétique ou description"
          value={texte}
          onChange={e=>setTexte(e.target.value)}
          rows={4}
          style={{ ...inp, resize:"vertical" }}
        />
        <input
          type="text"
          placeholder="Tags (séparés par des virgules)"
          value={tags}
          onChange={e=>setTags(e.target.value)}
          style={inp}
        />

        {/* 🌙 Planification */}
        <div style={{ textAlign:"left", margin:"8px 0" }}>
          <label>
            🕓 Date et heure d’émergence :  
            <input
              type="datetime-local"
              value={datePlanif}
              onChange={e=>setDatePlanif(e.target.value)}
              style={{ ...inp, marginTop:6 }}
            />
          </label>
        </div>

        {/* 🌊 Fichiers */}
        <div style={drop}>
          <input
            type="file"
            multiple
            accept="audio/*,video/*,image/*,.mp3,.mp4,.wav,.png,.jpg,.jpeg"
            onChange={handleFiles}
            style={{ width:"100%" }}
          />
          {files.length > 0 && (
            <p style={{ opacity:.8, margin:"6px 0 0 0" }}>{files.length} fichier(s) sélectionné(s)</p>
          )}
        </div>

        <div style={{ textAlign:"left", margin:"6px 0 10px" }}>
          <label>
            <input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)} />
            <span style={{ marginLeft:8 }}>Visible pour les explorateurs</span>
          </label>
          <br />
          <label>
            <input type="checkbox" checked={createNotif} onChange={e=>setCreateNotif(e.target.checked)} />
            <span style={{ marginLeft:8 }}>Créer une notification onirique</span>
          </label>
        </div>

        <button type="submit" disabled={sending} style={btn}>
          {sending ? "⏳ Envoi..." : "✨ Planifier le rêve"}
        </button>
      </form>

      {msg && (
        <p style={{ marginTop:8, color: msg.startsWith("✅") ? "#7fffd4" : "#ff8e8e", fontWeight:600 }}>
          {msg}
        </p>
      )}
    </div>
  )
}

/* 🎨 Styles */
const form = { background:"rgba(0,0,0,0.35)", border:"1px solid #7fffd420", borderRadius:10, padding:"10px" }
const inp  = { width:"100%", marginBottom:"8px", padding:"8px", borderRadius:6, border:"1px solid #7fffd440", background:"rgba(0,0,0,0.25)", color:"#fff" }
const drop = { background:"rgba(255,255,255,0.04)", border:"1px dashed #7fffd455", borderRadius:8, padding:"10px", margin:"6px 0" }
const btn  = { marginTop:"6px", background:"linear-gradient(90deg,#6a5acd,#7fffd4)", border:"none", borderRadius:8, padding:"0.55rem 1.1rem", color:"#111", fontWeight:800, cursor:"pointer" }