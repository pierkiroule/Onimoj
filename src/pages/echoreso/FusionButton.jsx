// src/pages/echoreso/FusionButton.jsx
import { useState } from "react"
import { supabase } from "../../supabaseClient"

export default function FusionButton({ userId, parentA, parentB, onFusionDone }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleFusion() {
    if (!parentA || !parentB) return
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch(
        "https://tgqnzhyuabgramlazmso.supabase.co/functions/v1/fusion-dreams",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentA,
            parentB,
            creatorId: userId,
          }),
        }
      )

      const data = await res.json()
      if (data.success) {
        setMessage("✨ Un nouveau rêve est né.")
        if (onFusionDone) onFusionDone()
      } else {
        setMessage("⚠️ Fusion impossible : " + (data.message || "erreur inconnue"))
      }
    } catch (err) {
      console.error("Erreur Fusion :", err)
      setMessage("💥 Erreur de connexion à la fonction de fusion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <button
        onClick={handleFusion}
        disabled={loading}
        style={{
          background: "rgba(127,255,212,0.15)",
          color: "#7fffd4",
          border: "1px solid rgba(127,255,212,0.3)",
          borderRadius: "10px",
          padding: "0.6rem 1.4rem",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 0 10px rgba(127,255,212,0.25)",
          transition: "all .3s",
        }}
      >
        {loading ? "🌙 Fusion en cours…" : "💫 Fusionner les deux rêves"}
      </button>

      {message && (
        <p style={{ marginTop: ".5rem", fontSize: ".9rem", opacity: 0.9 }}>
          {message}
        </p>
      )}
    </div>
  )
}