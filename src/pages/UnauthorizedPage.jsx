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
    <div className="min-h-screen bg-slate-50 flex items-center
      justify-center px-4">
      <div className="text-center max-w-sm animate-fade-up">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center
          justify-center mx-auto mb-6 border border-red-100 shadow-sm">
          <svg className="w-9 h-9 text-red-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          You don't have permission to view this page.
          Sign in with the correct account to continue.
        </p>
        <Button onClick={goHome} size="lg">
          Go to my home page
        </Button>
      </div>
    </div>
  )
}