import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'
import { RowListSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import Icon from '../../components/ui/Icon'
import { JobStatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import { SearchInput, FilterTabs, Pagination, ErrorPanel } from '../../components/ui/ListControls'
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
  const location = useLocation()

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
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  )

  useEffect(() => {
    if (!location.state?.successMessage) return
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate])

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
      setSuccessMessage('Job deleted successfully.')
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
      setSuccessMessage(
        newStatus === 'OPEN'
          ? 'Job published successfully.'
          : 'Job closed successfully.'
      )
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
    if (current === 'DRAFT')  return 'Publish'
    if (current === 'OPEN')   return 'Close'
    return null
  }

  return (
    <Layout>
      <PageHeader
        title="My Jobs"
        description={loading ? 'Loading…' : `${totalJobs} job${totalJobs !== 1 ? 's' : ''} total`}
        actions={
          <Button onClick={() => navigate('/recruiter/jobs/create')}>
            <Icon name="plus" className="w-4 h-4" strokeWidth={2.2} />
            Post New Job
          </Button>
        }
      />

      {successMessage && (
        <div className="mb-5">
          <Alert type="success" message={successMessage} />
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title..."
        />
        <FilterTabs
          options={STATUS_FILTERS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {/* States */}
      {loading && <RowListSkeleton />}

      {!loading && error && (
        <ErrorPanel message={error} onRetry={fetchJobs} />
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          icon="briefcase"
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
          <div className="bg-surface border border-line rounded-xl shadow-card
            overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-2.5
              bg-subtle border-b border-line text-[11px] font-semibold
              text-fg-subtle uppercase tracking-wider">
              <div className="col-span-5">Job Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Posted</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-line">
              {jobs.map((job) => (
                <div key={job.id} className="relative">

                  {/* Delete confirm overlay */}
                  {confirmDelete === job.id && (
                    <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-10
                      flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5
                      animate-fade-up">
                      <p className="text-sm text-fg flex items-center gap-2">
                        <Icon name="warning" className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>Delete <strong>{job.title}</strong>? This cannot be undone.</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3
                    sm:gap-4 px-5 py-4 hover:bg-subtle transition-colors
                    items-center">

                    {/* Title */}
                    <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100
                        rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="briefcase" className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}
                          className="font-semibold text-fg text-sm truncate block max-w-full
                            text-left hover:text-brand-600"
                        >
                          {job.title}
                        </button>
                        <div className="flex flex-wrap items-center gap-1.5
                          mt-0.5 text-xs text-fg-subtle">
                          {job.workMode && (
                            <span>{WORK_MODE_LABELS[job.workMode]}</span>
                          )}
                          {job.workMode && job.employmentType && (
                            <span className="text-fg-faint">·</span>
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
                    <div className="sm:col-span-2 text-[13px] text-fg-subtle tabular-nums">
                      {formatDate(job.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-3 flex items-center
                      sm:justify-end gap-1.5 flex-wrap">

                      {/* View applicants */}
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() =>
                          navigate(`/recruiter/jobs/${job.id}/applicants`)
                        }
                      >
                        <Icon name="users" className="w-3.5 h-3.5" />
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
                          className="!text-brand-600 dark:!text-brand-300 hover:!bg-brand-50"
                        >
                          {nextStatusLabel(job.status)}
                        </Button>
                      )}

                      {/* Status transition — OPEN → CLOSED (with confirm) */}
                      {job.status === 'OPEN' && (
                        confirmClose === job.id ? (
                          <div className="flex items-center gap-1 pl-1">
                            <span className="text-xs font-medium text-fg-subtle mr-0.5">Close?</span>
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
                          >
                            {nextStatusLabel(job.status)}
                          </Button>
                        )
                      )}

                      {/* Delete — only DRAFT */}
                      {job.status === 'DRAFT' && (
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setConfirmDelete(job.id)}
                          className="!text-red-600 dark:!text-red-400 hover:!bg-red-50"
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
