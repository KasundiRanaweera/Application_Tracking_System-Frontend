import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ui/ThemeToggle'
import Logo, { LogoMark } from '../components/ui/Logo'
import Icon from '../components/ui/Icon'
import PipelineLadder from '../components/marketing/PipelineLadder'

const FEATURES = [
  {
    audience: 'For candidates',
    title: 'Find roles that fit',
    body: 'Browse open positions, apply in a few clicks, and track every application from submitted to hired. All in one place.',
    icon: 'document',
  },
  {
    audience: 'For recruiters',
    title: 'Run your pipeline',
    body: 'Post jobs, review applicants side by side, and move candidates through every stage without losing track of anyone.',
    icon: 'users',
  },
  {
    audience: 'For everyone',
    title: 'Always up to date',
    body: 'Status changes reflect instantly. No spreadsheets, no waiting for an email to know where things stand.',
    icon: 'bolt',
  },
]

const HIGHLIGHTS = ['Free for candidates', 'Six-stage hiring pipeline', 'Real-time status updates']

const PRIMARY_CTA = `inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl
  text-sm font-semibold bg-ink text-on-ink border border-ink
  hover:bg-ink-hover shadow-xs hover:shadow-pop active:translate-y-px`

const SECONDARY_CTA = `inline-flex items-center justify-center h-11 px-5 rounded-xl
  text-sm font-semibold text-fg bg-surface border border-line
  hover:border-line-strong hover:bg-subtle shadow-xs active:translate-y-px`

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-canvas text-fg overflow-x-hidden">
      {/* Soft brand wash behind the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[640px]
        bg-[radial-gradient(60%_60%_at_70%_0%,rgb(30_76_224/0.10),transparent_70%)]" />

      {/* Public nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-fg-muted hover:text-fg
                px-3 h-9 items-center rounded-lg hover:bg-subtle">
              Log in
            </Link>
            <Link to="/register"
              className="inline-flex items-center h-9 px-4 rounded-lg text-sm font-semibold
                bg-ink text-on-ink hover:bg-ink-hover shadow-xs">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28
        grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-16 items-center">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface
            px-3 py-1 text-xs font-semibold text-fg-muted shadow-xs mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Applicant Tracking, Simplified
          </p>
          <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-extrabold text-fg
            leading-[1.04] tracking-[-0.035em] mb-6">
            Hire smarter.<br />
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Get hired faster.
            </span>
          </h1>
          <p className="text-fg-subtle text-lg leading-relaxed mb-9 max-w-[30rem]">
            TalentBridge brings candidates and recruiters onto one platform -
            post jobs, apply in minutes, and move through every hiring stage
            without losing track of anything.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register" className={PRIMARY_CTA}>
              Create your account
              <Icon name="arrowRight" className="w-4 h-4" />
            </Link>
            <Link to="/login" className={SECONDARY_CTA}>
              Log in
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
            {HIGHLIGHTS.map(item => (
              <li key={item} className="flex items-center gap-2 text-sm text-fg-subtle">
                <Icon name="checkCircle" className="w-4 h-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: product-style window with the pipeline ladder */}
        <div className="relative animate-fade-up"
          style={{ animationDelay: '100ms' }}>
          <div aria-hidden="true" className="absolute -inset-4 rounded-[28px]
            bg-gradient-to-br from-brand-500/20 via-transparent to-transparent blur-2xl" />
          <div className="relative rounded-2xl bg-slate-950 ring-1 ring-white/10
            shadow-[0_30px_80px_-20px_rgb(15_23_42/0.45)] overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 h-11 border-b border-white/10 bg-white/[0.03]">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-[11px] font-medium text-slate-500">talentbridge.app/pipeline</span>
            </div>

            <div className="relative p-8 sm:p-10">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-600/30
                rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between mb-7">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Your hiring pipeline
                </p>
                <span className="text-[11px] font-medium text-slate-400 rounded-full
                  border border-white/10 px-2 py-0.5">
                  Live
                </span>
              </div>

              <div className="relative z-10">
                <PipelineLadder />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="relative border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl mb-12">
            <p className="text-brand-600 text-xs font-bold uppercase tracking-[0.14em] mb-3">
              One platform, both sides of hiring
            </p>
            <h2 className="text-3xl sm:text-[2.2rem] text-fg">
              Everything you need to move from application to offer.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {FEATURES.map(({ audience, title, body, icon }, i) => (
              <div key={title}
                className="group bg-canvas rounded-2xl border border-line p-6
                  hover:border-line-strong hover:shadow-pop hover:-translate-y-0.5
                  transition-[border-color,box-shadow,transform] duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100
                  flex items-center justify-center mb-5">
                  <Icon name={icon} className="w-5 h-5" />
                </div>
                <p className="text-fg-subtle text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  {audience}
                </p>
                <h3 className="text-fg text-lg mb-2">{title}</h3>
                <p className="text-fg-subtle text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4
          items-center justify-between text-xs text-fg-subtle">
          <span className="flex items-center gap-2">
            <LogoMark size="sm" />
            © {new Date().getFullYear()} TalentBridge ATS
          </span>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-fg">Log in</Link>
            <Link to="/register" className="hover:text-fg">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
