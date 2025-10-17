import { useState } from 'react';
import './App.css';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
