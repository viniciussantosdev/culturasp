import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login, cadastrar, isAdmin } = useAuth()
  const navegar = useNavigate()

  const campo = 'h-11 w-full rounded border-2 border-borda px-3'
  const rotulo = 'mb-1 block text-sm font-semibold'

  const aba = (ativa: boolean) =>
    `flex-1 rounded border-2 px-3 py-2 font-semibold ${
      ativa
        ? 'border-tinta bg-tinta text-white'
        : 'border-borda'
    }`

  async function enviarFormulario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      if (modo === 'criar') {
        await cadastrar(nome, email, senha)
      } else {
        await login(email, senha)
      }

      // A sessão já foi atualizada pelo AuthProvider.
      // O papel do usuário é consultado após a autenticação.
      navegar('/')
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : 'Não foi possível realizar a operação.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-3xl font-semibold">
        {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
      </h1>

      <div className="mb-6 flex gap-2" role="group" aria-label="Escolher ação">
        <button
          type="button"
          aria-pressed={modo === 'entrar'}
          onClick={() => {
            setModo('entrar')
            setErro('')
          }}
          className={aba(modo === 'entrar')}
        >
          Entrar
        </button>

        <button
          type="button"
          aria-pressed={modo === 'criar'}
          onClick={() => {
            setModo('criar')
            setErro('')
          }}
          className={aba(modo === 'criar')}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={enviarFormulario} className="flex flex-col gap-4">
        {modo === 'criar' && (
          <div>
            <label htmlFor="nome" className={rotulo}>
              Nome
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={campo}
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className={rotulo}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={campo}
            required
          />
        </div>

        <div>
          <label htmlFor="senha" className={rotulo}>
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={campo}
            required
            minLength={modo === 'criar' ? 8 : undefined}
          />
        </div>

        {erro && (
          <p role="alert" className="text-sm text-red-600">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="rounded bg-tinta px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {carregando
            ? 'Aguarde...'
            : modo === 'entrar'
              ? 'Entrar'
              : 'Criar conta'}
        </button>
      </form>

      <p className="mt-5 text-sm text-tinta-suave">
        Ao criar uma conta, você será cadastrado como visitante.
      </p>

      <Link to="/" className="mt-4 inline-block text-sm underline">
        Voltar para eventos
      </Link>
    </div>
  )
}