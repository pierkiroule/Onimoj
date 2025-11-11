// src/components/DreamManualModal.jsx
import React, { useState } from "react"

export default function DreamManualModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    lieu: "",
    rencontre: "",
    émotion: "",
    transformation: "",
  })

  if (!open) return null

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleValidate() {
    const texte = `
Je me trouve ${form.lieu || "dans un lieu indéfini"}.
J’y rencontre ${form.rencontre || "une présence silencieuse"}.
Je ressens ${form.émotion || "une émotion subtile"}.
Peu à peu, tout se transforme ${form.transformation || "en une lumière paisible"}.
Le rêve s’éteint en moi comme une vague douce.
`.trim()

    onSubmit(texte)
    onClose()
  }

  return (
    <div style={backdrop}>
      <div style={modalBox}>
        <h3 style={{ color: "#7fffd4", marginBottom: ".6rem" }}>🌙 Rêve à compléter</h3>
        <p style={{ fontSize: ".9rem", opacity: 0.8 }}>
          Inspire-toi des amorces et laisse venir les images…
        </p>

        <label style={label}>Je me trouve…</label>
        <input name="lieu" value={form.lieu} onChange={handleChange} style={input} placeholder="dans une forêt de glace..." />

        <label style={label}>Je rencontre…</label>
        <input name="rencontre" value={form.rencontre} onChange={handleChange} style={input} placeholder="une silhouette de vent..." />

        <label style={label}>Je ressens…</label>
        <input name="émotion" value={form.émotion} onChange={handleChange} style={input} placeholder="un calme vibrant..." />

        <label style={label}>Tout se transforme…</label>
        <input name="transformation" value={form.transformation} onChange={handleChange} style={input} placeholder="en lumière boréale..." />

        <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
          <button onClick={handleValidate} style={btnPrimary}>💫 Valider</button>
          <button onClick={onClose} style={btnGhost}>Fermer</button>
        </div>
      </div>
    </div>
  )
}

/* === Styles === */
const backdrop = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
}

const modalBox = {
  background: "rgba(10,20,25,0.95)",
  border: "1px solid rgba(127,255,212,0.3)",
  borderRadius: "12px",
  padding: "1.2rem",
  width: "90%",
  maxWidth: "380px",
  color: "#e9fffd",
  textAlign: "left",
  boxShadow: "0 0 20px rgba(127,255,212,0.2)",
}

const label = {
  display: "block",
  marginTop: ".4rem",
  fontSize: ".9rem",
  color: "#aefcf5",
}

const input = {
  width: "100%",
  borderRadius: "8px",
  border: "1px solid rgba(127,255,212,.4)",
  background: "rgba(0,20,25,.7)",
  color: "#bff",
  padding: ".4rem",
  marginTop: ".2rem",
}

const btnPrimary = {
  background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
  border: "none",
  borderRadius: "8px",
  padding: ".5rem 1rem",
  color: "#111",
  fontWeight: "bold",
  cursor: "pointer",
}

const btnGhost = {
  background: "rgba(127,255,212,0.1)",
  border: "1px solid rgba(127,255,212,.4)",
  borderRadius: "8px",
  padding: ".5rem 1rem",
  color: "#7fffd4",
  fontWeight: 600,
  cursor: "pointer",
}