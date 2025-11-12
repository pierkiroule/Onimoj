import { useCallback, useEffect, useMemo, useState } from "react"
import { filBleuConfig, filBleuGuides } from "../guides/filBleu"

const emptyArray = []
const { common = emptyArray, pages = {} } = filBleuGuides
const storagePrefix =
  filBleuConfig.storageKeyPrefix || filBleuConfig.storageKey || "filBleuProgress:"
const tooltipKey = filBleuConfig.tooltipSeenKey || "filBleuTooltipSeen"

function buildSteps(page) {
  const baseSteps = (common ?? emptyArray).map((step) => ({
    ...step,
    scope: "common",
  }))

  const pageGuide = pages?.[page]
  if (!pageGuide) return baseSteps

  const summaryStep = pageGuide.summary
    ? [
        {
          id: `${page}-overview`,
          title: pageGuide.title ?? "Guide",
          text: pageGuide.summary,
          scope: "summary",
        },
      ]
    : []

  const pageSteps = (pageGuide.steps ?? emptyArray).map((step) => ({
    ...step,
    scope: "page",
  }))

  return [...baseSteps, ...summaryStep, ...pageSteps]
}

function getStorageKey(page) {
  return `${storagePrefix}${page || "global"}`
}

export default function FilBleuGuide({ page }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeStepId, setActiveStepId] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const steps = useMemo(() => buildSteps(page), [page])
  const activeIndex = steps.findIndex((step) => step.id === activeStepId)
  const activeStep = activeIndex >= 0 ? steps[activeIndex] : steps[0]

  const markTooltipSeen = useCallback(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(tooltipKey, "seen")
    } catch (err) {
      console.warn("FilBleuGuide: unable to persist tooltip state", err)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    let hideTimeout
    try {
      const seen = window.localStorage.getItem(tooltipKey)
      if (!seen) {
        setShowTooltip(true)
        hideTimeout = window.setTimeout(() => setShowTooltip(false), 6000)
      }
    } catch (err) {
      console.warn("FilBleuGuide: unable to restore tooltip state", err)
    }
    return () => {
      if (hideTimeout) window.clearTimeout(hideTimeout)
    }
  }, [])

  useEffect(() => {
    if (!steps.length) {
      setActiveStepId(null)
      return
    }
    const firstStep = steps[0]
    setActiveStepId((current) => {
      if (current && steps.some((step) => step.id === current)) return current
      return firstStep?.id ?? null
    })
  }, [steps])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!steps.length || !activeStepId) return
    try {
      const key = getStorageKey(page)
      window.localStorage.setItem(key, activeStepId)
    } catch (err) {
      console.warn("FilBleuGuide: unable to persist progress", err)
    }
  }, [page, activeStepId, steps.length])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const key = getStorageKey(page)
      const saved = window.localStorage.getItem(key)
      if (saved && steps.some((step) => step.id === saved)) {
        setActiveStepId(saved)
      }
    } catch (err) {
      console.warn("FilBleuGuide: unable to restore progress", err)
    }
  }, [page, steps])

  const handleOpen = () => {
    markTooltipSeen()
    setShowTooltip(false)
    setIsOpen(true)
  }

  const handleClose = () => setIsOpen(false)

  const handlePrev = useCallback(() => {
    if (!steps.length) return
    const nextIndex = activeIndex > 0 ? activeIndex - 1 : steps.length - 1
    setActiveStepId(steps[nextIndex]?.id ?? null)
  }, [activeIndex, steps])

  const handleNext = useCallback(() => {
    if (!steps.length) return
    const nextIndex = activeIndex >= 0 ? (activeIndex + 1) % steps.length : 0
    setActiveStepId(steps[nextIndex]?.id ?? null)
  }, [activeIndex, steps])

  const handleSelect = useCallback((id) => {
    if (!steps.some((step) => step.id === id)) return
    setActiveStepId(id)
  }, [steps])

  const handleReset = useCallback(() => {
    if (!steps.length) return
    setActiveStepId(steps[0]?.id ?? null)
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(getStorageKey(page))
      } catch (err) {
        console.warn("FilBleuGuide: unable to reset progress", err)
      }
    }
  }, [page, steps])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event) => {
      if (event.key === "Escape") setIsOpen(false)
      if (event.key === "ArrowRight") handleNext()
      if (event.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, handleNext, handlePrev])

  if (!steps.length) {
    return null
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1200,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <button
          type="button"
          onClick={handleOpen}
          onMouseEnter={markTooltipSeen}
          onFocus={markTooltipSeen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="filbleu-help-center"
          aria-label="Ouvrir le centre d’aide Fil Bleu"
          style={helpButtonStyle}
        >
          •° help
        </button>
        {showTooltip && (
          <div style={tooltipStyle} role="status">
            Explore le guide Fil Bleu ✨
          </div>
        )}
      </div>

      {isOpen && (
        <div
          id="filbleu-help-center"
          style={overlayStyle}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filbleu-modal-title"
        >
          <div style={modalStyle}>
            <header style={modalHeaderStyle}>
              <div>
                <p style={modalOverlineStyle}>Fil Bleu — Centre d’aide</p>
                <h2 id="filbleu-modal-title" style={modalTitleStyle}>
                  {pages?.[page]?.title || "Voyage onirique"}
                </h2>
              </div>
              <button type="button" onClick={handleClose} style={closeButtonStyle}>
                ✕
              </button>
            </header>
            <div style={modalContentStyle}>
              <aside style={sidebarStyle} aria-label="Sections du guide">
                {steps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleSelect(step.id)}
                    className={step.id === activeStep?.id ? "active" : ""}
                    style={{
                      ...sidebarButtonStyle,
                      ...(step.id === activeStep?.id
                        ? sidebarButtonActiveStyle
                        : null),
                    }}
                  >
                    <span style={sidebarIndexStyle}>
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span>{step.title}</span>
                  </button>
                ))}
              </aside>

              <article style={articleStyle}>
                <div style={chipRowStyle}>
                  <span style={scopeChipStyle(activeStep?.scope)}>
                    {getScopeLabel(activeStep?.scope)}
                  </span>
                  <span style={stepPositionStyle}>
                    {activeIndex + 1}/{steps.length}
                  </span>
                </div>
                <h3 style={articleTitleStyle}>{activeStep?.title}</h3>
                <p style={articleTextStyle}>{activeStep?.text}</p>

                <div style={actionRowStyle}>
                  <button type="button" onClick={handlePrev} style={navButtonStyle}>
                    ← Précédent
                  </button>
                  <button type="button" onClick={handleReset} style={resetButtonStyle}>
                    Revenir au début
                  </button>
                  <button type="button" onClick={handleNext} style={navButtonStyle}>
                    Suivant →
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getScopeLabel(scope) {
  if (scope === "page") return "Étape clé"
  if (scope === "summary") return "Introduction"
  return "Fil Bleu"
}

const helpButtonStyle = {
  background: "rgba(8, 30, 38, 0.8)",
  border: "1px solid rgba(127, 255, 212, 0.5)",
  borderRadius: "999px",
  color: "#aefcf5",
  fontSize: "0.8rem",
  letterSpacing: "0.6px",
  padding: "0.35rem 0.9rem",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
  textTransform: "uppercase",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
}

const tooltipStyle = {
  background: "rgba(6, 28, 36, 0.92)",
  border: "1px solid rgba(174, 252, 245, 0.5)",
  color: "#eafffb",
  fontSize: "0.75rem",
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.45)",
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 10, 16, 0.6)",
  backdropFilter: "blur(6px)",
  zIndex: 1300,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "1.5rem",
}

