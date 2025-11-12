import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { filBleuConfig, filBleuSteps } from "../guides/filBleu"
import { onGuideEvent } from "../guides/guideBus"

export default function FilBleuGuide({ enabled = true, allowReplay = false }) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)
  const step = filBleuSteps[index]

  // reprise progression
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = window.localStorage.getItem(filBleuConfig.storageKey)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed < filBleuSteps.length) {
          setIndex(parsed)
        }
      }
    } catch (err) {
      console.warn("FilBleuGuide: unable to restore progress", err)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(filBleuConfig.storageKey, String(index))
    } catch (err) {
      console.warn("FilBleuGuide: unable to persist progress", err)
    }
  }, [index])

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const scheduleAutoAdvance = useCallback(() => {
    clearTimers()
    if (!step) return
    const delay = Math.max(
      step.durationMs ?? 5000,
      filBleuConfig.minDelayBetweenStepsMs ?? 0
    )
    timerRef.current = setTimeout(() => {
      setVisible(false)
      timerRef.current = setTimeout(() => {
        setIndex((current) =>
          Math.min(current + 1, filBleuSteps.length - 1)
        )
      }, 400)
    }, delay)
  }, [clearTimers, step])

  useEffect(() => {
    if (!enabled || !step) {
      setVisible(false)
      clearTimers()
      return
    }

    setVisible(false)
    let triggered = false

    const handleTrigger = () => {
      if (triggered) return
      triggered = true
      setVisible(true)
      scheduleAutoAdvance()
    }

    if (step.trigger?.type === "onMountDelay") {
      timerRef.current = setTimeout(
        handleTrigger,
        step.trigger.ms ?? 1000
      )
      return () => {
        triggered = true
        clearTimers()
      }
    }

    if (step.trigger?.type === "event" && step.trigger.name) {
      const unsubscribe = onGuideEvent(step.trigger.name, handleTrigger)
      return () => {
        triggered = true
        clearTimers()
        unsubscribe?.()
      }
    }

    handleTrigger()
    return () => {
      triggered = true
      clearTimers()
    }
  }, [enabled, step, clearTimers, scheduleAutoAdvance])

  const handleReplay = useCallback(() => {
    if (typeof window === "undefined") return
    window.localStorage.removeItem(filBleuConfig.storageKey)
    setIndex(0)
    setVisible(false)
  }, [])

  const placementStyle = useMemo(
    () => getPlacementStyle(step?.placement),
    [step?.placement]
  )

  if (!enabled || !step) return null

  return (
    <>
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 5,
          ...placementStyle.container,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            padding: ".7rem 1rem",
            borderRadius: 14,
            border: "1px solid rgba(127,255,212,.35)",
            background:
              "linear-gradient(180deg, rgba(6,28,36,.75), rgba(2,14,20,.72))",
            color: "#eafffb",
            fontSize: ".95rem",
            lineHeight: 1.35,
            boxShadow:
              "0 8px 22px rgba(0,0,0,.35), 0 0 18px rgba(127,255,212,.18)",
            backdropFilter: "blur(8px)",
            opacity: visible ? 0.85 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(6px) scale(.98)",
            transition: "opacity .45s ease, transform .45s ease",
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
          }}
        >
          {step.text}
        </div>
      </div>
      {allowReplay ? (
        <button
          type="button"
          onClick={handleReplay}
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            background: "transparent",
            color: "#7fffd4",
            border: "none",
            fontSize: ".75rem",
            letterSpacing: ".5px",
            opacity: 0.6,
            cursor: "pointer",
            textTransform: "uppercase",
            fontFamily: "inherit",
            pointerEvents: "auto",
          }}
        >
          Fil Bleu ⟲
        </button>
      ) : null}
    </>
  )
}

function getPlacementStyle(placement = "bottom-center") {
  switch (placement) {
    case "top-center":
      return { container: { top: 8, left: "50%", transform: "translateX(-50%)" } }
    case "top-right":
      return { container: { top: 8, right: 8 } }
    case "bottom-left":
      return { container: { bottom: 8, left: 12 } }
    case "bottom-center":
    default:
      return { container: { bottom: 8, left: "50%", transform: "translateX(-50%)" } }
  }
}
