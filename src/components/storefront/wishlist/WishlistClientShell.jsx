"use client";

import useWishlistStore, { selectWishlistItems, selectWishlistHasHydrated } from "@/stores/storefront/wishlistStore";
import WishlistGrid from "./WishlistGrid";
import WishlistEmptyState from "./WishlistEmptyState";

export default function WishlistClientShell() {
  const isHydrated = useWishlistStore(selectWishlistHasHydrated);
  const items = useWishlistStore(selectWishlistItems);
  const removeItem = useWishlistStore((state) => state.removeItem);

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-pulse">
        <div className="border-b border-neutral-200 pb-8 mb-12">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Wishlist</h1>
          <div className="h-4 bg-neutral-100 w-48 rounded-sm"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] bg-neutral-100 mb-4 rounded-sm"></div>
              <div className="h-4 bg-neutral-100 w-2/3 mb-2 rounded-sm"></div>
              <div className="h-4 bg-neutral-100 w-1/4 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="border-b border-neutral-200 pb-8 mb-12">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Wishlist</h1>
        <p className="text-neutral-500 mt-2 font-light">
          A considered collection of pieces you&apos;ve saved.
        </p>
      </div>
      
      <WishlistGrid items={items} onRemoveItem={removeItem} />
    </div>
  );
}
