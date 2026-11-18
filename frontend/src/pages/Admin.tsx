import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { buscar, enviar, atualizar, excluir } from '../api/cliente'
import { useAuth } from '../context/AuthContext'
import type { Categoria } from '../types'

type NovoEvento = {
  titulo: string
  data: string
  horario: string
  local: string
  descricao: string
  gratuito: boolean
  categorias: number[]
}

type Evento = {
  id: number
  titulo: string
  data: string
  horario: string
  local: string
  descricao: string
  gratuito: boolean
  categorias: number[]
  total_inscritos: number
}

type UsuarioCadastrado = {
  id: number
  first_name: string
  email: string
  tipo: string
  date_joined: string
}

const formularioInicial: NovoEvento = {
  titulo: '',
  data: '',
  horario: '',
  local: '',
  descricao: '',
  gratuito: false,
  categorias: [],
}

export default function Admin() {
  const [formulario, setFormulario] = useState<NovoEvento>(formularioInicial)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioCadastrado[]>([])
  const [aba, setAba] = useState<'eventos' | 'usuarios'>('eventos')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [excluindoId, setExcluindoId] = useState<number | null>(null)
  const [erro, setErro] = useState('')
  const [erroUsuarios, setErroUsuarios] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [carregandoEventos, setCarregandoEventos] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    buscar<Categoria[]>('/api/categorias/')
      .then(setCategorias)
      .catch((erro: Error) => setErro(erro.message))

    carregarEventos()
  }, [])

  useEffect(() => {
    if (aba !== 'usuarios') return

    setErroUsuarios('')

    buscar<UsuarioCadastrado[]>('/api/usuarios/', token ?? undefined)
      .then(setUsuarios)
      .catch((erro: Error) => setErroUsuarios(erro.message))
  }, [aba, token])

  async function carregarEventos() {
    setCarregandoEventos(true)

    try {
      const dados = await buscar<Evento[]>('/api/eventos/')
      setEventos(dados)
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar os eventos.'
      )
    } finally {
      setCarregandoEventos(false)
    }
  }

  function atualizarCampo(
    campo: keyof NovoEvento,
    valor: string | boolean
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }))
  }

  function alternarCategoria(id: number) {
    setFormulario((atual) => ({
      ...atual,
      categorias: atual.categorias.includes(id)
        ? atual.categorias.filter((categoria) => categoria !== id)
        : [...atual.categorias, id],
    }))
  }

  async function salvarEvento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    if (formulario.categorias.length === 0) {
      setErro('Selecione pelo menos uma categoria.')
      return
    }

    const dados = {
      ...formulario,
      categorias: formulario.categorias.map(Number),
    }

    setCarregando(true)

    try {
      if (editandoId !== null) {
        await atualizar(
          `/api/eventos/${editandoId}/`,
          dados,
          token ?? undefined
        )
        setMensagem('Evento atualizado com sucesso!')
      } else {
        await enviar(
          '/api/eventos/',
          dados,
          token ?? undefined
        )
        setMensagem('Evento cadastrado com sucesso!')
      }

      setFormulario(formularioInicial)
      setEditandoId(null)
      await carregarEventos()
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar o evento.'
      )
    } finally {
      setCarregando(false)
    }
  }

  function editarEvento(evento: Evento) {
    setFormulario({
      titulo: evento.titulo,
      data: evento.data,
      horario: evento.horario,
      local: evento.local,
      descricao: evento.descricao,
      gratuito: evento.gratuito,
      categorias: evento.categorias.map(Number),
    })

    setEditandoId(evento.id)
    setErro('')
    setMensagem('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function cancelarEdicao() {
    setFormulario(formularioInicial)
    setEditandoId(null)
    setErro('')
    setMensagem('')
  }

  async function excluirEvento(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este evento? Essa ação não poderá ser desfeita.'
    )

    if (!confirmar) return

    setErro('')
    setMensagem('')
    setExcluindoId(id)

    try {
      await excluir(
        `/api/eventos/${id}/`,
        token ?? undefined
      )

      if (editandoId === id) {
        setFormulario(formularioInicial)
        setEditandoId(null)
      }

      await carregarEventos()
      setMensagem('Evento excluído com sucesso!')
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível excluir o evento.'
      )
    } finally {
      setExcluindoId(null)
    }
  }

  const eventosOrdenados = [...eventos].sort(
    (a, b) => b.total_inscritos - a.total_inscritos
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-texto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-destaque">
          Painel administrativo
        </h1>

        <p className="mt-2 text-texto-suave">
          Gerencie os eventos e os usuários cadastrados na plataforma.
        </p>
      </div>

      <div className="mb-8 flex gap-3 border-b border-neutral-700">
        <button
          type="button"
          onClick={() => setAba('eventos')}
          className={`border-b-2 px-4 py-3 font-semibold transition ${
            aba === 'eventos'
              ? 'border-destaque text-destaque'
              : 'border-transparent text-texto-suave hover:text-destaque'
          }`}
        >
          Gerenciar eventos
        </button>

        <button
          type="button"
          onClick={() => setAba('usuarios')}
          className={`border-b-2 px-4 py-3 font-semibold transition ${
            aba === 'usuarios'
              ? 'border-destaque text-destaque'
              : 'border-transparent text-texto-suave hover:text-destaque'
          }`}
        >
          Usuários cadastrados
        </button>
      </div>

      {aba === 'eventos' && (
        <section>
          <div className="max-w-3xl">
            <h2 className="mb-6 text-xl font-bold text-destaque">
              {editandoId !== null ? 'Editar evento' : 'Novo evento'}
            </h2>

            {erro && (
              <div className="mb-5 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
                {erro}
              </div>
            )}

            {mensagem && (
              <div className="mb-5 rounded-lg border border-green-800 bg-green-950 p-4 text-green-300">
                {mensagem}
              </div>
            )}

            <form
              onSubmit={salvarEvento}
              className="space-y-5 rounded-lg border border-neutral-700 bg-superficie p-6"
            >
              <div>
                <label className="mb-2 block font-medium">
                  Título
                </label>

                <input
                  required
                  value={formulario.titulo}
                  onChange={(e) => atualizarCampo('titulo', e.target.value)}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-white placeholder:text-neutral-500 focus:border-destaque focus:outline-none"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium">
                    Data
                  </label>

                  <input
                    required
                    type="date"
                    value={formulario.data}
                    onChange={(e) => atualizarCampo('data', e.target.value)}
                    className="w-full rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-white focus:border-destaque focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">
                    Horário
                  </label>

                  <input
                    required
                    type="time"
                    value={formulario.horario}
                    onChange={(e) => atualizarCampo('horario', e.target.value)}
                    className="w-full rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-white focus:border-destaque focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Local
                </label>

                <input
                  required
                  value={formulario.local}
                  onChange={(e) => atualizarCampo('local', e.target.value)}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-white placeholder:text-neutral-500 focus:border-destaque focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Descrição
                </label>

                <textarea
                  required
                  rows={4}
                  value={formulario.descricao}
                  onChange={(e) => atualizarCampo('descricao', e.target.value)}
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-900 p-3 text-white placeholder:text-neutral-500 focus:border-destaque focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formulario.gratuito}
                  onChange={(e) => atualizarCampo('gratuito', e.target.checked)}
                  className="h-4 w-4 accent-yellow-400"
                />
                Evento gratuito
              </label>

              <fieldset className="rounded-lg border border-neutral-700 bg-superficie-secundaria p-4">
                <legend className="px-2 font-semibold text-destaque">
                  Categorias (escolha uma ou mais)
                </legend>

                {categorias.length === 0 ? (
                  <p className="text-sm text-texto-suave">
                    Nenhuma categoria encontrada.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {categorias.map((categoria) => (
                      <label
                        key={categoria.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={formulario.categorias.includes(
                            Number(categoria.id)
                          )}
                          onChange={() =>
                            alternarCategoria(Number(categoria.id))
                          }
                          className="h-4 w-4 accent-yellow-400"
                        />
                        {categoria.nome}
                      </label>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-sm text-texto-suave">
                  Categorias selecionadas: {formulario.categorias.length}
                </p>
              </fieldset>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={carregando}
                  className="rounded-lg bg-destaque px-6 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50"
                >
                  {carregando
                    ? 'Salvando...'
                    : editandoId !== null
                      ? 'Salvar alterações'
                      : 'Cadastrar evento'}
                </button>

                {editandoId !== null && (
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    disabled={carregando}
                    className="rounded-lg border border-neutral-500 px-6 py-3 font-semibold text-texto transition hover:bg-neutral-700"
                  >
                    Cancelar edição
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-14">
            <h2 className="mb-2 text-xl font-bold text-destaque">
              Eventos cadastrados
            </h2>

            <p className="mb-6 text-sm text-texto-suave">
              Eventos organizados pela quantidade de pessoas inscritas.
            </p>

            {carregandoEventos ? (
              <p className="text-texto-suave">
                Carregando eventos...
              </p>
            ) : eventosOrdenados.length === 0 ? (
              <p className="text-texto-suave">
                Nenhum evento cadastrado.
              </p>
            ) : (
              <div className="space-y-4">
                {eventosOrdenados.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-neutral-700 bg-superficie p-5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">
                        {evento.titulo}
                      </h3>

                      <p className="mt-1 text-sm text-texto-suave">
                        {evento.data} · {evento.horario} · {evento.local}
                      </p>

                      <p className="mt-1 text-sm text-neutral-400">
                        {evento.categorias
                          .map((id) =>
                            categorias.find(
                              (categoria) =>
                                Number(categoria.id) === Number(id)
                            )?.nome
                          )
                          .filter(Boolean)
                          .join(', ')}
                      </p>

                      <span className="mt-2 inline-block text-xs text-texto-suave">
                        {evento.gratuito ? 'Gratuito' : 'Pago'}
                      </span>

                      <div className="mt-3">
                        <span className="inline-flex items-center rounded-full border border-destaque/40 bg-destaque/10 px-3 py-1 text-sm font-semibold text-destaque">
                          {evento.total_inscritos} {evento.total_inscritos === 1 ? 'pessoa inscrita' : 'pessoas inscritas'}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => editarEvento(evento)}
                        className="rounded-lg bg-destaque px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => excluirEvento(evento.id)}
                        disabled={excluindoId === evento.id}
                        className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-50"
                      >
                        {excluindoId === evento.id
                          ? 'Excluindo...'
                          : 'Excluir'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {aba === 'usuarios' && (
        <section>
          <h2 className="mb-6 text-xl font-bold text-destaque">
            Usuários cadastrados
          </h2>

          {erroUsuarios && (
            <p className="mb-4 text-red-400">
              {erroUsuarios}
            </p>
          )}

          {usuarios.length === 0 && !erroUsuarios ? (
            <p className="text-texto-suave">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {usuarios.map((usuario) => (
                <Link
                  key={usuario.id}
                  to={`/admin/usuarios/${usuario.id}`}
                  className="block rounded-lg border border-neutral-700 bg-superficie p-4 transition hover:border-destaque hover:bg-superficie-secundaria"
                >
                  <p className="font-semibold text-white">
                    {usuario.first_name || 'Sem nome'}
                  </p>

                  <p className="text-sm text-texto-suave">
                    {usuario.email}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}