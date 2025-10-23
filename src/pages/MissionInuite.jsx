import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import HublotResonant from "../components/HublotResonant"
import OnimojiCard from "../components/OnimojiCard"
import OnimojiNarration from "../components/OnimojiNarration"
import OnimojiQuiz from "../components/OnimojiQuiz"

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [steps, setSteps] = useState([])
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  const [pendingData, setPendingData] = useState(null) // data du hublot (3 ids)
  const [title, setTitle] = useState("")
  const [saving, setSaving] = useState(false)
  const [onimoji, setOnimoji] = useState(null)

  // Charge mission + étape
  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setStatus("⚠️ Aucun utilisateur connecté.")
          setLoading(false)
          return
        }
        setUser(user)

        const { data: missionData } = await supabase
          .from("missions")
          .select("*")
          .eq("user_id", user.id)
          .eq("culture", "Inuite")
          .maybeSingle()

        if (!missionData) { setStatus("⚠️ Mission non trouvée."); setLoading(false); return }

        const { data: stepsData } = await supabase
          .from("mission_steps_inuite")
          .select("*")
          .order("step_number", { ascending: true })

        const currentStep = stepsData.find(s => s.step_number === missionData.current_step)
        setMission(missionData)
        setSteps(stepsData)
        setCurrent(currentStep)
        setLoading(false)
      } catch (err) {
        console.error("Erreur MissionInuite:", err)
        setStatus("❌ Erreur de chargement.")
        setLoading(false)
      }
    }
    load()
  }, [])

  // Validation finale → sauvegarde Supabase (dream_stars)
  async function saveBulle() {
    if (!pendingData || !title.trim() || !user) {
      setStatus("⚠️ Donne un titre et sélectionne 3 esprits.")
      return
    }
    setSaving(true)
    try {
      const newRow = {
        creator_id: user.id,
        title: title.trim(),
        emojis: pendingData.emojis,  // ← garde le champ `emojis` tel quel
        culture: "Inuite",
        spirit: pendingData.spirit || "",
        step_number: pendingData.step_number || 1,
        completed: true,
      }

      const { data, error } = await supabase
        .from("dream_stars")
        .insert([newRow])
        .select()
        .single()

      if (error) throw error
      setOnimoji({ ...data, resonance_level: data.resonance_level ?? 1 })
      setPendingData(null)
      setTitle("")
      setStatus("🌟 Bulle enregistrée dans l’échocreation !")
    } catch (err) {
      console.error(err)
      setStatus("❌ Erreur d’enregistrement.")
    } finally {
      setSaving(false)
    }
  }

  async function handleQuizComplete() {
    if (!mission || !current) return
    const isLast = current.step_number >= 12
    const nextStep = Math.min(current.step_number + 1, 12)

    const updates = {
      current_step: isLast ? 12 : nextStep,
      progress: Math.max(mission.progress || 0, isLast ? 12 : nextStep),
      status: isLast ? "completed" : "active",
    }

    const { error } = await supabase.from("missions").update(updates).eq("id", mission.id)
    if (error) { setStatus("❌ Erreur progression."); return }

    setMission({ ...mission, ...updates })
    setOnimoji(null)
    setPendingData(null)
    setTitle("")
    setCurrent(steps.find(s => s.step_number === nextStep))
    setStatus(isLast ? "🏁 Mission terminée !" : "✨ Étape suivante débloquée.")
  }

  if (loading) return <p style={{ color: "#eee", textAlign: "center" }}>🌘 Chargement…</p>
  if (!mission || !current) return <p style={{ color: "#eee", textAlign: "center" }}>{status}</p>

  return (
    <div style={{ textAlign: "center", color: "#eee", padding: "1rem" }}>
      <h2>❄️ Mission Inuite</h2>
      <h3>Étape {current.step_number}/12 — {current.spirit_name} {current.symbol}</h3>
      <p style={{ maxWidth: "85%", margin: "1rem auto", opacity: 0.8 }}>
        {current.description || "Aucune description."}
      </p>

      {/* 1) Hublot réseau pour choisir 3 esprits */}
      {!pendingData && !onimoji && (
        <HublotResonant
          culture="Inuite"
          userId={user.id}
          step={current}
          onComplete={(data) => {
            setPendingData(data)
            setTitle(data.title || "")
          }}
        />
      )}

      {/* 2) Titre + Enregistrer */}
      {pendingData && !onimoji && (
        <div style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Titre de ta bulle mythonirique…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              background: "#111", color: "#bff",
              border: "1px solid rgba(127,255,212,0.3)",
              borderRadius: "6px", padding: "0.5rem 0.7rem",
              width: "85%", maxWidth: 420
            }}
          />
          <br />
          <button
            onClick={saveBulle}
            disabled={saving}
            style={{
              marginTop: "0.8rem",
              background: "linear-gradient(90deg,#6a5acd,#7fffd4)",
              border: "none", borderRadius: "8px",
              padding: "0.6rem 1.2rem", fontWeight: "bold",
              color: "#111", cursor: "pointer",
            }}>
            {saving ? "✨ Enregistrement…" : "🌟 Enregistrer dans l’échocreation"}
          </button>
        </div>
      )}

      {/* 3) Bulle affichée + narration + quiz */}
      {onimoji && (
        <>
          <OnimojiCard star={onimoji} />
          <OnimojiNarration star={onimoji} />
          <OnimojiQuiz
            stepNumber={current.step_number}
            userId={user.id}
            onComplete={handleQuizComplete}
          />
        </>
      )}

      {status && <p style={{ marginTop: "1rem", opacity: 0.8 }}>{status}</p>}
    </div>
  )
}