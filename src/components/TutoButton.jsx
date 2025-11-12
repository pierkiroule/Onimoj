import { useState, useEffect } from "react"

const tutoTexts = {
  home: {
    title: "Accueil du Réso•°",
    text: "Bienvenue dans le monde des résonances.\n- Connecte-toi pour rouvrir tes fragments.\n- Inscris-toi si c’est ta première traversée.\n- Clique sur « Commencer » pour choisir ton horizon.",
  },
  "mission-select": {
    title: "Choisir ton horizon",
    text: "Chaque carte révèle une culture onirique.\n- Lis la description pour ressentir son ambiance.\n- Sélectionne la voie Inuite pour débloquer ton premier voyage.\nTu pourras revenir ici à tout moment depuis le menu bas.",
  },
  "onimoji-journey": {
    title: "Créer ton fragment",
    text: "Modélise ton rêve étape par étape.\n- Choisis ton archétype et précise ton intention.\n- Sélectionne l’onimoji qui reflète ton état.\n- Valide pour enregistrer le fragment et nourrir la constellation collective.",
  },
  echoreso: {
    title: "Réseau ÉchoReso",
    text: "Observe les liens vivants entre les rêves.\n- Le hublot central réagit à ta voix ou aux sons importés.\n- Joue avec les contrôles pour ajuster la résonance.\n- Survole les nœuds pour suivre la vibration des fragments.",
  },
  revotheque: {
    title: "Revothèque personnelle",
    text: "Ici, tes rêves reposent en mémoire.\n- Ouvre un fragment pour revivre son récit.\n- Partage-le ou crée un doublon pour le transformer.\n- Utilise le bouton « + » pour lancer une nouvelle création.",
  },
  profil: {
    title: "Profil du voyageur",
    text: "Visualise ton parcours onirique.\n- Consulte tes constellations et statistiques.\n- Mets à jour ton identité de voyageur.\n- Déconnecte-toi ou change de page depuis le menu.",
  },
  default: {
    title: "Guide du Réso•°",
    text: "Chaque page t’offre ses repères.\n- Ouvre le tuto pour une vue d’ensemble rapide.\n- Referme-le ensuite, il reste toujours accessible dans le coin supérieur gauche.",
  },
}

export default function TutoButton({ page = "default" }) {
  const [open, setOpen] = useState(false)
  const tuto = tutoTexts[page] || tutoTexts.default

  // 🔹 Auto-affiche à la première navigation post refresh
  useEffect(() => {
    const key = `tutoSeen:${page}`
    const seen = sessionStorage.getItem(key)
    if (!seen) {
      setOpen(true)
      sessionStorage.setItem(key, "true")
    }
  }, [page])

  // 🔹 Fermer avec Échap
  useEffect(() => {
    const close = (e) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  return (
    <>
      {/* 🌙 Bouton compact coin haut gauche */}
      <div
        style={{
          position: "fixed",
          top: "0.8rem",
          left: "0.8rem",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "rgba(5, 18, 25, 0.7)",
            border: "1px solid rgba(127,255,212,0.35)",
            borderRadius: "12px",
            color: "#aefcf5",
            fontSize: "0.85rem",
            padding: "0.25rem 0.6rem",
            letterSpacing: "0.3px",
            cursor: "pointer",
            opacity: 0.8,
            width: "auto",
            minWidth: "64px",
            maxWidth: "fit-content",
            transition: "all 0.25s ease",
            boxShadow: "0 0 8px rgba(127,255,212,0.25)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.8)}
        >
          tuto•°
        </button>
      </div>

      {/* 🌌 Fenêtre du tuto */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 10, 20, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(0,25,35,0.95)",
              border: "1px solid rgba(127,255,212,0.3)",
              borderRadius: "18px",
              color: "#eafffb",
              padding: "1.4rem 1.2rem",
              width: "90%",
              maxWidth: "420px",
              textAlign: "center",
              boxShadow: "0 0 25px rgba(127,255,212,0.4)",
              position: "relative",
              animation: "fadeIn 0.4s ease",
            }}
          >
            <h3 style={{ color: "#7fffd4", marginBottom: "0.8rem" }}>{tuto.title}</h3>
            <p
              style={{
                whiteSpace: "pre-line",
                fontSize: ".95rem",
                lineHeight: 1.5,
                opacity: 0.9,
              }}
            >
              {tuto.text}
            </p>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: "1.2rem",
                background: "rgba(127,255,212,0.2)",
                border: "1px solid rgba(127,255,212,0.4)",
                color: "#aefcf5",
                borderRadius: "10px",
                padding: "0.45rem 1.2rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              ✕ Fermer
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  )
}