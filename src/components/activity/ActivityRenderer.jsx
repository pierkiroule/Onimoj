import PropTypes from "prop-types"
import HublotResonant from "../HublotResonant"

export default function ActivityRenderer({ activity, step, userId, onCompleteHublot }) {
  const a = activity || {}

  if (a.type === "text") {
    return (
      <div
        className="se2__text"
        dangerouslySetInnerHTML={{ __html: a.content || "" }}
      />
    )
  }

  if (a.type === "image") {
    return (
      <figure className="se2__media">
        <img src={a.url} alt={a.caption || "image"} className="se2__img" />
        {a.caption && <figcaption className="se2__cap">{a.caption}</figcaption>}
      </figure>
    )
  }

  if (a.type === "video") {
    return (
      <figure className="se2__media">
        <video className="se2__video" src={a.url} controls playsInline />
        {a.caption && <figcaption className="se2__cap">{a.caption}</figcaption>}
      </figure>
    )
  }

  if (a.type === "audio") {
    return (
      <div className="se2__audio">
        {a.content && (
          <div
            className="se2__text"
            dangerouslySetInnerHTML={{ __html: a.content }}
          />
        )}
        {a.url && <audio src={a.url} controls />}
      </div>
    )
  }

  if (a.type === "ritual") {
    return (
      <div className="se2__ritual">
        {a.title && <h4 className="se2__ritualTitle">{a.title}</h4>}
        <div
          className="se2__text"
          dangerouslySetInnerHTML={{ __html: a.content || "" }}
        />
        {a.sound && <audio src={a.sound} controls />}
      </div>
    )
  }

  if (a.type === "quiz") {
    return <MiniQuiz a={a} />
  }

  if (a.type === "hublot") {
    // Affichage direct sans bouton
    return (
      <div className="se2__hublotWrap">
        {a.text && (
          <div
            className="se2__text"
            dangerouslySetInnerHTML={{ __html: a.text }}
          />
        )}
        {a.sound && <audio src={a.sound} controls />}
        <HublotResonant
          culture={step?.culture || "Inuite"}
          step={step}
          onClose={() => {}}
          onComplete={() => onCompleteHublot?.()}
        />
      </div>
    )
  }

  return <p style={{ opacity: 0.6 }}>Type non supporté : {String(a.type)}</p>
}

ActivityRenderer.propTypes = {
  activity: PropTypes.object,
  step: PropTypes.object,
  userId: PropTypes.string,
  onCompleteHublot: PropTypes.func,
}

function MiniQuiz({ a }) {
  const { question, options = [], correct = 0, feedback = [] } = a
  const state = window.__mini_quiz_state || (window.__mini_quiz_state = { sel: null, ok: null })

  return (
    <div className="se2__quiz">
      <p className="se2__quizQ">{question}</p>
      <div className="se2__quizOpts">
        {options.map((opt, idx) => {
          const selected = state.sel === idx
          const className =
            selected && state.ok != null
              ? idx === correct
                ? "ok"
                : "ko"
              : selected
              ? "sel"
              : ""
          return (
            <button
              key={idx}
              className={`se2__quizBtn ${className}`}
              onClick={() => {
                state.sel = idx
                state.ok = idx === correct
                // force repaint via custom event (simple sans state local)
                window.dispatchEvent(new Event("se2-quiz-refresh"))
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {state.ok != null && (
        <p className="se2__quizFb">
          {feedback?.[state.ok ? correct : state.sel] ||
            (state.ok ? "✅ Juste !" : "❌ Essaie encore.")}
        </p>
      )}
      {/* Refresh minimaliste */}
      <QuizRefresher />
    </div>
  )
}

function QuizRefresher() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const fn = () => setTick((t) => t + 1)
    window.addEventListener("se2-quiz-refresh", fn)
    return () => window.removeEventListener("se2-quiz-refresh", fn)
  }, [])
  return null
}