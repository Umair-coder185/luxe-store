"use client";

import { useState } from "react";

export default function ProductVariants({ variants }) {
  // Derive options based on the variants array
  const hasVariants = variants && variants.length > 0;
  
  const [selectedVariantId, setSelectedVariantId] = useState(
    hasVariants ? variants.find(v => v.stock > 0)?.id || null : null
  );

  if (!hasVariants) return null;

  const handleVariantClick = (id) => {
    setSelectedVariantId(id);
  };

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const isSelectedSoldOut = selectedVariant ? selectedVariant.stock <= 0 : false;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-neutral-900">Options</h3>
        {selectedVariant && (
          <span className="text-sm text-neutral-500">
            {selectedVariant.sku && `SKU: ${selectedVariant.sku}`}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isSoldOut = variant.stock <= 0;

          // A simple label combining whatever attributes exist. (e.g. Size M, Color Black).
          // Assuming variants have size and color as fields.
          const labelParts = [];
          if (variant.size) labelParts.push(variant.size);
          if (variant.color) labelParts.push(variant.color);
          const label = labelParts.length > 0 ? labelParts.join(" / ") : variant.sku || "Option";

          return (
            <button
              key={variant.id}
              onClick={() => !isSoldOut && handleVariantClick(variant.id)}
              disabled={isSoldOut}
              aria-pressed={isSelected}
              className={`
                px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors
                ${isSelected 
                  ? "border-neutral-900 ring-1 ring-neutral-900" 
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                }
                ${isSoldOut ? "opacity-50 line-through decoration-neutral-400" : ""}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
      
      {isSelectedSoldOut && (
        <div className="mt-3 text-sm font-medium text-red-600">
          This option is currently sold out.
        </div>
      )}
    </div>
  );
}
