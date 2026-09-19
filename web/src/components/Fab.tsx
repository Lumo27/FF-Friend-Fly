import type { ReactNode } from 'react'

/**
 * Fab
 * - Floating Action Button used for primary floating actions (e.g., agregar gasto).
 * - Props: `onClick` and `children` (icon/text).
 */
interface Props {
  onClick?: () => void
  children?: ReactNode
}

export function Fab({ onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-20 h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
    >
      {children}
    </button>
  )
}

export default Fab
