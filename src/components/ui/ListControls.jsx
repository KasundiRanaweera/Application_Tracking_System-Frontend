import Button from './Button'
import Icon from './Icon'

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '', inputClassName = '' }) {
  return (
    <div className={`relative flex-1 ${className}`}>
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none">
        <Icon name="search" className="w-4 h-4" strokeWidth={2} />
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full h-10 pl-10 pr-4 text-sm text-fg bg-surface placeholder-fg-faint
          border border-line rounded-lg shadow-xs hover:border-line-strong
          focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500
          ${inputClassName}`}
      />
    </div>
  )
}

/**
 * Segmented filter tabs. `options` is [{ value, label, count? }].
 */
export function FilterTabs({ options, value, onChange, className = '' }) {
  return (
    <div role="tablist" className={`inline-flex max-w-full gap-1 p-1 rounded-xl bg-muted
      overflow-x-auto ${className}`}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={[
              'flex-shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-semibold whitespace-nowrap',
              active
                ? 'bg-surface text-fg shadow-card'
                : 'text-fg-subtle hover:text-fg',
            ].join(' ')}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className={[
                'min-w-[1.25rem] px-1.5 rounded-full text-[11px] font-semibold tabular-nums',
                active ? 'bg-brand-50 text-brand-700' : 'bg-surface/70 text-fg-subtle',
              ].join(' ')}>
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Pagination({ page, totalPages, onPrev, onNext, className = '' }) {
  if (totalPages <= 1) return null
  return (
    <div className={`flex items-center justify-between mt-6 ${className}`}>
      <p className="text-[13px] text-fg-subtle">
        Page <span className="font-semibold text-fg">{page + 1}</span> of{' '}
        <span className="font-semibold text-fg">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page === 0} onClick={onPrev}>
          <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" />
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={onNext}>
          Next
          <Icon name="arrowRight" className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function ErrorPanel({ message, onRetry }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-8 text-center shadow-card">
      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100
        flex items-center justify-center mx-auto mb-3">
        <Icon name="warning" className="w-5 h-5" />
      </div>
      <p className="text-fg text-sm font-medium mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
