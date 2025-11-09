// src/pages/echoreso/EchoReso.jsx
import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import FusionInvocation from "./FusionInvocation"

export default function EchoReso({ userId }) {
  const [gallery, setGallery] = useState([])
  const [selectedParents, setSelectedParents] = useState([])
  const [modalItem, setModalItem] = useState(null)
  const [pressTimer, setPressTimer] = useState(null)

  useEffect(() => {
    loadGallery()
  }, [])

  async function loadGallery() {
    try {
      const { data, error } = await supabase
        .from("onimoji")
        .select("id, titre, emoji, texte, tags, image_url, culture, spirit, created_at")
        .order("created_at", { ascending: false })
      if (error) throw error
      setGallery(data || [])
    } catch (err) {
      console.error("⚠️ Erreur chargement galerie :", err.message)
    }
  }

  function handlePressStart(id) {
    const timer = setTimeout(() => toggleSelect(id), 600)
    setPressTimer(timer)
  }

  function handlePressEnd(item) {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
      setModalItem(item)
    }
  }

  function toggleSelect(id) {
    setSelectedParents((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  return (
    <div style={{ color: "#e9fffd", textAlign: "center", padding: "1rem", maxWidth: 900, margin: "auto" }}>
      <h2 style={{ color: "#7fffd4" }}>🌌 ÉchoReso•°</h2>
      <p style={{ opacity: 0.85 }}>
        Tap <b>court</b> pour voir la carte • Tap <b>long</b> pour sélectionner deux gardiens à fusionner
      </p>

      {/* 🌠 Galerie visible */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {gallery.map((g) => {
          const isSelected = selectedParents.includes(g.id)
          return (
            <div
              key={g.id}
              onTouchStart={() => handlePressStart(g.id)}
              onTouchEnd={() => handlePressEnd(g)}
              onMouseDown={() => handlePressStart(g.id)}
              onMouseUp={() => handlePressEnd(g)}
              style={{
                background: isSelected ? "rgba(127,255,212,0.25)" : "rgba(0,25,35,0.7)",
                border: isSelected
                  ? "2px solid rgba(127,255,212,0.8)"
                  : "1px solid rgba(127,255,212,0.25)",
                borderRadius: "14px",
                padding: "0.6rem",
                boxShadow: isSelected
                  ? "0 0 12px rgba(127,255,212,0.6)"
                  : "0 0 6px rgba(127,255,212,0.15)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {g.image_url ? (
                <img
                  src={g.image_url}
                  alt={g.titre}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: ".4rem",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "8px",
                    background: "rgba(127,255,212,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                  }}
                >
                  {g.emoji || "🌟"}
                </div>
              )}
              <h4 style={{ margin: "0.4rem 0 0.2rem 0", color: "#7fffd4" }}>
                {g.emoji} {g.titre || "Sans titre"}
              </h4>
              <p style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.2rem 0" }}>
                {g.culture} • {new Date(g.created_at).toLocaleDateString("fr-FR")}
              </p>
              <p style={{ fontSize: "0.75rem", opacity: 0.7, lineHeight: 1.2 }}>
                {g.texte ? g.texte.slice(0, 80) + "…" : "(rêve silencieux)"}
              </p>
            </div>
          )
        })}
      </div>

      {/* Fusion après sélection */}
      {selectedParents.length === 2 && (
        <div style={{ marginTop: "1.5rem" }}>
          <FusionInvocation
            userId={userId}
            parents={selectedParents}
            onFusionDone={() => {
              loadGallery()
              setSelectedParents([])
            }}
          />
        </div>
      )}

      {/* Mini-modale de carte complète */}
      {modalItem && (
        <div
          onClick={() => setModalItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgba(0,25,35,0.95)",
              border: "1px solid rgba(127,255,212,0.5)",
              borderRadius: "14px",
              padding: "1rem",
              width: "90%",
              maxWidth: "360px",
              textAlign: "center",
              color: "#e9fffd",
            }}
          >
            {modalItem.image_url && (
              <img
                src={modalItem.image_url}
                alt={modalItem.titre}
                style={{ width: "100%", borderRadius: "8px", marginBottom: ".5rem" }}
              />
            )}
            <h3>{modalItem.emoji} {modalItem.titre}</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              {modalItem.texte || "(rêve muet)"}
            </p>
            {modalItem.tags?.length > 0 && (
              <p style={{ fontSize: "0.8rem", color: "#7fffd4" }}>
                {modalItem.tags.join(" • ")}
              </p>
            )}
            <button
              onClick={() => setModalItem(null)}
              style={{
                marginTop: ".6rem",
                background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
                border: "none",
                borderRadius: "8px",
                padding: ".4rem 1rem",
                color: "#111",
                fontWeight: "bold",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}