import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/", // <== Corrige ici (pas ./)
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor"
            if (id.includes("d3")) return "d3-vendor"
            if (id.includes("supabase")) return "supabase-vendor"
            return "vendor"
          }
        },
      },
    },
  },
})