import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { updatePromotion, deletePromotion } from '@/lib/mutations/admin/promotions';
import { promotionSchema } from '@/lib/validation/promotion';

export async function PUT(request, { params }) {
  try {
    const { user, error: authError } = await requireAdmin(request);
    if (authError) return authError;
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = promotionSchema.parse(body);
    
    const result = await updatePromotion(id, validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Promotion PUT Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error: authError } = await requireAdmin(request);
    if (authError) return authError;
    const { id } = await params;
    
    const result = await deletePromotion(id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Promotion DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
