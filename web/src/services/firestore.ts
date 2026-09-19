import { collection } from 'firebase/firestore'
import { db } from './firebase'

export const usuariosRef = db
  ? (collection(db, 'usuarios') as ReturnType<typeof collection>)
  : (null as unknown as ReturnType<typeof collection>)

export const gruposRef = db
  ? (collection(db, 'grupos') as ReturnType<typeof collection>)
  : (null as unknown as ReturnType<typeof collection>)
