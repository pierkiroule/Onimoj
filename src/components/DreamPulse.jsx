import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function DreamPulse({ activity = 5, tags = [], images = [] }) {
  const svgRef = useRef()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = window.innerWidth
    const height = 320
    const n = 40 + activity * 6

    // 🌌 Dégradé dynamique
    const gradient = svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "dreamGradient")
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(127,255,212,0.15)")
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(0,0,0,0.95)")

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#dreamGradient)")

    // 💫 Particules flottantes
    const particles = d3.range(n).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.5 + 0.2,
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
      .style("filter", "blur(2px)")

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

    // 🫧 Mots flottants
    const wordGroup = svg.append("g")
    const wordElems = wordGroup
      .selectAll("text")
      .data(tags.slice(0, 6))
      .join("text")
      .attr("x", () => Math.random() * width)
      .attr("y", () => Math.random() * height)
      .attr("font-size", "18px")
      .attr("fill", "#e9fffd")
      .attr("opacity", 0.25)
      .text((d) => d)

    wordElems
      .transition()
      .duration(12000)
      .ease(d3.easeSinInOut)
      .attr("opacity", 0.8)
      .attr("y", (d, i) => height / 2 + Math.sin(i) * 90)
      .transition()
      .duration(9000)
      .attr("opacity", 0.2)
  }, [activity, tags])

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "320px",
        overflow: "hidden",
        borderRadius: "12px",
        marginTop: "2rem",
        boxShadow: "0 0 20px rgba(127,255,212,0.3)",
      }}
    >
      {/* 🎞️ Vidéo de fond — Hypnonirique */}
      <video
        src="/assets/video/Sil.mp4"
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
          transition: "opacity 2s ease-in-out",
        }}
      />

      {/* 🌌 Calque D3 (particules + mots) */}
      <svg
        ref={svgRef}
        width="100%"
        height="320"
        style={{
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* ✨ Images flottantes (optionnelles) */}
      {images?.slice(0, 2).map((img, i) => (
        <img
          key={i}
          src={img}
          alt="vision"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.15 + i * 0.05,
            animation: `fade${i} ${20 + i * 10}s ease-in-out infinite alternate`,
            mixBlendMode: "lighten",
            zIndex: 1,
          }}
        />
      ))}

      <style>
        {`
          @keyframes fade0 { from {opacity: 0.05;} to {opacity: 0.25;} }
          @keyframes fade1 { from {opacity: 0.1;} to {opacity: 0.35;} }
        `}
      </style>
    </div>
  )
}