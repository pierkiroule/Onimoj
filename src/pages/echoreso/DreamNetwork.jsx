import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function DreamNetwork({ data, selectedWords, setSelectedWords }) {
  const svgRef = useRef(null)
  const [minWeight, setMinWeight] = useState(2)

  useEffect(() => {
    if (!data.length) return
    draw()
  }, [data, selectedWords, minWeight])

  function draw() {
    const width = 500, height = 500
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const freqMap = new Map()
    data.forEach((d) => freqMap.set(d.word, Number(d.freq) || 1))

    const links = []
    for (const d of data) {
      let lks = Array.isArray(d.links)
        ? d.links
        : JSON.parse(d.links || "[]")
      lks.forEach((l) => {
        if (l.weight >= minWeight)
          links.push({ source: d.word, target: l.target, weight: l.weight })
      })
    }

    const nodes = Array.from(freqMap.keys()).map((id) => ({
      id,
      freq: freqMap.get(id),
    }))

    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(nodes, (d) => d.freq))
      .range([6, 18])

    const colorScale = d3.scaleSequential(d3.interpolateCool)
      .domain(d3.extent(nodes, (d) => d.freq))

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(90))
      .force("charge", d3.forceManyBody().strength(-130))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "rgba(127,255,212,0.15)")

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => sizeScale(d.freq))
      .attr("fill", (d) =>
        selectedWords.includes(d.id) ? "#7fffd4" : colorScale(d.freq)
      )
      .style("cursor", "pointer")
      .on("click", (_, d) => toggleWord(d.id))

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.id)
      .attr("fill", "#e9fffd")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")

    sim.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
      label.attr("x", (d) => d.x).attr("y", (d) => d.y - 8)
    })
  }

  function toggleWord(word) {
    setSelectedWords((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word)
      if (prev.length >= 5) return prev // bloqué à 5
      return [...prev, word]
    })
  }

  return (
    <div style={{ textAlign: "center", marginTop: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.4rem", opacity: 0.8 }}>
        ⚡ Filtrer les liens : {minWeight}
      </label>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={minWeight}
        onChange={(e) => setMinWeight(Number(e.target.value))}
        style={{
          width: "80%",
          accentColor: "#7fffd4",
          marginBottom: "0.8rem",
        }}
      />
      <svg ref={svgRef} width="500" height="500"></svg>

      {selectedWords.length > 0 && (
        <p style={{ opacity: 0.8, marginTop: ".5rem" }}>
          {selectedWords.length} / 5 mots choisis
        </p>
      )}
      <div style={{ marginTop: ".4rem" }}>
        {selectedWords.map((w, i) => (
          <span
            key={i}
            style={{
              background: "rgba(127,255,212,0.15)",
              border: "1px solid rgba(127,255,212,0.4)",
              borderRadius: "20px",
              padding: ".2rem .7rem",
              color: "#e9fffd",
              margin: "0.2rem",
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}