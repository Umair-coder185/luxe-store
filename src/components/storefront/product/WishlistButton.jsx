"use client";

import useWishlistStore, { selectIsWishlisted, selectWishlistHasHydrated } from "@/stores/storefront/wishlistStore";

export default function WishlistButton({ product }) {
  const isHydrated = useWishlistStore(selectWishlistHasHydrated);
  const isWishlisted = useWishlistStore(selectIsWishlisted(product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  const handleToggle = () => {
    const payload = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ? { url: product.images[0].url } : null,
    };
    toggleItem(payload);
  };

  if (!isHydrated) {
    // Neutral stable state before hydration finishes
    return (
      <button
        disabled
        className="mt-3 w-full py-3 text-sm font-medium tracking-wide uppercase transition-colors flex items-center justify-center gap-2 border border-neutral-200 text-neutral-400 cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Save to Wishlist
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-pressed={isWishlisted}
      className={`
        mt-3 w-full py-3 text-sm font-medium tracking-wide uppercase transition-colors
        flex items-center justify-center gap-2 border
        ${isWishlisted 
          ? "border-neutral-900 bg-neutral-50 text-neutral-900" 
          : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
        }
      `}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={isWishlisted ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
    </button>
  );
}
