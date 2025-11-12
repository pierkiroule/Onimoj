export const filBleuConfig = {
  version: "1.0.0",
  autoStart: true,
  storageKey: "filBleuProgress",
  minDelayBetweenStepsMs: 800,
}

export const filBleuSteps = [
  {
    id: "souffle-origine",
    text: "Respire. Le rêve circule entre toi et le monde.",
    principle: "Co-création respirée, pas de possession du rêve.",
    trigger: { type: "onMountDelay", ms: 1200 },
    placement: "bottom-center",
    durationMs: 5000,
  },
  {
    id: "hublot-membrane",
    text: "Effleure le hublot. C’est une membrane, pas un écran.",
    principle: "Interface résonante, réciprocité humain–artefact.",
    trigger: { type: "event", name: "hublot.touch" },
    placement: "top-center",
    durationMs: 5200,
  },
  {
    id: "audio-respire",
    text: "Lance l’audio. Laisse la matière sonore te répondre.",
    principle: "Résonance organique–numérique.",
    trigger: { type: "event", name: "audio.play" },
    placement: "top-right",
    durationMs: 5200,
  },
  {
    id: "reseau-tissage",
    text: "Observe les liens. Tu co-crées des passages.",
    principle: "Réseau vivant, associations partagées.",
    trigger: { type: "event", name: "graph.visible" },
    placement: "bottom-center",
    durationMs: 5200,
  },
  {
    id: "gestes-minimum",
    text: "Moins d’effort. Plus de sentir. Le réseau danse.",
    principle: "Contemplation active, sobriété gestuelle.",
    trigger: { type: "event", name: "audio.pulse" },
    placement: "bottom-left",
    durationMs: 5200,
  },
  {
    id: "offrande",
    text: "Dépose un fragment. Il deviendra ressource.",
    principle: "Socioconstructivisme onirique.",
    trigger: { type: "event", name: "dream.added" },
    placement: "top-center",
    durationMs: 5200,
  },
]
