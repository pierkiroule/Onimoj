import { useEffect, useState } from "react"
import HublotResonant from "../components/HublotResonant"
import "./MissionInuitePlayer.css"

export default function MissionInuitePlayer() {
  const [mission, setMission] = useState(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [stepData, setStepData] = useState(null)
  const [showHublot, setShowHublot] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  // 🔎 Paramètres URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const i = parseInt(params.get("i"))
    const etape = params.get("etape")

    if (!isNaN(i)) setStepIndex(i)
    else if (etape && mission) {
      const idx = mission.steps.findIndex((s) =>
        s.file.toLowerCase().includes(etape.toLowerCase())
      )
      if (idx >= 0) setStepIndex(idx)
    }
  }, [mission])

  // 🌐 Charge la mission principale
  useEffect(() => {
    async function loadMission() {
      try {
        const res = await fetch("/data/missions/inuite/mission.json")
        if (!res.ok) throw new Error("Mission non trouvée")
        const data = await res.json()
        setMission(data)
      } catch (err) {
        console.error("⚠️ Erreur mission :", err)
      }
    }
    loadMission()
  }, [])

  // 📜 Charge une étape
  useEffect(() => {
    if (!mission) return
    const stepFile = mission.steps[stepIndex]?.file
    if (!stepFile) return

    async function loadStep() {
      try {
        // ✅ correction du chemin relatif
        const res = await fetch(`/data/missions/inuite/${stepFile}`)
        if (!res.ok) throw new Error(`Fichier manquant : ${stepFile}`)
        const data = await res.json()
        setStepData(data)
        setQuizAnswer(null)
        setQuizResult(null)
      } catch (err) {
        console.error("⚠️ Erreur étape :", err)
      }
    }
    loadStep()

    // 🌀 mise à jour URL
    const slug = stepFile.split("/").pop().replace(".json", "")
    const url = new URL(window.location)
    url.searchParams.set("i", stepIndex)
    url.searchParams.set("etape", slug)
    window.history.replaceState({}, "", url)
  }, [mission, stepIndex])

  // 🧭 Navigation
  const next = () => {
    if (stepIndex + 1 < mission.steps.length) setStepIndex(stepIndex + 1)
    else setShowHublot(true)
  }
  const prev = () => stepIndex > 0 && setStepIndex(stepIndex - 1)

  const checkQuiz = (correct) => {
    if (quizAnswer === null) return
    setQuizResult(quizAnswer === correct)
  }

  if (!mission || !stepData)
    return <p className="loading">🌘 Connexion au rêve arctique...</p>

  // 🌠 Hublot final
  if (showHublot)
    return (
      <HublotResonant
        culture={mission.culture}
        step={stepData}
        onClose={() => setShowHublot(false)}
        onComplete={(payload) => console.log("✨ Résonance créée :", payload)}
      />
    )

  return (
    <div className="mission-player fade-in">
      <h2 className="mission-title" style={{ color: mission.color }}>
        {mission.title}
      </h2>
      <h3 className="mission-step">
        Étape {stepData.step_number} — {stepData.spirit_name} {stepData.symbol}
      </h3>

      {stepData.activities.map((a, i) => (
        <div key={i} className="activity-card">
          {a.type === "text" && (
            <div
              className="activity-text"
              dangerouslySetInnerHTML={{ __html: a.content }}
            />
          )}
          {a.type === "image" && (
            <div className="activity-image">
              <img
                src={a.url}
                alt={a.caption || ""}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 0 12px rgba(127,255,212,0.25)",
                }}
              />
              {a.caption && <p className="caption">{a.caption}</p>}
            </div>
          )}
          {a.type === "video" && (
            <div className="activity-video">
              <video
                src={a.url}
                controls
                preload="metadata"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 0 12px rgba(127,255,212,0.25)",
                }}
              />
              {a.caption && <p className="caption">{a.caption}</p>}
            </div>
          )}
          {a.type === "ritual" && (
            <div className="activity-ritual">
              <div dangerouslySetInnerHTML={{ __html: a.content }} />
              {a.sound && (
                <audio
                  controls
                  src={a.sound}
                  style={{ marginTop: "0.6rem", width: "100%" }}
                />
              )}
            </div>
          )}
          {a.type === "quiz" && (
            <div className="activity-quiz">
              <p>{a.question}</p>
              {a.options.map((opt, j) => (
                <button
                  key={j}
                  className={`quiz-btn ${
                    quizAnswer === j
                      ? quizResult === null
                        ? "selected"
                        : j === a.correct
                        ? "correct"
                        : "wrong"
                      : ""
                  }`}
                  onClick={() => {
                    setQuizAnswer(j)
                    setTimeout(() => checkQuiz(a.correct), 300)
                  }}
                >
                  {opt}
                </button>
              ))}
              {quizResult !== null && (
                <p className="quiz-result">
                  {quizResult ? "✅ Juste !" : "❌ Essaie encore."}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* navigation */}
      <div className="nav-buttons">
        {stepIndex > 0 && (
          <button onClick={prev} className="btn-secondary">
            ← Précédent
          </button>
        )}
        <button onClick={next} className="btn-primary">
          {stepIndex + 1 < mission.steps.length
            ? "Suivant →"
            : "✨ Ouvrir le Hublot"}
        </button>
      </div>
    </div>
  )
}