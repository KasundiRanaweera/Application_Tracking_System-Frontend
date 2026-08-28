import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { registerCandidate } from '../api/authApi'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Alert from '../components/ui/Alert'

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
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[46%] flex-col justify-between
        bg-slate-950 p-12 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem]
          bg-brand-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

        <div className="relative flex items-center gap-3 z-10">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center
            justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-black text-sm">TB</span>
          </div>
          <span className="text-white font-display font-bold text-lg tracking-tight">TalentBridge</span>
        </div>

        <div className="relative z-10">
          <p className="text-brand-400 text-xs font-bold uppercase
            tracking-[0.14em] mb-4">
            Join as a Candidate
          </p>
          <h1 className="text-[2.75rem] font-extrabold text-white leading-[1.08]
            tracking-tight mb-5">
            Find your next<br />opportunity.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            Create a free candidate account and start applying to open positions today.
          </p>

          <div className="space-y-4">
            {['Create your account', 'Browse open positions', 'Apply & track progress'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900
                  flex items-center justify-center text-brand-400 text-sm
                  font-bold flex-shrink-0 border border-brand-500/40">
                  {i + 1}
                </div>
                <span className="text-white text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">
          © {new Date().getFullYear()} TalentBridge ATS
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center bg-slate-50
        px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-[360px] mx-auto">

          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center
              justify-center shadow-sm">
              <span className="text-white font-black text-xs">TB</span>
            </div>
            <span className="font-display font-bold text-slate-900">TalentBridge</span>
          </Link>

          <div className="mb-7">
            <h2 className="text-2xl text-slate-900 tracking-tight mb-1">
              Create your account
            </h2>
            <p className="text-sm text-slate-500">
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
            />
            <Input
              id="confirmPassword" label="Confirm password" type="password"
              value={form.confirmPassword} onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword} required
            />
            <Button type="submit" loading={loading} fullWidth size="lg">
              Create account →
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login"
              className="text-brand-600 font-semibold hover:text-brand-700">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
            Recruiter accounts are provisioned by the company — they cannot self-register.
          </p>
        </div>
      </div>
    </div>
  )
}