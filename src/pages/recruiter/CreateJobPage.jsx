import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import { createJob } from '../../api/jobsApi'

const WORK_MODES    = ['REMOTE', 'HYBRID', 'ONSITE']
const EMP_TYPES     = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
const WORK_LABELS   = { REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site' }
const EMP_LABELS    = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  CONTRACT: 'Contract', INTERNSHIP: 'Internship',
}

export default function CreateJobPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    workMode: 'REMOTE', employmentType: 'FULL_TIME',
    salaryMin: '', salaryMax: '', requiredSkills: '', closingDate: '',
  })
  const [errors, setErrors]       = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading]     = useState(false)

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

  const buildPayload = (asDraft) => ({
    title:          form.title.trim(),
    description:    form.description.trim(),
    location:       form.location.trim() || null,
    workMode:       form.workMode || null,
    employmentType: form.employmentType || null,
    salaryMin:      form.salaryMin ? Number(form.salaryMin) : null,
    salaryMax:      form.salaryMax ? Number(form.salaryMax) : null,
    requiredSkills: form.requiredSkills.trim() || null,
    closingDate:    form.closingDate || null,
    status:         asDraft ? 'DRAFT' : 'OPEN',
  })

  const handleSubmit = async (asDraft = true) => {
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await createJob(buildPayload(asDraft))
      navigate('/recruiter/jobs')
    } catch (err) {
      setServerError(
        err.response?.data?.error || 'Failed to create job. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/recruiter/jobs')}
          className="inline-flex items-center gap-1.5 text-sm text-[#64748b]
            hover:text-indigo-600 mb-4 transition-colors font-medium group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Jobs
        </button>
        <h1 className="text-2xl font-bold text-[#0f172a]">Post a New Job</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Fill out the details below to create a new job posting
        </p>
      </div>

      {serverError && (
        <div className="mb-6">
          <Alert type="error" message={serverError} />
        </div>
      )}

      {/* Bento grid form layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-5">

          {/* Basic info card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0] flex items-center gap-2">
              <span className="text-indigo-500">ℹ</span>
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                id="title"
                label="Job Title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                error={errors.title}
                required
              />
              <div>
                <label className="block text-sm font-semibold
                  text-[#0f172a] mb-1.5">
                  Job Description
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, and team..."
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm
                    resize-y focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:border-transparent
                    placeholder-[#94a3b8] text-[#0f172a]
                    ${errors.description
                      ? 'border-red-400'
                      : 'border-[#e2e8f0]'}`}
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
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                      focus:border-transparent"
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

          {/* Skills card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0] flex items-center gap-2">
              <span className="text-indigo-500">✓</span>
              Requirements & Skills
            </h2>
            <div>
              <label className="block text-sm font-semibold
                text-[#0f172a] mb-1.5">
                Required Skills
                <span className="text-[#64748b] font-normal ml-1 text-xs">
                  (comma-separated)
                </span>
              </label>
              <input
                id="requiredSkills"
                type="text"
                value={form.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. React, TypeScript, Node.js"
                className="w-full px-3.5 py-2.5 border border-[#e2e8f0]
                  rounded-lg text-sm focus:outline-none focus:ring-2
                  focus:ring-indigo-500 focus:border-transparent
                  placeholder-[#94a3b8] text-[#0f172a]"
              />
              {/* Skill preview tags */}
              {form.requiredSkills && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s}
                      className="px-3 py-1 bg-indigo-50 border
                        border-indigo-200 text-indigo-700 text-xs
                        font-semibold rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — logistics + actions */}
        <div className="space-y-5">

          {/* Logistics card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0] flex items-center gap-2">
              <span className="text-indigo-500">📍</span>
              Logistics
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold
                  text-[#0f172a] mb-1.5">
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
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-[#e2e8f0] text-[#64748b] hover:border-indigo-300 hover:text-indigo-600'
                        }`}
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

          {/* Compensation card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0] flex items-center gap-2">
              <span className="text-indigo-500">💰</span>
              Compensation
            </h2>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#0f172a]">
                Salary Range (Annual)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2
                    text-[#64748b] text-sm">$</span>
                  <input
                    id="salaryMin"
                    type="number"
                    value={form.salaryMin}
                    onChange={handleChange}
                    placeholder="Min"
                    className="w-full pl-7 pr-3 py-2.5 border border-[#e2e8f0]
                      rounded-lg text-sm focus:outline-none focus:ring-2
                      focus:ring-indigo-500 focus:border-transparent
                      text-[#0f172a]"
                  />
                </div>
                <span className="text-[#64748b] text-sm flex-shrink-0">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2
                    text-[#64748b] text-sm">$</span>
                  <input
                    id="salaryMax"
                    type="number"
                    value={form.salaryMax}
                    onChange={handleChange}
                    placeholder="Max"
                    className="w-full pl-7 pr-3 py-2.5 border border-[#e2e8f0]
                      rounded-lg text-sm focus:outline-none focus:ring-2
                      focus:ring-indigo-500 focus:border-transparent
                      text-[#0f172a]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6
            space-y-3">
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={() => handleSubmit(true)}
              className="shadow-md shadow-indigo-200"
            >
              Save as Draft
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/recruiter/jobs')}
            >
              Cancel
            </Button>
            <p className="text-xs text-center text-[#64748b]">
              You can publish the job from My Jobs after saving as draft.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
