// app/(admin)/admin/categories/loading.js

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

export default function CategoriesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <SkeletonPulse className="mb-1.5 h-6 w-36" />
          <SkeletonPulse className="h-4 w-24" />
        </div>
        <SkeletonPulse className="h-9 w-32 rounded-lg" />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-4 py-3">
          <SkeletonPulse className="h-9 w-64 rounded-lg" />
        </div>
        <div className="divide-y divide-neutral-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <SkeletonPulse className="mb-1 h-4 w-32" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
              <SkeletonPulse className="h-4 w-24" />
              <SkeletonPulse className="h-5 w-14 rounded-full" />
              <SkeletonPulse className="h-4 w-10" />
              <SkeletonPulse className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}