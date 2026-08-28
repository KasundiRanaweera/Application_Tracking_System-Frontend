import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/Badge'
import { getMyApplications, withdrawApplication } from '../../api/applicationsApi'
import { PIPELINE_STAGES, STATUS_LABELS } from '../../utils/pipelineRules'

const STATUS_FILTERS = [
  { value: '',             label: 'All'         },
  { value: 'APPLIED',      label: 'Applied'     },
  { value: 'UNDER_REVIEW', label: 'Under Review'},
  { value: 'SHORTLISTED',  label: 'Shortlisted' },
  { value: 'INTERVIEW',    label: 'Interview'   },
  { value: 'OFFER',        label: 'Offer'       },
  { value: 'HIRED',        label: 'Hired'       },
  { value: 'REJECTED',     label: 'Rejected'    },
  { value: 'WITHDRAWN',    label: 'Withdrawn'   },
]

const TERMINAL = ['HIRED', 'REJECTED', 'WITHDRAWN']

export default function MyApplicationsPage() {
  const navigate = useNavigate()

  const [applications, setApplications]     = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState('')
  const [totalElements, setTotalElements]   = useState(0)
  const [totalPages, setTotalPages]         = useState(0)
  const [statusFilter, setStatusFilterRaw]  = useState('')
  const [page, setPage]                     = useState(0)
  const [withdrawingId, setWithdrawingId]   = useState(null)
  const [confirmId, setConfirmId]           = useState(null)

  // Wrap the filter setter so changing status also resets the page —
  // this replaces resetting page via a separate useEffect, which React's
  // docs recommend avoiding since we already control every place the
  // filter changes (the tab buttons below).
  const setStatusFilter = (v) => { setStatusFilterRaw(v); setPage(0) }

  const pageSize = 10

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page,
        size: pageSize,
        ...(statusFilter && { status: statusFilter }),
      }
      const res = await getMyApplications(params)
      setApplications(res.data.content)
      setTotalElements(res.data.totalElements)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load applications. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  // Data-fetching effect: fetchApplications() sets loading/error/data state,
  // matching React's documented fetch-on-mount/dependency-change pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchApplications()
  }, [fetchApplications])

  const handleWithdraw = async (id) => {
    setWithdrawingId(id)
    try {
      await withdrawApplication(id)
      setConfirmId(null)
      fetchApplications()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to withdraw.')
    } finally {
      setWithdrawingId(null)
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const getStageIndex = (status) => PIPELINE_STAGES.indexOf(status)

  const isTerminal = (status) => TERMINAL.includes(status)
  const canWithdraw = (status) => !TERMINAL.includes(status)

  // Compute counts from totalElements + current page data
  const hired    = applications.filter(a => a.status === 'HIRED').length
  const active   = applications.filter(a => !isTerminal(a.status)).length
  const rejected = applications.filter(a => a.status === 'REJECTED').length

  return (
    <Layout>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">
          My Applications
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Track every application you have submitted
        </p>
      </div>

      {/* Stats row */}
      {!loading && totalElements > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total Applied',
              value: totalElements,
              icon: '📋',
              color: 'text-[#0f172a]',
              bg:    'bg-[#f7f9fb]',
            },
            {
              label: 'Active',
              value: active,
              icon: '⚡',
              color: 'text-brand-600',
              bg:    'bg-brand-50',
            },
            {
              label: 'Hired',
              value: hired,
              icon: '🎉',
              color: 'text-emerald-600',
              bg:    'bg-emerald-50',
            },
            {
              label: 'Rejected',
              value: rejected,
              icon: '❌',
              color: 'text-red-500',
              bg:    'bg-red-50',
            },
          ].map(({ label, value, icon, color, bg }) => (
            <div
              key={label}
              className="bg-white border border-[#e2e8f0] rounded-xl p-4
                flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center
                justify-center text-lg flex-shrink-0 ${bg}`}>
                {icon}
              </div>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-[#64748b]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status filter tabs */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-1.5
        mb-5 flex gap-1 overflow-x-auto">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold
              transition-all duration-150 whitespace-nowrap
              ${statusFilter === value
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f7f9fb]'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <Spinner />}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6
          text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchApplications}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <EmptyState
          icon="📋"
          title={
            statusFilter
              ? 'No applications with this status'
              : 'No applications yet'
          }
          description={
            statusFilter
              ? 'Try selecting a different status filter.'
              : 'Browse open positions and apply to get started.'
          }
          action={
            !statusFilter && (
              <Button onClick={() => navigate('/jobs')}>
                Browse open jobs
              </Button>
            )
          }
        />
      )}

      {/* Applications list */}
      {!loading && !error && applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-[#e2e8f0] rounded-xl
                overflow-hidden relative"
            >
              {/* Withdraw confirm overlay */}
              {confirmId === app.id && (
                <div className="absolute inset-0 bg-white/97 backdrop-blur-sm
                  rounded-xl z-10 flex flex-col items-center justify-center
                  p-8 text-center border border-[#e2e8f0]">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex
                    items-center justify-center text-2xl mb-4 border
                    border-red-100">
                    ⚠️
                  </div>
                  <h3 className="font-bold text-[#0f172a] text-base mb-1">
                    Withdraw application?
                  </h3>
                  <p className="text-sm text-[#64748b] mb-6 max-w-xs">
                    This will remove your application for{' '}
                    <strong className="text-[#0f172a]">{app.jobTitle}</strong>.
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={withdrawingId === app.id}
                      onClick={() => handleWithdraw(app.id)}
                    >
                      Yes, withdraw
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setConfirmId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Card content */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row
                  sm:items-start gap-4">

                  {/* Icon */}
                  <div className="w-12 h-12 bg-[#f7f9fb] border
                    border-[#e2e8f0] rounded-xl flex items-center
                    justify-center text-xl flex-shrink-0">
                    💼
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">

                    {/* Title row */}
                    <div className="flex flex-wrap items-start
                      justify-between gap-2 mb-1">
                      <h3 className="font-bold text-[#0f172a] text-base">
                        {app.jobTitle}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3
                      text-xs text-[#64748b] mb-4">
                      <span className="flex items-center gap-1">
                        🏢 {app.companyName || 'TalentBridge'}
                      </span>
                      <span>·</span>
                      <span>Applied {formatDate(app.appliedAt)}</span>
                      {app.updatedAt !== app.appliedAt && (
                        <>
                          <span>·</span>
                          <span>Updated {formatDate(app.updatedAt)}</span>
                        </>
                      )}
                    </div>

                    {/* Pipeline progress — active stages only */}
                    {!isTerminal(app.status) && (
                      <div className="mb-4">
                        {/* Stage dots */}
                        <div className="flex items-center gap-0">
                          {PIPELINE_STAGES.map((stage, idx) => {
                            const currentIdx = getStageIndex(app.status)
                            const isDone    = idx < currentIdx
                            const isCurrent = idx === currentIdx
                            const isLast    = idx === PIPELINE_STAGES.length - 1

                            return (
                              <div
                                key={stage}
                                className="flex items-center flex-1"
                              >
                                {/* Dot */}
                                <div className="flex flex-col items-center
                                  gap-1.5 flex-shrink-0">
                                  <div className={`
                                    w-3 h-3 rounded-full border-2 transition-all
                                    ${isDone
                                      ? 'bg-brand-600 border-brand-600'
                                      : isCurrent
                                        ? 'bg-white border-brand-600 shadow-sm shadow-brand-200 ring-2 ring-brand-100'
                                        : 'bg-white border-[#e2e8f0]'}
                                  `}/>
                                  <span className={`
                                    text-xs hidden sm:block font-medium
                                    leading-none
                                    ${isCurrent
                                      ? 'text-brand-600'
                                      : isDone
                                        ? 'text-[#64748b]'
                                        : 'text-[#e2e8f0]'}
                                  `}>
                                    {stage === 'UNDER_REVIEW'
                                      ? 'Review'
                                      : stage === 'SHORTLISTED'
                                        ? 'Short.'
                                        : STATUS_LABELS[stage]?.split(' ')[0]}
                                  </span>
                                </div>

                                {/* Connector line */}
                                {!isLast && (
                                  <div className={`
                                    flex-1 h-0.5 mx-1 rounded-full
                                    ${idx < currentIdx
                                      ? 'bg-brand-600'
                                      : 'bg-[#e2e8f0]'}
                                  `}/>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Terminal state messages */}
                    {app.status === 'HIRED' && (
                      <div className="flex items-center gap-2 bg-emerald-50
                        border border-emerald-200 rounded-lg px-3 py-2
                        mb-4 text-sm text-emerald-700 font-medium">
                        🎉 Congratulations! You got the job.
                      </div>
                    )}
                    {app.status === 'REJECTED' && (
                      <div className="flex items-center gap-2 bg-red-50
                        border border-red-100 rounded-lg px-3 py-2
                        mb-4 text-sm text-red-600">
                        This application was not successful.
                      </div>
                    )}
                    {app.status === 'WITHDRAWN' && (
                      <div className="flex items-center gap-2 bg-[#f7f9fb]
                        border border-[#e2e8f0] rounded-lg px-3 py-2
                        mb-4 text-sm text-[#64748b]">
                        You withdrew this application on{' '}
                        {formatDate(app.updatedAt)}.
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/jobs/${app.jobId}`)}
                      >
                        View Job
                      </Button>
                      {canWithdraw(app.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmId(app.id)}
                          className="text-red-400 hover:text-red-600
                            hover:bg-red-50"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6
          border-t border-[#e2e8f0]">
          <p className="text-sm text-[#64748b]">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}
