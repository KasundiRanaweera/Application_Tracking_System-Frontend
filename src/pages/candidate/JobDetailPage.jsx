import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import Icon from '../../components/ui/Icon'
import Panel from '../../components/ui/Panel'
import EmptyState from '../../components/ui/EmptyState'
import { BackLink } from '../../components/ui/PageHeader'
import { getOpenJobById } from '../../api/jobsApi'
import { applyToJob, getMyApplications, uploadResume } from '../../api/applicationsApi'
import {
  EMPLOYMENT_TYPE_LABELS,
  WORK_MODE_LABELS,
} from '../../utils/pipelineRules'

const WORK_ICONS = { REMOTE: 'globe', HYBRID: 'building', ONSITE: 'mapPin' }

const StatusNote = ({ tone, children }) => (
  <div className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
    ring-1 ring-inset ${tone === 'success'
      ? 'bg-emerald-50 ring-emerald-200 text-emerald-700'
      : 'bg-amber-50 ring-amber-200 text-amber-700'}`}>
    <Icon name="checkCircle" className="w-4 h-4" strokeWidth={2} />
    {children}
  </div>
)

const FIELD = `w-full px-3.5 border border-line rounded-lg text-sm bg-surface text-fg
  placeholder-fg-faint shadow-xs hover:border-line-strong
  focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500`

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
  const [resumeFile, setResumeFile]       = useState(null)
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
      let submittedResumeUrl = resumeUrl.trim() || null
      if (resumeFile) {
        const uploadResponse = await uploadResume(resumeFile)
        submittedResumeUrl = uploadResponse.data.url
      }

      await applyToJob({
        jobId: Number(id),
        coverNote,
        resumeUrl: submittedResumeUrl,
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
    const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`
    if (min && max) return `${fmt(min)} – ${fmt(max)}`
    if (min) return `From ${fmt(min)}`
    return `Up to ${fmt(max)}`
  }

  // Open the apply form and bring it into view (UI only).
  const openApplyForm = () => {
    setShowApplyForm(true)
    setTimeout(() => {
      document.getElementById('apply-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  if (loading) return <Layout><Spinner label="Loading position…" /></Layout>

  if (error) return (
    <Layout>
      <EmptyState
        icon="frown"
        title={error}
        action={
          <Button variant="secondary" onClick={() => navigate('/jobs')}>
            Back to jobs
          </Button>
        }
      />
    </Layout>
  )

  const salary = formatSalary(job.salaryMin, job.salaryMax)

  return (
    <Layout>
      <div className="mb-5">
        <BackLink onClick={() => navigate('/jobs')}>Back to Jobs</BackLink>
      </div>

      {/* Hero header */}
      <section className="relative overflow-hidden bg-surface border border-line rounded-xl shadow-card
        p-6 lg:p-8 mb-6">
        <div aria-hidden="true" className="absolute inset-0
          bg-[radial-gradient(40%_80%_at_100%_0%,rgb(30_76_224/0.08),transparent_70%)] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row justify-between
          items-start lg:items-end gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-brand-50 ring-1 ring-inset ring-brand-100
              text-brand-600 items-center justify-center flex-shrink-0">
              <Icon name="briefcase" className="w-6 h-6" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              {/* Category + posted */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700
                  ring-1 ring-inset ring-emerald-200 text-xs font-medium px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Open Position
                </span>
                {job.createdAt && (
                  <span className="text-xs text-fg-subtle">
                    Posted {formatDate(job.createdAt)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-[2rem] font-extrabold text-fg tracking-[-0.03em] leading-tight mb-3">
                {job.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-subtle">
                {job.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="mapPin" className="w-4 h-4 text-fg-faint" />
                    {job.location}
                  </span>
                )}
                {job.workMode && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name={WORK_ICONS[job.workMode] ?? 'globe'} className="w-4 h-4 text-fg-faint" />
                    {WORK_MODE_LABELS[job.workMode]}
                  </span>
                )}
                {job.employmentType && (
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="briefcase" className="w-4 h-4 text-fg-faint" />
                    {EMPLOYMENT_TYPE_LABELS[job.employmentType]}
                  </span>
                )}
                {salary && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
                    <Icon name="dollar" className="w-4 h-4 text-fg-faint" />
                    {salary}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto flex-shrink-0">
            {alreadyApplied && !applySuccess ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <StatusNote tone="warning">Already applied</StatusNote>
                <Button variant="secondary" size="lg"
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            ) : applySuccess ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <StatusNote tone="success">Application submitted!</StatusNote>
                <Button variant="secondary" size="lg"
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={openApplyForm}
              >
                Apply Now
                <Icon name="arrowRight" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Main — description + skills */}
        <div className="lg:col-span-2 space-y-6">

          {/* Apply form */}
          {showApplyForm && !alreadyApplied && !applySuccess && (
            <section id="apply-form" className="scroll-mt-24 bg-surface border border-brand-500/40 rounded-xl
              shadow-pop ring-4 ring-brand-500/10 animate-fade-up">
              <header className="px-6 pt-5 pb-4 border-b border-line">
                <h2 className="text-[15px] font-bold text-fg">Your Application</h2>
                <p className="text-[13px] text-fg-subtle mt-0.5">Applying for {job.title}</p>
              </header>
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="coverNote" className="block text-[13px] font-medium text-fg-muted mb-1.5">
                    Cover Note
                    <span className="text-fg-faint font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    id="coverNote"
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    rows={5}
                    placeholder="Tell us why you're a great fit for this role..."
                    className={`${FIELD} py-3 resize-y leading-relaxed`}
                  />
                </div>
                <div>
                  <span className="block text-[13px] font-medium text-fg-muted mb-1.5">
                    Upload CV
                    <span className="text-fg-faint font-normal ml-1">(PDF, DOC, or DOCX; max 5 MB)</span>
                  </span>
                  <label htmlFor="resumeFile" className={`flex items-center gap-3 p-4 rounded-xl border border-dashed
                    cursor-pointer transition-colors
                    ${resumeFile
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-line-strong bg-subtle hover:border-brand-500 hover:bg-brand-50'}`}>
                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${resumeFile ? 'bg-surface text-emerald-600' : 'bg-surface text-fg-subtle border border-line'}`}>
                      <Icon name={resumeFile ? 'checkCircle' : 'document'} className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-fg truncate">
                        {resumeFile ? resumeFile.name : 'Choose a file to upload'}
                      </span>
                      <span className="block text-xs text-fg-subtle">
                        {resumeFile ? 'Click to replace' : 'PDF, DOC or DOCX up to 5 MB'}
                      </span>
                    </span>
                  </label>
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (!file) {
                        setResumeFile(null)
                        return
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setApplyError('CV file must be 5 MB or smaller.')
                        e.target.value = ''
                        setResumeFile(null)
                        return
                      }
                      setApplyError('')
                      setResumeFile(file)
                    }}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-3 my-4">
                    <span className="h-px flex-1 bg-line" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-faint">or</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>

                  <label htmlFor="resumeUrl" className="block text-[13px] font-medium text-fg-muted mb-1.5">
                    Provide a resume URL
                  </label>
                  <input
                    id="resumeUrl"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-cv-link"
                    className={`${FIELD} h-10`}
                  />
                </div>
                {applyError && <Alert type="error" message={applyError} />}
                <div className="flex items-center gap-2 pt-1">
                  <Button onClick={handleApply} loading={applying} size="lg">
                    Submit Application
                  </Button>
                  <Button variant="ghost" size="lg"
                    onClick={() => setShowApplyForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Description */}
          <Panel title="About this role">
            <p className="text-[15px] text-fg-muted leading-7 whitespace-pre-line">
              {job.description}
            </p>
          </Panel>

          {/* Required skills */}
          {job.requiredSkills && (
            <Panel title="Required Skills">
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.split(',').map((s) => (
                  <span key={s.trim()}
                    className="px-2.5 py-1 bg-subtle ring-1 ring-inset ring-line
                      rounded-md text-[13px] font-medium text-fg-muted">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Sidebar — job details */}
        <div className="lg:sticky lg:top-24">
          <Panel title="Job Details">
            <dl className="divide-y divide-line -my-2">
              {[
                job.employmentType && { icon: 'briefcase', label: 'Job Type', value: EMPLOYMENT_TYPE_LABELS[job.employmentType] },
                job.workMode && { icon: WORK_ICONS[job.workMode] ?? 'globe', label: 'Work Mode', value: WORK_MODE_LABELS[job.workMode] },
                job.location && { icon: 'mapPin', label: 'Location', value: job.location },
                salary && { icon: 'dollar', label: 'Salary Range', value: salary, emphasis: true },
                job.closingDate && { icon: 'clipboardList', label: 'Application Closes', value: formatDate(job.closingDate) },
                job.createdAt && { icon: 'sparkles', label: 'Date Posted', value: formatDate(job.createdAt) },
              ].filter(Boolean).map(({ icon, label, value, emphasis }) => (
                <div key={label} className="flex items-start gap-3 py-3">
                  <span className="w-8 h-8 rounded-lg bg-muted text-fg-subtle flex items-center justify-center flex-shrink-0">
                    <Icon name={icon} className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-fg-subtle">{label}</dt>
                    <dd className={`text-sm font-semibold ${emphasis ? 'text-emerald-700' : 'text-fg'}`}>
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Apply CTA in sidebar */}
            {!alreadyApplied && !applySuccess && (
              <div className="mt-5 pt-5 border-t border-line">
                <Button fullWidth size="lg" onClick={openApplyForm}>
                  Apply for this position
                </Button>
              </div>
            )}

            {alreadyApplied && !applySuccess && (
              <div className="mt-5 pt-5 border-t border-line space-y-2.5">
                <StatusNote tone="warning">You've already applied</StatusNote>
                <Button variant="secondary" fullWidth
                  onClick={() => navigate('/my-applications')}>
                  View my applications
                </Button>
              </div>
            )}

            {applySuccess && (
              <div className="mt-5 pt-5 border-t border-line space-y-2.5">
                <StatusNote tone="success">Application submitted!</StatusNote>
                <Button variant="secondary" fullWidth
                  onClick={() => navigate('/my-applications')}>
                  Track my applications
                </Button>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </Layout>
  )
}
