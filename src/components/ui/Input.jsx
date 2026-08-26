export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  hint,
  className = '',
  prefix,
  suffix,
}) {
  const inputClasses = [
    'w-full text-sm text-slate-900 bg-white placeholder-slate-400',
    'border rounded-lg',
    'transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
    'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
    prefix ? 'pl-9 pr-3 py-2.5' : 'px-3.5 py-2.5',
    suffix ? 'pr-9'             : '',
    error
      ? 'border-red-400 focus:ring-red-400/30 focus:border-red-500'
      : 'border-slate-200 hover:border-slate-300',
  ].join(' ')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 leading-none"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden>*</span>
          )}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2
            text-slate-400 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2
            text-slate-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {hint  && !error && (
        <p className="text-xs text-slate-400 leading-none">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 font-medium leading-none">
          {error}
        </p>
      )}
    </div>
  )
}