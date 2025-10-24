import { useEffect, useMemo, useState } from "react"
import { supabase } from "../supabaseClient"

export default function InuiteAdmin({ onNavigate, session }) {
  const [steps, setSteps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const isAdmin = useMemo(() => {
    const adminId = "2d4955ad-4eb6-47c3-bfc9-8d76dedcbc97"
    return session?.user?.id === adminId
  }, [session])

  useEffect(() => {
    fetchSteps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchSteps() {
    setLoading(true)
    setError("")
    const { data, error } = await supabase
      .from("mission_steps_inuite")
      .select("*")
      .order("step_number", { ascending: true })
    if (error) setError("Erreur chargement: " + error.message)
    setSteps(data || [])
    setLoading(false)
  }

  function startCreate() {
    const nextNumber = (steps[steps.length - 1]?.step_number || 0) + 1
    setEditing({
      id: null,
      step_number: nextNumber,
      spirit_name: "",
      symbol: "",
      title: "",
      text: "",
      ritual: "",
      keywords: [],
    })
  }

  function startEdit(s) {
    setEditing({ ...s })
  }

  async function handleSave(e) {
    e?.preventDefault?.()
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const payload = {
        step_number: Number(editing.step_number) || 1,
        spirit_name: editing.spirit_name?.trim() || null,
        symbol: editing.symbol?.trim() || null,
        title: editing.title?.trim() || null,
        text: editing.text?.trim() || null,
        ritual: editing.ritual?.trim() || null,
        keywords: Array.isArray(editing.keywords)
          ? editing.keywords
          : (editing.keywords || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
      }
      if (editing.id) {
        const { error } = await supabase
          .from("mission_steps_inuite")
          .update(payload)
          .eq("id", editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("mission_steps_inuite")
          .insert([payload])
        if (error) throw error
      }
      setEditing(null)
      await fetchSteps()
    } catch (err) {
      setError("Erreur sauvegarde: " + (err.message || String(err)))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!id) return
    // eslint-disable-next-line no-alert
    if (!confirm("Supprimer cette étape ?")) return
    setError("")
    const { error } = await supabase
      .from("mission_steps_inuite")
      .delete()
      .eq("id", id)
    if (error) setError("Erreur suppression: " + error.message)
    await fetchSteps()
  }

  function Field({ label, children }) {
    return (
      <label style={{ display: "block", marginBottom: 12 }}>
        <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: 6 }}>{label}</div>
        {children}
      </label>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: "15vh" }}>
        <h2>⛔ Accès réservé</h2>
        <p style={{ opacity: 0.8 }}>Connecte-toi via le Labo admin.</p>
        <button onClick={() => onNavigate?.("labo-login")} style={btnSecondary}>
          Aller au Labo
        </button>
      </div>
    )
  }

  return (
    <div style={{ color: "#fff", margin: "6vh auto", maxWidth: 960, padding: "0 1rem" }}>
      <h2 style={{ textAlign: "center", color: "#7fffd4" }}>❄️ Admin — Mission Inuite</h2>
      <p style={{ textAlign: "center", opacity: 0.8 }}>
        Gère les 12 étapes (contenu culturel, rituel, ordre).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, marginTop: 20 }}>
        {/* Liste */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Étapes</h3>
            <button onClick={startCreate} style={btnPrimary}>+ Nouvelle</button>
          </div>
          {loading ? (
            <p style={{ opacity: 0.7 }}>Chargement…</p>
          ) : steps.length === 0 ? (
            <p style={{ opacity: 0.7 }}>Aucune étape.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
              {steps.map((s) => (
                <li
                  key={s.id || s.step_number}
                  style={{
                    padding: "8px 10px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>Étape {s.step_number} — {s.spirit_name} {s.symbol}</div>
                    <div style={{ opacity: 0.8, fontSize: "0.9rem" }}>{s.title || "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(s)} style={btnSmall}>Éditer</button>
                    <button onClick={() => handleDelete(s.id)} style={btnDangerSmall}>Supprimer</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p style={{ color: "#ff8080", marginTop: 8 }}>{error}</p>}
        </div>

        {/* Formulaire */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding: 16,
            minHeight: 360,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{editing?.id ? "Éditer l’étape" : "Nouvelle étape"}</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={fetchSteps} style={btnSecondary}>Rafraîchir</button>
              <button onClick={() => setEditing(null)} style={btnSecondary}>Réinitialiser</button>
            </div>
          </div>
          <form onSubmit={handleSave} style={{ marginTop: 10 }}>
            <Field label="Numéro d’étape">
              <input
                type="number"
                value={editing?.step_number ?? ""}
                onChange={(e) => setEditing((v) => ({ ...v, step_number: e.target.value }))}
                style={input}
                min={1}
                max={99}
                required
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 12 }}>
              <Field label="Esprit (spirit_name)">
                <input
                  type="text"
                  value={editing?.spirit_name ?? ""}
                  onChange={(e) => setEditing((v) => ({ ...v, spirit_name: e.target.value }))}
                  style={input}
                  placeholder="Sila, Sedna, …"
                />
              </Field>
              <Field label="Symbole">
                <input
                  type="text"
                  value={editing?.symbol ?? ""}
                  onChange={(e) => setEditing((v) => ({ ...v, symbol: e.target.value }))}
                  style={input}
                  placeholder="🌬️"
                />
              </Field>
            </div>
            <Field label="Titre">
              <input
                type="text"
                value={editing?.title ?? ""}
                onChange={(e) => setEditing((v) => ({ ...v, title: e.target.value }))}
                style={input}
                placeholder="Le Souffle du Monde"
              />
            </Field>
            <Field label="Texte culturel (description)">
              <textarea
                rows={6}
                value={editing?.text ?? ""}
                onChange={(e) => setEditing((v) => ({ ...v, text: e.target.value }))}
                style={{ ...input, resize: "vertical" }}
              />
            </Field>
            <Field label="Rituel du soir">
              <textarea
                rows={4}
                value={editing?.ritual ?? ""}
                onChange={(e) => setEditing((v) => ({ ...v, ritual: e.target.value }))}
                style={{ ...input, resize: "vertical" }}
              />
            </Field>
            <Field label="Mots-clés (séparés par des virgules)">
              <input
                type="text"
                value={Array.isArray(editing?.keywords) ? editing.keywords.join(", ") : (editing?.keywords ?? "")}
                onChange={(e) => setEditing((v) => ({ ...v, keywords: e.target.value }))}
                style={input}
                placeholder="souffle, respiration, cosmos, …"
              />
            </Field>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button type="submit" disabled={saving} style={btnPrimary}>
                {saving ? "💾 Sauvegarde…" : "💾 Enregistrer"}
              </button>
              {editing?.id && (
                <button type="button" onClick={() => handleDelete(editing.id)} style={btnDanger}>
                  Supprimer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button onClick={() => onNavigate?.("labo")} style={btnSecondary}>⬅️ Retour Labo</button>
      </div>
    </div>
  )
}

const input = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(127,255,212,0.25)",
  background: "rgba(0,0,0,0.25)",
  color: "#e8fff6",
}

const btnPrimary = {
  background: "linear-gradient(145deg,#6eff8d,#35a0ff)",
  color: "#111",
  border: "none",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 800,
  cursor: "pointer",
}

const btnSecondary = {
  background: "transparent",
  color: "#7fffd4",
  border: "1px solid #7fffd4",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 700,
  cursor: "pointer",
}

const btnDanger = {
  background: "#ff8080",
  color: "#111",
  border: "none",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 800,
  cursor: "pointer",
}

const btnSmall = {
  ...btnSecondary,
  padding: "6px 10px",
}

const btnDangerSmall = {
  ...btnDanger,
  padding: "6px 10px",
}
