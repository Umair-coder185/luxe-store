import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getOrders } from '@/lib/queries/admin/orders';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';

    const orders = await getOrders({ page, search, status, paymentStatus });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('API /admin/orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
