import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import Icon from '../../components/ui/Icon'
import { StatusBadge } from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Panel from '../../components/ui/Panel'
import { BackLink } from '../../components/ui/PageHeader'
import {
  getApplicationDetail,
  rateApplication,
  addNote,
  changeApplicationStatus,
  downloadResume,
  getResumePath,
} from '../../api/applicationsApi'
import {
  getLegalNextStatuses,
  STATUS_LABELS,
  PIPELINE_STAGES,
} from '../../utils/pipelineRules'

export default function ApplicantReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  // Rating state
  const [hoverRating, setHoverRating]     = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)
  const [ratingSuccess, setRatingSuccess] = useState(false)

  // Note state
  const [noteContent, setNoteContent]   = useState('')
  const [noteLoading, setNoteLoading]   = useState(false)
  const [noteError, setNoteError]       = useState('')
  const [noteSuccess, setNoteSuccess]   = useState(false)

  // Status state
  const [statusLoading, setStatusLoading]   = useState(false)
  const [statusError, setStatusError]       = useState('')
  const [statusSuccess, setStatusSuccess]   = useState('')
  const [confirmStatus, setConfirmStatus]   = useState(null)
  const [resumeLoading, setResumeLoading]   = useState(false)
  const [resumeError, setResumeError]       = useState('')

  const fetchApplication = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getApplicationDetail(id)
      setApplication(res.data)
    } catch {
      setError('Failed to load application.')
    } finally {
      setLoading(false)
    }
  }, [id])

  // Data-fetching effect: fetchApplication() sets loading/error/data state,
  // matching React's documented fetch-on-mount/dependency-change pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching effect
    fetchApplication()
  }, [fetchApplication])

  // Rate
  const handleRate = async (rating) => {
    if (ratingLoading) return
    setRatingLoading(true)
    setRatingSuccess(false)
    try {
      const res = await rateApplication(id, rating)
      setApplication(res.data)
      setRatingSuccess(true)
      setTimeout(() => setRatingSuccess(false), 2000)
    } catch {
      // silent
    } finally {
      setRatingLoading(false)
    }
  }

  // Add note
  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      setNoteError('Note cannot be empty.')
      return
    }
    setNoteLoading(true)
    setNoteError('')
    setNoteSuccess(false)
    try {
      await addNote(id, noteContent.trim())
      setNoteContent('')
      setNoteSuccess(true)
      setTimeout(() => setNoteSuccess(false), 2000)
      fetchApplication() // refresh to get new note
    } catch (err) {
      setNoteError(err.response?.data?.error || 'Failed to add note.')
    } finally {
      setNoteLoading(false)
    }
  }

  // Change status
  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true)
    setStatusError('')
    setStatusSuccess('')
    setConfirmStatus(null)
    try {
      const res = await changeApplicationStatus(id, newStatus)
      setApplication(res.data)
      setStatusSuccess(`Application moved to ${STATUS_LABELS[newStatus]}.`)
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Failed to change status.')
    } finally {
      setStatusLoading(false)
    }
  }

  const handleResumeDownload = async () => {
    setResumeError('')
    const resumePath = getResumePath(application.resumeUrl)

    // External resume link (e.g. Google Drive): open it directly. Fetching
    // it through the API client would be blocked by CORS and leak the JWT.
    if (!resumePath) {
      window.open(application.resumeUrl, '_blank', 'noopener,noreferrer')
      return
    }

    // PDFs open in a new tab. The tab must be opened synchronously inside the
    // click so pop-up blockers allow it. Do not pass 'noopener' here: with it,
    // window.open always returns null, which broke this button before.
    const isPdf = /\.pdf$/i.test(resumePath)
    let resumeTab = null
    if (isPdf) {
      resumeTab = window.open('', '_blank')
      if (!resumeTab) {
        setResumeError('Please allow pop-ups for this site to open the resume.')
        return
      }
      resumeTab.opener = null
      resumeTab.document.title = 'Opening resume...'
      resumeTab.document.body.innerHTML = '<p style="font-family: sans-serif; padding: 2rem;">Opening resume...</p>'
    }

    setResumeLoading(true)
    try {
      const response = await downloadResume(resumePath)
      const url = URL.createObjectURL(response.data)
      if (resumeTab) {
        resumeTab.location.href = url
      } else {
        // Word documents cannot be previewed in the browser, so download them.
        const extension = resumePath.split('.').pop()
        const safeName = (application.candidateName || 'candidate').replace(/[^\w-]+/g, '-')
        const link = document.createElement('a')
        link.href = url
        link.download = `${safeName}-resume.${extension}`
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch (err) {
      resumeTab?.close()
      let message = 'Failed to open the resume.'
      try {
        const body = JSON.parse(await err.response.data.text())
        if (body?.error) message = body.error
      } catch {
        // Keep the generic message when the error body is not JSON.
      }
      setResumeError(message)
    } finally {
      setResumeLoading(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  const formatDateTime = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const getStageIndex = (status) => PIPELINE_STAGES.indexOf(status)

  const isTerminal = (status) =>
    ['HIRED', 'REJECTED', 'WITHDRAWN'].includes(status)

  if (loading) return <Layout><Spinner label="Loading application…" /></Layout>

  if (error || !application) return (
    <Layout>
      <EmptyState
        icon="frown"
        title={error || 'Application not found'}
        action={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        }
      />
    </Layout>
  )

  const legalMoves  = getLegalNextStatuses(application.status)
  const currentIdx  = getStageIndex(application.status)
  const terminal    = isTerminal(application.status)

  return (
    <Layout>
      <div className="mb-5">
        <BackLink onClick={() => navigate(-1)}>Back to Applicants</BackLink>
      </div>

      {/* Hero header */}
      <section className="relative overflow-hidden bg-surface border border-line rounded-xl shadow-card p-6 mb-6">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r
          from-brand-600 via-brand-400 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center
          justify-between gap-5">

          {/* Candidate info */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700
              flex items-center justify-center text-white font-bold
              text-xl flex-shrink-0 shadow-xs">
              {application.candidateName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-fg tracking-tight truncate">
                {application.candidateName}
              </h1>
              <p className="text-sm text-fg-subtle mt-0.5 flex items-center gap-1.5 min-w-0">
                <Icon name="mail" className="w-3.5 h-3.5 text-fg-faint flex-shrink-0" />
                <span className="truncate">{application.candidateEmail}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <StatusBadge status={application.status} />
                <span className="text-xs text-fg-subtle">
                  Applied {formatDate(application.appliedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Job info */}
          <div className="flex items-center gap-3 bg-subtle border border-line rounded-xl
            px-4 py-3 flex-shrink-0 md:max-w-xs">
            <div className="w-9 h-9 rounded-lg bg-surface border border-line flex items-center
              justify-center text-fg-subtle flex-shrink-0">
              <Icon name="briefcase" className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-fg-subtle uppercase tracking-wider">
                Applied for
              </p>
              <p className="text-sm font-semibold text-fg truncate">
                {application.jobTitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left — candidate details + notes */}
        <div className="lg:col-span-2 space-y-6">

          {/* Pipeline tracker */}
          {!terminal && (
            <Panel title="Pipeline Progress" description={`Stage ${currentIdx + 1} of ${PIPELINE_STAGES.length}`}>
              <ol className="flex items-start">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const isDone    = idx < currentIdx
                  const isCurrent = idx === currentIdx
                  const isLast    = idx === PIPELINE_STAGES.length - 1

                  return (
                    <li key={stage} className={`flex items-start ${isLast ? '' : 'flex-1'}`}>
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center
                          justify-center text-xs font-bold
                          transition-all
                          ${isDone
                            ? 'bg-brand-600 text-white'
                            : isCurrent
                              ? 'bg-surface text-brand-600 ring-2 ring-brand-600 shadow-[0_0_0_6px_var(--color-brand-50)]'
                              : 'bg-subtle text-fg-faint ring-1 ring-line'}
                        `}>
                          {isDone
                            ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                            : idx + 1}
                        </div>
                        <span className={`text-[11px] font-semibold text-center
                          leading-tight hidden sm:block w-16
                          ${isCurrent
                            ? 'text-brand-600'
                            : isDone
                              ? 'text-fg-muted'
                              : 'text-fg-faint'}
                        `}>
                          {stage === 'UNDER_REVIEW'
                            ? 'Review'
                            : STATUS_LABELS[stage]?.split(' ')[0]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-0.5 mt-4 mx-1 rounded-full
                          ${idx < currentIdx
                            ? 'bg-brand-600'
                            : 'bg-line'}
                        `}/>
                      )}
                    </li>
                  )
                })}
              </ol>
            </Panel>
          )}

          {/* Cover note */}
          {application.coverNote && (
            <Panel title="Cover Note">
              <p className="text-sm text-fg-muted leading-relaxed
                whitespace-pre-line">
                {application.coverNote}
              </p>
            </Panel>
          )}

          {/* Internal notes */}
          <Panel
            title="Internal Notes"
            actions={
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-subtle bg-muted
                px-2 py-1 rounded-full">
                <Icon name="lock" className="w-3 h-3" strokeWidth={2} />
                Only visible to recruiters
              </span>
            }
          >
            {/* Add note */}
            <div className="mb-6">
              <textarea
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value)
                  setNoteError('')
                }}
                rows={3}
                placeholder="Add an internal note about this candidate..."
                aria-label="Internal note"
                className={`w-full px-3.5 py-3 border rounded-xl text-sm bg-surface
                  resize-none shadow-xs focus:outline-none focus:ring-4
                  focus:ring-brand-500/15 focus:border-brand-500
                  placeholder-fg-faint text-fg
                  ${noteError ? 'border-red-400' : 'border-line hover:border-line-strong'}`}
              />
              {noteError && (
                <p className="text-xs text-red-500 font-medium mt-1.5">{noteError}</p>
              )}
              <div className="flex items-center justify-between mt-2.5">
                <span className={`inline-flex items-center gap-1 text-xs font-medium
                  transition-opacity duration-300
                  ${noteSuccess
                    ? 'text-emerald-600 opacity-100'
                    : 'opacity-0'}`}>
                  <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Note added
                </span>
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  loading={noteLoading}
                  disabled={!noteContent.trim()}
                >
                  Add Note
                </Button>
              </div>
            </div>

            {/* Notes list */}
            {application.notes && application.notes.length > 0 ? (
              <ol className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2
                before:w-px before:bg-line">
                {[...application.notes].reverse().map((note) => (
                  <li key={note.id} className="relative flex gap-3">
                    <div className="relative z-10 w-6 h-6 rounded-full bg-brand-50 ring-2 ring-surface
                      flex items-center justify-center text-brand-700
                      text-[11px] font-bold flex-shrink-0">
                      {note.recruiterName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 bg-subtle border border-line rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-xs font-semibold text-fg truncate">
                          {note.recruiterName}
                        </span>
                        <span className="text-[11px] text-fg-faint whitespace-nowrap">
                          {formatDateTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-fg-muted leading-relaxed whitespace-pre-line">
                        {note.content}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center py-6 rounded-xl border border-dashed border-line">
                <p className="text-sm text-fg-subtle">
                  No notes yet. Add the first one above.
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* Right — rating + actions */}
        <div className="space-y-6 lg:sticky lg:top-24">

          {/* Pipeline actions */}
          <Panel title="Pipeline Actions">
            {statusError && (
              <div className="mb-4">
                <Alert type="error" message={statusError} />
              </div>
            )}
            {statusSuccess && (
              <div className="mb-4">
                <Alert type="success" message={statusSuccess} />
              </div>
            )}

            {terminal ? (
              <div className={`
                flex items-center justify-center gap-2
                rounded-xl p-4 text-sm font-medium text-center ring-1 ring-inset
                ${application.status === 'HIRED'
                  ? 'bg-emerald-50 ring-emerald-200 text-emerald-700'
                  : application.status === 'REJECTED'
                    ? 'bg-red-50 ring-red-200 text-red-700'
                    : 'bg-muted ring-line text-fg-subtle'}
              `}>
                {application.status === 'HIRED' && (
                  <>
                    <Icon name="sparkles" className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                    This candidate has been hired
                  </>
                )}
                {application.status === 'REJECTED' && (
                  <>
                    <Icon name="xCircle" className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                    This application was rejected
                  </>
                )}
                {application.status === 'WITHDRAWN' && (
                  <>
                    <Icon name="xMark" className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                    Candidate withdrew this application
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Legal forward moves */}
                {legalMoves
                  .filter(s => s !== 'REJECTED')
                  .map((status) => (
                    <div key={status}>
                      {confirmStatus === status ? (
                        <div className="bg-brand-50 ring-1 ring-inset ring-brand-200
                          rounded-xl p-3 text-center animate-fade-up">
                          <p className="text-[13px] text-fg mb-3">
                            Move to{' '}
                            <strong>{STATUS_LABELS[status]}</strong>?
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              loading={statusLoading}
                              onClick={() => handleStatusChange(status)}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setConfirmStatus(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          fullWidth
                          size="lg"
                          onClick={() => setConfirmStatus(status)}
                        >
                          Move to {STATUS_LABELS[status]}
                          <Icon name="arrowRight" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                {/* Reject */}
                {legalMoves.includes('REJECTED') && (
                  <div>
                    {confirmStatus === 'REJECTED' ? (
                      <div className="bg-red-50 ring-1 ring-inset ring-red-200
                        rounded-xl p-3 text-center animate-fade-up">
                        <p className="text-[13px] text-fg mb-3">
                          Reject this application?
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="danger"
                            size="sm"
                            loading={statusLoading}
                            onClick={() => handleStatusChange('REJECTED')}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setConfirmStatus(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => setConfirmStatus('REJECTED')}
                        className="!text-red-600 dark:!text-red-400 hover:!bg-red-50 hover:!border-red-200"
                      >
                        <Icon name="xMark" className="w-3.5 h-3.5" strokeWidth={2} />
                        Reject Application
                      </Button>
                    )}
                  </div>
                )}

                {/* Legal moves note */}
                <p className="text-xs text-center text-fg-faint pt-1">
                  Only valid next stages are shown above
                </p>
              </div>
            )}
          </Panel>

          {/* Rating card */}
          <Panel title="Candidate Rating">
            <div className="flex flex-col items-center gap-2.5">
              {/* Star picker */}
              <div className="flex gap-1.5" role="radiogroup" aria-label="Candidate rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={application.rating === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    disabled={ratingLoading}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 rounded-md transition-transform hover:scale-110
                      disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || application.rating || 0)
                          ? 'text-amber-400'
                          : 'text-line-strong'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18
                        6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01
                        L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>

              {/* Rating label */}
              <p className="text-[13px] font-medium text-fg-subtle">
                {application.rating
                  ? `Rated ${application.rating}/5`
                  : 'Click to rate this candidate'}
              </p>

              {/* Success */}
              <div className={`inline-flex items-center gap-1 text-xs font-medium
                text-emerald-600 transition-opacity
                duration-300 ${ratingSuccess ? 'opacity-100' : 'opacity-0'}`}>
                <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                Rating saved
              </div>
            </div>
          </Panel>

          {/* Application info */}
          <Panel title="Application Details">
            <dl className="divide-y divide-line -my-2">
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-fg-subtle">Applied</dt>
                <dd className="text-[13px] font-medium text-fg text-right">
                  {formatDate(application.appliedAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-fg-subtle">Last Updated</dt>
                <dd className="text-[13px] font-medium text-fg text-right">
                  {formatDate(application.updatedAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-fg-subtle">Current Status</dt>
                <dd>
                  <StatusBadge status={application.status} />
                </dd>
              </div>
            </dl>
            {application.resumeUrl && (
              <button
                type="button"
                onClick={handleResumeDownload}
                disabled={resumeLoading}
                className="mt-5 w-full flex items-center gap-3 p-3 rounded-xl border border-line
                  bg-subtle hover:bg-muted hover:border-line-strong text-left group
                  disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="w-9 h-9 rounded-lg bg-red-50 text-red-600 ring-1 ring-inset ring-red-100
                  flex items-center justify-center flex-shrink-0">
                  <Icon name="document" className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-fg">
                    {resumeLoading ? 'Opening resume...' : 'View Resume'}
                  </span>
                  <span className="block text-xs text-fg-subtle">
                    {!getResumePath(application.resumeUrl)
                      ? "Opens the candidate's resume link"
                      : /\.pdf$/i.test(application.resumeUrl)
                        ? 'Opens in a new tab'
                        : 'Downloads the file'}
                  </span>
                </span>
                <span className="text-fg-faint group-hover:text-fg group-hover:translate-x-0.5 transition-transform">
                  <Icon name="arrowRight" className="w-4 h-4" />
                </span>
              </button>
            )}
            {resumeError && (
              <div className="mt-3">
                <Alert type="error" message={resumeError} />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </Layout>
  )
}
