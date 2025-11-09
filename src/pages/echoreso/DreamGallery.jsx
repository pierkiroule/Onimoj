import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"

export default function DreamGallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGallery()
  }, [])

  async function loadGallery() {
    try {
      const { data, error } = await supabase
        .from("onimoji")
        .select("id, emoji, titre, texte, image_url, culture, created_at")
        .eq("culture", "Collective")
        .order("created_at", { ascending: false })
        .limit(20)
      if (error) throw error
      setGallery(data || [])
    } catch (err) {
      console.error("⚠️ Erreur chargement galerie :", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Chargement de la galerie…</p>
  if (!gallery.length) return <p style={{ opacity: 0.7 }}>Aucun gardien collectif encore.</p>

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "#7fffd4" }}>🌠 Galerie des Onimojis collectifs</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {gallery.map((g) => (
          <div
            key={g.id}
            style={{
              background: "rgba(0,25,35,0.5)",
              border: "1px solid rgba(127,255,212,0.3)",
              borderRadius: "10px",
              padding: ".6rem",
              transition: "transform 0.2s",
            }}
            onClick={() => alert(`✨ ${g.titre}\n\n${g.texte}`)}
          >
            {g.image_url && (
              <img
                src={g.image_url}
                alt={g.titre}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: ".3rem",
                  boxShadow: "0 0 12px rgba(127,255,212,0.25)",
                }}
              />
            )}
            <h4 style={{ margin: 0, color: "#e9fffd" }}>
              {g.emoji} {g.titre}
            </h4>
            <p style={{ fontSize: ".8rem", opacity: 0.7, marginTop: ".2rem" }}>
              {g.culture} • {new Date(g.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}