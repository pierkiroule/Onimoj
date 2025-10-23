import PropTypes from "prop-types"

export default function ModuleInuitStep({ step = {}, onOpenHublot }) {
  const {
    spirit_name = "",
    symbol = "",
    theme = "",
    description = "",
    question = "",
    practice = "",
    integration = "",
    step_number,
  } = step || {}

  return (
    <section style={{
      margin: "1rem auto",
      padding: "1rem",
      maxWidth: 680,
      background: "linear-gradient(180deg, rgba(8,18,26,0.8), rgba(0,0,0,0.7))",
      border: "1px solid rgba(127,255,212,0.25)",
      borderRadius: 16,
      boxShadow: "0 0 36px rgba(127,255,212,0.15)",
      color: "#e9fffd",
      textAlign: "left",
    }}>
      <header style={{ marginBottom: 12 }}>
        <div style={{ opacity: 0.85, fontSize: 14 }}>
          Étape {step_number || "—"}
        </div>
        <h3 style={{ margin: "6px 0 0 0", fontSize: 20 }}>
          {spirit_name} {symbol}
        </h3>
        {theme && (
          <div style={{ opacity: 0.9, marginTop: 4, fontStyle: "italic" }}>
            Thème: {theme}
          </div>
        )}
      </header>

      {description && (
        <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
          {description}
        </p>
      )}

      {question && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Question</div>
          <p style={{ margin: 0, opacity: 0.92 }}>{question}</p>
        </div>
      )}

      {practice && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Pratique sensorielle</div>
          <p style={{ margin: 0, opacity: 0.92 }}>{practice}</p>
        </div>
      )}

      {integration && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Intégration</div>
          <p style={{ margin: 0, opacity: 0.92 }}>{integration}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => onOpenHublot?.()}
          style={{
            marginTop: 16,
            background: "linear-gradient(90deg,#6a5acd,#7fffd4)",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            fontWeight: 700,
            color: "#111",
            cursor: "pointer",
          }}
        >
          🌌 Ouvrir le Hublot
        </button>
      </div>
    </section>
  )
}

ModuleInuitStep.propTypes = {
  step: PropTypes.object,
  onOpenHublot: PropTypes.func,
}
