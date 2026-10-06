import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import JobForm from '../../components/recruiter/JobForm'
import { createJob } from '../../api/jobsApi'


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
      navigate('/recruiter/jobs', {
        state: { successMessage: asDraft
          ? 'Job saved as draft successfully.'
          : 'Job published successfully.' },
      })
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
      <JobForm
        title="Post a New Job"
        description="Fill out the details below to create a new job posting"
        form={form}
        errors={errors}
        serverError={serverError}
        onChange={handleChange}
        setForm={setForm}
        onBack={() => navigate('/recruiter/jobs')}
        onSubmit={() => handleSubmit(true)}
        onCancel={() => navigate('/recruiter/jobs')}
        submitLabel="Save as Draft"
        loading={loading}
        footnote="You can publish the job from My Jobs after saving as draft."
      />
    </Layout>
  )
}
