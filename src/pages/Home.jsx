import "../App.css"
import "./Home.css"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Home({ onStart, onLogin, onRegister }) {
  const [remaining, setRemaining] = useState(0)
  const [isOnimojiModalOpen, setIsOnimojiModalOpen] = useState(false)
  const DELAY = 12 * 60 * 60 * 1000 // 12h

  const isDev =
    import.meta.env.DEV ||
    (typeof window !== "undefined" &&
      ["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(window.location.hostname))

  // ========== COOLDOWN ==========
  useEffect(() => {
    checkCooldown()
  }, [])

  async function checkCooldown() {
    try {
      if (isDev && localStorage.getItem("devCooldownOff") === "true") {
        setRemaining(0)
        return
      }

      let last = parseInt(localStorage.getItem("lastDreamTime") || "0")

      try {
        const { data } = await supabase
          .from("dreams")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1)

        if (data?.[0]) {
          const supa = new Date(data[0].created_at).getTime()
          if (supa > last) {
            last = supa
            localStorage.setItem("lastDreamTime", last.toString())
          }
        }
      } catch {
        console.warn("🌙 Mode local : Supabase non joignable.")
      }

      const diff = DELAY - (Date.now() - last)
      setRemaining(diff > 0 ? diff : 0)
    } catch (e) {
      console.error("Erreur cooldown :", e)
    }
  }

  useEffect(() => {
    if (!remaining) return
    const timer = setInterval(() => {
      setRemaining((t) => (t > 1000 ? t - 1000 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [remaining])

  function format(ms) {
    const s = Math.floor(ms / 1000)
    const h = String(Math.floor(s / 3600)).padStart(2, "0")
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
    const sec = String(s % 60).padStart(2, "0")
    return `${h}:${m}:${sec}`
  }

  // ========== UI ==========
  return (
    <div className="home fade-in">

      {/* LOGO */}
      <div className="home-logo" style={{ marginBottom: "1rem" }}>
        <div className="moon-symbol" style={{ fontSize: "2.4rem" }}>🌘•°</div>
        <div className="brand-name" style={{ fontSize: "1.6rem", color: "#bfefff" }}>Onimoji</div>
      </div>

      {/* TAGLINE */}
      <div className="tagline">
        Une application de co-création onirique.  
        <br />
        Chaque jour, un fragment. Chaque fragment, une résonance.
      </div>

      {/* CTA explicatif */}
      <button
        className="onimoji-info-button"
        onClick={() => setIsOnimojiModalOpen(true)}
      >
        Découvrir l’esprit d’Onimoji
      </button>

      {/* COOLDOWN */}
      {remaining > 0 ? (
        <div style={borealBox}>
          <div style={{ fontSize: "0.9rem", color: "#aefcf5" }}>
            🌙 Prochain fragment disponible dans :
          </div>
          <div style={{
            color: "#7fffd4",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginTop: "0.3rem",
          }}>
            {format(remaining)}
          </div>

          <div className="boreal-hourglass" />
          <p style={{ fontSize: ".8rem", opacity: 0.8 }}>
            Laisse ton imaginaire se reposer avant de créer un nouveau fragment.
          </p>

          {/* MODE DEV */}
          {isDev && (
            <button
              onClick={() => {
                localStorage.setItem("devCooldownOff", "true")
                localStorage.removeItem("lastDreamTime")
                localStorage.removeItem("dreamLock")
                window.location.reload()
              }}
              style={devButtonStyle}
            >
              🧪 Désactiver le sablier (dev)
            </button>
          )}
        </div>
      ) : (
        <button className="dream-button" onClick={onStart}>
          🌠 Entrer dans la Constellation des Rêves
        </button>
      )}

      {/* INSCRIPTION */}
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button
          className="dream-button"
          style={{ background: "rgba(110,255,141,0.15)", color: "#6eff8d" }}
          onClick={onRegister}
        >
          🌙 Créer un compte voyageur
        </button>
      </div>

      {/* FOOTER */}
      <div className="footer" style={{ marginTop: "2rem" }}>
        <p>🌘 “Le rêve est la respiration de l’âme.” — <i>Bachelard</i></p>
        <p>Partager. Rêver. Tisser.</p>
      </div>

      {/* ========== MODAL ========= */}
      {isOnimojiModalOpen && (
        <div
          className="onimoji-modal-overlay"
          onClick={() => setIsOnimojiModalOpen(false)}
        >
          <div
            className="onimoji-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="onimoji-modal-close"
              onClick={() => setIsOnimojiModalOpen(false)}
            >
              ✕
            </button>

            <h2>Onimoji — Une poétique du rêve contemporain</h2>

            <p>
              Onimoji propose une autre manière de vivre et sentir son imaginaire :  
              non comme une performance, mais comme une **co-création quotidienne**,  
              nourrie par des figures symboliques, des récits courts et des gestes simples.
            </p>

            <p>
              Chaque horizon culturel (inuit, berbère, celtique…) ouvre une palette  
              d’images, de métaphores et d’atmosphères, à explorer sans pression.  
              Une démarche inspirée des approches psychoculturelles du rêve  
              (Tedlock, Devereux, Nathan).
            </p>

            <h3>À quoi sert Onimoji ?</h3>

            <ul className="onimoji-modal-list">
              <li><b>Donner une forme au vécu</b> — par une figure-alliée du jour.</li>
              <li><b>Ralentir</b> — grâce à un cycle naturel de 12h entre deux créations.</li>
              <li><b>Créer du sens</b> — avec des fragments courts, poétiques et non-directifs.</li>
              <li><b>Relier</b> — partager dans la Revothèque ou le Réso•°, sans jugement.</li>
            </ul>

            <p>
              Ici, rien n’est à optimiser.  
              Tu entres simplement dans une **écologie de la résonance**,  
              au rythme de ton imaginaire.
            </p>
          </div>
        </div>
      )}

      {/* CSS inline spécifique */}
      <style>{`
        .boreal-hourglass {
          margin: 1rem auto;
          width: 50px;
          height: 70px;
          position: relative;
          border: 2px solid rgba(127,255,212,0.5);
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(127,255,212,0.3);
          overflow: hidden;
        }
        .boreal-hourglass::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7fffd4;
          box-shadow: 0 0 8px #7fffd4;
          animation: borealBubble 1.8s ease-in-out infinite;
        }
        @keyframes borealBubble {
          0% { transform: translate(-50%, 40px) scale(0.6); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate(-50%, -40px) scale(1.2); opacity: 0; }
        }
      `}</style>

    </div>
  )
}

const borealBox = {
  background: "rgba(0,30,40,0.6)",
  border: "1px solid rgba(127,255,212,0.3)",
  borderRadius: "12px",
  padding: "1rem",
  margin: "1rem auto",
  maxWidth: "360px",
  textAlign: "center",
  boxShadow: "0 0 15px rgba(127,255,212,0.25)",
}

const devButtonStyle = {
  marginTop: "0.8rem",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(127,255,212,0.4)",
  borderRadius: "10px",
  padding: ".4rem 1rem",
  color: "#7fffd4",
  fontSize: ".85rem",
  cursor: "pointer",
}