import "../App.css"

export default function Home({ onStart, onLogin, onRegister }) {
  return (
    <div
      className="fade-in"
      style={{
        textAlign: "center",
        padding: "2rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* 🌘 LOGO CENTRÉ */}
      <div className="home-logo fade-in">
        <div className="moon-symbol">🌘•°</div>
        <div className="brand-name">Onimoji</div>
      </div>

      {/* 🪶 SLOGAN */}
      <h2
        className="tagline"
        style={{
          fontSize: "1.2rem",
          fontStyle: "italic",
          color: "#bfefff",
          marginTop: "1rem",
          marginBottom: "1.6rem",
          textShadow: "0 0 8px rgba(180,220,255,0.4)",
        }}
      >
        Prendre soin de son sommeil en cultivant ses rêves.  
        Explorer les univers culturels oniriques.
      </h2>

      {/* 🌠 INTRO */}
      <h1 className="home-title">Bienvenue à bord de la navette Oniris 🚀</h1>
      <p className="intro-zone" style={{ maxWidth: "600px", margin: "1rem auto" }}>
        Une exploration de l’univers poétique, onirique et culturel,  
        où les rêves du monde se relient en résonance.
        <br /><br />
        Chaque culture éclaire une manière d’habiter le monde et de rêver :
        <br />
        ❄️ Les Inuits écoutent le souffle du vent.  
        <br />
        🌵 Les Berbères dialoguent avec les étoiles du désert.  
        <br />
        🌲 Les Celtes conversent avec la forêt et les rivières.  
        <br /><br />
        Rêver devient un acte d’écoute :  
        un lien entre soi, les autres et le vivant.
      </p>

      {/* 💫 POURQUOI */}
      <div className="card-glow" style={{ maxWidth: "600px", margin: "1.5rem auto" }}>
        <h3 style={{ color: "#7fffd4" }}>Pourquoi Onimoji ?</h3>
        <p>
          Nous sommes connectés à tout, sauf à nos rêves.  
          <strong>Onimoji</strong> invite à une écologie du rêve :  
          un espace de résonance où les symboles et les émotions deviennent des passerelles.  
          Chaque rêve partagé fait vibrer les sagesses du monde.
        </p>
      </div>

      {/* 🌀 COMMENT */}
      <div className="card-glow" style={{ marginTop: "1rem", maxWidth: "600px", margin: "0 auto" }}>
        <h3 style={{ color: "#7fffd4" }}>Comment participer ?</h3>
        <p>
          🌿 Choisis un horizon culturel.  
          <br />
          💭 Découvre ses symboles et récits.  
          <br />
          ✨ Cocrée chaque jour, avec notre inspir-IA, tes ressources oniriques.
        </p>
      </div>

      {/* ✨ BOUTONS */}
      <div
        style={{
          marginTop: "1.6rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
        }}
      >
        <button className="dream-button" onClick={onStart}>
          Explorer Onimoji
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.6rem",
          }}
        >
          <button
            className="dream-button"
            style={{
              background: "rgba(127,255,212,0.15)",
              color: "#7fffd4",
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
            }}
            onClick={onRegister}
          >
            Inscription
          </button>
        </div>
      </div>

      {/* 🌙 FOOTER */}
      <div className="footer" style={{ marginTop: "1.5rem", opacity: 0.85 }}>
        <p>Des voyages culturels pour apprendre à rêver vivant.</p>
      </div>
    </div>
  )
}