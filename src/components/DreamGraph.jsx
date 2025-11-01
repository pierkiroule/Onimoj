// src/components/DreamGraph.jsx
import { useEffect, useRef } from "react"
import * as d3 from "d3"
import "./DreamGraph.css"

export default function DreamGraph({ nodes = [], currentUserId, dreamFriend }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!nodes.length) return
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()

    const width = 320
    const height = 320

    const links = nodes.flatMap((n) =>
      (n.links || []).map((l) => ({
        source: n.user_id,
        target: l.target_id,
        strength: l.strength,
      }))
    )

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.user_id).distance(100))
      .force("charge", d3.forceManyBody().strength(-80))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svg
      .append("g")
      .attr("stroke", "rgba(127,255,212,0.4)")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => 1 + d.strength * 3)

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => 8 + d.activity)
      .attr("fill", (d) =>
        d.user_id === currentUserId
          ? "#7fffd4"
          : dreamFriend && d.user_id === dreamFriend.dreamfriend_id
          ? "#ffcc66"
          : "#1e3340"
      )
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "10px")
      .attr("fill", "#e9fffd")
      .attr("text-anchor", "middle")
      .text((d) => d.username || "🜂")

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)

      node
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)

      label
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y - 12)
    })

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }
    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }
  }, [nodes, dreamFriend])

  return <svg ref={ref} width="100%" height="320" />
}