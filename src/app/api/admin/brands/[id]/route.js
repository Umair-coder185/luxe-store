import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { getBrandById } from '@/lib/queries/admin/brands';
import { updateBrand, deleteBrand } from '@/lib/mutations/admin/brands';
import { validateBrand } from '@/lib/validation/catalog';

export async function GET(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const brand = await getBrandById(params.id);
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
    const body = await request.json();
    const validation = validateBrand(body);

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const brand = await updateBrand(params.id, body);
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
    await deleteBrand(params.id);
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
