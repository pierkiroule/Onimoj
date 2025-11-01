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
      {/* 🌘 LOGO */}
      <div className="home-logo fade-in">
        <div className="moon-symbol">🌘•°</div>
        <div className="brand-name">Onimoji</div>
      </div>

      {/* 🪶 SLOGAN */}
      <h2
        style={{
          fontSize: "1.2rem",
          fontStyle: "italic",
          color: "#bfefff",
          marginTop: "1rem",
          marginBottom: "1.6rem",
          textShadow: "0 0 8px rgba(180,220,255,0.4)",
        }}
      >
        Voyage onirique, culturel et collectif.  
        Apprends à inspirer tes rêves.
      </h2>

      {/* 🌌 INTRO SIMPLE */}
      <p style={{ maxWidth: "600px", margin: "1rem auto" }}>
        <strong>Onimoji</strong> t’invite à explorer les sagesses du monde à travers le rêve.  
        Ensemble, nous allons apprendre à <b>cocréer des suggestions oniriques</b>  
        pour prendre soin du sommeil, de l’imaginaire et du lien au vivant.
        <br /><br />
        ❄️ Les Inuits écoutent le souffle du vent.  
        <br />
        🌵 Les Berbères lisent les étoiles du désert.  
        <br />
        🌲 Les Celtes conversent avec les forêts et les rivières.  
        <br /><br />
        Chaque culture devient une porte pour rêver autrement.
      </p>

      {/* 💫 POURQUOI */}
      <div className="card-glow" style={{ maxWidth: "600px", margin: "1.5rem auto" }}>
        <h3 style={{ color: "#7fffd4" }}>Pourquoi participer ?</h3>
        <p>
          Nous avons perdu le lien avec nos rêves.  
          <b>Onimoji</b> propose une écologie du rêve :  
          apprendre à écouter, partager et nourrir le monde intérieur.  
          Rêver devient un acte de soin, de culture et de lien.
        </p>
      </div>

      {/* 🌿 COMMENT */}
      <div className="card-glow" style={{ marginTop: "1rem", maxWidth: "600px", margin: "0 auto" }}>
        <h3 style={{ color: "#7fffd4" }}>Comment ça marche ?</h3>
        <p>
          🌙 Choisis une culture à explorer.  
          <br />
          💭 Découvre ses symboles et ses récits.  
          <br />
          ✨ Laisse-toi guider pour créer chaque soir ta suggestion onirique personnalisée.
        </p>
      </div>

      {/* ✨ BOUTONS */}
      <div
        style={{
          marginTop: "1.8rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.8rem",
        }}
      >
        <button className="dream-button" onClick={onStart}>
          🌠 Commencer le voyage
        </button>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            className="dream-button"
            style={{ background: "rgba(127,255,212,0.15)", color: "#7fffd4" }}
            onClick={onLogin}
          >
            Connexion
          </button>
          <button
            className="dream-button"
            style={{ background: "rgba(110,255,141,0.15)", color: "#6eff8d" }}
            onClick={onRegister}
          >
            Inscription
          </button>
        </div>
      </div>

      {/* 🌙 FOOTER */}
      <div className="footer" style={{ marginTop: "2rem", opacity: 0.85 }}>
        <p>🌌 Un voyage collectif pour réapprendre à rêver vivant.</p>
      </div>
    </div>
  )
}