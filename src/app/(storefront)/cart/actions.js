'use server';

import { checkoutCartRequestSchema } from '@/lib/validation/checkout';
import { validateCheckoutCart } from '@/lib/queries/checkout/validateCheckoutCart';

export async function validateCartAction(cartPayload) {
  // Validate the incoming payload shape and ObjectIds
  const parsed = checkoutCartRequestSchema.safeParse(cartPayload);
  
  if (!parsed.success) {
    return {
      isValid: false,
      items: [],
      subtotal: 0,
      errors: [{ type: 'invalid_request', message: 'Invalid cart payload' }],
    };
  }

  // Pass safe DTO to the pure query layer
  try {
    const result = await validateCheckoutCart(parsed.data.items);
    return result;
  } catch (err) {
    console.error("Cart validation error:", err);
    return {
      isValid: false,
      items: [],
      subtotal: 0,
      errors: [{ type: 'server_error', message: 'An internal error occurred during cart validation' }],
    };
  }
}
