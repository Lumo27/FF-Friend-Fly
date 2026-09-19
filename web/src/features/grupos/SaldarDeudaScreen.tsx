import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react'
import { Avatar } from '../../components/Avatar'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useAppStore } from '../../store/useAppStore'

export default function SaldarDeudaScreen() {
  const { id } = useParams<{ id: string }>() // 1. Saca el ID de la URL /saldar/123
  const navigate = useNavigate() // 2. Para volver atrás
  const { gastos, amigos } = useAppStore() // 3. Trae datos reales del store

  const gasto = gastos.find(g => g.id === id) // 4. Busca el gasto por ID
  const destinatario = gasto? (amigos.find(a => a.id === gasto.pagadoPorId)?? null) : null // 5. Busca a quién se le debe

  // 6. Prepara datos con fallback por si no encuentra nada
  const data = {
    name: destinatario?.nombre || gasto?.pagadoPorNombre || 'Franco',
    email: destinatario?.email || 'franco@ejemplo.com',
    alias: (destinatario as any)?.alias || 'franco.mp',
    monto: gasto?.monto || 22100,
    descripcion: gasto? `${gasto.descripcion} · ${gasto.categoria}` : 'Alquiler cabaña + nafta',
  }

  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }) // 7. Formatea a $ 22.100
  const [copiedAlias, setCopiedAlias] = useState(false) // 8. Estados para mostrar "Copiado!"
  const [copiedMonto, setCopiedMonto] = useState(false)

  useEffect(() => { if (copiedAlias) { const t = setTimeout(() => setCopiedAlias(false), 2000); return () => clearTimeout(t) } }, [copiedAlias])
  useEffect(() => { if (copiedMonto) { const t = setTimeout(() => setCopiedMonto(false), 2000); return () => clearTimeout(t) } }, [copiedMonto])

  return (
    <div className="mx-auto max-w-lg p-4">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full bg-white p-2 shadow-sm"><ArrowLeft size={20} /></button>
        <h1 className="text-lg font-bold">Saldar deuda</h1>
      </div>

      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 w-fit rounded-full bg-white p-1 shadow-sm"><Avatar name={data.name} size={72} /></div>
        <p className="text-sm text-text-muted">Le debés a <strong className="text-text">{data.name}</strong></p>
        <p className="my-2 text-4xl font-black text-danger">{fmt.format(data.monto)}</p>
        <p className="mb-6 text-xs text-text-muted">{data.descripcion}</p>

        <Button variant="primary" className="w-full justify-center gap-2 py-3 text-base" onClick={() => window.open('https://www.mercadopago.com.ar/money-transfer', '_blank')}>
          Abrir Mercado Pago <ExternalLink size={16} />
        </Button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => { navigator.clipboard?.writeText(data.alias); setCopiedAlias(true) }} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold">
            {copiedAlias? <Check size={16} className="text-green-600" /> : <Copy size={16} />} {copiedAlias? 'Copiado!' : data.alias}
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(String(data.monto)); setCopiedMonto(true) }} className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold">
            {copiedMonto? <Check size={16} className="text-green-600" /> : <Copy size={16} />} {copiedMonto? 'Copiado!' : 'Copiar monto'}
          </button>
        </div>
        <p className="mt-6 text-[11px] text-text-muted">Alias: {data.alias} · {data.email}</p>
      </Card>
    </div>
  )
}