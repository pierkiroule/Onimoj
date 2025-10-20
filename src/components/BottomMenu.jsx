import { NavLink } from 'react-router-dom'
import './BottomMenu.css'

export default function BottomMenu() {
  return (
    <nav className="bottom-menu">
      <NavLink to="/" className="menu-item">🏠</NavLink>
      <NavLink to="/donner" className="menu-item">💫</NavLink>
      <NavLink to="/recevoir" className="menu-item">🌙</NavLink>
      <NavLink to="/profil" className="menu-item">👤</NavLink>
    </nav>
  )
}