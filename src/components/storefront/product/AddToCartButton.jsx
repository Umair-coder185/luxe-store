"use client";

import { useState, useEffect } from "react";
import useCartStore from "@/stores/storefront/cartStore";

export default function AddToCartButton({ 
  product, 
  selectedVariantId, 
  isPurchasable, 
  disabledReason 
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [status, setStatus] = useState("idle"); // idle, success

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setStatus("idle"), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleAddToCart = () => {
    if (!isPurchasable) return;

    let variant = null;
    if (product.variants && product.variants.length > 0) {
      variant = product.variants.find(v => v.id === selectedVariantId);
      if (!variant || variant.stock <= 0) return;
    }

    const payload = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ? { url: product.images[0].url } : null,
      variantId: variant ? variant.id : null,
      size: variant?.size ?? null,
      color: variant?.color ?? null,
      quantity: 1,
    };

    addItem(payload);
    setStatus("success");
  };

  const isSuccess = status === "success";

  let buttonText = "Add to Cart";
  if (isSuccess) buttonText = "Added";
  else if (!isPurchasable) buttonText = disabledReason || "Sold Out";

  return (
    <div className="mt-4">
      <button
        onClick={handleAddToCart}
        disabled={!isPurchasable || isSuccess}
        className={`
          w-full py-4 text-sm font-medium tracking-wide uppercase transition-colors
          flex items-center justify-center gap-2
          ${isSuccess 
            ? "bg-green-600 text-white border border-transparent" 
            : !isPurchasable
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed border border-transparent"
              : "bg-neutral-900 text-white hover:bg-neutral-800 border border-transparent"
          }
        `}
        aria-live="polite"
      >
        {isSuccess && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
        {buttonText}
      </button>
    </div>
  );
}
