import {
  STATUS_LABELS, STATUS_COLORS,
  JOB_STATUS_COLORS,
  WORK_MODE_LABELS, WORK_MODE_COLORS,
} from '../../utils/pipelineRules'
import Icon from './Icon'

const PILL = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap'

function Dot() {
  return <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
}

export function StatusBadge({ status }) {
  return (
    <span className={[PILL, STATUS_COLORS[status] ?? 'bg-muted text-fg-muted'].join(' ')}>
      <Dot />
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function JobStatusBadge({ status }) {
  const labels = { DRAFT: 'Draft', OPEN: 'Open', CLOSED: 'Closed' }
  return (
    <span className={[PILL, JOB_STATUS_COLORS[status] ?? 'bg-muted text-fg-muted'].join(' ')}>
      <Dot />
      {labels[status] ?? status}
    </span>
  )
}

export function WorkModeBadge({ mode }) {
  const icons = { REMOTE: 'globe', HYBRID: 'building', ONSITE: 'mapPin' }
  return (
    <span className={[PILL, WORK_MODE_COLORS[mode] ?? 'bg-subtle text-fg-muted'].join(' ')}>
      {icons[mode] && <Icon name={icons[mode]} className="w-3.5 h-3.5" />}
      {WORK_MODE_LABELS[mode] ?? mode}
    </span>
  )
}

export function Tag({ children, color = 'default' }) {
  const colors = {
    default: 'bg-muted text-fg-muted',
    indigo:  'bg-brand-50 text-brand-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber:   'bg-amber-50 text-amber-700',
    red:     'bg-red-50 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5
      rounded-md text-xs font-medium ${colors[color] ?? colors.default}`}>
      {children}
    </span>
  )
}
