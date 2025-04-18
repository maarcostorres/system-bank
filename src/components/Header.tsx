"use client"

import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { Sun, Moon } from "./Icons"
import logo from "../assets/logo.png"

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme()
  const location = useLocation()

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo-container">
          <img src={logo || "/placeholder.svg"} alt="BANESTES" className="logo" />
          <span className="logo-text">BANESTES</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Início
          </Link>
          <Link to="/clientes" className={`nav-link ${location.pathname.startsWith("/clientes") ? "active" : ""}`}>
            Clientes
          </Link>
        </nav>

        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  )
}

export default Header

// CSS para o Header
const style = document.createElement("style")
style.textContent = `
  .header {
    background-color: var(--background-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo {
    height: 24px;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
  }

  .main-nav {
    display: flex;
    gap: 20px;
  }

  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    padding: 5px 0;
    position: relative;
  }

  .nav-link:hover {
    color: var(--primary-color);
    text-decoration: none;
  }

  .nav-link.active {
    color: var(--primary-color);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
  }

  .theme-toggle {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }

  @media (max-width: 576px) {
    .main-nav {
      gap: 10px;
    }
    
    .nav-link {
      font-size: 14px;
    }
  }
`
document.head.appendChild(style)
