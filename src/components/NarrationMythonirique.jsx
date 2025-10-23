export default function NarrationMythonirique({ bulle }) {
  const { resonance_level, divergence_score, harmonic_balance } = bulle
  let message = ""

  if (harmonic_balance > 0.8)
    message = "✨ Ta bulle résonne d’une harmonie rare. Le souffle du monde t’écoute."
  else if (resonance_level > 0.7)
    message = "🌠 Ta bulle danse parmi les mythes, au rythme des marées intérieures."
  else if (divergence_score > 0.6)
    message = "🌊 Une bulle libre, qui trace un sillage singulier dans la nuit polaire."
  else
    message = "🌌 Le tissage commence à peine, mais déjà le rêve prend forme."

  return (
    <p
      style={{
        marginTop: "1rem",
        fontStyle: "italic",
        opacity: 0.85,
        maxWidth: "80%",
        margin: "0 auto"
      }}
    >
      {message}
    </p>
  )
}