import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import { StatusBadge } from '../../components/ui/Badge'
import {
  getApplicationDetail,
  rateApplication,
  addNote,
  changeApplicationStatus,
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
  const [confirmStatus, setConfirmStatus]   = useState(null)

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
    setConfirmStatus(null)
    try {
      const res = await changeApplicationStatus(id, newStatus)
      setApplication(res.data)
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Failed to change status.')
    } finally {
      setStatusLoading(false)
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

  if (loading) return <Layout><Spinner /></Layout>

  if (error || !application) return (
    <Layout>
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-[#0f172a] mb-2">
          {error || 'Application not found'}
        </h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    </Layout>
  )

  const legalMoves  = getLegalNextStatuses(application.status)
  const currentIdx  = getStageIndex(application.status)
  const terminal    = isTerminal(application.status)

  return (
    <Layout>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-[#64748b]
          hover:text-brand-600 mb-6 transition-colors font-medium group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Applicants
      </button>

      {/* Hero header */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start
          justify-between gap-5">

          {/* Candidate info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex
              items-center justify-center text-brand-600 font-bold
              text-xl flex-shrink-0">
              {application.candidateName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">
                {application.candidateName}
              </h1>
              <p className="text-sm text-[#64748b] mt-0.5">
                {application.candidateEmail}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <StatusBadge status={application.status} />
                <span className="text-xs text-[#64748b]">
                  Applied {formatDate(application.appliedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Job info */}
          <div className="bg-[#f7f9fb] border border-[#e2e8f0] rounded-xl
            px-4 py-3 text-sm flex-shrink-0">
            <p className="text-xs font-bold text-[#64748b] uppercase
              tracking-wider mb-1">
              Applied for
            </p>
            <p className="font-semibold text-[#0f172a]">
              {application.jobTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — candidate details + notes */}
        <div className="lg:col-span-2 space-y-5">

          {/* Pipeline tracker */}
          {!terminal && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <h2 className="text-base font-bold text-[#0f172a] mb-5 pb-3
                border-b border-[#e2e8f0]">
                Pipeline Progress
              </h2>
              <div className="flex items-start gap-0">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const isDone    = idx < currentIdx
                  const isCurrent = idx === currentIdx
                  const isLast    = idx === PIPELINE_STAGES.length - 1

                  return (
                    <div key={stage} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-2
                        flex-shrink-0">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center
                          justify-center text-xs font-bold border-2
                          transition-all
                          ${isDone
                            ? 'bg-brand-600 border-brand-600 text-white'
                            : isCurrent
                              ? 'bg-white border-brand-600 text-brand-600 ring-4 ring-brand-50'
                              : 'bg-white border-[#e2e8f0] text-[#94a3b8]'}
                        `}>
                          {isDone
                            ? '✓'
                            : idx + 1}
                        </div>
                        <span className={`text-xs font-medium text-center
                          leading-tight hidden sm:block w-16
                          ${isCurrent
                            ? 'text-brand-600'
                            : isDone
                              ? 'text-[#64748b]'
                              : 'text-[#94a3b8]'}
                        `}>
                          {stage === 'UNDER_REVIEW'
                            ? 'Review'
                            : STATUS_LABELS[stage]?.split(' ')[0]}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-0.5 mx-1
                          ${idx < currentIdx
                            ? 'bg-brand-600'
                            : 'bg-[#e2e8f0]'}
                        `}/>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cover note */}
          {application.coverNote && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
                border-b border-[#e2e8f0]">
                Cover Note
              </h2>
              <p className="text-sm text-[#464555] leading-relaxed
                whitespace-pre-line">
                {application.coverNote}
              </p>
            </div>
          )}

          {/* Internal notes */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0] flex items-center justify-between">
              Internal Notes
              <span className="text-xs font-normal text-[#64748b] bg-[#f2f4f6]
                px-2 py-1 rounded-full">
                Only visible to recruiters
              </span>
            </h2>

            {/* Add note */}
            <div className="mb-5">
              <textarea
                value={noteContent}
                onChange={(e) => {
                  setNoteContent(e.target.value)
                  setNoteError('')
                }}
                rows={3}
                placeholder="Add an internal note about this candidate..."
                className={`w-full px-3.5 py-3 border rounded-xl text-sm
                  resize-none focus:outline-none focus:ring-2
                  focus:ring-brand-500 focus:border-transparent
                  placeholder-[#94a3b8] text-[#0f172a]
                  ${noteError ? 'border-red-400' : 'border-[#e2e8f0]'}`}
              />
              {noteError && (
                <p className="text-xs text-red-500 mt-1">{noteError}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs transition-opacity duration-300
                  ${noteSuccess
                    ? 'text-emerald-600 opacity-100'
                    : 'opacity-0'}`}>
                  ✓ Note added
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
              <div className="space-y-3">
                {[...application.notes].reverse().map((note) => (
                  <div
                    key={note.id}
                    className="bg-[#f7f9fb] border border-[#e2e8f0]
                      rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100
                          flex items-center justify-center text-brand-600
                          text-xs font-bold">
                          {note.recruiterName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold
                          text-[#0f172a]">
                          {note.recruiterName}
                        </span>
                      </div>
                      <span className="text-xs text-[#94a3b8]">
                        {formatDateTime(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#464555] leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#94a3b8] text-center py-4">
                No notes yet. Add the first one above.
              </p>
            )}
          </div>
        </div>

        {/* Right — rating + actions */}
        <div className="space-y-5">

          {/* Rating card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Candidate Rating
            </h2>

            <div className="flex flex-col items-center gap-3">
              {/* Star picker */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={ratingLoading}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110
                      disabled:cursor-not-allowed focus:outline-none"
                  >
                    <svg
                      className={`w-9 h-9 transition-colors ${
                        star <= (hoverRating || application.rating || 0)
                          ? 'text-amber-400'
                          : 'text-[#e2e8f0]'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18
                        6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01
                        L12 2z"/>
                    </svg>
                  </button>
                ))}
              </div>

              {/* Rating label */}
              <p className="text-sm font-medium text-[#64748b]">
                {application.rating
                  ? `Rated ${application.rating}/5`
                  : 'Click to rate this candidate'}
              </p>

              {/* Success */}
              <div className={`text-xs text-emerald-600 transition-opacity
                duration-300 ${ratingSuccess ? 'opacity-100' : 'opacity-0'}`}>
                ✓ Rating saved
              </div>
            </div>
          </div>

          {/* Pipeline actions */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Pipeline Actions
            </h2>

            {statusError && (
              <div className="mb-4">
                <Alert type="error" message={statusError} />
              </div>
            )}

            {terminal ? (
              <div className={`
                rounded-xl p-4 text-sm font-medium text-center
                ${application.status === 'HIRED'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : application.status === 'REJECTED'
                    ? 'bg-red-50 border border-red-200 text-red-600'
                    : 'bg-[#f2f4f6] border border-[#e2e8f0] text-[#64748b]'}
              `}>
                {application.status === 'HIRED' && '🎉 This candidate has been hired'}
                {application.status === 'REJECTED' && '❌ This application was rejected'}
                {application.status === 'WITHDRAWN' && '↩ Candidate withdrew this application'}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Legal forward moves */}
                {legalMoves
                  .filter(s => s !== 'REJECTED')
                  .map((status) => (
                    <div key={status}>
                      {confirmStatus === status ? (
                        <div className="bg-brand-50 border border-brand-200
                          rounded-xl p-3 text-center">
                          <p className="text-xs text-[#0f172a] mb-3">
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
                          onClick={() => setConfirmStatus(status)}
                          className="shadow-sm shadow-brand-100"
                        >
                          → Move to {STATUS_LABELS[status]}
                        </Button>
                      )}
                    </div>
                  ))}

                {/* Reject */}
                {legalMoves.includes('REJECTED') && (
                  <div>
                    {confirmStatus === 'REJECTED' ? (
                      <div className="bg-red-50 border border-red-200
                        rounded-xl p-3 text-center">
                        <p className="text-xs text-[#0f172a] mb-3">
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
                        variant="ghost"
                        fullWidth
                        onClick={() => setConfirmStatus('REJECTED')}
                        className="text-red-500 hover:text-red-700
                          hover:bg-red-50 mt-2"
                      >
                        ✕ Reject Application
                      </Button>
                    )}
                  </div>
                )}

                {/* Legal moves note */}
                <p className="text-xs text-center text-[#94a3b8] pt-1">
                  Only valid next stages are shown above
                </p>
              </div>
            )}
          </div>

          {/* Application info */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <h2 className="text-base font-bold text-[#0f172a] mb-4 pb-3
              border-b border-[#e2e8f0]">
              Application Details
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-bold text-[#64748b] uppercase
                  tracking-wider mb-0.5">
                  Applied
                </dt>
                <dd className="text-sm text-[#0f172a]">
                  {formatDate(application.appliedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-[#64748b] uppercase
                  tracking-wider mb-0.5">
                  Last Updated
                </dt>
                <dd className="text-sm text-[#0f172a]">
                  {formatDate(application.updatedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-[#64748b] uppercase
                  tracking-wider mb-0.5">
                  Current Status
                </dt>
                <dd className="mt-1">
                  <StatusBadge status={application.status} />
                </dd>
              </div>
              {application.resumeUrl && (
                <div>
                  <dt className="text-xs font-bold text-[#64748b] uppercase
                    tracking-wider mb-1">
                    Resume
                  </dt>
                  <dd>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm
                        text-brand-600 font-semibold hover:text-brand-700"
                    >
                      📄 View Resume →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  )
}
