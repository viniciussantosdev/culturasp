import { useEffect, useState } from 'react'
import type { Categoria, Evento } from '../types'
import { buscar } from '../api/cliente'

type Estado<T> = {
  caminho: string
  dados: T | null
  erro: string | null
}

export function useApi<T>(caminho: string) {
  const [estado, setEstado] = useState<Estado<T> | null>(null)

  useEffect(() => {
    let ativo = true

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

    return () => {
      ativo = false
    }
  }, [caminho])

  const atual = estado?.caminho === caminho ? estado : null

  return {
    dados: atual?.dados ?? null,
    erro: atual?.erro ?? null,
    carregando: atual === null,
  }
}

export function useEventos() {
  return useApi<Evento[]>('/api/eventos/')
}

export function useCategorias() {
  return useApi<Categoria[]>('/api/categorias/')
}