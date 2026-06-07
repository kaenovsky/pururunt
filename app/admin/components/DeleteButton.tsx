'use client'
import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'

interface Props {
  action: () => Promise<void>
  confirm: string
}

export default function DeleteButton({ action, confirm: confirmMsg }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMsg)) return
        startTransition(() => action())
      }}
      className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-40"
    >
      <Trash2 size={15} />
    </button>
  )
}
