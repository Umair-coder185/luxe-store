import Link from "next/link";

export default function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-4">Your Cart</h1>
      <p className="text-base text-neutral-500 mb-8 max-w-md">
        Your cart is currently empty. Explore the collection and discover something worth keeping.
      </p>
      <Link 
        href="/products"
        className="inline-block bg-neutral-900 text-white px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
