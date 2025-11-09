import "./BottomMenu.css"

export default function BottomMenu({ currentPage, onNavigate }) {
  const menuItems = [
    { icon: "🏠", label: "Accueil", id: "home" },
    { icon: "🌙", label: "RÊV", id: "onimoji-journey" }, // création / exploration personnelle
    { icon: "💤", label: "Rêvothèque", id: "revotheque" }, // bibliothèque personnelle
    { icon: "🌐", label: "Reso•°", id: "echoreso" }, // réseau collectif
    { icon: "👤", label: "Profil", id: "profil" }, // profil utilisateur
  ]

  return (
    <nav
      className="bottom-menu"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="menu-container">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`menu-item ${currentPage === item.id ? "active" : ""}`}
            aria-label={item.label}
            role="button"
            tabIndex={0}
          >
            <div className="menu-icon">
              <span className="icon-emoji" aria-hidden="true">
                {item.icon}
              </span>
              <div className="icon-glow" aria-hidden="true"></div>
            </div>
            <span className="menu-label">{item.label}</span>
            <div className="active-indicator" aria-hidden="true"></div>
          </button>
        ))}
      </div>
    </nav>
  )
}