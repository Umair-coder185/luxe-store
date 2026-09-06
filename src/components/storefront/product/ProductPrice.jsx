export default function ProductPrice({ price, compareAtPrice, pricing }) {
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const hasPromo = pricing?.hasPromotion;
  const currentPrice = hasPromo ? pricing.effectivePrice : price;
  const originalPrice = hasPromo ? pricing.basePrice : compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  return (
    <div className="flex flex-col space-y-1 mt-4">
      <div className="flex items-center space-x-3 text-lg">
        <span className={`font-medium ${hasDiscount ? "text-neutral-900" : "text-neutral-900"}`}>
          {priceFormatter.format(currentPrice)}
        </span>
        {hasDiscount && (
          <span className="text-neutral-500 line-through text-sm">
            {priceFormatter.format(originalPrice)}
          </span>
        )}
      </div>
      {hasPromo && pricing.promotion?.name && (
        <div className="text-sm text-green-700 font-medium">
          {pricing.promotion.discountType === 'PERCENTAGE' 
            ? `${pricing.promotion.discountValue}% OFF - ` 
            : 'SALE - '}
          {pricing.promotion.name}
        </div>
      )}
    </div>
  );
}
