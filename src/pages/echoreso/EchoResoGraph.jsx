import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { supabase } from "../../supabaseClient"

export default function EchoResoGraph({ userId, onSelectParents }) {
  const [dreams, setDreams] = useState([])
  const [links, setLinks] = useState([])
  const [selected, setSelected] = useState([])
  const [showCard, setShowCard] = useState(null)
  const svgRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: nodes, error: e1 } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, image_url, visible, vitality")
        .eq("visible", true)
      if (e1) throw e1

      const { data: rels, error: e2 } = await supabase
        .from("v_resonance_auto")
        .select("source_dream_id, target_dream_id, strength")
      if (e2) throw e2

      const mappedLinks = (rels || []).map(l => ({
        source: l.source_dream_id,
        target: l.target_dream_id,
        strength: l.strength || 0.5,
      }))

      setDreams(nodes || [])
      setLinks(mappedLinks)
      drawGraph(nodes || [], mappedLinks)
    } catch (err) {
      console.error("⚠️ Erreur chargement réseau :", err)
    }
  }

  function drawGraph(nodes, rels) {
    const width = window.innerWidth < 700 ? 360 : 700
    const height = window.innerWidth < 700 ? 360 : 700
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // conteneur zoomable
    const zoomGroup = svg.append("g")

    // zoom et drag global
    svg.call(
      d3.zoom()
        .scaleExtent([0.5, 3])
        .on("zoom", e => zoomGroup.attr("transform", e.transform))
    )

    // halo doux
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "url(#bg)")
    const defs = svg.append("defs")
    const grad = defs.append("radialGradient")
      .attr("id", "bg")
      .attr("cx", "50%")
      .attr("cy", "40%")
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#012a33")
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#000")

    // simulation physique
    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(rels).id(d => d.id).distance(130).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(25))

    // liens
    const link = zoomGroup
      .append("g")
      .attr("stroke", "rgba(127,255,212,0.15)")
      .selectAll("line")
      .data(rels)
      .enter()
      .append("line")
      .attr("stroke-width", d => d.strength * 2)
      .attr("stroke-linecap", "round")

    // noeuds
    const node = zoomGroup
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", d => 10 + (d.vitality || 0.5) * 4)
      .attr("fill", d => (selected.includes(d.id) ? "#7fffd4" : "#39b7a2"))
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 1.4)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 0 6px rgba(127,255,212,0.3))")
      .each(function (d) {
        let pressTimer
        d3.select(this)
          .on("mousedown touchstart", () => {
            pressTimer = setTimeout(() => handleLongPress(d), 500)
          })
          .on("mouseup touchend", () => clearTimeout(pressTimer))
          .on("click", () => handleClick(d))
      })
      .call(
        d3
          .drag()
          .on("start", (e, d) => {
            if (!e.active) sim.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          })
          .on("drag", (e, d) => {
            d.fx = e.x
            d.fy = e.y
          })
          .on("end", (e, d) => {
            if (!e.active) sim.alphaTarget(0)
            d.fx = null
            d.fy = null
          })
      )

    // étiquettes
    const label = zoomGroup
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => (d.titre || "✨").slice(0, 12))
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(220,255,245,0.9)")
      .attr("pointer-events", "none")

    // animation continue
    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      node.attr("cx", d => d.x).attr("cy", d => d.y)
      label.attr("x", d => d.x).attr("y", d => d.y - 14)
    })
  }

  // court clic → carte
  function handleClick(d) {
    setShowCard(d)
  }

  // long clic → sélection
  function handleLongPress(d) {
    setSelected(prev => {
      let next
      if (prev.includes(d.id)) next = prev.filter(id => id !== d.id)
      else if (prev.length < 2) next = [...prev, d.id]
      else next = prev
      onSelectParents && onSelectParents(next)
      return next
    })
  }

  return (
    <div>
      <svg
        ref={svgRef}
        width="100%"
        height={window.innerWidth < 700 ? 360 : 700}
        style={{
          background: "radial-gradient(circle at 50% 40%, #001015, #000)",
          borderRadius: "14px",
          boxShadow: "0 0 25px rgba(127,255,212,0.15)",
        }}
      ></svg>

      {/* MODALE FICHE RÊVE */}
      {showCard && (
        <div
          onClick={() => setShowCard(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "rgba(0,30,40,0.9)",
              border: "1px solid rgba(127,255,212,0.3)",
              borderRadius: "16px",
              padding: "1rem",
              color: "#e9fffd",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(127,255,212,0.3)",
              animation: "fadeIn .4s ease",
            }}
          >
            {showCard.image_url && (
              <img
                src={showCard.image_url}
                alt={showCard.titre}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: ".6rem",
                  boxShadow: "0 0 12px rgba(127,255,212,0.25)",
                }}
              />
            )}
            <h3 style={{ marginBottom: ".4rem", color: "#7fffd4" }}>{showCard.titre}</h3>
            <p style={{ fontSize: ".85rem", opacity: 0.85, whiteSpace: "pre-line" }}>
              {showCard.contenu?.slice(0, 200)}...
            </p>
            <div style={{ marginTop: ".5rem", display: "flex", flexWrap: "wrap", gap: ".3rem", justifyContent: "center" }}>
              {showCard.tags?.map((t, i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(127,255,212,0.15)",
                    border: "1px solid rgba(127,255,212,0.3)",
                    borderRadius: "14px",
                    padding: ".2rem .6rem",
                    fontSize: ".75rem",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}