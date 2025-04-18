"use client"

interface PaginationProps {
  itemsPerPage: number
  totalItems: number
  currentPage: number
  paginate: (pageNumber: number) => void
}

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }: PaginationProps) => {
  const pageNumbers = []

  // Calcular o número total de páginas
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  // Não mostrar paginação se houver apenas uma página
  if (pageNumbers.length <= 1) return null

  return (
    <div className="pagination-container">
      <button
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`pagination-button prev ${currentPage === 1 ? "disabled" : ""}`}
        aria-label="Página anterior"
      >
        <span>Previous</span>
      </button>

      <div className="pagination-numbers">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-number ${currentPage === number ? "active" : ""}`}
            aria-label={`Página ${number}`}
            aria-current={currentPage === number ? "page" : undefined}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
        className={`pagination-button next ${currentPage === pageNumbers.length ? "disabled" : ""}`}
        aria-label="Próxima página"
      >
        <span>Next</span>
      </button>
    </div>
  )
}

export default Pagination

// CSS para o Pagination
const style = document.createElement("style")
style.textContent = `
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-top: 1px solid var(--border-color);
  }

  .pagination-button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.9rem;
    cursor: pointer;
    padding: 8px 12px;
  }

  .pagination-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-numbers {
    display: flex;
    gap: 5px;
    margin: 0 10px;
  }

  .pagination-number {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 0.9rem;
    cursor: pointer;
  }

  .pagination-number.active {
    background-color: var(--primary-color);
    color: white;
  }

  .pagination-number:hover:not(.active) {
    background-color: var(--secondary-color);
  }
`
document.head.appendChild(style)
