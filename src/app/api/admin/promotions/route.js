import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { createPromotion } from '@/lib/mutations/admin/promotions';
import { promotionSchema } from '@/lib/validation/promotion';

export async function POST(request) {
  try {
    const { user, error: authError } = await requireAdmin(request);
    if (authError) return authError;
    
    const body = await request.json();
    const validatedData = promotionSchema.parse(body);
    
    const result = await createPromotion(validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Promotion POST Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
