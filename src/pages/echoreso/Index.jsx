// src/pages/echoreso/Index.jsx
import { useCallback, useState } from "react"
import EchoResoFlow from "./EchoResoFlow"
import BookOfWisdom from "./BookOfWisdom"
import MeteoniriqueBoreale from "../../components/MeteoniriqueBoreale"
import DreamFragmentOverlay from "../../components/DreamFragmentOverlay"

export default function Index({ userId }) {
  return (
    <div
      style={{
        position: "relative",
        color: "#e9fffd",
        textAlign: "center",
        padding: "1rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* === Titre principal === */}
      <h2
        style={{
          color: "#7fffd4",
          marginBottom: ".5rem",
          textShadow: "0 0 10px rgba(127,255,212,0.3)",
        }}
      >
        🌌 ÉchoReso•°
      </h2>

      <p
        style={{
          opacity: 0.8,
          fontSize: ".9rem",
          marginBottom: "1.2rem",
        }}
      >
        <b>Réso•°</b> — Les rêves des uns deviennent les ressources des autres.
      </p>

      {/* === ✨ Titre du hublot météOnirique === */}
      <h3
        style={{
          color: "#aefcf5",
          marginTop: "1.5rem",
          marginBottom: ".8rem",
          textShadow: "0 0 15px rgba(127,255,212,0.4)",
          fontWeight: "normal",
          fontSize: "1.1rem",
          letterSpacing: ".5px",
        }}
      >
        ✨ La MétéOnirique au travers de notre hublot échocréatif
      </h3>

        {/* === 🪞 Hublot Météonorix === */}
        <HublotBlock userId={userId} />

      <p
        style={{
          fontSize: ".8rem",
          opacity: 0.7,
          marginBottom: "1.6rem",
          color: "#7fffd4",
        }}
      >
        <i>Hublot Météonorix — danse des résonances du Réso•°</i>
      </p>

      {/* === Graphe onirique interactif === */}
      <div
        style={{
          border: "1px solid rgba(127,255,212,0.2)",
          borderRadius: "12px",
          background: "rgba(0,25,35,0.25)",
          padding: "0",
          overflow: "hidden",
          height: "72vh",
          boxShadow: "inset 0 0 20px rgba(127,255,212,0.1)",
        }}
      >
        <EchoResoFlow userId={userId} />
      </div>

      {/* === Livre des Sagesses Oniriques === */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.2rem",
          border: "1px solid rgba(255,230,150,0.2)",
          borderRadius: "12px",
          background:
            "linear-gradient(180deg, rgba(30,25,10,0.4), rgba(10,8,2,0.8))",
          boxShadow: "0 0 25px rgba(255,230,150,0.15)",
        }}
      >
        <h3
          style={{
            color: "#ffe38e",
            marginBottom: "0.5rem",
            textShadow: "0 0 12px rgba(255,230,150,0.4)",
          }}
        >
          📖 Livre des Sagesses Oniriques
        </h3>

        <p
          style={{
            fontSize: ".85rem",
            opacity: 0.85,
            marginBottom: "1rem",
          }}
        >
          Ici reposent les rêves du Réso•° métamorphosés en sagesses collectives.  
          Une seule révélation IA par rêve, pour le bien commun du Réso.
        </p>

        <BookOfWisdom userId={userId} />
      </div>
    </div>
  )
}

function HublotBlock({ userId }) {
  const [audioIntensity, setAudioIntensity] = useState(0)

  const handleAudioLevel = useCallback((value = 0) => {
    setAudioIntensity(value)
  }, [])

  return (
    <div
      style={{
        position: "relative",
        width: "260px",
        margin: "0 auto 2rem auto",
      }}
    >
      <DreamFragmentOverlay audioIntensity={audioIntensity} userId={userId} />
      <div
        style={{
          position: "relative",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          margin: "0 auto",
          border: "1px solid rgba(127,255,212,0.25)",
          background:
            "radial-gradient(ellipse at center, #001020 0%, #000810 100%)",
          boxShadow:
            "0 0 25px rgba(127,255,212,0.25), inset 0 0 15px rgba(127,255,212,0.15)",
          overflow: "hidden",
        }}
      >
        <MeteoniriqueBoreale onAudioLevelChange={handleAudioLevel} />
      </div>
    </div>
  )
}