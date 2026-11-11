import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import EventoDetalhe from './pages/EventoDetalhe'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { useAuth } from './context/AuthContext'

function RotaAdmin() {
  const { autenticado, isAdmin } = useAuth()

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Admin />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/evento/:id" element={<EventoDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RotaAdmin />} />
      </Route>
    </Routes>
  )
}