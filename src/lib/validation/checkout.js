import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const checkoutCartItemSchema = z.object({
  productId: objectIdSchema,
  variantId: z.union([objectIdSchema, z.null()]).optional().transform(v => v || null),
  quantity: z.number().int().positive().min(1),
}).strict();

export const checkoutCartRequestSchema = z.object({
  items: z.array(checkoutCartItemSchema).min(1, 'Cart cannot be empty'),
}).strict();
