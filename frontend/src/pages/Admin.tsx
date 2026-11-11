import { useEffect, useState } from 'react'
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
  const [erro, setErro] = useState('')
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

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold">
        Cadastrar evento
      </h1>

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
          <p className="text-sm text-green-700">
            {mensagem}
          </p>
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
  )
}