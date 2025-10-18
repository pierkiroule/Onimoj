import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CosmojiD3 from '../shared/CosmojiD3';
import '../App.css';
import ArcticBackground from '../shared/ArcticBackground';

const BASE_EMOJIS = ['❄️', '🌌', '🧭', '🦭', '🔥', '🌬️', '🧊', '🐻', '🌙', '🧿'];

const GUIDE_DEFS = [
  { id: 'Sila', label: 'Sila', keywords: ['🌬️', '❄️', '🧊'], color: '#74b9ff', gist: "Souffle, météo, souffle du monde." },
  { id: 'Sedna', label: 'Sedna', keywords: ['🦭', '🌙'], color: '#00cec9', gist: "Mer, animaux marins, cycles de subsistance." },
  { id: 'Nanook', label: 'Nanook', keywords: ['🐻', '❄️'], color: '#ffeaa7', gist: "Ours polaire, respect, courage prudent." },
  { id: 'Aningan', label: 'Aningan', keywords: ['🌙', '🌌'], color: '#a29bfe', gist: "Lune, cycles, veille nocturne." },
  { id: 'Ignik', label: 'Ignik', keywords: ['🔥', '❄️'], color: '#fab1a0', gist: "Feu, chaleur, communauté et soin." },
];

const GUIDE_EMOJI = {
  Sila: '🌬️',
  Sedna: '🦭',
  Nanook: '🐻',
  Aningan: '🌙',
  Ignik: '🔥',
};

const GUIDE_WISDOM = {
  Sila: [
    "Respire avec le ciel, jusqu’à entendre le souffle du monde.",
    "Sila enseigne l’attention: chaque rafale est une parole.",
    "Dans l’air, la mémoire circule: légère, mais agissante.",
    "Écoute les variations: elles guident tes déplacements intérieurs.",
    "Quand le temps change, ajuste ta posture et ton regard.",
    "La clarté vient souvent après l’orage des pensées.",
    "Sila n’impose rien: il propose une direction subtile.",
    "Respirer, c’est converser avec l’invisible qui nous porte.",
    "Préserve la douceur du vent: elle apaise les liens.",
    "Dans le rêve, le souffle dessine le chemin de retour.",
  ],
  Sedna: [
    "Sous la surface, une grande patience veille.",
    "Respecte les cycles: prendre, rendre, remercier.",
    "La mer garde trace des gestes justes.",
    "Peigner les noeuds du coeur, comme on apaise la houle.",
    "Les alliés marins guident les choix sobres.",
    "Descendre sans brusquer, remonter avec tact.",
    "La profondeur protège ce qui mûrit.",
    "Partage équitable, mémoire vivante des communautés.",
    "Écoute les phoques: ils connaissent les passages.",
    "Au matin, remercie l’eau qui te porte.",
  ],
  Nanook: [
    "La force est un silence aligné.",
    "Avancer ferme, mais sans outrager les traces.",
    "Le courage prudent voit loin sans précipiter.",
    "Chaque empreinte engage une responsabilité.",
    "Le respect fait vivre la réciprocité avec le vivant.",
    "Nul triomphe: seulement la juste mesure.",
    "Apprends du froid: il sculpte la présence.",
    "Se rassembler pour décider, ne pas gaspiller.",
    "Honorer la proie, c’est honorer la vie.",
    "Devant l’ours, l’âme se tient droite.",
  ],
  Aningan: [
    "La lune règle les marées visibles et secrètes.",
    "Compter les nuits, c’est apprivoiser le rythme.",
    "La veille douce affine l’écoute du monde.",
    "Revenir au souffle quand la nuit se trouble.",
    "Les cycles enseignent la patience des métamorphoses.",
    "Ralentir révèle des chemins délicats.",
    "La clarté ne crie pas: elle s’installe.",
    "Observer, sans juger, jusqu’à l’évidence.",
    "Le rêve est un calendrier du coeur.",
    "Au matin, note le détail qui insiste.",
  ],
  Ignik: [
    "Le feu rassemble, répare, relie.",
    "Soigne les liens comme on attise une braise.",
    "Parler vrai réchauffe, accuser brûle.",
    "Chaleur partagée, sécurité commune.",
    "Le soin circule de main en main.",
    "Garder la flamme: ni trop, ni trop peu.",
    "Le récit nourrit, comme une soupe.",
    "Écouter longtemps avant de conclure.",
    "Respecter le bois, remercier la lumière.",
    "Au soir, confier au feu ce qui pèse.",
  ],
};

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

