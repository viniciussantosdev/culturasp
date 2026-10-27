
import { useEffect, useState } from 'react'
import type { Categoria, Evento } from '../types'
import { buscar } from '../api/cliente'

// Guarda os dados, o caminho da API e possíveis erros
type Estado<T> = {
  caminho: string
  dados: T | null
  erro: string | null
}

// Hook que busca informações na API
export function useApi<T>(caminho: string) {
  const [estado, setEstado] = useState<Estado<T> | null>(null)

  useEffect(() => {
    let ativo = true

    // Busca os dados no Django
    buscar<T>(caminho)
      .then((dados) => {
        if (ativo) {
          setEstado({ caminho, dados, erro: null })
        }
      })
      .catch((erro: Error) => {
        if (ativo) {
          setEstado({
            caminho,
            dados: null,
            erro: erro.message,
          })
        }
      })

    // Evita atualizar o estado se o componente for desmontado
    return () => {
      ativo = false
    }
  }, [caminho])

  // Só retorna dados correspondentes ao caminho atual
  const atual = estado?.caminho === caminho ? estado : null

  return {
    dados: atual?.dados ?? null,
    erro: atual?.erro ?? null,
    carregando: atual === null,
  }
}

// Hook para buscar eventos
export function useEventos() {
  return useApi<Evento[]>('/api/eventos/')
}

// Hook para buscar categorias
export function useCategorias() {
  return useApi<Categoria[]>('/api/categorias/')
}
