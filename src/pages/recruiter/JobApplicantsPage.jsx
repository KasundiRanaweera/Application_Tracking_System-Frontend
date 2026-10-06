import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import { RowListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Icon from '../../components/ui/Icon'
import { StatusBadge } from '../../components/ui/Badge'
import { getRecruiterJobs } from '../../api/jobsApi'
import { getJobApplications } from '../../api/applicationsApi'
import { STATUS_LABELS, WORK_MODE_LABELS } from '../../utils/pipelineRules'
import PageHeader, { BackLink } from '../../components/ui/PageHeader'
import { FilterTabs, Pagination, ErrorPanel } from '../../components/ui/ListControls'

const STATUS_FILTERS = [
  { value: '',             label: 'All'          },
  { value: 'APPLIED',      label: 'Applied'      },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED',  label: 'Shortlisted'  },
  { value: 'INTERVIEW',    label: 'Interview'     },
  { value: 'OFFER',        label: 'Offer'         },
  { value: 'HIRED',        label: 'Hired'         },
  { value: 'REJECTED',     label: 'Rejected'      },
  { value: 'WITHDRAWN',    label: 'Withdrawn'     },
]

export default function JobApplicantsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob]                   = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages]     = useState(0)
  const [statusFilter, setStatusFilterRaw] = useState('')
  const [page, setPage]                 = useState(0)
  const [sort, setSortRaw]              = useState('appliedAt,desc')

  // Wrapped setters so changing a filter also resets the page —
  // this replaces resetting page via a separate useEffect, which React's
  // docs recommend avoiding since we already control every place the
  // filter changes (the status tabs / sort dropdown below).
  const setStatusFilter = (v) => { setStatusFilterRaw(v); setPage(0) }
  const setSort = (v) => { setSortRaw(v); setPage(0) }

  const pageSize = 20

  // Load job info once — setJob runs inside the .then() callback, not
  // synchronously in the effect body, so this one is fine as-is.
  useEffect(() => {
    getRecruiterJobs({ size: 100 })
      .then(res => {
        const recruiterJob = (res.data.content || [])
          .find(item => item.id === Number(id))
        setJob(recruiterJob || null)
      })
      .catch(() => {})
  }, [id])

  const fetchApps = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page, size: pageSize,
        sort,
        ...(statusFilter && { status: statusFilter }),
      }
      const res = await getJobApplications(id, params)
      setApplications(res.data.content)
      setTotalElements(res.data.totalElements)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load applicants.')
    } finally {
      setLoading(false)
    }
  }, [id, page, statusFilter, sort])

  // Data-fetching effect: fetchApps() sets loading/error/data state,
  // matching React's documented fetch-on-mount/dependency-change pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchApps()
  }, [fetchApps])

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const renderStars = (rating) => {
    if (!rating) return <span className="text-xs text-fg-faint">—</span>
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i <= rating
              ? 'text-amber-400' : 'text-line-strong'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
              l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
    )
  }

  // Count per status for stats row
  const counts = {
    all:         totalElements,
    interview:   applications.filter(a => a.status === 'INTERVIEW').length,
    offer:       applications.filter(a => a.status === 'OFFER').length,
    hired:       applications.filter(a => a.status === 'HIRED').length,
  }

  return (
    <Layout>
      <PageHeader
        eyebrow={<BackLink onClick={() => navigate('/recruiter/jobs')}>Back to Jobs</BackLink>}
        title={job ? job.title : 'Applicants'}
        description={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {job?.location && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="mapPin" className="w-3.5 h-3.5 text-fg-faint" strokeWidth={2} />
                {job.location}
              </span>
            )}
            {job?.workMode && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="globe" className="w-3.5 h-3.5 text-fg-faint" strokeWidth={2} />
                {WORK_MODE_LABELS[job.workMode] ?? job.workMode}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-fg font-semibold">
              <Icon name="users" className="w-3.5 h-3.5 text-brand-600" strokeWidth={2} />
              {totalElements} applicant{totalElements !== 1 ? 's' : ''}
            </span>
          </span>
        }
      />

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',     value: counts.all,       icon: 'users',       tone: 'bg-muted text-fg-subtle ring-line' },
            { label: 'Interview', value: counts.interview, icon: 'chatBubble',  tone: 'bg-brand-50 text-brand-600 ring-brand-100' },
            { label: 'Offer',     value: counts.offer,     icon: 'mail',        tone: 'bg-amber-50 text-amber-600 ring-amber-100' },
            { label: 'Hired',     value: counts.hired,     icon: 'checkCircle', tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100' },
          ].map(({ label, value, icon, tone }, i) => (
            <div
              key={label}
              className="bg-surface border border-line rounded-xl shadow-card
                p-4 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-9 h-9 rounded-lg ring-1 ring-inset flex-shrink-0
                flex items-center justify-center ${tone}`}>
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

      {/* Filters + sort */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <FilterTabs
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
          className="lg:flex-1 lg:max-w-fit"
        />
        <div className="lg:ml-auto flex items-center gap-2">
          <label htmlFor="applicant-sort" className="text-[13px] text-fg-subtle whitespace-nowrap">
            Sort by
          </label>
          <select
            id="applicant-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 text-[13px] font-medium border border-line rounded-lg pl-3
              pr-8 bg-surface text-fg shadow-xs cursor-pointer hover:border-line-strong
              focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500"
          >
            <option value="appliedAt,desc">Newest first</option>
            <option value="appliedAt,asc">Oldest first</option>
            <option value="rating,desc">Highest rated</option>
          </select>
        </div>
      </div>

      {/* States */}
      {loading && <RowListSkeleton />}

      {!loading && error && (
        <ErrorPanel message={error} onRetry={fetchApps} />
      )}

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          icon="users"
          title="No applicants found"
          description={
            statusFilter
              ? `No applicants with status "${STATUS_LABELS[statusFilter]}".`
              : 'No one has applied to this job yet.'
          }
        />
      )}

      {/* Applicants table */}
      {!loading && !error && applications.length > 0 && (
        <>
          <div className="bg-surface border border-line rounded-xl shadow-card
            overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-2.5
              bg-subtle border-b border-line text-[11px] font-semibold
              text-fg-subtle uppercase tracking-wider">
              <div className="col-span-4">Candidate</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Applied</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="divide-y divide-line">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3
                    sm:gap-4 px-5 py-4 hover:bg-subtle transition-colors
                    items-center group"
                >
                  {/* Candidate */}
                  <div className="sm:col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700
                      flex items-center justify-center text-white
                      font-semibold text-sm flex-shrink-0 ring-2 ring-surface">
                      {app.candidateName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg
                        truncate group-hover:text-brand-600 transition-colors">
                        {app.candidateName}
                      </p>
                      <p className="text-xs text-fg-subtle truncate">
                        {app.candidateEmail}
                      </p>
                    </div>
                  </div>

                  {/* Stage */}
                  <div className="sm:col-span-2">
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Rating */}
                  <div className="sm:col-span-2">
                    {renderStars(app.rating)}
                  </div>

                  {/* Date */}
                  <div className="sm:col-span-2 text-[13px] text-fg-subtle tabular-nums">
                    {formatDate(app.appliedAt)}
                  </div>

                  {/* Action */}
                  <div className="sm:col-span-2 flex sm:justify-end">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() =>
                        navigate(`/recruiter/applications/${app.id}`)
                      }
                    >
                      Review
                      <Icon name="arrowRight" className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage(p => p - 1)}
            onNext={() => setPage(p => p + 1)}
          />
        </>
      )}
    </Layout>
  )
}
