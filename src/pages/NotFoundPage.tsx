import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Página não encontrada</h2>
      <p className="not-found-text">A página que você está procurando não existe ou foi movida.</p>
      <Link to="/" className="btn btn-primary not-found-button">
        Voltar para a página inicial
      </Link>
    </div>
  )
}

export default NotFoundPage

// CSS para a NotFoundPage
const style = document.createElement("style")
style.textContent = `
  .not-found-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
    min-height: 50vh;
  }

  .not-found-title {
    font-size: 6rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 0;
    line-height: 1;
  }

  .not-found-subtitle {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  .not-found-text {
    font-size: 1.1rem;
    color: var(--light-text);
    margin-bottom: 24px;
    max-width: 500px;
  }

  .not-found-button {
    padding: 10px 20px;
  }
`
document.head.appendChild(style)
