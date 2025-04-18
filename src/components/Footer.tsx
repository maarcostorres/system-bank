const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">© {currentYear} BANESTES. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer

// CSS para o Footer
const style = document.createElement("style")
style.textContent = `
  .footer {
    background-color: var(--background-color);
    padding: 15px 0;
    border-top: 1px solid var(--border-color);
    margin-top: auto;
    text-align: center;
  }

  .footer-text {
    font-size: 14px;
    color: var(--light-text);
  }
`
document.head.appendChild(style)
