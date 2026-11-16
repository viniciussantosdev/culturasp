import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { buscar } from '../api/cliente'
import { useAuth } from '../context/AuthContext'

type Usuario = {
  id: number
  first_name: string
  email: string
  tipo: string
  date_joined: string
}

type Interesse = {
  id: number
  evento: number
  data_registro: string
}

type Evento = {
  id: number
  titulo: string
  data: string
  horario: string
  local: string
  gratuito: boolean
}

export default function AdminUsuario() {
  const { id } = useParams()
  const { token } = useAuth()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setErro('')

        const [dadosUsuario, interesses, todosEventos] = await Promise.all([
          buscar<Usuario>(`/api/usuarios/${id}/`, token ?? undefined),
          buscar<Interesse[]>(
            `/api/usuarios/${id}/interesses/`,
            token ?? undefined
          ),
          buscar<Evento[]>('/api/eventos/'),
        ])

        const idsEventos = new Set(
          interesses.map((interesse) => interesse.evento)
        )

        setUsuario(dadosUsuario)
        setEventos(todosEventos.filter((evento) => idsEventos.has(evento.id)))
      } catch (erro) {
        setErro(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível carregar o perfil do usuário.'
        )
      } finally {
        setCarregando(false)
      }
    }

    if (id) carregarPerfil()
  }, [id, token])

  function formatarData(data: string) {
    if (!data) return ''

    return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')
  }

  function formatarCadastro(data: string) {
    if (!data) return ''

    return new Date(data).toLocaleDateString('pt-BR')
  }

  if (carregando) {
    return <p className="text-texto-suave">Carregando perfil...</p>
  }

  if (erro || !usuario) {
    return (
      <div>
        <p role="alert" className="mb-4 text-sm text-red-500">
          {erro || 'Usuário não encontrado.'}
        </p>

        <Link
          to="/admin"
          className="font-semibold text-destaque underline hover:text-yellow-300"
        >
          Voltar ao painel
        </Link>
      </div>
    )
  }

  return (
    <section className="text-texto">
      <Link
        to="/admin"
        className="mb-6 inline-block text-sm font-semibold text-texto-suave transition hover:text-destaque"
      >
        ← Voltar ao painel
      </Link>

      <div className="mb-8 border-b border-neutral-700 pb-6">
        <h1 className="text-3xl font-semibold text-destaque">
          {usuario.first_name || 'Usuário sem nome'}
        </h1>

        <div className="mt-3 space-y-1 text-sm text-texto-suave">
          <p>Email: {usuario.email}</p>
          <p>Tipo de conta: {usuario.tipo}</p>
          <p>Data de cadastro: {formatarCadastro(usuario.date_joined)}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold text-destaque">
          Eventos de interesse
        </h2>

        <p className="mb-5 text-sm text-texto-suave">
          Eventos em que este usuário demonstrou interesse.
        </p>

        {eventos.length === 0 ? (
          <div className="rounded-lg border border-neutral-700 bg-superficie p-5">
            <p className="text-sm text-texto-suave">
              Este usuário ainda não demonstrou interesse em nenhum evento.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="rounded-lg border border-black/20 bg-destaque p-5 text-black shadow-sm"
              >
                <h3 className="text-lg font-semibold">{evento.titulo}</h3>

                <div className="mt-3 space-y-1 text-sm text-neutral-700">
                  <p>Data: {formatarData(evento.data)}</p>
                  <p>Horário: {evento.horario}</p>
                  <p>Local: {evento.local}</p>
                  <p>
                    {evento.gratuito ? 'Entrada gratuita' : 'Entrada paga'}
                  </p>
                </div>

                <Link
                  to={`/evento/${evento.id}`}
                  className="mt-4 inline-block rounded bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  Ver evento →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}