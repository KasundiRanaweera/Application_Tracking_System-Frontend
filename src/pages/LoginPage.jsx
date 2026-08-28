import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { login as loginApi } from '../api/authApi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const reason = searchParams.get('reason')
  const sessionMsg = reason === 'session_expired'
    ? 'Your session has expired. Please sign in again.'
    : ''

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.id]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    try {
      const res = await loginApi(form)
      const { token, userId, name, email, role } = res.data
      login({ userId, name, email, role }, token)
      navigate(role === 'RECRUITER' ? '/recruiter/dashboard' : '/jobs')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — ink hero panel */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between
        bg-slate-950 p-12 relative overflow-hidden">

        {/* Ambient brand glow + dot-grid texture, not a blurred blob */}
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem]
          bg-brand-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dots opacity-40
          pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center
            justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-black text-sm">TB</span>
          </div>
          <span className="text-white font-display font-bold text-lg tracking-tight">
            TalentBridge
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <p className="text-brand-400 text-xs font-bold uppercase
            tracking-[0.14em] mb-4">
            Applicant Tracking, Simplified
          </p>
          <h1 className="text-[2.75rem] font-extrabold text-white leading-[1.08]
            tracking-tight mb-5">
            The smarter way<br />to hire great people.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10
            max-w-sm">
            Post jobs, review applicants, and move candidates through
            your pipeline — all in one place.
          </p>

          {/* Signature: the real hiring pipeline as a connected ladder,
              not a decorative stat grid — it shows what the product does. */}
          <div className="relative pl-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-px
              bg-gradient-to-b from-brand-500/70 via-white/15 to-transparent" />
            <div className="space-y-3.5">
              {[
                { label: 'Applied',       state: 'done' },
                { label: 'Under Review',  state: 'done' },
                { label: 'Shortlisted',   state: 'done' },
                { label: 'Interview',     state: 'active' },
                { label: 'Offer',         state: 'pending' },
                { label: 'Hired',         state: 'pending' },
              ].map(({ label, state }) => (
                <div key={label} className="relative flex items-center gap-4">
                  <div className={[
                    'relative z-10 w-[31px] h-[31px] rounded-full flex-shrink-0',
                    'flex items-center justify-center border',
                    state === 'active'
                      ? 'bg-brand-500 border-brand-400 shadow-lg shadow-brand-500/40'
                      : state === 'done'
                        ? 'bg-slate-900 border-brand-500/60'
                        : 'bg-slate-900 border-white/10',
                  ].join(' ')}>
                    {state === 'done' && (
                      <svg className="w-3.5 h-3.5 text-brand-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {state === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={[
                    'text-sm font-semibold',
                    state === 'pending' ? 'text-slate-500' : 'text-white',
                  ].join(' ')}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} TalentBridge ATS
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center bg-slate-50
        px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-[360px] mx-auto">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center
              justify-center shadow-sm">
              <span className="text-white font-black text-xs">TB</span>
            </div>
            <span className="font-display font-bold text-slate-900">TalentBridge</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl text-slate-900 tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          {sessionMsg && (
            <div className="mb-5">
              <Alert type="warning" message={sessionMsg} />
            </div>
          )}
          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" loading={loading} fullWidth size="lg">
              Sign in →
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            New to TalentBridge?{' '}
            <Link to="/register"
              className="text-brand-600 font-semibold hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}