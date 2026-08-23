export default function Input({
  label, id, type = 'text', value, onChange,
  error, placeholder, required = false,
  disabled = false, hint, className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#0f172a] font-sans">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} disabled={disabled} required={required}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white
          font-sans text-[#0f172a] placeholder-[#94a3b8]
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-[#f2f4f6] disabled:text-[#94a3b8] disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-[#e2e8f0]'}
        `}
      />
      {hint && !error  && <p className="text-xs text-[#64748b]">{hint}</p>}
      {error           && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
