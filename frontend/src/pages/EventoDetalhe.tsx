import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCategorias, useEvento } from '../hooks/useApi'
import { categoriasDoEvento } from '../lib/categorias'
import { estiloPorNome } from '../lib/cores'
import { dataLonga, horarioCurto } from '../lib/formatadores'
import ModalLogin from '../components/ModalLogin'

export default function EventoDetalhe() {
  const { id } = useParams()
  const [modalAberto, setModalAberto] = useState(false)
  const { dados: evento, carregando, erro } = useEvento(id)
  const { dados: categoriasApi } = useCategorias()

  if (carregando) return <p className="text-tinta-suave">Carregando evento...</p>

  if (erro || !evento) {
    const naoEncontrado = !erro || erro.includes('404')
    return (
      <div>
        <p className="mb-3">{naoEncontrado ? 'Evento não encontrado.' : erro}</p>
        <Link to="/" className="font-semibold underline">Voltar para eventos</Link>
      </div>
    )
  }

  const categorias = categoriasDoEvento(evento.categorias, categoriasApi ?? [])

  return (
    <article className="max-w-2xl">
      <Link to="/" className="mb-4 inline-block text-sm text-tinta-suave hover:text-tinta">
        Voltar para eventos
      </Link>
      <ul className="mb-2 flex flex-wrap gap-2">
        {categorias.map((c) => {
          const estilo = estiloPorNome(c.nome)
          return (
            <li key={c.id} className={`rounded-full px-3 py-1 text-xs font-semibold ${estilo.fundo} ${estilo.texto}`}>
              {c.nome}
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