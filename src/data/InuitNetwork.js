export const inuitNodes = [
  { id: "sila", emoji: "🌬️", label: "Sila", group: 1 },
  { id: "sedna", emoji: "🧜‍♀️", label: "Sedna", group: 2 },
  { id: "qilak", emoji: "🌌", label: "Qilak", group: 3 },
  { id: "inua", emoji: "🔥", label: "Inua", group: 4 },
  { id: "anirniq", emoji: "💨", label: "Anirniq", group: 5 },
  { id: "tornat", emoji: "🌊", label: "Tornat", group: 6 },
]

export const inuitLinks = [
  { source: "sila", target: "qilak" },
  { source: "sila", target: "sedna" },
  { source: "sedna", target: "tornat" },
  { source: "inua", target: "anirniq" },
  { source: "qilak", target: "inua" },
]