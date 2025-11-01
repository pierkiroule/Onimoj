import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { inuitNodes, inuitLinks } from "../data/InuitNetwork"
import { askNebius } from "../nebiusClient"
import StarCardDream from "./StarCardDream"
import "./HublotResonant.css"

export default function HublotResonant({
  culture = "Inuite",
  step = {},
  userId,
  onComplete
}) {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const [showStar, setShowStar] = useState(false)
  const [dreamText, setDreamText] = useState("")
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  // === Réseau D3 ===
  useEffect(() => {
    const width = 320, height = 320
    const nodes = inuitNodes.map(n => ({ ...n }))
    const links = inuitLinks.map(l => ({ ...l }))
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    svg
      .attr("viewBox", [0, 0, width, height])
      .style("background", "radial-gradient(circle at 50% 50%, #041018, #000)")
      .style("border-radius", "50%")
      .style("box-shadow", "0 0 24px rgba(127,255,212,0.25)")

    const grad = svg.append("defs")
      .append("linearGradient")
      .attr("id", "auroraGradient")
      .attr("x1", "0%").attr("x2", "100%")
      .attr("y1", "0%").attr("y2", "100%")
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#7fffd4")
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#9ae7ff")

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(70))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const linkSel = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "url(#auroraGradient)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.6)

    const nodeG = svg.append("g")
      .selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (_e, d) => {
        setSelected(d.id)
        setSelectedEmoji(d.emoji)
        setSaved(false)
        setDreamText("")
      })

    nodeG.append("circle")
      .attr("r", 20)
      .attr("fill", "transparent")
      .attr("stroke", "#7fffd4")

    nodeG.append("text")
      .text(d => d.emoji || "✨")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 20)
      .attr("fill", "#eaffff")

    simulation.on("tick", () => {
      linkSel
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      nodeG.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()
  }, [])

  // === Étape 1 : choisir une bulle ===
  function handleValidate() {
    if (!selectedEmoji) return alert("🌬️ Choisis une bulle avant de révéler ton étoile.")
    if (!userId) return alert("⚠️ Connecte-toi pour sauvegarder ton étoile.")
    setShowStar(true)
  }

  // === Étape 2 : générer la graine IA ===
  async function handleGenerateDream() {
    setGenerating(true)
    try {
      const prompt = `Écris un court rêve inuit de 6 lignes, au présent, inspiré de l’emoji ${selectedEmoji} et du thème ${step.title}.
Fais des phrases sensorielles, poétiques, simples, comme des images mentales.`
      const text = await askNebius(prompt, {
        model: "google/gemma-2-2b-it",
        temperature: 0.8
      })
      setDreamText(text)
    } catch (err) {
      console.error("⚠️ Erreur Nebius :", err)
    } finally {
      setGenerating(false)
    }
  }

  // === Étape 3 : affichage après sauvegarde ===
  if (showStar && selectedEmoji) {
    return (
      <div className="hublot-inline fade-in">
        <StarCardDream
          userId={userId}
          emoji={selectedEmoji}
          culture={culture}
          spirit={step.spirit_name}
          step_number={step.step_number}
          onSaved={() => setSaved(true)}
        />

        {saved && (
          <div className="dream-generator-zone fade-in">
            <button
              id="generateDreamBtn"
              className="hublot__validate-btn pulse"
              onClick={handleGenerateDream}
              disabled={generating}
            >
              {generating ? "⏳ Graine en germination..." : "🌱 Générer la graine OnimojIA"}
            </button>

            {dreamText && (
              <div className="dream-text fade-in">
                <h4>🌕 Rêve germé :</h4>
                <p style={{ whiteSpace: "pre-line" }}>{dreamText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // === Étape initiale ===
  return (
    <div className="hublot-inline fade-in">
      <h3>🌌 Hublot résonant – {step.spirit_name}</h3>
      <p className="subtitle">Choisis une bulle pour révéler ton étoile.</p>
      <svg ref={svgRef} width="320" height="320" />
      {selectedEmoji && (
        <div className="hublot__selected">
          <span style={{ fontSize: "2rem" }}>{selectedEmoji}</span>
        </div>
      )}
      <button className="hublot__validate-btn" onClick={handleValidate}>
        🌟 Révéler l’étoile
      </button>
    </div>
  )
}