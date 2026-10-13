import { Link, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

/**
 * Auth page layout matching the landing hero: soft brand glow and a
 * fading grid on the canvas, a product showcase on the left (desktop
 * only) and the form in a card on the right.
 */
const AUTH_LINKS = [
  { to: '/login',    label: 'Login' },
  { to: '/register', label: 'Sign up' },
]

export default function AuthShell({ eyebrow, title, highlight, description, visual, children }) {
  const { pathname } = useLocation()

  return (
    <div className="relative min-h-screen bg-canvas text-fg overflow-x-clip flex flex-col">
      {/* Background: same glow + grid as the landing hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0
        bg-[radial-gradient(50%_45%_at_25%_0%,rgb(30_76_224/0.14),transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0
        bg-[linear-gradient(to_right,var(--tb-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--tb-line)_1px,transparent_1px)]
        bg-[size:56px_56px] opacity-50
        [mask-image:radial-gradient(55%_60%_at_25%_10%,black,transparent_80%)]" />

      {/* Nav bar */}
      <header className="relative z-20 sticky top-0 border-b border-line bg-surface/80 backdrop-blur-xl backdrop-saturate-150">
        <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
          aria-label="Main">
          <Logo />
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/"
              className="hidden sm:inline-flex h-9 px-3 items-center rounded-lg text-sm font-medium
                text-fg-subtle hover:text-fg hover:bg-subtle">
              Home
            </Link>
            {AUTH_LINKS.map(link => {
              const active = pathname === link.to
              return (
                <Link key={link.to} to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'inline-flex h-9 px-4 items-center rounded-lg text-sm font-semibold transition-colors',
                    active
                      ? 'bg-ink text-on-ink shadow-xs'
                      : 'text-fg-muted hover:text-fg hover:bg-subtle',
                  ].join(' ')}>
                  {link.label}
                </Link>
              )
            })}
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6 lg:pt-10
        grid lg:grid-cols-[1fr_minmax(0,440px)] gap-10 xl:gap-14 items-start">

        {/* Form card */}
        <div className="w-full max-w-[440px] mx-auto lg:mr-0 lg:order-2 lg:sticky lg:top-24 animate-rise-in">
          <div className="rounded-2xl border-2 border-line-strong bg-surface shadow-pop
            ring-4 ring-brand-600/5 p-6 sm:p-8">
            <div role="tablist" aria-label="Login or sign up"
              className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted mb-7">
              {AUTH_LINKS.map(link => {
                const active = pathname === link.to
                return (
                  <Link key={link.to} to={link.to} role="tab" aria-selected={active}
                    className={[
                      'h-10 inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                      active ? 'bg-surface text-fg shadow-xs ring-1 ring-line' : 'text-fg-subtle hover:text-fg',
                    ].join(' ')}>
                    {link.label}
                  </Link>
                )
              })}
            </div>
            {children}
          </div>
        </div>

        {/* Showcase */}
        <aside className="hidden lg:block min-w-0 lg:order-1">
          <div className="max-w-2xl animate-rise-in [animation-delay:120ms]">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 backdrop-blur
              pl-1.5 pr-3 py-1 text-xs font-medium text-fg-muted shadow-xs mb-6">
              <span className="rounded-full bg-brand-600 text-white px-2 py-0.5 text-[11px] font-semibold">Careers</span>
              {eyebrow}
            </p>
            <h1 className="text-5xl xl:text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance">
              {title}
              <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 bg-clip-text text-transparent">
                {highlight}
              </span>
            </h1>
            <p className="mt-5 text-lg text-fg-subtle leading-relaxed max-w-lg text-pretty">
              {description}
            </p>
          </div>

          {visual && (
            <div className="mt-10 animate-rise-in [animation-delay:240ms]">
              {visual}
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
