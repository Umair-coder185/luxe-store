// app/(admin)/admin/brands/loading.js

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

export default function BrandsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SkeletonPulse className="mb-2 h-3 w-14" />
          <SkeletonPulse className="mb-1.5 h-6 w-28" />
          <SkeletonPulse className="h-4 w-56" />
        </div>
        <SkeletonPulse className="h-10 w-28 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-4 py-3">
          <SkeletonPulse className="h-9 w-52 rounded-lg" />
        </div>
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              {/* Brand logo + name */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <SkeletonPulse className="h-9 w-9 flex-shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <SkeletonPulse className="mb-1 h-4 w-28" />
                  <SkeletonPulse className="h-3 w-16" />
                </div>
              </div>
              {/* Country */}
              <SkeletonPulse className="h-4 w-16" />
              {/* Status badge */}
              <SkeletonPulse className="h-5 w-14 rounded-full" />
              {/* Order */}
              <SkeletonPulse className="h-4 w-8" />
              {/* Actions */}
              <SkeletonPulse className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}