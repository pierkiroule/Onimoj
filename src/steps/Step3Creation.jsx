// src/steps/Step3Creation.jsx
import React, { useState } from "react"
import StarPreview from "../components/StarPreview"
import DreamGallery from "../components/DreamGallery"
import { useDreamGenerator } from "../modules/useDreamGenerator"
import { useDreamSave } from "../modules/useDreamSave"

/**
 * 🌟 Étape 3 : Création du rêve et ajout d’échos
 * Version finale corrigée (IA + galerie + modes)
 */
export default function Step3Creation({ spirit, tags, userId, onBack, onFinish }) {
  const [title, setTitle] = useState(`${spirit.symbol} ${spirit.spirit_name}`)
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [echoText, setEchoText] = useState("")
  const [dreamId, setDreamId] = useState(null)
  const [openMode, setOpenMode] = useState("manual")

  // ✅ on n’envoie PAS d’arguments ici
  const { generateText, generateImage, genLoading } = useDreamGenerator()
  const { saveDream, saveEcho, saveLoading } = useDreamSave()

  // === IA : texte ===
  async function handleGenerateText() {
    try {
      const generated = await generateText(spirit, tags)
      setText(generated)
    } catch (err) {
      alert("⚠️ Échec génération texte")
      console.error(err)
    }
  }

  // === IA : image ===
  async function handleGenerateImage() {
    try {
      const url = await generateImage(spirit, tags)
      if (url) setImageUrl(url)
      else alert("⚠️ Aucune image reçue")
    } catch (err) {
      alert("⚠️ Erreur lors de la génération d’image")
      console.error(err)
    }
  }

  // === Sauvegarde du rêve ===
  async function handleSaveDream() {
    if (!userId) return alert("Connecte-toi d’abord 🌙")
    if (!title.trim() || !text.trim()) return alert("Complète le rêve avant de sauvegarder ✨")

    const res = await saveDream({
      userId,
      spirit,
      title,
      text,
      tags,
      imageUrl,
      visible: true,
    })

    if (res.success) {
      setDreamId(res.dreamId)
      alert("💾 Rêve enregistré dans la Rêvothèque 🌙")
      onFinish?.(res.dreamId)
    } else {
      alert("❌ " + res.message)
    }
  }

  // === Sauvegarde d’écho ===
  async function handleSaveEcho() {
    if (!dreamId) return alert("Sauvegarde d’abord ton rêve principal 🌕")
    if (!echoText.trim()) return alert("Écris un écho avant d’envoyer 🌬️")

    const res = await saveEcho({ userId, dreamId, content: echoText })
    if (res.success) {
      alert("💬 Écho ajouté avec succès")
      setEchoText("")
    } else {
      alert("❌ " + res.message)
    }
  }

  return (
    <div
      className="fade-in"
      style={{ color: "#e9fffd", textAlign: "center", padding: "1rem", fontFamily: "'Inter', sans-serif" }}
    >
      <h2 style={{ color: "#7fffd4" }}>
        🌟 Création du rêve — {spirit.symbol} {spirit.spirit_name}
      </h2>
      <p style={{ opacity: 0.8 }}>Choisis ta manière de rêver.</p>

      <StarPreview words={tags} centerEmoji={spirit.symbol} />

      <div style={{ maxWidth: 560, margin: "1rem auto", textAlign: "left" }}>
        {/* 🎴 Titre */}
        <label style={labelStyle}>Titre du rêve</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre poétique..."
          style={inputStyle}
        />

        {/* 📝 Texte principal */}
        <label style={labelStyle}>Texte du rêve</label>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ton rêve apparaîtra ici..."
          style={textareaStyle}
        />

        {/* 🌿 Bloc accordéon : deux modes d’aide */}
        <div style={accordionContainer}>
          {/* --- SANS IA --- */}
          <div style={accordionBlock}>
            <button
              onClick={() => setOpenMode(openMode === "manual" ? null : "manual")}
              style={accordionHeader(openMode === "manual")}
            >
              Assistance sans IA
            </button>

            {openMode === "manual" && (
              <div style={accordionBody}>
                <p style={{ opacity: 0.8 }}>Laisse-toi inspirer :</p>
                <ul style={{ listStyle: "none", padding: 0, marginTop: ".5rem" }}>
                  {[
                    "Je me réveille dans...",
                    "Autour de moi, il y a...",
                    "Je ressens...",
                    "Un souffle traverse...",
                    "Peu à peu, je découvre...",
                  ].map((a, i) => (
                    <li key={i} style={{ marginBottom: ".4rem", color: "#aefcf5" }}>
                      ✴️ <em>{a}</em>
                    </li>
                  ))}
                </ul>
                <textarea
                  rows={6}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Complète ton rêve librement..."
                  style={textareaStyle}
                />
              </div>
            )}
          </div>

          {/* --- AVEC IA --- */}
          <div style={accordionBlock}>
            <button
              onClick={() => setOpenMode(openMode === "ai" ? null : "ai")}
              style={accordionHeader(openMode === "ai")}
            >
              Assistance avec IA
            </button>

            {openMode === "ai" && (
              <div style={accordionBody}>
                <p style={{ opacity: 0.8 }}>
                  Laisse l’assistant t’aider à formuler ton rêve ou ton image.
                </p>
                <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: ".5rem" }}>
                  <button onClick={handleGenerateText} disabled={genLoading} style={btnPrimary}>
                    {genLoading ? "… génération texte" : "🪶 Générer le texte"}
                  </button>
                  <button onClick={handleGenerateImage} disabled={genLoading} style={btnGhost}>
                    {genLoading ? "… image" : "🌌 Générer une image (1x max)"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🎨 Galerie des rêves collectifs */}
        <DreamGallery activeTags={tags} onSelect={(img) => setImageUrl(img)} />

        {/* 📸 Aperçu image sélectionnée */}
        {imageUrl && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <img
              src={imageUrl}
              alt={title}
              style={{
                width: "100%",
                maxWidth: 380,
                borderRadius: 12,
                boxShadow: "0 0 12px rgba(127,255,212,0.4)",
              }}
            />
          </div>
        )}

        {/* 💾 Boutons principaux */}
        <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
          <button onClick={handleSaveDream} disabled={saveLoading} style={btnPrimary}>
            {saveLoading ? "… Sauvegarde" : "💾 Enregistrer le rêve"}
          </button>
          <button onClick={onBack} style={btnGhost}>
            ⬅️ Retour au hublot
          </button>
        </div>

        {/* 💬 Bloc Écho post-rêve */}
        {dreamId && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(127,255,212,0.05)",
              border: "1px solid rgba(127,255,212,0.2)",
            }}
          >
            <h3 style={{ color: "#7fffd4", textAlign: "center" }}>💬 Ajouter un écho</h3>
            <textarea
              rows={4}
              value={echoText}
              onChange={(e) => setEchoText(e.target.value)}
              placeholder="Un ressenti, une onde à partager..."
              style={textareaStyle}
            />
            <button
              onClick={handleSaveEcho}
              disabled={saveLoading}
              style={{ ...btnPrimary, width: "100%", marginTop: ".5rem" }}
            >
              Envoyer l’écho
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* === Styles === */
const accordionContainer = {
  marginTop: "1rem",
  borderRadius: "10px",
  overflow: "hidden",
  background: "rgba(0,20,25,0.3)",
}
const accordionBlock = { borderBottom: "1px solid rgba(127,255,212,0.15)" }
const accordionHeader = (open) => ({
  width: "100%",
  textAlign: "left",
  background: open ? "rgba(127,255,212,0.15)" : "transparent",
  color: "#7fffd4",
  border: "none",
  fontSize: "1rem",
  padding: ".7rem 1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.25s ease",
})
const accordionBody = {
  padding: "0.8rem 1rem 1.2rem",
  background: "rgba(0,30,35,0.4)",
}
const btnPrimary = {
  background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
  border: "none",
  borderRadius: "10px",
  padding: ".6rem 1rem",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
}
const btnGhost = {
  background: "rgba(127,255,212,0.1)",
  border: "1px solid rgba(127,255,212,.4)",
  borderRadius: "10px",
  padding: ".6rem 1rem",
  color: "#7fffd4",
  fontWeight: 600,
  cursor: "pointer",
}
const labelStyle = {
  color: "#7fffd4",
  display: "block",
  marginTop: ".6rem",
  marginBottom: ".2rem",
  fontWeight: 600,
}
const inputStyle = {
  width: "100%",
  border: "1px solid rgba(127,255,212,.35)",
  background: "rgba(0,20,25,.6)",
  borderRadius: "8px",
  padding: ".5rem",
  color: "#bff",
  fontWeight: "600",
}
const textareaStyle = {
  width: "100%",
  border: "1px solid rgba(127,255,212,.35)",
  background: "rgba(0,20,25,.6)",
  borderRadius: "8px",
  padding: ".6rem",
  color: "#e9fffd",
  resize: "vertical",
}