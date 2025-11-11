import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  // 🔹 Charge les variables .env (même sous Termux)
  const env = loadEnv(mode, process.cwd(), "")

  const base =
    env.VITE_BASE_PATH && env.VITE_BASE_PATH.trim().length > 0
      ? env.VITE_BASE_PATH
      : "./"

  console.log("🌍 ENV loaded:",
    env.VITE_SUPABASE_URL ? "✅ Supabase URL détectée" : "❌ Aucune URL",
    env.VITE_SUPABASE_ANON_KEY ? "✅ Key présente" : "❌ Key absente"
  )

  return {
    plugins: [react()],
    base,
    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
    },
    define: {
      // 🔹 Rend les variables disponibles dans le code client
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      "import.meta.env.VITE_BASE_PATH": JSON.stringify(env.VITE_BASE_PATH),
    },
  }
})