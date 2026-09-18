import { useState } from 'react'
import {
  Plus,
  Utensils,
  Car,
  Home,
  Receipt,
  X,
  Trash2,
  Send,
  Copy,
  Check,
} from 'lucide-react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useAppStore, type Gasto } from '../../store/useAppStore'

const iconoCategoria: Record<Gasto['categoria'], typeof Utensils> = {
  Comida: Utensils,
  Transporte: Car,
  Alojamiento: Home,
  Otro: Receipt,
}

export function GruposScreen() {
  const { usuarioActual, amigos, gastos, agregarGasto, eliminarGasto } =
    useAppStore()

  const [modalGastoAbierto, setModalGastoAbierto] = useState(false)
  const [modalTransferir, setModalTransferir] = useState<Gasto | null>(null)
  const [copiado, setCopiado] = useState(false)

  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState<Gasto['categoria']>('Comida')
  const [pagadoPorId, setPagadoPorId] = useState(
    usuarioActual?.id || 'user-me',
  )

  const total = gastos.reduce((acc, g) => acc + g.monto, 0)

  const pagadores = [
    {
      id: usuarioActual?.id || 'user-me',
      nombre: `${usuarioActual?.nombre || 'Yo'} (Vos)`,
    },
    ...amigos.map((a) => ({ id: a.id, nombre: a.nombre })),
  ]

  function handleGuardarGasto(e: React.FormEvent) {
    e.preventDefault()
    const valor = parseFloat(monto)
    if (!descripcion.trim() || isNaN(valor) || valor <= 0) return

    agregarGasto(descripcion, valor, categoria, pagadoPorId)
    setDescripcion('')
    setMonto('')
    setModalGastoAbierto(false)
  }

  function handleCopiar(texto: string) {
    if (!texto) return

    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  function handleAbrirTransferencia(gasto: Gasto) {
    const acreedor =
      amigos.find((a) => a.id === gasto.pagadoPorId) ??
      (gasto.pagadoPorId === usuarioActual?.id ? usuarioActual : null)

    const aliasDestino = acreedor?.alias?.trim() || ''
    const emailDestino = acreedor?.email?.trim() || ''
    const textoParaCopiar = aliasDestino || emailDestino

    handleCopiar(textoParaCopiar)
    setModalTransferir(gasto)
  }

  function abrirMercadoPago() {
    window.open('https://www.mercadopago.com.ar/money-transfer', '_blank')
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      {/* Resumen */}
      <div className="mb-6 flex items-center justify-between border-b border-primary-light pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Gastos Realizados</h1>
          <p className="text-xs text-text-muted">Total acumulado del grupo</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary-dark">
            ${total.toLocaleString('es-AR')}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            ARS
          </span>
        </div>
      </div>

      {/* Listado de gastos */}
      {gastos.length === 0 ? (
        <Card className="py-12 text-center text-text-muted">
          <p className="mb-3">No hay ningún gasto registrado todavía.</p>
          <Button onClick={() => setModalGastoAbierto(true)}>
            + Cargar el primer gasto
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {gastos.map((gasto) => {
            const Icon = iconoCategoria[gasto.categoria]
            const loPagueYo =
              gasto.pagadoPorId === (usuarioActual?.id || 'user-me')

            return (
              <Card key={gasto.id} className="p-3.5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {gasto.descripcion}
                      </p>
                      <p className="text-xs text-text-muted">
                        Pagó:{' '}
                        <span className="font-medium text-text">
                          {gasto.pagadoPorNombre}
                        </span>{' '}
                        · {gasto.fecha}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-text">
                      ${gasto.monto.toLocaleString('es-AR')}
                    </p>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
                      {gasto.categoria}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                  {!loPagueYo && (
                    <button
                      onClick={() => handleAbrirTransferencia(gasto)}
                      className="flex items-center gap-1.5 rounded-lg bg-secondary-light px-3 py-1.5 text-xs font-semibold text-secondary-dark transition hover:bg-secondary hover:text-white"
                    >
                      <Send size={14} />
                      Saldar / Transferir
                    </button>
                  )}
                  <button
                    onClick={() => eliminarGasto(gasto.id)}
                    className="p-1.5 text-text-muted transition hover:text-danger"
                    title="Eliminar gasto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Botón flotante (+) */}
      <button
        onClick={() => setModalGastoAbierto(true)}
        className="fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary-dark md:bottom-8"
        title="Nuevo gasto"
      >
        <Plus size={28} />
      </button>

      {/* Modal: Cargar Gasto */}
      {modalGastoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">
                Cargar nuevo gasto
              </h2>
              <button
                onClick={() => setModalGastoAbierto(false)}
                className="text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarGasto} className="space-y-4">
              <Input
                id="desc"
                label="¿Qué compraste?"
                placeholder="Ej: Asado, Cervezas, Combustible"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />

              <Input
                id="monto"
                label="Monto total ($)"
                type="number"
                step="any"
                placeholder="0.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">
                  ¿Quién lo pagó?
                </label>
                <select
                  value={pagadoPorId}
                  onChange={(e) => setPagadoPorId(e.target.value)}
                  className="w-full rounded-lg border border-primary-light bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary"
                >
                  {pagadores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">
                  Categoría
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ['Comida', 'Transporte', 'Alojamiento', 'Otro'] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoria(cat)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        categoria === cat
                          ? 'border-primary bg-primary-light text-primary-dark'
                          : 'border-slate-200 text-text hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Guardar gasto
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Modal: Transferir con Mercado Pago */}
      {modalTransferir && (() => {
        const destinatario =
          amigos.find((a) => a.id === modalTransferir.pagadoPorId) ??
          (modalTransferir.pagadoPorId === usuarioActual?.id ? usuarioActual : null)

        const aliasDestino = destinatario?.alias?.trim() || ''
        const emailDestino = destinatario?.email?.trim() || ''
        const labelCopia = aliasDestino ? 'Alias' : 'Email'

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-sm text-center">
              <div className="mb-4 flex items-center justify-between text-left">
                <h2 className="text-lg font-bold text-text">Saldar Deuda</h2>
                <button
                  onClick={() => setModalTransferir(null)}
                  className="text-text-muted hover:text-text"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-1 text-sm text-text-muted">Destinatario:</p>
              <p className="text-base font-bold text-text">
                {modalTransferir.pagadoPorNombre}
              </p>

              <div className="my-3 rounded-lg bg-slate-100 p-3 text-left text-xs text-text">
                <p className="mb-2 text-text-muted">Alias / email</p>
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary-light bg-white px-3 py-2">
                  <span className="font-semibold text-text">
                    {aliasDestino || 'Sin alias'}
                  </span>
                  <span className="text-text-muted">/</span>
                  <span className="text-text-muted">{emailDestino || 'Sin e-mail'}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopiar(aliasDestino || emailDestino)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary-light bg-white px-2 py-2 font-semibold text-primary-dark"
                  >
                    <Copy size={12} />
                    {copiado && labelCopia === 'Alias' ? 'Alias copiado' : 'Copiar alias'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopiar(emailDestino)}
                    disabled={!emailDestino}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 font-semibold text-text disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Copy size={12} />
                    {copiado && labelCopia === 'Email' ? 'Email copiado' : 'Copiar email'}
                  </button>
                </div>

                {copiado ? (
                  <p className="mt-2 flex items-center gap-1 font-bold text-success">
                    <Check size={14} /> ¡{labelCopia} copiado!
                  </p>
                ) : (
                  <p className="mt-2 flex items-center gap-1 text-text-muted">
                    <Copy size={14} /> Se copia automáticamente al abrir.
                  </p>
                )}
              </div>

              <div className="my-4">
              <span className="text-xs uppercase tracking-wider text-text-muted">
                Monto a enviar
              </span>
              <p className="text-3xl font-black text-primary-dark">
                ${modalTransferir.monto.toLocaleString('es-AR')}
              </p>
            </div>

                <div className="space-y-2">
                  <Button
                    onClick={abrirMercadoPago}
                    className="w-full bg-[#009EE3] text-white hover:bg-[#0081B8]"
                  >
                    Abrir Mercado Pago
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setModalTransferir(null)}
                    className="w-full"
                  >
                    Cerrar
                  </Button>
                </div>
              </Card>
            </div>
        )
      })()}
    </div>
  )
}