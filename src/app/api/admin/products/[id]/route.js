import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getProduct } from '@/lib/queries/admin/products';
import { updateProduct, deleteProduct } from '@/lib/mutations/admin/products';
import { validateProductData } from '@/lib/validation/product';

export async function GET(request, { params }) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    const product = await getProduct(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('[Admin Products API - GET Item]', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { errors, payload } = validateProductData(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const product = await updateProduct(id, payload);
    return NextResponse.json(product);
  } catch (err) {
    console.error('[Admin Products API - PUT]', err);
    if (err.message === 'Product not found') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.message.includes('slug already exists') || err.message.includes('does not exist')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin Products API - DELETE]', err);
    if (err.message === 'Product not found') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err.message.includes('Cannot delete product')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
