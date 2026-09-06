import Link from "next/link";
import Image from "next/image";
import QuantityControl from "./QuantityControl";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineSubtotal = item.price * item.quantity;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(item.price);

  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(lineSubtotal);

  // Derive variant label if present
  const variantParts = [];
  if (item.size) variantParts.push(`Size: ${item.size}`);
  if (item.color) variantParts.push(`Color: ${item.color}`);
  const variantLabel = variantParts.length > 0 ? variantParts.join(" | ") : null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 py-6 border-b border-neutral-100 last:border-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-24 h-32 sm:w-28 sm:h-36 relative bg-neutral-50 overflow-hidden">
        {item.image?.url ? (
          <Image
            src={item.image.url}
            alt={item.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 96px, 112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link 
                href={`/products/${item.slug}`}
                className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                {item.name}
              </Link>
              {variantLabel && (
                <p className="mt-1 text-sm text-neutral-500">{variantLabel}</p>
              )}
            </div>
            <p className="text-base font-medium text-neutral-900">{formattedSubtotal}</p>
          </div>
          
          <div className="mt-1 flex items-center space-x-2">
            <p className="text-sm text-neutral-900 font-medium">{formattedPrice} each</p>
            {item.hasPromotion && item.basePrice > item.price && (
              <p className="text-xs text-neutral-400 line-through">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.basePrice)}
              </p>
            )}
          </div>
          
          {item.hasPromotion && item.promotion?.name && (
            <p className="mt-0.5 text-xs text-green-700 font-medium uppercase tracking-wide">
              {item.promotion.discountType === 'PERCENTAGE' 
                ? `${item.promotion.discountValue}% OFF - ` 
                : 'SALE - '}
              {item.promotion.name}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <QuantityControl 
            quantity={item.quantity} 
            onIncrement={() => onUpdateQuantity(item.quantity + 1)}
            onDecrement={() => onUpdateQuantity(item.quantity - 1)}
          />
          
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.name} from cart`}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
