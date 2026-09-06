'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import useCartStore, { selectCartItems, selectCartHasHydrated } from '@/stores/storefront/cartStore';
import { validateCheckoutAction } from '@/app/(storefront)/checkout/actions';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

export default function CheckoutClientShell({ user }) {
  const isHydrated = useCartStore(selectCartHasHydrated);
  const items = useCartStore(selectCartItems);
  
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  
  // Track the previous payload string to avoid unnecessary re-validations
  const prevPayloadRef = useRef(null);

  useEffect(() => {
    if (!isHydrated) return;

    if (items.length === 0) {
      setIsValidating(false);
      return;
    }

    // Build minimal payload
    const payloadItems = items.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }));
    
    const payloadString = JSON.stringify(payloadItems);
    
    // Prevent validation loops by comparing with the previous stringified payload
    if (prevPayloadRef.current === payloadString) {
      return;
    }
    
    prevPayloadRef.current = payloadString;
    setIsValidating(true);

    validateCheckoutAction({ items: payloadItems }).then((result) => {
      setValidationResult(result);
      setIsValidating(false);
    }).catch((err) => {
      console.error(err);
      setValidationResult({
        isValid: false,
        errors: [{ type: 'network_error', message: 'Failed to validate cart.' }]
      });
      setIsValidating(false);
    });

  }, [isHydrated, items]);

  const handleCheckoutSubmit = (data) => {
    // Phase ends here. Payment is not implemented yet.
    console.log("Checkout data ready for payment:", data);
  };

  if (!isHydrated || isValidating) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 h-96 bg-neutral-200 rounded-sm"></div>
          <div className="w-full lg:w-[420px] h-96 bg-neutral-200 rounded-sm"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white shadow-sm rounded-sm border border-neutral-100">
        <h2 className="text-2xl font-light text-neutral-900 mb-4">Your cart is empty</h2>
        <p className="text-neutral-500 mb-8">You need items in your cart to proceed to checkout.</p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center bg-neutral-900 text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-neutral-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
      <div className="flex-1 w-full">
        {validationResult && !validationResult.isValid && (
          <div className="mb-8 p-6 bg-red-50 text-red-900 border border-red-100 rounded-sm">
            <h3 className="text-lg font-medium mb-4">Please review your cart</h3>
            <p className="text-sm mb-6">Some items in your cart are no longer available or have changed. Please return to your cart to update them.</p>
            <Link 
              href="/cart" 
              className="inline-flex items-center justify-center bg-red-900 text-white px-6 py-3 text-sm font-medium tracking-wide hover:bg-red-800 transition-colors"
            >
              Return to Cart
            </Link>
          </div>
        )}

        <div className={(!validationResult || !validationResult.isValid) ? "opacity-50 pointer-events-none" : ""}>
          <CheckoutForm 
            user={user} 
            onSubmit={handleCheckoutSubmit} 
            disabled={!validationResult || !validationResult.isValid}
          />
        </div>
      </div>
      
      <div className="w-full lg:w-[420px] flex-shrink-0">
        <OrderSummary validationResult={validationResult} />
      </div>
    </div>
  );
}
