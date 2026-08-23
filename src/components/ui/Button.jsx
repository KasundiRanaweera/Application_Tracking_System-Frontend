export default function Button({
  children, type = 'button', variant = 'primary',
  size = 'md', disabled = false, loading = false,
  onClick, className = '', fullWidth = false,
}) {
  const base = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-150 focus:outline-none focus-visible:ring-2
    focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    font-sans
  `
  const variants = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500',
    secondary: 'bg-white text-indigo-600 border border-[#e2e8f0] hover:bg-indigo-50 focus-visible:ring-indigo-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost:     'text-[#64748b] hover:bg-[#f2f4f6] hover:text-[#0f172a] focus-visible:ring-gray-400',
    outline:   'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:ring-indigo-400',
  }
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
  }
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading
        ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>Loading...</>
        : children}
    </button>
  )
}
