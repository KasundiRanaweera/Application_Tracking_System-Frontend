import Button from '../ui/Button'
import Input from '../ui/Input'
import Alert from '../ui/Alert'
import Icon from '../ui/Icon'
import Panel from '../ui/Panel'
import PageHeader, { BackLink } from '../ui/PageHeader'

const WORK_MODES  = ['REMOTE', 'HYBRID', 'ONSITE']
const EMP_TYPES   = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
const WORK_LABELS = { REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site' }
const WORK_ICONS  = { REMOTE: 'globe', HYBRID: 'building', ONSITE: 'mapPin' }
const EMP_LABELS  = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
  CONTRACT: 'Contract', INTERNSHIP: 'Internship',
}

const FIELD = `w-full h-10 px-3.5 border border-line rounded-lg text-sm bg-surface text-fg
  placeholder-fg-faint shadow-xs hover:border-line-strong
  focus:outline-none focus:ring-4 focus:ring-brand-500/15 focus:border-brand-500`
const LABEL = 'block text-[13px] font-medium text-fg-muted mb-1.5'

function PanelTitle({ icon, children }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center">
        <Icon name={icon} className="w-3.5 h-3.5" strokeWidth={2} />
      </span>
      {children}
    </span>
  )
}

/**
 * Presentational job form shared by Create and Edit pages. All state,
 * validation and submission live in the page; this only renders.
 */
export default function JobForm({
  title,
  description,
  form,
  errors,
  serverError,
  onChange,
  setForm,
  onBack,
  onSubmit,
  onCancel,
  submitLabel,
  loading,
  footnote,
}) {
  const skills = form.requiredSkills
    ? form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <>
      <PageHeader
        eyebrow={<BackLink onClick={onBack}>Back to Jobs</BackLink>}
        title={title}
        description={description}
      />

      {serverError && (
        <div className="mb-6">
          <Alert type="error" message={serverError} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-6">

          <Panel title={<PanelTitle icon="document">Basic Information</PanelTitle>}>
            <div className="space-y-5">
              <Input
                id="title"
                label="Job Title"
                value={form.title}
                onChange={onChange}
                placeholder="e.g. Senior Frontend Developer"
                error={errors.title}
                required
              />
              <div>
                <label htmlFor="description" className={LABEL}>
                  Job Description
                  <span className="text-red-500 ml-0.5" aria-hidden>*</span>
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={onChange}
                  rows={7}
                  placeholder="Describe the role, responsibilities, and team..."
                  className={`${FIELD} h-auto py-2.5 resize-y leading-relaxed
                    ${errors.description ? '!border-red-400' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employmentType" className={LABEL}>
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    value={form.employmentType}
                    onChange={onChange}
                    className={`${FIELD} cursor-pointer`}
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
                  onChange={onChange}
                />
              </div>
            </div>
          </Panel>

          <Panel title={<PanelTitle icon="checkCircle">Requirements & Skills</PanelTitle>}>
            <label htmlFor="requiredSkills" className={LABEL}>
              Required Skills
              <span className="text-fg-faint font-normal ml-1 text-xs">
                (comma-separated)
              </span>
            </label>
            <input
              id="requiredSkills"
              type="text"
              value={form.requiredSkills}
              onChange={onChange}
              placeholder="e.g. React, TypeScript, Node.js"
              className={FIELD}
            />
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {skills.map(s => (
                  <span key={s}
                    className="px-2.5 py-1 bg-brand-50 ring-1 ring-inset ring-brand-100
                      text-brand-700 text-xs font-medium rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Right — logistics + actions */}
        <div className="space-y-6 lg:sticky lg:top-24">

          <Panel title={<PanelTitle icon="mapPin">Logistics</PanelTitle>}>
            <div className="space-y-5">
              <div>
                <span className={LABEL}>Work Mode</span>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Work mode">
                  {WORK_MODES.map(m => {
                    const active = form.workMode === m
                    return (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setForm(p => ({ ...p, workMode: m }))}
                        className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg border
                          text-xs font-semibold
                          ${active
                            ? 'bg-brand-50 text-brand-700 border-brand-500 ring-1 ring-brand-500'
                            : 'bg-surface border-line text-fg-subtle hover:border-line-strong hover:text-fg'
                          }`}
                      >
                        <Icon name={WORK_ICONS[m]} className="w-4 h-4" />
                        {WORK_LABELS[m]}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Input
                id="location"
                label="Location"
                value={form.location}
                onChange={onChange}
                placeholder="City, Country"
              />
            </div>
          </Panel>

          <Panel title={<PanelTitle icon="dollar">Compensation</PanelTitle>}>
            <span className={LABEL}>Salary Range (Annual, LKR)</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'salaryMin', placeholder: 'Min' },
                { id: 'salaryMax', placeholder: 'Max' },
              ].map(({ id, placeholder }, i) => (
                <div key={id} className="contents">
                  {i === 1 && <span className="text-fg-faint text-sm flex-shrink-0">–</span>}
                  <div className="relative flex-1 min-w-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2
                      text-fg-faint text-xs font-medium pointer-events-none">Rs.</span>
                    <input
                      id={id}
                      type="number"
                      value={form[id]}
                      onChange={onChange}
                      placeholder={placeholder}
                      aria-label={`Salary ${placeholder.toLowerCase()}`}
                      className={`${FIELD} pl-10 pr-3 tabular-nums`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="bg-surface border border-line rounded-xl shadow-card p-5 space-y-2.5">
            <Button
              fullWidth
              size="lg"
              loading={loading}
              onClick={onSubmit}
            >
              {submitLabel}
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={onCancel}
            >
              Cancel
            </Button>
            {footnote && (
              <p className="text-xs text-center text-fg-subtle pt-1 leading-relaxed">
                {footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
