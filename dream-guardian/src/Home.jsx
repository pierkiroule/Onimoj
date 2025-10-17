import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">🌙 Bienvenue dans le monde résonant des Onimojis</h1>
        <p className="kicker">Là où rêver redevient un acte de lien, et non de performance.</p>
      </header>

      <hr className="divider" />

      <main className="narrative" aria-label="Présentation d'Onimoji">
        <section className="narrative-section" aria-labelledby="s-oni-moji">
          <h2 id="s-oni-moji">✨ Oni + Moji</h2>
          <p><strong>Oni</strong>, pour onirique — le souffle du rêve.</p>
          <p><strong>Moji</strong>, pour emoji, mojo, magie — le signe vivant, l’énergie du sens.</p>
          <blockquote>
            Ensemble, Onimoji, les petits génies du rêve, nés de la rencontre entre imaginaire et culture.
          </blockquote>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-langage-universel">
          <h2 id="s-langage-universel">💫 Le rêve, un langage universel</h2>
          <p>Depuis toujours, les peuples du monde savent que le rêve relie :</p>
          <ul className="emoji-list">
            <li>🌿 les Aborigènes à la Terre et aux ancêtres,</li>
            <li>❄️ les Inuits aux esprits de la nature,</li>
            <li>🕯️ les Grecs à la guérison,</li>
            <li>🪶 les Africains aux ancêtres,</li>
            <li>🕊️ les Tibétains à la clarté intérieure.</li>
          </ul>
          <p>Chaque culture y voit une forme de résonance — entre soi, le monde et le vivant.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-ce-que-change">
          <h2 id="s-ce-que-change">🌌 Ce que change Onimoji</h2>
          <p>Les applis de bien-être cherchent à mesurer, optimiser, contrôler. Onimoji fait l’inverse :</p>
          <blockquote>écouter, ralentir, relier.</blockquote>
          <p>Ici, pas de performance, juste une écologie du rêve. Un espace culturel et poétique pour retrouver l’art d’habiter la nuit.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-experience">
          <h2 id="s-experience">🎶 Une expérience sensible et résonante</h2>
          <p>Les Onimojis sont des esprits-symboles :</p>
          <ul className="emoji-list">
            <li>porteurs de récits et d’émotions,</li>
            <li>inspirés des traditions du monde,</li>
            <li>reliés en constellation sonore et visuelle.</li>
          </ul>
          <p>Chaque Onimoji t’aide à te réaccorder à ton monde intérieur et au vivant autour de toi.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-promesse">
          <h2 id="s-promesse">🌙 Notre promesse</h2>
          <blockquote>
            Onimoji ne t’aide pas à « mieux dormir » — il t’aide à mieux rêver.
          </blockquote>
          <p>Rêver comme un acte de santé, de culture et de lien. Rêver pour se réaccorder au monde.</p>
        </section>

        <hr className="divider" />

        <section className="cta-area" aria-labelledby="s-cta">
          <h2 id="s-cta" className="visually-hidden">Commencer l’exploration</h2>
          <p className="cta-sub">Onimoji — l’app qui change le rêve : de la performance individuelle à la résonance culturelle.</p>
          <button className="primary-button" onClick={() => setIsOpen(true)}>
            choisir ta mission
          </button>
        </section>
      </main>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)} aria-label="Fermer">
              ×
            </button>
            <div className="modal-content">
              <p>
                Partons ensemble découvrir comment les cultures du monde prennent soin du sommeil et de leur vie onirique.
                Tes rêves sont des ressources. Les guides du cosmoniris t'enseignerons les sagesses et vertues utiles à ta
                santé onirique.
              </p>
              <h2 style={{ marginTop: '0.75rem', fontSize: '1.25rem' }}>Choisis ta destination</h2>
              <div className="missions-grid">
                <button
                  className="mission-card"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/voyage/inuit');
                  }}
                >
                  <div className="mission-title">Inuit</div>
                  <div className="mission-desc">Voyage onirique actif</div>
                </button>
                <div className="mission-card disabled">
                  <div className="mission-title">Berbère</div>
                  <div className="mission-desc">Bientôt disponible</div>
                  <span className="tag">bientôt</span>
                </div>
                <div className="mission-card disabled">
                  <div className="mission-title">Celtique</div>
                  <div className="mission-desc">Bientôt disponible</div>
                  <span className="tag">bientôt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
