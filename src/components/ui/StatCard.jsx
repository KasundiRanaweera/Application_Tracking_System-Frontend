import Icon from './Icon'

/**
 * Dashboard metric tile shared by the candidate and recruiter views.
 * `tone` sets the icon chip colours (text / bg / ring classes).
 */
export default function StatCard({ label, value, icon, tone, loading = false, index = 0 }) {
  return (
    <div
      className="bg-surface border border-line rounded-xl p-5 shadow-card animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-medium text-fg-subtle">{label}</span>
        <div className={`w-8 h-8 rounded-lg ring-1 ring-inset flex items-center
          justify-center flex-shrink-0 ${tone}`}>
          <Icon name={icon} className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>
      <p className="font-display text-3xl font-extrabold tracking-tight text-fg tabular-nums">
        {loading
          ? <span className="inline-block h-8 w-10 rounded-md bg-muted animate-pulse align-middle" />
          : value}
      </p>
    </div>
  )
}
