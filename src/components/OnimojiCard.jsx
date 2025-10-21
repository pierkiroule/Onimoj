export default function OnimojiCard({ star }) {
  const starPositions = [
    { x: 0, y: -90 },
    { x: 85, y: -25 },
    { x: 50, y: 75 },
    { x: -50, y: 75 },
    { x: -85, y: -25 },
  ]

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3 style={{ color: "#bff" }}>{star.title}</h3>
      <p style={{ opacity: 0.7 }}>
        🌌 Résonance : {(star.resonance_level * 100).toFixed(0)}%<br />
        🌊 Divergence : {(star.divergence_score * 100).toFixed(0)}%<br />
        🌈 Harmonie : {(star.harmonic_balance * 100).toFixed(0)}%
      </p>
      <svg width="240" height="240">
        {starPositions.map((a, i) => {
          const b = starPositions[(i + 2) % 5]
          return (
            <line
              key={i}
              x1={120 + a.x}
              y1={120 + a.y}
              x2={120 + b.x}
              y2={120 + b.y}
              stroke="rgba(127,255,212,0.6)"
              strokeWidth="2"
            />
          )
        })}
        {star.emojis.map((e, i) => {
          const p = starPositions[i]
          return (
            <text
              key={i}
              x={120 + p.x}
              y={120 + p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="26"
            >
              {e}
            </text>
          )
        })}
      </svg>
    </div>
  )
}