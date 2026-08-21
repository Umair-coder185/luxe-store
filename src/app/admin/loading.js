// app/(admin)/admin/loading.js

function SkeletonPulse({ className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={
        "animate-pulse rounded-md bg-neutral-200" + (className ? ` ${className}` : "")
      }
    />
  );
}

function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <SkeletonPulse className="mb-3 h-4 w-24" />
      <SkeletonPulse className="mb-1 h-8 w-20" />
      <SkeletonPulse className="h-3 w-32" />
    </div>
  );
}

function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="border-b border-neutral-100 px-5 py-3.5">
        <SkeletonPulse className="h-5 w-36" />
      </div>
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonPulse
                key={j}
                className="h-4 flex-1"
                style={{ maxWidth: j === 0 ? "40%" : undefined }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <SkeletonPulse className="h-7 w-48" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TableSkeleton rows={5} cols={4} />
        </div>
        <div>
          <TableSkeleton rows={4} cols={2} />
        </div>
      </div>
    </div>
  );
}