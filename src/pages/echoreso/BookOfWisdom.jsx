// src/pages/echoreso/BookOfWisdom.jsx
import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import WisdomModal from "./WisdomModal"

export default function BookOfWisdom({ userId }) {
  const [wisdoms, setWisdoms] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [guardianFilter, setGuardianFilter] = useState("Tous")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  // --- Charger toutes les sagesses ---
  useEffect(() => {
    loadWisdoms()
  }, [])

  async function loadWisdoms() {
    setLoading(true)
    const { data, error } = await supabase
      .from("dream_archive")
      .select("id, guardian_name, generated_at, wisdom_text")
      .eq("wisdom_generated", true)
      .order("generated_at", { ascending: false })

    if (!error && data) {
      setWisdoms(data)
      setFiltered(data)
    }
    setLoading(false)
  }

  // --- Recherche et filtres dynamiques ---
  useEffect(() => {
    let result = [...wisdoms]

    if (guardianFilter !== "Tous") {
      result = result.filter(
        (w) =>
          (w.guardian_name || "inconnu")
            .toLowerCase()
            .includes(guardianFilter.toLowerCase())
      )
    }

    if (search.trim().length > 0) {
      result = result.filter(
        (w) =>
          w.wisdom_text?.toLowerCase().includes(search.toLowerCase()) ||
          w.guardian_name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => new Date(a.generated_at) - new Date(b.generated_at))
    } else {
      result.sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at))
    }

    setFiltered(result)
  }, [search, guardianFilter, sortOrder, wisdoms])

  // --- Liste unique des Gardiens pour menu déroulant ---
  const guardians = [
    "Tous",
    ...Array.from(new Set(wisdoms.map((w) => w.guardian_name || "inconnu"))),
  ]

  // --- Sauvegarde PDF sans librairie ---
  function saveBlob(blob, filename) {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  // --- Générer le Livre complet en PDF texte ---
  async function downloadFullBookPDF() {
    try {
      if (filtered.length === 0) {
        alert("Aucune sagesse à inclure pour l’instant.")
        return
      }

      const title = "🌕 Livre des Sagesses Oniriques\n\n"
      const header =
        "Réso•° Onimoji – Rêves métamorphosés en sagesses collectives\n──────────────────────────────\n\n"

      let content = title + header

      filtered.forEach((w, i) => {
        const date = new Date(w.generated_at).toLocaleDateString("fr-FR")
        content += `✨ ${w.guardian_name || "Gardien inconnu"} — ${date}\n\n`
        content += `${w.wisdom_text || "(Sagesse non révélée)"}\n\n`
        content += "──────────────────────────────\n\n"
      })

      const footer = `© ${new Date().getFullYear()} Réso•° Onimoji — Les rêves des uns deviennent les ressources des autres.`
      content += footer

      const blob = new Blob([content], { type: "application/pdf" })
      saveBlob(blob, "Livre-des-Sagesses-Oniriques.pdf")
    } catch (err) {
      console.error("Erreur PDF :", err)
      alert("⚠️ Impossible de générer le Livre des Sagesses.")
    }
  }

  // --- UI ---
  return (
    <div
      style={{
        textAlign: "center",
        color: "#ffe38e",
        padding: "1rem",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: "0.3rem" }}>🌕 Livre des Sagesses Oniriques</h2>
      <p style={{ opacity: 0.8 }}>
        Révélations issues des rêves métamorphosés du Réso collectif.
      </p>

      {/* Barre de filtres */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={search}
          placeholder="🔍 Rechercher une sagesse..."
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "8px",
            border: "1px solid rgba(255,230,150,0.4)",
            background: "rgba(20,20,25,0.7)",
            color: "#ffe38e",
            width: "60%",
            minWidth: "200px",
          }}
        />

        <select
          value={guardianFilter}
          onChange={(e) => setGuardianFilter(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "8px",
            background: "rgba(20,20,25,0.7)",
            border: "1px solid rgba(255,230,150,0.4)",
            color: "#ffe38e",
          }}
        >
          {guardians.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "0.4rem 0.6rem",
            borderRadius: "8px",
            background: "rgba(20,20,25,0.7)",
            border: "1px solid rgba(255,230,150,0.4)",
            color: "#ffe38e",
          }}
        >
          <option value="desc">🕒 Plus récentes</option>
          <option value="asc">🌙 Plus anciennes</option>
        </select>
      </div>

      {/* Bouton Livre complet */}
      {filtered.length > 0 && (
        <div style={{ marginTop: "1.2rem" }}>
          <button
            onClick={downloadFullBookPDF}
            style={{
              background: "linear-gradient(90deg,#ffe38e,#ffd46b)",
              border: "none",
              borderRadius: "10px",
              padding: ".6rem 1.2rem",
              color: "#111",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📜 Télécharger le Livre complet
          </button>
        </div>
      )}

      {/* Liste des sagesses */}
      {loading ? (
        <p style={{ marginTop: "2rem" }}>🌙 Chargement en cours...</p>
      ) : filtered.length === 0 ? (
        <p style={{ marginTop: "2rem", opacity: 0.6 }}>
          Aucune sagesse correspondante…
        </p>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          {filtered.map((w) => (
            <div
              key={w.id}
              style={{
                border: "1px solid rgba(255,230,150,0.3)",
                borderRadius: "10px",
                margin: "1rem auto",
                padding: "1rem",
                background: "rgba(15,20,25,0.6)",
                maxWidth: 420,
              }}
            >
              <h3 style={{ color: "#ffe38e", marginBottom: ".3rem" }}>
                ✨ {w.guardian_name || "Gardien inconnu"}
              </h3>
              <p style={{ fontSize: ".8rem", opacity: 0.7 }}>
                {new Date(w.generated_at).toLocaleDateString("fr-FR")}
              </p>

              <p
                style={{
                  marginTop: ".5rem",
                  fontSize: ".9rem",
                  opacity: 0.9,
                  fontStyle: "italic",
                }}
              >
                {w.wisdom_text?.slice(0, 120) || "Sagesse à révéler..."}...
              </p>

              <button
                onClick={() => setSelected(w)}
                style={{
                  marginTop: "0.8rem",
                  background: "rgba(255,230,150,0.15)",
                  border: "1px solid rgba(255,230,150,0.4)",
                  borderRadius: "8px",
                  padding: ".5rem 1rem",
                  color: "#ffe38e",
                  cursor: "pointer",
                }}
              >
                📖 Lire la Sagesse
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <WisdomModal
          wisdom={selected}
          userId={userId}
          onClose={() => setSelected(null)}
        />
      )}

      <p style={{ marginTop: "2rem", fontStyle: "italic", opacity: 0.6 }}>
        Les rêves se métamorphosent en sagesses partagées,  
        tissant la mémoire du Réso•°.
      </p>
    </div>
  )
}