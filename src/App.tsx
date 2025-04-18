"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ClientListPage from "./pages/ClientListPage"
import ClientDetailsPage from "./pages/ClientDetailsPage"
import NotFoundPage from "./pages/NotFoundPage"
import "./App.css"

function App() {
  console.log("App renderizando...")

  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientListPage />} />
            <Route path="/clientes/:cpfCnpj" element={<ClientDetailsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
