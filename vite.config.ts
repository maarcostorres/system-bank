import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Obter o nome do repositório do package.json para usar como base URL no GitHub Pages
const getRepoName = () => {
  try {
    const packageJson = require("./package.json")
    return packageJson.name
  } catch (e) {
    return ""
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usar o nome do repositório como base para GitHub Pages
  base: process.env.NODE_ENV === "production" ? `/${getRepoName()}/` : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false, // Desativar sourcemaps em produção para melhor performance
  },
  server: {
    open: true, // Abrir navegador automaticamente
  },
})
