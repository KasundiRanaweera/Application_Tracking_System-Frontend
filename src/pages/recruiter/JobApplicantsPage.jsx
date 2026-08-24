import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { StatusBadge } from '../../components/ui/Badge'
import { getOpenJobById } from '../../api/jobsApi'
import { getJobApplications } from '../../api/applicationsApi'
import { STATUS_LABELS } from '../../utils/pipelineRules'

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

  // Wrapped setter so changing the status filter also resets the page —
  // this replaces resetting page via a separate useEffect, which React's
  // docs recommend avoiding since we already control every place the
  // filter changes (the status tabs below).
  const setStatusFilter = (v) => { setStatusFilterRaw(v); setPage(0) }

  const pageSize = 20

  // Load job info once — setJob runs inside the .then() callback, not
  // synchronously in the effect body, so this one is fine as-is.
  useEffect(() => {
    getOpenJobById(id)
      .then(res => setJob(res.data))
      .catch(() => {})
  }, [id])

  const fetchApps = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page, size: pageSize,
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
  }, [id, page, statusFilter])

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
    if (!rating) return <span className="text-xs text-[#94a3b8]">—</span>
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i <= rating
              ? 'text-amber-400' : 'text-[#e2e8f0]'}`}
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
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b]
            hover:text-indigo-600 mb-3 transition-colors font-medium group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Jobs
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start
          justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">
              {job ? job.title : 'Applicants'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1
              text-sm text-[#64748b]">
              {job?.location && (
                <span className="flex items-center gap-1">
                  📍 {job.location}
                </span>
              )}
              {job?.workMode && (
                <span className="flex items-center gap-1">
                  🌐 {job.workMode}
                </span>
              )}
              <span className="text-indigo-600 font-semibold">
                {totalElements} applicant{totalElements !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',     value: counts.all,       color: 'text-[#0f172a]', bg: 'bg-[#f7f9fb]' },
            { label: 'Interview', value: counts.interview,  color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Offer',     value: counts.offer,      color: 'text-amber-600', bg: 'bg-amber-50'  },
            { label: 'Hired',     value: counts.hired,      color: 'text-emerald-600', bg: 'bg-emerald-50'},
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white border border-[#e2e8f0] rounded-xl
                p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 ${bg} rounded-lg flex-shrink-0`}/>
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
              flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold
              transition-all whitespace-nowrap
              ${statusFilter === value
                ? 'bg-indigo-600 text-white'
                : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f7f9fb]'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <Spinner />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6
          text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchApps}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <EmptyState
          icon="👥"
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
          <div className="bg-white border border-[#e2e8f0] rounded-xl
            overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3
              bg-[#f7f9fb] border-b border-[#e2e8f0] text-xs font-bold
              text-[#64748b] uppercase tracking-wider">
              <div className="col-span-4">Candidate</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Applied</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2
                    sm:gap-4 px-5 py-4 hover:bg-[#f7f9fb] transition-colors
                    items-center group"
                >
                  {/* Candidate */}
                  <div className="sm:col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100
                      flex items-center justify-center text-indigo-600
                      font-bold text-sm flex-shrink-0">
                      {app.candidateName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a]
                        truncate group-hover:text-indigo-600 transition-colors">
                        {app.candidateName}
                      </p>
                      <p className="text-xs text-[#64748b] truncate">
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
                  <div className="sm:col-span-2 text-xs text-[#64748b]">
                    {formatDate(app.appliedAt)}
                  </div>

                  {/* Action */}
                  <div className="sm:col-span-2 flex justify-end">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() =>
                        navigate(`/recruiter/applications/${app.id}`)
                      }
                    >
                      Review →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
