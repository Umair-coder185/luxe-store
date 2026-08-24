import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
      <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-4">Brand Not Found</h1>
      <p className="text-neutral-500 max-w-md mx-auto mb-8">
        This brand is no longer available or the link may be incorrect.
      </p>
      <Link 
        href="/products" 
        className="inline-block px-8 py-4 bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
