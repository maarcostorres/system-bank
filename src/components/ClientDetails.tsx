import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getClienteByCpfCnpj, getContasByClienteCpfCnpj, getAgenciaByCodigo } from "../services/api"
import type { Cliente, Conta, Agencia } from "../types"
import { ArrowLeft, User, CreditCard, Building } from "./Icons"
import Loading from "./Loading"

interface ClientDetailsProps {
  cpfCnpj: string // Adicionar tipagem para cpfCnpj
  onBack: () => void // Adicionar tipagem para onBack
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ cpfCnpj, onBack }) => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [contas, setContas] = useState<Conta[]>([])
  const [agencia, setAgencia] = useState<Agencia | null>(null)
  const [activeTab, setActiveTab] = useState("info")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClienteData = async () => {
      if (!cpfCnpj) return

      try {
        setLoading(true)

        // Buscar dados do cliente
        const clienteData = await getClienteByCpfCnpj(cpfCnpj)
        if (!clienteData) {
          setError("Cliente não encontrado")
          setLoading(false)
          return
        }
        setCliente(clienteData)

        // Buscar contas do cliente
        const contasData = await getContasByClienteCpfCnpj(cpfCnpj)
        setContas(contasData)

        // Buscar agência do cliente
        if (clienteData.codigoAgencia) {
          const agenciaData = await getAgenciaByCodigo(clienteData.codigoAgencia)
          setAgencia(agenciaData)
        }

        setLoading(false)
      } catch (err) {
        setError("Erro ao carregar os dados do cliente")
        setLoading(false)
      }
    }

    fetchClienteData()
  }, [cpfCnpj])

  // Exibir CPF/CNPJ
  const formatCpfCnpj = (cpfCnpj: string) => {
    cpfCnpj = cpfCnpj.replace(/\D/g, "")
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else if (cpfCnpj.length === 14) {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return cpfCnpj
  }

  // Exibir data
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

  // Exibir valor
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  if (loading) return <Loading />

  if (error || !cliente) {
    return (
      <div className="error-container">
        <p className="error-message">{error || "Cliente não encontrado"}</p>
        <Link to="/" className="btn btn-primary">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  return (
    <div className="client-details">
      <button onClick={onBack} className="btn btn-secondary">Voltar</button>
      {/* Botão de voltar */}
      <Link to="/" className="back-link">
        <ArrowLeft /> Voltar para lista de clientes
      </Link>

      {/* Cabeçalho do cliente */}
      <div className="client-header">
        <div className="client-avatar">
          <User />
        </div>
        <div className="client-header-info">
          <h1 className="client-name">{cliente.nome}</h1>
          <p className="client-cpf">{formatCpfCnpj(cliente.cpfCnpj)}</p>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
          aria-selected={activeTab === "info"}
          role="tab"
        >
          Informações Pessoais
        </button>
        <button
          className={`tab ${activeTab === "contas" ? "active" : ""}`}
          onClick={() => setActiveTab("contas")}
          aria-selected={activeTab === "contas"}
          role="tab"
        >
          Contas Bancárias
        </button>
        <button
          className={`tab ${activeTab === "agencia" ? "active" : ""}`}
          onClick={() => setActiveTab("agencia")}
          aria-selected={activeTab === "agencia"}
          role="tab"
        >
          Agência
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="tab-content">
        {/* Aba de Informações Pessoais */}
        {activeTab === "info" && (
          <div className="info-tab">
            <div className="card">
              <h2 className="card-title">Dados Pessoais</h2>
              <p className="card-subtitle">Informações pessoais do cliente.</p>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Nome Completo</span>
                  <span className="info-value">{cliente.nome}</span>
                </div>

                {cliente.nomeSocial && (
                  <div className="info-item">
                    <span className="info-label">Nome Social</span>
                    <span className="info-value">{cliente.nomeSocial}</span>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">CPF/CNPJ</span>
                  <span className="info-value">{formatCpfCnpj(cliente.cpfCnpj)}</span>
                </div>

                {cliente.rg && (
                  <div className="info-item">
                    <span className="info-label">RG</span>
                    <span className="info-value">{cliente.rg}</span>
                  </div>
                )}

                <div className="info-item">
                  <span className="info-label">Data de Nascimento</span>
                  <span className="info-value">{formatDate(cliente.dataNascimento)}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Estado Civil</span>
                  <span className="info-value">{cliente.estadoCivil}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{cliente.email}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Endereço</span>
                  <span className="info-value">{cliente.endereco}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Dados Financeiros</h2>
              <p className="card-subtitle">Informações financeiras do cliente.</p>

              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Renda Anual</span>
                  <span className="info-value">{formatCurrency(cliente.rendaAnual)}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Patrimônio</span>
                  <span className="info-value">{formatCurrency(cliente.patrimonio)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba de Contas Bancárias */}
        {activeTab === "contas" && (
          <div className="contas-tab">
            {contas.length === 0 ? (
              <div className="card">
                <h2 className="card-title">Nenhuma conta encontrada</h2>
                <p className="card-subtitle">Este cliente não possui contas bancárias cadastradas.</p>
              </div>
            ) : (
              contas.map((conta) => (
                <div className="card" key={conta.id}>
                  <div className="conta-header">
                    <div className="conta-icon">
                      <CreditCard />
                    </div>
                    <div>
                      <h2 className="card-title">Conta {conta.tipo === "corrente" ? "Corrente" : "Poupança"}</h2>
                      <p className="card-subtitle">ID: {conta.id}</p>
                    </div>
                    {conta.tipo === "corrente" && <span className="conta-badge">Corrente</span>}
                    {conta.tipo === "poupanca" && <span className="conta-badge poupanca">Poupança</span>}
                  </div>

                  <div className="conta-details">
                    <div className="conta-info">
                      <span className="conta-label">Saldo Atual</span>
                      <span className="conta-value">{formatCurrency(conta.saldo)}</span>
                    </div>

                    <div className="conta-info">
                      <span className="conta-label">Limite de Crédito</span>
                      <span className="conta-value">{formatCurrency(conta.limiteCredito)}</span>
                    </div>

                    <div className="conta-info">
                      <span className="conta-label">Crédito Disponível</span>
                      <span className="conta-value">{formatCurrency(conta.creditoDisponivel)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Aba de Agência */}
        {activeTab === "agencia" && (
          <div className="agencia-tab">
            {!agencia ? (
              <div className="card">
                <h2 className="card-title">Agência não encontrada</h2>
                <p className="card-subtitle">Não foi possível encontrar informações sobre a agência deste cliente.</p>
              </div>
            ) : (
              <div className="card">
                <div className="agencia-header">
                  <div className="agencia-icon">
                    <Building />
                  </div>
                  <div>
                    <h2 className="card-title">{agencia.nome}</h2>
                    <p className="card-subtitle">Código: {agencia.codigo}</p>
                  </div>
                </div>

                <div className="agencia-details">
                  <div className="info-item">
                    <span className="info-label">ID da Agência</span>
                    <span className="info-value">{agencia.id}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Endereço</span>
                    <span className="info-value">{agencia.endereco}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientDetails

// Corresponder a design das imagens
const style = document.createElement("style")
style.textContent = `
  .client-details {
    padding: 20px 0;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    color: var(--primary-color);
    font-size: 14px;
  }

  .client-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }

  .client-avatar {
    background-color: var(--secondary-color);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: var(--primary-color);
  }

  .client-name {
    font-size: 1.8rem;
    margin-bottom: 5px;
    color: var(--text-color);
  }

  .client-cpf {
    font-size: 1rem;
    color: var(--light-text);
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
    overflow-x: auto;
    background-color: var(--background-color);
    border-radius: 8px 8px 0 0;
  }

  .tab {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--light-text);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--primary-color);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }

  .tab-content {
    background-color: var(--background-color);
    border-radius: 0 0 8px 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-size: 12px;
    color: var(--light-text);
    margin-bottom: 5px;
  }

  .info-value {
    font-size: 16px;
    color: var(--text-color);
  }

  .conta-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .conta-icon {
    background-color: var(--secondary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: var(--primary-color);
  }

  .conta-badge {
    margin-left: auto;
    background-color: var(--primary-color);
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .conta-badge.poupanca {
    background-color: #4caf50;
  }

  .conta-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .conta-info {
    display: flex;
    flex-direction: column;
  }

  .conta-label {
    font-size: 12px;
    color: var(--light-text);
    margin-bottom: 5px;
  }

  .conta-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
  }

  .agencia-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .agencia-icon {
    background-color: var(--secondary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: var(--primary-color);
  }

  .agencia-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .error-container {
    text-align: center;
    padding: 40px;
  }

  @media (max-width: 768px) {
    .tabs {
      padding-bottom: 5px;
    }
    
    .tab {
      padding: 10px 15px;
      font-size: 13px;
    }
    
    .info-grid, .conta-details, .agencia-details {
      grid-template-columns: 1fr;
    }
  }
`
document.head.appendChild(style)
