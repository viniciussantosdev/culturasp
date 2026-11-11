import { normalizar } from './formatadores'

const porNome: Record<string, Estilo> = {
  musica: { fundo: 'bg-marca-azul', texto: 'text-white' },
  teatro: { fundo: 'bg-marca-vermelho', texto: 'text-white' },
  festival: { fundo: 'bg-marca-amarelo', texto: 'text-tinta' },
  danca: { fundo: 'bg-red-600', texto: 'text-white' },
  cinema: { fundo: 'bg-purple-600', texto: 'text-white' },
  exposicao: { fundo: 'bg-green-600', texto: 'text-white' },
  biblioteca: { fundo: 'bg-amber-900', texto: 'text-white' },
}

const padrao: Estilo = { fundo: 'bg-tinta', texto: 'text-white' }

export function estiloPorNome(nome: string): Estilo {
  return porNome[normalizar(nome)] ?? padrao
}

type Estilo = { fundo: string; texto: string }

const estilos: Record<number, Estilo> = {
  1: { fundo: 'bg-marca-azul', texto: 'text-white' },
  7: { fundo: 'bg-marca-vermelho', texto: 'text-white' },
  8: { fundo: 'bg-marca-amarelo', texto: 'text-tinta' },
  9: { fundo: 'bg-red-600', texto: 'text-white' },
  10: { fundo: 'bg-purple-600', texto: 'text-white' },
  11: { fundo: 'bg-green-600', texto: 'text-white' },
  12: { fundo: 'bg-amber-900', texto: 'text-white' },
}

export function estiloCategoria(id: number): Estilo {
  return estilos[id] ?? padrao
}
