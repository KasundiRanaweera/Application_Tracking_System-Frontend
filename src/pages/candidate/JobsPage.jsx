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

const WORK_ICONS = { REMOTE: '🌐', HYBRID: '🏢', ONSITE: '📍' }

function FilterSection({ title, children }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase
        tracking-[0.08em] mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function JobsPage() {
  const navigate = useNavigate()

  const [jobs, setJobs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [totalJobs, setTotalJobs]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage]             = useState(0)

  const [search,         setSearchRaw]         = useState('')
  const [workMode,       setWorkModeRaw]       = useState('')
  const [empType,        setEmpTypeRaw]        = useState('')
  const [locationFilter, setLocationFilterRaw] = useState('')
  const [sort,           setSortRaw]           = useState('createdAt,desc')

  const setSearch         = (v) => { setSearchRaw(v);         setPage(0) }
  const setWorkMode       = (v) => { setWorkModeRaw(v);       setPage(0) }
  const setEmpType        = (v) => { setEmpTypeRaw(v);        setPage(0) }
  const setLocationFilter = (v) => { setLocationFilterRaw(v); setPage(0) }
  const setSort           = (v) => { setSortRaw(v);           setPage(0) }

  const pageSize = 10

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [sortBy, sortDir] = sort.split(',')
      const params = {
        page, size: pageSize,
        sort: `${sortBy},${sortDir}`,
        ...(search         && { search }),
        ...(workMode       && { workMode }),
        ...(empType        && { employmentType: empType }),
        ...(locationFilter && { location: locationFilter }),
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
  }, [search, workMode, empType, locationFilter, sort, page])

  // Data-fetching effect: fetchJobs() sets loading/error/data state,
  // matching React's documented fetch-on-mount/dependency-change pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchJobs()
  }, [fetchJobs])

  const clearFilters = () => {
    setSearchRaw('')
    setWorkModeRaw('')
    setEmpTypeRaw('')
    setLocationFilterRaw('')
    setSortRaw('createdAt,desc')
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
    if (diff < 30)  return `${diff}d ago`
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getJobIcon = (title = '') => {
    const t = title.toLowerCase()
    if (t.includes('engineer') || t.includes('developer') || t.includes('software')) return '💻'
    if (t.includes('design'))  return '🎨'
    if (t.includes('data') || t.includes('analyst')) return '📊'
    if (t.includes('product')) return '📱'
    if (t.includes('market'))  return '📣'
    return '💼'
  }

  const hasFilters = search || workMode || empType || locationFilter

  const activeFilters = [
    workMode       && { key: 'workMode',       label: WORK_MODE_LABELS[workMode],         clear: () => setWorkMode('') },
    empType        && { key: 'empType',         label: EMPLOYMENT_TYPE_LABELS[empType],    clear: () => setEmpType('') },
    locationFilter && { key: 'locationFilter',  label: `📍 ${locationFilter}`,             clear: () => setLocationFilter('') },
  ].filter(Boolean)

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200
            shadow-sm p-5 sticky top-20">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-bold text-slate-800">Filters</span>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="text-xs font-semibold text-indigo-600
                    hover:text-indigo-700 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            <FilterSection title="Work Mode">
              <div className="space-y-2">
                {WORK_MODES.map(m => (
                  <label key={m}
                    className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => setWorkMode(workMode === m ? '' : m)}
                      className={[
                        'w-4 h-4 rounded border-2 flex items-center justify-center',
                        'transition-all cursor-pointer flex-shrink-0',
                        workMode === m
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-slate-300 hover:border-indigo-400',
                      ].join(' ')}
                    >
                      {workMode === m && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10"
                          fill="currentColor">
                          <path d="M8.5 2L4 7 1.5 4.5"/>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="1.5" stroke="currentColor" fill="none"
                            d="M8.5 2L4 7 1.5 4.5"/>
                        </svg>
                      )}
                    </div>
                    <span className={[
                      'text-sm transition-colors select-none',
                      workMode === m
                        ? 'text-indigo-700 font-semibold'
                        : 'text-slate-600 group-hover:text-slate-900',
                    ].join(' ')}>
                      {WORK_ICONS[m]} {WORK_MODE_LABELS[m]}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <div className="h-px bg-slate-100 my-5" />

            <FilterSection title="Employment Type">
              <div className="space-y-2">
                {EMP_TYPES.map(t => (
                  <label key={t}
                    className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => setEmpType(empType === t ? '' : t)}
                      className={[
                        'w-4 h-4 rounded border-2 flex items-center justify-center',
                        'transition-all cursor-pointer flex-shrink-0',
                        empType === t
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-slate-300 hover:border-indigo-400',
                      ].join(' ')}
                    >
                      {empType === t && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="1.5" stroke="currentColor" fill="none"
                            d="M8.5 2L4 7 1.5 4.5"/>
                        </svg>
                      )}
                    </div>
                    <span className={[
                      'text-sm transition-colors select-none',
                      empType === t
                        ? 'text-indigo-700 font-semibold'
                        : 'text-slate-600 group-hover:text-slate-900',
                    ].join(' ')}>
                      {EMPLOYMENT_TYPE_LABELS[t]}
                    </span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <div className="h-px bg-slate-100 my-5" />

            <FilterSection title="Location">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2
                  w-3.5 h-3.5 text-slate-400" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0
                      01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  placeholder="City or country..."
                  className="w-full pl-8 pr-3 py-2 text-sm border
                    border-slate-200 rounded-lg bg-slate-50
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                    focus:border-indigo-500 placeholder-slate-400
                    hover:border-slate-300"
                />
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">

          {/* Top bar */}
          <div className="bg-white rounded-xl border border-slate-200
            shadow-sm p-5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center
              justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-black text-slate-900
                  tracking-tight">
                  Open Positions
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {loading
                    ? 'Loading…'
                    : `${totalJobs} position${totalJobs !== 1 ? 's' : ''} available`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:block">
                  Sort by
                </span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg
                    py-2 pl-3 pr-7 bg-white focus:outline-none
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                    text-slate-700 cursor-pointer hover:border-slate-300"
                >
                  <option value="createdAt,desc">Newest first</option>
                  <option value="createdAt,asc">Oldest first</option>
                  <option value="title,asc">Title A–Z</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2
                  w-4 h-4 text-slate-400" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                  placeholder="Search by job title or keyword…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border
                    border-slate-200 rounded-lg bg-white
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                    focus:border-indigo-500 placeholder-slate-400
                    hover:border-slate-300"
                />
              </div>
              <Button onClick={fetchJobs} size="md">
                Search
              </Button>
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3
                border-t border-slate-100">
                {activeFilters.map(f => (
                  <span key={f.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1
                      bg-indigo-50 text-indigo-700 text-xs font-semibold
                      rounded-full border border-indigo-200">
                    {f.label}
                    <button onClick={f.clear}
                      className="hover:text-indigo-900 font-bold leading-none">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* States */}
          {loading && <Spinner />}

          {!loading && error && (
            <div className="bg-red-50 border border-red-100 rounded-xl
              p-6 text-center">
              <p className="text-red-600 text-sm mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchJobs}>
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No positions found"
              description={hasFilters
                ? 'Try adjusting your search or filter criteria.'
                : 'No open positions right now. Check back soon.'}
              action={hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            />
          )}

          {/* Job list */}
          {!loading && !error && jobs.length > 0 && (
            <>
              <div className="space-y-2.5">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white border border-slate-200 rounded-xl
                      p-4 flex gap-4 items-center cursor-pointer
                      hover:border-indigo-300 hover:shadow-md
                      hover:shadow-indigo-50 transition-all duration-200
                      group"
                  >
                    {/* Icon */}
                    <div className="hidden sm:flex w-12 h-12 rounded-xl
                      bg-slate-50 border border-slate-200 items-center
                      justify-center text-2xl flex-shrink-0
                      group-hover:bg-indigo-50 group-hover:border-indigo-200
                      transition-colors">
                      {getJobIcon(job.title)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between
                        gap-3 mb-1.5">
                        <h3 className="font-bold text-slate-900 text-[15px]
                          leading-tight group-hover:text-indigo-600
                          transition-colors truncate">
                          {job.title}
                        </h3>
                        <span className="text-xs text-slate-400 flex-shrink-0
                          mt-0.5">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>

                      {job.location && (
                        <p className="text-xs text-slate-400 mb-2.5
                          flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0
                                01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          </svg>
                          {job.location}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5">
                        {job.workMode && (
                          <span className="inline-flex items-center gap-1
                            px-2 py-0.5 bg-slate-100 rounded text-xs
                            font-medium text-slate-600">
                            {WORK_ICONS[job.workMode]}
                            {WORK_MODE_LABELS[job.workMode]}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="inline-flex items-center px-2
                            py-0.5 bg-slate-100 rounded text-xs font-medium
                            text-slate-600">
                            {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                          </span>
                        )}
                        {formatSalary(job.salaryMin, job.salaryMax) && (
                          <span className="inline-flex items-center px-2
                            py-0.5 bg-emerald-50 rounded text-xs font-semibold
                            text-emerald-700">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="hidden sm:block flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-600
                        border border-indigo-200 px-3.5 py-1.5 rounded-lg
                        group-hover:bg-indigo-600 group-hover:text-white
                        group-hover:border-indigo-600 transition-all
                        whitespace-nowrap">
                        View →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6
                  pt-5 border-t border-slate-200">
                  <p className="text-sm text-slate-400">
                    Page <strong className="text-slate-700">{page + 1}</strong>
                    {' '}of {totalPages}
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
            </>
          )}
        </main>
      </div>
    </Layout>
  )
}
