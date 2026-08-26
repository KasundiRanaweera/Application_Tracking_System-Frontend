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
    'inline-flex items-center justify-center',
    'font-semibold tracking-[-0.01em]',
    'rounded-lg border',
    'transition-all duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
  ].join(' ')

  const variants = {
    primary: [
      'bg-indigo-600 text-white border-indigo-600',
      'hover:bg-indigo-700 hover:border-indigo-700',
      'active:scale-[0.98]',
      'focus-visible:ring-indigo-500',
      'shadow-sm hover:shadow-md hover:shadow-indigo-200',
    ].join(' '),

    secondary: [
      'bg-white text-slate-700 border-slate-200',
      'hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900',
      'active:scale-[0.98]',
      'focus-visible:ring-slate-400',
      'shadow-sm',
    ].join(' '),

    danger: [
      'bg-red-600 text-white border-red-600',
      'hover:bg-red-700 hover:border-red-700',
      'active:scale-[0.98]',
      'focus-visible:ring-red-500',
      'shadow-sm',
    ].join(' '),

    ghost: [
      'bg-transparent text-slate-500 border-transparent',
      'hover:bg-slate-100 hover:text-slate-900',
      'active:scale-[0.98]',
      'focus-visible:ring-slate-400',
    ].join(' '),

    outline: [
      'bg-white text-indigo-600 border-indigo-300',
      'hover:bg-indigo-50 hover:border-indigo-400',
      'active:scale-[0.98]',
      'focus-visible:ring-indigo-400',
    ].join(' '),

    success: [
      'bg-emerald-600 text-white border-emerald-600',
      'hover:bg-emerald-700',
      'active:scale-[0.98]',
      'focus-visible:ring-emerald-500',
      'shadow-sm',
    ].join(' '),
  }

  const sizes = {
    xs: 'h-7  px-2.5 text-xs  gap-1',
    sm: 'h-8  px-3   text-sm  gap-1.5',
    md: 'h-9  px-4   text-sm  gap-2',
    lg: 'h-11 px-5   text-sm  gap-2',
    xl: 'h-12 px-6   text-base gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
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