import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function DreamPulseSpirit() {
  const svgRef = useRef()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 360
    const height = 360
    const n = 50

    // 🌌 Dégradé radial
    const gradient = svg.append("defs").append("radialGradient").attr("id", "gradPulse")
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "rgba(127,255,212,0.25)")
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "rgba(0,0,0,0.95)")

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#gradPulse)")

    // 💫 Particules flottantes
    const particles = d3.range(n).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.3,
    }))

    const nodes = svg
      .selectAll("circle")
      .data(particles)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", "#7fffd4")
      .attr("opacity", (d) => d.opacity)
      .style("filter", "blur(1.5px)")

    d3.timer(() => {
      nodes
        .attr("cx", (d) => {
          d.x += d.dx
          if (d.x < 0 || d.x > width) d.dx *= -1
          return d.x
        })
        .attr("cy", (d) => {
          d.y += d.dy
          if (d.y < 0 || d.y > height) d.dy *= -1
          return d.y
        })
    })
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* 🎞️ Vidéo unique Sila.mp4 */}
      <video
        src="/assets/video/Sila.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.25,
          mixBlendMode: "screen",
          filter: "blur(2px) brightness(1.1)",
        }}
      />

      {/* 🌌 Calque D3 */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </div>
  )
}