import { Link, NavLink, useNavigate } from 'react-router'
import simbolo from '../assets/ccaimagemmenor.png'
import { useAuth } from '../context/AuthContext'

export default function Cabecalho() {
  const { usuario, autenticado, isAdmin, logout } = useAuth()
  const navegar = useNavigate()

  const link = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'font-semibold text-destaque'
      : 'text-texto-suave hover:text-destaque'

  function sair() {
    logout()
    navegar('/')
  }

  return (
    <header className="border-b border-neutral-800 bg-fundo text-texto">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={simbolo} alt="" className="h-8 w-auto" />

          <span className="text-xl font-extrabold tracking-tight text-white">
            CCA <span className="text-destaque">São Mateus</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/" end className={link}>
            Eventos
          </NavLink>

          <NavLink to="/sobre" className={link}>
            Sobre nós
          </NavLink>

          {autenticado && !isAdmin && (
            <NavLink to="/meus-eventos" className={link}>
              Meus Eventos
            </NavLink>
          )}

          {autenticado && isAdmin && (
            <NavLink to="/admin" className={link}>
              Administrador
            </NavLink>
          )}

          {autenticado ? (
            <>
              <span className="hidden text-texto-suave transition-colors hover:text-destaque sm:inline">
                Olá, {usuario?.nome || usuario?.email || 'usuário'}!
              </span>
              <button
                type="button"
                onClick={sair}
                className="rounded border-2 border-destaque px-3 py-1 font-semibold text-destaque hover:bg-destaque hover:text-black"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded border-2 border-destaque px-3 py-1 font-semibold text-destaque hover:bg-destaque hover:text-black"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
