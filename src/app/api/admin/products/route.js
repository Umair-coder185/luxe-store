import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getProducts } from '@/lib/queries/admin/products';
import { createProduct } from '@/lib/mutations/admin/products';
import { validateProductData } from '@/lib/validation/product';

export async function GET(request) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const options = {
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      isActive: searchParams.get('isActive') ?? '',
    };

    const data = await getProducts(options);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Admin Products API - GET]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireAdmin(request);
    if (error) return error;

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

    const product = await createProduct(payload);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('[Admin Products API - POST]', err);
    if (err.message.includes('slug already exists') || err.message.includes('does not exist')) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
