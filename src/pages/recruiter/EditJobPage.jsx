import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { getRecruiterJobs, updateJob } from '../../api/jobsApi'

const WORK_MODES  = ['REMOTE', 'HYBRID', 'ONSITE']
const EMP_TYPES   = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
const WORK_LABELS = { REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site' }
const EMP_LABELS  = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  CONTRACT: 'Contract', INTERNSHIP: 'Internship',
}

export default function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    workMode: 'REMOTE', employmentType: 'FULL_TIME',
    salaryMin: '', salaryMax: '', requiredSkills: '', closingDate: '',
  })
  const [loadingJob, setLoadingJob] = useState(true)
  const [loading, setLoading]       = useState(false)
  const [errors, setErrors]         = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getRecruiterJobs({ size: 100 })
        const job = (res.data.content || []).find(j => j.id === Number(id))
        if (!job) { navigate('/recruiter/jobs'); return }
        if (job.status !== 'DRAFT') {
          alert('Only DRAFT jobs can be edited.')
          navigate('/recruiter/jobs')
          return
        }
        setForm({
          title:          job.title          || '',
          description:    job.description    || '',
          location:       job.location       || '',
          workMode:       job.workMode       || 'REMOTE',
          employmentType: job.employmentType || 'FULL_TIME',
          salaryMin:      job.salaryMin      || '',
          salaryMax:      job.salaryMax      || '',
          requiredSkills: job.requiredSkills || '',
          closingDate:    job.closingDate    || '',
        })
      } catch {
        navigate('/recruiter/jobs')
      } finally {
        setLoadingJob(false)
      }
    }
    load()
  }, [id, navigate])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.id]: e.target.value }))
    setErrors(p => ({ ...p, [e.target.id]: '' }))
    setServerError('')
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Job title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  const handleSubmit = async () => {
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await updateJob(id, {
        title:          form.title.trim(),
        description:    form.description.trim(),
        location:       form.location || null,
        workMode:       form.workMode || null,
        employmentType: form.employmentType || null,
        salaryMin:      form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax:      form.salaryMax ? Number(form.salaryMax) : null,
        requiredSkills: form.requiredSkills || null,
        closingDate:    form.closingDate || null,
      })
      navigate('/recruiter/jobs')
    } catch (err) {
      setServerError(
        err.response?.data?.error || 'Failed to update job.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loadingJob) return <Layout><Spinner /></Layout>

  return (
    <Layout>
      <div className="mb-8">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b]
            hover:text-brand-600 mb-4 transition-colors font-medium group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Jobs
        </button>
        <h1 className="text-2xl font-bold text-[#0f172a]">Edit Job</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Update the details for this draft position
        </p>
      </div>

      {serverError && (
        <div className="mb-6">
          <Alert type="error" message={serverError} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                id="title"
                label="Job Title"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
                required
              />
              <div>
                <label className="block text-sm font-semibold
                  text-[#0f172a] mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm
                    resize-y focus:outline-none focus:ring-2
                    focus:ring-brand-500 focus:border-transparent
                    text-[#0f172a]
                    ${errors.description
                      ? 'border-red-400' : 'border-[#e2e8f0]'}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold
                    text-[#0f172a] mb-1.5">
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    value={form.employmentType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-[#e2e8f0]
                      rounded-lg text-sm bg-white text-[#0f172a]
                      focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {EMP_TYPES.map(t => (
                      <option key={t} value={t}>{EMP_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
                <Input
                  id="closingDate"
                  label="Closing Date"
                  type="date"
                  value={form.closingDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Required Skills
            </h2>
            <input
              id="requiredSkills"
              type="text"
              value={form.requiredSkills}
              onChange={handleChange}
              placeholder="e.g. React, TypeScript, Node.js"
              className="w-full px-3.5 py-2.5 border border-[#e2e8f0]
                rounded-lg text-sm focus:outline-none focus:ring-2
                focus:ring-brand-500 text-[#0f172a]"
            />
            {form.requiredSkills && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.requiredSkills
                  .split(',').map(s => s.trim()).filter(Boolean)
                  .map(s => (
                    <span key={s}
                      className="px-3 py-1 bg-brand-50 border
                        border-brand-200 text-brand-700 text-xs
                        font-semibold rounded-full">
                      {s}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Logistics
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold
                  text-[#0f172a] mb-2">
                  Work Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_MODES.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, workMode: m }))}
                      className={`py-2 px-3 rounded-lg border text-xs
                        font-semibold transition-all
                        ${form.workMode === m
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'border-[#e2e8f0] text-[#64748b] hover:border-brand-300'}`}
                    >
                      {WORK_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="location"
                label="Location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Compensation
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2
                  text-slate-400 text-sm">Rs.</span>
                <input
                  id="salaryMin"
                  type="number"
                  value={form.salaryMin}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#e2e8f0]
                    rounded-lg text-sm focus:outline-none focus:ring-2
                    focus:ring-brand-500 text-[#0f172a]"
                />
              </div>
              <span className="text-[#64748b] text-sm">—</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2
                  text-slate-400 text-sm">Rs.</span>
                <input
                  id="salaryMax"
                  type="number"
                  value={form.salaryMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full pl-9 pr-3 py-2.5 border border-[#e2e8f0]
                    rounded-lg text-sm focus:outline-none focus:ring-2
                    focus:ring-brand-500 text-[#0f172a]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6
            space-y-3">
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={handleSubmit}
              className="shadow-md shadow-brand-200"
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/recruiter/jobs')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
