import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container galaxy">
      <header className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="cosmic-title">🌙 Bienvenue, gardiens et gardiennes de la galaxie des Onimojis</h1>
        <p className="kicker">Vous entrez dans l’espace vivant du rêve, là où les étoiles oniriques résonnent encore.</p>
      </header>

      <hr className="divider" />

      <main className="narrative" aria-label="Présentation d'Onimoji">
        <section className="narrative-section" aria-labelledby="s-preserver-galaxie">
          <h2 id="s-preserver-galaxie" className="cosmic-heading">🌌 Préserver la galaxie du rêve</h2>
          <p>Chaque nuit, des milliers d’étoiles s’éteignent dans nos imaginaires. Nos rythmes s’accélèrent, nos nuits se contractent — le rêve se perd.</p>
          <p><strong>Onimoji</strong> naît pour préserver cette galaxie fragile : un écosystème d’images, de symboles et de cultures qui relient les humains au monde vivant.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-oni-moji">
          <h2 id="s-oni-moji" className="cosmic-heading">✨ Oni + Moji</h2>
          <p><strong>Oni</strong> pour onirique, le souffle du rêve.</p>
          <p><strong>Moji</strong> pour emoji, mojo, magie — le signe vivant, la vibration du sens.</p>
          <blockquote>
            <p>Ensemble : Onimoji, les petits génies du rêve,</p>
            <p>tisseurs de liens entre les cultures et les consciences.</p>
          </blockquote>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-constellations-culturelles">
          <h2 id="s-constellations-culturelles" className="cosmic-heading">🌍 Tisser les constellations culturelles</h2>
          <p>Les Onimojis portent la mémoire des sagesses du monde :</p>
          <ul className="emoji-list">
            <li>🌿 les Aborigènes et leur Terre du rêve,</li>
            <li>❄️ les Inuits et les esprits du vent,</li>
            <li>🕯️ les Grecs et la guérison par le sommeil,</li>
            <li>🪶 les Africains et la parole des ancêtres,</li>
            <li>🕊️ les Tibétains et la clarté de la conscience.</li>
          </ul>
          <p>Chaque tradition est une étoile onirique : ensemble, elles forment la grande toile culturelle du rêve.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-mission">
          <h2 id="s-mission" className="cosmic-heading">💫 Votre mission</h2>
          <p>Préserver ce ciel intérieur. Tisser les résonances entre les rêves anciens et les rêves d’aujourd’hui. Réapprendre à écouter la nuit comme un espace de soin et de lien.</p>
          <blockquote>
            <p>Ici, pas de performance : seulement la résonance.</p>
            <p>Pas de contrôle : seulement la connexion.</p>
          </blockquote>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-vibrer">
          <h2 id="s-vibrer" className="cosmic-heading">🎶 Faites vibrer les étoiles</h2>
          <p>Explorez les constellations d’Onimojis, composez votre carte céleste, laissez les sons, les symboles et les cultures s’accorder en vous.</p>
          <p>Chaque Onimoji rencontré rallume une étoile — une part de vous, une mémoire du monde.</p>
        </section>

        <hr className="divider" />

        <section className="narrative-section" aria-labelledby="s-onimoji">
          <h2 id="s-onimoji" className="cosmic-heading">🌙 Onimoji</h2>
          <blockquote>
            <p>Préserver le rêve, c’est préserver la résonance du vivant.</p>
            <p>Tissons ensemble la galaxie des Onimojis : un univers de sens, d’émotions et d’étoiles culturelles.</p>
          </blockquote>
        </section>

        <hr className="divider" />

        <section className="cta-area" aria-labelledby="s-cta">
          <h2 id="s-cta" className="visually-hidden">Commencer l’exploration</h2>
          <p className="cta-sub">Compose ta constellation, et choisis où commencer ton voyage.</p>
          <button className="primary-button" onClick={() => setIsOpen(true)}>
            choisir votre mission
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
                Partons découvrir comment les cultures du monde prennent soin du sommeil et de leur vie onirique.
                Tes rêves sont des ressources. Les guides du cosmoniris t'enseigneront les sagesses et vertus utiles à ta
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
