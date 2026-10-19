import { useState } from 'react'
import { eventos } from '../data/eventos'
import { categorias } from '../data/categorias'
import { normalizar } from '../lib/formatadores'
import CardEvento from '../components/CardEvento'
import FiltroCategorias from '../components/FiltroCategorias'
import logo from '../assets/logo.png'

export default function Home() {
  const [categoria, setCategoria] = useState<number | null>(null)
  const [busca, setBusca] = useState('')

  const termo = normalizar(busca.trim())
  const lista = eventos.filter((e) => {
    const naCategoria = categoria === null || e.categorias.includes(categoria)
    const naBusca = termo === '' || normalizar(`${e.titulo} ${e.local}`).includes(termo)
    return naCategoria && naBusca
  })

  return (
    <>
      <section className="mb-8 grid items-center gap-6 md:grid-cols-2">
        <div>
          <h1 className="mb-2 text-4xl font-semibold leading-tight">Encontre cultura perto de você</h1>
          <p className="mb-5 text-tinta-suave">
            Teatro, música, cinema, dança e mais, de graça ou a preços baixos.
          </p>
          <label htmlFor="busca" className="sr-only">Buscar evento ou local</label>
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar evento ou local"
            className="h-11 w-full max-w-md rounded border-2 border-borda px-3"
          />
        </div>
        <img src={logo} alt="Logo CulturaSp" className="mx-auto hidden w-full max-w-xs md:block" />
      </section>

      <h2 className="mb-3 text-2xl font-semibold">Próximos eventos</h2>
      <div className="mb-6">
        <FiltroCategorias categorias={categorias} selecionada={categoria} aoSelecionar={setCategoria} />
      </div>

      {lista.length === 0 ? (
        <p className="py-6 text-tinta-suave">
          Nenhum evento encontrado. Tente outra categoria ou outra busca.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => (
            <CardEvento key={e.id} evento={e} />
          ))}
        </div>
      )}
    </>
  )
}