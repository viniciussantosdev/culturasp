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

  // Carregar categorias
  useEffect(() => {
    buscar<Categoria[]>('/api/categorias/')
      .then(setCategorias)
      .catch((erro: Error) => setErro(erro.message))

    carregarEventos()
  }, [])

  // Carregar usuários quando abrir a aba
  useEffect(() => {
    if (aba !== 'usuarios') return

    setErroUsuarios('')

    buscar<UsuarioCadastrado[]>('/api/usuarios/', token ?? undefined)
      .then(setUsuarios)
      .catch((erro: Error) => setErroUsuarios(erro.message))
  }, [aba, token])

  // Buscar eventos na API
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

  // Atualizar campos do formulário
  function atualizarCampo(
    campo: keyof NovoEvento,
    valor: string | boolean
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }))
  }

  // Selecionar ou desmarcar categorias
  function alternarCategoria(id: number) {
    setFormulario((atual) => ({
      ...atual,
      categorias: atual.categorias.includes(id)
        ? atual.categorias.filter((categoria) => categoria !== id)
        : [...atual.categorias, id],
    }))
  }

  // Cadastrar ou atualizar evento
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

  // Preencher formulário para edição
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

  // Cancelar edição
  function cancelarEdicao() {
    setFormulario(formularioInicial)
    setEditandoId(null)
    setErro('')
    setMensagem('')
  }

  // Excluir evento
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Painel administrativo
        </h1>

        <p className="mt-2 text-gray-600">
          Gerencie os eventos e os usuários cadastrados na plataforma.
        </p>
      </div>

      {/* Abas */}
      <div className="mb-8 flex gap-3 border-b">
        <button
          type="button"
          onClick={() => setAba('eventos')}
          className={`border-b-2 px-4 py-3 font-semibold ${
            aba === 'eventos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          Gerenciar eventos
        </button>

        <button
          type="button"
          onClick={() => setAba('usuarios')}
          className={`border-b-2 px-4 py-3 font-semibold ${
            aba === 'usuarios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500'
          }`}
        >
          Usuários cadastrados
        </button>
      </div>

      {/* Aba de eventos */}
      {aba === 'eventos' && (
        <section>
          <div className="max-w-3xl">
            <h2 className="mb-6 text-xl font-bold">
              {editandoId !== null ? 'Editar evento' : 'Novo evento'}
            </h2>

            {erro && (
              <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
                {erro}
              </div>
            )}

            {mensagem && (
              <div className="mb-5 rounded-lg bg-green-100 p-4 text-green-700">
                {mensagem}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={salvarEvento} className="space-y-5">
              <div>
                <label className="mb-2 block font-medium">
                  Título
                </label>

                <input
                  required
                  value={formulario.titulo}
                  onChange={(e) => atualizarCampo('titulo', e.target.value)}
                  className="w-full rounded-lg border p-3"
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
                    className="w-full rounded-lg border p-3"
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
                    className="w-full rounded-lg border p-3"
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
                  className="w-full rounded-lg border p-3"
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
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formulario.gratuito}
                  onChange={(e) => atualizarCampo('gratuito', e.target.checked)}
                  className="h-4 w-4"
                />

                Evento gratuito
              </label>

              {/* Categorias */}
              <fieldset className="rounded-lg border p-4">
                <legend className="px-2 font-semibold">
                  Categorias (escolha uma ou mais)
                </legend>

                {categorias.length === 0 ? (
                  <p className="text-sm text-gray-500">
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
                          className="h-4 w-4"
                        />

                        {categoria.nome}
                      </label>
                    ))}
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  Categorias selecionadas: {formulario.categorias.length}
                </p>
              </fieldset>

              {/* Botões do formulário */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={carregando}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
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
                    className="rounded-lg border px-6 py-3 font-semibold hover:bg-gray-50"
                  >
                    Cancelar edição
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de eventos */}
          <div className="mt-14">
            <h2 className="mb-6 text-xl font-bold">
              Eventos cadastrados
            </h2>

            {carregandoEventos ? (
              <p className="text-gray-500">
                Carregando eventos...
              </p>
            ) : eventos.length === 0 ? (
              <p className="text-gray-500">
                Nenhum evento cadastrado.
              </p>
            ) : (
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="flex flex-col justify-between gap-4 rounded-lg border p-5 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold">
                        {evento.titulo}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {evento.data} · {evento.horario} · {evento.local}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
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

                      <span className="mt-2 inline-block text-xs text-gray-500">
                        {evento.gratuito ? 'Gratuito' : 'Pago'}
                      </span>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => editarEvento(evento)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => excluirEvento(evento.id)}
                        disabled={excluindoId === evento.id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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

      {/* Aba de usuários */}
      {aba === 'usuarios' && (
        <section>
          <h2 className="mb-6 text-xl font-bold">
            Usuários cadastrados
          </h2>

          {erroUsuarios && (
            <p className="mb-4 text-red-600">
              {erroUsuarios}
            </p>
          )}

          {usuarios.length === 0 && !erroUsuarios ? (
            <p className="text-gray-500">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {usuarios.map((usuario) => (
                <Link
                  key={usuario.id}
                  to={`/admin/usuarios/${usuario.id}`}
                  className="block rounded-lg border p-4 transition hover:bg-gray-50"
                >
                  <p className="font-semibold">
                    {usuario.first_name || 'Sem nome'}
                  </p>

                  <p className="text-sm text-gray-600">
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