const QUESTIONS_PER_QUIZ = 3;

function determineGuideByStep(step) {
  // Cycle guides by step for a curated progression
  const idx = (step - 1) % GUIDE_DEFS.length;
  return GUIDE_DEFS[idx];
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
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'reveal' | 'share' | 'complete'
  const [guide, setGuide] = useState(null); // {id,label,color}
  const [answers, setAnswers] = useState({}); // qIdx -> choiceIdx
  const [quizFailed, setQuizFailed] = useState(false);
  const [stepsData, setStepsData] = useState([]);
  const [showCosmoji, setShowCosmoji] = useState(false);
  const [showEchomoji, setShowEchomoji] = useState(false);
  const [shareText, setShareText] = useState('');
  const [onimojiText, setOnimojiText] = useState('');
  const [shareToCommunity, setShareToCommunity] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);

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
    } catch {
      // Ignore corrupted persisted state; start fresh
    }
  }, []);

  // persist minimal progress
  useEffect(() => {
    localStorage.setItem('inuitVoyageV1', JSON.stringify({ currentStep, stepsData }));
  }, [currentStep, stepsData]);

  // Compute guide when step changes
  useEffect(() => {
    const g = determineGuideByStep(currentStep);
    setGuide(g);
    setAnswers({});
    setQuizFailed(false);
    setShareText('');
    setOnimojiText('');
    setShareToCommunity(false);
    setPhase('quiz');
    setSelectedEmojis([]);
  }, [currentStep]);

  // When entering share phase, auto-fill onimoji from current selection
  useEffect(() => {
    if (phase === 'share') {
      setOnimojiText(selectedEmojis.join(' '));
    }
  }, [phase]);

  const toggleEmoji = useCallback((emoji) => {
    setSelectedEmojis((prev) => {
      const already = prev.includes(emoji);
      if (already) return prev.filter((e) => e !== emoji);
      if (prev.length >= 3) return prev; // cap at 3 selections
      return [...prev, emoji];
    });
  }, []);

  // Quiz helpers

  const quizForGuide = useMemo(
    () => (guide ? QUIZZES[guide.id].slice(0, QUESTIONS_PER_QUIZ) : []),
    [guide]
  );

  const setAnswer = (qIdx, choiceIdx) => {
    setQuizFailed(false);
    setAnswers((prev) => ({ ...prev, [qIdx]: choiceIdx }));
  };

  const onValidateQuiz = () => {
    const correctCount = quizForGuide.reduce((acc, q, idx) => acc + ((answers[idx] ?? -1) === q.correct ? 1 : 0), 0);
    if (correctCount === quizForGuide.length) {
      setPhase('reveal');
      setQuizFailed(false);
    } else {
      setQuizFailed(true);
    }
  };

  const retryQuiz = () => {
    setAnswers({});
    setQuizFailed(false);
  };

  // Simple local community store for Échomoji
  const readCommunity = () => {
    try {
      const raw = localStorage.getItem('echomojiCommunityV1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const writeCommunity = (items) => {
    try {
      localStorage.setItem('echomojiCommunityV1', JSON.stringify(items));
    } catch {
      // Ignore storage write errors (quota/permissions)
    }
  };

  const finishStep = () => {
    // Optionally append to community echoes
    if (shareToCommunity && (shareText.trim() || onimojiText.trim())) {
      const existing = readCommunity();
      existing.push({
        ts: Date.now(),
        step: currentStep,
        guideId: guide?.id,
        onimoji: onimojiText.trim(),
        text: shareText.trim(),
      });
      writeCommunity(existing);
    }

    const summary = {
      step: currentStep,
      guideId: guide?.id,
      quizPassed: true,
      share: shareToCommunity,
      onimoji: onimojiText.trim(),
      phrase: shareText.trim(),
    };
    setStepsData((prev) => [...prev, summary]);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
    } else {
      setPhase('complete');
    }
  };

  const resetJourney = () => {
    setCurrentStep(1);
    setGuide(null);
    setAnswers({});
    setQuizFailed(false);
    setStepsData([]);
    setShareText('');
    setOnimojiText('');
    setShareToCommunity(false);
    setPhase('quiz');
    localStorage.removeItem('inuitVoyageV1');
  };

  const allQuizAnswered =
    quizForGuide.length === QUESTIONS_PER_QUIZ &&
    Object.keys(answers).length === QUESTIONS_PER_QUIZ;

  const showSummary = phase === 'complete' || (currentStep > TOTAL_STEPS);

  const wisdomLines = guide ? GUIDE_WISDOM[guide.id] : [];

  return (
    <div className="home-container arctic-night" style={{ gap: '1rem', alignItems: 'stretch', position: 'relative' }}>
      <ArcticBackground />
      {!showSummary && (
        <div style={{ position: 'relative' }}>
          <StepHeader current={currentStep} total={TOTAL_STEPS} />
        </div>
      )}

      <div className="voyage-layout">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div className="hublot" style={{ width: 360, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {phase === 'reveal' && guide ? (
              <div className="guide-avatar" style={{ borderColor: guide.color }} aria-label={`Guide ${guide.label}`}>
                <div className="guide-emoji">{GUIDE_EMOJI[guide.id]}</div>
              </div>
            ) : (
              <div style={{ width: 320, height: 320 }}>
                <CosmojiD3
                  width={320}
                  height={320}
                  emojis={BASE_EMOJIS}
                  interactive={true}
                  selectedEmojis={selectedEmojis}
                  onToggleEmoji={toggleEmoji}
                />
              </div>
            )}
            {/* Radial quick menu around hublot */}
            <div className="hublot-menu">
              <button className="mini-btn" onClick={() => setShowCosmoji(true)} title="Cosmoji">🪐</button>
              <button className="mini-btn" onClick={() => setShowEchomoji(true)} title="Échomoji">🌀</button>
              <Link to="/atlas" className="mini-btn" title="Atlas">📚</Link>
              <Link to="/dreamteam" className="mini-btn" title="Dreamteam">👥</Link>
              <Link to="/" className="mini-btn" title="Accueil">🏠</Link>
            </div>
          </div>
        </div>

        <div className="side-panel">
          {!showSummary && phase === 'quiz' && guide && (
            <div>
              <div className="guide-card" style={{ borderColor: guide.color }}>
                <div className="guide-name" style={{ color: guide.color }}>{guide.label}</div>
                <div className="guide-gist">{guide.gist}</div>
                <div className="guide-narration">{GUIDE_EMOJI[guide.id]} « Pour cette étape, réponds aux 3 questions. Je veille et t’indique la voie juste. »</div>
              </div>

              {quizFailed && (
                <div className="banner-error">Certaines réponses sont inexactes. Réessaie jusqu’à réussir pour réveiller le guide.</div>
              )}

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

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="primary-button" disabled={!allQuizAnswered} onClick={onValidateQuiz}>
                  Valider le quiz
                </button>
                {quizFailed && (
                  <button className="primary-button" onClick={retryQuiz}>Recommencer</button>
                )}
              </div>
            </div>
          )}

          {!showSummary && phase === 'reveal' && guide && (
            <div>
              <div className="guide-card" style={{ borderColor: guide.color }}>
                <div className="guide-name" style={{ color: guide.color }}>Réveil de {guide.label}</div>
                <div className="wisdom-box">
                  {wisdomLines.map((line, i) => (
                    <p key={i} className="wisdom-line">{line}</p>
                  ))}
                </div>
                <div className="guide-narration">{GUIDE_EMOJI[guide.id]} « Écoute ces conseils. Quand tu es prêt·e, continue pour composer ton triangle d’onimoji. »</div>
              </div>
              <button className="primary-button" onClick={() => setPhase('share')}>
                Continuer
              </button>
            </div>
          )}

          {!showSummary && phase === 'share' && (
            <div>
              <h2 style={{ marginTop: 0 }}>Échoniriques de la communauté</h2>
              <p>Écris une courte phrase en résonance avec ton onimoji (3 émojis) et choisis si tu souhaites la partager.</p>
              <div className="guide-card" style={{ borderColor: guide?.color }}>
                <div className="guide-narration">{guide ? GUIDE_EMOJI[guide.id] : '🌙'} « Sélectionne précisément 3 émojis pour former un triangle. Puis écris une phrase qui résonne. Coche si tu souhaites partager. »</div>
              </div>

              <div className="tags-area">
                <div className="tag-input-row">
                  <input
                    value={onimojiText}
                    onChange={(e) => setOnimojiText(e.target.value)}
                    placeholder="Ton onimoji (3 émojis)"
                  />
                </div>
                <div className="tag-input-row">
                  <input
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                    placeholder="Phrase courte (ex: souffle clair, pas de hâte)"
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={shareToCommunity} onChange={(e) => setShareToCommunity(e.target.checked)} />
                  <span>Partager aux Échoniriques</span>
                </label>
              </div>

              <button className="primary-button" onClick={finishStep}>
                Terminer l’étape
              </button>
            </div>
          )}

          {showSummary && (
            <div>
              <h2 style={{ marginTop: 0 }}>Voyage terminé — guides éveillés et résonances</h2>
              {stepsData.length === 0 && <p>Aucune étape encore. Lance un nouveau voyage.</p>}
              <div className="summary-grid">
                {stepsData.map((s) => {
                  const g = GUIDE_DEFS.find((gd) => gd.id === s.guideId) || GUIDE_DEFS[0];
                  return (
                    <div key={s.step} className="summary-card">
                      <div className="summary-top">
                        <span className="badge" style={{ background: g.color, color: '#111' }}>{g.label}</span>
                        <div className="onimoji">{s.onimoji || '—'}</div>
                      </div>
                      <div className="summary-bottom" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                        <div className="muted">Étape {s.step}</div>
                        {s.phrase ? <div>“{s.phrase}”</div> : <div className="muted">pas de phrase partagée</div>}
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
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="selection-count">Sélection {selectedEmojis.length}/3</div>
              <span className="muted">Astuce: clique pour choisir/déchoisir; 3 forment un triangle.</span>
            </div>
          )}
        </div>
      </div>

      {/* Cosmoji Modal (view-only) */}
      {showCosmoji && (
        <div className="modal-overlay" onClick={() => setShowCosmoji(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCosmoji(false)} aria-label="Fermer">×</button>
            <h3 className="modal-title">Cosmoji</h3>
            <p className="muted">Carte des émojis — consultation seulement</p>
            <div className="hublot-wrapper" style={{ marginTop: 12 }}>
              <div className="hublot" style={{ width: 320, height: 320 }}>
                <CosmojiD3 width={280} height={280} emojis={BASE_EMOJIS} interactive={false} selectedEmojis={selectedEmojis} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Échomoji Modal */}
      {showEchomoji && (
        <div className="modal-overlay" onClick={() => setShowEchomoji(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEchomoji(false)} aria-label="Fermer">×</button>
            <h3 className="modal-title">Échomoji</h3>
            <EchomojiPanel readCommunity={readCommunity} />
          </div>
        </div>
      )}
    </div>
  );
}

function EchomojiPanel({ readCommunity }) {
  const items = readCommunity().slice().sort((a, b) => b.ts - a.ts);
  const topWords = computeTopWords(items.map((i) => i.text || '').join(' '));
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: 8 }}>
        <div className="badge">{items.length} partages</div>
      </div>
      {topWords.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Tendances sémantiques</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {topWords.map(([w, c]) => (
              <span key={w} className="emoji-pill">{w} ×{c}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gap: 8, maxHeight: 260, overflow: 'auto' }}>
        {items.map((it, idx) => (
          <div key={idx} className="summary-card">
            <div className="summary-top">
              <span className="muted">{new Date(it.ts).toLocaleString()}</span>
              <span className="badge">{it.guideId || '—'}</span>
            </div>
            <div className="summary-bottom" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <div className="onimoji">{it.onimoji || '—'}</div>
              <div>{it.text || '—'}</div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="muted">Aucun partage pour l’instant.</div>}
      </div>
    </div>
  );
}

function computeTopWords(text) {
  const stop = new Set(['', 'le', 'la', 'les', 'de', 'du', 'des', 'et', 'en', 'au', 'aux', 'un', 'une', 'à', 'pour', 'dans', 'que', 'qui', 'ne', 'pas', 'ce', 'ces', 'se', 'sur', 'avec']);
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => !stop.has(w) && w.length > 2);
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
}
