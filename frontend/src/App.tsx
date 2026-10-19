import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import EventoDetalhe from './pages/EventoDetalhe'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/evento/:id" element={<EventoDetalhe />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

