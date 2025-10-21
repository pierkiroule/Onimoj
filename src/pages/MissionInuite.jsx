import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import HublotOnirique from "../components/HublotOnirique"
import OnimojiCard from "../components/OnimojiCard"
import OnimojiNarration from "../components/OnimojiNarration"

export default function MissionInuite() {
  const [user, setUser] = useState(null)
  const [mission, setMission] = useState(null)
  const [steps, setSteps] = useState([])
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onimoji, setOnimoji] = useState(null)

  useEffect(() => {
    async function loadMission() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data: missionData } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user.id)
        .eq("culture", "Inuite")
        .single()

      if (!missionData) return setLoading(false)
      setMission(missionData)

      const { data: stepsData } = await supabase
        .from("mission_steps_inuite")
        .select("*")
        .order("step_number", { ascending: true })

      setSteps(stepsData)
      const currentStep = stepsData.find(s => s.step_number === missionData.current_step)
      setCurrent(currentStep)
      setLoading(false)
    }
    loadMission()
  }, [])

  if (loading)
    return <p style={{ color: "#eee", textAlign: "center" }}>🌘 Connexion à la mission...</p>
  if (!mission || !current)
    return <p style={{ color: "#eee", textAlign: "center" }}>⚠️ Mission non trouvée.</p>

  return (
    <div style={{ textAlign: "center", color: "#eee", padding: "1rem" }}>
      <h2>❄️ Mission Inuite</h2>
      <h3 style={{ opacity: 0.9 }}>
        Étape {current.step_number}/12 — {current.spirit_name} {current.symbol}
      </h3>
      <p style={{ maxWidth: "85%", margin: "0.8rem auto", opacity: 0.85 }}>
        {current.description}
      </p>

      {!onimoji && (
        <HublotOnirique
          step={current}
          userId={user.id}
          onComplete={(data) => setOnimoji(data)}
        />
      )}

      {onimoji && (
        <>
          <OnimojiCard star={onimoji} />
          <OnimojiNarration star={onimoji} />
        </>
      )}
    </div>
  )
}