import { useState } from "react"
import './MissionSelect.css'

export default function MissionSelect({ onStart }) {
  const [selected, setSelected] = useState(null)
  const [name, setName] = useState("")

  const missions = [
    { id: "inuit", icon: "🌙", title: "Mission Inuite", desc: "Explore le souffle de Sila, l'esprit du vent et de la glace." },
    { id: "berbere", icon: "🏜️", title: "Mission Berbère", desc: "Traverse les dunes intérieures à la recherche de la source." },
    { id: "celtique", icon: "🌳", title: "Mission Celtique", desc: "Suis la voix des arbres et des brumes du matin." }
  ]

  const handleLaunch = () => {
    if (!selected) return alert("Choisis d’abord ta mission !")
    onStart({ culture: selected, name: name || "Explorateur·trice Onirique" })
  }

  return (
    <div className="mission-select fade-in">
      <h2 className="title">🚀 Choisis ta Mission Onirique</h2>
      <p className="subtitle">Chaque culture t’invite à découvrir une sagesse du rêve.</p>

      <div className="mission-grid">
        {missions.map(m => (
          <div
            key={m.id}
            className={`mission-card ${selected === m.id ? "selected" : ""}`}
            onClick={() => setSelected(m.id)}
          >
            <div className="icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="name-zone">
        <input
          type="text"
          placeholder="Entre ton nom d’explorateur..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className="dream-button" onClick={handleLaunch}>
        🌠 Monter à bord de la navette Onirix Beta One
      </button>
    </div>
  )
}