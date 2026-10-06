import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import { LogoMark } from '../ui/Logo'

const COLUMNS = [
  {
    title: 'Get started',
    links: [
      { to: '/register', label: 'Create free account' },
      { to: '/login',    label: 'Sign in' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '#how-it-works', label: 'How it works' },
      { href: '#pipeline',     label: 'Your journey' },
      { href: '#features',     label: 'Why apply here' },
    ],
  },
  {
    title: 'Applying',
    links: [
      { href: '#features', label: 'CV upload or link' },
      { href: '#pipeline', label: 'Application stages' },
      { href: '#features', label: 'Withdrawing an application' },
    ],
  },
]

const LINK = 'text-sm text-fg-subtle hover:text-fg transition-colors'

export default function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">

          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display font-bold text-[15px] text-fg">TalentBridge</span>
            </Link>
            <p className="mt-4 text-sm text-fg-subtle leading-relaxed">
              Find your next role and follow every application from Applied to Hired, all in one place.
            </p>
            <Link to="/register"
              className="group mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold
                bg-ink text-on-ink hover:bg-ink-hover shadow-xs">
              Create free account
              <span className="transition-transform group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:contents">
            {COLUMNS.map(col => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l.label}>
                      {l.to
                        ? <Link to={l.to} className={LINK}>{l.label}</Link>
                        : <a href={l.href} className={LINK}>{l.label}</a>}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none -mb-[0.22em] px-4 text-center
        font-display font-extrabold tracking-[-0.06em] leading-none whitespace-nowrap
        text-[15vw] xl:text-[12.5rem]
        bg-gradient-to-b from-line to-transparent bg-clip-text text-transparent">
        TalentBridge
      </div>
    </footer>
  )
}
