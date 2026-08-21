// app/(admin)/admin/collections/loading.js

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

export default function CollectionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SkeletonPulse className="mb-2 h-3 w-28" />
          <SkeletonPulse className="mb-1.5 h-6 w-32" />
          <SkeletonPulse className="h-4 w-60" />
        </div>
        <SkeletonPulse className="h-10 w-36 rounded-lg" />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-4 py-3">
          <SkeletonPulse className="h-9 w-56 rounded-lg" />
        </div>
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <SkeletonPulse className="h-10 w-14 flex-shrink-0 rounded-lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SkeletonPulse className="mb-1 h-4 w-28" />
                    <SkeletonPulse className="h-4 w-14 rounded-full" />
                  </div>
                  <SkeletonPulse className="h-3 w-16" />
                </div>
              </div>
              <SkeletonPulse className="hidden h-4 w-24 sm:block" />
              <SkeletonPulse className="h-5 w-16 rounded-full" />
              <SkeletonPulse className="h-4 w-8" />
              <SkeletonPulse className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}