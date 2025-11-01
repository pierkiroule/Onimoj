// --- Générateur poétique inspiré de la logique associative inuite ---
// plus de tracery : tout est géré en logique naturelle
export function generatePoem(emojis = [], words = []) {
  const E = [...emojis, "✨", "🌊", "🌕"].slice(0, 3)
  const W = [...words, "Souffle", "Glace", "Horizon", "Vent", "Lumière"].slice(0, 5)

  // dictionnaires d’associations symboliques
  const intros = [
    `Sous le regard de ${E[2]},`,
    `Dans le souffle de ${E[0]},`,
    `Entre ${W[0]} et ${W[1]},`,
    `Quand ${W[2]} se souvient,`,
    `Au seuil de ${W[3]},`,
  ]

  const cycles = [
    `Le rêve écoute ${W[0]} et se transforme en ${W[4]}.`,
    `${W[1]} se souvient du chant de ${W[2]}.`,
    `${W[3]} appelle ${W[0]}, et tout recommence.`,
    `Le monde respire à travers ${W[4]}.`,
    `Rien ne finit, tout revient vers ${E[1]}.`,
  ]

  const closes = [
    `Le silence garde la trace de ${W[1]}.`,
    `Alors ${W[0]} s’endort sous ${E[2]}.`,
    `Tout s’apaise. ${E[0]} respire.`,
    `${W[2]} se dissout dans ${W[4]}.`,
    `Sous ${E[1]}, la lumière se tait.`,
  ]

  // petite fonction utilitaire de tirage
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  // structure en 3 vers respirés
  const lines = [
    pick(intros),
    pick(cycles),
    pick(closes)
  ]

  // nettoyage final et cohérence poétique
  const poem = lines
    .join("\n")
    .replace(/\s+([,;.])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()

  return poem
}