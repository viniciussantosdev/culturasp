import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

type Props = { aberto: boolean; aoFechar: () => void }

export default function ModalLogin({ aberto, aoFechar }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialogo = ref.current
    if (!dialogo) return
    if (aberto && !dialogo.open) dialogo.showModal()
    if (!aberto && dialogo.open) dialogo.close()
  }, [aberto])

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      className="m-auto w-[min(92vw,380px)] rounded-lg border border-borda p-6 backdrop:bg-black/60"
    >
      <h2 className="text-xl font-semibold">Entre para continuar</h2>
      <p className="mb-4 mt-1 text-sm text-tinta-suave">
        Faça login ou crie uma conta para conseguir seu ingresso.
      </p>
      <div className="flex flex-col gap-2">
        <Link to="/login" className="rounded bg-tinta px-4 py-2 text-center font-semibold text-white">
          Entrar ou criar conta
        </Link>
        <button type="button" onClick={aoFechar} className="rounded border-2 border-borda px-4 py-2 font-semibold">
          Agora não
        </button>
      </div>
    </dialog>
  )
}