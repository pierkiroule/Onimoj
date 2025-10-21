import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import MeteoOnirique from "../components/MeteoOnirique"

export default function EchoSky({ stars = [], links = [], onSelect }) {
  const ref = useRef()
  const [diag, setDiag] = useState({ nodes: 0, edges: 0, avg: 0 })
  const [show, setShow] = useState({ titles: true, authors: false, emojis: true })
  const [mode, setMode] = useState("stars")
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (!stars.length) return
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()

    const width = window.innerWidth
    const height = window.innerHeight * 0.7
    svg.attr("width", width).attr("height", height)
    svg.style("background", "radial-gradient(circle at 50% 45%, #060a18 0%, #010208 90%)")

    const g = svg.append("g")
    svg.call(d3.zoom().scaleExtent([0.5, 3]).on("zoom", (e) => g.attr("transform", e.transform)))

    // ✨ transition cosmique
    setTransitioning(true)
    svg.transition().duration(700).style("opacity", 0).transition().duration(700).style("opacity", 1)
    setTimeout(() => setTransitioning(false), 1400)

    let simulation

    // -------------------------------------
    // 🌠 MODE 1 : Vue Onimojis
    // -------------------------------------
    if (mode === "stars") {
      const nodes = stars.map((s, i) => ({
        ...s,
        id: String(s.id ?? `star-${i}`),
        x: width / 2 + (Math.random() - 0.5) * 400,
        y: height / 2 + (Math.random() - 0.5) * 300,
        resonance_level: Number(s.resonance_level) || 0.5,
        divergence_score: Number(s.divergence_score) || 0.3,
      }))

      const nodeMap = new Map(nodes.map((n) => [n.id, n]))
      let edges = (links || [])
        .map((l) => {
          const a = String(l.star_a ?? l.source ?? "")
          const b = String(l.star_b ?? l.target ?? "")
          if (!a || !b || !nodeMap.has(a) || !nodeMap.has(b)) return null
          return { source: a, target: b, strength: Math.max(0.1, Math.min(1, Number(l.total_strength) || 0.4)) }
        })
        .filter(Boolean)

      const avg = edges.length ? edges.reduce((s, e) => s + e.strength, 0) / edges.length : 0
      setDiag({ nodes: nodes.length, edges: edges.length, avg: avg.toFixed(2) })

      const color = d3.scaleLinear().domain([0, 1]).range(["#6ef7ff", "#ffb347"])
      const size = d3.scaleLinear().domain([0, 1]).range([14, 28])

      const linkSel = g.append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke", (d) => d.strength > 0.6 ? "rgba(255,170,80,0.8)" : "rgba(100,200,255,0.5)")
        .attr("stroke-width", (d) => 0.8 + 3 * d.strength)
        .attr("opacity", 0.3)
        .style("filter", "blur(2px)")

      const nodeG = g.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("cursor", "pointer")
        .on("click", (_, d) => onSelect?.(d))

      nodeG.append("circle")
        .attr("r", (d) => size(d.resonance_level) * 1.4)
        .attr("fill", (d) => color(d.resonance_level))
        .attr("opacity", 0.15)
        .style("filter", "blur(8px)")

      if (show.emojis) {
        nodeG.each(function (d) {
          const gNode = d3.select(this)
          const emojis = d.emojis?.slice(0, 3) || ["🌙", "💧", "❄️"]
          emojis.forEach((e, j) => {
            const angle = (j * (2 * Math.PI)) / emojis.length
            const x = Math.cos(angle) * 15
            const y = Math.sin(angle) * 15
            gNode.append("circle").attr("r", 10).attr("fill", "rgba(200,255,240,0.25)").attr("cx", x).attr("cy", y)
            gNode.append("text").attr("x", x).attr("y", y + 1).attr("text-anchor", "middle").attr("font-size", "18px").text(e)
          })
        })
      }

      if (show.titles) {
        nodeG.append("text")
          .attr("y", (d) => size(d.resonance_level) * 1.8)
          .attr("fill", "#fff")
          .attr("font-size", "12px")
          .attr("opacity", 0.85)
          .attr("text-anchor", "middle")
          .text((d) => d.title || "—")
      }

      if (show.authors) {
        nodeG.append("text")
          .attr("y", (d) => -size(d.resonance_level) * 1.8)
          .attr("fill", "rgba(255,255,255,0.6)")
          .attr("font-size", "10px")
          .attr("text-anchor", "middle")
          .text((d) => d.creator_name || "Anonyme")
      }

      simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(edges).id((d) => d.id).distance(120).strength(0.3))
        .force("charge", d3.forceManyBody().strength(-60))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(40))

      simulation.on("tick", () => {
        linkSel.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
               .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y)
        nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`)
      })

      // 🖐️ Drag interaction
      const drag = d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
          d3.select(event.sourceEvent.target)
            .attr("opacity", 0.9)
            .attr("stroke", "#fff")
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
          d3.select(event.sourceEvent.target)
            .attr("opacity", 0.7)
            .attr("stroke", "none")
        })

      nodeG.call(drag)
    }

    // -------------------------------------
    // 🌈 MODE 2 : Vue Émojis
    // -------------------------------------
    if (mode === "emojis") {
      const emojiCounts = new Map()
      const cooc = new Map()

      stars.forEach((s) => {
        const emojis = s.emojis || []
        emojis.forEach((e) => emojiCounts.set(e, (emojiCounts.get(e) || 0) + 1))
        for (let i = 0; i < emojis.length; i++) {
          for (let j = i + 1; j < emojis.length; j++) {
            const key = [emojis[i], emojis[j]].sort().join("—")
            cooc.set(key, (cooc.get(key) || 0) + 1)
          }
        }
      })

      const nodes = Array.from(emojiCounts, ([emoji, count]) => ({ id: emoji, count }))
      const edges = Array.from(cooc, ([pair, value]) => {
        const [a, b] = pair.split("—")
        return { source: a, target: b, strength: value }
      })

      const maxCount = Math.max(...nodes.map((n) => n.count), 1)
      const maxCooc = Math.max(...edges.map((e) => e.strength), 1)

      const color = d3.scaleSequential(d3.interpolateRainbow).domain([0, maxCount])
      const size = d3.scaleLinear().domain([1, maxCount]).range([8, 28])

      const linkSel = g.append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke", "rgba(180,220,255,0.6)")
        .attr("stroke-width", (d) => 1 + 3 * (d.strength / maxCooc))
        .attr("opacity", 0.5)

      const nodeG = g.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")

      nodeG.append("circle")
        .attr("r", (d) => size(d.count))
        .attr("fill", (d) => color(d.count))
        .attr("opacity", 0.8)
        .style("filter", "blur(4px)")

      nodeG.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", (d) => `${Math.min(30, 10 + d.count * 1.5)}px`)
        .text((d) => d.id)

      simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(edges).id((d) => d.id).distance(70).strength(0.4))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius((d) => size(d.count) + 4))

      simulation.on("tick", () => {
        linkSel.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
               .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y)
        nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`)
      })

      const drag = d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
          d3.select(event.sourceEvent.target)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
          d3.select(event.sourceEvent.target)
            .attr("stroke", "none")
        })

      nodeG.call(drag)
      setDiag({ nodes: nodes.length, edges: edges.length, avg: "—" })
    }

    return () => simulation?.stop()
  }, [stars, links, mode, show, onSelect])

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={ref}
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: "14px",
          cursor: transitioning ? "wait" : "grab",
          transition: "opacity 0.6s ease",
          boxShadow: "0 0 20px rgba(80,200,255,0.15)",
        }}
      />

      {/* 🎛️ Panneau latéral */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "rgba(0,20,40,0.75)",
          border: "1px solid rgba(80,200,255,0.3)",
          borderRadius: 10,
          padding: "0.8rem",
          fontSize: "0.85rem",
          color: "#bff",
          lineHeight: "1.3rem",
          backdropFilter: "blur(8px)",
        }}
      >
        <b>🌌 Affichage</b><br />
        <label><input type="radio" checked={mode === "stars"} onChange={() => setMode("stars")} /> Onimojis</label><br />
        <label><input type="radio" checked={mode === "emojis"} onChange={() => setMode("emojis")} /> Émojis</label>
        {mode === "stars" && (
          <>
            <hr style={{ border: "0.5px solid rgba(80,200,255,0.3)" }} />
            <b>🧭 Calques</b><br />
            {["titles", "authors", "emojis"].map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={show[key]}
                  onChange={(e) => setShow((s) => ({ ...s, [key]: e.target.checked }))}
                />{" "}
                {key === "titles" ? "Titres" : key === "authors" ? "Auteurs" : "Émojis"}
                <br />
              </label>
            ))}
          </>
        )}
      </div>

      {/* 📊 Statistiques */}
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
        }}
      >
        🌌 <b>{diag.nodes}</b> nœuds<br />
        🔗 <b>{diag.edges}</b> liens<br />
        ⚡ Résonance : <b>{diag.avg}</b>
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <MeteoOnirique />
      </div>
    </div>
  )
}