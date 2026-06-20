import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // respect an externally assigned port (e.g. preview tooling)
  server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
