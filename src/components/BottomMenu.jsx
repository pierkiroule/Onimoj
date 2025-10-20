import { NavLink } from 'react-router-dom'
import './BottomMenu.css'

export default function BottomMenu() {
  const menuItems = [
    { to: '/', icon: '🏠', label: 'Accueil', id: 'home' },
    { to: '/donner', icon: '💫', label: 'Donner', id: 'donner' },
    { to: '/recevoir', icon: '🌙', label: 'Recevoir', id: 'recevoir' },
    { to: '/profil', icon: '👤', label: 'Profil', id: 'profil' }
  ]

  return (
    <nav 
      className="bottom-menu" 
      role="navigation" 
      aria-label="Navigation principale"
    >
      <div className="menu-container">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) => 
              `menu-item ${isActive ? 'active' : ''}`
            }
            aria-label={item.label}
            role="button"
            tabIndex={0}
          >
            <div className="menu-icon">
              <span className="icon-emoji" aria-hidden="true">{item.icon}</span>
              <div className="icon-glow" aria-hidden="true"></div>
            </div>
            <span className="menu-label">{item.label}</span>
            <div className="active-indicator" aria-hidden="true"></div>
          </NavLink>
        ))}
      </div>
      <div className="menu-background" aria-hidden="true"></div>
    </nav>
  )
}