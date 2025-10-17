import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CosmojiD3 from '../shared/CosmojiD3';
import '../App.css';

const BASE_EMOJIS = ['❄️', '🌌', '🧭', '🦭', '🔥', '🌬️', '🧊', '🐻', '🌙', '🧿'];

const GUIDE_DEFS = [
  { id: 'Sila', label: 'Sila', keywords: ['🌬️', '❄️', '🧊'], color: '#74b9ff', gist: "Souffle, météo, souffle du monde." },
  { id: 'Sedna', label: 'Sedna', keywords: ['🦭', '🌙'], color: '#00cec9', gist: "Mer, animaux marins, cycles de subsistance." },
  { id: 'Nanook', label: 'Nanook', keywords: ['🐻', '❄️'], color: '#ffeaa7', gist: "Ours polaire, respect, courage prudent." },
  { id: 'Aningan', label: 'Aningan', keywords: ['🌙', '🌌'], color: '#a29bfe', gist: "Lune, cycles, veille nocturne." },
  { id: 'Ignik', label: 'Ignik', keywords: ['🔥', '❄️'], color: '#fab1a0', gist: "Feu, chaleur, communauté et soin." },
];

const QUIZZES = {
  Sila: [
    { q: "Que représente Sila dans la cosmologie inuit ?", choices: ["Esprit de la mer", "Esprit de l’air et de la météo", "Esprit du feu"], correct: 1 },
    { q: "Quelle pratique honore Sila avant le sommeil ?", choices: ["Respiration lente et écoute du vent", "Danse rapide", "Jeûne prolongé"], correct: 0 },
    { q: "Un rêve sous le signe de Sila évoque souvent…", choices: ["La foudre intérieure", "La clarté et la direction", "La chasse au caribou"], correct: 1 },
    { q: "Qu’est-ce qui change avec Sila ?", choices: ["Les marées", "Le temps et l’air", "La roche"], correct: 1 },
    { q: "Quel symbole lui correspond le mieux ici ?", choices: ["🌬️", "🦭", "🐻"], correct: 0 },
  ],
  Sedna: [
    { q: "Sedna est surtout liée à…", choices: ["La montagne", "La mer et ses êtres", "Le désert"], correct: 1 },
    { q: "Geste symbolique pour apaiser Sedna dans certains récits ?", choices: ["Peigner ses cheveux", "Entonner un chant d’orage", "Brûler de la mousse"], correct: 0 },
    { q: "Un rêve ‘de Sedna’ porte sur…", choices: ["Phoques et profondeurs", "Foudre et tonnerre", "Feu de camp"], correct: 0 },
    { q: "Valeur mise en avant par cette figure ?", choices: ["Exubérance", "Respect des cycles", "Mépris du gibier"], correct: 1 },
    { q: "Quel symbole lui correspond le mieux ici ?", choices: ["🦭", "🔥", "🧭"], correct: 0 },
  ],
  Nanook: [
    { q: "Nanook est l’esprit…", choices: ["De l’ours polaire", "Du renard arctique", "Du narval"], correct: 0 },
    { q: "Qualité associée à Nanook ?", choices: ["Légèreté", "Courage prudent", "Insouciance"], correct: 1 },
    { q: "Un signe onirique typique ?", choices: ["Empreintes sur la neige", "Pluie d’été", "Champ de fleurs"], correct: 0 },
    { q: "Dans la relation au gibier, on valorise…", choices: ["Le gaspillage", "Le respect", "L’oubli des tabous"], correct: 1 },
    { q: "Quel symbole lui correspond le mieux ici ?", choices: ["🐻", "🧿", "🌌"], correct: 0 },
  ],
  Aningan: [
    { q: "Aningan renvoie surtout à…", choices: ["La Lune et ses cycles", "Les tempêtes de sable", "Les volcans"], correct: 0 },
    { q: "Quel rituel nocturne l’évoque ?", choices: ["Observer calmement le ciel", "Danser au soleil", "Chasser à midi"], correct: 0 },
    { q: "Dans les rêves, Aningan invite à…", choices: ["La course effrénée", "Le rythme et la mesure", "Le vacarme"], correct: 1 },
    { q: "Symbole qui convient le mieux ici ?", choices: ["🌙", "🔥", "🦭"], correct: 0 },
    { q: "Une trace d’Aningan au matin ?", choices: ["Marées intérieures apaisées", "Froid mordant", "Odeur de fumée"], correct: 0 },
  ],
  Ignik: [
    { q: "Ignik représente surtout…", choices: ["Le feu qui rassemble", "La glace éternelle", "Le vent violent"], correct: 0 },
    { q: "Que favorise Ignik au camp ?", choices: ["La dispersion", "La parole et le soin", "Le silence forcé"], correct: 1 },
    { q: "En rêve, Ignik apporte…", choices: ["Chaleur relationnelle", "Aveuglement", "Tourmente"], correct: 0 },
    { q: "Symbole qui convient le mieux ici ?", choices: ["🔥", "🧿", "🧊"], correct: 0 },
    { q: "Pratique autour du feu ?", choices: ["Mauvais traitement du bois", "Partage et respect", "Ignorer les braises"], correct: 1 },
  ],
};

