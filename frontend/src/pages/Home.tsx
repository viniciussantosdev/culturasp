import { eventos } from '../data/eventos'
import { nomeDaCategoria } from '../data/categorias'

export default function Home() {
  return (
    <ul className="p-6 space-y-2">
      {eventos.map((e) => (
        <li key={e.id}>
          {e.titulo} — {e.categorias.map(nomeDaCategoria).join(', ')}
        </li>
      ))}
    </ul>
  )
}