"use client";

import Link from "next/link";
import useCartStore, { selectCartCount, selectCartHasHydrated } from "@/stores/storefront/cartStore";
import useWishlistStore, { selectWishlistCount, selectWishlistHasHydrated } from "@/stores/storefront/wishlistStore";

export default function CartWishlistNav({ isMobile, onClick }) {
  const cartCount = useCartStore(selectCartCount);
  const cartHydrated = useCartStore(selectCartHasHydrated);
  
  const wishlistCount = useWishlistStore(selectWishlistCount);
  const wishlistHydrated = useWishlistStore(selectWishlistHasHydrated);

  const cartCountDisplay = cartHydrated && cartCount > 0 ? cartCount : null;
  const wishlistCountDisplay = wishlistHydrated && wishlistCount > 0 ? wishlistCount : null;

  // Render for mobile menu
  if (isMobile) {
    return (
      <>
        <Link 
          href="/sign-in" 
          onClick={onClick} 
          className="flex items-center justify-between text-lg font-medium text-neutral-900 hover:text-neutral-600"
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Sign in</span>
          </div>
        </Link>
        <Link 
          href="/wishlist" 
          onClick={onClick} 
          className="flex items-center justify-between text-lg font-medium text-neutral-900 hover:text-neutral-600"
          aria-label={wishlistCountDisplay ? `Wishlist, ${wishlistCountDisplay} saved product${wishlistCountDisplay > 1 ? 's' : ''}` : "Wishlist"}
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span>Wishlist</span>
          </div>
          {wishlistCountDisplay !== null && (
            <span className="text-sm bg-neutral-100 px-2 py-0.5 rounded-full text-neutral-600">
              {wishlistCountDisplay > 99 ? "99+" : wishlistCountDisplay}
            </span>
          )}
        </Link>
        <Link 
          href="/cart" 
          onClick={onClick} 
          className="flex items-center justify-between text-lg font-medium text-neutral-900 hover:text-neutral-600"
          aria-label={cartCountDisplay ? `Cart, ${cartCountDisplay} item${cartCountDisplay > 1 ? 's' : ''}` : "Cart"}
        >
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>Bag</span>
          </div>
          {cartCountDisplay !== null && (
            <span className="text-sm bg-neutral-900 px-2 py-0.5 rounded-full text-white">
              {cartCountDisplay > 99 ? "99+" : cartCountDisplay}
            </span>
          )}
        </Link>
      </>
    );
  }

  // Render for desktop navbar
  return (
    <>
      <Link 
        href="/sign-in" 
        className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span className="text-sm font-medium">Sign in</span>
      </Link>
      
      <Link 
        href="/wishlist" 
        className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
        aria-label={wishlistCountDisplay ? `Wishlist, ${wishlistCountDisplay} saved product${wishlistCountDisplay > 1 ? 's' : ''}` : "Wishlist"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span className="text-sm font-medium">Wishlist</span>
        {wishlistCountDisplay !== null && (
          <span className="text-xs bg-white text-neutral-900 px-1.5 py-0.5 rounded-sm tabular-nums">
            {wishlistCountDisplay > 99 ? "99+" : wishlistCountDisplay}
          </span>
        )}
      </Link>
      
      <Link 
        href="/cart" 
        className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
        aria-label={cartCountDisplay ? `Cart, ${cartCountDisplay} item${cartCountDisplay > 1 ? 's' : ''}` : "Cart"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span className="text-sm font-medium">Bag</span>
        {cartCountDisplay !== null && (
          <span className="text-xs bg-white text-neutral-900 px-1.5 py-0.5 rounded-sm tabular-nums">
            {cartCountDisplay > 99 ? "99+" : cartCountDisplay}
          </span>
        )}
      </Link>
    </>
  );
}
