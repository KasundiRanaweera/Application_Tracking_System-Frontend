export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
        flex flex-col sm:flex-row items-center justify-between gap-2
        text-xs text-slate-400">
        <span>© {new Date().getFullYear()} TalentBridge ATS</span>
        <span>Applicant tracking for modern hiring teams</span>
      </div>
    </footer>
  )
}