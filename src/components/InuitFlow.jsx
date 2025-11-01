import { useEffect, useState } from "react"
import HublotResonant from "./HublotResonant"
import { supabase } from "../supabaseClient"
import { askNebius } from "../nebiusClient"
import { inuitSteps as localInuitSteps } from "../data/inuitSteps"
import "./InuitFlow.css"

export default function InuitFlow({ userId }) {
  const [steps, setSteps] = useState(localInuitSteps)
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState("intro")
  const [dream, setDream] = useState("")
  const [generatingDream, setGeneratingDream] = useState(false)
  const [drawnWords, setDrawnWords] = useState([])
  const [loadingFlow, setLoadingFlow] = useState(true)
  const [error, setError] = useState("")
  const [usingFallback, setUsingFallback] = useState(true)
  const [mission, setMission] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState("")

  useEffect(() => {
    if (!userId) {
      setLoadingFlow(false)
      setUsingFallback(true)
      return
    }

    let cancelled = false

    async function bootstrap() {
      setLoadingFlow(true)
      setError("")
      setSyncStatus("")

      try {
        const missionRow = await fetchOrCreateMission(userId)
        if (cancelled) return

        setMission(missionRow)

        const supabaseSteps = await loadMissionSteps()
        if (cancelled) return

        if (supabaseSteps.length) {
          setSteps(supabaseSteps)
          setUsingFallback(false)
          const idx = supabaseSteps.findIndex(
            (s) => s.step_number === missionRow?.current_step
          )
          setStepIndex(idx >= 0 ? idx : 0)
        } else {
          setSteps(localInuitSteps)
          setUsingFallback(true)
          setStepIndex(0)
        }

        setPhase("intro")
        setDream("")
        setDrawnWords([])
      } catch (err) {
        console.error("?? InuitFlow Supabase:", err)
        if (!cancelled) {
          setError(err.message || "Supabase indisponible. Passage en mode local.")
          setMission(null)
          setSteps(localInuitSteps)
          setUsingFallback(true)
          setStepIndex(0)
          setPhase("intro")
          setDream("")
          setDrawnWords([])
        }
      } finally {
        if (!cancelled) setLoadingFlow(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [userId])

  const step = steps[stepIndex]

  if (loadingFlow) {
    return (
      <div className="flow fade-in" style={{ opacity: 0.8 }}>
        <p>?? Connexion ? Supabase en cours...</p>
      </div>
    )
  }

  if (!step) {
    return (
      <div className="flow fade-in" style={{ textAlign: "center" }}>
        <h2>?? Mission termin?e</h2>
        <p style={{ opacity: 0.8 }}>
          Ton souffle a travers? les {steps.length} esprits du Grand Nord.
        </p>
        {syncStatus && (
          <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>{syncStatus}</p>
        )}
      </div>
    )
  }

  async function generateDream() {
    setGeneratingDream(true)
    const tags =
      drawnWords?.map((w) => w.fr).join(", ") ||
      "vent, mer, glace, souffle, silence"

    const promptLines = [
      `Raconte un r?ve inuit au pr?sent, inspir? de l?esprit ${step.spirit_name} (${step.symbol}).`,
      `Inspire-toi aussi de ces mots : ${tags}.`,
      "D?cris des sensations, des sons, des gestes, des ?l?ments naturels.",
      "Utilise un style po?tique, sensoriel, sobre et apais?.",
      "Ne cr?e pas de mots invent?s.",
    ]

    try {
      const text = await askNebius(promptLines.join("\n"), {
        model: "google/gemma-2-9b-it-fast",
        temperature: 0.8,
      })
      setDream(text)
    } catch (err) {
      console.error("?? Erreur g?n?ration r?ve:", err)
      setDream("")
    } finally {
      setGeneratingDream(false)
    }
  }

  function goBackToIntro(nextIndex) {
    setDream("")
    setDrawnWords([])
    setPhase("intro")
    setStepIndex(nextIndex)
  }

  async function handleNextStep() {
    const nextIndex = stepIndex + 1
    goBackToIntro(nextIndex)
    await syncMissionProgress(nextIndex)
  }

  async function syncMissionProgress(nextIndex) {
    if (!mission?.id) return
    setSyncing(true)
    setSyncStatus("?? Synchronisation Supabase?")

    try {
      const total = steps.length
      const completed = Math.min(nextIndex, total)
      const nextStepNumber =
        steps[nextIndex]?.step_number ||
        steps.at(-1)?.step_number ||
        mission.current_step ||
        1

      const payload = {
        current_step: nextStepNumber,
        progress: completed,
        status: completed >= total ? "completed" : "active",
      }

      const { error: updateError } = await supabase
        .from("missions")
        .update(payload)
        .eq("id", mission.id)

      if (updateError) throw updateError

      setMission((prev) => (prev ? { ...prev, ...payload } : prev))
      setSyncStatus(
        payload.status === "completed"
          ? "?? Mission compl?te synchronis?e"
          : `? ?tape ${payload.current_step}/${total} synchronis?e`
      )
    } catch (err) {
      console.error("?? Erreur de synchronisation Supabase:", err)
      setSyncStatus("?? Synchronisation impossible ? mode local")
      setError((prev) => prev || "Progression non synchronis?e (Supabase indisponible)")
    } finally {
      setSyncing(false)
    }
  }

  const renderStatus = () => {
    if (error) {
      return (
        <p style={{ color: "#ff9a8b", fontSize: "0.9rem", marginBottom: "1rem" }}>
          ?? {error}
        </p>
      )
    }
    if (usingFallback) {
      return (
        <p style={{ color: "#ffaa33", fontSize: "0.85rem", marginBottom: "1rem" }}>
          ?? Mode local : donn?es Supabase non synchronis?es.
        </p>
      )
    }
    return (
      <p style={{ color: "#7fffd4", fontSize: "0.9rem", marginBottom: "1rem" }}>
        ?tape {step.step_number}/{steps.length}
        {syncing && " ? ??"}
      </p>
    )
  }

  return (
    <div className="flow fade-in">
      {renderStatus()}

      <h2>
        {step.symbol} {step.spirit_name}
      </h2>
      <h3>{step.title}</h3>

      {syncStatus && !syncing && (
        <p style={{ fontSize: "0.8rem", opacity: 0.65, marginTop: "-0.5rem" }}>{syncStatus}</p>
      )}

      {phase === "intro" && (
        <>
          <p>{step.text}</p>
          <button onClick={() => setPhase("ritual")}>? Continuer</button>
        </>
      )}

      {phase === "ritual" && (
        <>
          <blockquote>{step.ritual}</blockquote>
          <button onClick={() => setPhase("quiz")}>??? ?nigme</button>
        </>
      )}

      {phase === "quiz" && step.quiz && (
        <Quiz quiz={step.quiz} onNext={() => setPhase("hublot")} />
      )}

      {phase === "quiz" && !step.quiz && (
        <div className="quiz fade-in">
          <p style={{ opacity: 0.75 }}>? Quiz non disponible pour cette ?tape.</p>
          <button onClick={() => setPhase("hublot")}>Continuer</button>
        </div>
      )}

      {phase === "hublot" && (
        <HublotResonant
          step={step}
          userId={userId}
          onComplete={(words) => {
            setDrawnWords(Array.isArray(words) ? words : [])
            setPhase("dream")
          }}
        />
      )}

      {phase === "dream" && (
        <>
          <button onClick={generateDream} disabled={generatingDream}>
            {generatingDream ? "?? Inspiration..." : "?? G?n?rer la graine OnimojIA"}
          </button>
          {dream && (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                textAlign: "center",
                lineHeight: "1.5",
                marginTop: "1rem",
              }}
            >
              {dream}
            </pre>
          )}
          <button onClick={handleNextStep}>? Esprit suivant</button>
        </>
      )}
    </div>
  )
}

function Quiz({ quiz, onNext }) {
  const [answer, setAnswer] = useState(null)

  const options = Array.isArray(quiz?.options)
    ? quiz.options
    : Array.isArray(quiz?.choices)
    ? quiz.choices
    : []

  const correctIndex =
    typeof quiz?.correct === "number"
      ? quiz.correct
      : typeof quiz?.correct_index === "number"
      ? quiz.correct_index
      : 0

  if (!quiz?.question || options.length === 0) {
    return (
      <div className="quiz fade-in">
        <p style={{ opacity: 0.7 }}>? Quiz indisponible.</p>
        <button onClick={onNext}>Continuer</button>
      </div>
    )
  }

  return (
    <div className="quiz fade-in">
      <p>{quiz.question}</p>
      {options.map((opt, i) => (
        <button key={i} onClick={() => setAnswer(i)}>
          {opt}
        </button>
      ))}
      {answer !== null && (
        <>
          <p>{answer === correctIndex ? "? Bonne r?ponse" : "? Essaie encore"}</p>
          {answer === correctIndex && <button onClick={onNext}>?? Continuer</button>}
        </>
      )}
    </div>
  )
}

async function fetchOrCreateMission(userId) {
  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", userId)
    .eq("culture", "Inuite")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== "PGRST116") throw error
  if (data) return data

  const { data: inserted, error: insertError } = await supabase
    .from("missions")
    .insert([
      {
        user_id: userId,
        culture: "Inuite",
        status: "active",
        progress: 0,
        current_step: 1,
      },
    ])
    .select("*")
    .single()

  if (insertError) throw insertError
  return inserted
}

async function loadMissionSteps() {
  const { data, error } = await supabase
    .from("mission_steps_inuite")
    .select("*")
    .order("step_number", { ascending: true })

  if (error) throw error
  if (!Array.isArray(data)) return []

  return data.map(normalizeStep)
}

function normalizeStep(step) {
  let quiz = step?.quiz
  if (typeof quiz === "string") {
    try {
      quiz = JSON.parse(quiz)
    } catch {
      quiz = null
    }
  }

  if (!quiz && (step?.question || step?.options)) {
    quiz = {
      question: step.question,
      options: step.options || step.choices || [],
      correct: step.correct ?? step.correct_index ?? 0,
    }
  }

  return {
    ...step,
    text: step.text || step.description || step.content || "",
    ritual: step.ritual || step.practice || "",
    quiz,
  }
}
