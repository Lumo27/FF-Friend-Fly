import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export function signInWithGoogle() {
  if (!auth) {
    return Promise.reject(new Error('Firebase no configurado aún.'))
  }

  return signInWithPopup(auth, googleProvider)
}

export function signOutUser() {
  if (!auth) {
    return Promise.resolve()
  }

  return signOut(auth)
}
