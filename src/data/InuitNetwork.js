// Graphe minimal, clair et stable pour D3
export const inuitNodes = [
  { id: "sila",    emoji: "🌬️", label: "Sila",    meaning: "Souffle du monde",                 group: 1 },
  { id: "sedna",   emoji: "🐋", label: "Sedna",   meaning: "Mer-mère des transformations",      group: 1 },
  { id: "caribou", emoji: "🦌", label: "Caribou", meaning: "Voyage de l’âme",                   group: 2 },
  { id: "uumaniq", emoji: "🧙‍♂️", label: "Uumaniq", meaning: "Pont entre visible et invisible", group: 2 },
  { id: "lune",    emoji: "🌘", label: "Lune",    meaning: "Rythme du rêve",                    group: 3 },
  { id: "corbeau", emoji: "🪶", label: "Corbeau", meaning: "Messager de l’inattendu",           group: 3 },
]

export const inuitLinks = [
  { source: "uumaniq", target: "sila" },
  { source: "uumaniq", target: "sedna" },
  { source: "sedna",   target: "caribou" },
  { source: "lune",    target: "sila" },
  { source: "corbeau", target: "uumaniq" },
]