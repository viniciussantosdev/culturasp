import { Link, useNavigate, useParams } from 'react-router'
import { useEventos, useCategorias } from '../hooks/useApi'
import { estiloCategoria } from '../lib/cores'
import { dataLonga, horarioCurto } from '../lib/formatadores'
import { buscar, enviar } from '../api/cliente'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

type Interesse = {
  id: number
  evento: number
}

type Inscrito = {
  id: number
  nome: string
  email: string
  data_registro: string
}

export default function EventoDetalhe() {
  const { id } = useParams()
  const navegar = useNavigate()

  const { dados: eventos, carregando, erro } = useEventos()
  const { dados: categorias } = useCategorias()

  const { autenticado, isAdmin, token } = useAuth()

  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erroInteresse, setErroInteresse] = useState('')
  const [jaTemInteresse, setJaTemInteresse] = useState(false)
  const [verificandoInteresse, setVerificandoInteresse] = useState(true)
  const [registrouAgora, setRegistrouAgora] = useState(false)

  const [inscritos, setInscritos] = useState<Inscrito[]>([])
  const [carregandoInscritos, setCarregandoInscritos] = useState(false)
  const [erroInscritos, setErroInscritos] = useState('')

  const evento = eventos?.find((e) => e.id === Number(id))

  useEffect(() => {
    let ativo = true

    async function verificarInteresse() {
      setJaTemInteresse(false)
      setRegistrouAgora(false)

      if (!autenticado || !token || isAdmin) {
        setVerificandoInteresse(false)
        return
      }

      setVerificandoInteresse(true)

      try {
        const interesses = await buscar<Interesse[]>(
          '/api/interesses/meus/',
          token
        )

        if (ativo) {
          setJaTemInteresse(
            interesses.some((interesse) => interesse.evento === Number(id))
          )
        }
      } catch {
        if (ativo) {
          setJaTemInteresse(false)
        }
      } finally {
        if (ativo) {
          setVerificandoInteresse(false)
        }
      }
    }

    verificarInteresse()

    return () => {
      ativo = false
    }
  }, [id, autenticado, token, isAdmin])

  useEffect(() => {
    let ativo = true

    async function carregarInscritos() {
      if (!isAdmin || !token || !evento) {
        setInscritos([])
        return
      }

      setCarregandoInscritos(true)
      setErroInscritos('')

      try {
        const dados = await buscar<Inscrito[]>(
          `/api/eventos/${evento.id}/inscritos/`,
          token
        )

        if (ativo) {
          setInscritos(dados)
        }
      } catch (erro) {
        if (ativo) {
          setErroInscritos(
            erro instanceof Error
              ? erro.message
              : 'Não foi possível carregar os participantes.'
          )
        }
      } finally {
        if (ativo) {
          setCarregandoInscritos(false)
        }
      }
    }

    carregarInscritos()

    return () => {
      ativo = false
    }
  }, [evento?.id, isAdmin, token])

  async function conseguirIngresso() {
    if (!autenticado) {
      navegar('/login')
      return
    }

    if (isAdmin) {
      setErroInteresse('Administradores não podem registrar interesse como visitantes.')
      return
    }

    if (!evento) return

    setEnviando(true)
    setMensagem('')
    setErroInteresse('')

    try {
      await enviar(
        '/api/interesses/',
        { evento: evento.id },
        token ?? undefined
      )

      setJaTemInteresse(true)
      setRegistrouAgora(true)
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

  const totalInscritos = (evento.total_inscritos ?? 0) + (registrouAgora ? 1 : 0)

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

      <div className="mb-6 rounded-lg border border-borda bg-superficie p-4">
        <p className="font-semibold">
          {totalInscritos} {totalInscritos === 1 ? 'pessoa inscrita' : 'pessoas inscritas'}
        </p>
      </div>

      {!isAdmin && !verificandoInteresse && !jaTemInteresse && (
        <button
          type="button"
          onClick={conseguirIngresso}
          disabled={enviando}
          className="rounded bg-destaque px-4 py-2 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_18px_rgba(254,227,4,0.35)] active:scale-95"
        >
          {enviando ? 'Registrando...' : 'Conseguir ingresso'}
        </button>
      )}

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

      {isAdmin && (
        <section className="mt-8 border-t border-borda pt-6">
          <h2 className="mb-4 text-xl font-semibold">
            Participantes inscritos
          </h2>

          {carregandoInscritos && (
            <p className="text-tinta-suave">
              Carregando participantes...
            </p>
          )}

          {erroInscritos && (
            <p role="alert" className="text-sm text-red-600">
              {erroInscritos}
            </p>
          )}

          {!carregandoInscritos && !erroInscritos && inscritos.length === 0 && (
            <p className="text-tinta-suave">
              Ainda não há participantes inscritos neste evento.
            </p>
          )}

          {!carregandoInscritos && inscritos.length > 0 && (
            <div className="space-y-3">
              {inscritos.map((inscrito) => (
                <div
                  key={inscrito.id}
                  className="rounded-lg border border-borda bg-superficie p-4"
                >
                  <p className="font-semibold">
                    {inscrito.nome || 'Nome não informado'}
                  </p>

                  <p className="text-sm text-tinta-suave">
                    {inscrito.email}
                  </p>

                  <p className="mt-2 text-xs text-tinta-suave">
                    Inscrição em: {new Date(inscrito.data_registro).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </article>
  )
}