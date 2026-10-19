import { Link } from 'react-router'
import type { Evento } from '../types'
import { nomeDaCategoria } from '../data/categorias'
import { estiloCategoria } from '../lib/cores'
import { diaDoMes, mesAbreviado, horarioCurto } from '../lib/formatadores'

export default function CardEvento({ evento }: { evento: Evento }) {
  const principal = estiloCategoria(evento.categorias[0])

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-borda bg-white">
      <div className={`h-2 ${principal.fundo}`} />
      <div className="grid flex-1 grid-cols-[56px_1fr] gap-3 p-4">
        <div className={`self-start rounded px-1 py-2 text-center leading-none ${principal.fundo} ${principal.texto}`}>
          <strong className="block text-2xl font-semibold">{diaDoMes(evento.data)}</strong>
          <span className="text-xs font-semibold">{mesAbreviado(evento.data)}</span>
        </div>
        <div>
          <ul className="mb-1 flex flex-wrap gap-x-3 text-xs text-tinta-suave">
            {evento.categorias.map((id) => (
              <li key={id} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${estiloCategoria(id).fundo}`} />
                {nomeDaCategoria(id)}
              </li>
            ))}
          </ul>
          <h3 className="mb-2 text-lg font-semibold leading-tight">{evento.titulo}</h3>
          <p className="text-sm text-tinta-suave">
            {horarioCurto(evento.horario)} · {evento.local}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t-2 border-dashed border-borda px-4 py-3">
        <span className="text-sm font-semibold">
          {evento.gratuito ? 'Entrada gratuita' : 'Entrada paga'}
        </span>
        <Link to={`/evento/${evento.id}`} className="rounded bg-tinta px-3 py-1.5 text-sm font-semibold text-white">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}