import { Navigate, Route, Routes } from 'react-router-dom'
import { TabsLayout } from './components/TabsLayout'
import { LoginScreen } from './features/auth/LoginScreen'
import { GruposScreen } from './features/grupos/GruposScreen'
import { ActividadScreen } from './features/actividad/ActividadScreen'
import { PerfilScreen } from './features/perfil/PerfilScreen'
import { useAppStore } from './store/useAppStore'

function ProtectedLayout() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)

  if (!usuarioActual) {
    return <Navigate to="/login" replace />
  }

  return <TabsLayout />
}

function RootRedirect() {
  const usuarioActual = useAppStore((state) => state.usuarioActual)

  return <Navigate to={usuarioActual ? '/grupos' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/grupos" element={<GruposScreen />} />
        <Route path="/actividad" element={<ActividadScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
