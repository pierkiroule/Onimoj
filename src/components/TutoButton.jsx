import { useState, useEffect } from "react"

const tutoTexts = {
  home: {
    title: "Accueil du Réso•°",
    text: "Bienvenue dans le monde des résonances.\nDepuis ici, tu peux commencer ton exploration onirique, te connecter ou t’inscrire pour créer ton premier fragment de rêve.",
  },
  "mission-select": {
    title: "Choisir ton horizon",
    text: "Chaque carte représente une culture onirique.\nPour le moment, seule la voie Inuite est ouverte. Sélectionne-la pour entrer dans ton premier voyage intérieur.",
  },
  "onimoji-journey": {
    title: "Créer ton fragment",
    text: "Modelise ton rêve : choisis ton archétype, ton onimoji et ton intention.\nChaque création nourrit la résonance collective du Réso•°.",
  },
  echoreso: {
    title: "Réseau ÉchoReso",
    text: "Observe les liens vivants entre les rêves.\nLe hublot central réagit à la matière sonore, et le graphe te montre comment les fragments s’appellent les uns les autres.",
  },
  revotheque: {
    title: "Revothèque personnelle",
    text: "Ici, tes rêves reposent en mémoire.\nTu peux les rouvrir, les partager ou en créer de nouveaux.",
  },
  profil: {
    title: "Profil du voyageur",
    text: "Visualise ton parcours onirique.\nTes créations, échos et voyages s’inscrivent ici comme des constellations de ton chemin intérieur.",
  },
  default: {
    title: "Guide du Réso•°",
    text: "Chaque page t’offre ses repères.\nCe bouton tuto•° reste discret, toujours à portée de main, pour t’aider à t’orienter.",
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