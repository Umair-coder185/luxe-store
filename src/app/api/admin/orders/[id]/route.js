import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getOrderById } from '@/lib/queries/admin/orders';
import { updateOrderStatus } from '@/lib/mutations/admin/orders';
import { updateOrderStatusSchema } from '@/lib/validation/order';

export async function GET(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const resolvedParams = await params;
    const order = await getOrderById(resolvedParams.id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('API /admin/orders/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateOrderStatusSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, note } = validatedData.data;

    // Mutate
    const resolvedParams = await params;
    const result = await updateOrderStatus(resolvedParams.id, { status, note });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.order);
  } catch (error) {
    console.error('API /admin/orders/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
