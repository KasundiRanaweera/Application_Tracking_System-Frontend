/**
 * Titled content card used for page sections.
 */
export default function Panel({ title, description, actions, children, className = '', bodyClassName = 'p-6' }) {
  return (
    <section className={`bg-surface border border-line rounded-xl shadow-card ${className}`}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-line">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-bold text-fg tracking-tight">{title}</h2>}
            {description && <p className="text-[13px] text-fg-subtle mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
