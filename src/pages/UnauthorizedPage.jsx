import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Button from '../components/ui/Button'

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const goHome = () => {
    if (!user) navigate('/login')
    else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
    else navigate('/jobs')
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center
          justify-center mx-auto mb-6 border border-red-100">
          <svg className="w-10 h-10 text-red-500" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a] font-sans mb-2">
          Access Denied
        </h1>
        <p className="text-[#64748b] font-sans text-sm mb-8 leading-relaxed">
          You don't have permission to view this page. If you believe this is a mistake,
          please sign in with the correct account.
        </p>
        <Button onClick={goHome} size="lg">
          Go to my home page
        </Button>
      </div>
    </div>
  )
}
