import { NavLink } from 'react-router-dom'
import './BottomMenu.css'

export default function BottomMenu() {
  const items = [
    { to: '/', icon: '🏠', label: 'Accueil' },
    { to: '/donner', icon: '💫', label: 'Donner' },
    { to: '/recevoir', icon: '🌙', label: 'Recevoir' },
    { to: '/profil', icon: '👤', label: 'Profil' },
    { to: '/test', icon: '🧪', label: 'Test' },
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
      aria-label="Navigation principale"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#fff' : '#aaa',
            fontSize: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            padding: '0.2rem 0',
          })}
          aria-label={item.label}
        >
          <span>{item.icon}</span>
          <span style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}