export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6
        flex flex-col sm:flex-row items-center justify-between gap-2
        text-xs text-fg-subtle">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-500 to-brand-700
            flex items-center justify-center text-[8px] font-extrabold text-white">
            TB
          </span>
          <span>© {new Date().getFullYear()} TalentBridge ATS</span>
        </div>
        <span>Applicant tracking for modern hiring teams</span>
      </div>
    </footer>
  )
}
