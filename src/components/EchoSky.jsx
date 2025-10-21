import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import MeteoOnirique from "../components/MeteoOnirique"

export default function EchoSky({ stars = [], links = [], onSelect }) {
  const ref = useRef()
  const [diag, setDiag] = useState({ nodes: 0, edges: 0, avg: 0 })

  useEffect(() => {
    if (!stars.length) return

    const width = window.innerWidth
    const height = window.innerHeight * 0.7
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()
    svg.attr("width", width).attr("height", height)
    svg.style("background", "radial-gradient(circle at 50% 45%, #060a18 0%, #010208 90%)")

    const g = svg.append("g")
    svg.call(d3.zoom().scaleExtent([0.5, 3]).on("zoom", (e) => g.attr("transform", e.transform)))

    // 🌌 Disposition Rosaïenne : champ de résonance organique
    const nodes = stars.map((s, i) => ({
      ...s,
      id: String(s.id ?? `star-${i}`),
      x: width / 2 + (Math.random() - 0.5) * 400 * (1 + (s.divergence_score ?? 0.3)),
      y: height / 2 + (Math.random() - 0.5) * 300 * (1 - (s.resonance_level ?? 0.5)),
      resonance_level: Number(s.resonance_level) || 0.5,
      harmonic_balance: Number(s.harmonic_balance) || 0.5,
      divergence_score: Number(s.divergence_score) || 0.2,
    }))

    const nodeMap = new Map(nodes.map((n) => [n.id, n]))

    // 🔗 Liens
    let edges = (links || [])
      .map((l) => {
        const a = String(l.star_a ?? l.source ?? "")
        const b = String(l.star_b ?? l.target ?? "")
        if (!a || !b || !nodeMap.has(a) || !nodeMap.has(b)) return null
        const total =
          l.total_strength != null
            ? Number(l.total_strength)
            : 0.7 * (Number(l.emoji_similarity) || 0) +
              0.3 * (Number(l.resonance_similarity) || 0)
        return {
          source: a,
          target: b,
          strength: Math.max(0, Math.min(1, total || 0)),
        }
      })
      .filter(Boolean)
      .filter((e) => e.strength > 0.05)

    if (edges.length === 0 && nodes.length > 1)
      edges = [{ source: nodes[0].id, target: nodes[1].id, strength: 0.6 }]

    const avg = edges.length
      ? edges.reduce((s, e) => s + e.strength, 0) / edges.length
      : 0
    setDiag({ nodes: nodes.length, edges: edges.length, avg: avg.toFixed(2) })

    const color = d3.scaleLinear().domain([0, 1]).range(["#6ef7ff", "#ffb347"])
    const size = d3.scaleLinear().domain([0, 1]).range([10, 26])
    const opa = d3.scaleLinear().domain([0, 1]).range([0.4, 1])

    // 🔗 Tracés de résonance
    g.append("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("x1", (d) => nodeMap.get(d.source)?.x || 0)
      .attr("y1", (d) => nodeMap.get(d.source)?.y || 0)
      .attr("x2", (d) => nodeMap.get(d.target)?.x || 0)
      .attr("y2", (d) => nodeMap.get(d.target)?.y || 0)
      .attr("stroke", (d) =>
        d.strength > 0.6
          ? "rgba(255,170,80,0.8)"
          : d.strength > 0.3
          ? "rgba(255,230,140,0.6)"
          : "rgba(100,200,255,0.4)"
      )
      .attr("stroke-width", (d) => 0.5 + 4 * d.strength)
      .attr("opacity", (d) => 0.15 + 0.6 * d.strength)
      .style("filter", "blur(2px)")

    // 🌟 Halo
    g.selectAll(".halo")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", "halo")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => size(d.harmonic_balance) * 1.6)
      .attr("fill", (d) => color(d.resonance_level))
      .attr("opacity", (d) => 0.1 + 0.4 * opa(d.divergence_score))
      .style("filter", "blur(10px)")

    // 🌠 Étoile
    const starPath = (cx, cy, spikes, outer, inner) => {
      let p = "", step = Math.PI / spikes
      for (let i = 0; i < 2 * spikes; i++) {
        const r = i % 2 ? inner : outer
        const x = cx + Math.cos(i * step - Math.PI / 2) * r
        const y = cy + Math.sin(i * step - Math.PI / 2) * r
        p += i === 0 ? `M${x},${y}` : `L${x},${y}`
      }
      return p + "Z"
    }

    g.selectAll(".star")
      .data(nodes)
      .enter()
      .append("path")
      .attr("class", "star")
      .attr("d", (d) =>
        starPath(d.x, d.y, 5, size(d.harmonic_balance), size(d.harmonic_balance) / 2.2)
      )
      .attr("fill", (d) => color(d.resonance_level))
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.7)
      .attr("opacity", (d) => opa(d.divergence_score))
      .style("filter", "drop-shadow(0 0 8px rgba(255,255,255,0.4))")
      .on("click", (_, d) => onSelect?.(d))

    // ✴️ Labels
    g.selectAll(".label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + size(d.harmonic_balance) + 14)
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("opacity", 0.85)
      .attr("text-anchor", "middle")
      .text((d) => d.title || "★")

    // 🌬️ Respiration cosmique douce
    let t = 0
    function animate() {
      t += 0.002
      g.selectAll(".star, .halo")
        .attr("transform", (d, i) => {
          const dx = Math.sin(t * 2 + i) * 1.5
          const dy = Math.cos(t * 3 + i) * 1.5
          return `translate(${dx},${dy})`
        })
      requestAnimationFrame(animate)
    }
    animate()
  }, [stars, links, onSelect])

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={ref}
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: "14px",
          cursor: "grab",
          touchAction: "none",
          boxShadow: "0 0 20px rgba(80,200,255,0.15)",
        }}
      />

      {/* Stats du champ */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(0,20,40,0.7)",
          border: "1px solid rgba(80,200,255,0.3)",
          borderRadius: 8,
          padding: "0.4rem 0.8rem",
          fontSize: "0.8rem",
          color: "#bff",
          textAlign: "right",
          lineHeight: "1.2rem",
        }}
      >
        🌌 <b>{diag.nodes}</b> étoiles<br />
        🔗 <b>{diag.edges}</b> liens<br />
        ⚡ résonance moy. <b>{diag.avg}</b>
      </div>

      {/* MétéOnirique */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <MeteoOnirique />
      </div>
    </div>
  )
}