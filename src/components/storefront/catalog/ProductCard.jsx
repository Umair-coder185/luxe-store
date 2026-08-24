import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, priority = false }) {
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const isSoldOut = product.availability === "out-of-stock";

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
        {product.image?.url ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        
        {isSoldOut && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide text-neutral-900">
            Sold Out
          </div>
        )}
      </Link>
      
      <div className="flex flex-col space-y-1">
        {product.brand && (
          <span className="text-xs text-neutral-500 tracking-wider uppercase">
            {product.brand.name}
          </span>
        )}
        <Link href={`/products/${product.slug}`} className="text-sm font-medium text-neutral-900 hover:underline decoration-neutral-300 underline-offset-4">
          {product.name}
        </Link>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span className={`${product.compareAtPrice && product.compareAtPrice > product.price ? "text-red-600" : "text-neutral-900"}`}>
            {priceFormatter.format(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-neutral-500 line-through">
              {priceFormatter.format(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
