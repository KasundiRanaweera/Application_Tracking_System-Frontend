// src/pages/recruiter/RecruiterDashboardPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import { RowListSkeleton } from '../../components/ui/Skeleton'
import { JobStatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/ui/PageHeader'
import Icon from '../../components/ui/Icon'
import { getRecruiterJobs } from '../../api/jobsApi'
import { PIPELINE_STAGES, STATUS_LABELS } from '../../utils/pipelineRules'

export default function RecruiterDashboardPage() {
  const navigate = useNavigate()

  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats]     = useState({
    total: 0, open: 0, draft: 0, closed: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getRecruiterJobs({ size: 100 })
        const all = res.data.content || []
        setJobs(all)
        setStats({
          total:  all.length,
          open:   all.filter(j => j.status === 'OPEN').length,
          draft:  all.filter(j => j.status === 'DRAFT').length,
          closed: all.filter(j => j.status === 'CLOSED').length,
        })
      } catch {
        // fail silently on dashboard
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const recentJobs = jobs.slice(0, 5)

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const STAT_CARDS = [
    { label: 'Total Jobs', value: stats.total,  icon: 'briefcase',     tone: 'text-brand-600 bg-brand-50 ring-brand-100' },
    { label: 'Open',       value: stats.open,   icon: 'checkCircle',   tone: 'text-emerald-600 bg-emerald-50 ring-emerald-100' },
    { label: 'Draft',      value: stats.draft,  icon: 'clipboardList', tone: 'text-fg-subtle bg-muted ring-line' },
    { label: 'Closed',     value: stats.closed, icon: 'lock',          tone: 'text-red-600 bg-red-50 ring-red-100' },
  ]

  const PIPELINE_WIDTHS = [100, 75, 55, 35, 18, 8]
  const PIPELINE_COLORS = [
    'bg-brand-600', 'bg-brand-500', 'bg-brand-400',
    'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600',
  ]

  return (
    <Layout>
      <PageHeader
        title="Recruiter Dashboard"
        description="Manage your job postings and track applicants"
        actions={
          <Button onClick={() => navigate('/recruiter/jobs/create')} size="lg">
            <Icon name="plus" className="w-4 h-4" strokeWidth={2.2} />
            Post New Job
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(({ label, value, icon, tone }, i) => (
          <div
            key={label}
            className="bg-surface border border-line rounded-xl p-5 shadow-card animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-medium text-fg-subtle">
                {label}
              </span>
              <div className={`w-8 h-8 rounded-lg ring-1 ring-inset flex items-center
                justify-center flex-shrink-0 ${tone}`}>
                <Icon name={icon} className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>
            <p className="font-display text-3xl font-extrabold tracking-tight text-fg tabular-nums">
              {loading
                ? <span className="inline-block h-8 w-10 rounded-md bg-muted animate-pulse align-middle" />
                : value}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Pipeline visual */}
        <section className="lg:col-span-2 bg-surface border border-line
          rounded-xl p-6 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-fg mb-1">
                Pipeline Overview
              </h2>
              <p className="text-[13px] text-fg-subtle">
                Candidate journey from application to hire
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5
              rounded-full bg-muted text-fg-muted text-xs font-medium">
              6 stages
            </span>
          </div>

          <ol className="space-y-4">
            {PIPELINE_STAGES.map((stage, idx) => (
              <li key={stage} className="grid grid-cols-[1.75rem_8.5rem_1fr] sm:grid-cols-[1.75rem_10rem_1fr]
                items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center
                  text-[11px] font-bold tabular-nums ring-1 ring-inset ${idx === 0
                    ? 'bg-brand-600 text-white ring-brand-600'
                    : idx === PIPELINE_STAGES.length - 1
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-subtle text-fg-subtle ring-line'}`}>
                  {idx + 1}
                </span>
                <span className="text-[13px] font-semibold text-fg-muted truncate">
                  {STATUS_LABELS[stage]}
                </span>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${PIPELINE_COLORS[idx]} rounded-full
                      transition-[width] duration-700`}
                    style={{ width: `${PIPELINE_WIDTHS[idx]}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Quick actions */}
        <section className="bg-surface border border-line rounded-xl p-6 shadow-card">
          <h2 className="text-base font-bold text-fg mb-1">
            Quick Actions
          </h2>
          <p className="text-[13px] text-fg-subtle mb-5">Jump straight into common tasks</p>
          <div className="space-y-2.5">
            {[
              {
                label: 'Post a new job',
                desc:  'Create a new job posting',
                icon:  'plus',
                action: () => navigate('/recruiter/jobs/create'),
                primary: true,
              },
              {
                label: 'Manage jobs',
                desc:  'View and edit all your jobs',
                icon:  'briefcase',
                action: () => navigate('/recruiter/jobs'),
              },
            ].map(({ label, desc, icon, action, primary }) => (
              <button
                key={label}
                onClick={action}
                className="group w-full flex items-center gap-3 p-3 rounded-xl
                  border border-line bg-surface text-left cursor-pointer
                  hover:border-line-strong hover:bg-subtle"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center
                  justify-center flex-shrink-0
                  ${primary ? 'bg-brand-600 text-white shadow-xs' : 'bg-muted text-fg-muted'}`}>
                  <Icon name={icon} className="w-[18px] h-[18px]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-fg">{label}</p>
                  <p className="text-xs text-fg-subtle">{desc}</p>
                </div>
                <span className="text-fg-faint group-hover:text-fg group-hover:translate-x-0.5 transition-transform">
                  <Icon name="arrowRight" className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Recent jobs */}
      <section className="bg-surface border border-line rounded-xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="text-base font-bold text-fg">
            Recent Jobs
          </h2>
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="inline-flex items-center gap-1 text-[13px] text-brand-600 font-semibold
              hover:underline underline-offset-4"
          >
            View all
            <Icon name="arrowRight" className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading && <div className="p-4"><RowListSkeleton count={3} /></div>}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-14 px-6">
            <div className="w-11 h-11 rounded-xl bg-muted text-fg-subtle flex items-center
              justify-center mx-auto mb-3">
              <Icon name="briefcase" className="w-5 h-5" />
            </div>
            <p className="text-fg-subtle text-sm mb-4">
              No jobs posted yet
            </p>
            <Button
              onClick={() => navigate('/recruiter/jobs/create')}
              size="sm"
            >
              Post your first job
            </Button>
          </div>
        )}

        {!loading && recentJobs.length > 0 && (
          <ul className="divide-y divide-line">
            {recentJobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between px-5 py-4
                  hover:bg-subtle transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-muted rounded-lg
                    flex items-center justify-center flex-shrink-0">
                    <Icon name="briefcase" className="w-4 h-4 text-fg-subtle" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-fg-subtle mt-0.5">
                      Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <JobStatusBadge status={job.status} />
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() =>
                      navigate(`/recruiter/jobs/${job.id}/applicants`)
                    }
                  >
                    View
                    <Icon name="arrowRight" className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  )
}
