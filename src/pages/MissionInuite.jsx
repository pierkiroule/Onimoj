import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import inuitSteps from "../data/inuitSteps.json"
import StepEngine from "../components/StepEngine"
import "./MissionInuite.css"

export default function MissionInuite() {
  const [userId, setUserId] = useState(null)
  const [steps, setSteps] = useState(inuitSteps)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUserId(data.user.id)

      try {
        const { data: rows, error } = await supabase
          .from("mission_steps_inuite")
          .select("*")
          .order("step_number", { ascending: true })
        if (error) throw error
        if (Array.isArray(rows) && rows.length > 0) {
          setSteps(rows)
        }
      } catch (_) {
        // fallback to JSON already set
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // Expose slugs globally for URL sync in StepEngine
  if (!window.__inuit_slugs__) {
    window.__inuit_slugs__ = steps.map((s) =>
      String(s?.spirit_name || s?.title || `etape-${s?.step_number || "1"}`)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    )
  }

  if (loading && (!steps || steps.length === 0)) {
    return <p style={{ textAlign: "center", opacity: 0.9 }}>🌘 Chargement du rêve…</p>
  }

  return <StepEngine steps={steps} userId={userId || undefined} />
}