// src/utils/promptBuilder.js
// Construire des prompts poétiques obliques avec contraintes lexicales et quelques exemples

import { inuitPreferredLexicon, bannedWordsBase, softCliches, selectLexiconSample } from "../data/poeticLexicon"

const DEFAULT_TEMPERATURE = 0.85

export function buildSystemPrompt({ language = "fr", register = "poetic-oblique" } = {}) {
  const langLine = language === "fr" ? "Écris en français." : "Write in the requested language, default: French."
  return [
    "Tu es un tisserand de phrases obliques, apaisées, sensorielles.",
    "Ta voix est précise, sans emphase, elliptique quand c'est mieux.",
    "Privilégie les images concrètes aux abstractions.",
    langLine,
  ].join("\n")
}

export function buildAntiWordsSection(extraBanned = []) {
  const banned = Array.from(new Set([...bannedWordsBase, ...softCliches, ...extraBanned]))
  return [
    "Évite strictement ces mots/expressions (ou reformule sans les nommer) :",
    "- " + banned.join(", "),
    "Si nécessaire, remplace par une image concrète ou une périphrase sobre.",
  ].join("\n")
}

export function buildInuitLexiconCue(extraLexicon = []) {
  const sample = selectLexiconSample([...inuitPreferredLexicon, ...extraLexicon], 18)
  return [
    "Inspiration lexicale (sans exotiser, avec respect et sobriété) :",
    "- " + sample.join(", "),
    "N'utilise que quelques éléments, avec parcimonie.",
  ].join("\n")
}

export function buildFewShots() {
  // 2-3 exemples très courts, obliques
  return [
    {
      role: "user",
      content: [{ type: "text", text: "Trois fragments: banquise, souffle, lampe." }],
    },
    {
      role: "assistant",
      content: [{ type: "text", text: "Dans le halo du qulliq, la glace respire à peine." }],
    },
    {
      role: "user",
      content: [{ type: "text", text: "Évoquer Sedna sans la nommer, en 1 phrase." }],
    },
    {
      role: "assistant",
      content: [
        {
          type: "text",
          text: "Sous la peau des vagues, une main démêle les nœuds du sel.",
        },
      ],
    },
  ]
}

export function buildPoeticPrompt({ theme, constraints = {}, extraLexicon = [], extraBanned = [] }) {
  const parts = []
  parts.push("Consigne: écris un court texte poétique (6–10 lignes), calme, oblique.")
  if (theme) parts.push(`Thème: ${theme}.`)
  if (constraints?.maxWords) parts.push(`Longueur maximale: ${constraints.maxWords} mots.`)
  if (constraints?.avoidWords?.length) parts.push(`Interdits: ${constraints.avoidWords.join(", ")}.`)
  parts.push("Privilégie: sensations, éléments, gestes, matières.")
  parts.push(buildInuitLexiconCue(extraLexicon))
  parts.push(buildAntiWordsSection(extraBanned))
  parts.push("Forme: vers libres courts; pas de points d'exclamation; pas d'exagération.")
  return parts.join("\n")
}

export function defaultGenParams() {
  return { temperature: DEFAULT_TEMPERATURE, model: "google/gemma-2-2b-it" }
}
