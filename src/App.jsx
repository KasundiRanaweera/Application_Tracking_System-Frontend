import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { PrivateRoute, RecruiterRoute, CandidateRoute } from './routes/ProtectedRoute'

import LoginPage              from './pages/LoginPage'
import RegisterPage           from './pages/RegisterPage'
import UnauthorizedPage       from './pages/UnauthorizedPage'
import JobsPage               from './pages/candidate/JobsPage'
import JobDetailPage          from './pages/candidate/JobDetailPage'
import MyApplicationsPage     from './pages/candidate/MyApplicationsPage'
import RecruiterDashboardPage from './pages/recruiter/RecruiterDashboardPage'
import RecruiterJobsPage      from './pages/recruiter/RecruiterJobsPage'
import CreateJobPage          from './pages/recruiter/CreateJobPage'
import EditJobPage            from './pages/recruiter/EditJobPage'


function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />
  return <Navigate to="/jobs" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"        element={<LoginPage />} />
      <Route path="/register"     element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/"             element={<HomeRedirect />} />

      {/* Candidate */}
      <Route path="/jobs"            element={<PrivateRoute><JobsPage /></PrivateRoute>} />
      <Route path="/jobs/:id"        element={<PrivateRoute><JobDetailPage /></PrivateRoute>} />
      <Route path="/my-applications" element={<CandidateRoute><MyApplicationsPage /></CandidateRoute>} />

      {/* Recruiter */}
      <Route path="/recruiter/dashboard"        element={<RecruiterRoute><RecruiterDashboardPage /></RecruiterRoute>} />
      <Route path="/recruiter/jobs"             element={<RecruiterRoute><RecruiterJobsPage /></RecruiterRoute>} />
      <Route path="/recruiter/jobs/create"      element={<RecruiterRoute><CreateJobPage /></RecruiterRoute>} />
      <Route path="/recruiter/jobs/:id/edit"    element={<RecruiterRoute><EditJobPage /></RecruiterRoute>} />
     
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}