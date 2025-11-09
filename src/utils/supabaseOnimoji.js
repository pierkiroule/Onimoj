// ✅ Utilitaire unique pour sauvegarder les Onimojis
import { supabase } from "../supabaseClient"

export async function saveOnimojiAndProgress({
  userId,
  emoji = "✨",
  title = "Sans titre",
  text = "",
  imageUrl = "",
  tags = [],
  culture = "Inuite",
  spirit = "Gardien du rêve",
}) {
  if (!userId) throw new Error("Utilisateur non connecté")

  const { data, error } = await supabase
    .from("onimoji")
    .insert([
      {
        user_id: userId,
        emoji,
        titre: title,
        texte: text,
        image_url: imageUrl,
        tags,
        culture,
        spirit,
        visible: true,
        shared: false,
      },
    ])
    .select()

  if (error) {
    console.error("❌ Erreur sauvegarde Onimoji :", error)
    throw error
  }

  console.log("✅ Onimoji enregistré :", data)
  return data?.[0]
}