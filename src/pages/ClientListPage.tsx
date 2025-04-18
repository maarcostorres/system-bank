"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ClientList from "../components/ClientList"

const ClientListPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useState(new URLSearchParams(window.location.search))
  const initialSearch = searchParams.get("search") || ""

  const handleSelectClient = (cpfCnpj: string) => {
    if (cpfCnpj) {
      navigate(`/clientes/${cpfCnpj}`)
    }
  }

  return (
    <div className="client-list-page">
      <ClientList onSelectClient={handleSelectClient} selectedClient={null} initialSearch={initialSearch} />
    </div>
  )
}

export default ClientListPage
