import WishlistItem from "./WishlistItem";

export default function WishlistGrid({ items, onRemoveItem }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
      {items.map((item) => (
        <WishlistItem 
          key={item.productId} 
          item={item} 
          onRemove={() => onRemoveItem(item.productId)} 
        />
      ))}
    </div>
  );
}
