"use client";

import { useState } from "react";
import ProductVariants from "./ProductVariants";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductPurchaseActions({ product }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  const [selectedVariantId, setSelectedVariantId] = useState(() => {
    if (!hasVariants) return null;
    const firstAvailable = product.variants.find((v) => v.stock > 0);
    return firstAvailable ? firstAvailable.id : null;
  });

  let isPurchasable = false;
  let disabledReason = "Sold Out";

  if (hasVariants) {
    if (selectedVariantId) {
      const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
      if (selectedVariant && selectedVariant.stock > 0) {
        isPurchasable = true;
      }
    } else {
      disabledReason = "Select an option";
      const anyInStock = product.variants.some((v) => v.stock > 0);
      if (!anyInStock) disabledReason = "Sold Out";
    }
  } else {
    if (product.availability !== "out-of-stock") {
      isPurchasable = true;
    }
  }

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleScrollToDelivery = () => {
    const tabsElement = document.getElementById("product-tabs");
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-5 border-t border-neutral-100 pt-6">
      {/* Variants (Sizes / Colors) */}
      {hasVariants && (
        <ProductVariants
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
        />
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between border border-neutral-300 w-full sm:w-36 h-12 px-3 bg-white shrink-0">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium sm:hidden">Quantity</span>
            <div className="flex items-center justify-between w-full sm:w-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !isPurchasable}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-sm font-medium text-neutral-900 w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!isPurchasable}
                className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed text-lg font-light transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="grow">
            <AddToCartButton
              product={product}
              selectedVariantId={selectedVariantId}
              isPurchasable={isPurchasable}
              disabledReason={disabledReason}
              quantity={quantity}
            />
          </div>
        </div>

        {/* Wishlist Button */}
        <WishlistButton product={product} />
      </div>

      {/* Secondary Action Links (Delivery & Return, Share) */}
      <div className="flex items-center justify-between py-2 border-t border-b border-neutral-100 text-xs text-neutral-600">
        <button
          type="button"
          onClick={handleScrollToDelivery}
          className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors font-medium py-1"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>Delivery & Return Policy</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors font-medium py-1"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          <span>{copiedShare ? "Link Copied!" : "Share"}</span>
        </button>
      </div>

      {/* Luxury Trust Indicators */}
      <div className="pt-2 space-y-2 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="text-neutral-900 font-semibold">✓</span>
          <span>Dispatched in 1–3 business days with express tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-900 font-semibold">✓</span>
          <span>Crafted specifically to preserve and support luxury leather</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-900 font-semibold">✓</span>
          <span>14-day hassle-free exchange & return policy</span>
        </div>
      </div>
    </div>
  );
}
