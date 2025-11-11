// src/modules/useDreamSave.js
import { useState } from "react"
import { supabase } from "../supabaseClient"

export function useDreamSave() {
  const [saveLoading, setSaveLoading] = useState(false)

  // === Sauvegarde d’un rêve ===
  async function saveDream({
    userId,
    spirit,
    title,
    text,
    tags = [],
    imageUrl = null,
    visible = true,
  }) {
    if (!userId) throw new Error("Utilisateur non connecté")
    if (!spirit) throw new Error("Gardien non défini")
    if (!title?.trim() || !text?.trim())
      throw new Error("Titre ou contenu manquant")

    setSaveLoading(true)
    try {
      const guardianUuid =
        spirit.guardian_id || spirit.id || "715dcb42-7a69-4b46-ac7f-95feb051754f"

      const normalizedTags = Array.isArray(tags) ? tags.map(String) : []

      const { data, error } = await supabase
        .from("dreams")
        .insert([
          {
            user_id: userId,
            guardian_id: guardianUuid,
            titre: title.trim(),
            contenu: text.trim(),
            tags: normalizedTags,
            image_url: imageUrl,
            visible,
            vitality: 1,
            source_guardians: [guardianUuid],
          },
        ])
        .select("id")
        .single()

      if (error) throw error
      console.log("🌕 Rêve sauvegardé :", data.id)
      return { success: true, dreamId: data.id, message: "Rêve enregistré" }
    } catch (err) {
      console.error("❌ Erreur sauvegarde rêve :", err)
      alert(`Erreur Supabase: ${err.message}`)
      return { success: false, message: err.message }
    } finally {
      setSaveLoading(false)
    }
  }

  // === Sauvegarde d’un écho ===
  async function saveEcho({ userId, dreamId, content }) {
    if (!userId) throw new Error("Utilisateur non connecté")
    if (!dreamId) throw new Error("ID du rêve manquant")
    if (!content?.trim()) throw new Error("Texte d’écho vide")

    setSaveLoading(true)
    try {
      const { data, error } = await supabase
        .from("dream_echoes")
        .insert([
          {
            dream_id: dreamId,
            user_id: userId,
            content: content.trim(),
          },
        ])
        .select("id")
        .single()

      if (error) throw error
      console.log("💬 Écho enregistré :", data.id)
      return { success: true, message: "Écho enregistré" }
    } catch (err) {
      console.error("❌ Erreur sauvegarde écho :", err)
      alert(`Erreur Supabase: ${err.message}`)
      return { success: false, message: err.message }
    } finally {
      setSaveLoading(false)
    }
  }

  return { saveDream, saveEcho, saveLoading }
}