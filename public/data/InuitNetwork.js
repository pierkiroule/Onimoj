// 🌌 Graphe culturel inuit enrichi pour D3 — stable, lisible, symbolique
export const inuitNodes = [
  { id: "sila",        emoji: "🌬️", label: "Sila",        meaning: "Souffle du monde, équilibre des éléments", group: 1 },
  { id: "sedna",       emoji: "🐋", label: "Sedna",       meaning: "Mer-mère, gardienne des animaux marins",   group: 1 },
  { id: "qailertetang",emoji: "🕯️", label: "Qailertetang",meaning: "Protectrice des cycles et des offrandes", group: 1 },
  { id: "caribou",     emoji: "🦌", label: "Caribou",     meaning: "Force du voyage intérieur",                group: 2 },
  { id: "uumaniq",     emoji: "🧙‍♂️", label: "Uumaniq",     meaning: "Pont entre visible et invisible",         group: 2 },
  { id: "tornarsuk",   emoji: "💀", label: "Tornarsuk",   meaning: "Souffle des ancêtres et feu intérieur",    group: 2 },
  { id: "lune",        emoji: "🌕", label: "Igaluk",      meaning: "Mesure du temps, sagesse du cycle",        group: 3 },
  { id: "malina",      emoji: "🌞", label: "Malina",      meaning: "Soleil bienveillant, clarté réparatrice",  group: 3 },
  { id: "nanook",      emoji: "🐻", label: "Nanook",      meaning: "Dignité et respect de la vie sauvage",     group: 4 },
  { id: "amaruq",      emoji: "🐺", label: "Amaruq",      meaning: "Guide de nuit, fidélité au chemin",        group: 4 },
  { id: "pinga",       emoji: "🌈", label: "Pinga",       meaning: "Soin et gratitude envers le vivant",       group: 5 },
  { id: "corbeau",     emoji: "🪶", label: "Corbeau",     meaning: "Messager de l’inattendu, humour du monde", group: 5 },
]

export const inuitLinks = [
  // 🌬️ Sila et les souffles de la nature
  { source: "sila", target: "sedna" },
  { source: "sila", target: "qailertetang" },
  { source: "sila", target: "lune" },
  { source: "sila", target: "malina" },

  // 🌊 Monde marin et intercesseurs
  { source: "sedna", target: "qailertetang" },
  { source: "sedna", target: "uumaniq" },
  { source: "sedna", target: "caribou" },

  // 🔥 Transmission invisible
  { source: "uumaniq", target: "tornarsuk" },
  { source: "tornarsuk", target: "caribou" },
  { source: "uumaniq", target: "corbeau" },

  // 🌕 Cycles célestes
  { source: "lune", target: "malina" },
  { source: "lune", target: "nanook" },
  { source: "malina", target: "pinga" },

  // 🐺 Alliances terrestres
  { source: "nanook", target: "amaruq" },
  { source: "amaruq", target: "caribou" },

  // 🌈 Soin et humour
  { source: "pinga", target: "corbeau" },
  { source: "pinga", target: "nanook" },
]