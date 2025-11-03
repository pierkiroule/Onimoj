import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function MiniResonanceGraph({ spirit }) {
  const ref = useRef()

  useEffect(() => {
    const width = 260
    const height = 260
    const radius = 110
    const color = "#7fffd4"

    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()

    const container = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // 🧭 Zoom + pan limité
    const zoom = d3.zoom()
      .scaleExtent([0.8, 2])
      .on("zoom", (event) => {
        container.attr("transform", `translate(${width / 2},${height / 2}) scale(${event.transform.k})`)
      })

    svg.call(zoom)

    // ⚙️ Simulation D3 confinée dans le cercle
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(d => d.word).distance(45))
      .force("charge", d3.forceManyBody().strength(-50))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(d => 10 + d.weight * 15))

    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/onimoji_network_view?spirit=eq.${spirit}`, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.length) return

        const nodes = data.map(d => ({
          id: d.word,
          weight: d.weight || 0.5,
          count: d.count || 1,
          x: (Math.random() - 0.5) * radius,
          y: (Math.random() - 0.5) * radius
        }))

        const links = []
        data.forEach(d => {
          if (d.co_words) {
            JSON.parse(d.co_words).forEach(cw => {
              if (cw.weight > 0.25) {
                links.push({
                  source: d.word,
                  target: cw.target,
                  value: cw.weight
                })
              }
            })
          }
        })

        const link = container
          .selectAll(".link")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke", color)
          .attr("stroke-opacity", d => 0.25 + d.value)
          .attr("stroke-width", d => 0.5 + d.value * 2)

        const node = container
          .selectAll(".node")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", d => 3 + d.weight * 6)
          .attr("fill", color)
          .attr("fill-opacity", 0.6)
          .attr("stroke", "#e9fffd")
          .attr("stroke-width", 0.4)

        const label = container
          .selectAll(".label")
          .data(nodes)
          .enter()
          .append("text")
          .text(d => d.id)
          .attr("font-size", "8px")
          .attr("fill", "#e9fffd")
          .attr("text-anchor", "middle")
          .attr("dy", -8)

        simulation.nodes(nodes).on("tick", ticked)
        simulation.force("link").links(links)

        function ticked() {
          nodes.forEach(d => {
            const dist = Math.sqrt(d.x ** 2 + d.y ** 2)
            if (dist > radius) {
              const k = radius / dist
              d.x *= k
              d.y *= k
            }
          })

          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

          node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

          label
            .attr("x", d => d.x)
            .attr("y", d => d.y - 8)
        }
      })
      .catch(err => console.error("⚠️ Erreur graph:", err))
  }, [spirit])

  return (
    <svg
      ref={ref}
      width="260"
      height="260"
      style={{
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 50%, #010a0e, #000)",
        boxShadow: "0 0 25px rgba(127,255,212,0.4)",
        margin: "0 auto",
        display: "block",
        overflow: "hidden"
      }}
    />
  )
}