
import type { Categoria } from '../types'

export const categorias: Categoria[] = [
  { id: 1, nome: 'Música' },
  { id: 7, nome: 'Teatro' },
  { id: 8, nome: 'Festival' },
  { id: 9, nome: 'Dança' },
  { id: 10, nome: 'Cinema' },
  { id: 11, nome: 'Exposição' },
  { id: 12, nome: 'Biblioteca' },
]

export function nomeDaCategoria(id: number): string {
  return categorias.find((c) => c.id === id)?.nome ?? ''
}
