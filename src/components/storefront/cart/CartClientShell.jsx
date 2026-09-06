"use client";

import { useEffect, useState } from "react";
import useCartStore, { selectCartItems, selectCartCount, selectCartSubtotal, selectCartHasHydrated } from "@/stores/storefront/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmptyState from "./CartEmptyState";
import { validateCartAction } from "@/app/(storefront)/cart/actions";

export default function CartClientShell() {
  const isHydrated = useCartStore(selectCartHasHydrated);
  const items = useCartStore(selectCartItems);
  const itemCount = useCartStore(selectCartCount);
  const rawSubtotal = useCartStore(selectCartSubtotal);
  
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [validatedCart, setValidatedCart] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Intent string to detect meaningful changes without causing infinite loops
  const intentString = JSON.stringify(items.map(i => ({ p: i.productId, v: i.variantId, q: i.quantity })));

  useEffect(() => {
    if (!isHydrated) return;
    if (items.length === 0) {
      setValidatedCart(null);
      return;
    }

    let isStale = false;
    
    const validate = async () => {
      setIsValidating(true);
      try {
        const payload = {
          items: items.map(i => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }))
        };
        const result = await validateCartAction(payload);
        if (!isStale) {
          setValidatedCart(result);
        }
      } catch (e) {
        console.error("Failed to validate cart:", e);
      } finally {
        if (!isStale) {
          setIsValidating(false);
        }
      }
    };

    validate();

    return () => { isStale = true; };
  }, [intentString, isHydrated, items]);

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

  const displaySubtotal = validatedCart ? validatedCart.subtotal : rawSubtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-10">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
        {/* Cart Items List */}
        <div className={`flex-1 transition-opacity duration-200 ${isValidating ? 'opacity-50' : 'opacity-100'}`}>
          <ul className="flex flex-col">
            {items.map((item) => {
              const lineId = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
              // Merge validated data over local intent
              const validatedItem = validatedCart?.items.find(
                vi => vi.productId === item.productId && vi.variantId === item.variantId
              );
              
              const displayItem = validatedItem ? { 
                ...item, 
                price: validatedItem.effectivePrice, 
                basePrice: validatedItem.basePrice,
                hasPromotion: validatedItem.hasPromotion,
                promotion: validatedItem.promotion,
                error: validatedItem.error 
              } : item;

              return (
                <li key={lineId}>
                  <CartItem 
                    item={displayItem} 
                    onUpdateQuantity={(quantity) => updateQuantity(lineId, quantity)}
                    onRemove={() => removeItem(lineId)}
                  />
                  {displayItem.error && (
                    <p className="text-sm text-red-600 mt-2">
                      {validatedCart?.errors.find(e => e.productId === displayItem.productId && e.variantId === displayItem.variantId)?.message || displayItem.error}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Cart Summary */}
        <div className="w-full lg:w-[380px] xl:w-[420px] lg:sticky lg:top-24 self-start">
          <CartSummary subtotal={displaySubtotal} itemCount={itemCount} isValidating={isValidating} />
        </div>
      </div>
    </div>
  );
}
