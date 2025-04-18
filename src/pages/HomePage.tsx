import { Link } from "react-router-dom"
import { Building, CreditCard, User } from "../components/Icons"

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Sistema de Gerenciamento Bancário</h1>
          <p className="hero-subtitle">Gerencie clientes, contas e agências.</p>
          <Link to="/clientes" className="btn btn-primary hero-button">
            Ver Clientes
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Funcionalidades</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <User />
            </div>
            <h3 className="feature-title">Gerenciamento de Clientes</h3>
            <p className="feature-description">
              Visualize e gerencie informações detalhadas de todos os clientes do banco.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <CreditCard />
            </div>
            <h3 className="feature-title">Contas Bancárias</h3>
            <p className="feature-description">
              Acesse informações sobre contas correntes e poupança, saldos e limites.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Building />
            </div>
            <h3 className="feature-title">Agências</h3>
            <p className="feature-description">Consulte dados das agências bancárias e suas localizações.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

// CSS para a HomePage
const style = document.createElement("style")
style.textContent = `
  .home-page {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .hero-section {
    background-color: var(--primary-color);
    color: white;
    padding: 60px 20px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 20px;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 24px;
    opacity: 0.9;
  }

  .hero-button {
    font-size: 1rem;
    padding: 12px 24px;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
    color: var(--primary-color);
  }

  .features-section {
    padding: 20px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .feature-card {
    background-color: var(--background-color);
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .feature-icon {
    background-color: var(--secondary-color);
    color: var(--primary-color);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  .feature-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-color);
  }

  .feature-description {
    color: var(--light-text);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }
`
document.head.appendChild(style)
