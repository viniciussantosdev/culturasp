import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { buscar } from '../api/cliente'
import { useAuth } from '../context/AuthContext'

type Evento = {
  id: number
  titulo: string
  data: string
  horario: string
  local: string
  gratuito: boolean
}

type Interesse = {
  id: number
  evento: number
  data_registro: string
}

function formatarData(data: string) {
  if (!data) return ''

  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')
}

export default function MeusEventos() {
  const { token } = useAuth()

  const [eventos, setEventos] = useState<Evento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarEventos() {
      try {
        setErro('')

        const [interesses, todosEventos] = await Promise.all([
          buscar<Interesse[]>('/api/interesses/meus/', token ?? undefined),
          buscar<Evento[]>('/api/eventos/'),
        ])

        const ids = new Set(interesses.map((interesse) => interesse.evento))

        setEventos(todosEventos.filter((evento) => ids.has(evento.id)))
      } catch (erro) {
        setErro(
          erro instanceof Error
            ? erro.message
            : 'Não foi possível carregar seus eventos.'
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarEventos()
  }, [token])

  const botaoAmarelo =
    'mt-4 inline-block rounded bg-destaque px-4 py-2 font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_18px_rgba(254,227,4,0.35)] active:scale-95'

  return (
    <section>
      <div className="mb-7">
        <h1 className="text-3xl font-semibold text-texto">Meus Eventos</h1>
        <p className="mt-2 text-texto-suave">
          Aqui estão os eventos em que você demonstrou interesse.
        </p>
      </div>

      {carregando && (
        <p className="text-texto-suave">Carregando seus eventos...</p>
      )}

      {erro && (
        <p role="alert" className="text-sm text-red-500">
          {erro}
        </p>
      )}

      {!carregando && !erro && eventos.length === 0 && (
        <div className="rounded border border-borda bg-superficie p-6">
          <h2 className="font-semibold text-texto">
            Você ainda não tem eventos.
          </h2>
          <p className="mt-2 text-sm text-texto-suave">
            Quando demonstrar interesse em um evento, ele aparecerá nesta página.
          </p>
          <Link to="/" className={botaoAmarelo}>
            Explorar eventos
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {eventos.map((evento) => (
          <article
            key={evento.id}
            className="rounded border border-borda bg-superficie p-5 transition-colors hover:border-destaque"
          >
            <h2 className="text-lg font-semibold text-texto">
              {evento.titulo}
            </h2>

            <div className="mt-3 space-y-1 text-sm text-texto-suave">
              <p>Data: {formatarData(evento.data)}</p>
              <p>Horário: {evento.horario}</p>
              <p>Local: {evento.local}</p>
              <p>{evento.gratuito ? 'Entrada gratuita' : 'Entrada paga'}</p>
            </div>

            <Link
              to={`/evento/${evento.id}`}
              className={botaoAmarelo}
            >
              Ver evento
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}