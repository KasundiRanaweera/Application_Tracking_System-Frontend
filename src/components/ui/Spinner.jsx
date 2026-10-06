export default function Spinner({ fullPage = false, size = 'md', label = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-[3px]',
  }

  const el = (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div className={[
        sizes[size] ?? sizes.md,
        'border-line border-t-brand-600 rounded-full animate-spin',
      ].join(' ')} />
      {label
        ? <p className="text-sm text-fg-subtle font-medium">{label}</p>
        : <span className="sr-only">Loading</span>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        {el}
      </div>
    )
  }
  return el
}
