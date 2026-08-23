import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function RecruiterRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'RECRUITER') return <Navigate to="/unauthorized" replace />
  return children
}

export function CandidateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'USER') return <Navigate to="/unauthorized" replace />
  return children
}