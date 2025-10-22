// src/data/poeticLexicon.js
// Petit lexique d'images et notions pour une poésie oblique inspirée des cultures inuit

export const inuitPreferredLexicon = [
  // Esprits et notions
  "Sila", // souffle, météo, esprit de l'air
  "Sedna", // gardienne des mers
  "angakkuq", // chamane
  "qulliq", // lampe à huile
  "inuksuk", // balise de pierre
  // Paysages et éléments
  "banquise",
  "polynie",
  "floe",
  "fjord",
  "toundra",
  "aurore boréale",
  "blizzard",
  "halo",
  "givre",
  "glace noire",
  "neige sèche",
  "brume",
  "nuit bleue",
  // Animaux (présents, sans fétichiser)
  "narval",
  "béluga",
  "phoque",
  "morse",
  "caribou",
  // Matières et sensations
  "sel",
  "houle",
  "écume",
  "souffle",
  "haleine",
  "craquement",
  "lueur",
  "huile",
  "pierre",
  "lichen",
]

// Mots à éviter pour préserver l'obliquité et éviter les platitudes
export const bannedWordsBase = [
  "rêve",
  "rêves",
  "rêver",
  "IA",
  "intelligence artificielle",
  "algorithme",
  "algorithmes",
  "humain",
  "humains",
  "magique",
  "miracle",
  "destin",
  "hashtag",
  "emoji",
]

// Tournures ou clichés mous à limiter fortement
export const softCliches = [
  "étoiles infinies",
  "univers me parle",
  "âme",
  "énergie cosmique",
  "lumière intérieure",
]

export function selectLexiconSample(list, maxCount = 18) {
  const unique = Array.from(new Set(list))
  if (unique.length <= maxCount) return unique
  // échantillon stable mais varié
  const step = Math.max(1, Math.floor(unique.length / maxCount))
  const sample = []
  for (let i = 0; i < unique.length && sample.length < maxCount; i += step) {
    sample.push(unique[i])
  }
  return sample
}
