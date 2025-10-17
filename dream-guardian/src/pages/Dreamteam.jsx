import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getMyAtlas, getMyDreamteam } from '../shared/store';

export default function Dreamteam() {
  const me = useMemo(() => getCurrentUser(), []);
  const [contribs, setContribs] = useState([]);

  useEffect(() => {
    const ids = getMyDreamteam(me.id);
    setContribs(ids);
  }, [me.id]);

  const atlas = getMyAtlas(me.id);

  return (
    <div className="home-container arctic-night" style={{ alignItems: 'stretch' }}>
      <div className="side-panel" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Dreamteam</h2>
        <p className="muted">Contributeurs à tes onimojis (par leurs échos).</p>
        {contribs.length === 0 && <div className="muted">Personne encore — invite à résonner avec tes onimojis.</div>}
        <div className="summary-grid">
          {contribs.map((id) => (
            <div key={id} className="summary-card">
              <div className="summary-top">
                <div style={{ fontWeight: 600 }}>@{id}</div>
                <span className="badge">allié</span>
              </div>
              <div className="summary-bottom" style={{ justifyContent: 'flex-start', gap: 6 }}>
                <span className="muted">a contribué à {atlas.filter((o) => o.contributors.includes(id)).length} onimoji(s)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
