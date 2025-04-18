import type { Cliente, Conta, Agencia } from "../types"

// URLs das planilhas
const CLIENTES_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes"
const CONTAS_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas"
const AGENCIAS_URL =
  "https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias"

// Função para fazer o parsing do CSV
const parseCSV = (csv: string): string[][] => {
  const lines = csv.split("\n")
  return lines.map((line) => {
    // Regex para lidar com campos entre aspas que podem conter vírgulas
    const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g
    const matches = line.match(regex) || []
    return matches.map((match) => match.replace(/^"|"$/g, "").trim())
  })
}

// Função para converter string para data
const parseDate = (dateStr: string): Date => {
  try {
    // Verificar se a data está no formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/").map(Number)
      return new Date(year, month - 1, day)
    }

    // Verificar se a data está no formato DD/MM/YY
    if (/^\d{2}\/\d{2}\/\d{2}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/").map(Number)
      return new Date(2000 + year, month - 1, day)
    }

    // Verificar se a data está no formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr)
    }

    // Verificar se a data está no formato DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-").map(Number)
      return new Date(year, month - 1, day)
    }

    // Verificar se a data está no formato sem separadores (DDMMYYYY)
    if (/^\d{8}$/.test(dateStr)) {
      const day = Number.parseInt(dateStr.substring(0, 2))
      const month = Number.parseInt(dateStr.substring(2, 4)) - 1
      const year = Number.parseInt(dateStr.substring(4, 8))
      return new Date(year, month, day)
    }

    // Se nenhum formato conhecido, tentar o parse padrão
    return new Date(dateStr)
  } catch (error) {
    console.error("Erro ao converter data:", dateStr, error)
    return new Date() // Retorna a data atual como fallback
  }
}

// Função para converter string para número
const parseNumber = (numStr: string): number => {
  return Number.parseFloat(numStr.replace(/[^\d.-]/g, ""))
}

// Função para buscar e processar os clientes
export const fetchClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await fetch(CLIENTES_URL)
    const csvData = await response.text()
    const rows = parseCSV(csvData)

    // Pular a linha de cabeçalho
    const dataRows = rows.slice(1)

    return dataRows.map((row) => {
      // Mapear os índices das colunas conforme a planilha
      return {
        id: row[0],
        cpfCnpj: row[1],
        rg: row[2] || undefined,
        dataNascimento: parseDate(row[3]),
        nome: row[4],
        nomeSocial: row[5] || undefined,
        email: row[6],
        endereco: row[7],
        rendaAnual: parseNumber(row[8]),
        patrimonio: parseNumber(row[9]),
        estadoCivil: row[10] as "Solteiro" | "Casado" | "Viúvo" | "Divorciado",
        codigoAgencia: Number.parseInt(row[11]),
      }
    })
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
}

// Função para buscar e processar as contas
export const fetchContas = async (): Promise<Conta[]> => {
  try {
    const response = await fetch(CONTAS_URL)
    const csvData = await response.text()
    const rows = parseCSV(csvData)

    // Pular a linha de cabeçalho
    const dataRows = rows.slice(1)

    return dataRows.map((row) => {
      return {
        id: row[0],
        cpfCnpjCliente: row[1],
        tipo: row[2] as "corrente" | "poupanca",
        saldo: parseNumber(row[3]),
        limiteCredito: parseNumber(row[4]),
        creditoDisponivel: parseNumber(row[5]),
      }
    })
  } catch (error) {
    console.error("Erro ao buscar contas:", error)
    return []
  }
}

// Função para buscar e processar as agências
export const fetchAgencias = async (): Promise<Agencia[]> => {
  try {
    const response = await fetch(AGENCIAS_URL)
    const csvData = await response.text()
    const rows = parseCSV(csvData)

    // Pular a linha de cabeçalho
    const dataRows = rows.slice(1)

    return dataRows.map((row) => {
      return {
        id: row[0],
        codigo: Number.parseInt(row[1]),
        nome: row[2],
        endereco: row[3],
      }
    })
  } catch (error) {
    console.error("Erro ao buscar agências:", error)
    return []
  }
}

// Função para buscar cliente por CPF/CNPJ
export const getClienteByCpfCnpj = async (cpfCnpj: string): Promise<Cliente | null> => {
  const clientes = await fetchClientes()
  return clientes.find((cliente) => cliente.cpfCnpj === cpfCnpj) || null
}

// Função para buscar contas de um cliente
export const getContasByClienteCpfCnpj = async (cpfCnpj: string): Promise<Conta[]> => {
  const contas = await fetchContas()
  return contas.filter((conta) => conta.cpfCnpjCliente === cpfCnpj)
}

// Função para buscar agência por código
export const getAgenciaByCodigo = async (codigo: number): Promise<Agencia | null> => {
  const agencias = await fetchAgencias()
  return agencias.find((agencia) => agencia.codigo === codigo) || null
}
