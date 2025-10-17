import { NavLink } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, listNotifications, listOnimojis } from './store';

export default function NavBar() {
  const [notifTick, setNotifTick] = useState(0);
  const me = useMemo(() => getCurrentUser(), []);

  useEffect(() => {
    const i = setInterval(() => setNotifTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  const hasAtlasAlert = useMemo(() => {
    const notifs = listNotifications();
    const onis = listOnimojis();
    const mine = new Set(onis.filter((o) => o.ownerId === me.id).map((o) => o.id));
    return notifs.some((n) => n.type === 'atlas:matured' && n.payload && mine.has(n.payload.onimojiId));
  }, [notifTick, me.id]);

  return (
    <nav className="navbar" aria-label="Navigation principale">
      <div className="nav-left">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'link-active' : ''}`}>Home</NavLink>
        <NavLink to="/compte" className={({ isActive }) => `nav-link ${isActive ? 'link-active' : ''}`}>Compte</NavLink>
        <NavLink to="/atlas" className={({ isActive }) => `nav-link ${isActive ? 'link-active' : ''}`}>
          Mon Atlas
          {hasAtlasAlert && <span className="fx-pulse-dot" aria-label="Nouveau onimoji prêt" />}
        </NavLink>
        <NavLink to="/dreamteam" className={({ isActive }) => `nav-link ${isActive ? 'link-active' : ''}`}>Dreamteam</NavLink>
      </div>
      <div className="nav-right">
        <span className="muted" title={me.id}>@{me.handle}</span>
      </div>
    </nav>
  );
}
