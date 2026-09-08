// src/pages/recruiter/RecruiterDashboardPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
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

  const statusStyle = {
    OPEN:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    DRAFT:  'bg-[#f2f4f6] text-[#64748b] border border-[#e2e8f0]',
    CLOSED: 'bg-red-50 text-red-600 border border-red-200',
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center
        justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Recruiter Dashboard
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Manage your job postings and track applicants
          </p>
        </div>
        <Button
          onClick={() => navigate('/recruiter/jobs/create')}
          size="lg"
          className="shadow-md shadow-brand-200 flex-shrink-0"
        >
          + Post New Job
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Jobs',
            value: stats.total,
            icon:  '💼',
            bg:    'bg-[#f7f9fb]',
            color: 'text-[#0f172a]',
          },
          {
            label: 'Open',
            value: stats.open,
            icon:  '✅',
            bg:    'bg-emerald-50',
            color: 'text-emerald-700',
          },
          {
            label: 'Draft',
            value: stats.draft,
            icon:  '📝',
            bg:    'bg-[#f2f4f6]',
            color: 'text-[#64748b]',
          },
          {
            label: 'Closed',
            value: stats.closed,
            icon:  '🔒',
            bg:    'bg-red-50',
            color: 'text-red-600',
          },
        ].map(({ label, value, icon, bg, color }) => (
          <div
            key={label}
            className="bg-white border border-[#e2e8f0] rounded-xl p-5
              hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#64748b]
                uppercase tracking-wider">
                {label}
              </span>
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center
                justify-center text-lg`}>
                {icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Pipeline visual */}
        <div className="lg:col-span-2 bg-white border border-[#e2e8f0]
          rounded-xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-36 h-36 bg-brand-50
            rounded-full blur-3xl opacity-70 pointer-events-none" />
          <div className="relative flex items-start justify-between gap-4 mb-7">
            <div>
              <h2 className="text-base font-bold text-[#0f172a] mb-1">
                Pipeline Overview
              </h2>
              <p className="text-xs text-[#64748b]">
                Candidate journey from application to hire
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5
              py-1 rounded-full bg-brand-50 text-brand-700 text-[11px]
              font-bold uppercase tracking-wider">
              6 stages
            </span>
          </div>

          <div className="relative space-y-3">
            <div className="absolute left-[18px] top-5 bottom-5 w-px
              bg-slate-200" />
            {PIPELINE_STAGES.map((stage, idx) => {
              const widths = [100, 75, 55, 35, 18, 8]
              const colors = [
                'bg-brand-500',
                'bg-brand-400',
                'bg-brand-300',
                'bg-amber-400',
                'bg-emerald-400',
                'bg-emerald-600',
              ]
              return (
                <div key={stage} className="relative flex items-center gap-3">
                  <div className={`relative z-10 w-9 h-9 rounded-full
                    flex items-center justify-center flex-shrink-0 border-2
                    text-xs font-bold ${idx === 0
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : idx === PIPELINE_STAGES.length - 1
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="text-xs font-bold text-[#464555]">
                        {STATUS_LABELS[stage]}
                      </span>
                      <span className="text-[10px] font-semibold text-[#94a3b8]
                        uppercase tracking-wider">
                        Stage {idx + 1}
                      </span>
                    </div>
                    <div className="h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[idx]} rounded-full
                          transition-all duration-700`}
                        style={{ width: `${widths[idx]}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
          <h2 className="text-base font-bold text-[#0f172a] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                label: 'Post a new job',
                desc:  'Create a new job posting',
                icon:  '➕',
                action: () => navigate('/recruiter/jobs/create'),
                primary: true,
              },
              {
                label: 'Manage jobs',
                desc:  'View and edit all your jobs',
                icon:  '💼',
                action: () => navigate('/recruiter/jobs'),
              },
            ].map(({ label, desc, icon, action, primary }) => (
              <button
                key={label}
                onClick={action}
                className={`w-full flex items-center gap-3 p-3 rounded-xl
                  border text-left transition-all
                  ${primary
                    ? 'border-brand-200 bg-brand-50 hover:bg-brand-100'
                    : 'border-[#e2e8f0] bg-[#f7f9fb] hover:bg-[#f2f4f6]'}
                `}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center
                  justify-center text-lg flex-shrink-0
                  ${primary ? 'bg-brand-100' : 'bg-white border border-[#e2e8f0]'}`}>
                  {icon}
                </div>
                <div>
                  <p className={`text-sm font-semibold
                    ${primary ? 'text-brand-700' : 'text-[#0f172a]'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-[#64748b]">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl">
        <div className="flex items-center justify-between p-5 border-b
          border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#0f172a]">
            Recent Jobs
          </h2>
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="text-sm text-brand-600 font-semibold
              hover:text-brand-700"
          >
            View all →
          </button>
        </div>

        {loading && <Spinner />}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#64748b] text-sm mb-4">
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
          <div className="divide-y divide-[#e2e8f0]">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-5
                  hover:bg-[#f7f9fb] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-[#f2f4f6] rounded-lg
                    flex items-center justify-center text-base flex-shrink-0">
                    💼
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0f172a]
                      truncate group-hover:text-brand-600 transition-colors">
                      {job.title}
                    </p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Posted {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-semibold px-2.5 py-1
                    rounded-full ${statusStyle[job.status]}`}>
                    {job.status}
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() =>
                      navigate(`/recruiter/jobs/${job.id}/applicants`)
                    }
                  >
                    View →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}