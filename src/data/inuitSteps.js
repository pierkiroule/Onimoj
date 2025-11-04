// src/data/inuitSteps.js
// 🌌 Parent central — charge les 12 gardiens Inuit
// JSON placés dans le même dossier

export async function loadInuitSteps() {
  const names = [
    "Sila",
    "Sedna",
    "Qilak",
    "Torngasuk",
    "Nuliajuk",
    "Tuktu",
    "Qajaq",
    "Amaruq",
    "Aniu",
    "Nanuq",
    "Ayarnaq",
    "Turnngaq"
  ]

  const loaded = await Promise.all(
    names.map(name =>
      fetch(`./${name}.json`).then(res => {
        if (!res.ok) throw new Error(`Erreur chargement : ${name}`)
        return res.json()
      })
    )
  )

  return loaded
}

// --- Import statique pour build Vite ou mobile sans fetch ---
import Sila from "./Sila.json"
import Sedna from "./Sedna.json"
import Qilak from "./Qilak.json"
import Torngasuk from "./Torngasuk.json"
import Nuliajuk from "./Nuliajuk.json"
import Tuktu from "./Tuktu.json"
import Qajaq from "./Qajaq.json"
import Amaruq from "./Amaruq.json"
import Aniu from "./Aniu.json"
import Nanuq from "./Nanuq.json"
import Ayarnaq from "./Ayarnaq.json"
import Turnngaq from "./Turnngaq.json"

export const inuitSteps = [
  Sila,
  Sedna,
  Qilak,
  Torngasuk,
  Nuliajuk,
  Tuktu,
  Qajaq,
  Amaruq,
  Aniu,
  Nanuq,
  Ayarnaq,
  Turnngaq
]