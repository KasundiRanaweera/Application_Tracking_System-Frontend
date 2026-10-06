import Icon from '../ui/Icon'
import { LogoMark } from '../ui/Logo'
import { StatusBadge } from '../ui/Badge'

// Illustrative sample data for the decorative candidate-app preview.
const JOBS = [
  { title: 'Senior Frontend Engineer', location: 'Colombo',  mode: 'Hybrid',  type: 'Full-time', icon: 'laptop',   salary: 'Rs. 450,000 – 600,000', posted: 'Today' },
  { title: 'UX Designer',              location: 'Kandy',    mode: 'Remote',  type: 'Full-time', icon: 'palette',  salary: 'Rs. 300,000 – 380,000', posted: '2d ago' },
  { title: 'Data Analyst',             location: 'Colombo',  mode: 'On-site', type: 'Contract',  icon: 'chartBar', salary: 'Rs. 250,000 – 320,000', posted: '4d ago' },
]

const APPLICATIONS = [
  { title: 'UX Designer',          status: 'SHORTLISTED',  stage: 2 },
  { title: 'Product Manager',      status: 'INTERVIEW',    stage: 3 },
  { title: 'QA Engineer',          status: 'UNDER_REVIEW', stage: 1 },
]

function Progress({ stage }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`h-1 flex-1 rounded-full ${i <= stage ? 'bg-brand-600' : 'bg-muted'}`} />
      ))}
    </div>
  )
}

export default function HeroMockup() {
  return (
    <div className="relative" aria-hidden="true">
      {/* Glow */}
      <div className="absolute -inset-x-6 -top-10 -bottom-6 sm:-inset-x-12 rounded-[40px]
        bg-gradient-to-b from-brand-500/25 via-brand-500/10 to-transparent blur-3xl" />

      {/* Browser window */}
      <div className="relative rounded-xl sm:rounded-2xl border border-line bg-surface/90 backdrop-blur
        shadow-[0_40px_100px_-30px_rgb(15_23_42/0.35)] overflow-hidden">
        <div className="flex items-center gap-2 px-3 sm:px-4 h-9 sm:h-10 border-b border-line bg-subtle">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 sm:ml-4 flex-1 max-w-sm h-5 sm:h-6 rounded-md bg-surface border border-line
            text-[10px] sm:text-[11px] text-fg-faint flex items-center px-2.5 truncate">
            talentbridge / jobs
          </span>
        </div>

        {/* App bar */}
        <div className="flex items-center justify-between gap-3 px-3 sm:px-5 h-11 sm:h-12 border-b border-line">
          <div className="flex items-center gap-4 min-w-0">
            <span className="flex items-center gap-2">
              <LogoMark size="sm" />
              <span className="hidden sm:inline text-[12px] font-bold text-fg">TalentBridge</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="px-2 py-1 rounded-md bg-muted text-[11px] font-medium text-fg flex items-center gap-1.5">
                <Icon name="search" className="w-3 h-3 text-brand-600" /> Browse Jobs
              </span>
              <span className="px-2 py-1 rounded-md text-[11px] font-medium text-fg-subtle flex items-center gap-1.5">
                <Icon name="clipboardList" className="w-3 h-3" /> My Applications
              </span>
            </span>
          </div>
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-brand-600 text-white
            text-[9px] font-bold flex items-center justify-center">AF</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_17rem] sm:min-h-[340px]">
          {/* Open positions */}
          <div className="p-3 sm:p-5 min-w-0">
            <div className="flex items-end justify-between gap-3 mb-3">
              <div>
                <p className="text-[13px] sm:text-[15px] font-bold text-fg">Open Positions</p>
                <p className="text-[10px] sm:text-[11px] text-fg-subtle">18 positions available</p>
              </div>
              <span className="hidden sm:flex gap-1">
                {['Remote', 'Full-time'].map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 ring-1 ring-inset
                    ring-brand-200 text-[10px] font-medium">{c}</span>
                ))}
              </span>
            </div>

            <div className="h-8 sm:h-9 rounded-lg border border-line bg-surface shadow-xs flex items-center gap-2 px-3 mb-3">
              <Icon name="search" className="w-3.5 h-3.5 text-fg-faint" />
              <span className="text-[11px] text-fg-faint">Search by job title or keyword…</span>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
              {JOBS.map((job, i) => (
                <div key={job.title} className={[
                  'rounded-lg bg-surface ring-1 ring-line shadow-card p-3',
                  i === 2 ? 'hidden xl:block' : '',
                  i === 1 ? 'hidden sm:block' : '',
                ].join(' ')}>
                  <div className="flex items-start justify-between">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100
                      flex items-center justify-center">
                      <Icon name={job.icon} className="w-4 h-4" />
                    </span>
                    <span className="text-[9px] text-fg-faint">{job.posted}</span>
                  </div>
                  <p className="mt-2.5 text-[12px] font-bold text-fg leading-snug">{job.title}</p>
                  <p className="text-[10px] text-fg-subtle mt-0.5 flex items-center gap-1">
                    <Icon name="mapPin" className="w-2.5 h-2.5" /> {job.location}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-medium text-fg-muted">{job.mode}</span>
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-medium text-fg-muted">{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
                    <span className="text-[10px] font-semibold text-fg truncate">{job.salary}</span>
                    <span className="w-5 h-5 rounded-full bg-ink text-on-ink flex items-center justify-center flex-shrink-0">
                      <Icon name="arrowRight" className="w-2.5 h-2.5" strokeWidth={2.4} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My applications */}
          <div className="hidden lg:block border-l border-line bg-subtle/60 p-4">
            <p className="text-[12px] font-bold text-fg mb-0.5">My Applications</p>
            <p className="text-[10px] text-fg-subtle mb-3">3 active</p>
            <div className="space-y-2.5">
              {APPLICATIONS.map(app => (
                <div key={app.title} className="rounded-lg bg-surface ring-1 ring-line shadow-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-fg truncate">{app.title}</p>
                  </div>
                  <div className="mt-1.5 scale-90 origin-left"><StatusBadge status={app.status} /></div>
                  <Progress stage={app.stage} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating: application submitted */}
      <div className="hidden lg:flex absolute -left-8 -bottom-7 animate-float
        items-center gap-3 rounded-xl bg-surface border border-line shadow-pop px-4 py-3">
        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon name="checkCircle" className="w-4 h-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-fg">Application submitted</p>
          <p className="text-[11px] text-fg-subtle">Senior Frontend Engineer</p>
        </div>
      </div>

      {/* Floating: status update */}
      <div className="hidden lg:flex absolute -right-6 -top-9 animate-float [animation-delay:1.5s]
        items-center gap-3 rounded-xl bg-surface border border-line shadow-pop px-4 py-3">
        <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
          <Icon name="bolt" className="w-4 h-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-fg">Moved to Interview</p>
          <p className="text-[11px] text-fg-subtle">Product Manager · Stage 4 of 6</p>
        </div>
      </div>
    </div>
  )
}
