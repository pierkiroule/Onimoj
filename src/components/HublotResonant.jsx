import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { inuitNodes, inuitLinks } from "../data/InuitNetwork" // => { id, emoji, label?, group? }
import "./HublotResonant.css"

export default function HublotResonant({ culture = "Inuite", userId, step = {}, onComplete }) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState([])
  const [status, setStatus] = useState("")

  // ---- build graph once
  useEffect(() => {
    const width = 320
    const height = 320
    const nodes = inuitNodes.map(n => ({ ...n }))
    const links = inuitLinks.map(l => ({ ...l }))

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "hublot__svg")
      .style("touch-action", "none")
      .style("background", "radial-gradient(circle at 50% 50%, #08121a, #000)")
      .style("border-radius", "50%")
      .style("box-shadow", "0 0 36px rgba(127,255,212,0.25)")

    // soft glow filter
    const defs = svg.append("defs")
    const glow = defs.append("filter").attr("id", "glow")
    glow.append("feGaussianBlur").attr("stdDeviation", 2.2).attr("result", "coloredBlur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))

    // links
    const link = svg.append("g")
      .attr("stroke", "#7fffd4")
      .attr("stroke-opacity", 0.22)
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links)
      .join("line")

    // nodes as <g> (circle + emoji)
    const nodeG = svg.append("g")
      .selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => { event.preventDefault(); toggleSelect(d.id) })
      .on("touchstart", (event, d) => { event.preventDefault(); toggleSelect(d.id) })
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )

    nodeG.append("circle")
      .attr("r", 22)
      .attr("fill", d => color(d.group))
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)")

    // emoji text
    nodeG.append("text")
      .text(d => d.emoji || "✨")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 18)
      .attr("y", 1) // léger centrage optique

    // (facultatif) petit label sous la bulle
    nodeG.append("text")
      .text(d => d.label || "")
      .attr("text-anchor", "middle")
      .attr("font-size", 9.5)
      .attr("fill", "#dfe")
      .attr("y", 28)
      .attr("opacity", 0.9)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      nodeG.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }
    function dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    }
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => simulation.stop()
  }, [])

  // ---- visual update when selected changes
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("g.node").each(function (d) {
      const g = d3.select(this)
      const isSel = selected.includes(d.id)
      g.select("circle")
        .transition().duration(120)
        .attr("r", isSel ? 26 : 22)
        .attr("stroke-width", isSel ? 3 : 1.5)
        .attr("fill-opacity", isSel ? 1 : 0.85)
      g.select("text") // the emoji (first text)
        .attr("font-size", isSel ? 20 : 18)
    })
  }, [selected])

  function toggleSelect(id) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(s => s !== id)
      if (prev.length < 3) return [...prev, id]
      return prev
    })
  }

  function handleValidate() {
    if (selected.length !== 3) {
      setStatus("🪶 Choisis 3 bulles.")
      return
    }
    const chosen = inuitNodes.filter(n => selected.includes(n.id))
    const emojis = chosen.map(n => n.emoji || "✨")

    const payload = {
      title: `${culture} — ${step.spirit_name || "Bulle mythonirique"}`,
      emojis,
      culture,
      spirit: step.spirit_name || "",
      step_number: step.step_number || 1,
    }
    setStatus("🌟 Bulle mythonirique prête !")
    onComplete?.(payload)
  }

  return (
    <div className="hublot">
      <h3>🌌 Hublot résonant</h3>
      <p className="hublot__subtitle">Sélectionne 3 bulles (tap).</p>

      <svg ref={svgRef} width="320" height="320" />

      {/* sélection en cours */}
      <div className="hublot__selected">
        {selected.map((id) => {
          const n = inuitNodes.find(x => x.id === id)
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