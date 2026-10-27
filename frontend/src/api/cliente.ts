 // Endereco principal da API Django
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Funcao que faz as requisicoes para a API
async function chamar<T>(
  caminho: string,
  opcoes?: RequestInit
): Promise<T> {
  let resposta: Response

  try {
    // Tenta conectar com o servidor Django
    resposta = await fetch(`${BASE}${caminho}`, opcoes)
  } catch {
    throw new Error(
      'Nao foi possivel conectar a API. O servidor esta ligado?'
    )
  }

  // Verifica se a API respondeu com erro
  if (!resposta.ok) {
    throw new Error(`A API respondeu com erro ${resposta.status}.`)
  }

  // Converte a resposta para JSON
  return (await resposta.json()) as T
}

// Busca informacoes na API (GET)
export function buscar<T>(caminho: string): Promise<T> {
  return chamar<T>(caminho)
}

// Envia informacoes para a API (POST)
export function enviar<T>(
  caminho: string,
  corpo: unknown
): Promise<T> {
  return chamar<T>(caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
}