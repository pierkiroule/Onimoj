// 🌌 Réseau culturel complet des 12 esprits du Grand Nord
export const inuitNodes = [
  { id: "sila", emoji: "🌬️", label: "Sila", group: 1 },
  { id: "sedna", emoji: "🧜‍♀️", label: "Sedna", group: 1 },
  { id: "qilak", emoji: "🌌", label: "Qilak", group: 1 },
  { id: "torngasuk", emoji: "🔥", label: "Torngasuk", group: 2 },
  { id: "nuliajuk", emoji: "🐚", label: "Nuliajuk", group: 2 },
  { id: "tuktu", emoji: "🦌", label: "Tuktu", group: 3 },
  { id: "qajaq", emoji: "🛶", label: "Qajaq", group: 3 },
  { id: "amaruq", emoji: "🐺", label: "Amaruq", group: 4 },
  { id: "aniu", emoji: "❄️", label: "Aniu", group: 4 },
  { id: "nanuq", emoji: "🐻", label: "Nanuq", group: 5 },
  { id: "ayarnaq", emoji: "🌫️", label: "Ayarnaq", group: 5 },
  { id: "turnngaq", emoji: "💫", label: "Turnngaq", group: 6 },
]

// --- Connexions symboliques entre esprits ---
export const inuitLinks = [
  // Souffle et mer
  { source: "sila", target: "qilak" },
  { source: "sila", target: "sedna" },
  { source: "sedna", target: "nuliajuk" },

  // Feu et transformation
  { source: "qilak", target: "torngasuk" },
  { source: "torngasuk", target: "ayarnaq" },

  // Voyage et animalité
  { source: "tuktu", target: "qajaq" },
  { source: "qajaq", target: "amaruq" },
  { source: "amaruq", target: "nanuq" },
  { source: "nanuq", target: "aniu" },

  // Transmission spirituelle
  { source: "ayarnaq", target: "turnngaq" },
  { source: "turnngaq", target: "sila" },

  // Ponts de résonance
  { source: "nuliajuk", target: "tuktu" },
  { source: "qilak", target: "aniu" },
  { source: "torngasuk", target: "turnngaq" },
]