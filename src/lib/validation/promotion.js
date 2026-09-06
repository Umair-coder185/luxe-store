import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const promotionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().positive('Discount value must be positive'),
  targetType: z.enum(['PRODUCT', 'BRAND', 'CATEGORY', 'COLLECTION']),
  targetId: z.string().refine(val => isValidObjectId(val), {
    message: 'Invalid target ID format',
  }),
  startsAt: z.string().datetime().nullable().optional().or(z.date().nullable().optional()),
  endsAt: z.string().datetime().nullable().optional().or(z.date().nullable().optional()),
  isActive: z.boolean().default(false),
}).refine(data => {
  if (data.discountType === 'PERCENTAGE') {
    return data.discountValue > 0 && data.discountValue <= 100;
  }
  return true;
}, {
  message: 'Percentage discount must be between 0.01 and 100',
  path: ['discountValue'],
}).refine(data => {
  if (data.startsAt && data.endsAt) {
    return new Date(data.startsAt) < new Date(data.endsAt);
  }
  return true;
}, {
  message: 'End date must be strictly after start date',
  path: ['endsAt'],
});
