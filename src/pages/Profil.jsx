import './Profil.css'

export default function Profil({ onBack }) {
  return (
    <div className="profil-screen fade-in">
      <h2 className="title">👤 Mon Profil Onimoji</h2>
      <p className="subtitle">
        Espace personnel pour suivre tes créations oniriques et ton parcours dans le CosmoDream.
      </p>

      <div className="profil-card card-glow">
        <p><strong>Nom d’utilisateur :</strong> Explorateur Onirique</p>
        <p><strong>Étoiles créées :</strong> 3</p>
        <p><strong>Culture active :</strong> Celtique</p>
        <p><strong>Dernière mission :</strong> Rêve du vent</p>
        <p><strong>Date d’inscription :</strong> 12 octobre 2025</p>
      </div>

      <div className="profil-actions">
        <button className="dream-button">✨ Voir mes étoiles</button>
        <button className="dream-button" onClick={onBack}>⬅️ Retour</button>
      </div>

      <footer className="footer">
        © 2025 Onimoji • Prototype Onirix Beta One
      </footer>
    </div>
  )
}