import { supabase } from "../supabaseClient"
import { inuitSteps } from "../data/inuitSteps"

// ⚡ initialise le cycle si c’est la première fois
export async function initializeUserCycle(userId) {
  const { data, error } = await supabase
    .from("user_inuit_progress")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.error("⚠️ Erreur lecture progression :", error)
    return
  }

  if (!data || data.length === 0) {
    const inserts = inuitSteps.map(s => ({
      user_id: userId,
      step_number: s.step_number,
      awakened: false,
    }))
    await supabase.from("user_inuit_progress").insert(inserts)
    console.log("✅ Nouveau cycle onirique initialisé")
  }
}

// 🎲 tire un esprit non encore éveillé
export async function drawSpiritOfTheDay(userId) {
  const { data } = await supabase
    .from("user_inuit_progress")
    .select("step_number, awakened")
    .eq("user_id", userId)

  const done = data?.filter(d => d.awakened).map(d => d.step_number) || []
  const remaining = inuitSteps.filter(s => !done.includes(s.step_number))

  if (remaining.length === 0) return { step: null, done: true }

  const step = remaining[Math.floor(Math.random() * remaining.length)]
  return { step, done: false }
}

// ✅ coche une étape comme éveillée
export async function markSpiritAwakened(userId, stepNumber) {
  await supabase
    .from("user_inuit_progress")
    .update({ awakened: true, awakened_at: new Date() })
    .eq("user_id", userId)
    .eq("step_number", stepNumber)
}