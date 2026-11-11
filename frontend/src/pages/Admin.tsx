
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { buscar, enviar } from '../api/cliente'
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
  const [usuarios, setUsuarios] = useState<UsuarioCadastrado[]>([])
  const [aba, setAba] = useState<'eventos' | 'usuarios'>('eventos')
  const [erro, setErro] = useState('')
  const [erroUsuarios, setErroUsuarios] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    buscar<Categoria[]>('/api/categorias/')
      .then(setCategorias)
      .catch((erro: Error) => setErro(erro.message))
  }, [])

  useEffect(() => {
    if (aba !== 'usuarios') return

    buscar<UsuarioCadastrado[]>('/api/usuarios/', token ?? undefined)
      .then(setUsuarios)
      .catch((erro: Error) => setErroUsuarios(erro.message))
  }, [aba, token])

  function atualizarCampo(campo: keyof NovoEvento, valor: string | boolean) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }))
  }

  function alternarCategoria(id: number) {
    setFormulario((atual) => ({
      ...atual,
      categorias: atual.categorias.includes(Number(id))
        ? atual.categorias.filter((categoria) => categoria !== Number(id))
        : [...atual.categorias, Number(id)],
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

    console.log('Dados enviados:', dados)

    setCarregando(true)

    try {
      await enviar('/api/eventos/', dados, token ?? undefined)

      setFormulario(formularioInicial)
      setMensagem('Evento cadastrado com sucesso!')
    } catch (erro) {
        console.error('Erro ao cadastrar evento:', erro)
          setErro(
           erro instanceof Error
          ? erro.message
          : 'Não foi possível cadastrar o evento.'
  )
} finally {
  setCarregando(false)
}
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel administrativo</h1>
        <p className="mt-2 text-gray-600">
          Gerencie os eventos e os usuários cadastrados na plataforma.
        </p>
      </div>

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
          Cadastrar evento
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

      {aba === 'eventos' && (
        <section className="max-w-3xl">
          <h2 className="mb-6 text-xl font-bold">Novo evento</h2>

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

          <form onSubmit={salvarEvento} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">Título</label>
              <input
                required
                value={formulario.titulo}
                onChange={(e) => atualizarCampo('titulo', e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">Data</label>
                <input
                  required
                  type="date"
                  value={formulario.data}
                  onChange={(e) => atualizarCampo('data', e.target.value)}
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Horário</label>
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
              <label className="mb-2 block font-medium">Local</label>
              <input
                required
                value={formulario.local}
                onChange={(e) => atualizarCampo('local', e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Descrição</label>
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
                        checked={formulario.categorias.includes(Number(categoria.id))}
                        onChange={() => alternarCategoria(Number(categoria.id))}
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

            <button
              type="submit"
              disabled={carregando}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar evento'}
            </button>
          </form>
        </section>
      )}

      {aba === 'usuarios' && (
        <section>
          <h2 className="mb-6 text-xl font-bold">Usuários cadastrados</h2>

          {erroUsuarios && (
            <p className="mb-4 text-red-600">{erroUsuarios}</p>
          )}

          {usuarios.length === 0 && !erroUsuarios ? (
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
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
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
