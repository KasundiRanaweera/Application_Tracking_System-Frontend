export default function Spinner({ fullPage = false, size = 'md', label = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-[3px]',
  }

  const el = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className={[
        sizes[size] ?? sizes.md,
        'border-slate-200 border-t-indigo-600 rounded-full animate-spin',
      ].join(' ')} />
      {label && (
        <p className="text-sm text-slate-400 font-medium">{label}</p>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {el}
      </div>
    )
  }
  return el
}