// src/pages/echoreso/WisdomModal.jsx
import { useState } from "react"
import { supabase } from "../../supabaseClient"

export default function WisdomModal({ wisdom, userId, onClose }) {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState(wisdom.wisdom_text || "")
  const [error, setError] = useState(null)
  const [offline, setOffline] = useState(false)
  const [sharedMsg, setSharedMsg] = useState("")

  // --- sauvegarde native ---
  function saveBlob(blob, filename) {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  // === Génération IA Nebius (fallback local) ===
  async function generateWisdom() {
    setLoading(true)
    setError(null)
    try {
      const { data: dream, error: dreamErr } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, image_url")
        .eq("id", wisdom.dream_id)
        .single()

      if (dreamErr || !dream) throw new Error("Rêve d’origine introuvable.")

      const prompt = `
Transforme ce rêve collectif en une Sagesse Onirique poétique.
Titre : ${dream.titre}
Contenu : ${dream.contenu}
Tags : ${Array.isArray(dream.tags) ? dream.tags.join(", ") : dream.tags}
Langue : français.
`

      let wisdomText = ""
      try {
        const response = await fetch("https://api.nebius.ai/textgen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        })
        if (!response.ok) throw new Error("Échec appel Nebius")
        const result = await response.json()
        wisdomText = (result.text || "").trim()
      } catch {
        console.warn("Nebius indisponible — génération locale.")
        setOffline(true)
        wisdomText = `
🌕 Sagesse provisoire
Quand le rêve se tait,
la mémoire éclaire la nuit.
Respire, écoute, dors.
Le Gardien veille encore…`
      }

      await supabase
        .from("dream_archive")
        .update({
          wisdom_generated: true,
          wisdom_text: wisdomText,
          guardian_name: dream.titre || "Gardien du Réso•°",
          generated_by: userId || null,
          generated_at: new Date().toISOString(),
        })
        .eq("id", wisdom.id)

      setText(wisdomText)
      prepareShareMessage(wisdomText, dream.titre)
    } catch (err) {
      console.error("⚠️ Erreur génération sagesse :", err)
      setError("Impossible de générer la Sagesse.")
    } finally {
      setLoading(false)
    }
  }

  // === Génère un message de partage poétique ===
  function prepareShareMessage(wisdomText, titre = "Gardien du Réso•°") {
    const msg = `🌕 Sagesse onirique révélée – ${titre}\n\n${wisdomText}\n\n✨ #Onimoji #ReveCollectif #Reso\n${window.location.origin}/reso`
    setSharedMsg(msg)
  }

  // === Partage mobile ou copie texte ===
  async function shareWisdom() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sagesse Onirique — Réso•° Onimoji",
          text: sharedMsg,
        })
      } else {
        await navigator.clipboard.writeText(sharedMsg)
        alert("🌕 Texte copié ! Prêt à partager sur ton réseau préféré 🌙")
      }
    } catch (err) {
      console.error("Erreur partage :", err)
      alert("⚠️ Impossible de partager pour l’instant.")
    }
  }

  // === Badge JPG (Canvas) ===
  async function generateWisdomBadge() {
    try {
      const node = document.getElementById("wisdom-badge")
      const rect = node.getBoundingClientRect()
      const canvas = document.createElement("canvas")
      canvas.width = rect.width * 2
      canvas.height = rect.height * 2 + 80
      const ctx = canvas.getContext("2d")
      ctx.scale(2, 2)
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, rect.width, rect.height + 80)
      ctx.fillStyle = "#ffe38e"
      ctx.font = "bold 16px serif"
      ctx.textAlign = "center"
      ctx.fillText(`🌕 Félicitations, cher Écho•°Dreamer 🌙`, rect.width / 2, 24)
      ctx.fillStyle = "#fff8dc"
      ctx.font = "14px serif"
      ctx.fillText(
        `Tu portes la Sagesse du Gardien ${wisdom.guardian_name || "Onirique"}`,
        rect.width / 2,
        44
      )
      const lines = (text || "").split("\n")
      let y = 80
      ctx.font = "15px 'Crimson Text', serif"
      for (const line of lines) {
        ctx.fillText(line.trim(), rect.width / 2, y)
        y += 24
      }
      ctx.fillStyle = "#ffd46b"
      ctx.font = "bold 13px monospace"
      ctx.fillText("✨ Onimoji Réso•°", rect.width / 2, rect.height + 60)

      canvas.toBlob((blob) => {
        if (!blob) return alert("Erreur : image vide.")
        saveBlob(blob, `Badge-Sagesse-${wisdom.guardian_name || "Onirique"}.jpg`)
      }, "image/jpeg", 0.95)
    } catch (err) {
      console.error("Erreur badge :", err)
      alert("⚠️ Impossible de générer le badge.")
    }
  }

  // === PDF minimal natif ===
  async function downloadWisdomPDF() {
    try {
      const textData = `
🌕 Sagesse du Gardien ${wisdom.guardian_name}

${text || "Sagesse en cours de révélation..."}

──────────────────────────────
Réso•° Onimoji — ${new Date().toLocaleDateString("fr-FR")}
`
      const blob = new Blob([textData], { type: "application/pdf" })
      saveBlob(blob, `Sagesse-${wisdom.guardian_name || "Onirique"}.pdf`)
    } catch (err) {
      console.error("Erreur PDF :", err)
      alert("⚠️ Impossible de générer le PDF.")
    }
  }

  // === UI ===
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(15,20,25,0.96)",
          border: "1px solid rgba(255,230,150,0.5)",
          borderRadius: "12px",
          padding: "1.4rem",
          width: "90%",
          maxWidth: 580,
          color: "#ffe38e",
          textAlign: "center",
          boxShadow: "0 0 25px rgba(255,230,150,0.15)",
        }}
      >
        <h3>🌕 Sagesse du Gardien {wisdom.guardian_name || "du Réso•°"}</h3>

        {offline && (
          <p style={{ color: "#ffcc88", fontSize: ".85rem" }}>
            💤 Mode local — Nebius hors ligne
          </p>
        )}

        {!text && !loading && (
          <button
            onClick={generateWisdom}
            style={{
              marginTop: "1rem",
              background: "rgba(255,230,150,0.15)",
              border: "1px solid rgba(255,230,150,0.5)",
              color: "#ffe38e",
              padding: ".6rem 1.2rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            🌕 Révéler la Sagesse
          </button>
        )}

        {loading && (
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            🌙 Révélation en cours...
          </p>
        )}

        {error && (
          <p style={{ color: "#ff9999", marginTop: "1rem" }}>⚠️ {error}</p>
        )}

        {text && (
          <>
            <div
              id="wisdom-badge"
              style={{
                marginTop: "1.2rem",
                background: "radial-gradient(circle at 50% 50%, #1a2225, #000)",
                border: "1px solid rgba(255,230,150,0.4)",
                borderRadius: "12px",
                padding: "1.5rem",
                color: "#fff8dc",
                fontFamily: "Crimson Text, serif",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap",
              }}
            >
              <h2 style={{ color: "#ffe38e" }}>
                🏅 Sagesse du Gardien {wisdom.guardian_name}
              </h2>
              <p style={{ fontSize: "1rem", marginTop: ".8rem" }}>{text}</p>
              <p style={{ marginTop: "1rem", fontSize: ".85rem", opacity: 0.7 }}>
                🌌 Rêve collectif du Réso•° Onimoji
              </p>
            </div>

            <div style={{ marginTop: "1.2rem", display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "center" }}>
              <button
                onClick={generateWisdomBadge}
                style={{
                  background: "linear-gradient(90deg,#ffe38e,#ffd46b)",
                  border: "none",
                  borderRadius: "10px",
                  padding: ".6rem 1.2rem",
                  color: "#111",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🏅 Générer le badge
              </button>

              <button
                onClick={downloadWisdomPDF}
                style={{
                  background: "rgba(255,230,150,0.15)",
                  border: "1px solid rgba(255,230,150,0.4)",
                  borderRadius: "10px",
                  padding: ".6rem 1.2rem",
                  color: "#ffe38e",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                📄 Télécharger le PDF
              </button>

              <button
                onClick={shareWisdom}
                disabled={!sharedMsg}
                style={{
                  background: "rgba(255,230,150,0.2)",
                  border: "1px solid rgba(255,230,150,0.4)",
                  borderRadius: "10px",
                  padding: ".6rem 1.2rem",
                  color: "#ffe38e",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                📣 Partager
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}