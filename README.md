# Project

This project is built with React + Vite.

## Flux pédagogique Inuit

Le parcours de la mission Inuite introduit un module d’étape culturel avant l’interaction du hublot :

1. Étape courante chargée via Supabase depuis `mission_steps_inuite`.
2. Affichage du module `ModuleInuitStep` (texte culturel, question, pratique, intégration).
3. Clic sur « 🌌 Ouvrir le Hublot » pour lancer `HublotResonant` (sélection de 3 esprits).
4. Validation renvoie un payload (titre, emojis, culture, esprit, step_number).
5. Titrage + sauvegarde dans `dream_stars`, puis narration et quiz.

### Fichiers clés

- `src/pages/MissionInuite.jsx` — orchestre le flux (étape, module, hublot, enregistrement, quiz).
- `src/components/ModuleInuitStep.jsx` — présente le contenu culturel de l’étape.
- `src/components/ModuleInuitStep.css` — styles du module inuit.
- `src/components/HublotResonant.jsx` — hublot D3 de sélection (3 esprits).
- `src/data/InuitNetwork.js` — nœuds/liens utilisés par le hublot.

### Données

Le contenu textuel (ex. `spirit_name`, `symbol`, `theme`, `description`, `question`, `practice`, `integration`) provient de la table `mission_steps_inuite` et est récupéré via Supabase dans `MissionInuite.jsx`.
