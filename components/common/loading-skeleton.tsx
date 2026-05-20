import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SignalCardSkeleton() {
  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-7 w-28 mb-4" />
      <Skeleton className="h-2 w-full mb-4" />
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-full mb-3" />
      <div className="flex gap-4 pt-3">
        <Skeleton className="h-8 w-12" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function ChartSkeleton({ height = 500 }: { height?: number }) {
  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1f2937] flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  )
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  )
}
