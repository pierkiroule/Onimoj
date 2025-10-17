import { useEffect, useMemo, useState } from 'react';
import ArcticBackground from '../shared/ArcticBackground';
import { clearNotifications, getCurrentUser, getMyAtlas, listNotifications } from '../shared/store';

export default function Atlas() {
  const me = useMemo(() => getCurrentUser(), []);
  const [tick, setTick] = useState(0);
  const [onimojis, setOnimojis] = useState([]);

  useEffect(() => {
    setOnimojis(getMyAtlas(me.id));
  }, [tick, me.id]);

  useEffect(() => {
    // Clear matured notifications once the page is viewed
    const notifs = listNotifications();
    const mine = new Set(onimojis.map((o) => o.id));
    if (notifs.some((n) => n.type === 'atlas:matured' && n.payload && mine.has(n.payload.onimojiId))) {
      clearNotifications((n) => n.type === 'atlas:matured');
      setTick((t) => t + 1);
    }
  }, [onimojis]);

  return (
    <div className="home-container arctic-night" style={{ alignItems: 'stretch', position: 'relative' }}>
      <ArcticBackground />
      <div className="side-panel" style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Mon Atlas</h2>
        {onimojis.length === 0 && <div className="muted">Aucun onimoji encore. Partage depuis un voyage.</div>}
        <div className="summary-grid">
          {onimojis.map((o) => (
            <div key={o.id} className="summary-card">
              <div className="summary-top">
                <div className="onimoji">{o.emojis}</div>
                {o.matured ? (
                  <span className="badge" style={{ background: '#a6ffcc', color: '#0b4220' }}>éclos</span>
                ) : (
                  <span className="badge">en maturation</span>
                )}
              </div>
              <div className="summary-bottom" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600 }}>{o.title || 'Sans titre'}</div>
                <div className="muted">contributeurs: {o.contributors.length} • partages: {o.shares}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
