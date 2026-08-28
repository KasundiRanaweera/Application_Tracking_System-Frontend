import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  const active = pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={[
        'relative px-3 py-1.5 text-sm font-semibold rounded-md',
        'transition-colors duration-150',
        active
          ? 'text-brand-600 bg-brand-50'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
      ].join(' ')}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2
          translate-y-[14px] w-4 h-0.5 bg-brand-600 rounded-full" />
      )}
    </Link>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isRec = user?.role === 'RECRUITER'
  const isCan = user?.role === 'USER'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm
      border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center
              justify-center shadow-sm">
              <span className="text-white font-black text-xs tracking-tight">
                TB
              </span>
            </div>
            <span className="font-display font-bold text-slate-900 text-[15px]
              tracking-tight hidden sm:block">
              TalentBridge
            </span>
          </Link>

          {/* Desktop nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {isCan && (
                <>
                  <NavLink to="/jobs">Browse Jobs</NavLink>
                  <NavLink to="/my-applications">My Applications</NavLink>
                </>
              )}
              {isRec && (
                <>
                  <NavLink to="/recruiter/dashboard">Dashboard</NavLink>
                  <NavLink to="/recruiter/jobs">My Jobs</NavLink>
                </>
              )}
            </nav>
          )}

          {/* Right side */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-3
                border-l border-slate-200">

                {/* Avatar + name */}
                <div className={[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'text-xs font-bold text-white flex-shrink-0',
                  'shadow-sm',
                  isRec
                    ? 'bg-gradient-to-br from-brand-500 to-brand-700'
                    : 'bg-gradient-to-br from-blue-500 to-blue-700',
                ].join(' ')}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="hidden lg:block leading-none">
                  <p className="text-xs font-semibold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isRec ? 'Recruiter' : 'Candidate'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-400
                  hover:text-red-500 transition-colors px-2 py-1 rounded
                  hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile burger */}
          {user && (
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-slate-500
                hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {user && open && (
        <div className="md:hidden border-t border-slate-200 bg-white
          shadow-lg animate-fade-up">
          <div className="px-4 py-3 space-y-1">
            {isCan && (
              <>
                <Link to="/jobs" onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700
                    hover:bg-slate-50 rounded-lg">
                  Browse Jobs
                </Link>
                <Link to="/my-applications" onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700
                    hover:bg-slate-50 rounded-lg">
                  My Applications
                </Link>
              </>
            )}
            {isRec && (
              <>
                <Link to="/recruiter/dashboard" onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700
                    hover:bg-slate-50 rounded-lg">
                  Dashboard
                </Link>
                <Link to="/recruiter/jobs" onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-slate-700
                    hover:bg-slate-50 rounded-lg">
                  My Jobs
                </Link>
              </>
            )}
          </div>
          <div className="px-4 py-3 border-t border-slate-100
            flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={[
                'w-7 h-7 rounded-full flex items-center justify-center',
                'text-[11px] font-bold text-white',
                isRec ? 'bg-brand-600' : 'bg-blue-500',
              ].join(' ')}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {user.name}
              </span>
            </div>
            <button onClick={handleLogout}
              className="text-xs font-semibold text-red-500 hover:text-red-700">
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}