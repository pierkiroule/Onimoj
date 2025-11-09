import EchoResoFlow from "./EchoResoFlow"

export default function Index({ userId }) {
  return (
    <div
      style={{
        color: "#e9fffd",
        textAlign: "center",
        padding: "1rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2
        style={{
          color: "#7fffd4",
          marginBottom: ".5rem",
          textShadow: "0 0 10px rgba(127,255,212,0.3)",
        }}
      >
        🌌 ÉchoReso•°
      </h2>

      <p
        style={{
          opacity: 0.8,
          fontSize: ".9rem",
          marginBottom: "1.2rem",
        }}
      >
        Réso•°<b>Les rêves des uns deviennent les ressources des autres.</b>
      </p>

      <div
        style={{
          border: "1px solid rgba(127,255,212,0.2)",
          borderRadius: "12px",
          background: "rgba(0,25,35,0.25)",
          padding: "0",
          overflow: "hidden",
          height: "90vh",
          boxShadow: "inset 0 0 20px rgba(127,255,212,0.1)",
        }}
      >
        <EchoResoFlow userId={userId} />
      </div>
    </div>
  )
}