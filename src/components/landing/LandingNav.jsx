import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pipeline',     label: 'Your journey' },
  { href: '#features',     label: 'Why apply here' },
]

export default function LandingNav() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={[
      'sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200',
      scrolled || open
        ? 'bg-surface/80 backdrop-blur-xl backdrop-saturate-150 border-b border-line'
        : 'bg-transparent border-b border-transparent',
    ].join(' ')}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
        aria-label="Main">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="px-3 h-9 inline-flex items-center rounded-lg text-sm font-medium
                text-fg-subtle hover:text-fg hover:bg-subtle">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/login"
            className="hidden sm:inline-flex h-9 px-3 items-center rounded-lg text-sm font-semibold
              text-fg-muted hover:text-fg hover:bg-subtle">
            Sign in
          </Link>
          <Link to="/register"
            className="hidden sm:inline-flex h-9 px-4 items-center rounded-lg text-sm font-semibold
              bg-ink text-on-ink hover:bg-ink-hover shadow-xs">
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg
              text-fg-subtle hover:text-fg hover:bg-muted"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-line bg-surface animate-fade-up">
          <div className="px-4 py-3 space-y-1">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-fg-muted hover:bg-subtle hover:text-fg">
                {l.label}
              </a>
            ))}
          </div>
          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            <Link to="/login"
              className="h-10 inline-flex items-center justify-center rounded-lg text-sm font-semibold
                border border-line text-fg hover:bg-subtle">
              Sign in
            </Link>
            <Link to="/register"
              className="h-10 inline-flex items-center justify-center rounded-lg text-sm font-semibold
                bg-ink text-on-ink hover:bg-ink-hover">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
