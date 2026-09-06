export default function CheckoutLoading() {
  return (
    <div className="bg-neutral-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 w-48 bg-neutral-200 rounded-sm mb-10"></div>
          <div className="h-64 bg-white shadow-sm rounded-sm p-6 w-full"></div>
        </div>
      </div>
    </div>
  );
}
