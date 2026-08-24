export default function ProductPrice({ price, compareAtPrice }) {
  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className="flex items-center space-x-3 text-lg mt-4">
      <span className={`font-medium ${hasDiscount ? "text-red-600" : "text-neutral-900"}`}>
        {priceFormatter.format(price)}
      </span>
      {hasDiscount && (
        <span className="text-neutral-500 line-through">
          {priceFormatter.format(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
