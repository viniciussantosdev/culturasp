type Estilo = {fundo: string; texto: string }

const estilos: Record<number, Estilo> = {
    1: {fundo: 'bg-marca-azul', texto: 'text-white'},
    2: { fundo: 'bg-marca-vermelho', texto: 'text-white' },
  3: { fundo: 'bg-tinta', texto: 'text-white' },
  4: { fundo: 'bg-tinta', texto: 'text-white' },
  5: { fundo: 'bg-marca-amarelo', texto: 'text-tinta' },
  6: { fundo: 'bg-marca-amarelo', texto: 'text-tinta' },
  7: { fundo: 'bg-tinta', texto: 'text-white' },
}

export function estiloCategoria(id: number): Estilo {
  return estilos[id] ?? estilos[3]
}