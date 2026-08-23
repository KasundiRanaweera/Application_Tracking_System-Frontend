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
    if (!form.name.trim())
      e.name = 'Full name is required'
    if (!form.email.trim())
      e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email address'
    if (!form.password)
      e.password = 'Password is required'
    else if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword)
      e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match'
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

  const steps = ['Create account', 'Browse jobs', 'Apply & track']

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm font-[Hanken_Grotesk]">TB</span>
          </div>
          <span className="text-white font-bold text-lg font-[Hanken_Grotesk]">TalentBridge</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white font-[Hanken_Grotesk] leading-tight mb-4">
            Find your next opportunity.
          </h1>
          <p className="text-indigo-200 text-base font-[Manrope] leading-relaxed mb-10">
            Create a free candidate account and start applying to open positions today.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center
                  justify-center text-white text-sm font-bold font-[Hanken_Grotesk]">
                  {i + 1}
                </div>
                <span className="text-white text-sm font-[Manrope] font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-xs font-[Manrope]">
          © {new Date().getFullYear()} TalentBridge ATS. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs font-[Hanken_Grotesk]">TB</span>
            </div>
            <span className="font-bold text-[#0f172a] font-[Hanken_Grotesk]">TalentBridge</span>
          </div>

          <h2 className="text-2xl font-bold text-[#0f172a] font-[Hanken_Grotesk] mb-1">
            Create your account
          </h2>
          <p className="text-sm text-[#64748b] font-[Manrope] mb-8">
            Join TalentBridge as a candidate — it's free
          </p>

          {serverError && (
            <div className="mb-5">
              <Alert type="error" message={serverError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              error={errors.name}
              required
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              error={errors.password}
              hint="Minimum 8 characters"
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
              required
            />
            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="mt-2"
            >
              Create account
            </Button>
          </form>

          <p className="text-sm text-center text-[#64748b] font-[Manrope] mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-center text-[#94a3b8] font-[Manrope] mt-4 leading-relaxed">
            Recruiter accounts are provisioned by the company admin — they cannot self-register.
          </p>
        </div>
      </div>
    </div>
  )
}