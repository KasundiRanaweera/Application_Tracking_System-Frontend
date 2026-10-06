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
        'bg-surface rounded-xl border border-line',
        'shadow-card',
        paddings[padding] ?? paddings.default,
        hover ? [
          'cursor-pointer',
          'hover:border-line-strong hover:shadow-pop',
          'hover:-translate-y-0.5',
          'transition-[border-color,box-shadow,transform] duration-200',
        ].join(' ') : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
