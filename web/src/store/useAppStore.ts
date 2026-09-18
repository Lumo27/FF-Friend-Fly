import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Usuario {
  id: string
  nombre: string
  email: string
  alias: string
}

export interface Gasto {
  id: string
  descripcion: string
  monto: number
  categoria: 'Comida' | 'Transporte' | 'Alojamiento' | 'Otro'
  pagadoPorId: string
  pagadoPorNombre: string
  fecha: string
}

interface AppState {
  usuarioActual: Usuario | null
  amigos: Usuario[]
  gastos: Gasto[]
  iniciarSesion: (nombre: string, email: string, alias?: string) => void
  cerrarSesion: () => void
  agregarAmigo: (nombre: string, email: string, alias?: string) => void
  actualizarAlias: (id: string, alias: string) => void
  eliminarAmigo: (id: string) => void
  agregarGasto: (
    descripcion: string,
    monto: number,
    categoria: Gasto['categoria'],
    pagadoPorId: string,
  ) => void
  eliminarGasto: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      usuarioActual: null,
      amigos: [],
      gastos: [],

      iniciarSesion: (nombre, email, alias) =>
        set({
          usuarioActual: {
            id: 'user-me',
            nombre: nombre.trim() || 'Mi Usuario',
            email: email.trim(),
            alias: (alias ?? nombre).trim() || 'Mi alias',
          },
        }),

      cerrarSesion: () => set({ usuarioActual: null }),

      agregarAmigo: (nombre, email, alias) => {
        const nuevo: Usuario = {
          id: `amigo-${Date.now()}`,
          nombre: nombre.trim() || 'Amigo',
          email: email.trim(),
          alias: (alias ?? nombre).trim() || 'Amigo',
        }
        set((state) => ({ amigos: [...state.amigos, nuevo] }))
      },

      actualizarAlias: (id, alias) =>
        set((state) => {
          const aliasLimpio = alias.trim() || 'Sin alias'

          return {
            usuarioActual:
              state.usuarioActual?.id === id
                ? { ...state.usuarioActual, alias: aliasLimpio }
                : state.usuarioActual,
            amigos: state.amigos.map((amigo) =>
              amigo.id === id ? { ...amigo, alias: aliasLimpio } : amigo,
            ),
          }
        }),

      eliminarAmigo: (id) =>
        set((state) => ({
          amigos: state.amigos.filter((a) => a.id !== id),
        })),

      agregarGasto: (descripcion, monto, categoria, pagadoPorId) => {
        const { usuarioActual, amigos } = get()
        let pagadoPorNombre = 'Desconocido'

        if (usuarioActual && pagadoPorId === usuarioActual.id) {
          pagadoPorNombre = `${usuarioActual.nombre} (Vos)`
        } else {
          const amigo = amigos.find((a) => a.id === pagadoPorId)
          if (amigo) pagadoPorNombre = amigo.nombre
        }

        const nuevoGasto: Gasto = {
          id: `gasto-${Date.now()}`,
          descripcion: descripcion.trim(),
          monto,
          categoria,
          pagadoPorId,
          pagadoPorNombre,
          fecha: new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }

        set((state) => ({ gastos: [nuevoGasto, ...state.gastos] }))
      },

      eliminarGasto: (id) =>
        set((state) => ({
          gastos: state.gastos.filter((g) => g.id !== id),
        })),
    }),
    {
      name: 'splitwaisito-storage',
    },
  ),
)