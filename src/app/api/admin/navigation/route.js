import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { createNavigationItem } from '@/lib/mutations/admin/navigation';
import { navigationSchema } from '@/lib/validation/navigation';

export async function POST(request) {
  try {
    const { user, error: authError } = await requireAdmin(request);
    if (authError) return authError;
    
    const body = await request.json();
    const validatedData = navigationSchema.parse(body);
    
    const result = await createNavigationItem(validatedData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Navigation POST Error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
