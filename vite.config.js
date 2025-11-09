import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const base =
  process.env.VITE_BASE_PATH && process.env.VITE_BASE_PATH.trim().length > 0
    ? process.env.VITE_BASE_PATH
    : "./"

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
  },
})