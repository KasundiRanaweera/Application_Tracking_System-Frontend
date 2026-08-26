export default function EmptyState({
  icon = '🔍',
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center
      animate-fade-up">
      <div className="relative mb-5">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200
          rounded-2xl flex items-center justify-center text-4xl
          shadow-sm border border-slate-200/60">
          {icon}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-100
          rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-indigo-400 rounded-full" />
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-2 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}