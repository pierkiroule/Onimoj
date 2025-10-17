import { Link } from 'react-router-dom';
import CosmojiD3 from '../shared/CosmojiD3';
import '../App.css';

export default function InuitVoyage() {
  return (
    <div className="home-container" style={{ gap: '1rem' }}>
      <h1>Navette oniris — Mission Inuit</h1>
      <p style={{ maxWidth: 720 }}>
        À l'intérieur, tu découvres un hublot d'où tu aperçois le <strong>cosmoji</strong> :
        une constellation d'émojis en mouvement qui évoque la culture onirique.
      </p>
      <div className="hublot-wrapper">
        <div className="hublot">
          <CosmojiD3 width={320} height={320} />
        </div>
      </div>
      <div>
        <Link to="/" className="primary-button">Retour</Link>
      </div>
    </div>
  );
}
