import { Link, NavLink } from 'react-router'
import simbolo from '../assets/simbolo.ico'

export default function Cabecalho() {
  const link = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-semibold text-tinta' : 'text-tinta-suave hover:text-tinta'

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
          <NavLink to="/" end className={link}>Eventos</NavLink>
          <NavLink to="/admin" className={link}>Administrador</NavLink>
          <Link to="/login" className="rounded border-2 border-tinta px-3 py-1 font-semibold">
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}