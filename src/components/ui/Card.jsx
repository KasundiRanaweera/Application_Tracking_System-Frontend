export default function Card({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'default',
}) {
  const paddings = {
    none:    '',
    sm:      'p-4',
    default: 'p-5',
    lg:      'p-6',
  }

  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-xl border border-slate-200',
        'shadow-sm',
        paddings[padding] ?? paddings.default,
        hover ? [
          'cursor-pointer',
          'hover:border-brand-300 hover:shadow-md',
          'hover:-translate-y-0.5',
          'transition-all duration-200',
        ].join(' ') : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}