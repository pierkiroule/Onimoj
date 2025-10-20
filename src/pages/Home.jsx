import '../App.css'

export default function Home({ onStart }) {
  return (
    <div className="fade-in" style={{ textAlign: 'center', color: '#eee', padding: '1.2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🌘 Onimoji</h1>
      <p style={{ opacity: 0.8, fontStyle: 'italic', marginBottom: '1rem' }}>
        Bienvenue, gardien des rêves.  
        Le vent murmure, une mission t’attend...
      </p>

      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '1rem',
          margin: '1rem auto',
          width: '90%',
          maxWidth: '420px',
          boxShadow: '0 0 15px rgba(127,255,212,0.15)',
        }}
      >
        <h3 style={{ color: '#7fffd4', marginBottom: '0.5rem' }}>🪶 Cycle des 12 Esprits</h3>
        <p style={{ opacity: 0.85 }}>
          Pars pour un voyage à travers les **rêves culturels**.  
          Découvre les esprits Inuits, Berbères et Celtes.  
          Chaque mission tisse une **étoile onirique vivante**.
        </p>
      </div>

      <button
        className="dream-button"
        onClick={onStart}
        style={{
          background: '#6eff8d',
          color: '#111',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          padding: '0.7rem 1.4rem',
          marginTop: '1.2rem',
          boxShadow: '0 0 10px rgba(127,255,212,0.4)',
        }}
      >
        🚀 Commencer ta mission
      </button>

      <div style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.9rem' }}>
        <p>🌙 12 jours, 12 défis doux, 12 esprits à écouter.</p>
        <p>Chaque étoile créée nourrit le grand tissage des rêves.</p>
      </div>
    </div>
  )
}