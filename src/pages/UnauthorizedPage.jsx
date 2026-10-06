import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Logo from '../components/ui/Logo'

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const goHome = () => {
    if (!user) navigate('/login')
    else if (user.role === 'RECRUITER') navigate('/recruiter/dashboard')
    else navigate('/jobs')
  }

  return (
    <div className="relative min-h-screen bg-canvas flex flex-col px-4">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80
        bg-[radial-gradient(50%_60%_at_50%_0%,rgb(220_38_38/0.08),transparent_70%)]" />
      <div className="relative max-w-7xl w-full mx-auto py-5">
        <Logo />
      </div>
      <div className="relative flex-1 flex items-center justify-center pb-24">
        <div className="text-center max-w-sm animate-fade-up">
          <div className="w-14 h-14 bg-surface rounded-2xl flex items-center
            justify-center mx-auto mb-6 border border-line shadow-card text-red-600">
            <Icon name="lock" className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600 mb-2">Error 403</p>
          <h1 className="text-2xl text-fg tracking-tight mb-2">
            Access Denied
          </h1>
          <p className="text-sm text-fg-subtle mb-8 leading-relaxed">
            You don't have permission to view this page.
            Sign in with the correct account to continue.
          </p>
          <Button onClick={goHome} size="lg">
            Go to my home page
            <Icon name="arrowRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
