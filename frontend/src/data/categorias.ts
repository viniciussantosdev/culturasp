import type { Categoria } from '../types'

export const categorias: Categoria[] = [
    {id: 1, nome: 'Música' },
    {id: 2, nome: 'Teatro' },
    {id: 3, nome: 'Cinema' },
    {id: 4, nome: 'Exposição' },
    {id: 5, nome: 'Festival' },
    {id: 6, nome: 'Dança' },
    {id: 7, nome: 'Biblioteca' },
]

export function nomeDaCategoria(id: number): string {
    return categorias.find((c) => c.id === id)?.nome ?? ''
}