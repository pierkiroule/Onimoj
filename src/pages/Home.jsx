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
{/* 🌘 LOGO VERTICAL CENTRÉ */}
<div className="home-logo fade-in">
  <div className="moon-symbol">🌘•°</div>
  <div className="brand-name">Onimoji</div>
</div>

      {/* 🪶 SLOGAN D'ACCUEIL */}
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
        Prendre soin de ses rêves en explorant les univers culturels oniriques.
      </h2>

      {/* 🌠 TITRE PRINCIPAL */}
      <h1 className="home-title">Bienvenue à bord de la Navette MythOniris</h1>

      {/* 🌌 INTRODUCTION */}
      <p className="intro-zone">
        Onimoji est une expérience de décentration culturelle pour expérimenter d'autres conceptions du monde et autre rapport aux fonctions du sommeil et des rêves.  
    
      </p>

      {/* 💫 SECTION — POURQUOI */}
      <div className="card-glow">
        <h3 style={{ color: "#7fffd4" }}>Pourquoi Onimoji ?</h3>
        <p>
          L’hypermodernité nous a rendus performants, connectés, réactifs… mais souvent déconnectés de nos mondes intérieurs.

Pourtant, chaque culture rêve le monde à sa manière.
Les Inuits écoutent les esprits du vent et de la mer.
Les Berbères dialoguent avec les étoiles du désert.
Les Celtes conversent avec la forêt et les rivières.

En explorant ces imaginaires, nous apprenons à écouter autrement :
à percevoir la résonance entre nos rêves, nos paysages et nos relations.
Rêver devient un acte écologique et symbolique, une manière de soigner le lien entre soi, les autres et le monde vivant.

Retrouver une santé onirique collective,
c’est réapprendre à tisser des récits, à partager nos songes, à reconnaître dans chaque rêve une parcelle du vivant qui cherche à résonner.
        </p>
      </div>

      {/* 🌀 SECTION — COMMENT ÇA MARCHE */}
      <div className="card-glow" style={{ marginTop: "1rem" }}>
        <h3 style={{ color: "#7fffd4" }}>Comment ça marche ?</h3>
        <p>
          🚀 Embarque à bord d’Oniris et choisis ton premier horizon culturel.  
          🌊 Explore les hyperbulles, découvre leurs symboles, leurs chants, leurs paysages.  
          💭 Lors du voyage, une IA poétique t’invite à tisser un rêve personnalisé à partager dans le groupe.
        </p>
      </div>

      {/* ✨ BOUTONS D’ACTION */}
      <div style={{ marginTop: "1.6rem" }}>
        <button className="dream-button" onClick={onStart}>
          Embarquer dans Oniris
        </button>

        <button
          className="dream-button"
          style={{
            background: "rgba(127,255,212,0.15)",
            color: "#7fffd4",
            marginLeft: "0.6rem",
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
            marginLeft: "0.6rem",
          }}
          onClick={onRegister}
        >
          Inscription
        </button>
      </div>

      {/* 🌙 PIED DE PAGE */}
      <div className="footer">
        <p>12 voyages culturels pour explorer les rêves de la Terre.</p>
        <p>Chaque hyperbulle rallumée tisse un fil dans la trame du vivant.</p>
      </div>
    </div>
  )
}
