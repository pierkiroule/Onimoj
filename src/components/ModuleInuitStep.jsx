import PropTypes from "prop-types"
import "./ModuleInuitStep.css"

export default function ModuleInuitStep({ step = {}, onOpenHublot }) {
  const {
    spirit_name = "",
    symbol = "",
    theme = "",
    description = "",
    question = "",
    practice = "",
    integration = "",
    step_number,
  } = step || {}

  return (
    <section className="module-inuit">
      <header className="module-inuit__header">
        <div className="module-inuit__step">Étape {step_number || "—"}</div>
        <h3 className="module-inuit__title">{spirit_name} {symbol}</h3>
        {theme && (
          <div className="module-inuit__theme">Thème: {theme}</div>
        )}
      </header>

      {description && (
        <p className="module-inuit__description">{description}</p>
      )}

      {question && (
        <div className="module-inuit__block">
          <div className="module-inuit__label">Question</div>
          <p className="module-inuit__content">{question}</p>
        </div>
      )}

      {practice && (
        <div className="module-inuit__block">
          <div className="module-inuit__label">Pratique sensorielle</div>
          <p className="module-inuit__content">{practice}</p>
        </div>
      )}

      {integration && (
        <div className="module-inuit__block">
          <div className="module-inuit__label">Intégration</div>
          <p className="module-inuit__content">{integration}</p>
        </div>
      )}

      <div className="module-inuit__actions">
        <button className="module-inuit__open-btn" onClick={() => onOpenHublot?.()}>
          🌌 Ouvrir le Hublot
        </button>
      </div>
    </section>
  )
}

ModuleInuitStep.propTypes = {
  step: PropTypes.object,
  onOpenHublot: PropTypes.func,
}
