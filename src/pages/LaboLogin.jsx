import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export default function LaboLogin({ onNavigate }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const ADMIN_ID = "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97"

  // ✅ Vérifie au chargement si une session existe déjà
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      if (session?.user?.id === ADMIN_ID) {
        console.log("🔄 Session restaurée :", session.user.id)
        onNavigate("labo") // redirige directement vers le Labo
      }
    }

    checkSession()

    // Surveille les changements d’état d’auth (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id === ADMIN_ID) {
        console.log("✅ Admin connecté :", session.user.id)
        onNavigate("labo")
      } else if (!session) {
        console.log("🚪 Déconnecté")
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogin() {
    setError("")
    setLoading(true)

    try {
      // 🔐 Connexion Supabase standard
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      const user = data?.user
      if (!user) throw new Error("Aucun utilisateur trouvé.")

      // 🧙 Vérifie le droit d’accès admin
      if (user.id !== ADMIN_ID) {
        await supabase.auth.signOut()
        throw new Error("⛔ Accès réservé à l’administrateur Onimoji.")
      }

      console.log("✅ Connecté :", user.id)
      onNavigate("labo")
    } catch (err) {
      console.error("⚠️ Erreur connexion :", err.message)
      setError("❌ " + err.message)
    } finally {
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

      <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
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

/* 🎨 Styles */
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