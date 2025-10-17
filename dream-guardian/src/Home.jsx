import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Bienvenue à gardien du cosmos onirique</h1>

      <button className="primary-button" onClick={() => setIsOpen(true)}>
        choisir ta mission
      </button>

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
