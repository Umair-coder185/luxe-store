"use client";

import useCartStore, { selectCartItems, selectCartCount, selectCartSubtotal, selectCartHasHydrated } from "@/stores/storefront/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmptyState from "./CartEmptyState";

export default function CartClientShell() {
  const isHydrated = useCartStore(selectCartHasHydrated);
  const items = useCartStore(selectCartItems);
  const itemCount = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-pulse">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-10">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="flex-1 space-y-8">
            <div className="h-32 bg-neutral-100 w-full rounded-sm"></div>
            <div className="h-32 bg-neutral-100 w-full rounded-sm"></div>
          </div>
          <div className="w-full lg:w-[380px] xl:w-[420px] h-64 bg-neutral-50 rounded-sm"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-10">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
        {/* Cart Items List */}
        <div className="flex-1">
          <ul className="flex flex-col">
            {items.map((item) => {
              const lineId = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
              return (
                <li key={lineId}>
                  <CartItem 
                    item={item} 
                    onUpdateQuantity={(quantity) => updateQuantity(lineId, quantity)}
                    onRemove={() => removeItem(lineId)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Cart Summary */}
        <div className="w-full lg:w-[380px] xl:w-[420px] lg:sticky lg:top-24 self-start">
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
        </div>
      </div>
    </div>
  );
}
