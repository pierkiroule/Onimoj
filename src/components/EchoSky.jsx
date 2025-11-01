import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { supabase } from "../supabaseClient"

export default function EchoSky({ currentUserId, onSelect }) {
  const ref = useRef()
  const [users, setUsers] = useState([])
  const [links, setLinks] = useState([])
  const [status, setStatus] = useState("🌌 Connexion au réseau onirique…")

  // === Charger tous les utilisateurs et les DreamFriends reliés ===
  useEffect(() => {
    async function load() {
      try {
        const { data: profiles, error: pErr } = await supabase
          .from("profiles")
          .select("user_id, username")

        if (pErr) throw pErr

        const { data: relations, error: rErr } = await supabase
          .from("view_dreamfriends")
          .select("*")

        if (rErr) throw rErr

        const nodes = (profiles || []).map((u) => ({
          id: u.user_id,
          name: u.username || "Anonyme",
        }))

        setUsers(nodes)
        setLinks(relations || [])
        setStatus(`🌠 Réseau des Âmes Résonantes (${nodes.length})`)
      } catch (err) {
        console.error("⚠️ Erreur chargement réseau :", err)
        setStatus("⚠️ Erreur de connexion au réseau.")
      }
    }
    load()
  }, [])

  // === Rendu du graphe D3 ===
  useEffect(() => {
    if (!users.length) return
    const svg = d3.select(ref.current)
    svg.selectAll("*").remove()

    const width = window.innerWidth
    const height = window.innerHeight * 0.7
    svg.attr("width", width).attr("height", height)

    const color = d3.scaleLinear().domain([0, 1]).range(["#7fffd4", "#ffd47f"])
    const size = d3.scaleLinear().domain([0, 1]).range([18, 34])

    // Map rapide
    const userMap = new Map(users.map((n) => [n.id, n]))

    // === Liens seulement pour currentUser ===
    const edges = (links || [])
    .filter((l) => l.resonance_strength > 0)
      .map((l) => ({
        source: l.user_a,
        target: l.user_b,
        weight: Number(l.resonance_strength),
      }))

    const dreamfriendIds = edges.map((e) =>
      e.source === currentUserId ? e.target : e.source
    )

    // === Simulation D3 ===
    const simulation = d3
      .forceSimulation(users)
      .force("link", d3.forceLink(edges).id((d) => d.id).distance(180).strength(0.25))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(45))

    const g = svg.append("g")
    svg.call(d3.zoom().scaleExtent([0.5, 3]).on("zoom", (e) => g.attr("transform", e.transform)))

    // === Liens visibles ===
    g.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "rgba(127,255,212,0.35)")
      .attr("stroke-width", (d) => 1 + d.weight * 3)
      .attr("opacity", 0.5)

    // === Étoiles (users) ===
    const nodeG = g
      .selectAll("g.node")
      .data(users)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        onSelect?.({ id: d.id, name: d.name })
      })

    // Étoile ☆
    nodeG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", (d) =>
        d.id === currentUserId ? 36 : size(Math.random() * 0.6 + 0.4)
      )
      .attr("fill", (d) =>
        d.id === currentUserId
          ? "#ffb6c1"
          : dreamfriendIds.includes(d.id)
          ? "#aaffff"
          : "#557777"
      )
      .attr("opacity", (d) =>
        d.id === currentUserId || dreamfriendIds.includes(d.id) ? 1 : 0.35
      )
      .text("☆")

    // Nom du user
    nodeG
      .append("text")
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("fill", "#eaffff")
      .attr("opacity", (d) =>
        d.id === currentUserId || dreamfriendIds.includes(d.id) ? 1 : 0.3
      )
      .text((d) => d.name)

    // Animation
    simulation.on("tick", () => {
      g.selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()
  }, [users, links, currentUserId, onSelect])

  return (
    <div style={{ textAlign: "center", color: "#7fffd4" }}>
      <h3>{status}</h3>
      <svg ref={ref} />
    </div>
  )
}