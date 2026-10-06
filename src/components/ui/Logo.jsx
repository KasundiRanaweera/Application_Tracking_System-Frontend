import { Link } from 'react-router-dom'

export function LogoMark({ size = 'md' }) {
  const sizes = {
    sm: 'w-6 h-6 rounded-md text-[9px]',
    md: 'w-8 h-8 rounded-lg text-[11px]',
    lg: 'w-9 h-9 rounded-xl text-xs',
  }
  return (
    <span className={[
      'inline-flex items-center justify-center flex-shrink-0',
      'bg-gradient-to-br from-brand-500 to-brand-700 text-white font-extrabold tracking-tight',
      'shadow-xs ring-1 ring-inset ring-white/15',
      sizes[size] ?? sizes.md,
    ].join(' ')}>
      TB
    </span>
  )
}

export default function Logo({ to = '/', size = 'md', inverted = false, className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 rounded-lg ${className}`}>
      <LogoMark size={size} />
      <span className={[
        'font-display font-bold tracking-tight',
        size === 'lg' ? 'text-lg' : 'text-[15px]',
        inverted ? 'text-white' : 'text-fg',
      ].join(' ')}>
        TalentBridge
      </span>
    </Link>
  )
}
