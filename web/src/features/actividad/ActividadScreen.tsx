import { useState } from 'react'
import { UserPlus, Trash2, Mail } from 'lucide-react'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { Avatar } from '../../components/Avatar'
import { useAppStore } from '../../store/useAppStore'

export function ActividadScreen() {
  const { amigos, agregarAmigo, eliminarAmigo, actualizarAlias } = useAppStore()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [alias, setAlias] = useState('')
  const [aliasEditandoId, setAliasEditandoId] = useState<string | null>(null)
  const [aliasEditado, setAliasEditado] = useState('')

  function handleAgregar(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim()) return
    agregarAmigo(nombre, email, alias || nombre)
    setNombre('')
    setEmail('')
    setAlias('')
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-1 text-2xl font-bold text-text">Tus Amigos</h1>
      <p className="mb-6 text-sm text-text-muted">
        Cargá a los integrantes del grupo para poder repartir gastos con ellos.
      </p>

      {/* Formulario de carga */}
      <Card className="mb-6">
        <form onSubmit={handleAgregar} className="space-y-3">
          <Input
            id="nombreAmigo"
            label="Nombre del amigo"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <Input
            id="emailAmigo"
            label="E-mail / Mercado Pago de tu amigo"
            type="email"
            placeholder="correo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="aliasAmigo"
            label="Alias para transferencias"
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Agregar a la lista
          </Button>
        </form>
      </Card>

      {/* Listado de amigos agregados */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          Integrantes cargados ({amigos.length})
        </h2>

        {amigos.length === 0 ? (
          <Card className="py-8 text-center text-text-muted">
            Todavía no agregaste a nadie. Usá el formulario de arriba para sumar
            al primer amigo.
          </Card>
        ) : (
          <div className="space-y-2">
            {amigos.map((amigo) => (
              <Card
                key={amigo.id}
                className="flex flex-col gap-3 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={amigo.nombre} size={40} />
                    <div>
                      <p className="text-sm font-semibold text-text">
                        {amigo.nombre}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-text-muted">
                        <Mail size={12} /> {amigo.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminarAmigo(amigo.id)}
                    className="p-2 text-text-muted transition hover:text-danger"
                    title="Eliminar amigo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {aliasEditandoId === amigo.id ? (
                  <div className="flex gap-2">
                    <input
                      value={aliasEditado}
                      onChange={(e) => setAliasEditado(e.target.value)}
                      className="flex-1 rounded-lg border border-primary-light bg-surface px-3 py-2 text-xs text-text outline-none focus:border-primary"
                      placeholder="Alias"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={() => {
                        actualizarAlias(amigo.id, aliasEditado)
                        setAliasEditandoId(null)
                        setAliasEditado('')
                      }}
                    >
                      Guardar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-xs text-text-muted">
                      Alias: <span className="font-semibold text-text">{amigo.alias}</span>
                    </p>
                    <button
                      type="button"
                      className="text-[11px] font-semibold text-primary-dark underline"
                      onClick={() => {
                        setAliasEditandoId(amigo.id)
                        setAliasEditado(amigo.alias)
                      }}
                    >
                      Editar alias
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}