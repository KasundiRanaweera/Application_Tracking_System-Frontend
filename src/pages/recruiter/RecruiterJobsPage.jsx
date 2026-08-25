import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { JobStatusBadge } from '../../components/ui/Badge'
import {
  getRecruiterJobs,
  deleteJob,
  changeJobStatus,
} from '../../api/jobsApi'
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from '../../utils/pipelineRules'

const STATUS_FILTERS = [
  { value: '',       label: 'All Jobs' },
  { value: 'OPEN',   label: 'Open'     },
  { value: 'DRAFT',  label: 'Draft'    },
  { value: 'CLOSED', label: 'Closed'   },
]

export default function RecruiterJobsPage() {
  const navigate = useNavigate()

  const [jobs, setJobs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [totalJobs, setTotalJobs]   = useState(0)
  const [page, setPage]             = useState(0)
  const [statusFilter, setStatusFilterRaw] = useState('')
  const [search, setSearchRaw]      = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [confirmClose, setConfirmClose] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [statusChanging, setStatusChanging] = useState(null)

  // Wrapped setters so changing either filter also resets the page —
  // this replaces resetting page via a separate useEffect, which React's
  // docs recommend avoiding since we already control every place these
  // filters change (the search input and status tabs below).
  const setStatusFilter = (v) => { setStatusFilterRaw(v); setPage(0) }
  const setSearch = (v) => { setSearchRaw(v); setPage(0) }

  const pageSize = 10

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page, size: pageSize,
        ...(search       && { search }),
        ...(statusFilter && { status: statusFilter }),
      }
      const res = await getRecruiterJobs(params)
      setJobs(res.data.content)
      setTotalJobs(res.data.totalElements)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  // Data-fetching effect: fetchJobs() sets loading/error/data state,
  // matching React's documented fetch-on-mount/dependency-change pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchJobs()
  }, [fetchJobs])

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteJob(id)
      setConfirmDelete(null)
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    setStatusChanging(id)
    try {
      await changeJobStatus(id, newStatus)
      fetchJobs()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to change status.')
    } finally {
      setStatusChanging(null)
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const nextStatus = (current) => {
    if (current === 'DRAFT')  return 'OPEN'
    if (current === 'OPEN')   return 'CLOSED'
    return null
  }

  const nextStatusLabel = (current) => {
    if (current === 'DRAFT')  return '→ Publish'
    if (current === 'OPEN')   return '→ Close'
    return null
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Jobs</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {loading ? 'Loading...' : `${totalJobs} job${totalJobs !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <Button
          onClick={() => navigate('/recruiter/jobs/create')}
          className="flex-shrink-0"
        >
          + Post New Job
        </Button>
      </div>

      {/* Search + filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2
              w-4 h-4 text-[#64748b]" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs by title..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border
                border-[#e2e8f0] rounded-lg focus:outline-none
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all
                ${statusFilter === value
                  ? 'bg-indigo-600 text-white'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f7f9fb]'}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && <Spinner />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6
          text-center">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchJobs}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          icon="💼"
          title="No jobs found"
          description={
            statusFilter
              ? `No ${statusFilter.toLowerCase()} jobs.`
              : 'Post your first job to get started.'
          }
          action={
            <Button onClick={() => navigate('/recruiter/jobs/create')}>
              Post a Job
            </Button>
          }
        />
      )}

      {/* Jobs table */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="bg-white border border-[#e2e8f0] rounded-xl
            overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3
              bg-[#f7f9fb] border-b border-[#e2e8f0] text-xs font-bold
              text-[#64748b] uppercase tracking-wider">
              <div className="col-span-5">Job Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Posted</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#e2e8f0]">
              {jobs.map((job) => (
                <div key={job.id} className="relative">

                  {/* Delete confirm overlay */}
                  {confirmDelete === job.id && (
                    <div className="absolute inset-0 bg-white/97 z-10
                      flex items-center justify-center gap-4 border-b
                      border-[#e2e8f0] px-5">
                      <p className="text-sm text-[#0f172a]">
                        Delete <strong>{job.title}</strong>? This cannot be undone.
                      </p>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="danger"
                          size="sm"
                          loading={deletingId === job.id}
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2
                    sm:gap-4 px-5 py-4 hover:bg-[#f7f9fb] transition-colors
                    items-center">

                    {/* Title */}
                    <div className="sm:col-span-5 flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#f2f4f6] rounded-lg
                        flex items-center justify-center text-sm flex-shrink-0">
                        💼
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f172a] text-sm
                          truncate">
                          {job.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2
                          mt-0.5 text-xs text-[#64748b]">
                          {job.workMode && (
                            <span>{WORK_MODE_LABELS[job.workMode]}</span>
                          )}
                          {job.workMode && job.employmentType && (
                            <span>·</span>
                          )}
                          {job.employmentType && (
                            <span>
                              {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="sm:col-span-2">
                      <JobStatusBadge status={job.status} />
                    </div>

                    {/* Date */}
                    <div className="sm:col-span-2 text-xs text-[#64748b]">
                      {formatDate(job.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-3 flex items-center
                      justify-end gap-2 flex-wrap">

                      {/* View applicants */}
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() =>
                          navigate(`/recruiter/jobs/${job.id}/applicants`)
                        }
                      >
                        Applicants
                      </Button>

                      {/* Edit — only DRAFT */}
                      {job.status === 'DRAFT' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() =>
                            navigate(`/recruiter/jobs/${job.id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                      )}

                      {/* Status transition — DRAFT → OPEN (one-click) */}
                      {job.status === 'DRAFT' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          loading={statusChanging === job.id}
                          onClick={() =>
                            handleStatusChange(job.id, nextStatus(job.status))
                          }
                          className="text-indigo-600 hover:bg-indigo-50"
                        >
                          {nextStatusLabel(job.status)}
                        </Button>
                      )}

                      {/* Status transition — OPEN → CLOSED (with confirm) */}
                      {job.status === 'OPEN' && (
                        confirmClose === job.id ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#64748b]">Close?</span>
                            <Button
                              variant="danger"
                              size="xs"
                              loading={statusChanging === job.id}
                              onClick={() => {
                                handleStatusChange(job.id, 'CLOSED')
                                setConfirmClose(null)
                              }}
                            >
                              Yes
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setConfirmClose(null)}
                            >
                              No
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => setConfirmClose(job.id)}
                            className="text-indigo-600 hover:bg-indigo-50"
                          >
                            → Close
                          </Button>
                        )
                      )}

                      {/* Delete — only DRAFT */}
                      {job.status === 'DRAFT' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setConfirmDelete(job.id)}
                          className="text-red-400 hover:text-red-600
                            hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
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
