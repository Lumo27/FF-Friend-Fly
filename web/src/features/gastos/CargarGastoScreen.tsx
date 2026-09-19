/**
 * CargarGastoScreen.tsx
 * --------------------
 * Pantalla para crear un nuevo gasto (mock).
 * - Muestra el importe grande en la parte superior (formateado).
 * - Formulario con descripción, monto editable, categoría y selección
 *   de participantes/pagador (círculos).
 * - Divide el monto en partes iguales entre los participantes
 *   seleccionados y crea un objeto `gasto` impreso por consola (mock).
 * - Usa componentes reutilizables: `Card`, `Input`, `CategoryPill`,
 *   `ParticipantCircle`, `FileInput`, `MapPicker`, `Fab`.
 */
import { useState } from 'react'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import CategoryPill from '../../components/CategoryPill'
import ParticipantCircle from '../../components/ParticipantCircle'
import FileInput from '../../components/FileInput'
import MapPicker from '../../components/MapPicker'
import Fab from '../../components/Fab'

// Tipo simple para los miembros del grupo (mock)
type Member = { id: string; name: string; email?: string }

/**
 * CargarGastoScreen
 * Pantalla para crear un gasto nuevo (mock).
 * - Usa datos de prueba (`mockMembers`) mientras no haya integración con Firestore.
 * - Reutiliza los componentes del sistema de diseño (`Card`, `Input`, `Button`, `Avatar`).
 * - Valida campos básicos y calcula el importe dividido por participante.
 */
