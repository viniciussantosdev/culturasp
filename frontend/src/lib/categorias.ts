import type { Categoria } from '../types'

export function categoriasDoEvento(ids: number[], todas: Categoria[]): Categoria[] {
  return todas.filter((c) => ids.includes(c.id))
}