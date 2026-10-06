import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import JobForm from '../../components/recruiter/JobForm'
import Spinner from '../../components/ui/Spinner'
import { getRecruiterJobs, updateJob } from '../../api/jobsApi'


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
      navigate('/recruiter/jobs', {
        state: { successMessage: 'Job updated successfully.' },
      })
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
      <JobForm
        title="Edit Job"
        description="Update the details for this draft position"
        form={form}
        errors={errors}
        serverError={serverError}
        onChange={handleChange}
        setForm={setForm}
        onBack={() => navigate('/recruiter/jobs')}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/recruiter/jobs')}
        submitLabel="Save Changes"
        loading={loading}
      />
    </Layout>
  )
}
