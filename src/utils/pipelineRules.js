export const PIPELINE_TRANSITIONS = {
  APPLIED:      ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['SHORTLISTED',  'REJECTED'],
  SHORTLISTED:  ['INTERVIEW',    'REJECTED'],
  INTERVIEW:    ['OFFER',        'REJECTED'],
  OFFER:        ['HIRED',        'REJECTED'],
  HIRED:        [],
  REJECTED:     [],
  WITHDRAWN:    [],
}

export const getLegalNextStatuses = (current) =>
  PIPELINE_TRANSITIONS[current] ?? []

export const STATUS_LABELS = {
  APPLIED:      'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED:  'Shortlisted',
  INTERVIEW:    'Interview',
  OFFER:        'Offer Extended',
  HIRED:        'Hired',
  REJECTED:     'Rejected',
  WITHDRAWN:    'Withdrawn',
}

export const STATUS_COLORS = {
  APPLIED:      'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  UNDER_REVIEW: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  SHORTLISTED:  'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  INTERVIEW:    'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  OFFER:        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  HIRED:        'bg-green-50 text-green-700 ring-1 ring-green-200',
  REJECTED:     'bg-red-50 text-red-600 ring-1 ring-red-200',
  WITHDRAWN:    'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
}

export const JOB_STATUS_COLORS = {
  DRAFT:  'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  OPEN:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  CLOSED: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}

export const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME:  'Full-time',
  PART_TIME:  'Part-time',
  CONTRACT:   'Contract',
  INTERNSHIP: 'Internship',
}

export const WORK_MODE_LABELS = {
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  ONSITE: 'On-site',
}

export const WORK_MODE_COLORS = {
  REMOTE: 'bg-blue-50 text-blue-700',
  HYBRID: 'bg-purple-50 text-purple-700',
  ONSITE: 'bg-orange-50 text-orange-700',
}

export const PIPELINE_STAGES = [
  'APPLIED', 'UNDER_REVIEW', 'SHORTLISTED',
  'INTERVIEW', 'OFFER', 'HIRED',
]
