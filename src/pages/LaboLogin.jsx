import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function LaboLogin({ onNavigate }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError("")
    setLoading(true)

    try {
      // 🔐 Connexion Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      const user = data?.user
      if (!user) throw new Error("Aucun utilisateur trouvé.")

      console.log("✅ Connecté :", user.id)

      // 🧙 Vérifie ton UUID admin
      if (user.id !== "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97") {
        await supabase.auth.signOut()
        throw new Error("⛔ Accès réservé à l’administrateur Onimoji.")
      }

      // ✅ Session sauvegardée
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        sessionStorage.setItem("laboAuth", "true")
        localStorage.setItem("supabaseSession", JSON.stringify(sessionData.session))
      }

      setLoading(false)
      onNavigate("labo")
    } catch (err) {
      console.error("⚠️ Erreur connexion :", err.message)
      setError("❌ " + err.message)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20vh",
        color: "#dff",
        padding: "1rem",
      }}
    >
      <h2>🧪 Labo Onimoji</h2>
      <p style={{ opacity: 0.8 }}>Accès réservé à l’administrateur des Rêvonances.</p>

      <input
        type="email"
        placeholder="Email Supabase"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <br />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ ...inputStyle, marginTop: "0.8rem" }}
      />
      <br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "Connexion..." : "Entrer"}
      </button>

      {error && (
        <p style={{ color: "#ff8080", marginTop: "0.8rem" }}>{error}</p>
      )}

      <p
        onClick={() => onNavigate("home")}
        style={{
          opacity: 0.6,
          fontSize: "0.85rem",
          marginTop: "1.2rem",
          cursor: "pointer",
        }}
      >
        ⬅️ Retour à l’accueil
      </p>
    </div>
  )
}

const inputStyle = {
  padding: "0.6rem",
  borderRadius: "6px",
  border: "1px solid #7fffd440",
  background: "rgba(255,255,255,0.05)",
  color: "#dff",
  width: "240px",
}

const buttonStyle = {
  marginTop: "1rem",
  padding: "0.6rem 1.4rem",
  background: "linear-gradient(90deg, #6a5acd, #7fffd4)",
  color: "#111",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
}