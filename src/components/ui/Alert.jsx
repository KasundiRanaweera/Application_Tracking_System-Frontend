const CONFIG = {
  error: {
    wrap: 'bg-red-50 border-red-200 text-red-800',
    icon: (
      <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
  success: {
    wrap: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: (
      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
  warning: {
    wrap: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: (
      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
            1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
            0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
    ),
  },
  info: {
    wrap: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: (
      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
  },
}

export default function Alert({ type = 'error', message, title }) {
  if (!message) return null
  const { wrap, icon } = CONFIG[type] ?? CONFIG.error

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3
      text-sm font-medium animate-fade-up ${wrap}`}
    >
      {icon}
      <div>
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className={title ? 'font-normal opacity-90' : ''}>{message}</p>
      </div>
    </div>
  )
}