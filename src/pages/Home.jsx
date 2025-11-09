// src/pages/Home.jsx
import "../App.css"
import "./Home.css"
import { supabase } from "../supabaseClient"

export default function Home({ onStart, onLogin, onRegister }) {
  async function handleFullSeed() {
    const confirmSeed = confirm("🌌 Peuple toute ta base de démonstration ?")
    if (!confirmSeed) return

    try {
      // 1️⃣ Profil démo
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

      // 2️⃣ Gardiens fondateurs
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

      // 3️⃣ Rêves initiaux liés aux gardiens
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

      // 4️⃣ Résonances entre rêves
      const { data: allDreams } = await supabase.from("dreams").select("id").limit(10)
      if (allDreams?.length > 1) {
        for (let i = 0; i < allDreams.length - 1; i++) {
          await supabase.from("resonance_links").insert({
            source_dream_id: allDreams[i].id,
            target_dream_id: allDreams[i + 1].id,
            strength: Math.random(),
          })
        }
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
        <div className="brand-name" style={{ fontSize: "1.6rem", color: "#bfefff" }}>
          Onimoji
        </div>
      </div>

      <div className="tagline">Prendre soin des gardiens du sommeil.</div>

      <div className="card-glow">
        <h2>Cueille le rêve.</h2>
        <p>
          <b>Onimoji</b> est une aventure poétique où chaque rêve devient un geste de soin.
        </p>
      </div>

      <div className="card-glow">
        <h2>Les voyages Onimoji</h2>
        <p>
          ❄️ <b>Inuit</b> — souffle de Sila et sagesse des glaces.<br />
          🌲 <b>Celtique</b> — entre arbres et songes.<br />
          🌵 <b>Berbère</b> — étoiles du désert et vents de mémoire.
        </p>
      </div>

      <button className="dream-button" onClick={onStart}>
        🌠 Entrer dans la Constellation des Rêves
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
          🧩 Peupler ma base (démo complète)
        </button>
      </div>

      <div className="footer" style={{ marginTop: "2rem" }}>
        <p>🌘 “Le rêve est la respiration de l’âme.” — <i>Bachelard</i></p>
      </div>
    </div>
  )
}