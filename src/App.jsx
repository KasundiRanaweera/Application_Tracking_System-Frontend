import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { PrivateRoute, RecruiterRoute, CandidateRoute } from './routes/ProtectedRoute'

import LoginPage            from './pages/LoginPage'
import RegisterPage         from './pages/RegisterPage'
import UnauthorizedPage     from './pages/UnauthorizedPage'
import JobsPage             from './pages/candidate/JobsPage'
import MyApplicationsPage   from './pages/candidate/MyApplicationsPage'
import RecruiterDashboard   from './pages/recruiter/RecruiterDashboardPage'
import RecruiterJobsPage    from './pages/recruiter/RecruiterJobsPage'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />
  return <Navigate to="/jobs" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/register"     element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/"             element={<HomeRedirect />} />

      <Route path="/jobs"            element={<PrivateRoute><JobsPage /></PrivateRoute>} />
      <Route path="/my-applications" element={<CandidateRoute><MyApplicationsPage /></CandidateRoute>} />

      <Route path="/recruiter/dashboard" element={<RecruiterRoute><RecruiterDashboard /></RecruiterRoute>} />
      <Route path="/recruiter/jobs"      element={<RecruiterRoute><RecruiterJobsPage /></RecruiterRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
