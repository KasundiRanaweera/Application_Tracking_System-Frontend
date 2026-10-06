import Icon from './Icon'

export function BackLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-fg-subtle
        hover:text-fg"
    >
      <span className="transition-transform group-hover:-translate-x-0.5">
        <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180" strokeWidth={2} />
      </span>
      {children}
    </button>
  )
}

/**
 * Consistent page title block: optional eyebrow/back link, title,
 * description and right-aligned actions.
 */
export default function PageHeader({ eyebrow, title, description, actions, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl sm:text-[1.75rem] font-extrabold text-fg tracking-[-0.03em]">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-fg-subtle mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  )
}
