export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col items-center justify-center mb-12 text-center animate-pulse">
        <div className="h-10 w-48 bg-neutral-200 rounded mb-4"></div>
        <div className="h-4 w-96 max-w-full bg-neutral-100 rounded"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-neutral-200 animate-pulse">
        <div className="h-4 w-32 bg-neutral-200 rounded mb-4 md:mb-0"></div>
        <div className="h-10 w-40 bg-neutral-200 rounded"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col animate-pulse">
            <div className="aspect-square bg-neutral-100 mb-4 w-full rounded"></div>
            <div className="h-4 w-24 bg-neutral-200 rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-neutral-100 rounded mb-3"></div>
            <div className="h-4 w-16 bg-neutral-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
