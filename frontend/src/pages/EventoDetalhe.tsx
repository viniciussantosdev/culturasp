import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { eventos } from '../data/eventos'
import { nomeDaCategoria } from '../data/categorias'
import { estiloCategoria } from '../lib/cores'
import { dataLonga, horarioCurto } from '../lib/formatadores'
import ModalLogin from '../components/ModalLogin'

export default function EventoDetalhe() {
  const { id } = useParams()
  const [modalAberto, setModalAberto] = useState(false)
  const evento = eventos.find((e) => e.id === Number(id))

  if (!evento) {
    return (
      <div>
        <p className="mb-3">Evento não encontrado.</p>
        <Link to="/" className="font-semibold underline">Voltar para eventos</Link>
      </div>
    )
  }

  return (
    <article className="max-w-2xl">
      <Link to="/" className="mb-4 inline-block text-sm text-tinta-suave hover:text-tinta">
        Voltar para eventos
      </Link>
      <ul className="mb-2 flex flex-wrap gap-2">
        {evento.categorias.map((cid) => {
          const estilo = estiloCategoria(cid)
          return (
            <li key={cid} className={`rounded-full px-3 py-1 text-xs font-semibold ${estilo.fundo} ${estilo.texto}`}>
              {nomeDaCategoria(cid)}
            </li>
          )
        })}
      </ul>
      <h1 className="mb-4 text-4xl font-semibold leading-tight">{evento.titulo}</h1>
      <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="text-tinta-suave">Data</dt>
        <dd>{dataLonga(evento.data)}</dd>
        <dt className="text-tinta-suave">Horário</dt>
        <dd>{horarioCurto(evento.horario)}</dd>
        <dt className="text-tinta-suave">Local</dt>
        <dd>{evento.local}</dd>
        <dt className="text-tinta-suave">Entrada</dt>
        <dd>{evento.gratuito ? 'Gratuita' : 'Paga'}</dd>
      </dl>
      <p className="mb-6 leading-relaxed">{evento.descricao}</p>

      {/* Fase 6: aqui vamos checar se o usuário já está logado antes de abrir a janela */}
      <button
        type="button"
        onClick={() => setModalAberto(true)}
        className="rounded bg-tinta px-5 py-2.5 font-semibold text-white"
      >
        Conseguir ingresso
      </button>
      <ModalLogin aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </article>
  )
}