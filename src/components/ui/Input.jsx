import { useState } from 'react'

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
  showPasswordToggle = false,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const inputType = type === 'password' && passwordVisible ? 'text' : type

  const inputClasses = [
    'w-full text-sm text-slate-900 bg-white placeholder-slate-400',
    'border rounded-lg',
    'transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
    'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
    prefix ? 'pl-9 pr-3 py-2.5' : 'px-3.5 py-2.5',
    suffix ? 'pr-9'             : '',
    showPasswordToggle && type === 'password' ? 'pr-10' : '',
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
          type={inputType}
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
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-slate-500 hover:text-slate-700 transition-colors"
            onClick={() => setPasswordVisible(v => !v)}
          >
            {passwordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.84-3.115M6.7 6.7A9.95 9.95 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a9.97 9.97 0 0 1-1.843 3.115M9.88 9.88a3 3 0 1 0 4.24 4.24M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7C20.268 16.057 16.477 19 12 19s-8.268-2.943-9.542-7z" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </button>
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