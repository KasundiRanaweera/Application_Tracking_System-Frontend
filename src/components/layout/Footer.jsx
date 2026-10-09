import { useAuth } from '../../auth/AuthContext'
import { LogoMark } from '../ui/Logo'

export default function Footer() {
  const { user } = useAuth()
  const tagline = user?.role === 'RECRUITER'
    ? 'Applicant tracking for modern hiring teams'
    : 'Find your next role and track every application'

  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6
        flex flex-col sm:flex-row items-center justify-between gap-2
        text-xs text-fg-subtle">
        <div className="flex items-center gap-2">
          <LogoMark size="sm" />
          <span>© {new Date().getFullYear()} TalentBridge</span>
        </div>
        <span>{tagline}</span>
      </div>
    </footer>
  )
}
