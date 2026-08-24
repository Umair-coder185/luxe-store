import Link from "next/link";
import Image from "next/image";

export default function WishlistItem({ item, onRemove }) {
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden">
        <Link href={`/products/${item.slug}`} className="block w-full h-full">
          {item.image?.url ? (
            <Image
              src={item.image.url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          )}
        </Link>
      </div>
      
      <div className="flex flex-col space-y-1">
        <Link href={`/products/${item.slug}`} className="text-sm font-medium text-neutral-900 hover:underline decoration-neutral-300 underline-offset-4">
          {item.name}
        </Link>
        <span className="text-sm text-neutral-900">
          {priceFormatter.format(item.price)}
        </span>
        <button
          onClick={onRemove}
          aria-label={`Remove ${item.name} from wishlist`}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4 text-left mt-1 w-fit"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
