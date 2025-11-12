import React, { useState, useEffect } from "react"
import { inuitSteps } from "../data/inuitSteps"
import Step1Circle from "../steps/Step1Circle"
import Step2Hublot from "../steps/Step2Hublot"
import Step3Creation from "../steps/Step3Creation"
import "./OnimojiJourney.css"

/**
 * 🌌 Voyage onirique modulaire (3 étapes)
 */
export default function OnimojiJourney({ userId }) {
  const [step, setStep] = useState(1)
  const [selectedSpirit, setSelectedSpirit] = useState(null)
  const [awakened, setAwakened] = useState([])
  const [quizPassed, setQuizPassed] = useState(false)
  const [tags, setTags] = useState([])

  // 🕒 Timer local 12h
  const [remaining, setRemaining] = useState(0)
  const DELAY = 12 * 60 * 60 * 1000
  const isDev =
    import.meta.env.DEV ||
    (typeof window !== "undefined" &&
      ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(window.location.hostname))

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isDev && localStorage.getItem("devCooldownOff") === "true") {
      setRemaining(0)
      return
    }

    const last = parseInt(localStorage.getItem("lastDreamTime") || "0")
    const diff = DELAY - (Date.now() - last)
    if (diff > 0) setRemaining(diff)
    else setRemaining(0)
  }, [isDev])

  useEffect(() => {
    if (!remaining) return
    const t = setInterval(() => setRemaining((r) => (r > 1000 ? r - 1000 : 0)), 1000)
    return () => clearInterval(t)
  }, [remaining])

  function format(ms) {
    const s = Math.floor(ms / 1000)
    const h = String(Math.floor(s / 3600)).padStart(2, "0")
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
    const sec = String(s % 60).padStart(2, "0")
    return `${h}:${m}:${sec}`
  }

  // 🌬️ Sélection d’un gardien
  function handleSpiritCall() {
    const all = inuitSteps.map((s) => s.step_number)
    const remainingSteps = all.filter((n) => !awakened.includes(n))
    const pool = remainingSteps.length ? remainingSteps : all
    const pickNum = pool[Math.floor(Math.random() * pool.length)]
    const pick = inuitSteps.find((s) => s.step_number === pickNum)
    setSelectedSpirit(pick)
    setQuizPassed(false)
  }

  // 🌀 Réinitialisation locale
  function handleResetMission() {
    if (!confirm("Réinitialiser toute la mission Inuite ?")) return
    setAwakened([])
    setSelectedSpirit(null)
    setTags([])
    setQuizPassed(false)
    setStep(1)
    localStorage.removeItem("lastDreamTime")
    setRemaining(0)
  }

  // 🌕 Blocage 12h après sauvegarde
  function handleDreamSaved() {
    if (
      isDev &&
      typeof window !== "undefined" &&
      localStorage.getItem("devCooldownOff") === "true"
    ) {
      localStorage.removeItem("lastDreamTime")
      setRemaining(0)
    } else {
      const now = Date.now()
      localStorage.setItem("lastDreamTime", now.toString())
      setRemaining(DELAY)
    }
    setStep(1)
    setSelectedSpirit(null)
    setTags([])
  }

  // ——— 🜂 ÉTAPE 0 : RÊVE EN SOMMEIL ———
  if (remaining > 0 && step === 1 && !selectedSpirit) {
    const progress = ((DELAY - remaining) / DELAY) * 100
    return (
      <div className="fade-in" style={{ textAlign: "center", color: "#e9fffd", padding: "2rem" }}>
        <h2 style={{ color: "#7fffd4" }}>🌕 Le rêve dort encore…</h2>
        <p>Le prochain gardien te contactera dans :</p>
        <h3 style={{ color: "#aefcf5" }}>{format(remaining)}</h3>
        <div
          style={{
            width: "80%",
            height: "12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.1)",
            margin: "1rem auto",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg,#7fffd4,#6a5acd)",
              transition: "width 1s linear",
            }}
          />
        </div>
        <p style={{ fontSize: ".9rem", opacity: 0.7 }}>Respire. Le rêve infuse encore…</p>
      </div>
    )
  }

  // ——— 🌙 ÉTAPE 1 : CERCLE DES GARDIENS ———
  if (step === 1) {
    return (
      <Step1Circle
        awakenedSteps={awakened}
        selectedSpirit={selectedSpirit}
        onSpiritSelect={(s) => {
          setSelectedSpirit(s)
          setQuizPassed(false)
        }}
        onSpiritCall={handleSpiritCall}
        onContinue={() => setStep(2)}
        quizPassed={quizPassed}
        setQuizPassed={setQuizPassed}
        onReset={handleResetMission}
        isDev={isDev}
      />
    )
  }

  // ——— 🔮 ÉTAPE 2 : HUBLOT ———
  if (step === 2 && selectedSpirit) {
    return (
      <Step2Hublot
        spirit={selectedSpirit}
        onComplete={({ tags }) => {
          setTags(tags || [])
          setStep(3)
        }}
        onBack={() => setStep(1)}
      />
    )
  }

  // ——— 🌟 ÉTAPE 3 : CRÉATION DU RÊVE ———
  if (step === 3 && selectedSpirit) {
    return (
      <Step3Creation
        spirit={selectedSpirit}
        tags={tags}
        userId={userId}
        onBack={() => setStep(2)}
        onFinish={handleDreamSaved}
      />
    )
  }

  return null
}