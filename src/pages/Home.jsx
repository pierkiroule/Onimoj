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
        Prendre soin de ses rêves. Explorer les cultures oniriques.
      </h2>

      {/* 🌠 INTRO */}
      <h1 className="home-title">Bienvenue dans l’aventure Onimoji</h1>
      <p className="intro-zone">
        Une expérience poétique et culturelle, où les rêves du monde se relient par résonance.  
        Chaque culture éclaire une manière d’habiter le monde :  
        ❄️ les Inuits écoutent le souffle du vent,  
        🌵 les Berbères dialoguent avec les étoiles du désert,  
        🌲 les Celtes conversent avec la forêt et les rivières.  
        Rêver devient un acte d’écoute : un lien entre soi, les autres et le vivant.
      </p>

      {/* 💫 POURQUOI */}
      <div className="card-glow">
        <h3 style={{ color: "#7fffd4" }}>Pourquoi Onimoji ?</h3>
        <p>
          Notre époque nous relie sans cesse, mais rarement en profondeur.  
          <strong>Onimoji</strong> invite à une écologie du rêve :  
          un espace de résonance où symboles, chants et paysages deviennent des passerelles.  
          Chaque rêve partagé rallume une mémoire du monde.
        </p>
      </div>

      {/* 🌀 COMMENT */}
      <div className="card-glow" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#7fffd4" }}>Comment participer ?</h3>
        <p>
          🌿 Choisis un horizon culturel.  
          💭 Découvre ses symboles et récits.  
          ✨ Laisse l’IA poétique t’aider à tisser ton propre rêve.
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
      <div className="footer">
        <p>Des voyages mythiques et oniriques pour apprendre à rêver vivant.</p>
        
      </div>
    </div>
  )
}