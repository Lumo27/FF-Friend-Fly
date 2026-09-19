import { useState } from 'react'
import { Plus, Utensils, Car, Home, Receipt, Trash2, Send } from 'lucide-react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { useAppStore, type Gasto } from '../../store/useAppStore'
import { useNavigate } from 'react-router-dom'

// Mapeo de iconos según la categoría del gasto para mostrar visualmente
const iconoCategoria: Record<Gasto['categoria'], typeof Utensils> = {
  Comida: Utensils,
  Transporte: Car,
  Alojamiento: Home,
  Otro: Receipt,
}

export function GruposScreen() {
  // Traemos los datos reales del store global (gastos, usuario, etc.)
  const { usuarioActual, amigos, gastos, eliminarGasto } = useAppStore()
  const navigate = useNavigate() // Hook para navegar entre pantallas

  // Calcula el total acumulado de todos los gastos
  const total = gastos.reduce((acc, g) => acc + g.monto, 0)

  return (
    <div className="mx-auto max-w-lg p-4">
      {/* Header con el total - Esto es de tus compas, lo dejamos intacto */}
      <div className="mb-6 flex items-center justify-between border-b border-primary-light pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Gastos Realizados</h1>
          <p className="text-xs text-text-muted">Total acumulado del grupo</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-primary-dark">
            ${total.toLocaleString('es-AR')}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">ARS</span>
        </div>
      </div>

      {/* Si no hay gastos, muestra mensaje para cargar el primero */}
      {gastos.length === 0? (
        <Card className="py-12 text-center text-text-muted">
          <p className="mb-3">No hay ningún gasto registrado todavía.</p>
          <Button onClick={() => navigate('/gastos/nuevo')}>+ Cargar el primer gasto</Button>
        </Card>
      ) : (
        // Si hay gastos, los listamos uno por uno
        <div className="space-y-3">
          {gastos.map((gasto) => {
            const Icon = iconoCategoria[gasto.categoria]
            // Verifica si el gasto lo pagué yo para no mostrarme "saldar" a mí misma
            const loPagueYo = gasto.pagadoPorId === (usuarioActual?.id || 'user-me')
            return (
              <Card key={gasto.id} className="p-3.5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary-dark">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{gasto.descripcion}</p>
                      <p className="text-xs text-text-muted">Pagó: <span className="font-medium text-text">{gasto.pagadoPorNombre}</span> · {gasto.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-text">${gasto.monto.toLocaleString('es-AR')}</p>
                  </div>
                </div>

                {/* Botones de acción de cada tarjeta */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                  {/* ESTE ES TU BOTÓN QUE LLAMA A LA PANTALLA DE SALDAR - Siempre visible para testear */}
                  <button
                    onClick={() => navigate(`/saldar/${gasto.id}`)} // Navega a tu pantalla linda pasándole el ID del gasto
                    className="flex items-center gap-1.5 rounded-lg bg-secondary-light px-3 py-1.5 text-xs font-semibold text-secondary-dark"
                  >
                    <Send size={14} /> Saldar / Transferir
                  </button>
                  {/* Botón para borrar el gasto */}
                  <button onClick={() => eliminarGasto(gasto.id)} className="p-1.5 text-text-muted hover:text-danger"><Trash2 size={16} /></button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Botón flotante + para cargar un nuevo gasto - lleva a tu pantalla de cargar gasto */}
      <button
        onClick={() => navigate('/gastos/nuevo')}
        className="fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}