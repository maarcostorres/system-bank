import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"

// Usar HashRouter em vez de BrowserRouter para GitHub Pages
// HashRouter funciona melhor com GitHub Pages porque não requer configuração de servidor
console.log("Aplicação iniciando...")

// Verificar se o elemento root existe
const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error("Elemento root não encontrado!")
  // Criar um elemento root se não existir
  const newRoot = document.createElement("div")
  newRoot.id = "root"
  document.body.appendChild(newRoot)

  ReactDOM.createRoot(newRoot).render(
    <HashRouter>
      <App />
    </HashRouter>,
  )
} else {
  ReactDOM.createRoot(rootElement).render(
    <HashRouter>
      <App />
    </HashRouter>,
  )
}
