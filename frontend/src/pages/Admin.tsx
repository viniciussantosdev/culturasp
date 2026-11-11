
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
  const [formulario, setFormulario] = useState(formularioInicial)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioCadastrado[]>([])

  const [aba, setAba] = useState<'eventos' | 'usuarios'>('eventos')
  const [erro, setErro] = useState('')
  const [erroUsuarios, setErroUsuarios] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { token } = useAuth()

  const campo = 'h-11 w-full rounded border-2 border-borda px-3'
  const rotulo = 'mb-1 block text-sm font-semibold'

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
    setCarregando(true)

    try {
      await enviar('/api/eventos/', formulario, token ?? undefined)

      setFormulario(formularioInicial)
      setMensagem('Evento cadastrado com sucesso!')
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível cadastrar o evento.'
      )
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-semibold">Painel administrativo</h1>
        <p className="mt-2 text-tinta-suave">
          Gerencie os eventos e acompanhe os usuários do CulturaSP.
        </p>
      </div>

      <div className="mb-7 flex gap-5 border-b border-borda">
        <button
          type="button"
          onClick={() => setAba('eventos')}
          className={`pb-3 text-sm ${
            aba === 'eventos'
              ? 'border-b-2 border-tinta font-semibold text-tinta'
              : 'text-tinta-suave'
          }`}
        >
          Cadastrar evento
        </button>

        <button
          type="button"
          onClick={() => setAba('usuarios')}
          className={`pb-3 text-sm ${
            aba === 'usuarios'
              ? 'border-b-2 border-tinta font-semibold text-tinta'
              : 'text-tinta-suave'
          }`}
        >
          Usuários cadastrados
        </button>
      </div>

      {aba === 'eventos' && (
        <div className="max-w-2xl">
          <h2 className="mb-6 text-xl font-semibold">Cadastrar evento</h2>

          <form onSubmit={salvarEvento} className="flex flex-col gap-4">
            <div>
              <label htmlFor="titulo" className={rotulo}>
                Título
              </label>
              <input
                id="titulo"
                type="text"
                value={formulario.titulo}
                onChange={(e) => atualizarCampo('titulo', e.target.value)}
                className={campo}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="data" className={rotulo}>
                  Data
                </label>
                <input
                  id="data"
                  type="date"
                  value={formulario.data}
                  onChange={(e) => atualizarCampo('data', e.target.value)}
                  className={campo}
                  required
                />
              </div>

              <div>
                <label htmlFor="horario" className={rotulo}>
                  Horário
                </label>
                <input
                  id="horario"
                  type="time"
                  value={formulario.horario}
                  onChange={(e) => atualizarCampo('horario', e.target.value)}
                  className={campo}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="local" className={rotulo}>
                Local
              </label>
              <input
                id="local"
                type="text"
                value={formulario.local}
                onChange={(e) => atualizarCampo('local', e.target.value)}
                className={campo}
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className={rotulo}>
                Descrição
              </label>
              <textarea
                id="descricao"
                rows={4}
                value={formulario.descricao}
                onChange={(e) => atualizarCampo('descricao', e.target.value)}
                className="w-full rounded border-2 border-borda p-3"
                required
              />
            </div>

            <label className="flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={formulario.gratuito}
                onChange={(e) => atualizarCampo('gratuito', e.target.checked)}
                className="h-5 w-5"
              />
              Entrada gratuita
            </label>

            <fieldset>
              <legend className={rotulo}>
                Categorias (escolha uma ou mais)
              </legend>

              <div className="flex flex-wrap gap-4">
                {categorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={formulario.categorias.includes(categoria.id)}
                      onChange={() => alternarCategoria(categoria.id)}
                      className="h-4 w-4"
                    />
                    {categoria.nome}
                  </label>
                ))}
              </div>
            </fieldset>

            {erro && (
              <p role="alert" className="text-sm text-red-600">
                {erro}
              </p>
            )}

            {mensagem && (
              <p className="text-sm text-green-700">{mensagem}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="self-start rounded bg-tinta px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {carregando ? 'Salvando...' : 'Salvar evento'}
            </button>
          </form>
        </div>
      )}

      {aba === 'usuarios' && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Usuários cadastrados</h2>
          <p className="mb-5 text-sm text-tinta-suave">
            Selecione um usuário para consultar seu perfil e seus eventos.
          </p>

          {erroUsuarios && (
            <p role="alert" className="text-sm text-red-600">
              {erroUsuarios}
            </p>
          )}

          {!erroUsuarios && usuarios.length === 0 && (
            <p className="text-sm text-tinta-suave">
              Nenhum usuário encontrado.
            </p>
          )}

          <div className="flex flex-col divide-y divide-borda">
            {usuarios.map((usuario) => (
              <Link
                key={usuario.id}
                to={`/admin/usuarios/${usuario.id}`}
                className="flex flex-col gap-1 py-4 hover:bg-fundo sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {usuario.first_name || 'Usuário sem nome'}
                  </p>
                  <p className="text-sm text-tinta-suave">{usuario.email}</p>
                </div>

                <div className="flex items-center gap-3 text-sm text-tinta-suave">
                  <span>
                    Cadastro: {formatarData(usuario.date_joined)}
                  </span>
                  <span className="font-semibold text-tinta">Ver perfil →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
