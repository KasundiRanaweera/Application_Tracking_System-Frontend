import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import ThemeToggle from './components/ui/ThemeToggle'
import { PrivateRoute, RecruiterRoute, CandidateRoute } from './routes/ProtectedRoute'

import LandingPage             from './pages/LandingPage'
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
import JobApplicantsPage      from './pages/recruiter/JobApplicantsPage'
import ApplicantReviewPage from './pages/recruiter/ApplicantReviewPage'

function HomeRedirect() {
  const { user } = useAuth()
  // Logged-out visitors see the public landing page instead of being
  // bounced straight to /login. Logged-in users still redirect straight
  // into their dashboard — that part of the flow is unchanged.
  if (!user) return <LandingPage />
  if (user.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />
  return <Navigate to="/jobs" replace />
}

export default function App() {
  return (
    <>
      <ThemeToggle />
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
      <Route path="/recruiter/jobs/:id/applicants" element={<RecruiterRoute><JobApplicantsPage /></RecruiterRoute>} />
      <Route path="/recruiter/applications/:id" element={<RecruiterRoute><ApplicantReviewPage /></RecruiterRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}