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

      {/* Left — indigo brand panel */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between
        bg-indigo-600 p-12 relative overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/40
          rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl
          pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-800/40
          rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl
          pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center
            justify-center backdrop-blur-sm border border-white/20">
            <span className="text-white font-black text-sm">TB</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            TalentBridge
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white leading-[1.1]
            tracking-tight mb-5">
            The smarter way<br />to hire great people.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-10
            max-w-sm">
            Post jobs, review applicants, and move candidates through
            your pipeline — all in one place.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { v: 'Open Jobs',  l: 'Active positions'  },
              { v: '6 Stages',   l: 'Hiring pipeline'   },
              { v: '2 Roles',    l: 'Candidate & recruiter' },
              { v: 'Real-time',  l: 'Status updates'    },
            ].map(({ v, l }) => (
              <div key={l}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4
                  border border-white/10">
                <p className="text-white font-bold text-lg tracking-tight">
                  {v}
                </p>
                <p className="text-indigo-300 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-indigo-400 text-xs">
          © {new Date().getFullYear()} TalentBridge ATS
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col justify-center bg-slate-50
        px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-[360px] mx-auto">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center
              justify-center shadow-sm shadow-indigo-300">
              <span className="text-white font-black text-xs">TB</span>
            </div>
            <span className="font-bold text-slate-900">TalentBridge</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
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
              className="text-indigo-600 font-semibold hover:text-indigo-700">
              Create an account
            </Link>
          </p>

          {/* Demo box */}
          <div className="mt-8 rounded-xl border border-slate-200
            bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase
                tracking-wider">
                Demo credentials
              </p>
            </div>
            <div className="px-4 py-3 space-y-2">
              {[
                { l: 'Email',    v: 'recruiter@talentbridge.com' },
                { l: 'Password', v: 'Recruiter@123'              },
              ].map(({ l, v }) => (
                <div key={l}
                  className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-medium
                    flex-shrink-0">{l}</span>
                  <span className="text-xs font-mono font-semibold
                    text-slate-700 truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}