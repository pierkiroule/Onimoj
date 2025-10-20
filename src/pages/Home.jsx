import './Home.css'

export default function Home({ onStart }) {
  return (
    <div className="home fade-in">
      {/* TAGLINE */}
      <div className="intro-zone">
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
          <strong>Onimoji</strong> s’appuie sur la psychologie, les neurosciences
          et l’anthropologie du rêve. L’expérience invite à une{' '}
          <em>écoute sensible</em> du lien entre soi, le monde et la mémoire
          culturelle du rêve.
        </p>
        <p>
          Chaque étoile que tu tisses active ton imagination, ta mémoire et ton
          empathie culturelle : un entraînement doux à la créativité onirique.
        </p>
      </div>

      {/* NARRATION */}
      <div className="narrative card-glow">
        <h2>🚀 L’aventure commence ici</h2>
        <p>
          Entre dans le <strong>CosmoDream</strong>, un univers vivant où les mots
          deviennent étoiles.<br />
          Trois missions culturelles t’attendent :<br />
          <span className="mission-list">🌙 Inuite — 🏜️ Berbère — 🌳 Celtique</span>
        </p>
        <p>
          Ces missions t’apprendront à écouter les rêves du monde et à tisser les
          tiens.<br />
          Prépare-toi à embarquer à bord de la{' '}
          <strong>navette Onirix Beta One</strong>.
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