import { useState, useEffect, FormEvent } from 'react'
import { Avatar } from '../../components/Avatar'
import { Card } from '../../components/Card'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { useAppStore } from '../../store/useAppStore'

export function PerfilScreen() {
  const { usuarioActual, actualizarAlias } = useAppStore()
  const [alias, setAlias] = useState(usuarioActual?.alias || '')

  useEffect(() => {
    setAlias(usuarioActual?.alias || '')
  }, [usuarioActual])

  function handleGuardarAlias(e: FormEvent) {
    e.preventDefault()
    if (!usuarioActual) return

    actualizarAlias(usuarioActual.id, alias)
  }

  if (!usuarioActual) return null

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-2xl font-bold text-text">Perfil</h1>

      <Card className="mb-5 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={usuarioActual.nombre} size={52} />
          <div>
            <p className="text-lg font-bold text-text">{usuarioActual.nombre}</p>
            <p className="text-sm text-text-muted">{usuarioActual.email}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <form onSubmit={handleGuardarAlias} className="space-y-4">
          <Input
            id="aliasPerfil"
            label="Alias para transferencias"
            placeholder="Ej: german123"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Guardar alias
          </Button>
        </form>
      </Card>
    </div>
  )
}

