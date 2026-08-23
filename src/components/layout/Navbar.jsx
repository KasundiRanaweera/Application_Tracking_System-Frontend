import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isRec = user?.role === 'RECRUITER'
  const isCan = user?.role === 'USER'

  const handleLogout = () => { logout(); navigate('/login') }

  const active = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-semibold font-sans px-3 py-1.5 rounded-lg transition-colors ${
        active(path)
          ? 'text-indigo-600 bg-indigo-50'
          : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f2f4f6]'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs font-sans">TB</span>
            </div>
            <span className="font-bold text-[#0f172a] font-sans text-base">
              TalentBridge
            </span>
          </Link>

          {/* Desktop links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {isCan && (<>
                {navLink('/jobs', 'Browse Jobs')}
                {navLink('/my-applications', 'My Applications')}
              </>)}
              {isRec && (<>
                {navLink('/recruiter/dashboard', 'Dashboard')}
                {navLink('/recruiter/jobs', 'My Jobs')}
              </>)}
            </div>
          )}

          {/* User area */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2.5 pl-4 border-l border-[#e2e8f0]">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs
                  font-bold text-white font-sans
                  ${isRec ? 'bg-indigo-600' : 'bg-blue-500'}
                `}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0f172a] font-sans leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#64748b] font-sans mt-0.5">
                    {isRec ? 'Recruiter' : 'Candidate'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-[#64748b] hover:text-red-500
                  font-sans transition-colors px-2 py-1 rounded"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-[#64748b] hover:bg-[#f2f4f6]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {user && open && (
          <div className="md:hidden border-t border-[#e2e8f0] py-3 space-y-1">
            {isCan && (<>
              <Link to="/jobs" onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-sans text-[#0f172a] hover:bg-[#f2f4f6] rounded-lg">
                Browse Jobs
              </Link>
              <Link to="/my-applications" onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-sans text-[#0f172a] hover:bg-[#f2f4f6] rounded-lg">
                My Applications
              </Link>
            </>)}
            {isRec && (<>
              <Link to="/recruiter/dashboard" onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-sans text-[#0f172a] hover:bg-[#f2f4f6] rounded-lg">
                Dashboard
              </Link>
              <Link to="/recruiter/jobs" onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-sans text-[#0f172a] hover:bg-[#f2f4f6] rounded-lg">
                My Jobs
              </Link>
            </>)}
            <div className="px-3 py-2 border-t border-[#e2e8f0] mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0f172a] font-sans">{user.name}</span>
              <button onClick={handleLogout} className="text-xs text-red-500 font-sans font-semibold">
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
