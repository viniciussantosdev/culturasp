import { useState } from 'react'
import { categorias } from '../data/categorias'

export default function Admin() {
  const [selecionadas, setSelecionadas] = useState<number[]>([])
  const campo = 'h-11 w-full rounded border-2 border-borda px-3'
  const rotulo = 'mb-1 block text-sm font-semibold'

  function alternar(id: number) {
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id],
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold">Cadastrar evento</h1>

      {/* enviar estes dados para a API (POST /api/eventos/) */}
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        <div>
          <label htmlFor="titulo" className={rotulo}>Título</label>
          <input id="titulo" type="text" className={campo} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="data" className={rotulo}>Data</label>
            <input id="data" type="date" className={campo} />
          </div>
          <div>
            <label htmlFor="horario" className={rotulo}>Horário</label>
            <input id="horario" type="time" className={campo} />
          </div>
        </div>
        <div>
          <label htmlFor="local" className={rotulo}>Local</label>
          <input id="local" type="text" className={campo} />
        </div>
        <div>
          <label htmlFor="descricao" className={rotulo}>Descrição</label>
          <textarea id="descricao" rows={4} className="w-full rounded border-2 border-borda p-3" />
        </div>
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" className="h-5 w-5" />
          Entrada gratuita
        </label>
        <fieldset>
          <legend className={rotulo}>Categorias (escolha uma ou mais)</legend>
          <div className="flex flex-wrap gap-4">
            {categorias.map((c) => (
              <label key={c.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(c.id)}
                  onChange={() => alternar(c.id)}
                  className="h-4 w-4"
                />
                {c.nome}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="self-start rounded bg-tinta px-5 py-2 font-semibold text-white">
          Salvar evento
        </button>
      </form>
    </div>
  )
}