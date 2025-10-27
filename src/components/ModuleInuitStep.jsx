export default function ModuleInuitStep({ step }) {
  if (!step) return null

  switch (step.type) {
    case "video":
      return <video src={step.media_url} controls width="100%" />

    case "h5p":
      return <iframe src={step.media_url} width="100%" height="500" allowFullScreen />

    case "quiz":
      return <QuizModule quiz={step.quiz} />

    default:
      return (
        <div>
          <h3>{step.symbol} {step.spirit_name}</h3>
          <h4>{step.title}</h4>
          <p>{step.text}</p>
          {step.ritual && <blockquote>{step.ritual}</blockquote>}
        </div>
      )
  }
}

function QuizModule({ quiz }) {
  const [answer, setAnswer] = useState(null)
  const [result, setResult] = useState(null)
  if (!quiz) return <p>Pas de quiz.</p>

  return (
    <div className="quiz-box">
      <h4>{quiz.question}</h4>
      {quiz.options.map((opt, i) => (
        <button key={i} onClick={() => setAnswer(i)}>{opt}</button>
      ))}
      {answer !== null && (
        <p>{answer === quiz.correct ? "✅ Bonne réponse !" : "❌ Essaie encore"}</p>
      )}
    </div>
  )
}