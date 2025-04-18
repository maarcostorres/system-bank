import type React from "react"
import { useState, useEffect } from "react"
import type { Cliente } from "../types"
import { User, Search } from "./Icons"
import Pagination from "./Pagination"
import Loading from "./Loading"
import { useNavigate, useLocation } from "react-router-dom"
import { fetchClientes } from "../services/api"



interface ClientListProps {
  onSelectClient: (cpfCnpj: string) => void
  selectedClient: string | null
  initialSearch?: string
}

const ClientList = ({ onSelectClient, initialSearch = "" }: ClientListProps) => {
  console.log("ClientList renderizando...")

  const navigate = useNavigate()
  const location = useLocation()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const clientesPerPage = 10

  // Carregar clientes ao montar o componente
  useEffect(() => {
    const loadClientes = async () => {
      try {
        setLoading(true)
        const data = await fetchClientes()
        setClientes(data)

        // Aplicar filtro inicial se houver
        if (initialSearch) {
          const termLower = initialSearch.toLowerCase()
          const filtered = data.filter(
            (cliente) => cliente.nome.toLowerCase().includes(termLower) || cliente.cpfCnpj.includes(termLower),
          )
          setFilteredClientes(filtered)
        } else {
          setFilteredClientes(data)
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
        // Usar dados mockados em caso de erro
        setClientes([])
        setFilteredClientes([])
      } finally {
        setLoading(false)
      }
    }

    loadClientes()
  }, [initialSearch])

  // Atualizar a URL quando o termo de pesquisa mudar
  useEffect(() => {
    if (searchTerm) {
      navigate(`${location.pathname}?search=${encodeURIComponent(searchTerm)}`, { replace: true })
    } else {
      navigate(location.pathname, { replace: true })
    }
  }, [searchTerm, navigate, location.pathname])

  // Função para lidar com a mudança no campo de pesquisa
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Filtrar clientes
    if (value.trim() === "") {
      setFilteredClientes(clientes)
    } else {
      const termLower = value.toLowerCase()
      const filtered = clientes.filter(
        (cliente) => cliente.nome.toLowerCase().includes(termLower) || cliente.cpfCnpj.includes(termLower),
      )
      setFilteredClientes(filtered)
    }

    setCurrentPage(1) // Resetar para a primeira página ao filtrar
  }

  // Calcular clientes da página atual
  const indexOfLastCliente = currentPage * clientesPerPage
  const indexOfFirstCliente = indexOfLastCliente - clientesPerPage
  const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente)

  // Formatar CPF/CNPJ para exibição
  const formatCpfCnpj = (cpfCnpj: string) => {
    cpfCnpj = cpfCnpj.replace(/\D/g, "")
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else if (cpfCnpj.length === 14) {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return cpfCnpj
  }

  // Formatar data para exibição
  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return "Data inválida"
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Função para mudar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) return <Loading />

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Gerencie e visualize todos os clientes do banco.</p>
        </div>

        {/* Barra de pesquisa */}
        <div className="search-container">
          <div className="search-input-container">
            <Search />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF/CNPJ..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Pesquisar clientes"
            />
          </div>
        </div>
      </div>

      <div className="client-table-container">
        <div className="client-table-header">
          <h2 className="table-title">Lista de Clientes</h2>
          <p className="table-subtitle">{filteredClientes.length} cliente(s) encontrado(s)</p>
        </div>

        {/* Tabela de clientes */}
        {filteredClientes.length === 0 ? (
          <div className="no-results">Nenhum cliente encontrado.</div>
        ) : (
          <div className="table-responsive">
            <table className="client-table">
              <thead>
                <tr>
                  <th className="icon-column"></th>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Data de Nascimento</th>
                  <th>Email</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="icon-column">
                      <div className="client-icon">
                        <User />
                      </div>
                    </td>
                    <td>{cliente.nome}</td>
                    <td>{formatCpfCnpj(cliente.cpfCnpj)}</td>
                    <td>{formatDate(cliente.dataNascimento)}</td>
                    <td>{cliente.email}</td>
                    <td className="actions-column">
                      <button onClick={() => onSelectClient(cliente.cpfCnpj)} className="details-button">
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        <Pagination
          itemsPerPage={clientesPerPage}
          totalItems={filteredClientes.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  )
}

export default ClientList

// CSS para o ClientList
const style = document.createElement("style")
style.textContent = `
  .client-list-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .client-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 8px;
  }

  .page-subtitle {
    color: var(--light-text);
    font-size: 1rem;
  }

  .search-container {
    flex-grow: 1;
    max-width: 400px;
  }

  .search-input-container {
    display: flex;
    align-items: center;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 8px 12px;
  }

  .search-input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-size: 14px;
    color: var(--text-color);
  }

  .client-table-container {
    background-color: var(--background-color);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .client-table-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
  }

  .table-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 4px;
  }

  .table-subtitle {
    color: var(--light-text);
    font-size: 0.9rem;
  }

  .table-responsive {
    overflow-x: auto;
  }

  .client-table {
    width: 100%;
    border-collapse: collapse;
  }

  .client-table th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
    color: var(--light-text);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
  }

  .client-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
  }

  .client-table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  .icon-column {
    width: 50px;
  }

  .actions-column {
    width: 100px;
    text-align: center;
  }

  .client-icon {
    width: 32px;
    height: 32px;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-button {
    background-color: var(--secondary-color);
    color: var(--primary-color);
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .details-button:hover {
    background-color: #d5e6f7;
  }

  .no-results {
    padding: 40px 20px;
    text-align: center;
    color: var(--light-text);
  }

  @media (max-width: 768px) {
    .client-list-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .search-container {
      width: 100%;
      max-width: none;
    }

    .client-table th:nth-child(4),
    .client-table td:nth-child(4) {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .client-table th:nth-child(5),
    .client-table td:nth-child(5) {
      display: none;
    }
  }
`
document.head.appendChild(style)
