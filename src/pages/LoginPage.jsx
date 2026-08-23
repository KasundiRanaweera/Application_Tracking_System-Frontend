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
    <div className="min-h-screen bg-[#f7f9fb] flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm font-sans">TB</span>
          </div>
          <span className="text-white font-bold text-lg font-sans">TalentBridge</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white font-sans leading-tight mb-4">
            The smarter way to hire great people.
          </h1>
          <p className="text-indigo-200 text-base font-sans leading-relaxed">
            Post jobs, review applicants, and move candidates through your pipeline — all in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { label: 'Active Positions', value: 'Open Jobs' },
              { label: 'Pipeline Stages', value: '6 Stages' },
              { label: 'Roles Supported', value: '2 Roles' },
              { label: 'Response Time', value: 'Real-time' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-bold text-lg font-sans">{value}</p>
                <p className="text-indigo-200 text-xs font-sans mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs font-sans">
          © {new Date().getFullYear()} TalentBridge ATS. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs font-sans">TB</span>
            </div>
            <span className="font-bold text-[#0f172a] font-sans">TalentBridge</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0f172a] font-sans mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-[#64748b] font-sans mb-8">
            Sign in to your account to continue
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-5">
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
            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Sign in
            </Button>
          </form>

          <p className="text-sm text-center text-[#64748b] font-sans mt-6">
            New to TalentBridge?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

          {/* Demo credentials box */}
          <div className="mt-8 p-4 bg-[#f2f4f6] rounded-xl border border-[#e2e8f0]">
            <p className="text-xs font-semibold text-[#0f172a] font-sans mb-2">
              Demo credentials
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-[#64748b]">Recruiter</span>
                <span className="text-[#0f172a] font-medium">recruiter@talentbridge.com</span>
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-[#64748b]">Password</span>
                <span className="text-[#0f172a] font-medium">Recruiter@123</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
