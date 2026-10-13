import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { login as loginApi, registerCandidate } from '../../api/authApi'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Alert from '../ui/Alert'
import Icon from '../ui/Icon'

const TABS = [
  { id: 'login',    label: 'Login' },
  { id: 'register', label: 'Sign up' },
]

const normalizeRole = (role) => {
  const raw = String(role ?? '').trim().toUpperCase().replace(/^ROLE_/, '')
  return raw === 'CANDIDATE' ? 'USER' : raw
}

/**
 * Login / Sign up card for the landing hero. Uses the same API calls and
 * post-login redirects as LoginPage and RegisterPage.
 */
export default function HeroAuthCard() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [tab, setTab]         = useState('login')
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const switchTab = (id) => { setTab(id); setError('') }

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.id]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (tab === 'login') {
      if (!form.email || !form.password) { setError('Email and password are required.'); return }
    } else {
      if (!form.name.trim())                          { setError('Full name is required.'); return }
      if (!/\S+@\S+\.\S+/.test(form.email))           { setError('Enter a valid email address.'); return }
      if (form.password.length < 8)                   { setError('Password must be at least 8 characters.'); return }
      if (form.password !== form.confirmPassword)     { setError('Passwords do not match.'); return }
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        const res = await loginApi({ email: form.email, password: form.password })
        const { token, userId, name, email, role } = res.data
        const normalizedRole = normalizeRole(role)
        login({ userId, name, email, role: normalizedRole }, token)
        navigate(normalizedRole === 'RECRUITER' ? '/recruiter/dashboard' : '/jobs')
      } else {
        const res = await registerCandidate({
          name: form.name, email: form.email, password: form.password,
        })
        const { token, userId, name, email, role } = res.data
        login({ userId, name, email, role }, token)
        navigate('/jobs')
      }
    } catch (err) {
      setError(err.response?.data?.error
        || (tab === 'login' ? 'Invalid email or password.' : 'Registration failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px] mx-auto rounded-2xl border border-line bg-surface/90 backdrop-blur
      shadow-pop p-6 sm:p-8 text-left">
      {/* Tabs */}
      <div role="tablist" aria-label="Login or sign up"
        className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted mb-6">
        {TABS.map(t => (
          <button key={t.id} type="button" role="tab"
            aria-selected={tab === t.id}
            onClick={() => switchTab(t.id)}
            className={[
              'h-9 rounded-lg text-sm font-semibold transition-colors',
              tab === t.id
                ? 'bg-surface text-fg shadow-xs'
                : 'text-fg-subtle hover:text-fg',
            ].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <h2 className="text-xl text-fg tracking-tight">
          {tab === 'login' ? 'Welcome back' : 'Create your free account'}
        </h2>
        <p className="text-sm text-fg-subtle mt-1">
          {tab === 'login'
            ? 'Enter your email and password to continue'
            : 'Join TalentBridge as a candidate. It takes under a minute'}
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {tab === 'register' && (
          <Input id="name" label="Full name" value={form.name}
            onChange={handleChange} placeholder="Jane Doe" required />
        )}
        <Input id="email" label="Email address" type="email" value={form.email}
          onChange={handleChange} placeholder="you@example.com" required />
        <Input id="password" label="Password" type="password" value={form.password}
          onChange={handleChange}
          placeholder={tab === 'login' ? 'Enter your password' : 'At least 8 characters'}
          required showPasswordToggle />
        {tab === 'register' && (
          <Input id="confirmPassword" label="Confirm password" type="password"
            value={form.confirmPassword} onChange={handleChange}
            placeholder="Repeat your password" required showPasswordToggle />
        )}
        <Button type="submit" loading={loading} fullWidth size="lg">
          {tab === 'login' ? 'Login' : 'Create account'}
          <Icon name="arrowRight" className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
