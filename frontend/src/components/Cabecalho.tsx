import { Link, NavLink, useNavigate } from 'react-router'
import simbolo from '../assets/simbolo.ico'
import { useAuth } from '../context/AuthContext'

export default function Cabecalho() {
  const { usuario, autenticado, isAdmin, logout } = useAuth()
  const navegar = useNavigate()

  const link = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'font-semibold text-tinta'
      : 'text-tinta-suave hover:text-tinta'

  function sair() {
    logout()
    navegar('/')
  }

  return (
    <header className="border-b border-borda bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={simbolo} alt="" className="h-8 w-auto" />
          <span className="text-xl font-extrabold tracking-tight">
            Cultura<span className="text-marca-vermelho">Sp</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <NavLink to="/" end className={link}>
            Eventos
          </NavLink>

          {autenticado && isAdmin && (
            <NavLink to="/admin" className={link}>
              Administrador
            </NavLink>
          )}

          {autenticado ? (
            <>
             <span className="hidden text-tinta-suave sm:inline">
                Olá, {usuario?.nome || usuario?.email || 'usuário'}!
             </span>
              <button
                type="button"
                onClick={sair}
                className="rounded border-2 border-tinta px-3 py-1 font-semibold"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded border-2 border-tinta px-3 py-1 font-semibold"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}