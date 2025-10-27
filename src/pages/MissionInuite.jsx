import { useEffect, useState } from "react"
import StepEngine from "../components/StepEngine"
import "./MissionInuite.css"

export default function MissionInuite() {
  const [mission, setMission] = useState(null)
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMission() {
      try {
        setLoading(true)
        setError("")
        console.log("📖 Lecture du fichier mission.json...")

        const res = await fetch("/data/missions/inuite/mission.json")
        if (!res.ok) throw new Error("Mission introuvable.")
        const missionData = await res.json()
        console.log("✅ Mission trouvée :", missionData.title)

        // Charge toutes les étapes depuis le bon dossier
        const stepPromises = missionData.steps.map(async (s) => {
          const filePath = `/data/missions/inuite/${s.file}`
          const r = await fetch(filePath)
          if (!r.ok) throw new Error(`Fichier manquant : ${filePath}`)
          return await r.json()
        })
        const stepData = await Promise.all(stepPromises)

        setMission(missionData)
        setSteps(stepData)
      } catch (err) {
        console.error("⚠️ Erreur mission :", err)
        setError("Impossible de charger la mission locale.")
      } finally {
        setLoading(false)
      }
    }

    loadMission()
  }, [])

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40vh" }}>🌘 Chargement du rêve…</p>

  if (error)
    return <p style={{ color: "#ff8080", textAlign: "center", marginTop: "40vh" }}>{error}</p>

  if (!steps.length)
    return <p style={{ textAlign: "center", marginTop: "40vh" }}>Aucune étape trouvée.</p>

  return (
    <div className="mission-inuite fade-in">
      <h2 style={{ textAlign: "center", color: mission.color }}>{mission.title}</h2>
      <p style={{ textAlign: "center", opacity: 0.8, marginTop: "-0.5rem" }}>
        {mission.description}
      </p>
      <StepEngine steps={steps} />
    </div>
  )
}