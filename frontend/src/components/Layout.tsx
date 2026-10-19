import { Outlet  } from 'react-router'
import Cabecalho from './Cabecalho'

export default function Layout() {
    return (
        <>
      <Cabecalho />
      <main className="mx-auto max-w-5xl px-5 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-borda py-6 text-center text-sm text-tinta-suave">
        CulturaSp · Eventos culturais em um só lugar
      </footer>
    </>
    )
}