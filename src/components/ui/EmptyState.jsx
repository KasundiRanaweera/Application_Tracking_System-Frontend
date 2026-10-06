import Icon from './Icon'

// Legacy emoji values map onto the SVG icon set.
const ICON_ALIASES = { '🔍': 'search' }

export default function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}) {
  const visual = typeof icon === 'string'
    ? <Icon name={ICON_ALIASES[icon] ?? icon} className="w-6 h-6" />
    : icon

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center
      animate-fade-up">
      <div className="relative mb-5">
        <div aria-hidden="true" className="absolute -inset-3 rounded-3xl
          bg-gradient-to-b from-brand-50 to-transparent opacity-80" />
        <div className="relative w-14 h-14 rounded-2xl bg-surface border border-line
          shadow-card flex items-center justify-center text-fg-subtle text-2xl">
          {visual}
        </div>
      </div>
      <h3 className="text-base font-bold text-fg mb-1.5 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-fg-subtle max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
