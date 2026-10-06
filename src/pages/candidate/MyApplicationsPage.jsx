import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import { ApplicationListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Icon from '../../components/ui/Icon'
import { StatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { FilterTabs, Pagination, ErrorPanel } from '../../components/ui/ListControls'
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
      <PageHeader
        title="My Applications"
        description="Track every application you have submitted"
        actions={
          <Button variant="secondary" onClick={() => navigate('/jobs')}>
            <Icon name="search" className="w-4 h-4" strokeWidth={2} />
            Browse jobs
          </Button>
        }
      />

      {/* Stats row */}
      {!loading && totalElements > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: totalElements, icon: 'clipboardList', tone: 'bg-muted text-fg-subtle ring-line' },
            { label: 'Active',        value: active,        icon: 'bolt',          tone: 'bg-brand-50 text-brand-600 ring-brand-100' },
            { label: 'Hired',         value: hired,         icon: 'sparkles',      tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
            { label: 'Rejected',      value: rejected,      icon: 'xCircle',       tone: 'bg-red-50 text-red-600 ring-red-100' },
          ].map(({ label, value, icon, tone }, i) => (
            <div
              key={label}
              className="bg-surface border border-line rounded-xl shadow-card p-4
                flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-9 h-9 rounded-lg ring-1 ring-inset flex items-center
                justify-center flex-shrink-0 ${tone}`}>
                <Icon name={icon} className="w-4 h-4" strokeWidth={2} />
              </div>
              <div>
                <p className="font-display text-xl font-extrabold text-fg tabular-nums leading-tight">{value}</p>
                <p className="text-xs text-fg-subtle">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status filter tabs */}
      <FilterTabs
        options={STATUS_FILTERS}
        value={statusFilter}
        onChange={setStatusFilter}
        className="mb-5"
      />

      {/* Loading */}
      {loading && <ApplicationListSkeleton />}

      {/* Error */}
      {!loading && error && (
        <ErrorPanel message={error} onRetry={fetchApplications} />
      )}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <EmptyState
          icon={statusFilter ? 'search' : 'clipboardList'}
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
          {applications.map((app, i) => (
            <article
              key={app.id}
              className="bg-surface border border-line rounded-xl shadow-card
                overflow-hidden relative animate-fade-up hover:border-line-strong transition-colors"
              style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
            >
              {/* Withdraw confirm overlay */}
              {confirmId === app.id && (
                <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm
                  z-10 flex flex-col items-center justify-center
                  p-6 text-center animate-fade-up">
                  <div className="w-11 h-11 bg-red-50 rounded-xl flex
                    items-center justify-center mb-3 ring-1 ring-inset ring-red-100">
                    <Icon name="warning" className="w-5 h-5 text-red-600" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-bold text-fg text-base mb-1">
                    Withdraw application?
                  </h3>
                  <p className="text-sm text-fg-subtle mb-5 max-w-xs">
                    This will remove your application for{' '}
                    <strong className="text-fg">{app.jobTitle}</strong>.
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
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
                  <div className="w-11 h-11 bg-brand-50 ring-1 ring-inset ring-brand-100
                    text-brand-600 rounded-xl flex items-center
                    justify-center flex-shrink-0">
                    <Icon name="briefcase" className="w-5 h-5" strokeWidth={1.8} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">

                    {/* Title row */}
                    <div className="flex flex-wrap items-start
                      justify-between gap-2 mb-1">
                      <h3 className="font-bold text-fg text-base tracking-tight">
                        {app.jobTitle}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1
                      text-xs text-fg-subtle mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="building" className="w-3.5 h-3.5 text-fg-faint" strokeWidth={2} />
                        {app.companyName || 'TalentBridge'}
                      </span>
                      <span className="text-fg-faint">·</span>
                      <span>Applied {formatDate(app.appliedAt)}</span>
                      {app.updatedAt !== app.appliedAt && (
                        <>
                          <span className="text-fg-faint">·</span>
                          <span>Updated {formatDate(app.updatedAt)}</span>
                        </>
                      )}
                    </div>

                    {/* Pipeline progress — active stages only */}
                    {!isTerminal(app.status) && (
                      <div className="mb-5 rounded-lg bg-subtle ring-1 ring-inset ring-line px-4 py-3">
                        <ol className="flex items-start">
                          {PIPELINE_STAGES.map((stage, idx) => {
                            const currentIdx = getStageIndex(app.status)
                            const isDone    = idx < currentIdx
                            const isCurrent = idx === currentIdx
                            const isLast    = idx === PIPELINE_STAGES.length - 1

                            return (
                              <li
                                key={stage}
                                className={`flex items-start ${isLast ? '' : 'flex-1'}`}
                              >
                                {/* Dot */}
                                <div className="flex flex-col items-center
                                  gap-1.5 flex-shrink-0">
                                  <div className={`
                                    w-3 h-3 rounded-full transition-all
                                    ${isDone
                                      ? 'bg-brand-600'
                                      : isCurrent
                                        ? 'bg-surface ring-[3px] ring-brand-600 shadow-[0_0_0_6px_var(--color-brand-50)]'
                                        : 'bg-surface ring-2 ring-line-strong'}
                                  `}/>
                                  <span className={`
                                    text-[11px] hidden sm:block font-medium
                                    leading-none
                                    ${isCurrent
                                      ? 'text-brand-600 font-semibold'
                                      : isDone
                                        ? 'text-fg-muted'
                                        : 'text-fg-faint'}
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
                                    flex-1 h-0.5 mt-[5px] mx-1 rounded-full
                                    ${idx < currentIdx
                                      ? 'bg-brand-600'
                                      : 'bg-line-strong/60'}
                                  `}/>
                                )}
                              </li>
                            )
                          })}
                        </ol>
                      </div>
                    )}

                    {/* Terminal state messages */}
                    {app.status === 'HIRED' && (
                      <div className="flex items-center gap-2 bg-emerald-50
                        ring-1 ring-inset ring-emerald-200 rounded-lg px-3 py-2
                        mb-4 text-sm text-emerald-700 font-medium">
                        <Icon name="sparkles" className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                        Congratulations! You got the job.
                      </div>
                    )}
                    {app.status === 'REJECTED' && (
                      <div className="flex items-center gap-2 bg-red-50
                        ring-1 ring-inset ring-red-200 rounded-lg px-3 py-2
                        mb-4 text-sm text-red-700">
                        <Icon name="xCircle" className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                        This application was not successful.
                      </div>
                    )}
                    {app.status === 'WITHDRAWN' && (
                      <div className="flex items-center gap-2 bg-subtle
                        ring-1 ring-inset ring-line rounded-lg px-3 py-2
                        mb-4 text-sm text-fg-subtle">
                        <Icon name="xMark" className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                        <span>
                          You withdrew this application on{' '}
                          {formatDate(app.updatedAt)}.
                        </span>
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
                        <Icon name="arrowRight" className="w-3.5 h-3.5" />
                      </Button>
                      {canWithdraw(app.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmId(app.id)}
                          className="!text-red-600 dark:!text-red-400 hover:!bg-red-50"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </Layout>
  )
}
