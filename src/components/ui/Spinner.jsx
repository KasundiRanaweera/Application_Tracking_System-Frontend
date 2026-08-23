export default function Spinner({ fullPage = false }) {
  const el = (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="w-8 h-8 border-2 border-[#e2e8f0] border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-[#64748b] font-sans">Loading...</p>
    </div>
  )
  if (fullPage) return <div className="min-h-screen flex items-center justify-center">{el}</div>
  return el
}
