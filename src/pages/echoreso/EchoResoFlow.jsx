// src/pages/echoreso/EchoResoFlow.jsx
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { supabase } from "../../supabaseClient"
import StarPreview from "../../components/StarPreview"
import dreamsLocal from "../../data/dreamsLocal.json"

export default function EchoResoFlow({ userId }) {
  const svgRef = useRef(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    loadGraph()
    return () => d3.select(svgRef.current).selectAll("*").remove()
  }, [])

  async function loadGraph() {
    try {
      const { data: dreams, error } = await supabase
        .from("dreams")
        .select("id, titre, contenu, tags, vitality, image_url, visible, echo_count, echo_max")
        .eq("visible", true)
        .limit(50)

      if (error || !dreams?.length) throw new Error("Supabase offline")
      drawGraph(dreams)
    } catch {
      console.warn("⚠️ Supabase indisponible – mode local activé.")
      setOffline(true)
      drawGraph(dreamsLocal)
    }
  }

  function intersect(a = [], b = []) {
    return a.filter(t => b.includes(t))
  }

  function drawGraph(dreams) {
    const width = window.innerWidth
    const height = window.innerHeight * 0.72
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const zoomGroup = svg.append("g")

    // === Filtre Glow
    const defs = svg.append("defs")
    const glow = defs.append("filter").attr("id", "glow")
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "blur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // === Liens (affinités de tags)
    const links = []
    for (let i = 0; i < dreams.length; i++) {
      for (let j = i + 1; j < dreams.length; j++) {
        const shared = intersect(dreams[i].tags, dreams[j].tags)
        if (shared.length > 0) {
          links.push({
            source: dreams[i].id,
            target: dreams[j].id,
            weight: shared.length,
            sharedTag: shared[0],
          })
        }
      }
    }

    const maxWeight = d3.max(links, d => d.weight) || 1

    const colorScale = d3.scaleOrdinal()
      .domain(["eau", "lumière", "vent", "terre", "musique", "étoile", "souvenir", "or", "calme", "mystère"])
      .range(["#7fffd4", "#ffe38e", "#8fd1ff", "#a0ffb1", "#ffadf5", "#fff6e0", "#ffccaa", "#ffd46b", "#d6f5f2", "#b5d0ff"])

    const sim = d3.forceSimulation(dreams)
      .force("link", d3.forceLink(links).id(d => d.id).distance(120).strength(0.25))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => 30 + (d.vitality || 0.5) * 10))

    // === Liens lumineux animés
    const link = zoomGroup.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", d => colorScale(d.sharedTag) || "rgba(127,255,212,0.3)")
      .attr("stroke-width", d => 0.5 + (d.weight / maxWeight) * 3)
      .attr("stroke-linecap", "round")
      .style("filter", "url(#glow)")
      .attr("opacity", d => 0.4 + (d.weight / maxWeight) * 0.6)
      .attr("stroke-dasharray", "4 8")
      .attr("stroke-dashoffset", 0)

    function animateLinks() {
      link.transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 60)
        .on("end", () => {
          link.attr("stroke-dashoffset", 0)
          animateLinks()
        })
    }
    animateLinks()

    // === Nœuds
    const nodeGroup = zoomGroup.selectAll("g.dream")
      .data(dreams)
      .enter()
      .append("g")
      .attr("class", "dream")
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedNode(d))

    // Halo pulsant
    const halo = nodeGroup.append("circle")
      .attr("r", d => 35 + (d.vitality || 0.5) * 10)
      .attr("fill", "none")
      .attr("stroke", "rgba(127,255,212,0.15)")
      .attr("stroke-width", 10)
      .style("filter", "url(#glow)")
      .style("pointer-events", "none")

    function pulse() {
      halo.transition()
        .duration(4000)
        .ease(d3.easeSinInOut)
        .attr("stroke-width", 14)
        .attr("opacity", 0.25)
        .transition()
        .duration(4000)
        .attr("stroke-width", 10)
        .attr("opacity", 0.15)
        .on("end", pulse)
    }
    pulse()

    // Corps du nœud
    nodeGroup.append("circle")
      .attr("r", d => 25 + (d.vitality || 0.5) * 10)
      .attr("fill", d => {
        const progress = (d.echo_count || 0) / (d.echo_max || 6)
        return progress < 1 ? "rgba(127,255,212,0.1)" : "rgba(255,230,150,0.2)"
      })
      .attr("stroke", d =>
        (d.echo_count || 0) >= (d.echo_max || 6)
          ? "rgba(255,230,150,0.8)"
          : "rgba(127,255,212,0.7)"
      )
      .attr("stroke-width", 1.4)
      .style("filter", "url(#glow)")

    // Image
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

    // Drag fluide
    nodeGroup.call(
      d3.drag()
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

    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    // Zoom / Pan
    svg.call(
      d3.zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", e => zoomGroup.attr("transform", e.transform))
    )
  }

  // === Modale de rêve (avec Ricochets)
  function DreamModal({ node, onClose }) {
  const [echoText, setEchoText] = useState("")
  const [echoes, setEchoes] = useState([])

  useEffect(() => {
    if (offline) return
    loadEchoes()
  }, [node.id])

  async function loadEchoes() {
    try {
      const { data } = await supabase
        .from("dream_echoes")
        .select("id, content, created_at")
        .eq("dream_id", node.id)
        .order("created_at", { ascending: false })
      setEchoes(data || [])
    } catch {
      console.warn("⚠️ Lecture échos en mode local désactivée")
    }
  }

  async function addEcho() {
    if (offline || !echoText.trim()) return

    try {
      const { data: dream, error: dreamErr } = await supabase
        .from("dreams")
        .select("id, echo_max, (SELECT COUNT(*) FROM dream_echoes WHERE dream_id = dreams.id) as echo_count")
        .eq("id", node.id)
        .single()

      if (dreamErr || !dream) {
        console.error("Erreur de lecture du rêve :", dreamErr)
        alert("⚠️ Impossible de vérifier l’état du rêve.")
        return
      }

      const currentCount = parseInt(dream.echo_count || 0)
      const maxEcho = parseInt(dream.echo_max || 6)

      if (currentCount >= maxEcho) {
        playMetamorphoseSound()
        alert("🌕 Ce rêve s’est métamorphosé en Sagesse Onirique.")
        return
      }

      const { error: insertErr } = await supabase.from("dream_echoes").insert({
        dream_id: node.id,
        user_id: userId || null,
        content: echoText.trim(),
      })

      if (insertErr) {
        console.error("Erreur ajout écho :", insertErr)
        alert("❌ Impossible d’envoyer ton écho.")
        return
      }

      setEchoText("")
      await loadEchoes()

      const newCount = currentCount + 1
      if (newCount >= maxEcho) {
        await supabase.from("dreams").update({ visible: false }).eq("id", node.id)
        playMetamorphoseSound()
        alert("🌕 Ce rêve a atteint ses 6 échos et devient une Sagesse Onirique collective !")
      }
    } catch (err) {
      console.error("Erreur addEcho :", err)
      alert("Erreur inattendue pendant l’envoi de ton écho.")
    }
  }

  function playMetamorphoseSound() {
    const audio = new Audio("/assets/sounds/halo-metamorphose.mp3")
    audio.volume = 0.4
    audio.play().catch(() => {})
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
        <StarPreview
          words={node.tags || []}
          centerEmoji="⭐"
          echoCount={node.echo_count || 0}
          echoMax={node.echo_max || 6}
        />
        <p style={{ marginTop: ".6rem", fontSize: ".9rem", color: "#aefcf5", opacity: 0.85 }}>
          🔁 {node.echo_count || 0} / {node.echo_max || 6} échos collectés
        </p>
        <p style={{ marginTop: ".8rem", opacity: 0.9 }}>{node.contenu}</p>

        {!offline && (
          <>
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
            <button
              onClick={addEcho}
              style={{
                marginTop: ".6rem",
                background: "rgba(127,255,212,0.2)",
                border: "1px solid rgba(127,255,212,0.4)",
                borderRadius: "8px",
                padding: ".4rem .8rem",
                color: "#7fffd4",
                cursor: "pointer",
              }}
            >
              🪶 Envoyer ton écho•°
            </button>
          </>
        )}

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
                <br />
                {e.content}
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
        boxShadow: "inset 0 0 60px rgba(127,255,212,0.05)",
        paddingBottom: "4.5rem",
      }}
    >
      <svg ref={svgRef} width="100%" height="72vh" style={{ display: "block", cursor: "grab" }} />
      {selectedNode && (
        <DreamModal node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
      {offline && (
        <div
          style={{
            position: "absolute",
            bottom: ".6rem",
            right: ".8rem",
            fontSize: ".8rem",
            color: "#ffcc66",
            opacity: 0.8,
          }}
        >
          ⚠️ Mode local actif
        </div>
      )}
    </div>
  )
}