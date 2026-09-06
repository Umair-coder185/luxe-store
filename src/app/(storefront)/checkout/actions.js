'use server';

import { checkoutCartRequestSchema } from '@/lib/validation/checkout';
import { validateCheckoutCart } from '@/lib/queries/checkout/validateCheckoutCart';
import { requireAuthSC } from '@/lib/auth/guards';

export async function validateCheckoutAction(cartPayload) {
  // Enforce authentication at the Server Action boundary
  const { user, error } = await requireAuthSC();
  if (error || !user) {
    return {
      isValid: false,
      items: [],
      subtotal: 0,
      errors: [{ type: 'unauthenticated', message: 'You must be logged in to checkout' }],
    };
  }

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
    console.error("Checkout validation error:", err);
    return {
      isValid: false,
      items: [],
      subtotal: 0,
      errors: [{ type: 'server_error', message: 'An internal error occurred during checkout validation' }],
    };
  }
}
