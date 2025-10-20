import './Home.css'

export default function Home({ onStart }) {
  return (
    <div className="home fade-in">
      {/* LOGO */}
      <div className="logo-zone">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="100"
          height="100"
          className="logo-svg"
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="#9fdfff" strokeWidth="3" opacity="0.3" />
          <path
            d="M120 100a40 40 0 1 1-40-40 30 30 0 0 0 40 40z"
            fill="#9fdfff"
            opacity="0.4"
          />
          <text x="100" y="112" textAnchor="middle" fontSize="32" fill="#9fdfff">🌘</text>
        </svg>
        <h1 className="home-title">Onimoji</h1>
        <p className="tagline">
          Ton étoile de poésie<br />
          pour prendre soin de tes rêves<br />
          et des cultures oniriques du monde.
        </p>
      </div>

      {/* ARGUMENTAIRE */}
      <div className="argument card-glow">
        <h2>🧠 Une approche fondée sur la résonance</h2>
        <p>
          <strong>Onimoji</strong> s’appuie sur les travaux en psychologie, neurosciences et anthropologie du rêve.
          L’expérience invite à une <em>écoute sensible</em> du lien entre soi, le monde et la mémoire culturelle du rêve.
        </p>
        <p>
          Chaque étoile que tu tisses active ton imagination, ta mémoire et ton empathie culturelle :
          un entraînement doux à la créativité onirique.
        </p>
      </div>

      {/* AMORCE NARRATIVE */}
      <div className="narrative card-glow">
        <h2>🚀 L’aventure commence ici</h2>
        <p>
          Entre dans le <strong>CosmoDream</strong>, un univers vivant où les mots deviennent étoiles.<br />
          Trois missions culturelles t’attendent :<br />
          <span className="mission-list">🌙 Inuite — 🏜️ Berbère — 🌳 Celtique</span>
        </p>
        <p>
          Ces missions t’apprendront à écouter les rêves du monde et à tisser les tiens.<br />
          Prépare-toi à embarquer à bord de la <strong>navette Onirix Beta One</strong>.
        </p>

        <button className="dream-button" onClick={onStart}>
          🌠 Choisir ta mission
        </button>
      </div>

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One • développé avec ❤️ et résonance
      </footer>
    </div>
  )
}