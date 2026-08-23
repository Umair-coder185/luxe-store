import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid status',
  }),
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
}).strict();
