# Onimoji — Prototype Onirix

React + Vite prototype for the Onimoji experience. The app runs entirely on the client side with a minimal state router implemented in `src/App.jsx` and integrates with Supabase when credentials are available.

## Parcours principaux

- **OnimojiJourney (`src/pages/OnimojiJourney.jsx`)**  
  Voyage en trois étapes : cercle des gardiens (`src/steps/Step1Circle.jsx`), hublot résonant (`src/steps/Step2Hublot.jsx`) et création onirique (`src/steps/Step3Creation.jsx`).  
  Les données des 12 gardiens proviennent de `src/data/inuitSteps.js` et alimentent les composants `InuitCircle` et `BubbleField`.

- **EchoReso Hub (`src/pages/echoreso/Index.jsx`)**  
  Interface communautaire combinant le flot interactif `EchoResoFlow.jsx` (visualisation D3), l’interface météo `MeteoniriqueBoreale.jsx` et le livre des sagesses (`BookOfWisdom.jsx`).

- **Revothèque & Compagnons (`src/pages/Revotheque.jsx`, `src/pages/Profil.jsx`, etc.)**  
  Composants spécialisés appuyés sur Supabase : `DreamFragmentOverlay`, `DreamGallery`, `StarPreview`…

## Structure rapide

- `src/components/` — Composants réutilisables (StarField, BottomMenu, etc.).
- `src/modules/` — Hooks métiers (`useDreamFragments`, `useDreamGenerator`, `useDreamSave`).
- `src/pages/` — Vues à état, regroupées par domaine (`echoreso/`, `Profil.jsx`, `Labo.jsx`…).
- `src/steps/` — Etapes du parcours Onimoji.
- `src/data/` — Jeux de données locaux pour les parcours et le mode hors-ligne.

L’application peut fonctionner en mode « offline » : lorsqu’aucun accès Supabase n’est disponible, les modules retombent sur des données locales (`src/data/dreamsLocal.json`).
