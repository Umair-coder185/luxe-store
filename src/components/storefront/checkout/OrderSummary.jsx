export default function OrderSummary({ validationResult }) {
  if (!validationResult) return null;

  const { items, subtotal } = validationResult;

  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal || 0);

  return (
    <div className="bg-neutral-50 p-6 sm:p-8 rounded-sm lg:sticky top-8 border border-neutral-100">
      <h2 className="text-xl font-medium text-neutral-900 mb-6">Order Summary</h2>
      
      <ul className="space-y-6 mb-8">
        {items.map((item) => {
          const key = `${item.productId}-${item.variantId || 'base'}`;
          const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(item.price);
          
          return (
            <li key={key} className="flex gap-4">
              <div className="w-20 h-24 bg-neutral-200 flex-shrink-0 relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No image</div>
                )}
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-4">
                  <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-neutral-900">{formattedPrice}</span>
                    {item.hasPromotion && item.basePrice > item.price && (
                      <span className="text-xs text-neutral-400 line-through mt-0.5">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.basePrice)}
                      </span>
                    )}
                  </div>
                </div>
                {(item.size || item.color) && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {[item.size, item.color].filter(Boolean).join(" / ")}
                  </p>
                )}
                {item.hasPromotion && item.promotion?.name && (
                  <p className="text-[10px] text-green-700 font-medium uppercase tracking-wide mt-1">
                    {item.promotion.discountType === 'PERCENTAGE' 
                      ? `${item.promotion.discountValue}% OFF - ` 
                      : 'SALE - '}
                    {item.promotion.name}
                  </p>
                )}
                {item.error && (
                  <p className="text-xs text-red-600 mt-2 font-medium">Issue: {item.error}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-neutral-200 pt-6 space-y-4">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Subtotal</span>
          <span>{formattedSubtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Shipping</span>
          <span>Calculated later</span>
        </div>
        <div className="flex justify-between text-base font-medium text-neutral-900 pt-4 border-t border-neutral-200">
          <span>Total</span>
          <span>{formattedSubtotal}</span>
        </div>
      </div>
    </div>
  );
}
