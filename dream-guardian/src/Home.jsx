import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import ArcticBackground from './shared/ArcticBackground';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container galaxy arctic-night">
      <ArcticBackground />
      <header className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="cosmic-title">🌙 Onimojis</h1>
        <p className="kicker">Un espace simple pour (re)découvrir le rêve et ses symboles vivants.</p>
      </header>

      <hr className="divider" />

      <main className="narrative" aria-label="Présentation d'Onimoji">
        <section className="narrative-section" aria-labelledby="s-intro">
          <h2 id="s-intro" className="cosmic-heading">🌌 Préserver le rêve, simplement</h2>
          <p><strong>Onimoji</strong> relie des sagesses oniriques du monde pour prendre soin de vos nuits.</p>
          <p>Explorez, répondez à 3 questions, composez un triangle d’émojis et laissez résonner.</p>
        </section>

        <hr className="divider" />

        <section className="cta-area" aria-labelledby="s-cta">
          <h2 id="s-cta" className="visually-hidden">Commencer l’exploration</h2>
          <p className="cta-sub">Commencez votre voyage onirique.</p>
          <button className="primary-button" onClick={() => setIsOpen(true)}>
            Commencer
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
