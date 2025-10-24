import { useMemo, useState, useEffect } from "react"
import PropTypes from "prop-types"
import StepRenderer from "./StepRenderer"
import "./ModuleInuitContainer.css"

export default function StepEngine({ steps = [], userId = null, initialIndex = 0, onEnd }) {
  const total = steps.length
  const [index, setIndex] = useState(() => 0)
  const [status, setStatus] = useState("")

  const slugs = useMemo(() => steps.map(createSlug), [steps])

  // Initial index from URL or prop
  useEffect(() => {
    if (total === 0) {
      setStatus("Aucune étape disponible.")
      return
    }
    const url = new URL(window.location.href)
    const qSlug = url.searchParams.get("etape") || url.searchParams.get("s")
    const qIndex = url.searchParams.get("i")
    let start = 0
    if (qSlug) {
      const idx = slugs.indexOf(qSlug)
      if (idx >= 0) start = idx
    } else if (qIndex) {
      const n = Number(qIndex)
      if (Number.isFinite(n) && n >= 0 && n < total) start = n
    } else if (Number.isFinite(initialIndex) && initialIndex >= 0 && initialIndex < total) {
      start = initialIndex
    }
    setIndex(start)
    // sync URL
    syncUrl(start)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, slugs.join("|")])

  // Back/forward navigation support
  useEffect(() => {
    function onPop() {
      const url = new URL(window.location.href)
      const qSlug = url.searchParams.get("etape") || url.searchParams.get("s")
      const qIndex = url.searchParams.get("i")
      if (qSlug) {
        const idx = slugs.indexOf(qSlug)
        if (idx >= 0) setIndex(idx)
      } else if (qIndex) {
        const n = Number(qIndex)
        if (Number.isFinite(n) && n >= 0 && n < total) setIndex(n)
      }
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [slugs, total])

  const step = useMemo(() => (total > 0 ? steps[index] : null), [steps, total, index])

  function handleNext() {
    if (index < total - 1) {
      setIndex((i) => i + 1)
      setStatus("✨ Étape suivante activée")
      syncUrl(index + 1)
    } else {
      setStatus("🏁 Voyage terminé — les esprits te saluent.")
      onEnd?.()
    }
  }

  function handlePrev() {
    if (index > 0) {
      setIndex((i) => i - 1)
      syncUrl(index - 1)
    }
  }

  if (!step) {
    return <p style={{ textAlign: "center", opacity: 0.9 }}>🌘 Chargement du rêve…</p>
  }

  return (
    <div className="mission-inuite">
      <h2>❄️ Mission Inuite</h2>
      <p className="mission-sub">Étape {index + 1} / {total}</p>

      {/* Barre d’étapes */}
      <div className="step-bar">
        {steps.map((_, i) => (
          <div key={i} className={`dot ${i === index ? "active" : ""}`} />
        ))}
      </div>

      {/* Contenu d’étape */}
      <div className="fade-wrapper fade-in">
        <StepRenderer step={step} userId={userId} onComplete={handleNext} />
      </div>

      {/* Navigation */}
      <div className="nav-buttons">
        <button onClick={handlePrev} disabled={index === 0} className="btn-prev">⬅️ Précédent</button>
        <button onClick={handleNext} className="btn-next">➡️ Suivant</button>
      </div>

      {status && <p className="mission-status">{status}</p>}
    </div>
  )
}

StepEngine.propTypes = {
  steps: PropTypes.array,
  userId: PropTypes.string,
  initialIndex: PropTypes.number,
  onEnd: PropTypes.func,
}

function createSlug(step) {
  const base = step?.spirit_name || step?.title || `etape-${step?.step_number || "1"}`
  return String(base)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function syncUrl(nextIndex) {
  try {
    const url = new URL(window.location.href)
    const params = url.searchParams
    params.set("i", String(nextIndex))
    // Optional: expose slug too for readability
    const currentSteps = window.__inuit_slugs__ || []
    const slug = currentSteps[nextIndex]
    if (slug) params.set("etape", slug)
    url.search = params.toString()
    window.history.pushState({}, "", url)
  } catch {
    // ignore
  }
}
