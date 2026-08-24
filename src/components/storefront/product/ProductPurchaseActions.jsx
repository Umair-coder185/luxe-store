"use client";

import { useState } from "react";
import ProductVariants from "./ProductVariants";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductPurchaseActions({ product }) {
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState(() => {
    if (!hasVariants) return null;
    const firstAvailable = product.variants.find((v) => v.stock > 0);
    return firstAvailable ? firstAvailable.id : null;
  });

  let isPurchasable = false;
  let disabledReason = "Sold Out";

  if (hasVariants) {
    if (selectedVariantId) {
      const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
      if (selectedVariant && selectedVariant.stock > 0) {
        isPurchasable = true;
      }
    } else {
      // If there are variants but none is selected (or all sold out)
      disabledReason = "Select an option";
      // Actually if all are sold out, "Sold Out" is fine.
      const anyInStock = product.variants.some(v => v.stock > 0);
      if (!anyInStock) disabledReason = "Sold Out";
    }
  } else {
    // Non-variant product
    if (product.availability !== "out-of-stock") {
      isPurchasable = true;
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-1 border-t border-neutral-100 pt-8">
      {hasVariants && (
        <ProductVariants 
          variants={product.variants} 
          selectedVariantId={selectedVariantId} 
          onSelectVariant={setSelectedVariantId} 
        />
      )}
      
      <div className={hasVariants ? "mt-4" : "mt-0"}>
        <AddToCartButton 
          product={product} 
          selectedVariantId={selectedVariantId} 
          isPurchasable={isPurchasable} 
          disabledReason={disabledReason}
        />
        
        <WishlistButton product={product} />
      </div>
    </div>
  );
}
