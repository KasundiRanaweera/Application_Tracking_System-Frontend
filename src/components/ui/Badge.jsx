import {
  STATUS_LABELS, STATUS_COLORS,
  JOB_STATUS_COLORS, WORK_MODE_LABELS, WORK_MODE_COLORS,
} from '../../utils/pipelineRules'

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-sans ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function JobStatusBadge({ status }) {
  const labels = { DRAFT: 'Draft', OPEN: 'Open', CLOSED: 'Closed' }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-sans ${JOB_STATUS_COLORS[status] || 'bg-gray-100 text-gray-500'}`}>
      {labels[status] || status}
    </span>
  )
}

export function WorkModeBadge({ mode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-sans ${WORK_MODE_COLORS[mode] || 'bg-gray-50 text-gray-600'}`}>
      {WORK_MODE_LABELS[mode] || mode}
    </span>
  )
}
