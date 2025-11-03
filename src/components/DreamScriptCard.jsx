export default function DreamScriptCard({ script }) {
  if (!script)
    return (
      <div
        style={{
          color: "#7fffd4",
          opacity: 0.7,
          textAlign: "center",
          fontStyle: "italic",
          padding: "1rem",
        }}
      >
        🌙 Aucun script onirique pour l’instant...
      </div>
    )

  const {
    titre = "Rêve sans nom",
    texte = "Un souffle passe...",
    date = new Date().toISOString(),
    spirit = "Sila",
    culture = "Inuite",
    emoji = "🌬️",
  } = script

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div
      style={{
        background: "radial-gradient(circle at 50% 20%, #041018, #000)",
        border: "1px solid rgba(127,255,212,0.3)",
        borderRadius: "16px",
        boxShadow: "0 0 12px rgba(127,255,212,0.15)",
        color: "#e9fffd",
        padding: "1rem",
        margin: "0.8rem auto",
        maxWidth: "420px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      className="dreamscript-card"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#7fffd4" }}>
          {emoji} {titre}
        </h3>
        <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>{formattedDate}</span>
      </div>

      <p
        style={{
          whiteSpace: "pre-line",
          lineHeight: 1.4,
          fontSize: "0.95rem",
          marginTop: "0.5rem",
          marginBottom: "0.8rem",
        }}
      >
        {texte}
      </p>

      <div
        style={{
          fontSize: "0.85rem",
          opacity: 0.75,
          textAlign: "right",
          fontStyle: "italic",
        }}
      >
        {culture} — esprit {spirit}
      </div>
    </div>
  )
}