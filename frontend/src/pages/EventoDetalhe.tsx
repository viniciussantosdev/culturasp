import { Link, useNavigate, useParams } from 'react-router'
import { useEventos, useCategorias } from '../hooks/useApi'
import { estiloCategoria } from '../lib/cores'
import { dataLonga, horarioCurto } from '../lib/formatadores'
import { enviar } from '../api/cliente'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function EventoDetalhe() {
  const { id } = useParams()
  const navegar = useNavigate()

  const { dados: eventos, carregando, erro } = useEventos()
  const { dados: categorias } = useCategorias()

  const { autenticado, isAdmin, token } = useAuth()

  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erroInteresse, setErroInteresse] = useState('')

  const evento = eventos?.find((e) => e.id === Number(id))

  async function conseguirIngresso() {
    if (!autenticado) {
      navegar('/login')
      return
    }

    if (isAdmin) {
      setErroInteresse('Administradores não podem registrar interesse como visitantes.')
      return
    }

    setEnviando(true)
    setMensagem('')
    setErroInteresse('')

    try {
      await enviar(
        '/api/interesses/',
        { evento: evento!.id },
        token ?? undefined
      )

      setMensagem('Seu interesse foi registrado com sucesso!')
    } catch (erro) {
      setErroInteresse(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível registrar seu interesse.'
      )
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <p>Carregando evento...</p>
  }

  if (erro) {
    return <p role="alert">{erro}</p>
  }

  if (!evento) {
    return (
      <div>
        <p className="mb-3">Evento não encontrado.</p>
        <Link to="/" className="font-semibold underline">
          Voltar para eventos
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-2xl">
      <Link
        to="/"
        className="mb-4 inline-block text-sm text-tinta-suave hover:text-tinta"
      >
        Voltar para eventos
      </Link>

      <ul className="mb-2 flex flex-wrap gap-2">
        {evento.categorias.map((cid) => {
          const estilo = estiloCategoria(cid)
          const categoria = categorias?.find((c) => c.id === cid)

          return (
            <li
              key={cid}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${estilo.fundo} ${estilo.texto}`}
            >
              {categoria?.nome ?? 'Categoria'}
            </li>
          )
        })}
      </ul>

      <h1 className="mb-4 text-4xl font-semibold leading-tight">
        {evento.titulo}
      </h1>

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

      <button
        type="button"
        onClick={conseguirIngresso}
        disabled={enviando || Boolean(mensagem)}
        className="rounded bg-tinta px-5 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {enviando
          ? 'Registrando...'
          : mensagem
            ? 'Interesse registrado'
            : 'Conseguir ingresso'}
      </button>

      {mensagem && (
        <p className="mt-3 text-sm text-green-700">
          {mensagem}
        </p>
      )}

      {erroInteresse && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {erroInteresse}
        </p>
      )}
    </article>
  )
}