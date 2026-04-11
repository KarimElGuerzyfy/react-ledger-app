import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-stone-50" />

  if (!user) return <Navigate to="/" replace />

  return <>{children}</>
}

export default ProtectedRoute