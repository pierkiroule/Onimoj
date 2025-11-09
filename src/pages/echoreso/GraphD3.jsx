import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function GraphD3({ 
  data = [], 
  mode = "network", 
  onTap = () => {}, 
  onLongPress = () => {}, 
  selected = [] 
}) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data || !data.length) return
    drawGraph()
  }, [data, selected])

  function drawGraph() {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = window.innerWidth < 600 ? window.innerWidth - 20 : 600
    const height = window.innerHeight * 0.65
    svg.attr("viewBox", [0, 0, width, height])
       .style("background", "radial-gradient(circle at 50% 40%, #000914, #000)")
       .style("border-radius", "12px")

    // 🌐 Liens
    let links = []
    if (mode === "network") {
      data.forEach((d) => {
        try {
          const lks = Array.isArray(d.links)
            ? d.links
            : JSON.parse(d.links || "[]")
          lks.forEach((l) => {
            links.push({ source: d.id, target: l.target, weight: l.weight || 0.5 })
          })
        } catch {}
      })
    } else if (mode === "genealogy") {
      data.forEach((d) => {
        const genealogie = d.genealogie || {}
        if (genealogie.children)
          genealogie.children.forEach((c) =>
            links.push({ source: d.id, target: c.id, weight: c.strength || 0.5 })
          )
        if (genealogie.parents)
          genealogie.parents.forEach((p) =>
            links.push({ source: p.id, target: d.id, weight: p.strength || 0.5 })
          )
      })
    }

    // 🌟 Nœuds
    const nodes = data.map((d) => ({
      id: d.id,
      titre: d.titre,
      emoji: d.emoji || "✨",
      weight: d.weight || 1,
    }))

    const sizeScale = d3.scaleSqrt().domain([1, 10]).range([12, 30])

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked)

    const g = svg.append("g")

    // 🔗 Liens visuels
    const link = g.selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(127,255,212,0.15)")
      .attr("stroke-width", (d) => 1 + Math.sqrt(d.weight))

    // 🌙 Nœuds visuels
    const node = g.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => sizeScale(d.weight))
      .attr("fill", (d) =>
        selected.includes(d.id) ? "#7fffd4" : "rgba(127,255,212,0.5)"
      )
      .attr("stroke", (d) =>
        selected.includes(d.id) ? "#fff" : "rgba(255,255,255,0.2)"
      )
      .attr("stroke-width", (d) => (selected.includes(d.id) ? 2.5 : 1))
      .style("cursor", "pointer")

    // 🌟 Emoji / titre
    const label = g.selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.emoji)
      .attr("font-size", "22px")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("pointer-events", "none")

    // 🌀 Zoom + Drag
    const zoom = d3.zoom().scaleExtent([0.5, 3]).on("zoom", (e) => g.attr("transform", e.transform))
    svg.call(zoom)
    const drag = d3.drag()
      .on("start", (e, d) => {
        if (!e.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x; d.fy = d.y
      })
      .on("drag", (e, d) => {
        d.fx = e.x; d.fy = e.y
      })
      .on("end", (e, d) => {
        if (!e.active) sim.alphaTarget(0)
        d.fx = null; d.fy = null
      })
    node.call(drag)

    // 💫 Tap court / long
    let pressTimer
    node.on("mousedown touchstart", (event, d) => {
      pressTimer = setTimeout(() => onLongPress(d), 500)
    })
    node.on("mouseup touchend", (event, d) => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        onTap(d)
      }
    })

    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
      label.attr("x", (d) => d.x).attr("y", (d) => d.y)
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "1rem auto" }}>
      <svg ref={svgRef} width="100%" height="480" />
    </div>
  )
}