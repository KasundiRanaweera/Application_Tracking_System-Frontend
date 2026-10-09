import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import { ApplicationListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Icon from '../../components/ui/Icon'
import { StatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
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
  const [totalPages, setTotalPages]         = useState(0)
  const [statusFilter, setStatusFilterRaw]  = useState('')
  const [page, setPage]                     = useState(0)
  const [withdrawingId, setWithdrawingId]   = useState(null)
  const [confirmId, setConfirmId]           = useState(null)
  const [counts, setCounts]                 = useState(null)

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

  // Stats cover every application, not just the current page or filter.
  const fetchCounts = useCallback(async () => {
    try {
      const res = await getMyApplications({ size: 1000 })
      const all = res.data.content || []
      setCounts({
        total:    res.data.totalElements ?? all.length,
        active:   all.filter(a => !TERMINAL.includes(a.status)).length,
        hired:    all.filter(a => a.status === 'HIRED').length,
        rejected: all.filter(a => a.status === 'REJECTED').length,
      })
    } catch {
      // stats are optional; the list shows its own error
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchCounts()
  }, [fetchCounts])

  const handleWithdraw = async (id) => {
    setWithdrawingId(id)
    try {
      await withdrawApplication(id)
      setConfirmId(null)
      fetchApplications()
      fetchCounts()
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
      {counts && counts.total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: counts.total,    icon: 'clipboardList', tone: 'bg-brand-50 text-brand-600 ring-brand-100' },
            { label: 'Active',        value: counts.active,   icon: 'bolt',          tone: 'bg-amber-50 text-amber-600 ring-amber-100' },
            { label: 'Hired',         value: counts.hired,    icon: 'sparkles',      tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
            { label: 'Rejected',      value: counts.rejected, icon: 'xCircle',       tone: 'bg-red-50 text-red-600 ring-red-100' },
          ].map((card, i) => (
            <StatCard key={card.label} {...card} index={i} />
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

                    {/* Pipeline progress — same segmented bar as the landing hero */}
                    {!isTerminal(app.status) && (() => {
                      const currentIdx = getStageIndex(app.status)
                      const next = PIPELINE_STAGES[currentIdx + 1]
                      return (
                        <div className="mb-5 rounded-lg bg-subtle ring-1 ring-inset ring-line px-4 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2.5 text-xs">
                            <span className="font-semibold text-fg">
                              Stage {currentIdx + 1} of {PIPELINE_STAGES.length}
                              <span className="text-fg-faint"> · </span>
                              <span className="text-brand-600">{STATUS_LABELS[app.status]}</span>
                            </span>
                            {next && (
                              <span className="text-fg-subtle">Next: {STATUS_LABELS[next]}</span>
                            )}
                          </div>
                          <ol className="flex items-center gap-1" aria-label="Application progress">
                            {PIPELINE_STAGES.map((stage, idx) => (
                              <li
                                key={stage}
                                title={STATUS_LABELS[stage]}
                                aria-current={idx === currentIdx ? 'step' : undefined}
                                className={`h-1.5 flex-1 rounded-full transition-colors
                                  ${idx <= currentIdx ? 'bg-brand-600' : 'bg-line'}`}
                              >
                                <span className="sr-only">{STATUS_LABELS[stage]}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )
                    })()}

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
