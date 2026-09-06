import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { updateNavigationItem, deleteNavigationItem } from '@/lib/mutations/admin/navigation';
import { navigationSchema } from '@/lib/validation/navigation';

export async function PUT(request, { params }) {
  try {
    const { user, error: authError } = await requireAdmin(request);
    if (authError) return authError;
    const { id } = await params;
    
    const body = await request.json();
    const validatedData = navigationSchema.parse(body);
    
    const result = await updateNavigationItem(id, validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Navigation PUT Error:', error);
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
    
    const result = await deleteNavigationItem(id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Navigation DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
