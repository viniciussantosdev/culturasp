import { Routes, Route, Navigate } from 'react-router'
import type { ReactNode } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import EventoDetalhe from './pages/EventoDetalhe'
import Login from './pages/Login'
import Admin from './pages/Admin'
import MeusEventos from './pages/MeusEventos'
import AdminUsuario from './pages/AdminUsuario'
import Sobre from './pages/Sobre'
import { useAuth } from './context/AuthContext'

function RotaAdmin({ children }: { children: ReactNode }) {
  const { autenticado, isAdmin } = useAuth()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function RotaVisitante({ children }: { children: ReactNode }) {
  const { autenticado, isAdmin } = useAuth()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/evento/:id" element={<EventoDetalhe />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/meus-eventos"
          element={
            <RotaVisitante>
              <MeusEventos />
            </RotaVisitante>
          }
        />

        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <Admin />
            </RotaAdmin>
          }
        />

        <Route
          path="/admin/usuarios/:id"
          element={
            <RotaAdmin>
              <AdminUsuario />
            </RotaAdmin>
          }
        />
      </Route>
    </Routes>
  )
}
