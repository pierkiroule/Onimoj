import { supabase } from "../supabaseClient"

/**
 * 💾 Sauvegarde un rêve généré dans la Rêvothèque Supabase
 * @param {Object} params - Données du rêve
 * @param {string} params.userId - ID utilisateur connecté
 * @param {string} params.dreamStarId - ID de l'étoile associée (optionnel)
 * @param {string} params.titre - Titre du rêve
 * @param {string} params.texte - Contenu poétique du rêve
 * @param {string[]} [params.tags=[]] - Tags ou mots-clés
 * @param {string} [params.culture='inuit'] - Culture associée
 * @param {boolean} [params.ai_generated=true] - Si généré par IA
 * @param {string} [params.model_used='nebius-ai'] - Nom du modèle IA
 * @param {number} [params.temperature=0.8] - Niveau de créativité du modèle
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function saveDreamToRevotheque({
  userId,
  dreamStarId = null,
  titre,
  texte,
  tags = [],
  culture = "inuit",
  ai_generated = true,
  model_used = "nebius-ai",
  temperature = 0.8,
}) {
  if (!supabase || !supabase.from) {
    console.warn("⚠️ Supabase non configuré, sauvegarde ignorée.")
    return { success: false, message: "Supabase inactif (mode local)" }
  }

  if (!userId) {
    console.warn("⚠️ Aucun utilisateur connecté, impossible d'enregistrer le rêve.")
    return { success: false, message: "Utilisateur non authentifié" }
  }

  try {
    const { data, error } = await supabase.from("revotheque_reves").insert([
      {
        user_id: userId,
        dream_star_id: dreamStarId,
        titre,
        texte,
        culture,
        tags,
        ai_generated,
        model_used,
        temperature,
        visible: true,
      },
    ])

    if (error) throw error

    console.log("🌠 Rêve sauvegardé dans la Rêvothèque :", titre)
    return { success: true, message: "Rêve enregistré avec succès", data }
  } catch (err) {
    console.error("🚨 Erreur lors de la sauvegarde du rêve :", err.message)
    return { success: false, message: err.message }
  }
}