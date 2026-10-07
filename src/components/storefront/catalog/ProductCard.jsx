import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, priority = false }) {
  const priceFormatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  });

  const isSoldOut = product.availability === "out-of-stock";
  
  // Use Promotion Pricing DTO if available and active
  const hasPromo = product.pricing?.hasPromotion;
  const currentPrice = hasPromo ? product.pricing.effectivePrice : product.price;
  const originalPrice = hasPromo ? product.pricing.basePrice : product.compareAtPrice;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  
  // Discount badge calculation
  let discountBadge = null;
  if (hasPromo) {
    if (product.pricing.promotion?.discountType === 'PERCENTAGE') {
      discountBadge = `-${product.pricing.promotion.discountValue}%`;
    } else {
      discountBadge = 'SALE'; // Restrained fixed amount badge
    }
  } else if (hasDiscount) {
    const calcPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    discountBadge = `-${calcPercent}%`;
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative aspect-square bg-neutral-50 mb-4 overflow-hidden flex items-center justify-center">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        
        {/* Badges container top right */}
        <div className="absolute top-3 right-3 flex flex-col items-end space-y-1">
          {discountBadge && (
            <div className="bg-black text-white px-2 py-0.5 text-xs font-bold tracking-wider rounded-sm">
              {discountBadge}
            </div>
          )}
          {product.isVip && (
            <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold tracking-wider rounded-sm">
              VIP
            </div>
          )}
        </div>

        {isSoldOut && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide text-neutral-900 shadow-sm">
            Sold Out
          </div>
        )}
      </Link>
      
      <div className="flex flex-col space-y-1">
        {product.brand && (
          <span className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight uppercase">
            {product.brand.name}
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="text-xs font-medium text-neutral-500 hover:text-neutral-900 truncate">
          {product.name}
        </Link>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span className={`${hasDiscount ? "text-red-600 font-bold" : "text-red-600 font-semibold"}`}>
            {priceFormatter.format(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-neutral-400 line-through text-xs">
              {priceFormatter.format(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
