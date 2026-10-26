import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getBrandById } from '@/lib/queries/admin/brands';
import { updateBrand, deleteBrand } from '@/lib/mutations/admin/brands';
import { validateBrand } from '@/lib/validation/catalog';

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const brand = await getBrandById(id);
    if (!brand) return NextResponse.json({ success: false, error: 'Brand not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    if (body.slug && typeof body.slug === 'string') {
      body.slug = body.slug.trim().toLowerCase();
    }
    const validation = validateBrand(body);

    if (!validation.valid) {
      console.warn('[Admin Brands API - PUT Validation Failed]', validation.errors);
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const brand = await updateBrand(id, body);
    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    if (err.message === 'Brand not found') {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    await deleteBrand(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.message === 'Brand not found') {
      return NextResponse.json({ success: false, error: err.message }, { status: 404 });
    }
    if (err.message.includes('Cannot delete')) {
      return NextResponse.json({ success: false, error: err.message }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
