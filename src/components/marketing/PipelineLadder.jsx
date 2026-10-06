// Decorative hiring-pipeline ladder used on the always-dark marketing
// panels (landing hero, login, register). Purely presentational.
const DEFAULT_STEPS = [
  { label: 'Applied',      state: 'done' },
  { label: 'Under Review', state: 'done' },
  { label: 'Shortlisted',  state: 'done' },
  { label: 'Interview',    state: 'active' },
  { label: 'Offer',        state: 'pending' },
  { label: 'Hired',        state: 'pending' },
]

export default function PipelineLadder({ steps = DEFAULT_STEPS }) {
  return (
    <div className="relative pl-1" aria-hidden="true">
      <div className="absolute left-[15px] top-2 bottom-2 w-px
        bg-gradient-to-b from-brand-400/80 via-white/15 to-transparent" />
      <ol className="space-y-3.5">
        {steps.map(({ label, state }) => (
          <li key={label} className="relative flex items-center gap-4">
            <span className={[
              'relative z-10 w-[31px] h-[31px] rounded-full flex-shrink-0',
              'flex items-center justify-center border',
              state === 'active'
                ? 'bg-brand-500 border-brand-300 shadow-lg shadow-brand-500/40'
                : state === 'done'
                  ? 'bg-slate-900 border-brand-500/60'
                  : 'bg-slate-900 border-white/10',
            ].join(' ')}>
              {state === 'done' && (
                <svg className="w-3.5 h-3.5 text-brand-300" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {state === 'active' && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </span>
            <span className={[
              'text-sm font-semibold',
              state === 'pending' ? 'text-slate-500' : 'text-white',
            ].join(' ')}>
              {label}
            </span>
            {state === 'active' && (
              <span className="ml-auto text-[11px] font-semibold text-brand-300
                bg-brand-500/15 ring-1 ring-brand-500/30 rounded-full px-2 py-0.5">
                In progress
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
