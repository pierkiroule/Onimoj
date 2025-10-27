import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Register({ onAuth, onNavigate }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")

  async function handleRegister(e) {
    e.preventDefault()
    setStatus("⏳ Création du compte...")
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return setStatus("❌ " + error.message)
    setStatus("✅ Compte créé ! Vérifie ton e-mail.")
    onAuth(data.session)
    onNavigate("profil")
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxWidth: "300px", margin: "1rem auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.6rem", borderRadius: "8px", border: "none" }}
        />
        <input
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.6rem", borderRadius: "8px", border: "none" }}
        />
        <button type="submit" className="dream-button">
          Créer mon compte
        </button>
      </form>

      <p style={{ color: "#bfefff", fontSize: "0.9rem" }}>{status}</p>
      <p style={{ marginTop: "1rem" }}>
        Déjà inscrit ?{" "}
        <button
          onClick={() => onNavigate("login")}
          style={{ background: "none", border: "none", color: "#7fffd4", cursor: "pointer" }}
        >
          Connexion
        </button>
      </p>
    </div>
  )
}