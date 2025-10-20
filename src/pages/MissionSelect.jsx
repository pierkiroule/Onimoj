import '../App.css'

export default function MissionSelect({ onChoose }) {
  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1rem' }}>
      <h2>🌍 Choisis ta mission culturelle</h2>
      <p style={{ opacity: 0.8 }}>Chaque mission est un voyage de 12 défis-doux vers un monde onirique.</p>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          className="dream-button"
          style={{ background: '#6eff8d', color: '#111' }}
          onClick={() => onChoose({ culture: 'Inuite', name: 'Mission Inuite' })}
        >
          ❄️ Mission Inuite — accessible
        </button>

        <button className="dream-button" disabled style={{ opacity: 0.5 }}>
          🏜️ Mission Berbère — verrouillée 🔒
        </button>

        <button className="dream-button" disabled style={{ opacity: 0.5 }}>
          🌳 Mission Celtique — verrouillée 🔒
        </button>
      </div>
    </div>
  )
}