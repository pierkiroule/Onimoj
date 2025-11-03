import "../App.css"
import "./Home.css"

export default function Home({ onStart, onLogin, onRegister }) {
  return (
    <div className="home fade-in">
      {/* 🌘 LOGO */}
      <div className="home-logo fade-in" style={{ marginBottom: "1rem" }}>
        <div className="moon-symbol" style={{ fontSize: "2.4rem" }}>🌘•°</div>
        <div className="brand-name" style={{ fontSize: "1.6rem", color: "#bfefff" }}>
          Onimoji
        </div>
      </div>

      {/* ✨ SLOGAN */}
      <div className="tagline">
        Cueille le rêve  
        <br />
        pour réveiller le jour.
      </div>

      {/* 🌙 PREMIER BLOC — Sens */}
      <div className="card-glow">
        <h2>Et si le rêve redevenait vital ?</h2>
        <p>
          Assez d’applis qui notent ton sommeil.  
          <br />
          Ici, on ne cherche pas à dormir mieux —  
          on apprend à rêver vivant.
        </p>
        <p>
          <b>Onimoji</b> t’invite à écouter la nuit  
          comme un souffle du monde.  
          Rêver, c’est déjà prendre soin.
        </p>
      </div>

      {/* 🌿 DEUXIÈME BLOC — Cultures du rêve */}
      <div className="card-glow">
        <h2>Les gardiens du sommeil</h2>
        <p>
          ❄️ Les Inuits murmurent au vent de Sila.  
          <br />
          🌵 Les Berbères lisent les étoiles du désert.  
          <br />
          🌲 Les Celtes conversent avec les rivières.  
        </p>
        <p>
          Chaque culture porte un art du rêve,  
          un savoir ancien pour habiter la nuit.
        </p>
      </div>

      {/* 🌀 TROISIÈME BLOC — Expérience collective */}
      <div className="card-glow">
        <h2>Une aventure à partager</h2>
        <p>
          🌙 Choisis ton esprit-guide.  
          <br />
          💭 Crée ton rêve du soir.  
          <br />
          ✨ Découvre ceux du collectif.
        </p>
        <p>
          Ensemble, nous tissons une écologie du rêve :  
          lente, libre, résonante.
        </p>
      </div>

      {/* 🚀 ACTIONS */}
      <button className="dream-button" onClick={onStart}>
        🌠 Commencer le voyage
      </button>

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button
          className="dream-button"
          style={{
            background: "rgba(127,255,212,0.15)",
            color: "#7fffd4",
            boxShadow: "0 0 10px rgba(127,255,212,0.3)",
          }}
          onClick={onLogin}
        >
          Connexion
        </button>
        <button
          className="dream-button"
          style={{
            background: "rgba(110,255,141,0.15)",
            color: "#6eff8d",
            boxShadow: "0 0 10px rgba(110,255,141,0.3)",
          }}
          onClick={onRegister}
        >
          Inscription
        </button>
      </div>

      {/* 🌌 FOOTER */}
      <div className="footer">
        <p>
          🌘 Onimoji — apprendre à rêver pour mieux veiller le monde.
        </p>
      </div>
    </div>
  )
}