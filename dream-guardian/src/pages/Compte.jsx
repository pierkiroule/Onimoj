import { useMemo, useState } from 'react';
import { getCurrentUser, setCurrentUser } from '../shared/store';

export default function Compte() {
  const me = useMemo(() => getCurrentUser(), []);
  const [name, setName] = useState(me.name || '');
  const [handle, setHandle] = useState(me.handle || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const next = { ...me, name: name.trim() || 'Voyageur', handle: handle.trim() || 'voyageur' };
    setCurrentUser(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const switchUser = () => {
    const rnd = Math.floor(Math.random() * 1000);
    const next = { id: `user_sw_${rnd}`, name: `Voyageur ${rnd}` , handle: `voyageur${rnd}` };
    setCurrentUser(next);
    window.location.reload();
  };

  return (
    <div className="home-container arctic-night" style={{ alignItems: 'stretch' }}>
      <div className="side-panel" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Compte</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          <label style={{ display: 'grid', gap: 4, textAlign: 'left' }}>
            <span>Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label style={{ display: 'grid', gap: 4, textAlign: 'left' }}>
            <span>Handle</span>
            <input value={handle} onChange={(e) => setHandle(e.target.value)} />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button className="primary-button" onClick={save}>Enregistrer</button>
          <button className="primary-button" onClick={switchUser}>Changer d’utilisateur (demo)</button>
          {saved && <span className="badge">Sauvé</span>}
        </div>
      </div>
    </div>
  );
}
