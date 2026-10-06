import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { login as loginApi } from '../api/authApi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Icon from '../components/ui/Icon'
import AuthShell from '../components/layout/AuthShell'
import { ApplicationsPreview } from '../components/landing/AuthPreview'

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
      const rawRole = String(role ?? '').trim().toUpperCase().replace(/^ROLE_/, '')
      const normalizedRole = rawRole === 'CANDIDATE' ? 'USER' : rawRole

      login({ userId, name, email, role: normalizedRole }, token)
      navigate(normalizedRole === 'RECRUITER' ? '/recruiter/dashboard' : '/jobs')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Pick up where you left off"
      title="Welcome back."
      highlight="Your next step awaits."
      description="Sign in to browse open positions, apply in minutes and follow every application from Applied to Hired."
      visual={<ApplicationsPreview />}
    >
      <div className="mb-8">
        <h2 className="text-[1.65rem] text-fg tracking-tight mb-1.5">
          Sign in to your account
        </h2>
        <p className="text-sm text-fg-subtle">
          Enter your email and password to continue
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
          showPasswordToggle
        />
        <Button type="submit" loading={loading} fullWidth size="lg">
          Sign in
          <Icon name="arrowRight" className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-line">
        <p className="text-sm text-center text-fg-subtle">
          New to TalentBridge?{' '}
          <Link to="/register"
            className="text-brand-600 font-semibold hover:underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
