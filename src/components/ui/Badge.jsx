import {
  STATUS_LABELS, STATUS_COLORS,
  JOB_STATUS_COLORS,
  WORK_MODE_LABELS, WORK_MODE_COLORS,
} from '../../utils/pipelineRules'

export function StatusBadge({ status }) {
  return (
    <span className={[
      'inline-flex items-center gap-1 px-2.5 py-1',
      'rounded-full text-xs font-semibold tracking-wide',
      STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600',
    ].join(' ')}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function JobStatusBadge({ status }) {
  const labels = { DRAFT: 'Draft', OPEN: 'Open', CLOSED: 'Closed' }
  return (
    <span className={[
      'inline-flex items-center gap-1 px-2.5 py-1',
      'rounded-full text-xs font-semibold tracking-wide',
      JOB_STATUS_COLORS[status] ?? 'bg-slate-100 text-slate-600',
    ].join(' ')}>
      {labels[status] ?? status}
    </span>
  )
}

export function WorkModeBadge({ mode }) {
  const icons = { REMOTE: '🌐', HYBRID: '🏢', ONSITE: '📍' }
  return (
    <span className={[
      'inline-flex items-center gap-1 px-2.5 py-1',
      'rounded-full text-xs font-medium',
      WORK_MODE_COLORS[mode] ?? 'bg-slate-50 text-slate-600',
    ].join(' ')}>
      {icons[mode]} {WORK_MODE_LABELS[mode] ?? mode}
    </span>
  )
}

export function Tag({ children, color = 'default' }) {
  const colors = {
    default: 'bg-slate-100 text-slate-600',
    indigo:  'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber:   'bg-amber-50 text-amber-700',
    red:     'bg-red-50 text-red-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5
      rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}