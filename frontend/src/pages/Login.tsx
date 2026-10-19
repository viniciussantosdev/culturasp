import { useState } from 'react'

export default function Login() {
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar')
  const campo = 'h-11 w-full rounded border-2 border-borda px-3'
  const rotulo = 'mb-1 block text-sm font-semibold'
  const aba = (ativa: boolean) =>
    `flex-1 rounded border-2 px-3 py-2 font-semibold ${ativa ? 'border-tinta bg-tinta text-white' : 'border-borda'}`

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 flex gap-2" role="group" aria-label="Escolher ação">
        <button type="button" aria-pressed={modo === 'entrar'} onClick={() => setModo('entrar')} className={aba(modo === 'entrar')}>
          Entrar
        </button>
        <button type="button" aria-pressed={modo === 'criar'} onClick={() => setModo('criar')} className={aba(modo === 'criar')}>
          Criar conta
        </button>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
        {modo === 'criar' && (
          <div>
            <label htmlFor="nome" className={rotulo}>Nome</label>
            <input id="nome" type="text" className={campo} />
          </div>
        )}
        <div>
          <label htmlFor="email" className={rotulo}>Email</label>
          <input id="email" type="email" placeholder="voce@email.com" className={campo} />
        </div>
        <div>
          <label htmlFor="senha" className={rotulo}>Senha</label>
          <input id="senha" type="password" className={campo} />
        </div>
        <button type="submit" className="rounded bg-tinta px-4 py-2 font-semibold text-white">
          {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}