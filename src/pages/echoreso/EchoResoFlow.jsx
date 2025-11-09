import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { supabase } from "../../supabaseClient"
import StarPreview from "../../components/StarPreview"

export default function EchoResoFlow({ userId }) {
  const svgRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    loadGraph()
    return () => d3.select(svgRef.current).selectAll("*").remove()
  }, [])

  async function loadGraph() {
    try {
      const { data: dreams } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, vitality, image_url, visible")
        .eq("visible", true)
        .limit(40)

      if (!dreams?.length) return

      const links = []
      for (let i = 0; i < dreams.length; i++) {
        for (let j = i + 1; j < dreams.length; j++) {
          const shared = intersect(dreams[i].tags, dreams[j].tags)
          if (shared.length > 0) {
            links.push({
              source: dreams[i].id,
              target: dreams[j].id,
              weight: shared.length,
            })
          }
        }
      }

      drawGraph(dreams, links)
    } catch (e) {
      console.error("⚠️ Erreur chargement réseau :", e)
    }
  }

  function intersect(a = [], b = []) {
    return a.filter(t => b.includes(t))
  }

  function drawGraph(dreams, links) {
    const width = window.innerWidth < 700 ? 360 : 720
    const height = window.innerHeight * 0.8
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    const zoomGroup = svg.append("g")

    const sim = d3.forceSimulation(dreams)
      .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(120)
        .strength(l => 0.1 + Math.min(0.4, l.weight * 0.15)))
      .force("charge", d3.forceManyBody().strength(-240))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => 30 + (d.vitality || 0.5) * 10))

    const link = zoomGroup.append("g")
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", d => 0.5 + d.weight)
      .attr("stroke", "rgba(127,255,212,0.25)")

    const nodeGroup = zoomGroup.selectAll("g.dream")
      .data(dreams)
      .enter()
      .append("g")
      .attr("class", "dream")
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedNode(d))

    const circles = nodeGroup.append("circle")
      .attr("r", d => 25 + (d.vitality || 0.5) * 10)
      .attr("fill", "rgba(127,255,212,0.08)")
      .attr("stroke", "rgba(127,255,212,0.5)")
      .attr("stroke-width", 1.2)

    nodeGroup.append("image")
      .attr("xlink:href", d => d.image_url || "/assets/placeholder-dream.png")
      .attr("width", d => 45 + (d.vitality || 0.5) * 15)
      .attr("height", d => 45 + (d.vitality || 0.5) * 15)
      .attr("x", d => -(22 + (d.vitality || 0.5) * 8))
      .attr("y", d => -(22 + (d.vitality || 0.5) * 8))
      .attr("clip-path", "circle(50%)")

    nodeGroup.append("text")
      .text(d => (d.titre || "Sans titre").slice(0, 14))
      .attr("font-size", 11)
      .attr("fill", "#aefcf5")
      .attr("text-anchor", "middle")
      .attr("y", 36)

    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    svg.call(
      d3.zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", e => zoomGroup.attr("transform", e.transform))
    )
  }

  // === Modale connectée Supabase ===
  function DreamModal({ node, onClose }) {
    const [echoText, setEchoText] = useState("")
    const [echoes, setEchoes] = useState([])

    useEffect(() => {
      loadEchoes()
    }, [node.id])

    async function loadEchoes() {
      const { data, error } = await supabase
        .from("dream_echoes")
        .select("id, content, created_at")
        .eq("dream_id", node.id)
        .order("created_at", { ascending: false })
      if (!error && data) setEchoes(data)
    }

    async function addEcho() {
      if (!echoText.trim()) return
      const { error } = await supabase.from("dream_echoes").insert({
        dream_id: node.id,
        user_id: userId || null,
        content: echoText.trim(),
      })
      if (!error) {
        setEchoText("")
        loadEchoes()
      }
    }

    const btn = {
      marginTop: "1rem",
      background: "rgba(127,255,212,0.2)",
      border: "1px solid rgba(127,255,212,0.4)",
      borderRadius: "8px",
      padding: ".4rem .8rem",
      color: "#7fffd4",
      cursor: "pointer",
    }

    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "rgba(0,30,40,0.95)",
            border: "1px solid rgba(127,255,212,0.4)",
            borderRadius: "12px",
            padding: "1rem",
            textAlign: "center",
            color: "#e9fffd",
            width: "90%",
            maxWidth: 420,
            boxShadow: "0 0 20px rgba(127,255,212,0.3)",
          }}
        >
          {node.image_url && (
            <img
              src={node.image_url}
              alt={node.titre}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: ".5rem",
                boxShadow: "0 0 15px rgba(127,255,212,0.3)",
              }}
            />
          )}
          <h3>⭐ {node.titre}</h3>
          <StarPreview words={node.tags || []} centerEmoji="⭐" />
          <p style={{ marginTop: ".8rem", opacity: 0.9 }}>{node.contenu}</p>

          <div style={{ marginTop: "1rem", textAlign: "left" }}>
            <p style={{ opacity: 0.8, fontSize: ".9rem", marginBottom: ".4rem" }}>
              <b>Écrire un écho•°</b> — dépose quelques mots spontanés : sensations, images,
              souvenirs, associations libres. Le rêve devient un réseau de ressources vivantes.
            </p>
            <textarea
              rows={3}
              placeholder="Quelques mots, une phrase, un souffle…"
              value={echoText}
              onChange={e => setEchoText(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid rgba(127,255,212,0.3)",
                background: "rgba(0,20,25,0.5)",
                borderRadius: "8px",
                padding: ".5rem",
                color: "#e9fffd",
                fontFamily: "inherit",
              }}
            />
            <button onClick={addEcho} style={btn}>🪶 Envoyer ton écho•°</button>
          </div>

          {echoes.length > 0 && (
            <div style={{ marginTop: "1rem", maxHeight: "160px", overflowY: "auto" }}>
              {echoes.map(e => (
                <div
                  key={e.id}
                  style={{
                    background: "rgba(0,30,40,0.5)",
                    border: "1px solid rgba(127,255,212,0.2)",
                    borderRadius: "8px",
                    padding: ".4rem",
                    marginBottom: ".4rem",
                    fontSize: ".85rem",
                  }}
                >
                  <span style={{ opacity: 0.7, fontSize: ".75rem" }}>
                    {new Date(e.created_at).toLocaleString("fr-FR")}
                  </span>
                  <br />{e.content}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: "relative",
        background: "radial-gradient(circle at 50% 50%, #001820, #000710 90%)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <svg ref={svgRef} width="100%" height="80vh" />
      {selectedNode && (
        <DreamModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  )
}