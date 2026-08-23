import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getOpenJobs } from '../../api/jobsApi'
import {
  WORK_MODE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from '../../utils/pipelineRules'

const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE']
const EMP_TYPES  = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']

export default function JobsPage() {
  const navigate = useNavigate()

  const [jobs, setJobs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [totalJobs, setTotalJobs]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage]             = useState(0)

  // Filters
  const [search,   setSearch]   = useState('')
  const [workMode, setWorkMode] = useState('')
  const [empType,  setEmpType]  = useState('')
  const [location, setLocation] = useState('')
  const [sort,     setSort]     = useState('createdAt,desc')

  const pageSize = 10

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [sortBy, sortDir] = sort.split(',')
      const params = {
        page, size: pageSize,
        sort: `${sortBy},${sortDir}`,
        ...(search   && { search }),
        ...(workMode && { workMode }),
        ...(empType  && { employmentType: empType }),
        ...(location && { location }),
      }
      const res = await getOpenJobs(params)
      setJobs(res.data.content)
      setTotalJobs(res.data.totalElements)
      setTotalPages(res.data.totalPages)
    } catch {
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [search, workMode, empType, location, sort, page])

  useEffect(() => { fetchJobs() }, [fetchJobs])
  useEffect(() => { setPage(0)  }, [search, workMode, empType, location, sort])

  const clearFilters = () => {
    setSearch('')
    setWorkMode('')
    setEmpType('')
    setLocation('')
    setSort('createdAt,desc')
    setPage(0)
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    const fmt = (n) => `$${Number(n).toLocaleString()}`
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    return `Up to ${fmt(max)}`
  }

  const formatDate = (d) => {
    if (!d) return null
    const diff = Math.floor((new Date() - new Date(d)) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 30)  return `${diff} days ago`
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const hasFilters = search || workMode || empType || location

  // icon per job title first letter
  const getJobIcon = (title = '') => {
    const t = title.toLowerCase()
    if (t.includes('engineer') || t.includes('developer') || t.includes('software'))
      return '💻'
    if (t.includes('design')) return '🎨'
    if (t.includes('data') || t.includes('analyst')) return '📊'
    if (t.includes('product')) return '📱'
    if (t.includes('market')) return '📣'
    return '💼'
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar filters ── */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">

          {/* Filter card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
                Filters
              </h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Work Mode */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-3">
                Work Mode
              </h3>
              <div className="space-y-2.5">
                {WORK_MODES.map((m) => (
                  <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="workMode"
                      checked={workMode === m}
                      onChange={() => setWorkMode(workMode === m ? '' : m)}
                      className="h-4 w-4 text-indigo-600 border-[#c7c4d8]
                        focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-[#191c1e] group-hover:text-indigo-600
                      transition-colors">
                      {WORK_MODE_LABELS[m]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-3">
                Employment Type
              </h3>
              <div className="space-y-2.5">
                {EMP_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="empType"
                      checked={empType === t}
                      onChange={() => setEmpType(empType === t ? '' : t)}
                      className="h-4 w-4 text-indigo-600 border-[#c7c4d8]
                        focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-[#191c1e] group-hover:text-indigo-600
                      transition-colors">
                      {EMPLOYMENT_TYPE_LABELS[t]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-3">
                Location
              </h3>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or region..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#e2e8f0]
                    rounded-lg bg-[#f7f9fb] focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">

          {/* Search + controls */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-5">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-4">
              Open Positions
            </h1>

            {/* Search bar */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5
                  text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title or keywords..."
                  className="w-full pl-11 pr-4 py-3 text-sm border border-[#e2e8f0]
                    rounded-lg bg-white focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:border-transparent shadow-sm"
                />
              </div>
              <Button
                onClick={fetchJobs}
                size="lg"
                className="flex-shrink-0"
              >
                Search
              </Button>
            </div>

            {/* Results row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b]">
                {loading ? 'Loading...' : (
                  <span>
                    Showing{' '}
                    <strong className="text-[#0f172a]">{totalJobs}</strong>
                    {' '}position{totalJobs !== 1 ? 's' : ''}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#64748b] hidden sm:inline">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-[#e2e8f0] rounded-lg py-1.5 pl-3 pr-8
                    bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500
                    text-[#0f172a] cursor-pointer"
                >
                  <option value="createdAt,desc">Newest first</option>
                  <option value="createdAt,asc">Oldest first</option>
                  <option value="title,asc">Title A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* States */}
          {loading && <Spinner />}

          {!loading && error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchJobs}>Try again</Button>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No positions found"
              description={hasFilters
                ? 'Try adjusting your filters or search term.'
                : 'No open positions right now. Check back soon.'}
              action={hasFilters && (
                <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
              )}
            />
          )}

          {/* Job list */}
          {!loading && !error && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="bg-white border border-[#e2e8f0] rounded-xl p-5
                    hover:border-indigo-300 hover:shadow-sm transition-all
                    cursor-pointer group flex gap-4"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 hidden sm:block">
                    <div className="w-12 h-12 bg-[#f7f9fb] border border-[#e2e8f0]
                      rounded-xl flex items-center justify-center text-2xl">
                      {getJobIcon(job.title)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-[#0f172a] text-base
                        group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-xs text-[#64748b] flex-shrink-0 mt-0.5">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Location */}
                    {job.location && (
                      <div className="flex items-center gap-1 text-sm text-[#64748b] mb-3">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        {job.location}
                      </div>
                    )}

                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2">
                      {job.workMode && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1
                          bg-[#f7f9fb] border border-[#e2e8f0] rounded text-xs
                          text-[#464555] font-medium">
                          {job.workMode === 'REMOTE' && '🌐'}
                          {job.workMode === 'HYBRID' && '🏢'}
                          {job.workMode === 'ONSITE' && '📍'}
                          {WORK_MODE_LABELS[job.workMode]}
                        </span>
                      )}
                      {job.employmentType && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1
                          bg-[#f7f9fb] border border-[#e2e8f0] rounded text-xs
                          text-[#464555] font-medium">
                          ⏱ {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                        </span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1
                          bg-emerald-50 border border-emerald-200 rounded text-xs
                          text-emerald-700 font-medium">
                          💰 {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View button */}
                  <div className="flex-shrink-0 hidden sm:flex items-center">
                    <span className="text-xs font-semibold text-indigo-600
                      border border-[#e2e8f0] px-4 py-2 rounded-lg
                      group-hover:border-indigo-300 group-hover:bg-indigo-50
                      transition-all whitespace-nowrap">
                      View Job
                    </span>
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
                <Button variant="secondary" size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}>
                  ← Previous
                </Button>
                <Button variant="secondary" size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}>
                  Next →
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  )
}