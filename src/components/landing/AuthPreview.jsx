import Icon from '../ui/Icon'
import { StatusBadge } from '../ui/Badge'

// Decorative showcase panels for the auth pages, styled like the
// landing hero mockup. Sample data only.

function FloatingNote({ icon, tone, title, subtitle, className = '' }) {
  const tones = {
    brand:   'bg-brand-50 text-brand-600',
    success: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className={`absolute flex items-center gap-3 rounded-xl bg-surface border border-line shadow-pop
      px-4 py-3 animate-float ${className}`}>
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tones[tone]}`}>
        <Icon name={icon} className="w-4 h-4" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[12px] font-semibold text-fg">{title}</p>
        <p className="text-[11px] text-fg-subtle">{subtitle}</p>
      </div>
    </div>
  )
}

const APPLICATIONS = [
  { title: 'UX Designer',      place: 'Kandy · Remote',      status: 'SHORTLISTED',  stage: 2 },
  { title: 'Product Manager',  place: 'Colombo · Hybrid',    status: 'INTERVIEW',    stage: 3 },
  { title: 'QA Engineer',      place: 'Colombo · On-site',   status: 'UNDER_REVIEW', stage: 1 },
]

export function ApplicationsPreview() {
  return (
    <div className="relative pr-8 pt-6" aria-hidden="true">
      <div className="rounded-2xl border border-line bg-surface/90 backdrop-blur shadow-[0_30px_80px_-30px_rgb(15_23_42/0.35)]
        overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div>
            <p className="text-[13px] font-bold text-fg">My Applications</p>
            <p className="text-[11px] text-fg-subtle">3 active applications</p>
          </div>
        </div>
        <ul className="divide-y divide-line">
          {APPLICATIONS.map(app => (
            <li key={app.title} className="flex items-center gap-4 px-5 py-3.5">
              <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100
                flex items-center justify-center flex-shrink-0">
                <Icon name="briefcase" className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-fg truncate">{app.title}</p>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-[11px] text-fg-subtle mt-0.5">{app.place}</p>
                <div className="flex items-center gap-1 mt-2">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={`h-1 flex-1 rounded-full ${i <= app.stage ? 'bg-brand-600' : 'bg-muted'}`} />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <FloatingNote
        icon="bolt" tone="brand"
        title="Moved to Interview" subtitle="Product Manager · Stage 4 of 6"
        className="-right-2 -top-12"
      />
    </div>
  )
}

const STEPS = [
  { icon: 'users',         title: 'Create your account',     body: 'Free, and takes under a minute' },
  { icon: 'search',        title: 'Browse open positions',   body: 'Search and filter by work mode, type or location' },
  { icon: 'clipboardList', title: 'Apply & track progress',  body: 'Follow every application from Applied to Hired' },
]

export function StepsPreview() {
  return (
    <div className="relative pr-8 pb-10" aria-hidden="true">
      <ol className="space-y-3">
        {STEPS.map((step, i) => (
          <li key={step.title}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface/90 backdrop-blur
              shadow-card px-5 py-4">
            <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100
              flex items-center justify-center flex-shrink-0">
              <Icon name={step.icon} className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-fg">{step.title}</p>
              <p className="text-[12px] text-fg-subtle">{step.body}</p>
            </div>
            <span className="font-display text-2xl font-extrabold text-line-strong tabular-nums">0{i + 1}</span>
          </li>
        ))}
      </ol>

      <FloatingNote
        icon="checkCircle" tone="success"
        title="Application submitted" subtitle="Senior Frontend Engineer"
        className="right-0 -bottom-2"
      />
    </div>
  )
}
