import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import { getOpenJobById } from '../../api/jobsApi'
import { applyToJob, getMyApplications } from '../../api/applicationsApi'
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from '../../utils/pipelineRules'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob]                     = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [applying, setApplying]           = useState(false)
  const [applyError, setApplyError]       = useState('')
  const [applySuccess, setApplySuccess]   = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [coverNote, setCoverNote]         = useState('')
  const [resumeUrl, setResumeUrl]         = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [jobRes, appsRes] = await Promise.all([
          getOpenJobById(id),
          getMyApplications({ size: 100 }),
        ])
        setJob(jobRes.data)
        const applied = (appsRes.data.content || [])
          .some(a => a.jobId === Number(id))
        setAlreadyApplied(applied)
      } catch {
        setError('Job not found or no longer available.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleApply = async () => {
    setApplying(true)
    setApplyError('')
    try {
      await applyToJob({
        jobId: Number(id),
        coverNote,
        resumeUrl: resumeUrl.trim() || null,
      })
      setApplySuccess(true)
      setAlreadyApplied(true)
      setShowApplyForm(false)
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Failed to apply. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  const formatSalary = (min, max) => {
    if (!min && !max) return null
    const fmt = (n) => `$${Number(n).toLocaleString()}`
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    return `Up to ${fmt(max)}`
  }

  if (loading) return <Layout><Spinner /></Layout>

  if (error) return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-[#0f172a] mb-2">{error}</h2>
        <Button variant="outline" onClick={() => navigate('/jobs')}>
          ← Back to jobs
        </Button>
      </div>
    </Layout>
  )

  return (
    <Layout>
      {/* Back */}
      <button
        onClick={() => navigate('/jobs')}
        className="inline-flex items-center gap-1.5 text-sm text-[#64748b]
          hover:text-indigo-600 mb-6 transition-colors group font-medium"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Jobs
      </button>

      {/* Hero header */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 lg:p-8 mb-6
        relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/5
          rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between
          items-start lg:items-center gap-5 relative z-10">
          <div>
            {/* Category + posted */}
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#f2f4f6] text-[#464555] text-xs font-semibold
                px-2.5 py-1 rounded-lg">
                Open Position
              </span>
              {job.createdAt && (
                <span className="text-xs text-[#64748b]">
                  Posted {formatDate(job.createdAt)}
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-3">
              {job.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b]">
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  {job.location}
                </span>
              )}
              {job.workMode && (
                <span className="flex items-center gap-1.5">
                  {job.workMode === 'REMOTE' && '🌐'}
                  {job.workMode === 'HYBRID' && '🏢'}
                  {job.workMode === 'ONSITE' && '📍'}
                  {WORK_MODE_LABELS[job.workMode]}
                </span>
              )}
              {job.employmentType && (
                <span className="flex items-center gap-1.5">
                  ⏱ {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                </span>
              )}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {alreadyApplied && !applySuccess ? (
              <div className="flex flex-col gap-2">
                <div className="bg-amber-50 border border-amber-200 rounded-xl
                  px-5 py-3 text-sm text-amber-700 font-medium text-center">
                  ✓ Already applied
                </div>
                <Button variant="secondary" size="sm"
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            ) : applySuccess ? (
              <div className="flex flex-col gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl
                  px-5 py-3 text-sm text-emerald-700 font-medium text-center">
                  ✓ Application submitted!
                </div>
                <Button variant="secondary" size="sm"
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/jobs')}
                >
                  ← Back
                </Button>
                <Button
                  size="lg"
                  onClick={() => setShowApplyForm(true)}
                  className="shadow-lg shadow-indigo-200"
                >
                  Apply Now →
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main — description + skills */}
        <div className="lg:col-span-2 space-y-5">

          {/* Description */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              About this role
            </h2>
            <p className="text-sm text-[#464555] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Required skills */}
          {job.requiredSkills && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
                border-b border-[#e2e8f0]">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.split(',').map((s) => (
                  <span key={s.trim()}
                    className="px-3 py-1.5 bg-[#f7f9fb] border border-[#e2e8f0]
                      rounded-lg text-xs font-semibold text-[#464555]">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply form */}
          {showApplyForm && !alreadyApplied && !applySuccess && (
            <div className="bg-white border border-indigo-200 rounded-xl p-6
              shadow-sm shadow-indigo-100">
              <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
                border-b border-[#e2e8f0]">
                Your Application
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">
                    Cover Note
                    <span className="text-[#64748b] font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    rows={4}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="w-full px-3.5 py-3 border border-[#e2e8f0] rounded-xl
                      text-sm resize-none focus:outline-none focus:ring-2
                      focus:ring-indigo-500 focus:border-transparent text-[#191c1e]
                      placeholder-[#94a3b8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f172a] mb-1.5">
                    Resume URL
                    <span className="text-[#64748b] font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-cv-link"
                    className="w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-xl
                      text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                      focus:border-transparent text-[#191c1e] placeholder-[#94a3b8]"
                  />
                </div>
                {applyError && <Alert type="error" message={applyError} />}
                <div className="flex gap-3">
                  <Button onClick={handleApply} loading={applying}>
                    Submit Application
                  </Button>
                  <Button variant="ghost"
                    onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — job details */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 sticky top-24">
            <h2 className="text-base font-bold text-[#0f172a] mb-5 pb-3
              border-b border-[#e2e8f0]">
              Job Details
            </h2>

            <dl className="space-y-4">
              {job.employmentType && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Job Type
                  </dt>
                  <dd className="text-sm font-medium text-[#0f172a]">
                    {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                  </dd>
                </div>
              )}
              {job.workMode && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Work Mode
                  </dt>
                  <dd className="text-sm font-medium text-[#0f172a]">
                    {WORK_MODE_LABELS[job.workMode]}
                  </dd>
                </div>
              )}
              {job.location && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Location
                  </dt>
                  <dd className="text-sm font-medium text-[#0f172a]">{job.location}</dd>
                </div>
              )}
              {formatSalary(job.salaryMin, job.salaryMax) && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Salary Range
                  </dt>
                  <dd className="text-sm font-medium text-emerald-600">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </dd>
                </div>
              )}
              {job.closingDate && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Application Closes
                  </dt>
                  <dd className="text-sm font-medium text-[#0f172a]">
                    {formatDate(job.closingDate)}
                  </dd>
                </div>
              )}
              {job.createdAt && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Date Posted
                  </dt>
                  <dd className="text-sm font-medium text-[#0f172a]">
                    {formatDate(job.createdAt)}
                  </dd>
                </div>
              )}
            </dl>

            {/* Apply CTA in sidebar */}
            {!alreadyApplied && !applySuccess && (
              <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
                <Button
                  fullWidth
                  onClick={() => {
                    setShowApplyForm(true)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="shadow-md shadow-indigo-200"
                >
                  Apply for this position
                </Button>
              </div>
            )}

            {alreadyApplied && !applySuccess && (
              <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
                <div className="bg-amber-50 border border-amber-200 rounded-xl
                  p-3 text-center text-sm text-amber-700 font-medium mb-3">
                  ✓ You've already applied
                </div>
                <Button variant="secondary" fullWidth
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            )}

            {applySuccess && (
              <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl
                  p-3 text-center text-sm text-emerald-700 font-medium mb-3">
                  ✓ Application submitted!
                </div>
                <Button variant="secondary" fullWidth
                  onClick={() => navigate('/my-applications')}>
                  Track my applications
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
