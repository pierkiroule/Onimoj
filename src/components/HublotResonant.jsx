import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { inuitNodes, inuitLinks } from "../data/InuitNetwork"
import "./HublotResonant.css"

export default function HublotResonant({
  culture = "Inuite",
  step = {},
  onComplete,
}) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState("")

  useEffect(() => {
    const width = 300
    const height = 300
    const radiusLimit = 120
    const nodes = inuitNodes.map((n) => ({ ...n }))
    const links = inuitLinks.map((l) => ({ ...l }))

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    svg
      .attr("viewBox", [0, 0, width, height])
      .style("background", "radial-gradient(circle at 50% 50%, #0a141c, #000)")
      .style("border-radius", "50%")
      .style("box-shadow", "0 0 24px rgba(127,255,212,0.25)")

    const defs = svg.append("defs")
    const glow = defs.append("filter").attr("id", "glow")
    glow.append("feGaussianBlur").attr("stdDeviation", 2).attr("result", "blur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "blur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(65))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(22))

    const link = svg
      .append("g")
      .attr("stroke", "#7fffd4")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")

    const nodeG = svg
      .append("g")
      .selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => toggleSelect(d.id))

    nodeG
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d) => color(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.2)
      .attr("filter", "url(#glow)")

    nodeG
      .append("text")
      .text((d) => d.emoji || "✨")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 16)
      .attr("y", 1)

    nodeG
      .append("text")
      .text((d) => d.label || "")
      .attr("text-anchor", "middle")
      .attr("font-size", 9)
      .attr("fill", "#cfe")
      .attr("y", 26)

    simulation.on("tick", () => {
      nodeG.attr("transform", (d) => {
        const dx = d.x - width / 2
        const dy = d.y - height / 2
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > radiusLimit) {
          const ratio = radiusLimit / dist
          d.x = width / 2 + dx * ratio
          d.y = height / 2 + dy * ratio
        }
        return `translate(${d.x},${d.y})`
      })
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
    })

    return () => simulation.stop()
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("g.node").each(function (d) {
      const g = d3.select(this)
      const isSel = selected.includes(d.id)
      g.select("circle")
        .transition()
        .duration(120)
        .attr("r", isSel ? 24 : 20)
        .attr("stroke-width", isSel ? 3 : 1.2)
        .attr("stroke", isSel ? "#7fffd4" : "#fff")
    })
  }, [selected])

  function toggleSelect(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length < 3) return [...prev, id]
      return prev
    })
  }

  function handleValidate() {
    if (selected.length !== 3) {
      setStatus("🪶 Choisis 3 bulles.")
      return
    }
    const chosen = inuitNodes.filter((n) => selected.includes(n.id))
    const emojis = chosen.map((n) => n.emoji || "✨")

    const payload = {
      culture,
      spirit: step.spirit_name,
      emojis,
      step_number: step.step_number,
    }
    setStatus("🌟 Résonance créée.")
    setTimeout(() => onComplete?.(payload), 1000)
  }

  return (
    <div className="hublot-inline fade-in">
      <h3>🌌 Hublot résonant – {step.spirit_name}</h3>
      <p className="subtitle">Choisis 3 bulles pour clore ton voyage intérieur.</p>
      <svg ref={svgRef} width="300" height="300" />
      <div className="hublot__selected">
        {selected.map((id) => {
          const n = inuitNodes.find((x) => x.id === id)
          return (
            <span key={id} className="hublot__chip">
              {n?.emoji || "✨"}
            </span>
          )
        })}
      </div>
      <button className="hublot__validate-btn" onClick={handleValidate}>
        🌬️ Valider (3)
      </button>
      {status && <p className="hublot__status">{status}</p>}
    </div>
  )
}