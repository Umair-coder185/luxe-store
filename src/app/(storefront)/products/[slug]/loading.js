export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="lg:w-3/5">
          <div className="aspect-[3/4] bg-neutral-100 w-full" />
        </div>
        
        <div className="lg:w-2/5 flex flex-col pt-4">
          <div className="h-4 bg-neutral-100 w-24 mb-4" />
          <div className="h-10 bg-neutral-100 w-3/4 mb-4" />
          <div className="h-6 bg-neutral-100 w-32 mb-10" />
          <div className="h-8 bg-neutral-100 w-20 mb-8" />
          <div className="space-y-3 mb-10">
            <div className="h-4 bg-neutral-100 w-full" />
            <div className="h-4 bg-neutral-100 w-full" />
            <div className="h-4 bg-neutral-100 w-5/6" />
            <div className="h-4 bg-neutral-100 w-4/6" />
          </div>
          <div className="h-10 bg-neutral-100 w-full mt-4" />
        </div>
      </div>
    </div>
  );
}
