import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import ThemeToggle from '../ui/ThemeToggle'
import { LogoMark } from '../ui/Logo'

function useIsActive(to) {
  const { pathname } = useLocation()
  return pathname === to || pathname.startsWith(to + '/')
}

function NavLink({ to, icon, children }) {
  const active = useIsActive(to)

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={[
        'inline-flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-lg',
        'transition-colors duration-150',
        active
          ? 'text-fg bg-muted'
          : 'text-fg-subtle hover:text-fg hover:bg-subtle',
      ].join(' ')}
    >
      <Icon name={icon} className={`w-4 h-4 ${active ? 'text-brand-600' : ''}`} />
      {children}
    </Link>
  )
}

function MobileLink({ to, icon, children, onClick }) {
  const active = useIsActive(to)

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg',
        active ? 'bg-muted text-fg' : 'text-fg-muted hover:bg-subtle hover:text-fg',
      ].join(' ')}
    >
      <Icon name={icon} className={`w-4 h-4 ${active ? 'text-brand-600' : 'text-fg-faint'}`} />
      {children}
    </Link>
  )
}

function Avatar({ name, isRec, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-[11px]', md: 'w-8 h-8 text-xs' }
  return (
    <div className={[
      'rounded-full flex items-center justify-center flex-shrink-0',
      'font-semibold text-white ring-2 ring-surface',
      sizes[size],
      isRec
        ? 'bg-gradient-to-br from-brand-500 to-brand-700'
        : 'bg-gradient-to-br from-sky-500 to-brand-600',
    ].join(' ')}>
      {name?.charAt(0).toUpperCase()}
    </div>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const isRec = user?.role === 'RECRUITER'
  const isCan = user?.role === 'USER'

  const links = [
    ...(isCan ? [
      { to: '/jobs', icon: 'search', label: 'Browse Jobs' },
      { to: '/my-applications', icon: 'clipboardList', label: 'My Applications' },
    ] : []),
    ...(isRec ? [
      { to: '/recruiter/dashboard', icon: 'chartBar', label: 'Dashboard' },
      { to: '/recruiter/jobs', icon: 'briefcase', label: 'My Jobs' },
    ] : []),
  ]

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    if (!showLogoutModal) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowLogoutModal(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showLogoutModal])

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl
        backdrop-saturate-150 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo + primary nav */}
          <div className="flex items-center gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 rounded-lg">
              <LogoMark />
              <span className="font-display font-bold text-fg text-[15px]
                tracking-tight hidden sm:block">
                TalentBridge
              </span>
            </Link>

            {user && links.length > 0 && (
              <nav className="hidden md:flex items-center gap-1" aria-label="Main">
                {links.map(l => (
                  <NavLink key={l.to} to={l.to} icon={l.icon}>{l.label}</NavLink>
                ))}
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user && (
              <div className="hidden md:flex items-center gap-3 pl-3 ml-1
                border-l border-line">
                <Avatar name={user.name} isRec={isRec} />
                <div className="hidden lg:block leading-tight min-w-0">
                  <p className="text-[13px] font-semibold text-fg truncate max-w-[10rem]">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-fg-subtle">
                    {isRec ? 'Recruiter' : 'Candidate'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg
                    text-[13px] font-medium text-fg-subtle
                    hover:text-red-600 hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
                  </svg>
                  <span className="hidden xl:inline">Sign out</span>
                  <span className="sr-only xl:hidden">Sign out</span>
                </button>
              </div>
            )}

            {/* Mobile burger */}
            {user && (
              <button
                onClick={() => setOpen(v => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center
                  rounded-lg text-fg-subtle hover:text-fg hover:bg-muted"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24" aria-hidden="true">
                  {open
                    ? <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.8} d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16"/>}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {user && open && (
        <div className="md:hidden border-t border-line bg-surface
          shadow-pop animate-fade-up">
          <nav className="px-4 py-3 space-y-1" aria-label="Main">
            {links.map(l => (
              <MobileLink key={l.to} to={l.to} icon={l.icon} onClick={() => setOpen(false)}>
                {l.label}
              </MobileLink>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-line
            flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={user.name} isRec={isRec} size="sm" />
              <div className="leading-tight min-w-0">
                <p className="text-sm font-semibold text-fg truncate">{user.name}</p>
                <p className="text-[11px] text-fg-subtle">{isRec ? 'Recruiter' : 'Candidate'}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="text-[13px] font-semibold text-red-600 px-3 py-2
                rounded-lg hover:bg-red-50">
              Sign out
            </button>
          </div>
        </div>
      )}

      </header>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center
            bg-slate-950/50 px-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowLogoutModal(false)
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line
              bg-surface p-6 shadow-pop animate-fade-up"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-out-title"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center
              rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
              </svg>
            </div>
            <h2 id="sign-out-title" className="text-lg font-bold text-fg">
              Sign out?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
              You will need to sign in again to access your account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmLogout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
