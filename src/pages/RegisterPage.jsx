import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { registerCandidate } from '../api/authApi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'
import Icon from '../components/ui/Icon'
import AuthShell from '../components/layout/AuthShell'
import { StepsPreview } from '../components/landing/AuthPreview'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors]           = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]         = useState(false)

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.id]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.id]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                         e.name = 'Full name is required'
    if (!form.email.trim())                        e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))    e.email = 'Enter a valid email address'
    if (!form.password)                            e.password = 'Password is required'
    else if (form.password.length < 8)             e.password = 'Must be at least 8 characters'
    if (!form.confirmPassword)                     e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await registerCandidate({
        name: form.name, email: form.email, password: form.password,
      })
      const { token, userId, name, email, role } = res.data
      login({ userId, name, email, role }, token)
      navigate('/jobs')
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Join as a candidate"
      title="Find your next"
      highlight="opportunity."
      description="Create a free candidate account and start applying to open positions today."
      visual={<StepsPreview />}
    >
      <div className="mb-7">
        <h2 className="text-[1.65rem] text-fg tracking-tight mb-1.5">
          Create your account
        </h2>
        <p className="text-sm text-fg-subtle">
          Join TalentBridge as a candidate — it's free
        </p>
      </div>

      {serverError && (
        <div className="mb-5">
          <Alert type="error" message={serverError} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name" label="Full name"
          value={form.name} onChange={handleChange}
          placeholder="Jane Doe"
          error={errors.name} required
        />
        <Input
          id="email" label="Email address" type="email"
          value={form.email} onChange={handleChange}
          placeholder="you@example.com"
          error={errors.email} required
        />
        <Input
          id="password" label="Password" type="password"
          value={form.password} onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
          hint="Minimum 8 characters"
          required
          showPasswordToggle
        />
        <Input
          id="confirmPassword" label="Confirm password" type="password"
          value={form.confirmPassword} onChange={handleChange}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
          required
          showPasswordToggle
        />
        <div className="pt-1">
          <Button type="submit" loading={loading} fullWidth size="lg">
            Create account
            <Icon name="arrowRight" className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-line">
        <p className="text-sm text-center text-fg-subtle">
          Already have an account?{' '}
          <Link to="/login"
            className="text-brand-600 font-semibold hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
        <p className="text-xs text-center text-fg-faint mt-4 leading-relaxed">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline hover:text-fg-subtle">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:text-fg-subtle">
            Privacy Policy
          </a>
        </p>
      </div>
    </AuthShell>
  )
}
