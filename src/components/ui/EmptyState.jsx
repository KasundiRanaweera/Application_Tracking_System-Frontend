export default function EmptyState({ icon = '🔍', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-[#f2f4f6] rounded-2xl flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#0f172a] font-sans mb-2">{title}</h3>
      {description && <p className="text-sm text-[#64748b] font-sans max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}
