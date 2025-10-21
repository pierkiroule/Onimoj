export default function OnimojiNarration({ star }) {
  const { resonance_level, divergence_score, harmonic_balance } = star

  let message = ""
  if (harmonic_balance > 0.8) message = "✨ Ton étoile vibre d’une harmonie rare. Le cosmos t’écoute."
  else if (resonance_level > 0.7) message = "🌠 Ton Onimoji chante à l’unisson des constellations voisines."
  else if (divergence_score > 0.6) message = "🌊 Une étoile libre… sa lumière trace un chemin singulier."
  else message = "🌌 Le tissage commence à peine, mais déjà le ciel s’en souvient."

  return (
    <p style={{
      marginTop: "1rem",
      fontStyle: "italic",
      opacity: 0.85,
      maxWidth: "80%",
      margin: "0 auto",
    }}>
      {message}
    </p>
  )
}