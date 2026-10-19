import type { Categoria } from '../types'
import { estiloCategoria } from '../lib/cores'

type Props = {
  categorias: Categoria[]
  selecionada: number | null
  aoSelecionar: (id: number | null) => void
}

export default function FiltroCategorias({ categorias, selecionada, aoSelecionar }: Props) {
  const base = 'cursor-pointer rounded-full border-2 px-3 py-1 text-sm font-semibold'
  const inativo = 'border-borda text-tinta hover:border-tinta'

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
      <button
        type="button"
        aria-pressed={selecionada === null}
        onClick={() => aoSelecionar(null)}
        className={`${base} ${selecionada === null ? 'border-tinta bg-tinta text-white' : inativo}`}
      >
        Todos
      </button>
      {categorias.map((c) => {
        const estilo = estiloCategoria(c.id)
        const ativo = selecionada === c.id
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={ativo}
            onClick={() => aoSelecionar(c.id)}
            className={`${base} ${ativo ? `border-transparent ${estilo.fundo} ${estilo.texto}` : inativo}`}
          >
            {c.nome}
          </button>
        )
      })}
    </div>
  )
}