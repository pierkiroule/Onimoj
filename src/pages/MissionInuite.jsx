import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import inuitSteps from "../data/inuitSteps.json"
import StepEngine from "../components/StepEngine"
import "./MissionInuite.css"

export default function MissionInuite() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUserId(data.user.id)
    }
    loadUser()
  }, [])

  // Expose slugs globally for URL sync in StepEngine
  if (!window.__inuit_slugs__) {
    window.__inuit_slugs__ = inuitSteps.map((s) =>
      String(s?.spirit_name || s?.title || `etape-${s?.step_number || "1"}`)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    )
  }

  return <StepEngine steps={inuitSteps} userId={userId || undefined} />
}