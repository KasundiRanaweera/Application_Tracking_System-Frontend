import { Link } from 'react-router-dom'

const PIPELINE = [
  { label: 'Applied',      state: 'done' },
  { label: 'Under Review', state: 'done' },
  { label: 'Shortlisted',  state: 'done' },
  { label: 'Interview',    state: 'active' },
  { label: 'Offer',        state: 'pending' },
  { label: 'Hired',        state: 'pending' },
]

const FEATURES = [
  {
    audience: 'For candidates',
    title: 'Find roles that fit',
    body: 'Browse open positions, apply in a few clicks, and track every application from submitted to hired — all in one place.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    audience: 'For recruiters',
    title: 'Run your pipeline',
    body: 'Post jobs, review applicants side by side, and move candidates through every stage without losing track of anyone.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6-4a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
  },
  {
    audience: 'For everyone',
    title: 'Always up to date',
    body: 'Status changes reflect instantly — no spreadsheets, no waiting for an email to know where things stand.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Public nav */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center
              justify-center shadow-sm">
              <span className="text-white font-black text-xs">TB</span>
            </div>
            <span className="font-display font-bold text-slate-900 text-[15px]
              tracking-tight">
              TalentBridge
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900
                px-3 py-2 rounded-lg transition-colors">
              Log in
            </Link>
            <Link to="/register"
              className="text-sm font-semibold text-white bg-slate-900
                hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm
                hover:shadow-md transition-all">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28
        grid lg:grid-cols-2 gap-14 items-center">

        <div>
          <p className="text-brand-600 text-xs font-bold uppercase
            tracking-[0.14em] mb-4">
            Applicant Tracking, Simplified
          </p>
          <h1 className="text-[2.75rem] lg:text-5xl font-extrabold text-slate-900
            leading-[1.08] tracking-tight mb-6">
            Hire smarter.<br />Get hired faster.
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-9 max-w-md">
            TalentBridge brings candidates and recruiters onto one platform —
            post jobs, apply in minutes, and move through every hiring stage
            without losing track of anything.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register"
              className="inline-flex items-center justify-center text-sm
                font-semibold text-white bg-slate-900 hover:bg-slate-800
                px-6 py-3 rounded-xl shadow-sm hover:shadow-lg
                hover:shadow-slate-900/15 active:scale-[0.98] transition-all">
              Create your account
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center text-sm
                font-semibold text-slate-700 bg-white border border-slate-300
                hover:border-slate-400 hover:bg-slate-50 px-6 py-3 rounded-xl
                transition-all">
              Log in
            </Link>
          </div>

          <p className="text-slate-400 text-sm mt-6">
            Open to both job seekers and recruiters — access is tailored to
            your account after you sign in.
          </p>
        </div>

        {/* Visual: same pipeline-ladder motif used on auth pages, for a
            consistent brand thread from marketing page into the app. */}
        <div className="relative rounded-2xl bg-slate-950 p-10 overflow-hidden
          shadow-xl shadow-slate-900/10">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-600/30
            rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />

          <p className="relative z-10 text-slate-400 text-xs font-semibold
            uppercase tracking-wider mb-6">
            Your hiring pipeline
          </p>

          <div className="relative z-10 pl-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-px
              bg-gradient-to-b from-brand-500/70 via-white/15 to-transparent" />
            <div className="space-y-3.5">
              {PIPELINE.map(({ label, state }) => (
                <div key={label} className="relative flex items-center gap-4">
                  <div className={[
                    'relative z-10 w-[31px] h-[31px] rounded-full flex-shrink-0',
                    'flex items-center justify-center border',
                    state === 'active'
                      ? 'bg-brand-500 border-brand-400 shadow-lg shadow-brand-500/40'
                      : state === 'done'
                        ? 'bg-slate-900 border-brand-500/60'
                        : 'bg-slate-900 border-white/10',
                  ].join(' ')}>
                    {state === 'done' && (
                      <svg className="w-3.5 h-3.5 text-brand-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {state === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={[
                    'text-sm font-semibold',
                    state === 'pending' ? 'text-slate-500' : 'text-white',
                  ].join(' ')}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ audience, title, body, icon }) => (
              <div key={title}
                className="bg-white rounded-xl border border-slate-200 p-6
                  shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600
                  flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <p className="text-brand-600 text-xs font-bold uppercase
                  tracking-wider mb-1.5">
                  {audience}
                </p>
                <h3 className="text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center
          justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} TalentBridge ATS</span>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-slate-600">Log in</Link>
            <Link to="/register" className="hover:text-slate-600">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