export function CargarGastoScreen() {
  // Datos de ejemplo: normalmente se obtendrían de Firestore (miembros del grupo)
  const mockMembers: Member[] = [
    { id: 'u1', name: 'Cande', email: 'cande@example.com' },
    { id: 'u2', name: 'Lucas', email: 'lucas@example.com' },
    { id: 'u3', name: 'Sofi', email: 'sofi@example.com' },
  ]

  // Estados del formulario
  const [descripcion, setDescripcion] = useState('') // descripción del gasto
  const [monto, setMonto] = useState('') // monto en string para permitir separador decimal
  const [pagadorId, setPagadorId] = useState<string>(mockMembers[0].id) // quién pagó
  const [selectedIds, setSelectedIds] = useState<string[]>(mockMembers.map((m) => m.id)) // participantes seleccionados
  const [guardado, setGuardado] = useState(false) // flag para mostrar mensaje de guardado (mock)
  const [error, setError] = useState<string | null>(null) // mensaje de error de validación
  const [categoria, setCategoria] = useState('comida') // categoría seleccionada
  // Modo de división (por ahora fijo a 'equal')
  const divisionMode = 'equal'

  // Alterna la selección de un miembro (checkbox)
  function toggleMember(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  /**
   * handleSubmit
   * - evita el comportamiento por defecto del form
   * - valida: descripción no vacía, monto > 0, participantes seleccionados
   * - comprueba que el pagador esté entre los participantes
   * - construye un objeto `gasto` en formato simple (mock) y lo imprime por consola
   * - resetea el formulario y muestra un mensaje temporal de éxito
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Normalizamos coma -> punto y parseamos
    const parsed = Number(monto.replace(',', '.'))

    if (!descripcion.trim()) return setError('La descripción es obligatoria.')
    if (Number.isNaN(parsed) || parsed <= 0) return setError('Ingrese un monto válido mayor que 0.')
    if (!selectedIds.length) return setError('Seleccioná al menos un miembro para dividir el gasto.')
    if (!selectedIds.includes(pagadorId)) return setError('El pagador debe estar entre los miembros seleccionados.')

    // División en partes iguales (por ahora)

    // Construcción del objeto gasto (en producción se enviaría a Firestore)
    const participantes = selectedIds.map((id) => {
      const montoAsignado = Number((parsed / selectedIds.length).toFixed(2))
      return { id, porcentaje: Math.round((100 / selectedIds.length) * 100) / 100, monto: montoAsignado }
    })

    const gasto = {
      descripcion: descripcion.trim(),
      monto: parsed,
      pagadorId,
      categoria,
      divisionMode,
      participantes,
      fecha: new Date().toISOString(),
    }

    // Aquí se emula el guardado: en futuro reemplazar con llamada a servicio
    console.log('Gasto (mock) creado:', gasto)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)

    // Reseteo del formulario a valores por defecto
    setDescripcion('')
    setMonto('')
    setSelectedIds(mockMembers.map((m) => m.id))
    setPagadorId(mockMembers[0].id)
  }

  // Renderizado: título + formulario dentro de una tarjeta
  const categories = [
    { key: 'alojamiento', label: 'Alojamiento', emoji: '🏠' },
    { key: 'comida', label: 'Comida', emoji: '🍽' },
    { key: 'transporte', label: 'Transporte', emoji: '🚕' },
    { key: 'compras', label: 'Compras', emoji: '🛒' },
    { key: 'otros', label: 'Otros', emoji: '📦' },
  ]

  function togglePagador(id: string) {
    setPagadorId(id)
    // ensure pagador is selected as participant
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="mx-auto max-w-md p-4 pb-20">
      <h1 className="text-xl font-bold text-text mb-2">Cargar gasto</h1>

      {/* Importe total grande arriba de todo */}
      <div className="mx-auto max-w-md mb-4 text-center">
        <div className="text-sm text-text-muted">ARS</div>
        <div className="text-4xl font-extrabold text-text">{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(monto.replace(',', '.')) || 0)}</div>
        <div className="text-sm text-text-muted">
          {monto.trim()
            ? `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(Number(monto.replace(',', '.')))} · ${descripcion || 'Descripción del gasto'}`
            : descripcion || 'Descripción del gasto'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          {/* Campo: descripción */}
          <Input
            id="descripcion"
            label="Descripción"
            placeholder="ej: Cena en el depto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* Campo: monto (string) */}
          <Input
            id="monto"
            label="Monto"
            placeholder="ej: 1200.50"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            inputMode="decimal"
          />

          {/* (El importe grande ahora se muestra arriba de todo) */}

          {/* Categorías: row de CategoryPill */}
          <div>
            <div className="text-sm font-semibold text-text-muted mb-2">Categoría</div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <CategoryPill
                  key={c.key}
                  label={`${c.emoji} ${c.label}`}
                  selected={categoria === c.key}
                  onClick={() => setCategoria(c.key)}
                />
              ))}
            </div>
          </div>
          {/* División en partes iguales (no se muestra opción) */}

          {/* Selector: quién pagó (círculos) */}
          <div>
            <div className="text-sm font-semibold text-text-muted mb-2">¿Quién pagó?</div>
            <div className="flex gap-3">
              {mockMembers.map((m) => (
                <ParticipantCircle key={m.id} id={m.id} name={m.name} selected={pagadorId === m.id} onToggle={togglePagador} />
              ))}
            </div>
          </div>

          {/* Participantes: chips multi-select */}
          <div>
            <div className="text-sm font-semibold text-text-muted mb-2">¿Entre quiénes se divide?</div>
            <div className="flex gap-3 flex-wrap mb-2 items-center">
              {mockMembers.map((m) => (
                <div key={m.id} className="flex flex-col items-center gap-1">
                  <ParticipantCircle id={m.id} name={m.name} selected={selectedIds.includes(m.id)} onToggle={toggleMember} />
                  <span className="text-xs text-text-muted">{m.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
            {/* Mostrar división en partes iguales */}
            <div className="text-sm font-semibold text-primary">Dividido en partes iguales · ${((Number(monto.replace(',', '.')) || 0) / Math.max(1, selectedIds.length)).toFixed(2)} c/u</div>
          </div>

          {/* File & Map */}
          <div className="mt-3 flex flex-col gap-2">
            <FileInput onFile={(file) => console.log('file selected', file)} />
            <MapPicker onPick={(loc) => console.log('picked', loc)} />
          </div>

          {/* Mensaje de error de validación (si existe) */}
          {error && <p className="text-sm text-danger mt-2">{error}</p>}

          {/* Botones: guardar y limpiar */}
          <div className="mt-4 flex gap-2">
            <Button type="submit" className="flex-1">
              Guardar gasto
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setDescripcion('')
                setMonto('')
                setSelectedIds(mockMembers.map((m) => m.id))
                setPagadorId(mockMembers[0].id)
                setError(null)
              }}
            >
              Limpiar
            </Button>
          </div>

          {/* Mensaje de éxito temporal tras el mock-guardado */}
          {guardado && <p className="text-center text-sm font-semibold text-primary mt-3">Gasto guardado (mock) ✨</p>}
        </Card>
      </form>

      {/* Floating action button similar al diseño */}
      <Fab onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>+</Fab>
    </div>
  )
}