const modalStyle = {
  width: "100%",
  maxWidth: "960px",
  background: "linear-gradient(180deg, rgba(4, 19, 27, 0.96), rgba(2, 12, 18, 0.94))",
  border: "1px solid rgba(127, 255, 212, 0.2)",
  borderRadius: "18px",
  boxShadow: "0 28px 80px rgba(0, 0, 0, 0.45)",
  color: "#eafffb",
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  overflow: "hidden",
}

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.4rem 1.6rem 1rem",
  borderBottom: "1px solid rgba(127, 255, 212, 0.1)",
}

const modalOverlineStyle = {
  fontSize: "0.7rem",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(174, 252, 245, 0.7)",
  margin: 0,
}

const modalTitleStyle = {
  margin: "0.35rem 0 0",
  fontSize: "1.6rem",
  fontWeight: 600,
  letterSpacing: "0.5px",
  color: "#aefcf5",
}

const closeButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#aefcf5",
  fontSize: "1.2rem",
  cursor: "pointer",
  padding: "0.4rem",
}

const modalContentStyle = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
}

const sidebarStyle = {
  width: "280px",
  borderRight: "1px solid rgba(127, 255, 212, 0.08)",
  padding: "1rem 0",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
}

const sidebarButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#eafffb",
  textAlign: "left",
  padding: "0.75rem 1.4rem",
  display: "flex",
  gap: "0.65rem",
  alignItems: "center",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "background 0.2s ease, transform 0.2s ease",
}

const sidebarButtonActiveStyle = {
  background: "rgba(127, 255, 212, 0.12)",
  transform: "scale(1.02)",
}

const sidebarIndexStyle = {
  fontFamily: "monospace",
  fontSize: "0.75rem",
  opacity: 0.65,
}

const articleStyle = {
  flex: 1,
  padding: "1.4rem 1.6rem",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  overflowY: "auto",
}

const chipRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  marginBottom: "0.5rem",
}

const scopeChipStyle = (scope) => ({
  background:
    scope === "page"
      ? "rgba(127, 255, 212, 0.18)"
      : scope === "summary"
      ? "rgba(255, 212, 107, 0.18)"
      : "rgba(99, 139, 255, 0.18)",
  color:
    scope === "page"
      ? "#7fffd4"
      : scope === "summary"
      ? "#ffd46b"
      : "#99b5ff",
  borderRadius: "999px",
  padding: "0.2rem 0.8rem",
  fontSize: "0.7rem",
  letterSpacing: "1px",
  textTransform: "uppercase",
})

const stepPositionStyle = {
  fontSize: "0.8rem",
  opacity: 0.6,
}

const articleTitleStyle = {
  fontSize: "1.35rem",
  margin: 0,
  color: "#aefcf5",
}

const articleTextStyle = {
  fontSize: "1rem",
  lineHeight: 1.5,
  color: "rgba(234, 255, 251, 0.92)",
  whiteSpace: "pre-line",
}

const actionRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  gap: "0.5rem",
}

const navButtonStyle = {
  background: "rgba(127, 255, 212, 0.18)",
  border: "1px solid rgba(127, 255, 212, 0.35)",
  color: "#aefcf5",
  borderRadius: "10px",
  padding: "0.45rem 1.2rem",
  cursor: "pointer",
  fontWeight: 600,
  letterSpacing: "0.5px",
}

const resetButtonStyle = {
  background: "transparent",
  border: "1px dashed rgba(174, 252, 245, 0.35)",
  color: "rgba(174, 252, 245, 0.75)",
  borderRadius: "10px",
  padding: "0.45rem 1.2rem",
  cursor: "pointer",
  fontSize: "0.85rem",
}
