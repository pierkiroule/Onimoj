import { useEffect, useMemo, useState } from "react"
import { useDreamFragments } from "../modules/useDreamFragments"
import "./DreamFragmentOverlay.css"

const ROTATION_INTERVAL = 6200

export default function DreamFragmentOverlay({
  guardianId,
  userId,
  audioIntensity = 0,
}) {
  const { fragments, intensity } = useDreamFragments({
    limit: 36,
    guardianId,
    userId,
  })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [fragments])

  useEffect(() => {
    if (fragments.length <= 1) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % fragments.length)
    }, ROTATION_INTERVAL)
    return () => window.clearInterval(timer)
  }, [fragments])

  const fragment = fragments[index]
  const audioMood = useMemo(() => {
    if (audioIntensity >= 0.7) return "surge"
    if (audioIntensity >= 0.35) return "pulse"
    return "calm"
  }, [audioIntensity])

  if (!fragment) return null

  const guardianLabel =
    fragment.guardian &&
    !/^[0-9a-f-]{10,}$/i.test(String(fragment.guardian))
      ? fragment.guardian
      : null

  const classes = [
    "dream-fragment-overlay",
    `intensity-${intensity}`,
    `mood-${audioMood}`,
    `tone-${fragment.tone}`,
  ].join(" ")

  return (
    <div className={classes}>
      <div key={fragment.id} className="fragment-card">
        <div className="fragment-header">
          {guardianLabel ? (
            <span className="fragment-guardian">{guardianLabel}</span>
          ) : (
            <span className="fragment-source">
              {fragment.source === "echo" ? "Écho" : "Rêve"}
            </span>
          )}
        </div>
        <p className="fragment-text">« {fragment.text} »</p>
      </div>
    </div>
  )
}
