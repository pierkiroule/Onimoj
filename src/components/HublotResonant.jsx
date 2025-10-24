import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { inuitNodes, inuitLinks } from "../data/InuitNetwork"
import "./HublotResonant.css"

export default function HublotResonant({
  culture = "Inuite",
  userId,
  step = {},
  onComplete,
}) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState("")

  useEffect(() => {
    const width = 320
    const height = 320
    const radiusLimit = 130
    const nodes = inuitNodes.map((n) => ({ ...n }))
    const links = inuitLinks.map((l) => ({ ...l }))

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "hublot__svg")
      .style("touch-action", "none")
      .style(
        "background",
        "radial-gradient(circle at 50% 50%, #08121a, #000)"
      )
      .style("border-radius", "50%")
      .style("overflow", "hidden")
      .style("box-shadow", "0 0 36px rgba(127,255,212,0.25)")

    const defs = svg.append("defs")
    const glow = defs.append("filter").attr("id", "glow")
    glow
      .append("feGaussianBlur")
      .attr("stdDeviation", 2.2)
      .attr("result", "coloredBlur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(65))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(25))

    const link = svg
      .append("g")
      .attr("stroke", "#7fffd4")
      .attr("stroke-opacity", 0.22)
      .attr("stroke-width", 1)
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
      .on("click touchstart", (event, d) => {
        event.preventDefault()
        toggleSelect(d.id)
      })

    nodeG
      .append("circle")
      .attr("r", 22)
      .attr("fill", (d) => color(d.group))
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)")

    nodeG
      .append("text")
      .text((d) => d.emoji || "✨")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 18)
      .attr("y", 1)

    nodeG
      .append("text")
      .text((d) => d.label || "")
      .attr("text-anchor", "middle")
      .attr("font-size", 9.5)
      .attr("fill", "#dfe")
      .attr("y", 28)
      .attr("opacity", 0.9)

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

  // animation / update selection
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("g.node").each(function (d) {
      const g = d3.select(this)
      const isSel = selected.includes(d.id)
      g.select("circle")
        .transition()
        .duration(120)
        .attr("r", isSel ? 26 : 22)
        .attr("stroke-width", isSel ? 3 : 1.5)
        .attr("fill-opacity", isSel ? 1 : 0.8)
        .attr("stroke", isSel ? "#7fffd4" : "#fff")
      g.select("text")
        .transition()
        .duration(120)
        .attr("font-size", isSel ? 20 : 18)
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
      title: `${culture} — ${step.spirit_name || "Bulle mythonirique"}`,
      emojis,
      culture,
      spirit: step.spirit_name || "",
      step_number: step.step_number || 1,
    }
    setStatus("🌟 Bulle prête à être tissée !")
    onComplete?.(payload)
  }

  return (
    <div className="hublot">
      <h3>🌌 Hublot résonant</h3>
      <p className="hublot__subtitle">Sélectionne 3 bulles pour créer ta résonance.</p>

      <svg ref={svgRef} width="320" height="320" />

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
        Valider (3)
      </button>

      {status && <p className="hublot__status">{status}</p>}
    </div>
  )
}