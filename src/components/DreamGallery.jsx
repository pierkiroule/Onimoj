// src/components/DreamGallery.jsx
import React, { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

/**
 * 🌌 DreamGallery – version debug
 * - Liste les fichiers du bucket dream-gallery
 * - Montre le nom et l’URL en console
 * - Affiche la grille même sans match
 */
export default function DreamGallery({ activeTags = [], onSelect }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  const bucket = "dream-gallery"

  useEffect(() => {
    async function loadImages() {
      console.log("📡 Tentative de connexion au bucket:", bucket)
      try {
        const { data, error } = await supabase.storage.from(bucket).list("", {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        })

        if (error) {
          console.error("❌ Erreur Supabase:", error.message)
          setErrorMsg(error.message)
          setLoading(false)
          return
        }

        if (!data?.length) {
          console.warn("⚠️ Aucun fichier trouvé dans le bucket.")
          setErrorMsg("Aucun fichier trouvé dans le bucket Supabase.")
          setImages([])
          setLoading(false)
          return
        }

        // Log complet pour vérification
        console.table(data.map((f) => f.name))

        // Génère les URLs publiques
        const urls = data.map((file) => ({
          name: file.name,
          url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
        }))

        setImages(urls)
      } catch (err) {
        console.error("💥 Exception :", err)
        setErrorMsg("Erreur inattendue : " + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  if (loading) return <p style={{ textAlign: "center" }}>Chargement de la galerie...</p>

  if (errorMsg)
    return (
      <div style={{ color: "#ff9999", textAlign: "center", marginTop: "1rem" }}>
        <p>⚠️ {errorMsg}</p>
        <p style={{ opacity: 0.6, fontSize: ".85rem" }}>
          Vérifie ton bucket “dream-gallery” et ses fichiers publics.
        </p>
      </div>
    )

  return (
    <div style={{ marginTop: "1.4rem" }}>
      <h4
        style={{
          color: "#7fffd4",
          marginBottom: ".4rem",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        🌄 Galerie des rêves collectifs ({images.length})
      </h4>

      {images.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          Aucun fichier trouvé dans le bucket Supabase.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.6rem",
          marginTop: ".4rem",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => onSelect && onSelect(img.url)}
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.3s ease, opacity 0.4s ease",
              border: "1px solid rgba(127,255,212,0.15)",
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(1)",
              }}
              onError={() => console.warn("⚠️ Image non accessible :", img.url)}
            />
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                textAlign: "center",
                background: "rgba(0,0,0,0.4)",
                color: "#bff",
                fontSize: ".75rem",
                padding: ".2rem 0",
              }}
            >
              {img.name}
            </div>
          </div>
        ))}
      </div>

      {/* Mode debug : liste brute */}
      <div
        style={{
          marginTop: "1rem",
          background: "rgba(127,255,212,0.05)",
          borderRadius: "8px",
          padding: "0.6rem",
          fontSize: ".8rem",
          color: "#aefcf5",
        }}
      >
        <strong>🧠 Debug Supabase :</strong>
        <ul style={{ marginTop: ".3rem", listStyle: "none", padding: 0 }}>
          {images.map((img, i) => (
            <li key={i}>
              {i + 1}. {img.name} →{" "}
              <a
                href={img.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#7fffd4" }}
              >
                lien
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}