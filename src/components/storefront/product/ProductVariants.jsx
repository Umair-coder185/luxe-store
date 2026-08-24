export default function ProductVariants({ variants, selectedVariantId, onSelectVariant }) {
  const hasVariants = variants && variants.length > 0;
  
  if (!hasVariants) return null;

  const handleVariantClick = (id) => {
    if (onSelectVariant) {
      onSelectVariant(id);
    }
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
              aria-label={`${label}${isSoldOut ? ', Sold out' : ''}`}
              className={`
                px-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors
                ${isSelected 
                  ? "border-neutral-900 ring-1 ring-neutral-900" 
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                }
                ${isSoldOut ? "opacity-50 line-through decoration-neutral-400 cursor-not-allowed" : ""}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
      
      {isSelectedSoldOut && (
        <div className="mt-3 text-sm font-medium text-red-600" aria-live="polite">
          This option is currently sold out.
        </div>
      )}
    </div>
  );
}
