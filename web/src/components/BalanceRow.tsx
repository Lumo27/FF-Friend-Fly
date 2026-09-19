// React import not required in new JSX runtimes

type Props = {
  name: string
  positive: boolean
  amount: number
  actionLabel?: string
  onAction?: () => void
}

export function BalanceRow({ name, positive, amount, actionLabel, onAction }: Props) {
  // Format currency for Argentina without decimals
  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  // Balance row displays: small descriptor (te debe / vos le debés) above the name on the left,
  // and the amount (prominent) on the right with an optional action button.
  return (
    <div className="bg-white rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold">{name.slice(0,2).toUpperCase()}</div>
          <div>
            <div className="text-xs text-text-muted">{positive ? 'Te debe' : 'Vos le debés'}</div>
            <div className="font-medium text-text">{name}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={positive ? 'text-green-600 font-semibold text-[14px]' : 'text-danger font-semibold text-[14px]'}>{fmt.format(amount)}</div>
          {actionLabel && (
            <button onClick={onAction} className="px-3 py-1 rounded-md bg-primary text-white text-sm">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BalanceRow
