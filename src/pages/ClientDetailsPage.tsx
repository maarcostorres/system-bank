import { useParams, useNavigate } from "react-router-dom"
import ClientDetails from "../components/ClientDetails"

const ClientDetailsPage = () => {
  const { cpfCnpj } = useParams<{ cpfCnpj?: string }>() 
  const navigate = useNavigate()

  const handleBack = () => {
    navigate("/clientes")
  }

  if (!cpfCnpj) {
    return (
      <div className="error-container">
        <h2>Erro</h2>
        <p>Cliente não encontrado. CPF/CNPJ não fornecido.</p>
        <button onClick={handleBack} className="btn btn-primary">
          Voltar para lista de clientes
        </button>
      </div>
    )
  }

  return <ClientDetails cpfCnpj={cpfCnpj} onBack={handleBack} /> // Garantir que o CPF seja string
}

export default ClientDetailsPage
