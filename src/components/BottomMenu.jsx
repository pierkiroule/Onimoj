import './BottomMenu.css'

export default function BottomMenu({ currentPage, onNavigate }) {
  const items = [
    { id: 'home', icon: '🏠', label: 'Accueil' },
    { id: 'donner', icon: '💫', label: 'Donner' },
    { id: 'recevoir', icon: '🌙', label: 'Recevoir' },
    { id: 'profil', icon: '👤', label: 'Profil' },
    { id: 'test', icon: '🧪', label: 'Test' }, // ✅ test ajouté
  ]

  return (
    <nav
      className="bottom-menu"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '0.3rem 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          style={{
            background: 'none',
            border: 'none',
            color: currentPage === item.id ? '#fff' : '#aaa',
            fontSize: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}