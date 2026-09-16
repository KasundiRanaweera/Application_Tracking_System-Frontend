function Skeleton({ className = '' }) {
  return <div className={['animate-pulse rounded-md bg-slate-200', className].join(' ')} aria-hidden="true" />
}

export function RowListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="hidden h-8 w-20 sm:block" />
        </div>
      ))}
    </div>
  )
}

export function ApplicationListSkeleton({ count = 5 }) {
  return <RowListSkeleton count={count} />
}

export function RowStackSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-slate-100 bg-white p-5">
          <Skeleton className="mb-4 h-4 w-2/5" />
          <Skeleton className="mb-2 h-8 w-1/2" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  )
}
