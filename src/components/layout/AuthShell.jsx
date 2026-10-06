import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

/**
 * Split layout for the auth pages: an always-dark brand panel on the
 * left (desktop only) and the form column on the right.
 */
export default function AuthShell({ eyebrow, title, description, visual, glow = 'top', children }) {
  return (
    <div className="relative min-h-screen flex bg-canvas">
      {/* Left — brand panel */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col justify-between
        bg-slate-950 p-12 xl:p-14 relative overflow-hidden">
        <div aria-hidden="true" className={[
          'absolute w-[30rem] h-[30rem] bg-brand-600/30 rounded-full blur-[110px] pointer-events-none',
          glow === 'top' ? '-top-28 -right-28' : '-bottom-28 -left-28',
        ].join(' ')} />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dots opacity-40 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-px bg-gradient-to-b
          from-transparent via-white/10 to-transparent" />

        <div className="relative z-10">
          <Logo size="lg" inverted />
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-brand-300 text-xs font-bold uppercase tracking-[0.14em] mb-4">
            {eyebrow}
          </p>
          <h1 className="text-[2.6rem] xl:text-[2.85rem] font-extrabold text-white leading-[1.06]
            tracking-[-0.035em] mb-5">
            {title}
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            {description}
          </p>
          {visual}
        </div>

        <p className="relative z-10 text-slate-500 text-xs">
          © {new Date().getFullYear()} TalentBridge ATS
        </p>
      </aside>

      {/* Right — form */}
      <main className="flex-1 flex flex-col px-6 py-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between lg:justify-end">
          <Logo className="lg:hidden" />
          <ThemeToggle />
        </div>
        <div className="flex-1 flex flex-col justify-center py-10">
          <div className="w-full max-w-[380px] mx-auto animate-fade-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
