import React from "react"

export default function NodeCard({ node, onClose }) {
  if (!node) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(10,20,25,0.9)",
          border: "1px solid rgba(127,255,212,0.3)",
          borderRadius: "16px",
          padding: "1rem",
          width: "90%",
          maxWidth: "360px",
          color: "#e9fffd",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(127,255,212,0.3)",
          animation: "fadeIn .3s ease",
        }}
      >
        {/* 🌠 Image */}
        {node.image_url && (
          <img
            src={node.image_url}
            alt={node.titre}
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: ".8rem",
              boxShadow: "0 0 20px rgba(127,255,212,0.25)",
            }}
          />
        )}

        {/* 🌟 Emoji + titre */}
        <h3 style={{ margin: 0, fontSize: "1.4rem", color: "#7fffd4" }}>
          {node.emoji || "✨"} {node.titre}
        </h3>

        {/* 🕯 Texte onirique */}
        {node.texte && (
          <p style={{ marginTop: ".6rem", fontSize: ".95rem", opacity: 0.9, whiteSpace: "pre-wrap" }}>
            {node.texte}
          </p>
        )}

        {/* 🏷 Tags */}
        {Array.isArray(node.tags) && node.tags.length > 0 && (
          <div style={{ marginTop: ".6rem", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {node.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(127,255,212,0.15)",
                  border: "1px solid rgba(127,255,212,0.4)",
                  borderRadius: "20px",
                  padding: ".2rem .6rem",
                  fontSize: ".8rem",
                  margin: "0.2rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 📜 Culture et date */}
        <p style={{ fontSize: ".75rem", opacity: 0.7, marginTop: ".8rem" }}>
          {node.culture || "Rêve inconnu"} •{" "}
          {node.created_at ? new Date(node.created_at).toLocaleDateString("fr-FR") : ""}
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: "0.8rem",
            border: "none",
            background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
            color: "#111",
            padding: ".4rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Fermer
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  )
}