const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function chamar<T>(
  caminho: string,
  opcoes: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(opcoes.headers)

  if (opcoes.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Token ${token}`)
  }

  let resposta: Response

  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      ...opcoes,
      headers,
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o servidor está ligado.'
    )
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    const mensagem =
      dados?.erro ||
      dados?.detail ||
      dados?.mensagem ||
      Object.values(dados ?? {})
        .flat()
        .find((valor) => typeof valor === 'string') ||
      `A API respondeu com erro ${resposta.status}.`

    throw new Error(String(mensagem))
  }

  return dados as T
}

export function buscar<T>(
  caminho: string,
  token?: string
): Promise<T> {
  return chamar<T>(caminho, {}, token)
}

export function enviar<T>(
  caminho: string,
  corpo: unknown,
  token?: string
): Promise<T> {
  return chamar<T>(
    caminho,
    {
      method: 'POST',
      body: JSON.stringify(corpo),
    },
    token
  )
}