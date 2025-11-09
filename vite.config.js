import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Détermine le chemin de base (base)
// 1. Utilise VITE_BASE_PATH si défini (pour les chemins absolus sur certains serveurs).
// 2. Par défaut, utilise "./" pour générer des chemins relatifs (essentiel pour file:// ou sous-répertoires).
const base =
  process.env.VITE_BASE_PATH && process.env.VITE_BASE_PATH.trim().length > 0
    ? process.env.VITE_BASE_PATH
    : "./"

export default defineConfig({
  plugins: [react()],
  // Utilisation de la variable 'base' calculée
  base,
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
  },
})

