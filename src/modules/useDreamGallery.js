// src/modules/useDreamGallery.js
import { supabase } from "../supabaseClient"

/**
 * 🪣 Upload d'une image IA dans le bucket Supabase
 * - Copie une image Nebius (ou autre) vers le bucket public "dream-gallery"
 * - Retourne l'URL publique stable
 * - Enregistre les métadonnées dans la table "dream_gallery" (facultatif)
 */
export async function uploadImageToGallery({ userId, imageUrl, spiritName, tags = [] }) {
  if (!userId) throw new Error("Utilisateur non connecté")
  if (!imageUrl) throw new Error("Aucune image à uploader")

  try {
    // 1️⃣ Télécharge l'image distante (Nebius → Blob)
    const response = await fetch(imageUrl)
    if (!response.ok) throw new Error("Impossible de récupérer l'image distante")
    const blob = await response.blob()

    // 2️⃣ Upload dans le bucket Supabase
    const filename = `${userId}-${Date.now()}.webp`
    const { error: uploadError } = await supabase.storage
      .from("dream-gallery")
      .upload(filename, blob, { contentType: "image/webp", upsert: false })

    if (uploadError) throw uploadError

    // 3️⃣ Récupère l'URL publique
    const { data } = supabase.storage.from("dream-gallery").getPublicUrl(filename)
    const publicUrl = data?.publicUrl
    if (!publicUrl) throw new Error("Échec récupération URL publique")

    // 4️⃣ (Optionnel) Enregistre les métadonnées dans la table dream_gallery
    const { error: metaError } = await supabase.from("dream_gallery").insert([
      {
        user_id: userId,
        image_url: publicUrl,
        spirit_name: spiritName || null,
        tags,
      },
    ])

    if (metaError) console.warn("⚠️ Enregistrement métadonnée échoué :", metaError.message)

    console.log("🌌 Image uploadée et enregistrée :", publicUrl)
    return { success: true, publicUrl }
  } catch (err) {
    console.error("❌ Erreur upload vers galerie :", err)
    return { success: false, message: err.message }
  }
}