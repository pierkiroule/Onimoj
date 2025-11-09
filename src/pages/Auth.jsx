import { useState } from "react"
import { supabase } from "../supabaseClient"
import "../App.css"
import "./Home.css"

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("signin") // signin | signup | reset
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus("⏳ Connexion au champ des rêves...")

    try {
      let result

      if (mode === "signup") {
        result = await supabase.auth.signUp({ email, password })
        if (result.error) throw result.error

        // ✨ Crée un profil onirique
        const user = result.data.user
        if (user) {
          const emojis = ["🌙", "🪶", "❄️", "🔥", "🌿", "💧", "🪞"]
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
          await supabase.from("profiles").insert({
            user_id: user.id,
            email,
            username: email.split("@")[0],
            emoji: randomEmoji,
            culture: "Inuite",
          })
        }

        setStatus("✅ Compte créé ! Vérifie ton e-mail pour activer ton voyage.")
      } else if (mode === "signin") {
        result = await supabase.auth.signInWithPassword({ email, password })
        if (result.error) throw result.error
        setStatus("🌕 Connecté au Réso•° des rêves.")
        onAuth(result.data.session)
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setStatus("📩 Lien de réinitialisation envoyé à ton adresse onirique.")
        return
      }
    } catch (err) {
      setStatus("❌ " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const titles = {
    signin: "🌙 Connecte-toi à ton espace onirique",
    signup: "✨ Crée ton compte de rêveur",
    reset: "🔑 Réinitialise ton mot de passe",
  }

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "radial-gradient(circle at 50% 30%, rgba(8,18,26,0.95), rgba(0,0,0,0.9))",
        color: "#e9fffd",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 0 20px rgba(140,170,255,0.15)",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ color: "#7fffd4", marginBottom: "0.5rem" }}>{titles[mode]}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Adresse onirique..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          {mode !== "reset" && (
            <input
              type="password"
              placeholder="Mot de passe secret..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="dream-button"
            style={{
              background: loading ? "rgba(127,255,212,0.4)" : "linear-gradient(90deg,#7fffd4,#6a5acd)",
              border: "none",
              borderRadius: "10px",
              padding: "0.7rem 1.5rem",
              fontWeight: "bold",
              color: "#0b0b1a",
              cursor: "pointer",
              marginTop: "1rem",
              boxShadow: "0 0 12px rgba(127,255,212,0.4)",
            }}
          >
            {loading
              ? "…"
              : mode === "signup"
              ? "Créer le compte"
              : mode === "signin"
              ? "Connexion"
              : "Envoyer le lien"}
          </button>
        </form>

        <div style={{ marginTop: "1rem", opacity: 0.8 }}>
          {mode === "signup" && (
            <p onClick={() => setMode("signin")} style={linkStyle}>
              🌀 Déjà membre du Réso•° ? Connecte-toi
            </p>
          )}
          {mode === "signin" && (
            <>
              <p onClick={() => setMode("signup")} style={linkStyle}>
                🌱 Nouveau rêveur ? Crée ton compte
              </p>
              <p onClick={() => setMode("reset")} style={{ ...linkStyle, fontSize: ".9rem", opacity: 0.6 }}>
                🔑 Mot de passe oublié ?
              </p>
            </>
          )}
          {mode === "reset" && (
            <p onClick={() => setMode("signin")} style={linkStyle}>
              🌙 Retour à la connexion
            </p>
          )}
        </div>

        {status && (
          <p
            style={{
              fontSize: "0.9rem",
              marginTop: "0.8rem",
              opacity: 0.8,
              color: status.startsWith("❌") ? "#ff6b6b" : "#aefcf5",
              minHeight: "1.2rem",
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  )
}

/* === Styles === */
const inputStyle = {
  padding: "0.6rem",
  margin: "0.4rem auto",
  borderRadius: "8px",
  width: "85%",
  border: "1px solid rgba(127,255,212,0.4)",
  background: "rgba(0,25,35,0.6)",
  color: "#e9fffd",
  outline: "none",
  fontSize: "1rem",
  transition: "0.3s",
}

const linkStyle = {
  cursor: "pointer",
  color: "#7fffd4",
  transition: "0.2s",
}