function determineGuide(selected) {
  const scored = GUIDE_DEFS.map((g) => ({
    guide: g,
    score: g.keywords.reduce((acc, k) => acc + (selected.includes(k) ? 1 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score);
  return (scored[0]?.guide) || GUIDE_DEFS[0];
}

function StepHeader({ current, total }) {
  const pct = Math.min(100, Math.max(0, Math.round((current - 1) * (100 / total))));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: '1.35rem' }}>Navette oniris — Mission Inuit</h1>
        <div className="badge">Étape {current} / {total}</div>
      </div>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function InuitVoyage() {
  const TOTAL_STEPS = 12;

  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState([]);
  const [phase, setPhase] = useState('select'); // 'select' | 'quiz' | 'tags'
  const [guide, setGuide] = useState(null); // {id,label,color}
  const [answers, setAnswers] = useState({}); // qIdx -> choiceIdx
  const [score, setScore] = useState(0);
  const [tags, setTags] = useState([]);
  const [stepsData, setStepsData] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // load persisted state
  useEffect(() => {
    const raw = localStorage.getItem('inuitVoyageV1');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setCurrentStep(parsed.currentStep ?? 1);
        setStepsData(parsed.stepsData ?? []);
      }
    } catch {}
  }, []);

  // persist minimal progress
  useEffect(() => {
    localStorage.setItem('inuitVoyageV1', JSON.stringify({ currentStep, stepsData }));
  }, [currentStep, stepsData]);

  const toggleEmoji = useCallback((emoji) => {
    setSelection((prev) => {
      if (prev.includes(emoji)) return prev.filter((e) => e !== emoji);
      if (prev.length >= 3) return prev; // keep at most 3
      return [...prev, emoji];
    });
  }, []);

  const canValidateSelection = selection.length === 3;

  const onValidateSelection = () => {
    const g = determineGuide(selection);
    setGuide(g);
    setPhase('quiz');
    setAnswers({});
    setScore(0);
    setTags([]);
  };

  const quizForGuide = useMemo(() => (guide ? QUIZZES[guide.id] : []), [guide]);

  const setAnswer = (qIdx, choiceIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: choiceIdx }));
  };

  const onValidateQuiz = () => {
    const s = quizForGuide.reduce((acc, q, idx) => acc + ((answers[idx] ?? -1) === q.correct ? 1 : 0), 0);
    setScore(s);
    setPhase('tags');
  };

  const addTag = (t) => {
    const clean = String(t || '').trim().toLowerCase();
    if (!clean) return;
    setTags((prev) => {
      if (prev.includes(clean)) return prev;
      if (prev.length >= score) return prev; // limit by score
      return [...prev, clean];
    });
    setTagInput('');
  };

  const finishStep = () => {
    const summary = { step: currentStep, selection, guideId: guide.id, score, tags };
    setStepsData((prev) => [...prev, summary]);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      setSelection([]);
      setGuide(null);
      setAnswers({});
      setScore(0);
      setTags([]);
      setPhase('select');
    } else {
      // journey complete -> show summary section
      setPhase('complete');
    }
  };

  const resetJourney = () => {
    setCurrentStep(1);
    setSelection([]);
    setGuide(null);
    setAnswers({});
    setScore(0);
    setTags([]);
    setStepsData([]);
    setPhase('select');
    localStorage.removeItem('inuitVoyageV1');
  };

  const remainingTags = Math.max(0, score - tags.length);
  const allQuizAnswered = quizForGuide.length === 5 && Object.keys(answers).length === 5;
  const suggestions = ['banquise', 'respiration', 'lune', 'phoques', 'veillée', 'protection', 'respect', 'écoute', 'silence', 'trace'];

  const showSummary = phase === 'complete' || (currentStep > TOTAL_STEPS);

  return (
    <div className="home-container" style={{ gap: '1rem', alignItems: 'stretch' }}>
      {!showSummary && <StepHeader current={currentStep} total={TOTAL_STEPS} />}

      <div className="voyage-layout">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="hublot" style={{ width: 360, height: 360 }}>
            <CosmojiD3
              width={320}
              height={320}
              emojis={BASE_EMOJIS}
              interactive={!showSummary}
              selectedEmojis={selection}
              onToggleEmoji={toggleEmoji}
            />
          </div>
          {!showSummary && (
            <div className="selection-count">
              Ton onimoji: {selection.join(' ')}
              <span className="badge" style={{ marginLeft: 8 }}>{selection.length} / 3</span>
            </div>
          )}
        </div>

        <div className="side-panel">
          {!showSummary && phase === 'select' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Choisis 3 émojis</h2>
              <p>Sélectionne exactement trois émojis dans le cosmoji. Ils feront émerger un esprit guide inuit.</p>
              <button className="primary-button" disabled={!canValidateSelection} onClick={onValidateSelection}>
                Valider mes 3 émojis
              </button>
            </div>
          )}

          {!showSummary && phase === 'quiz' && guide && (
            <div>
              <div className="guide-card" style={{ borderColor: guide.color }}>
                <div className="guide-name" style={{ color: guide.color }}>{guide.label}</div>
                <div className="guide-gist">{guide.gist}</div>
              </div>
              <div className="quiz-list">
                {quizForGuide.map((q, idx) => (
                  <div key={idx} className="quiz-item">
                    <div className="quiz-q">{idx + 1}. {q.q}</div>
                    <div className="quiz-choices">
                      {q.choices.map((c, cIdx) => (
                        <label key={cIdx} className="choice">
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            checked={(answers[idx] ?? -1) === cIdx}
                            onChange={() => setAnswer(idx, cIdx)}
                          />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="primary-button" disabled={!allQuizAnswered} onClick={onValidateQuiz}>
                Valider le quiz
              </button>
            </div>
          )}

          {!showSummary && phase === 'tags' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Échoniriques de la communauté</h2>
              <p>Score: <strong>{score} / 5</strong>. Tu peux accueillir <strong>{score}</strong> enrichissements (tags) d’autres gardiens.</p>

              <div className="tags-area">
                <div className="tags-list">
                  {tags.map((t) => (
                    <span key={t} className="emoji-pill" onClick={() => setTags((prev) => prev.filter((x) => x !== t))}>{t} ×</span>
                  ))}
                </div>
                {remainingTags > 0 && (
                  <div className="tag-input-row">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder={`Ajouter un tag (${remainingTags} restant${remainingTags > 1 ? 's' : ''})`}
                    />
                    <button onClick={() => addTag(tagInput)} disabled={!tagInput.trim()} className="primary-button">ajouter</button>
                  </div>
                )}

                <div className="tag-suggestions">
                  {suggestions.map((s) => (
                    <button key={s} className="emoji-pill" onClick={() => addTag(s)} disabled={tags.includes(s) || tags.length >= score}>{s}</button>
                  ))}
                </div>
              </div>

              <button className="primary-button" onClick={finishStep}>
                Terminer l’étape
              </button>
            </div>
          )}

          {showSummary && (
            <div>
              <h2 style={{ marginTop: 0 }}>Voyage terminé — onimojis en expansion</h2>
              {stepsData.length === 0 && <p>Aucun onimoji encore. Lance un nouveau voyage.</p>}
              <div className="summary-grid">
                {stepsData.map((s) => {
                  const g = GUIDE_DEFS.find((gd) => gd.id === s.guideId) || GUIDE_DEFS[0];
                  return (
                    <div key={s.step} className="summary-card">
                      <div className="summary-top">
                        <div className="onimoji">{s.selection.join(' ')}</div>
                        <span className="badge" style={{ background: g.color, color: '#111' }}>{g.label}</span>
                      </div>
                      <div className="summary-bottom">
                        <div className="score">Score: {s.score}/5</div>
                        <div className="tags">
                          {s.tags.length > 0 ? s.tags.map((t) => <span key={t} className="emoji-pill">{t}</span>) : <span className="muted">aucun tag</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                <button className="primary-button" onClick={resetJourney}>Recommencer un voyage</button>
                <Link to="/" className="primary-button">Retour</Link>
              </div>
            </div>
          )}

          {!showSummary && (
            <div style={{ marginTop: 12 }}>
              <Link to="/" className="primary-button">Quitter</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
