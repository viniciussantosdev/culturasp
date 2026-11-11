import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { enviar } from '../api/cliente'

type Usuario = {
  id: number
  nome: string
  email: string
  tipo: 'visitante' | 'administrador'
  is_staff?: boolean
  is_superuser?: boolean
}

type Sessao = {
  token: string
  usuario: Usuario
}

type AuthContextType = {
  usuario: Usuario | null
  token: string | null
  autenticado: boolean
  isAdmin: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

const CHAVE_SESSAO = 'culturasp_sessao'

const AuthContext = createContext<AuthContextType | null>(null)

function recuperarSessao(): Sessao | null {
  try {
    const salva = localStorage.getItem(CHAVE_SESSAO)
    return salva ? JSON.parse(salva) : null
  } catch {
    localStorage.removeItem(CHAVE_SESSAO)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(recuperarSessao)

  async function login(email: string, senha: string) {
    const resposta = await enviar<Sessao>(
      '/api/auth/login/',
      { email, senha }
    )

    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(resposta))
    setSessao(resposta)
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    await enviar(
      '/api/auth/cadastro/',
      { nome, email, senha }
    )

    await login(email, senha)
  }

  function logout() {
    localStorage.removeItem(CHAVE_SESSAO)
    setSessao(null)
  }

  const usuario = sessao?.usuario ?? null
  const token = sessao?.token ?? null

  const isAdmin = Boolean(
    usuario &&
    (
      usuario.tipo === 'administrador' ||
      usuario.is_staff ||
      usuario.is_superuser
    )
  )

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: Boolean(token && usuario),
        isAdmin,
        login,
        cadastrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth precisa ser utilizado dentro de AuthProvider.')
  }

  return contexto
}