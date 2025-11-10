import "../App.css"
import "./Home.css"
import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export default function Home({ onStart, onLogin, onRegister }) {
  const [remaining, setRemaining] = useState(0)
  const DELAY = 12 * 60 * 60 * 1000 // 12h

  const isDev =
    import.meta.env.MODE === "development" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname)

  // 🕰️ Vérifie le dernier rêve généré
  useEffect(() => {
    checkCooldown()
  }, [])

  async function checkCooldown() {
    try {
      // 🔧 Mode dév : sablier désactivé → on sort direct
      if (isDev && localStorage.getItem("devCooldownOff") === "true") {
        setRemaining(0)
        return
      }

      // Local cache
      const localTime = localStorage.getItem("lastDreamTime")
      let last = localTime ? parseInt(localTime) : 0

      // Tentative réseau (sauf si offline)
      try {
        const { data } = await supabase
          .from("dreams")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1)
        if (data?.[0]) {
          const supaTime = new Date(data[0].created_at).getTime()
          if (supaTime > last) {
            last = supaTime
            localStorage.setItem("lastDreamTime", last.toString())
          }
        }
      } catch {
        console.warn("🌙 Mode local : Supabase non joignable.")
      }

      const now = Date.now()
      const diff = DELAY - (now - last)
      if (diff > 0) setRemaining(diff)
      else setRemaining(0)
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

  // 🌱 Base de démonstration
  async function handleFullSeed() {
    const confirmSeed = confirm("🌌 Peupler ta base de démonstration ?")
    if (!confirmSeed) return
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("username", "Demo")
        .single()

      const demoUserId = existingProfile?.user_id || crypto.randomUUID()

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          user_id: demoUserId,
          username: "Demo",
          email: "demo@onimoji.fr",
          emoji: "🌘",
          culture: "Inuite",
        })
      }

      const guardians = [
        { emoji: "🌬️", name: "Sila", element: "Air", description: "Souffle du Nord et messager des vents." },
        { emoji: "🔥", name: "Tuktu", element: "Feu", description: "Flamme des aurores boréales." },
        { emoji: "💧", name: "Nuviaq", element: "Eau", description: "Larme des glaces, gardienne des reflets." },
        { emoji: "🌿", name: "Kina", element: "Terre", description: "Mousse des songes et respiration du monde." },
        { emoji: "🪶", name: "Qilak", element: "Ciel", description: "Messagère des souvenirs célestes." },
      ]

      for (const g of guardians) {
        await supabase.from("onimoji_guardians").insert({
          emoji: g.emoji,
          name: g.name,
          description: g.description,
          element: g.element,
          culture: "Inuite",
          image_url: `https://picsum.photos/seed/${g.name}/300`,
        })
      }

      const dreams = [
        {
          titre: "Souffle du matin",
          contenu: "Dans la brume, Sila murmure le secret des aurores.",
          tags: ["brume", "souffle", "aurore", "calme", "écoute"],
          guardian_id: 1,
        },
        {
          titre: "Feu dans la glace",
          contenu: "Tuktu danse dans le silence des cristaux.",
          tags: ["flamme", "neige", "danse", "feu", "reflet"],
          guardian_id: 2,
        },
        {
          titre: "Chant de la mousse",
          contenu: "Kina invite les racines à rêver sous la pluie.",
          tags: ["terre", "mousse", "pluie", "souvenir", "respiration"],
          guardian_id: 4,
        },
      ]

      for (const d of dreams) {
        await supabase.from("dreams").insert({
          user_id: demoUserId,
          guardian_id: d.guardian_id,
          titre: d.titre,
          contenu: d.contenu,
          tags: d.tags,
          image_url: `https://picsum.photos/seed/${d.titre}/400`,
          visible: true,
        })
      }

      alert("🌟 Base peuplée avec succès : gardiens + rêves + résonances !")
    } catch (err) {
      console.error("⚠️ Erreur seed:", err)
      alert("Erreur pendant le peuplement : " + err.message)
    }
  }

  return (
    <div className="home fade-in">
      <div className="home-logo fade-in" style={{ marginBottom: "1rem" }}>
        <div className="moon-symbol" style={{ fontSize: "2.4rem" }}>🌘•°</div>
        <div className="brand-name" style={{ fontSize: "1.6rem", color: "#bfefff" }}>Onimoji</div>
      </div>

      <div className="tagline">
        Embarquez dans une quête pour developper des ressources culturelles oniriques. Prenons soin des rêves transmis par les gardiens du sommeil.
      </div>

      {remaining > 0 ? (
        <div style={borealBox}>
          <div style={{ fontSize: "0.9rem", color: "#aefcf5" }}>
            🌙 Ton prochain voyage onirique sera disponible dans :
          </div>
          <div
            style={{
              color: "#7fffd4",
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginTop: "0.3rem",
            }}
          >
            {format(remaining)}
          </div>
          <div className="boreal-hourglass" />
          <p style={{ fontSize: ".8rem", opacity: 0.8 }}>
            Laisse ton rêve s’intégrer avant d’en semer un nouveau.
          </p>

          {/* 🔧 Bouton DEV pour désactiver le sablier */}
          {isDev && (
            <button
              onClick={() => {
                localStorage.setItem("devCooldownOff", "true")
                localStorage.removeItem("lastDreamTime")
                localStorage.removeItem("dreamLock")
                alert("🧪 Mode dév : sablier désactivé.")
                window.location.reload()
              }}
              style={{
                marginTop: "0.8rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(127,255,212,0.4)",
                borderRadius: "10px",
                padding: ".4rem 1rem",
                color: "#7fffd4",
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              🧪 Désactiver le sablier (mode dév)
            </button>
          )}
        </div>
      ) : (
        <button className="dream-button" onClick={onStart}>
          🌠 Rejoindre la Constellation des Rêves
        </button>
      )}

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button
          className="dream-button"
          style={{ background: "rgba(110,255,141,0.15)", color: "#6eff8d" }}
          onClick={onRegister}
        >
          🌙 RÊVeille l'Écho•° du rêve qui sommeille en toi !
        </button>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={handleFullSeed}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(127,255,212,0.4)",
            borderRadius: "10px",
            padding: ".6rem 1rem",
            color: "#7fffd4",
            cursor: "pointer",
            fontSize: ".9rem",
          }}
        >
          🧩 Découvrir les quêtes oniriques
        </button>
      </div>

      <div className="footer" style={{ marginTop: "2rem" }}>
        <p>🌘 “Le rêve est la respiration de l’âme.” — <i>Bachelard</i></p>
        <p>Partagez vos rêves, cultivez votre sommeil.</p>
      </div>

      <style>
        {`
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
      `}
      </style>
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