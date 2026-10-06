export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
}) {
  const base = [
    'relative inline-flex items-center justify-center whitespace-nowrap',
    'font-semibold tracking-[-0.01em]',
    'rounded-lg border',
    'transition-[color,background-color,border-color,box-shadow,transform] duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-canvas',
    'active:translate-y-px',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none cursor-pointer',
  ].join(' ')

  const variants = {
    primary: [
      'bg-ink text-on-ink border-ink',
      'hover:bg-ink-hover hover:border-ink-hover',
      'focus-visible:ring-brand-500/60',
      'shadow-xs hover:shadow-pop',
    ].join(' '),

    secondary: [
      'bg-surface text-fg border-line',
      'hover:bg-subtle hover:border-line-strong',
      'focus-visible:ring-brand-500/40',
      'shadow-xs',
    ].join(' '),

    danger: [
      'bg-red-600 text-white border-red-600',
      'hover:bg-red-500 hover:border-red-500',
      'focus-visible:ring-red-500/60',
      'shadow-xs',
    ].join(' '),

    ghost: [
      'bg-transparent text-fg-subtle border-transparent',
      'hover:bg-muted hover:text-fg',
      'focus-visible:ring-brand-500/40',
    ].join(' '),

    outline: [
      'bg-surface text-brand-600 border-brand-200',
      'hover:bg-brand-50 hover:border-brand-300',
      'focus-visible:ring-brand-500/40',
    ].join(' '),

    success: [
      'bg-emerald-600 text-white border-emerald-600',
      'hover:bg-emerald-500 hover:border-emerald-500',
      'focus-visible:ring-emerald-500/60',
      'shadow-xs',
    ].join(' '),
  }

  const sizes = {
    xs: 'h-7  px-2.5 text-xs  gap-1     rounded-md',
    sm: 'h-8  px-3   text-[13px] gap-1.5',
    md: 'h-9  px-4   text-sm  gap-2',
    lg: 'h-10 px-5   text-sm  gap-2',
    xl: 'h-12 px-6   text-base gap-2.5 rounded-xl',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading || undefined}
      className={[
        base,
        variants[variant] ?? variants.primary,
        sizes[size]       ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-3.5 w-3.5 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  )
}
