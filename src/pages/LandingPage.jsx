import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { LogoMark } from '../components/ui/Logo'
import LandingNav from '../components/landing/LandingNav'
import HeroMockup from '../components/landing/HeroMockup'

const HERO_POINTS = [
  'Free to join',
  'Apply with your CV or a resume link',
  'Track every application',
]

const STEPS = [
  { icon: 'users',         title: 'Create your free account', body: 'Sign up in under a minute with your name, email and a password.' },
  { icon: 'search',        title: 'Find the right role',      body: 'Search open positions and filter by work mode, employment type or location.' },
  { icon: 'document',      title: 'Apply in minutes',         body: 'Add an optional cover note and upload your CV, or share a link to your resume.' },
  { icon: 'clipboardList', title: 'Track your progress',      body: 'See exactly where each application stands, from Applied to Hired.' },
]

const STAGES = [
  { label: 'Applied',      body: 'We have received your application' },
  { label: 'Under Review', body: 'Your CV and cover note are being reviewed' },
  { label: 'Shortlisted',  body: 'You are selected for the next steps' },
  { label: 'Interview',    body: 'Time to meet the team' },
  { label: 'Offer',        body: 'An offer is on its way to you' },
  { label: 'Hired',        body: 'Welcome aboard' },
]

const FEATURES = [
  { icon: 'search',        title: 'Search and filter roles',  body: 'Find positions by keyword, work mode, employment type or location, sorted the way you like.', wide: true },
  { icon: 'document',      title: 'CV upload or link',        body: 'Attach a PDF, DOC or DOCX up to 5 MB, or share a link to your resume instead.' },
  { icon: 'bolt',          title: 'Always up to date',        body: 'See the latest status of every application each time you sign in.' },
  { icon: 'xCircle',       title: 'Withdraw if plans change', body: 'Changed your mind? Withdraw an application at any point before a final decision.' },
  { icon: 'lock',          title: 'Private and secure',       body: 'Your account is protected with secure sign-in, and your applications are shared only with the hiring team.', wide: true },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-canvas text-fg overflow-x-clip">
      {/* Background: soft brand glow + fading grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[900px]
        bg-[radial-gradient(55%_50%_at_50%_0%,rgb(30_76_224/0.14),transparent_75%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[720px]
        bg-[linear-gradient(to_right,var(--tb-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--tb-line)_1px,transparent_1px)]
        bg-[size:56px_56px] opacity-50
        [mask-image:radial-gradient(60%_55%_at_50%_0%,black,transparent_80%)]" />

      <LandingNav />

      <main className="relative">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 text-center">
          <a href="#how-it-works"
            className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-line
              bg-surface/80 backdrop-blur pl-1.5 pr-3 py-1 text-xs font-medium text-fg-muted shadow-xs
              hover:border-line-strong">
            <span className="rounded-full bg-brand-600 text-white px-2 py-0.5 text-[11px] font-semibold">Careers</span>
            <span className="sm:hidden">Explore open positions</span>
            <span className="hidden sm:inline">Explore open positions and apply today</span>
            <Icon name="arrowRight" className="w-3.5 h-3.5 text-fg-faint" />
          </a>

          <h1 className="animate-rise-in [animation-delay:80ms] mt-6 mx-auto max-w-4xl
            text-[2.4rem] leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] text-balance">
            Find your next role.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 bg-clip-text text-transparent">
              Track every step.
            </span>
          </h1>

          <p className="animate-rise-in [animation-delay:160ms] mt-6 mx-auto max-w-2xl
            text-base sm:text-lg text-fg-subtle leading-relaxed text-pretty">
            Browse open positions, apply in minutes with your CV, and follow your application
            from Applied to Hired. No more wondering where you stand.
          </p>

          <div className="animate-rise-in [animation-delay:240ms] mt-9 flex flex-col sm:flex-row
            items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
            <Link to="/register"
              className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-[15px]
                font-semibold bg-ink text-on-ink hover:bg-ink-hover shadow-xs hover:shadow-pop">
              Get started for free
              <span className="transition-transform group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="w-4 h-4" />
              </span>
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl text-[15px]
                font-semibold text-fg bg-surface border border-line hover:border-line-strong hover:bg-subtle shadow-xs">
              I already have an account
            </Link>
          </div>

          <ul className="animate-rise-in [animation-delay:320ms] mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {HERO_POINTS.map(point => (
              <li key={point} className="flex items-center gap-1.5 text-[13px] text-fg-subtle">
                <Icon name="checkCircle" className="w-4 h-4 text-emerald-600" />
                {point}
              </li>
            ))}
          </ul>

          <div className="animate-rise-in [animation-delay:420ms] mt-14 sm:mt-20 mx-auto max-w-6xl text-left">
            <HeroMockup />
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section id="how-it-works" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
          <SectionHeading
            eyebrow="How it works"
            title="From sign-up to offer in four simple steps"
            body="Everything you need to apply for a role and stay informed, all in one place."
          />

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}
                className="relative rounded-2xl border border-line bg-surface p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100
                    flex items-center justify-center">
                    <Icon name={step.icon} className="w-5 h-5" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-line-strong tabular-nums">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-[17px] text-fg mb-1.5">{step.title}</h3>
                <p className="text-sm text-fg-subtle leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Pipeline ─────────────────────────────────────── */}
        <section id="pipeline" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
          <SectionHeading
            eyebrow="Your application journey"
            title="Six clear stages. No guesswork."
            body="Every application follows the same path, so you always know what has happened and what comes next."
          />

          <ol className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STAGES.map((s, i) => {
              const last = i === STAGES.length - 1
              return (
                <li key={s.label}
                  className={[
                    'relative rounded-xl border p-4 sm:p-5',
                    last
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-surface border-line shadow-card',
                  ].join(' ')}>
                  <span className={[
                    'w-8 h-8 rounded-full text-[12px] font-bold flex items-center justify-center mb-4 tabular-nums',
                    last ? 'bg-emerald-600 text-white' : 'bg-brand-600 text-white',
                  ].join(' ')}>
                    {last ? <Icon name="check" className="w-4 h-4" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <p className={`text-[15px] font-bold ${last ? 'text-emerald-700' : 'text-fg'}`}>{s.label}</p>
                  <p className="text-[13px] text-fg-subtle mt-1 leading-snug">{s.body}</p>
                </li>
              )
            })}
          </ol>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section id="features" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
          <SectionHeading
            eyebrow="Why apply here"
            title="A simpler way to apply for jobs"
            body="Clear, fast and transparent, so you can focus on finding the right role."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title}
                className={[
                  'group rounded-2xl border border-line bg-surface p-6 shadow-card',
                  'hover:border-line-strong hover:shadow-pop transition-[border-color,box-shadow] duration-200',
                  f.wide ? 'lg:col-span-2' : '',
                ].join(' ')}>
                <span className="w-10 h-10 rounded-xl bg-muted text-fg-muted flex items-center justify-center mb-5
                  group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <Icon name={f.icon} className="w-5 h-5" />
                </span>
                <h3 className="text-lg text-fg mb-1.5">{f.title}</h3>
                <p className="text-sm text-fg-subtle leading-relaxed max-w-md">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 sm:px-12 sm:py-20 text-center
            ring-1 ring-white/10">
            <div aria-hidden="true" className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[20rem]
              bg-brand-600/40 rounded-full blur-[110px]" />
            <div aria-hidden="true" className="absolute inset-0 bg-grid-dots opacity-30" />

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-[-0.035em] text-balance max-w-2xl mx-auto">
                Your next role could be one application away.
              </h2>
              <p className="mt-5 text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                Create your free account to browse open positions and track your applications.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3
                max-w-sm sm:max-w-none mx-auto">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-[15px] font-semibold
                    bg-white text-slate-950 hover:bg-slate-100">
                  Create free account
                  <Icon name="arrowRight" className="w-4 h-4" />
                </Link>
                <Link to="/login"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-xl text-[15px] font-semibold
                    text-white ring-1 ring-inset ring-white/20 hover:bg-white/10">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-6
          md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="font-display font-bold text-fg">TalentBridge</span>
            </div>
            <p className="text-[13px] text-fg-subtle mt-2 max-w-xs">
              Find your next role and track every application in one place.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-fg-subtle" aria-label="Footer">
            <a href="#how-it-works" className="hover:text-fg">How it works</a>
            <a href="#pipeline" className="hover:text-fg">Your journey</a>
            <a href="#features" className="hover:text-fg">Why apply here</a>
            <Link to="/login" className="hover:text-fg">Sign in</Link>
            <Link to="/register" className="hover:text-fg">Create account</Link>
          </nav>
        </div>
        <div className="border-t border-line">
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-fg-faint">
            © {new Date().getFullYear()} TalentBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-600 mb-3">{eyebrow}</p>
      <h2 className="text-3xl sm:text-[2.6rem] leading-[1.1] text-fg text-balance">{title}</h2>
      <p className="mt-4 text-base sm:text-lg text-fg-subtle leading-relaxed text-pretty">{body}</p>
    </div>
  )
}
