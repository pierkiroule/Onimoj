import { useEffect, useRef, useState } from "react"
import { supabase } from "../supabaseClient"
import DreamPulseSpirit from "./DreamPulseSpirit"
import * as d3 from "d3"

export default function SpiritGraphModal({ spirit, onClose }) {
  const svgRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 🔄 Chargement + nettoyage
  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true)
        setError(null)

        let query = supabase.from("onimoji_network_view").select("*")
        if (spirit.spirit_name !== "Global")
          query = query.eq("spirit", spirit.spirit_name)

        const { data, error } = await query
        if (error) throw error
        if (!data?.length) {
          setNodes([])
          setLinks([])
          setError("Aucune donnée trouvée")
          return
        }

        // 🧹 Nettoyage anti-null
        const cleanData = data.filter((r) => r.word && Array.isArray(r.co_words))

        const nodeMap = new Map()
        const linkList = []

        cleanData.forEach((row) => {
          const main = row.word.trim()
          const val = Number(row.count) || 1
          nodeMap.set(main, { id: main, value: val })

          row.co_words
            .filter((cw) => cw && typeof cw === "string")
            .forEach((cw) => {
              const target = cw.trim()
              if (!nodeMap.has(target))
                nodeMap.set(target, { id: target, value: 1 })
              linkList.push({
                source: main,
                target,
                weight: Number(row.weight) || 0.3,
              })
            })
        })

        setNodes(Array.from(nodeMap.values()))
        setLinks(linkList)
      } catch (err) {
        console.error("⚠️ Erreur réseau :", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadGraph()
  }, [spirit])

  // 🪐 Rendu D3
  useEffect(() => {
    if (!nodes.length || !links.length) return
    try {
      const svg = d3.select(svgRef.current)
      svg.selectAll("*").remove()

      const W = 360,
        H = 360
      const size = d3.scaleLinear().domain(d3.extent(nodes, (d) => d.value)).range([8, 28])
      const opacity = d3.scaleLinear().domain(d3.extent(links, (d) => d.weight)).range([0.2, 0.9])
      const color = d3.scaleSequential(d3.interpolateCool)

      const sim = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id).distance(80))
        .force("charge", d3.forceManyBody().strength(-120))
        .force("center", d3.forceCenter(W / 2, H / 2))
        .force("collision", d3.forceCollide().radius((d) => size(d.value)))

      const link = svg
        .append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#7fffd4")
        .attr("stroke-opacity", (d) => opacity(d.weight))
        .attr("stroke-width", (d) => 1 + d.weight * 3)
        .style("filter", "drop-shadow(0 0 6px rgba(127,255,212,0.4))")

      const node = svg
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", (d) => size(d.value))
        .attr("fill", (d, i) => color(i / nodes.length))
        .style("filter", "drop-shadow(0 0 10px rgba(127,255,212,0.4))")

      const label = svg
        .append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .text((d) => d.id)
        .attr("font-size", "11px")
        .attr("fill", "#e9fffd")
        .attr("text-anchor", "middle")

      sim.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)
        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
        label.attr("x", (d) => d.x).attr("y", (d) => d.y - size(d.value) - 2)
      })

      return () => sim.stop()
    } catch (err) {
      console.error("💥 Erreur D3 →", err)
      setError("Erreur graphique D3")
    }
  }, [nodes, links])

  // 🧠 Rendu final
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <DreamPulseSpirit spirit={spirit} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <h3 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>
          {spirit?.spirit_name === "Global"
            ? "🌐 Réseau collectif"
            : `${spirit?.symbol || "✨"} ${spirit?.spirit_name}`}
        </h3>

        {loading && <p style={{ color: "#aaa" }}>⏳ Chargement...</p>}
        {error && <p style={{ color: "#ff8080" }}>⚠️ {error}</p>}
        {!loading && !error && (
          <svg
            ref={svgRef}
            viewBox="0 0 360 360"
            style={{
              width: "360px",
              height: "360px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.7), #000)",
              boxShadow: "0 0 25px rgba(127,255,212,0.3)",
            }}
          />
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            padding: "0.4rem 1rem",
            border: "1px solid #7fffd4",
            borderRadius: "8px",
            background: "transparent",
            color: "#7fffd4",
            cursor: "pointer",
          }}
        >
          ✨ Fermer
        </button>
      </div>
    </div>
  )
}