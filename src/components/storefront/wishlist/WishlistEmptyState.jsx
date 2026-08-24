import Link from "next/link";

export default function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-4">Your Wishlist</h1>
      <p className="text-base text-neutral-500 mb-10 max-w-md">
        Your wishlist is empty. Save pieces you would like to revisit.
      </p>
      <Link 
        href="/products"
        className="inline-block bg-neutral-900 text-white px-10 py-4 text-sm font-medium tracking-wide uppercase hover:bg-neutral-800 transition-colors"
      >
        Explore Products
      </Link>
    </div>
  );
}
