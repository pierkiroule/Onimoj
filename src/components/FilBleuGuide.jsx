import { useCallback, useEffect, useMemo, useState } from "react"
import { filBleuConfig, filBleuGuides } from "../guides/filBleu"

export default function FilBleuGuide({ page }) {
  const { common = [], pages = {} } = filBleuGuides
  const steps = useMemo(() => {
    const base = (common ?? []).map((s) => ({ ...s, scope: "common" }))
    const guide = pages?.[page]
    if (!guide) return base
    const summary = guide.summary
      ? [{ id: `${page}-intro`, title: guide.title, text: guide.summary, scope: "summary" }]
      : []
    const content = (guide.steps ?? []).map((s) => ({ ...s, scope: "page" }))
    return [...base, ...summary, ...content]
  }, [page, common, pages])

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const step = steps[activeIndex]

  // Persistance locale
  useEffect(() => {
    const key = (filBleuConfig.storageKeyPrefix || "filBleuProgress:") + page
    const saved = localStorage.getItem(key)
    if (saved) {
      const idx = steps.findIndex((s) => s.id === saved)
      if (idx >= 0) setActiveIndex(idx)
    }
  }, [page, steps])

  useEffect(() => {
    if (!steps[activeIndex]) return
    const key = (filBleuConfig.storageKeyPrefix || "filBleuProgress:") + page
    localStorage.setItem(key, steps[activeIndex].id)
  }, [activeIndex, steps, page])

  const next = useCallback(() => setActiveIndex((i) => (i + 1) % steps.length), [steps.length])
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + steps.length) % steps.length), [steps.length])

  if (!steps.length) return null

  return (
    <>
      {/* === Bouton Fil Bleu scintillant === */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.4rem",
          right: "1.2rem",
          zIndex: 1200,
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          border: "1px solid rgba(127,255,212,0.4)",
          background: "radial-gradient(circle at center, #0ff 0%, #003 90%)",
          color: "#eafffb",
          fontSize: "1.3rem",
          boxShadow: "0 0 18px rgba(127,255,212,0.6)",
          animation: "filBleuPulse 4s ease-in-out infinite",
          cursor: "pointer",
        }}
      >
        💠
      </button>

      {/* === Fenêtre narrative === */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,10,20,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(0,25,35,0.9)",
              border: "1px solid rgba(127,255,212,0.3)",
              borderRadius: "18px",
              padding: "1.5rem 1.4rem 1.2rem",
              color: "#eafffb",
              width: "90%",
              maxWidth: "460px",
              textAlign: "center",
              boxShadow: "0 0 30px rgba(127,255,212,0.3)",
              position: "relative",
            }}
          >
            <h3 style={{ color: "#7fffd4", marginBottom: ".6rem" }}>{step?.title}</h3>
            <p style={{ fontSize: ".95rem", lineHeight: 1.5, opacity: 0.9, marginBottom: "1.2rem" }}>
              {step?.text}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".8rem" }}>
              <button onClick={prev} style={btnStyle}>◀</button>
              <button onClick={next} style={btnStyle}>▶</button>
            </div>

            <p style={{ fontSize: ".8rem", opacity: 0.6 }}>
              Étape {activeIndex + 1}/{steps.length}
            </p>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                ...btnStyle,
                width: "100%",
                marginTop: "1rem",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              ✕ Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes filBleuPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 8px rgba(127,255,212,0.3), 0 0 20px rgba(0,40,60,0.2);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 25px rgba(127,255,212,0.6), 0 0 40px rgba(0,70,90,0.4);
          }
        }
      `}</style>
    </>
  )
}

const btnStyle = {
  background: "rgba(127,255,212,0.2)",
  border: "1px solid rgba(127,255,212,0.4)",
  color: "#aefcf5",
  borderRadius: "10px",
  padding: "0.45rem 1rem",
  cursor: "pointer",
}