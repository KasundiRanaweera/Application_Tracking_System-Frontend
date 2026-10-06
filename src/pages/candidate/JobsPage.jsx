import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import { Pagination, ErrorPanel } from '../../components/ui/ListControls'
import EmptyState from '../../components/ui/EmptyState'
import Icon from '../../components/ui/Icon'
import { getOpenJobs } from '../../api/jobsApi'
import {
  WORK_MODE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from '../../utils/pipelineRules'

const WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE']
const EMP_TYPES  = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']

const WORK_ICONS = { REMOTE: 'globe', HYBRID: 'building', ONSITE: 'mapPin' }

function FilterSection({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold text-fg-subtle uppercase
        tracking-[0.08em] mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FilterOption({ checked, onToggle, children }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={[
        'w-full flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-md text-left text-sm',
        checked ? 'text-fg font-medium' : 'text-fg-muted hover:text-fg hover:bg-subtle',
      ].join(' ')}
    >
      <span className={[
        'w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors',
        checked
          ? 'bg-brand-600 text-white'
          : 'bg-surface ring-1 ring-inset ring-line-strong',
      ].join(' ')}>
        {checked && <Icon name="check" className="w-3 h-3" strokeWidth={3} />}
      </span>
      <span className="inline-flex items-center gap-1.5">{children}</span>
    </button>
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

    const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`
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
    if (t.includes('engineer') || t.includes('developer') || t.includes('software')) return 'laptop'
    if (t.includes('design'))  return 'palette'
    if (t.includes('data') || t.includes('analyst')) return 'chartBar'
    if (t.includes('product')) return 'phone'
    if (t.includes('market'))  return 'megaphone'
    return 'briefcase'
  }

  const hasFilters = search || workMode || empType || locationFilter

  const activeFilters = [
    workMode       && { key: 'workMode',       label: WORK_MODE_LABELS[workMode],         clear: () => setWorkMode('') },
    empType        && { key: 'empType',         label: EMPLOYMENT_TYPE_LABELS[empType],    clear: () => setEmpType('') },
    locationFilter && { key: 'locationFilter',  label: locationFilter,                      clear: () => setLocationFilter('') },
  ].filter(Boolean)

  return (
    <Layout>
      <PageHeader
        title="Open Positions"
        description={loading
          ? 'Loading…'
          : `${totalJobs} position${totalJobs !== 1 ? 's' : ''} available`}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
          <div className="bg-surface rounded-xl border border-line shadow-card p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-bold text-fg">Filters</span>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="text-xs font-semibold text-brand-600 hover:underline underline-offset-4">
                  Clear all
                </button>
              )}
            </div>

            <FilterSection title="Work Mode">
              <div className="space-y-0.5">
                {WORK_MODES.map(m => (
                  <FilterOption
                    key={m}
                    checked={workMode === m}
                    onToggle={() => setWorkMode(workMode === m ? '' : m)}
                  >
                    <Icon name={WORK_ICONS[m]} className="w-3.5 h-3.5 text-fg-faint" strokeWidth={1.8} />
                    {WORK_MODE_LABELS[m]}
                  </FilterOption>
                ))}
              </div>
            </FilterSection>

            <div className="h-px bg-line my-5" />

            <FilterSection title="Employment Type">
              <div className="space-y-0.5">
                {EMP_TYPES.map(t => (
                  <FilterOption
                    key={t}
                    checked={empType === t}
                    onToggle={() => setEmpType(empType === t ? '' : t)}
                  >
                    {EMPLOYMENT_TYPE_LABELS[t]}
                  </FilterOption>
                ))}
              </div>
            </FilterSection>

            <div className="h-px bg-line my-5" />

            <FilterSection title="Location">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none">
                  <Icon name="mapPin" className="w-3.5 h-3.5" strokeWidth={2} />
                </span>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  placeholder="City or country..."
                  aria-label="Filter by location"
                  className="w-full h-9 pl-8 pr-3 text-sm text-fg border border-line rounded-lg bg-surface
                    shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-500/15
                    focus:border-brand-500 placeholder-fg-faint hover:border-line-strong"
                />
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 w-full">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none">
                  <Icon name="search" className="w-4 h-4" strokeWidth={2} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchJobs()}
                  placeholder="Search by job title or keyword…"
                  aria-label="Search jobs"
                  className="w-full h-10 pl-10 pr-4 text-sm text-fg border border-line rounded-lg bg-surface
                    shadow-xs focus:outline-none focus:ring-4 focus:ring-brand-500/15
                    focus:border-brand-500 placeholder-fg-faint hover:border-line-strong"
                />
              </div>
              <Button onClick={fetchJobs} size="lg">
                Search
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="jobs-sort" className="text-[13px] text-fg-subtle whitespace-nowrap">
                Sort by
              </label>
              <select
                id="jobs-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="h-10 text-[13px] font-medium border border-line rounded-lg
                  pl-3 pr-8 bg-surface shadow-xs focus:outline-none
                  focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500
                  text-fg cursor-pointer hover:border-line-strong"
              >
                <option value="createdAt,desc">Newest first</option>
                <option value="createdAt,asc">Oldest first</option>
                <option value="title,asc">Title A–Z</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-fg-subtle">Filtered by:</span>
              {activeFilters.map(f => (
                <span key={f.key}
                  className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5
                    bg-brand-50 text-brand-700 text-xs font-medium
                    rounded-full ring-1 ring-inset ring-brand-200">
                  {f.label}
                  <button onClick={f.clear}
                    aria-label={`Remove ${f.label} filter`}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-brand-100">
                    <Icon name="xMark" className="w-3 h-3" strokeWidth={2.2} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-4">
            {/* States */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-busy="true" aria-label="Loading">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-surface border border-line rounded-xl shadow-card p-5 h-[264px]">
                    <div className="w-11 h-11 rounded-xl bg-muted animate-pulse mb-5" />
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse mb-2" />
                    <div className="h-3 w-1/3 rounded bg-muted animate-pulse mb-6" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 rounded-md bg-muted animate-pulse" />
                      <div className="h-6 w-20 rounded-md bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <ErrorPanel message={error} onRetry={fetchJobs} />
            )}

            {!loading && !error && jobs.length === 0 && (
              <EmptyState
                icon="search"
                title="No positions found"
                description={hasFilters
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No open positions right now. Check back soon.'}
                action={hasFilters && (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              />
            )}

            {/* Job list */}
            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
                  gap-4">
                  {jobs.map((job, i) => (
                    <article
                      key={job.id}
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      onKeyDown={e => e.key === 'Enter' && navigate(`/jobs/${job.id}`)}
                      className="group bg-surface border border-line rounded-xl shadow-card
                        p-5 flex flex-col cursor-pointer animate-fade-up
                        hover:border-line-strong hover:shadow-pop hover:-translate-y-0.5
                        transition-[border-color,box-shadow,transform] duration-200
                        focus-visible:ring-2 focus-visible:ring-brand-500"
                      style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex w-11 h-11 rounded-xl
                          bg-brand-50 ring-1 ring-inset ring-brand-100 items-center
                          justify-center text-brand-600 flex-shrink-0">
                          <Icon name={getJobIcon(job.title)} className="w-5 h-5" strokeWidth={1.7} />
                        </div>
                        <span className="text-[11px] font-medium text-fg-faint
                          whitespace-nowrap pt-1">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 mt-4">
                        <h3 className="font-bold text-fg text-[15px] tracking-tight
                          leading-snug group-hover:text-brand-600 transition-colors
                          line-clamp-2">
                          {job.title}
                        </h3>

                        {job.location && (
                          <p className="text-[13px] text-fg-subtle mt-1.5
                            flex items-center gap-1.5">
                            <Icon name="mapPin" className="w-3.5 h-3.5 text-fg-faint" strokeWidth={2} />
                            {job.location}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-4">
                          {job.workMode && (
                            <span className="inline-flex items-center gap-1
                              px-2 py-0.5 bg-muted rounded-md text-xs
                              font-medium text-fg-muted">
                              <Icon name={WORK_ICONS[job.workMode]} className="w-3 h-3" strokeWidth={1.8} />
                              {WORK_MODE_LABELS[job.workMode]}
                            </span>
                          )}
                          {job.employmentType && (
                            <span className="inline-flex items-center px-2
                              py-0.5 bg-muted rounded-md text-xs font-medium
                              text-fg-muted">
                              {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-3 mt-5 pt-4
                        border-t border-line">
                        <span className="text-[13px] font-semibold text-fg truncate">
                          {formatSalary(job.salaryMin, job.salaryMax) || (
                            <span className="font-normal text-fg-faint">Salary not listed</span>
                          )}
                        </span>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                          bg-muted text-fg-subtle group-hover:bg-ink group-hover:text-on-ink transition-colors">
                          <Icon name="arrowRight" className="w-3.5 h-3.5" strokeWidth={2} />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPrev={() => setPage(p => p - 1)}
                  onNext={() => setPage(p => p + 1)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
