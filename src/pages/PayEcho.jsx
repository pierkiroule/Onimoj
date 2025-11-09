import { useState } from "react"

export default function PayEcho({ onConfirm }) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      // 🔗 ici tu appelleras ton endpoint de paiement Stripe / Supabase Edge Function
      // const { data } = await supabase.functions.invoke("create-payment-session", { body: { amount: 1.9 } })
      // window.location.href = data.url
      setTimeout(() => {
        setLoading(false)
        onConfirm && onConfirm()
        alert("🌕 Voyage activé ! Bon rêve…")
      }, 1800)
    } catch (e) {
      setLoading(false)
      alert("⚠️ Erreur de paiement.")
      console.error(e)
    }
  }

  return (
    <div
      style={{
        padding: "2rem 1rem",
        textAlign: "center",
        color: "#e9fffd",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2 style={{ color: "#7fffd4", marginBottom: ".5rem" }}>💠 Voyage onirique</h2>
      <p style={{ opacity: 0.85, fontSize: ".95rem", marginBottom: "1.5rem" }}>
        Offre unique : <b>1 voyage •° = 1,90 €</b><br />
        Chaque contribution soutient les gardiens du Réso•°.
      </p>

      <div style={scene}>
        <div className="pulse" style={{ ...echoCircle, width: 180, height: 180, border: "1.2px solid rgba(127,255,212,0.5)" }} />
        <div className="pulse delay1" style={{ ...echoCircle, width: 220, height: 220, border: "1px solid rgba(200,255,250,0.4)" }} />
        <div className="pulse delay2" style={{ ...echoCircle, width: 260, height: 260, border: "0.8px solid rgba(255,200,180,0.35)" }} />
        <div style={inner}>
          <p style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>🌙</p>
          <p style={{ fontSize: ".9rem", opacity: 0.9 }}>1 Voyage</p>
          <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#7fffd4" }}>1,90 €</p>
          <button
            disabled={loading}
            onClick={handlePay}
            style={{
              background: "#7fffd4",
              border: "none",
              borderRadius: "10px",
              padding: ".6rem 1.2rem",
              marginTop: "0.8rem",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: ".95rem",
              color: "#001820",
              boxShadow: "0 0 12px rgba(127,255,212,0.4)",
            }}
          >
            {loading ? "... Paiement en cours" : "🌕 Offrir le voyage"}
          </button>
        </div>
      </div>

      <p style={{ marginTop: "1.5rem", opacity: 0.7, fontSize: ".8rem" }}>
        Transaction sécurisée • Aucun abonnement • Reçu instantané
      </p>

      <style>
        {`
          @keyframes pulseEcho {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .pulse {
            animation: pulseEcho 6s ease-in-out infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
          }
          .delay1 { animation-delay: 1s; }
          .delay2 { animation-delay: 2s; }
        `}
      </style>
    </div>
  )
}

/* === Styles === */
const scene = {
  position: "relative",
  width: 300,
  height: 300,
  margin: "0 auto",
  background: "radial-gradient(circle at 50% 50%, #001820, #000710 90%)",
  borderRadius: "50%",
  boxShadow: "0 0 40px rgba(127,255,212,0.2)",
}

const echoCircle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "50%",
}

const inner = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
}