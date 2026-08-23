export default function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-[#e2e8f0] p-6
        ${hover ? 'hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}