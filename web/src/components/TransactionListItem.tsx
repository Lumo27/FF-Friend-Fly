// React import not required in new JSX runtimes

type Props = {
  title: string
  subtitle?: string
  amount: number
}

export function TransactionListItem({ title, subtitle, amount }: Props) {
  // Format currency for Argentina without decimals
  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 })

  // Row showing a single transaction: title/subtitle on the left and amount on the right
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-3">
      <div>
        <div className="font-medium text-text">{title}</div>
        {subtitle && <div className="text-xs text-text-muted">{subtitle}</div>}
      </div>

      <div className="text-right">
        <div className="font-semibold text-text text-[14px]">{fmt.format(amount)}</div>
      </div>
    </div>
  )
}

export default TransactionListItem
