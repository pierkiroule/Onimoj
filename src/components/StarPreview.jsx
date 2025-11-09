// src/components/StarPreview.jsx
import React from "react"

export default function StarPreview({ words = [], centerEmoji = "✨", pulse = true }) {
  const items = Array.from({ length: 5 }, (_, i) => words[i] || "·")

  const size = 260
  const cx = size / 2
  const cy = size / 2
  const R = 105
  const r = 48

  const pts = []
  for (let i = 0; i < 10; i++) {
    const ang = (-90 + i * 36) * (Math.PI / 180)
    const rad = i % 2 === 0 ? R : r
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)])
  }

  const d =
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z"

  const labelPoints = [0, 2, 4, 6, 8].map((i) => pts[i])

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* halo central */}
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#7fffd4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7fffd4" stopOpacity="0" />
          </radialGradient>

          {/* effet de pulsation */}
          <radialGradient id="pulse" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#aefcf5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7fffd4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {pulse && (
          <circle
            cx={cx}
            cy={cy}
            r={R + 25}
            fill="url(#pulse)"
            style={{
              transformOrigin: "center",
              animation: "pulse 3.2s ease-in-out infinite",
            }}
          />
        )}

        {/* halo statique */}
        <circle cx={cx} cy={cy} r={R + 18} fill="url(#halo)" />

        {/* étoile */}
        <path
          d={d}
          fill="rgba(127,255,212,0.12)"
          stroke="rgba(127,255,212,0.8)"
          strokeWidth="2"
          filter="drop-shadow(0 0 6px rgba(127,255,212,0.35))"
        />

        {/* rayons internes */}
        {labelPoints.map((p, i) => (
          <line
            key={"ray" + i}
            x1={cx}
            y1={cy}
            x2={p[0]}
            y2={p[1]}
            stroke="rgba(127,255,212,0.25)"
            strokeWidth="1"
          />
        ))}

        {/* mots sur les pointes */}
        {labelPoints.map((p, i) => (
          <text
            key={"lbl" + i}
            x={p[0]}
            y={p[1]}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`translate(0, ${p[1] < cy ? -14 : 14})`}
            style={{
              fill: "#e9fffd",
              fontSize: "12px",
              fontWeight: 600,
              paintOrder: "stroke",
              stroke: "rgba(0,0,0,0.45)",
              strokeWidth: 2,
              letterSpacing: "0.3px",
            }}
          >
            {items[i]}
          </text>
        ))}

        {/* emoji central */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "36px",
            filter: "drop-shadow(0 0 4px rgba(127,255,212,0.8))",
          }}
        >
          {centerEmoji}
        </text>
      </svg>

      {/* animation pulse injectée en inline style */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}