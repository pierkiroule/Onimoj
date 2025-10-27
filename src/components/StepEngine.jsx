import { useState, useEffect } from "react"
import HublotResonant from "./HublotResonant"
import EcumeDesReves from "./EcumeDesReves"
import "./StepEngine.css"

export default function StepEngine({ steps = [], onNextMission }) {
  const [i, setI] = useState(0)
  const [opened, setOpened] = useState(null)
  const [showHublot, setShowHublot] = useState(false)
  const [showEcume, setShowEcume] = useState(false)
  const [unlockTime, setUnlockTime] = useState(0)

  // ——— Verrou 24h
  useEffect(() => {
    const key = "inuite_unlock"
    const stored = localStorage.getItem(key)
    const val = stored ? Number(stored) : Date.now()
    setUnlockTime(val)
    if (!stored) localStorage.setItem(key, String(val))
  }, [])

  const step = steps[i]
  const canNext = Date.now() >= unlockTime

  const unlockNext = () => {
    const nextTime = Date.now() + 24 * 60 * 60 * 1000
    localStorage.setItem("inuite_unlock", String(nextTime))
    setUnlockTime(nextTime)
  }

  const accelerate = () => {
    const now = Date.now()
    localStorage.setItem("inuite_unlock", String(now))
    setUnlockTime(now)
  }

  // ——— Fonctions locales
  const labelForType = (type) => {
    const labels = {
      text: "Lecture contemplative",
      video: "Regard guidé",
      ritual: "Rituel du soir",
      quiz: "Énigme",
      hublot: "Hublot résonant",
    }
    return labels[type] || "Exploration"
  }

  function Quiz({ act }) {
    const [sel, setSel] = useState(null)
    const [fb, setFb] = useState("")
    const choose = (idx) => {
      setSel(idx)
      const ok = idx === act?.correct
      setFb(
        act?.feedback
          ? act.feedback[idx]
          : ok
          ? "✅ Bonne réponse !"
          : "❌ Essaie encore."
      )
    }
    const opts = act?.options ?? []
    return (
      <div>
        <p className="se2__quizQ">{act?.question || "…"}</p>
        <div className="se2__quizOpts">
          {opts.map((opt, k) => (
            <button
              key={k}
              className={`se2__quizBtn ${
                sel === k ? (k === act?.correct ? "ok" : "ko") : ""
              }`}
              onClick={() => choose(k)}
              disabled={sel !== null}
            >
              {opt}
            </button>
          ))}
        </div>
        {fb && <p className="se2__quizFb">{fb}</p>}
      </div>
    )
  }

  const renderActivity = (a) => {
    if (!a) return <p>🌀 Contenu manquant</p>
    switch (a.type) {
      case "text":
        return (
          <div
            className="se2__text"
            dangerouslySetInnerHTML={{ __html: a.content || "" }}
          />
        )
      case "video":
        return (
          <figure className="se2__media">
            <video className="se2__video" controls src={a.url || ""} />
            <figcaption className="se2__cap">{a.caption || ""}</figcaption>
          </figure>
        )
      case "ritual":
        return (
          <div>
            <h4 className="se2__ritualTitle">{a.title || "Rituel"}</h4>
            <div dangerouslySetInnerHTML={{ __html: a.content || "" }} />
            {a.sound && <audio controls src={a.sound} />}
          </div>
        )
      case "quiz":
        return <Quiz act={a} />
      case "hublot":
        return (
          <div>
            <p>{a.text || ""}</p>
            <button
              className="se2__btn primary"
              onClick={() => setShowHublot(true)}
            >
              🌌 Ouvrir le hublot
            </button>
          </div>
        )
      default:
        return <p>🌀 Type inconnu</p>
    }
  }

  const phrases = [
    "Le vent murmure ton nom •°",
    "L’eau se souvient du ciel •°",
    "Ton souffle rencontre la glace •°",
    "Un souvenir devient lumière •°",
    "Tu dérives entre deux mondes •°",
    "Une étoile te cherche encore •°",
    "Le silence devient passage •°",
    "Chaque souffle ouvre un monde •°",
    "L’océan écoute ta mémoire •°",
    "Le froid garde tes rêves vivants •°",
    "Les voix anciennes t’accompagnent •°",
    "La mer respire dans ton cœur •°",
    "Le vent te reconnaît •°",
    "Tu flottes dans l’entre-deux •°",
    "L’ombre devient berceau •°",
    "Sous la glace, un feu doux t’attend •°",
    "Chaque pas réveille un souvenir •°",
    "Le ciel se penche sur ton souffle •°",
    "La lumière vient du dedans •°",
    "Les bulles sont des prières •°",
    "Tout ce que tu perds devient lien •°",
    "Tu es traversé de mondes •°",
    "Le rêve s’épaissit d’écume •°",
    "Sila et Sedna se rencontrent en toi •°",
  ]

  // ——— États de rendu
  if (!step) return <p className="se2__status">❄️ Aucune étape trouvée.</p>

  if (!canNext) {
    return (
      <EcumeDesReves
        phrases={phrases}
        onComplete={() => {
          console.log("⏳ Verrou actif : contemplation.")
        }}
      />
    )
  }

  if (showEcume) {
    return (
      <EcumeDesReves
        phrases={phrases}
        onComplete={() => {
          setShowEcume(false)
          setI((p) => p + 1)
          unlockNext()
        }}
      />
    )
  }

  // ——— UI principale
  const activities = step.activities ?? []

  return (
    <div className="se2 fade-swap">
      <header className="se2__header">
        <div className="se2__crumbs">
          Étape {i + 1} / {steps.length} • {step.spirit_name}
        </div>
        <h3 className="se2__title">
          {step.symbol} {step.title}
        </h3>
        <div className="se2__mantra">{step.mantra}</div>
        <div className="se2__progress">
          <div
            className="se2__bar"
            style={{ width: `${((i + 1) / steps.length) * 100}%` }}
          />
        </div>
      </header>

      <section className="se2__list">
        {activities.map((a, j) => (
          <div key={j} className={`se2__item ${opened === j ? "open" : ""}`}>
            <button
              className="se2__acc"
              onClick={() => setOpened(opened === j ? null : j)}
            >
              <span className="se2__num">{String(j + 1).padStart(2, "0")}</span>
              <span className="se2__label">
                {a.title || labelForType(a.type)}
              </span>
              <span className="se2__chev">{opened === j ? "▾" : "▸"}</span>
            </button>

            {opened === j && (
              <div className="se2__panel">{renderActivity(a)}</div>
            )}
          </div>
        ))}
      </section>

      {showHublot && (
        <div className="se2__hublotWrap">
          <HublotResonant
            step={step}
            onComplete={() => setShowHublot(false)}
            onClose={() => setShowHublot(false)}
          />
        </div>
      )}

      {/* 🌌 navigation */}
      <nav className="se2__nav">
        <button
          className="se2__btn secondary"
          onClick={() => setI((p) => Math.max(p - 1, 0))}
          disabled={i === 0}
        >
          ← Précédent
        </button>

        {i < steps.length - 1 ? (
          <button className="se2__btn primary" onClick={() => setShowEcume(true)}>
            Suivant →
          </button>
        ) : (
          <button
            className="se2__btn primary"
            onClick={() => onNextMission?.("mission-berbere")}
          >
            🚀 Mission suivante
          </button>
        )}
      </nav>

      <p className="se2__status">
        🕊️ Le prochain souffle se dévoilera après ton repos circadien.
        <br />
        <small style={{ opacity: 0.7 }}>
          Ce temps de pause permet la régénération onirique naturelle.
        </small>
        <br />
        <button
          onClick={accelerate}
          className="se2__btn secondary"
          style={{ marginTop: ".6rem" }}
        >
          ⏩ Accélérer (dev)
        </button>
      </p>
    </div>
  )
}